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

cron.schedule('*/5 * * * * * ', async ()=> {
//cron.schedule('*/1 * * * * ', async ()=> {
//cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

    console.log(`##### CRON`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let listUpdateDB = [];

    let listBetDB = await db.RecordBets.findAll({
        where: {
            eState: 'COMPLETE',
            //eType:{[Op.or]:['BET', 'WIN']},
            eType:'BETWIN',
            iGameCode:0,
            strGameID:'evolution',
            strVender:'HONORLINK',
            createdAt:{
                [Op.between]:[ moment().subtract(2, "minutes").toDate(), moment().subtract(1, "minutes").toDate()],
            }
        },
        // order: [['createdAt', 'ASC']]
    });
    console.log(`##### listBetDB.length = ${listBetDB.length}`);

    //  ##### HonorLink
    await Processor.ProcessHLink(listBetDB, listUpdateDB);

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