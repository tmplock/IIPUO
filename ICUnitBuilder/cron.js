const cron = require('node-cron');
const db = require('./db');

const RDEzugi = require('./vender/ezugi');
const RDCQ9 = require('./vender/cq9');
const RDHLink = require('./vender/honorlink');
const RDVivo = require('./vender/vivo');

const ODDS = require('./helpers/odds');

const Overview = require('./helpers/overview');

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

let GetDBListFromType = (listDB, eType) => {

    let list = [];
    for ( let i in listDB )
    {
        if ( eType == 'WIN' && listDB[i].strOverview != '' )
            list.push(listDB[i]);
        else if ( eType == 'BETWIN' && listDB[i].strOverview == '' )
            list.push(listDB[i]);
        else if ( listDB[i].eType == eType )
            list.push(listDB[i]);
    }
    return list;
}

let lProcessID = -1;

// //cron.schedule('*/5 * * * * * ', async ()=> {
//  cron.schedule('*/5 * * * * * ', async ()=> {
// //cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

//     console.log(`##### CRON`);
    
//     if (lProcessID != -1)
//     {
//         console.log(`##### CRON IS PROCESSING`);
//         return;
//     }
//     lProcessID = 1;

//     let listUpdateDB = [];
//     let listOverview = [];

//     let listBetDB = await db.RecordBets.findAll({
//         where: {
//             id:{[Op.or]:[1027]},
//             strVender:'EZUGI',
//             // eState: 'STANDBY',
//             // //eType:{[Op.or]:['RD', 'CANCEL', 'CANCEL_BET', 'CANCEL_WIN', 'BET', 'WIN']},
//             // eType:{[Op.or]:['RD']},
//             // strVender:'EZUGI',
//             // createdAt:{
//             //     [Op.lte]:moment().subtract(5, "minutes").toDate(),
//             // }
//         },
//         order: [['createdAt', 'ASC']]
//     });
//     console.log(`##### listBetDB.length = ${listBetDB.length}`);

    

//     // const test = await ODDS.CalculateOdds('god1047', 5);
//     // console.log(`#####################################################`);
//     // console.log(test);

//     let listOdds = await ODDS.FullCalculteOdds(listBetDB);

//     // //  ##### VIVO
//     // const listVivoDB = GetDBListFromVender(listBetDB, 'VIVO');
//     // console.log(`##### VIVO : Length : ${listVivoDB.length}`);
//     // Processor.ProcessVivo(listVivoDB, listOverview, listOdds, listUpdateDB);

//     // // //  ##### EZUGI
//     const listEzugiDB = GetDBListFromVender(listBetDB, 'EZUGI');
//     console.log(`##### EZUGI : Length : ${listEzugiDB.length}`);
//     await Processor.ProcessEzugi(listEzugiDB, listOverview, listOdds, listUpdateDB);

//     // //  ##### CQ9
//     // const listCQ9DB = GetDBListFromVender(listBetDB, 'CQ9');
//     // console.log(`##### CQ9 : Length : ${listCQ9DB.length}`);
//     // await Processor.ProcessCQ9(listCQ9DB, listOverview, listOdds, listUpdateDB);

//     // //  ##### HonorLink
//     // const listHL = GetDBListFromVender(listBetDB, 'HONORLINK');
//     // console.log(`##### HONORLINK : Length : ${listHL.length}`);
//     // await Processor.ProcessHLink(listHL, listOverview, listOdds, listUpdateDB);

//     //  ##### Bet
//     // const listBet = GetDBListFromType(listBetDB, 'WIN');
//     // console.log(`##### BET : Length : ${listBet.length}`);
//     // Processor.ProcessBet(listBet, listOverview, listOdds, listUpdateDB);

//     // //  ##### Win
//     // const listWin = GetDBListFromType(listBetDB, 'WIN');
//     // console.log(`##### WIN : Length : ${listWin.length}`);
//     // Processor.ProcessWin(listWin, listOverview, listOdds, listUpdateDB);

//     // const listBetWin = GetDBListFromType(listBetDB, 'BETWIN');
//     // console.log(`##### BETWIN : Length : ${listBetWin.length}`);
//     // Processor.ProcessBetWin(listBetWin, listOverview, listOdds, listUpdateDB);


//     // //  ##### CANCEL
//     // const listCancelAll = GetDBListFromType(listBetDB, 'CANCEL');
//     // console.log(`##### CANCEL : Length : ${listCancelAll.length}`);
//     // Processor.ProcessCancel('ALL', listCancelAll, listOverview, listOdds, listUpdateDB);

