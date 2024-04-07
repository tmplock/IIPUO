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


let GetDBListFromVender = (listDB, strVender) => {

    console.log(`##### DBListFromVender listDB.length : ${listDB.length}`);
    let list = [];
    for ( let i in listDB )
    {
        if ( listDB[i].strVender == strVender && listDB[i].eType == 'RD' )
        {
            list.push(listDB[i]);
        }
    }
    return list;
}

let GetDBListFromType = (listDB, eType) => {

    let list = [];
    for ( let i in listDB )
    {
        if ( listDB[i].eType == 'RD' || listDB[i].eType == 'BETRD' )
            continue;

        if ( eType == 'WIN' && listDB[i].eType == 'WIN' && listDB[i].strOverview != '' )
            list.push(listDB[i]);
        else if ( eType == 'BETWIN' && listDB[i].eType == 'WIN' && listDB[i].strOverview == '' )
            list.push(listDB[i]);
        else if ( listDB[i].eType == eType )
            list.push(listDB[i]);
    }
    return list;
}

let lProcessID = -1;

cron.schedule('*/10 * * * * * ', async ()=> {
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
            eType:{[Op.or]:['BETWIN']},
            iGameCode:0,
            strGameID:'evolution',
            strVender:'HONORLINK',
            createdAt:{
                [Op.between]:[ moment().subtract(5, "minutes").toDate(), moment().subtract(6, "minutes").toDate()],
            }
        },
        order: [['createdAt', 'ASC']]
    });
    console.log(`##### listBetDB.length = ${listBetDB.length}`);

    // //  EZUGI TEST
    // let listEzugiBet = await db.RecordBets.findAll({
    //     where: {
    //         eState: 'COMPLETE',
    //         //eType:{[Op.or]:['BET', 'WIN']},
    //         eType:{[Op.or]:['RD']},
    //         strVender:{[Op.not]:'EZUGI'},
    //         createdAt:{
    //             [Op.between]:[ moment().subtract(5, "minutes").toDate(), moment().subtract(6, "minutes").toDate()],
    //         }
    //     },
    //     order: [['createdAt', 'ASC']]
    // });
    // console.log(`##### listEzugiBet.length = ${listEzugiBet.length}`);
    // //

    // if ( listBetDB.length > 0 )
    // {
    //     for ( let i in listBetDB )
    //     {
    //         console.log(`${i} : ${listBetDB[i].createdAt}`);
    //     }
    // }

    //  ##### HonorLink
    await Processor.ProcessHLink(listHL, listUpdateDB);

    //  ##### UPDATE RECORD-BETS
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    for ( let i in listUpdateDB )
    {
        console.log(`##### listDBUpdate : ${i} db.id : ${listUpdateDB[i].id}`);

        const cData = listUpdateDB[i];

        console.log(cData);

        // if ( cData.strDetail != '' && cData.strResult != '' )
        //     await db.RecordBets.update({strDetail:cData.strDetail, strResult:cData.strResult}, {where:{id:cData.id}});
    }
    
    lProcessID = -1;
    
    console.log(`##### END OF CRON`);
});