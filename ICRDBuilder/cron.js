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

//cron.schedule('*/5 * * * * * ', async ()=> {
cron.schedule('*/1 * * * * ', async ()=> {
//cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

    console.log(`##### CRON`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let listUpdateDB = [];

    let listHLDB = await db.RecordBets.findAll({
        where: {
            eState: 'COMPLETE',
            //eType:{[Op.or]:['BET', 'WIN']},
            eType:'BETWIN',
            iGameCode:0,
            strGameID:'evolution',
            strVender:'HONORLINK',
            createdAt:{
                [Op.between]:[ moment().subtract(4, "minutes").toDate(), moment().subtract(3, "minutes").toDate()],
            }
        },
        // order: [['createdAt', 'ASC']]
    });
    console.log(`##### listHLDB.length = ${listHLDB.length}`);

    //  ##### HonorLink
    await Processor.ProcessHLink(listHLDB, listUpdateDB);

    //  CQ9
    let listCQ9DB = await db.RecordBets.findAll({
        where: {
            eState: 'COMPLETE',
            eType:'BETWIN',
            iGameCode:0,
            strVender:'CQ9',
            createdAt:{
                [Op.between]:[ moment().subtract(4, "minutes").toDate(), moment().subtract(3, "minutes").toDate()],
            }
        },
        order: [['createdAt', 'ASC']]
    });
    console.log(`##### listCQ9DB.length = ${listCQ9DB.length}`);

    await Processor.ProcessCQ9(listCQ9DB, listUpdateDB);


    //  ##### UPDATE RECORD-BETS
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    for ( let i in listUpdateDB )
    {
        console.log(`##### listDBUpdate : ${i} db.id : ${listUpdateDB[i].id}`);

        const cData = listUpdateDB[i];

        console.log(cData);

        if ( cData.strDetail != '' && cData.strResult != '' )
            await db.RecordBets.update({strDetail:cData.strDetail, strResult:cData.strResult}, {where:{id:cData.id}});
    }
    
    lProcessID = -1;
    
    console.log(`##### END OF CRON`);
});