//     // //  ##### CANCEL
//     // const listCancelBet = GetDBListFromType(listBetDB, 'CANCEL_BET');
//     // console.log(`##### CANCEL_BET : Length : ${listCancelBet.length}`);
//     // Processor.ProcessCancel('BET', listCancelBet, listOverview, listOdds, listUpdateDB);

//     // //  ##### CANCEL
//     // const listCancelWin = GetDBListFromType(listBetDB, 'CANCEL_WIN');
//     // console.log(`##### CANCEL : Length : ${listCancelWin.length}`);
//     // Processor.ProcessCancel('WIN', listCancelWin, listOverview, listOdds, listUpdateDB);

//     // //  ##### OVERVIEW
//     // console.log(`##### UPDATE OVERVIEW : Length : ${listOverview.length}`);
//     // //console.log(listOverview);
//     // await ODDS.UpdateOverview(listOverview);

//     // //  ##### UPDATE BET
//     // console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
//     for ( let i in listUpdateDB )
//     {
//         const cData = listUpdateDB[i];

//         // if ( cData.eType == 'BETRD' && cData.eState == 'STANDBY' )
//         //     continue;
//         // else if ( cData.eType == 'RD' && cData.eState == 'STANDBY' )
//         //     continue;
//         // else if ( cData.eType == 'BET' && cData.eState == 'PENDING' )
//         // {
//         //     await db.RecordBets.update({eType:'BET', eState:'STANDBY'}, {where:{id:cData.id}});
//         // }
//         // else
//         {
//             if ( cData.strDetail != '' && cData.strResult != '' && cData.strOverview != '' )
//                 await db.RecordBets.update({strDetail:cData.strDetail, strResult:cData.strResult}, {where:{id:cData.id}});
//             // else if ( cData.strOverview != '' )
//             //     await db.RecordBets.update({eState:'COMPLETE', strOverview:cData.strOverview}, {where:{id:cData.id}});
//             // else
//             //     await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:cData.id}});
//         }
//     }
    
//     lProcessID = -1;
    
//     console.log(`##### END OF CRON`);
// });

//  ##### Calculate Overview
//  Calcualte

let CalculateRollingAmount = (strID, cAmount, fMine, fChild) => {

    if ( strID == '' )
        return 0;

    const fOdds = parseFloat(Number(fMine - fChild).toFixed(1));
    console.log(`CalculateRollingAmount : ${fOdds}, fMine : ${fMine}, fChild : ${fChild}`);

    if ( fOdds > 0 )
    {
        const c = parseInt(cAmount) * fOdds * 0.01;
        return c;
    }
    return 0;
}

let testfunc = (o, strID, iBetB, iBetUO, iBetS, iWinB, iWinUO, iWinS) => {

    let objectData = {
        strID:strID,

        iPAdminRB:0,
        iVAdminRB:0,
        iAgentRB:0,
        iShopRB:0,
        iUserRB:0,

        iPAdminRUO:0,
        iVAdminRUO:0,
        iAgentRUO:0,
        iShopRUO:0,
        iUserRUO:0,

        iPAdminRS:0,
        iVAdminRS:0,
        iAgentRS:0,
        iShopRS:0,
        iUserRS:0,

        iPAdminRPBA:0,
        iVAdminRPBA:0,
        iAgentRPBA:0,
        iShopRPBA:0,
        iUserRPBA:0,

        iPAdminRPBB:0,
        iVAdminRPBB:0,
        iAgentRPBB:0,
        iShopRPBB:0,
        iUserRPBB:0,

        iBetB:0,
        iBetUO:0,
        iBetS:0,
        iBetPB:0,

        iWinB:0,
        iWinUO:0,
        iWinS:0,
        iWinPB:0,

        iWinLoseB:0,
        iWinLoseUO:0,
        iWinLoseS:0,
        iWinLosePB:0,
    }

    objectData.iPAdminRUO += CalculateRollingAmount(o.strPAdminID, iBetUO, o.fPAdminUnderOverR, o.fVAdminUnderOverR);
    objectData.iVAdminRUO += CalculateRollingAmount(o.strVAdminID, iBetUO, o.fVAdminUnderOverR, o.fAgentUnderOverR);
    objectData.iAgentRUO += CalculateRollingAmount(o.strAgentID, iBetUO, o.fAgentUnderOverR, o.fShopUnderOverR);
    objectData.iShopRUO += CalculateRollingAmount(o.strShopID, iBetUO, o.fShopUnderOverR, o.fUserUnderOverR);
    objectData.iUserRUO += CalculateRollingAmount(o.strUserID, iBetUO, o.fUserUnderOverR, 0);

    objectData.iBetUO += iBetUO;

    objectData.iPAdminRS += CalculateRollingAmount(o.strPAdminID, iBetS, o.fPAdminSlotR, o.fVAdminSlotR);
    objectData.iVAdminRS += CalculateRollingAmount(o.strVAdminID, iBetS, o.fVAdminSlotR, o.fAgentSlotR);
    objectData.iAgentRS += CalculateRollingAmount(o.strAgentID, iBetS, o.fAgentSlotR, o.fShopSlotR);
    objectData.iShopRS += CalculateRollingAmount(o.strShopID, iBetS, o.fShopSlotR, o.fUserSlotR);
    objectData.iUserRS += CalculateRollingAmount(o.strUserID, iBetS, o.fUserSlotR, 0);

    objectData.iBetS += iBetS;

    objectData.iPAdminRB += CalculateRollingAmount(o.strPAdminID, iBetB, o.fPAdminBaccaratR, o.fVAdminBaccaratR);
    objectData.iVAdminRB += CalculateRollingAmount(o.strVAdminID, iBetB, o.fVAdminBaccaratR, o.fAgentBaccaratR);
    objectData.iAgentRB += CalculateRollingAmount(o.strAgentID, iBetB, o.fAgentBaccaratR, o.fShopBaccaratR);
    objectData.iShopRB += CalculateRollingAmount(o.strShopID, iBetB, o.fShopBaccaratR, o.fUserBaccaratR);
    objectData.iUserRB += CalculateRollingAmount(o.strUserID, iBetB, o.fUserBaccaratR, 0);

    objectData.iBetB += iBetB;


    objectData.iWinB += iWinB;
    objectData.iWinUO += iWinUO;
    objectData.iWinS += iWinS;

    return objectData;
}


