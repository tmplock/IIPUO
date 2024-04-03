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
        if ( listDB[i].strVender == strVender )
        {
            list.push(listDB[i]);
        }
    }
    return list;
}

let GetBaseTime = (iSecondOffset) => {

    console.log(`1`);
    let time = new Date();
    console.log(`1`);
    time.setHours(time.getHours()-9);
    console.log(`1`);
    time.setSeconds(time.getSeconds()+iSecondOffset);
    console.log(`1`);

    const date = moment(time).format('YYYY-MM-DD HH:mm:ss');
    return date;
}


let GetDBListFromType = (listDB, eType) => {

    let list = [];
    for ( let i in listDB )
    {
        if ( listDB[i].eType == eType )
            list.push(listDB[i]);
    }
    return list;
}

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
    let listOverview = [];

    console.log(`1`);
    let dateBase = GetBaseTime(-120);
    let dateBefore = GetBaseTime(-3600);

    console.log(`##### dateBase :${dateBase}`);

    let listBetDB = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:{[Op.or]:['RD', 'CANCEL', 'CANCEL_BET', 'CANCEL_WIN', 'BET', 'WIN']},
            createdAt:{
                [Op.lte]:moment().subtract(2, "minutes").toDate(),
            }
        },
        order: [['createdAt', 'ASC']]
    });
    console.log(`##### listBetDB.length = ${listBetDB.length}`);

    let listOdds = await ODDS.FullCalculteOdds(listBetDB);

    //  ##### VIVO
    const listVivoDB = GetDBListFromVender(listBetDB, 'VIVO');
    console.log(`##### VIVO : Length : ${listVivoDB.length}`);
    Processor.ProcessVivo(listVivoDB, listOverview, listOdds, listUpdateDB);

    //  ##### EZUGI
    const listEzugiDB = GetDBListFromVender(listBetDB, 'EZUGI');
    console.log(`##### EZUGI : Length : ${listEzugiDB.length}`);
    await Processor.ProcessEzugi(listEzugiDB, listOverview, listOdds, listUpdateDB);

    //  ##### CQ9
    const listCQ9DB = GetDBListFromVender(listBetDB, 'CQ9');
    console.log(`##### CQ9 : Length : ${listCQ9DB.length}`);
    await Processor.ProcessCQ9(listCQ9DB, listOverview, listOdds, listUpdateDB);

    //  ##### HonorLink
    const listHL = GetDBListFromVender(listBetDB, 'HONORLINK');
    console.log(`##### HONORLINK : Length : ${listHL.length}`);
    await Processor.ProcessHLink(listHL, listOverview, listOdds, listUpdateDB);

    //  ##### Bet
    const listBet = GetDBListFromType(listBetDB, 'BET');
    console.log(`##### BET : Length : ${listBet.length}`);
    Processor.ProcessBet(listBet, listOverview, listOdds, listUpdateDB);

    //  ##### Win
    const listWin = GetDBListFromType(listBetDB, 'WIN');
    console.log(`##### WIN : Length : ${listWin.length}`);
    Processor.ProcessWin(listWin, listOverview, listOdds, listUpdateDB);

    //  ##### CANCEL
    const listCancelAll = GetDBListFromType(listBetDB, 'CANCEL');
    console.log(`##### CANCEL : Length : ${listCancelAll.length}`);
    Processor.ProcessCancel('ALL', listCancelAll, listOverview, listOdds, listUpdateDB);

    //  ##### CANCEL
    const listCancelBet = GetDBListFromType(listBetDB, 'CANCEL_BET');
    console.log(`##### CANCEL_BET : Length : ${listCancelBet.length}`);
    Processor.ProcessCancel('BET', listCancelBet, listOverview, listOdds, listUpdateDB);

    //  ##### CANCEL
    const listCancelWin = GetDBListFromType(listBetDB, 'CANCEL_WIN');
    console.log(`##### CANCEL : Length : ${listCancelWin.length}`);
    Processor.ProcessCancel('WIN', listCancelWin, listOverview, listOdds, listUpdateDB);

    //  ##### OVERVIEW
    console.log(`##### UPDATE OVERVIEW : Length : ${listOverview.length}`);
    await ODDS.UpdateOverview(listOverview);

    //  ##### UPDATE BET
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    for ( let i in listUpdateDB )
    {
        const cData = listUpdateDB[i];

        if ( cData.eType == 'BETRD' && cData.eState == 'STANDBY' )
            continue;
        else if ( cData.eType == 'RD' && cData.eState == 'STANDBY' )
            continue;
        else if ( cData.eType == 'BET' && cData.eState == 'PENDING' )
        {
            await db.RecordBets.update({eType:'BET', eState:'STANDBY'}, {where:{id:cData.id}});
        }
        else
        {
            if ( cData.strDetail != '' && cData.strResult != '' && cData.strOverview != '' )
                await db.RecordBets.update({eState:'COMPLETE', strDetail:cData.strDetail, strResult:cData.strResult, strOverview:cData.strOverview}, {where:{id:cData.id}});
            else if ( cData.strOverview != '' )
                await db.RecordBets.update({eState:'COMPLETE', strOverview:cData.strOverview}, {where:{id:cData.id}});
            else
                await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:cData.id}});
        }
    }
    
    lProcessID = -1;
    
    console.log(`##### END OF CRON`);
});