const cron = require('node-cron');
const db = require('./db');

const RDEzugi = require('./vender/ezugi');
const RDCQ9 = require('./vender/cq9');
const RDHLink = require('./vender/honorlink');
const RDVivo = require('./vender/vivo');

const ODDS = require('./helpers/odds');

const Processor = require('./processor');

const {Op}= require('sequelize');

const moment = require('moment');


let lProcessID = -1;

let GetEachDB = (listDB, listHL, listCQ9, listEzugi, listEtc) => {

    for ( let i in listDB )
    {
        const cDB = listDB[i];

        if ( cDB.strVender == 'EZUGI' && cDB.iGameCode == 0 && cDB.eType == 'BETWIN' && (cDB.strTableID == '101' || cDB.strTableID == '100' || cDB.strTableID == '102') )
        {
            listEzugi.push(cDB);
        }
        else if ( cDB.strVender =='CQ9' && cDB.eType == 'BETWIN' )
        {
            listCQ9.push(cDB);
        }
        else if ( cDB.strVender =='HONORLINK' && cDB.eType == 'BETWIN' && cDB.strGameID == 'evolution' && cDB.iGameCode == 0 )
        {
            listHL.push(cDB);
        }
        else
        {
            listEtc.push(cDB);
        }
    }
}

//cron.schedule('*/5 * * * * * ', async ()=> {
//cron.schedule('*/1 * * * * ', async ()=> {
    cron.schedule('* * * * * * ', async ()=> {
//cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

    console.log(`##### CRON`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }

    console.log(`1`)
    lProcessID = 1;

    console.log(`1`)
    let listUpdateDB = [];
    
    const cMinuteBefore = 1;

    console.log(`1`)
    let listDB = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:{[Op.or]:['BET', 'WIN', 'BETWIN']},
            createdAt:{
                [Op.lte]:moment().subtract(cMinuteBefore, "minutes").toDate(),
            }
        },
        order: [['createdAt', 'ASC']]
    });
    console.log(`1`)
    let listHLDB = [];
    let listCQ9DB = [];
    let listEzugiDB = [];
    let listEtc = [];

    console.log(`5`)
    GetEachDB(listDB, listHLDB, listCQ9DB, listEzugiDB, listEtc);

    console.log(`6`)
    await Processor.ProcessHLink(listHLDB, listUpdateDB);
    await Processor.ProcessCQ9(listCQ9DB, listUpdateDB);
    await Processor.ProcessEzugi(listEzugiDB, listUpdateDB);

    console.log(`7`)

    //  ##### UPDATE RECORD-BETS
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    
    for ( let i in listUpdateDB )
    {
        console.log(`##### listDBUpdate : ${i} db.id : ${listUpdateDB[i].id}`);

        const cData = listUpdateDB[i];
        await db.RecordBets.update({strDetail:cData.strDetail, strResult:cData.strResult, eType:'ROLLING'}, {where:{id:cData.id}});
    }

    console.log(`DBLength : ${listDB.length}, UpdateDBLength : ${listUpdateDB.length}`);
    
    lProcessID = -1;
    
    console.log(`##### END OF CRON`);
});