//cron.schedule('*/5 * * * * * ', async ()=> {
    cron.schedule('*/5 * * * * * ', async ()=> {
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



            let listID = [
                {strID:'qa123', iClass:7},
                {strID:'jojo05', iClass:8},
                {strID:'cjsgh1', iClass:7},
                {strID:'kkk123', iClass:8},
                {strID:'qwe01', iClass:8},
                {strID:'zxc01', iClass:8},
                {strID:'t1000', iClass:7},                
                {strID:'gkfn1', iClass:8},
                {strID:'gkfn2', iClass:8},
                {strID:'zlekfl5', iClass:8},
                {strID:'gkfn3', iClass:8},
                {strID:'sss1000', iClass:6},
                {strID:'tpdud123', iClass:8},
                {strID:'gkfn6', iClass:8},
            ];
            // let listID = [
            //     {strID:'jojo05', iClass:8},
            // ];

            let strDate = '2024-04-05';

            for ( let i in listID )
            {
                await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
            }

            for ( let i in listOverview )
            {
                if ( listOverview[i].strID == 'jojo05' )
                {
                console.log(listOverview[i]);
                }
            }

            // for ( let i in listOverview )
            // {
            //     await db.RecordDailyOverviews.update({
            //         iBetB:listOverview.iBetB,
            //         iBetUO:listOverview.iBetUO,
            //         iBetS:listOverview.iBetS,
            //         iBetPB:listOverview.iBetPB,
            //         iWinB:listOverview.iWinB,
            //         iWinUO:listOverview.iWinUO,
            //         iWinS:listOverview.iWinS,
            //         iWinPB:listOverview.iWinPB,
            //         iRollingB:listOverview.iRollingB,
            //         iRollingUO:listOverview.iAgentBetUO,
            //         iRollingS:listOverview.iRollingS,
            //         iRollingPBA:listOverview.iRollingPBA,
            //         iRollingPBB:listOverview.iRollingPBB,
            //         iAgentBetB:listOverview.iAgentBetB,
            //         iAgentBetUO:listOverview.iAgentBetUO,
            //         iAgentBetS:listOverview.iAgentWinS,
            //         iAgentBetPB:listOverview.iAgentWinPB,
            //         iAgentWinB:listOverview.iAgentWinB,
            //         iAgentWinUO:listOverview.iAgentWinUO,
            //         iAgentWinS:listOverview.iAgentWinS,
            //         iAgentWinPB:listOverview.iAgentWinPB,
            //         iAgentRollingB:listOverview.iAgentRollingB,
            //         iAgentRollingUO:listOverview.iAgentRollingUO,
            //         iAgentRollingS:listOverview.iAgentRollingS,
            //         iAgentRollingPBA:listOverview.iAgentRollingPBA,
            //         iAgentRollingPBB:listOverview.iAgentRollingPBB,
            //     },
            //     {
            //         where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
            //     });
            // }
        
            // console.log(``);
            // console.log(`##### Result `);
            // console.log(listOverview);
            
            lProcessID = -1;
            
            console.log(`##### END OF CRON`);
        });