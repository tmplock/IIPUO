const express = require('express');
const app = express();
const server = require('http').Server(app);
require("dotenv").config();
//const cron = require('./cron');

const cPort = 3050;
server.listen(cPort, () => {
    console.log(`ICRDBuilder Server is started At ${cPort}`);
});

const cron = require('node-cron');
const db = require('./db');

const Processor = require('./processor');

const {Op}= require('sequelize');

const moment = require('moment');


let lProcessID = -1;

let GetEachDB = (listDB, listHL, listCQ9, listEzugi, listEtc) => {

    for ( let i in listDB )
    {
        const cDB = listDB[i];

        // if ( cDB.strVender == 'EZUGI' && cDB.iGameCode == 0 && cDB.eType == 'BETWIN' && (cDB.strTableID == '101' || cDB.strTableID == '100' || cDB.strTableID == '102') )
        // {
        //     listEzugi.push(cDB);
        // }
        // else if ( cDB.strVender =='CQ9' && cDB.eType == 'BETWIN' )
        if ( cDB.strVender =='CQ9' && cDB.eType == 'BETWIN' )
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
cron.schedule('*/1 * * * * ', async ()=> {
//cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

    console.log(`##### CRON`);
    console.log(lProcessID);
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let listUpdateDB = [];
    
    //const cMinuteBefore = 15;
    const cMinuteBefore = 1;

    let listDB = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:{[Op.or]:['BET', 'WIN', 'BETWIN']},
            createdAt:{
                [Op.lte]:moment().subtract(cMinuteBefore, "minutes").toDate(),
            }
        },
        order: [['createdAt', 'ASC']],
        limit:100,
    });
    let listHLDB = [];
    let listCQ9DB = [];
    let listEzugiDB = [];
    let listEtc = [];

    GetEachDB(listDB, listHLDB, listCQ9DB, listEzugiDB, listEtc);

    await Processor.ProcessHLink(listHLDB, listUpdateDB);
    await Processor.ProcessCQ9(listCQ9DB, listUpdateDB);
    //await Processor.ProcessEzugi(listEzugiDB, listUpdateDB);
    await Processor.ProcessEtc(listEtc, listUpdateDB);


    //  ##### UPDATE RECORD-BETS
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    
    for ( let i in listUpdateDB )
    {
        console.log(`##### listDBUpdate : ${i} db.id : ${listUpdateDB[i].id}`);

        const cData = listUpdateDB[i];
        if ( cData.strResult != '' && cData.strDetail != '' )
            await db.RecordBets.update({strDetail:cData.strDetail, strResult:cData.strResult, eState:'ROLLING'}, {where:{id:cData.id}});
        else
            await db.RecordBets.update({eState:'ROLLING'}, {where:{id:cData.id}});
    }

    console.log(`DBLength : ${listDB.length}, UpdateDBLength : ${listUpdateDB.length}`);
    
    lProcessID = -1;
    
    console.log(`##### END OF CRON`);
});