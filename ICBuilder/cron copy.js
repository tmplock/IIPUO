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
        // if ( listDB[i].eType == 'RD' || listDB[i].eType == 'BETRD' )
        //     continue;

        // if ( eType == 'WIN' && listDB[i].eType == 'WIN' && listDB[i].strOverview != '' )
        //     list.push(listDB[i]);
        // else if ( eType == 'BETWIN' && listDB[i].eType == 'WIN' && listDB[i].strOverview == '' && listDB[i].iGameCode != 200 )
        //     list.push(listDB[i]);
        // else if ( listDB[i].eType == eType )
        //     list.push(listDB[i]);

        if ( listDB[i].eType == eType )
            list.push(listDB[i]);
    }
    return list;
}

let lProcessID = -1;
let strCurrentStep = '';

//cron.schedule('*/5 * * * * * ', async ()=> {
 cron.schedule('*/1 * * * * ', async ()=> {
//cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

    console.log(`##### CRON`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING : ${strCurrentStep}`);
        return;
    }
    lProcessID = 1;
    strCurrentStep = '1 : START';

    let listUpdateDB = [];
    let listOverview = [];

    let listBetDB = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            //eType:{[Op.or]:['RD', 'CANCEL', 'CANCEL_BET', 'CANCEL_WIN', 'BET', 'WIN', 'BETWIN', 'BETRD']},
            eType:{[Op.or]:['CANCEL', 'CANCEL_BET', 'CANCEL_WIN', 'BET', 'WIN', 'BETWIN']},
            // strVender:{[Op.not]:'EZUGI'},
            createdAt:{
                [Op.lte]:moment().subtract(1, "minutes").toDate(),
            }
        },
        order: [['createdAt', 'ASC']]
    });
    console.log(`##### listBetDB.length = ${listBetDB.length}`);

    strCurrentStep = '2 : GET DB COMPLETE';

    // //  이주기 자체가 15분 내외로 오기 때문에 낭비할 필요가 없다. 17분 후로 설정하여 따로 얻어 오는 것이 효율적으로 판단.
    // let listEzugiBetDB = await db.RecordBets.findAll({
    //     where: {
    //         eState: 'STANDBY',
    //         eType:{[Op.or]:['RD']},
    //         strVender:'EZUGI',
    //         createdAt:{
    //             [Op.lte]:moment().subtract(17, "minutes").toDate(),
    //         }
    //     },
    //     order: [['createdAt', 'ASC']]
    // });
    // console.log(`##### listEzugiBetDB.length = ${listEzugiBetDB.length}`);


    let listOdds = await ODDS.FullCalculteOdds(listBetDB);

    strCurrentStep = '3 : START PROCESSING';

    // //  ##### VIVO
    // const listVivoDB = GetDBListFromVender(listBetDB, 'VIVO');
    // console.log(`##### VIVO : Length : ${listVivoDB.length}`);
    // Processor.ProcessVivo(listVivoDB, listOverview, listOdds, listUpdateDB);

    // strCurrentStep = '4 : VIVO COMPLETE';

    // //  ##### EZUGI
    // //const listEzugiDB = GetDBListFromVender(listBetDB, 'EZUGI');
    // console.log(`##### EZUGI : Length : ${listEzugiBetDB.length}`);
    // await Processor.ProcessEzugi(listEzugiBetDB, listOverview, listOdds, listUpdateDB);

    // strCurrentStep = '5 : EZUGI COMPLETE';

    // //  ##### CQ9
    // const listCQ9DB = GetDBListFromVender(listBetDB, 'CQ9');
    // console.log(`##### CQ9 : Length : ${listCQ9DB.length}`);
    // await Processor.ProcessCQ9(listCQ9DB, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '6 : CQ9 COMPLETE';

    //  아너링크는 기본적으로 베팅에 관련된 것을 미리 처리 한 후에 RD 를 얻어 오는 것으로 결정
    //  ##### HonorLink
    // const listHL = GetDBListFromVender(listBetDB, 'HONORLINK');
    // console.log(`##### HONORLINK : Length : ${listHL.length}`);
    // await Processor.ProcessHLink(listHL, listOverview, listOdds, listUpdateDB);

    //  ##### Bet
    const listBet = GetDBListFromType(listBetDB, 'BET');
    console.log(`##### BET : Length : ${listBet.length}`);
    Processor.ProcessBet(listBet, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '7 : BET COMPLETE';

    //  ##### Win
    const listWin = GetDBListFromType(listBetDB, 'WIN');
    console.log(`##### WIN : Length : ${listWin.length}`);
    Processor.ProcessWin(listWin, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '8 : WIN COMPLETE';

    //  ##### BetWin
    const listBetWin = GetDBListFromType(listBetDB, 'BETWIN');
    console.log(`##### BETWIN : Length : ${listBetWin.length}`);
    Processor.ProcessBetWin(listBetWin, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '9 : BETWIN COMPLETE';

    //  ##### CANCEL
    const listCancelAll = GetDBListFromType(listBetDB, 'CANCEL');
    console.log(`##### CANCEL : Length : ${listCancelAll.length}`);
    Processor.ProcessCancel('ALL', listCancelAll, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '10 : CANCEL COMPLETE';

    //  ##### CANCEL
    const listCancelBet = GetDBListFromType(listBetDB, 'CANCEL_BET');
    console.log(`##### CANCEL_BET : Length : ${listCancelBet.length}`);
    Processor.ProcessCancel('BET', listCancelBet, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '11 : CANCEL_BET COMPLETE';

    //  ##### CANCEL
    const listCancelWin = GetDBListFromType(listBetDB, 'CANCEL_WIN');
    console.log(`##### CANCEL_WIN : Length : ${listCancelWin.length}`);
    Processor.ProcessCancel('WIN', listCancelWin, listOverview, listOdds, listUpdateDB);

    strCurrentStep = '12 : CANCEL_WIN COMPLETE';

    // const listBetRD = GetDBListFromType(listBetDB, 'BETRD');
    // console.log(`##### BETRD : Length : ${listBetRD.length}`);
    // Processor.ProcessBetRD(listBetRD, listUpdateDB);
    

    strCurrentStep = '13 : DB UPDATE START';

    //  ##### UPDATE BET
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    for ( let i in listUpdateDB )
    {
        console.log(`##### listDBUpdate : ${i} db.id : ${listUpdateDB[i].id}`);

        // if ( i == 0 )
        //     continue;

        const cData = listUpdateDB[i];

        // console.log(i);
        // console.log(cData);

        if ( cData.eType == 'BETRD' && cData.eState == 'STANDBY' )
            continue;
        else if ( cData.eType == 'RD' && cData.eState == 'STANDBY' )
            continue;
        else if ( cData.eType == 'BET' && cData.eState == 'STANDBY' )
        {
            await db.RecordBets.update({eType:'BET', eState:'STANDBY'}, {where:{id:cData.id}});
        }
        else if ( cData.eType == 'BETWIN' && cData.eState == 'STANDBY' )
        {
            await db.RecordBets.update({eType:'BETWIN', eState:'STANDBY'}, {where:{id:cData.id}});
        }
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

    strCurrentStep = '14 : OVERVIEW UPDATE START';

    //  ##### OVERVIEW
    console.log(`##### UPDATE OVERVIEW : Length : ${listOverview.length}`);
    await ODDS.UpdateOverview(listOverview);
    
    lProcessID = -1;
    strCurrentStep = '';
    
    console.log(`##### END OF CRON`);
});