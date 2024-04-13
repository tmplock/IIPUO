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



let lProcessID = -1;


// cron.schedule('*/5 * * * * * ', async ()=> {
//
//     console.log(`##### CRON ROLLING`);
//
//     if (lProcessID != -1)
//     {
//         console.log(`##### CRON IS PROCESSING`);
//         return;
//     }
//     lProcessID = 1;
//
//     let listUpdateDB = [];
//     let listOverview = [];
//
//
//
//     //  2024-04-05
//     // let listID = [
//     //     {strID:'qa123', iClass:7},
//     //     {strID:'jojo05', iClass:8},
//     //     {strID:'cjsgh1', iClass:7},
//     //     {strID:'kkk123', iClass:8},
//     //     {strID:'qwe01', iClass:8},
//     //     {strID:'zxc01', iClass:8},
//     //     {strID:'t1000', iClass:7},
//     //     {strID:'gkfn1', iClass:8},
//     //     {strID:'gkfn2', iClass:8},
//     //     {strID:'zlekfl5', iClass:8},
//     //     {strID:'gkfn3', iClass:8},
//     //     {strID:'sss1000', iClass:6},
//     //     {strID:'tpdud123', iClass:8},
//     //     {strID:'gkfn6', iClass:8},
//     // ];
//
//     //  2024-04-06
//     let listID = [
//         {strID:'gkfn6', iClass:8},
//         {strID:'gkfn2', iClass:8},
//         {strID:'sss1000', iClass:6},
//         {strID:'jojo01', iClass:8},
//         {strID:'gkfn3', iClass:8},
//         {strID:'rudwn01', iClass:6},
//         {strID:'gkfn1', iClass:8},
//         {strID:'gkfn5', iClass:8},
//         {strID:'tpdud123', iClass:8},
//         {strID:'ehqhd22', iClass:8},
//         {strID:'ehqhd55', iClass:8},
//         {strID:'gkfn01', iClass:8},
//         {strID:'kkk123', iClass:8},
//     ];
//
//     //  2024-04-07
//     // let listID = [
//     //     {strID:'zlekfl5', iClass:8},
//     //     {strID:'cjsgh1', iClass:7},
//     //     {strID:'kkk123', iClass:8},
//     //     {strID:'jojo05', iClass:8},
//     //     {strID:'rudwn01', iClass:6},
//     //     {strID:'jnh720', iClass:8},
//     //     {strID:'MARBRORED', iClass:8},
//     //     {strID:'gkfn02', iClass:8},
//     //     {strID:'gkfn04', iClass:8},
//     //     {strID:'rkskek', iClass:7},
//     //     {strID:'sss1000', iClass:6},
//     //     {strID:'gkfn08', iClass:8},
//     //     {strID:'zlekfl6', iClass:8},
//     //     {strID:'rhtks9', iClass:8},
//     // ];
//
//     // let listID = [
//     //     {strID:'qwe01', iClass:8},
//     // ];
//
//     let strDate = '2024-04-06';
//
//     for ( let i in listID )
//     {
//         await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
//     }
//
//     for ( let i in listOverview )
//     {
//         if ( listOverview[i].strID == 'aktjr01' )
//         {
//             console.log(listOverview[i]);
//         }
//     }
//
//     //console.log(listOverview);
//
//     // for ( let i in listOverview )
//     // {
//     //     console.log(`${i}`);
//
//     //     await db.RecordDailyOverviews.update({
//     //         iBetB:listOverview[i].iBetB,
//     //         iBetUO:listOverview[i].iBetUO,
//     //         iBetS:listOverview[i].iBetS,
//     //         iBetPB:listOverview[i].iBetPB,
//     //         iWinB:listOverview[i].iWinB,
//     //         iWinUO:listOverview[i].iWinUO,
//     //         iWinS:listOverview[i].iWinS,
//     //         iWinPB:listOverview[i].iWinPB,
//     //         iRollingB:listOverview[i].iRollingB,
//     //         iRollingUO:listOverview[i].iRollingUO,
//     //         iRollingS:listOverview[i].iRollingS,
//     //         iRollingPBA:listOverview[i].iRollingPBA,
//     //         iRollingPBB:listOverview[i].iRollingPBB,
//     //         iAgentBetB:listOverview[i].iAgentBetB,
//     //         iAgentBetUO:listOverview[i].iAgentBetUO,
//     //         iAgentBetS:listOverview[i].iAgentBetS,
//     //         iAgentBetPB:listOverview[i].iAgentBetPB,
//     //         iAgentWinB:listOverview[i].iAgentWinB,
//     //         iAgentWinUO:listOverview[i].iAgentWinUO,
//     //         iAgentWinS:listOverview[i].iAgentWinS,
//     //         iAgentWinPB:listOverview[i].iAgentWinPB,
//     //         iAgentRollingB:listOverview[i].iAgentRollingB,
//     //         iAgentRollingUO:listOverview[i].iAgentRollingUO,
//     //         iAgentRollingS:listOverview[i].iAgentRollingS,
//     //         iAgentRollingPBA:listOverview[i].iAgentRollingPBA,
//     //         iAgentRollingPBB:listOverview[i].iAgentRollingPBB,
//     //     },
//     //     {
//     //         where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
//     //     });
//     // }
//
//     // console.log(``);
//     // console.log(`##### Result `);
//     // console.log(listOverview);
//
//     lProcessID = -1;
//
//     console.log(`##### END OF CRON`);
// });

let start = async () => {
    console.log(`##### CRON ROLLING`);

    if (lProcessID != -1) {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let listUpdateDB = [];
    let listOverview = [];

    let listGroupUser = [];

    let strDate = '2024-04-13';

    let listDBData = await db.RecordDailyOverviews.findAll({where:
        {
            strDate:strDate,
        }
    });
    let list2 = [];

    for ( let i in listDBData )
    {
        const cData = listDBData[i];
        if ( cData.iBetB > 0 || cData.iBetUO > 0 || cData.iBetS > 0 )
        {
            list2.push(cData);
        }
    }

    console.log(`listDBData : ${listDBData.length}`);

    let listID = [];

    for ( let i in list2 )
    {
        console.log(`${list2[i].strID}, iBetB : ${list2[i].iBetB}, iBetUO : ${list2[i].iBetUO}, iBetS : ${list2[i].iBetS}`);
        listID.push({strID:list2[i].strID, iClass:list2[i].iClass});
    }

    console.log(listID);

//    return;


    // let listID = [
    //     {strID:'qwe01', iClass:8},
    // ];

    // for (let i in listID) {
    //     await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
    // }

    // for ( let i in listOverview )
    // {
    //     //console.log(listOverview[i]);

    //     console.log(`########## strID : ${listOverview[i].strID}, iClass : ${listOverview[i].iClass}`);
    //     if ( listOverview[i].strID == 'tkqnr01')
    //     {
    //         console.log(listOverview[i]);
    //     }
    // }

    for ( let i in listOverview )
    {
        console.log(`${i}`);

        await db.RecordDailyOverviews.update({
            iBetB:listOverview[i].iBetB,
            iBetUO:listOverview[i].iBetUO,
            iBetS:listOverview[i].iBetS,
            iBetPB:listOverview[i].iBetPB,
            iWinB:listOverview[i].iWinB,
            iWinUO:listOverview[i].iWinUO,
            iWinS:listOverview[i].iWinS,
            iWinPB:listOverview[i].iWinPB,
            iRollingB:listOverview[i].iRollingB,
            iRollingUO:listOverview[i].iRollingUO,
            iRollingS:listOverview[i].iRollingS,
            iRollingPBA:listOverview[i].iRollingPBA,
            iRollingPBB:listOverview[i].iRollingPBB,
            iAgentBetB:listOverview[i].iAgentBetB,
            iAgentBetUO:listOverview[i].iAgentBetUO,
            iAgentBetS:listOverview[i].iAgentBetS,
            iAgentBetPB:listOverview[i].iAgentBetPB,
            iAgentWinB:listOverview[i].iAgentWinB,
            iAgentWinUO:listOverview[i].iAgentWinUO,
            iAgentWinS:listOverview[i].iAgentWinS,
            iAgentWinPB:listOverview[i].iAgentWinPB,
            iAgentRollingB:listOverview[i].iAgentRollingB,
            iAgentRollingUO:listOverview[i].iAgentRollingUO,
            iAgentRollingS:listOverview[i].iAgentRollingS,
            iAgentRollingPBA:listOverview[i].iAgentRollingPBA,
            iAgentRollingPBB:listOverview[i].iAgentRollingPBB,
        },
        {
            where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
        });
    }

    return;

    // 닉네임 설정하기
    console.log('결과값 출력하기');
    let targetID = '';
    logHeader();
    for (let i in listOverview) {
        let strNickname = '';
        for (let j in listGroupUser) {
            if (listGroupUser[j].strID == listOverview[i].strID) {
                strNickname = listGroupUser[j].strNickname;
                break;
            }
        }
        log(listOverview[i], strNickname);
        // if (listOverview[i].strID == targetID) {
        //     // console.log(listOverview[i]);
        //     log(listOverview[i]);
        // } else {
        //     log(listOverview[i]);
        //     // console.log(listOverview[i]);
        // }
    }

    //console.log(listOverview);

    // for ( let i in listOverview )
    // {
    //     console.log(`${i}`);

    //     await db.RecordDailyOverviews.update({
    //         iBetB:listOverview[i].iBetB,
    //         iBetUO:listOverview[i].iBetUO,
    //         iBetS:listOverview[i].iBetS,
    //         iBetPB:listOverview[i].iBetPB,
    //         iWinB:listOverview[i].iWinB,
    //         iWinUO:listOverview[i].iWinUO,
    //         iWinS:listOverview[i].iWinS,
    //         iWinPB:listOverview[i].iWinPB,
    //         iRollingB:listOverview[i].iRollingB,
    //         iRollingUO:listOverview[i].iRollingUO,
    //         iRollingS:listOverview[i].iRollingS,
    //         iRollingPBA:listOverview[i].iRollingPBA,
    //         iRollingPBB:listOverview[i].iRollingPBB,
    //         iAgentBetB:listOverview[i].iAgentBetB,
    //         iAgentBetUO:listOverview[i].iAgentBetUO,
    //         iAgentBetS:listOverview[i].iAgentBetS,
    //         iAgentBetPB:listOverview[i].iAgentBetPB,
    //         iAgentWinB:listOverview[i].iAgentWinB,
    //         iAgentWinUO:listOverview[i].iAgentWinUO,
    //         iAgentWinS:listOverview[i].iAgentWinS,
    //         iAgentWinPB:listOverview[i].iAgentWinPB,
    //         iAgentRollingB:listOverview[i].iAgentRollingB,
    //         iAgentRollingUO:listOverview[i].iAgentRollingUO,
    //         iAgentRollingS:listOverview[i].iAgentRollingS,
    //         iAgentRollingPBA:listOverview[i].iAgentRollingPBA,
    //         iAgentRollingPBB:listOverview[i].iAgentRollingPBB,
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
}

let logHeader = (overview) => {
    let logHeader = '';
    logHeader += '날짜';
    logHeader += ', 클래스';
    logHeader += ', 아이디';
    logHeader += ', 닉네임';
    logHeader += ', 바카라';
    logHeader += ', 승리';
    logHeader += ', 언오버';
    logHeader += ', 승리';
    logHeader += ', 슬롯';
    logHeader += ', 승리';
    logHeader += ', 바카라 로링';
    logHeader += ', 언오버 로링';
    logHeader += ', 슬롯 로링';
    logHeader += ', iBetB';
    logHeader += ', iBetUO';
    logHeader += ', iBetS';
    logHeader += ', iWinB';
    logHeader += ', iWinUO';
    logHeader += ', iWinS';
    logHeader += ', iRollingB';
    logHeader += ', iRollingUO';
    logHeader += ', iRollingS';
    logHeader += ', strGroupID';
    console.log(logHeader);
}
let log = (overview, strNickname, strID) => {

    let split = ', ';
    let split2 = ' ';
    let log = ``;
    if (overview.strID == strID) {
        log += strID;
        log += split2;
    }

    log += overview.strDate;
    log += split;

    if (overview.iClass == 1) {
        log += '총총';
        log += split;
    } else if (overview.iClass == 2) {
        log += '총본';
        log += split;
    } else if (overview.iClass == 3) {
        log += '본사';
        log += split;
    } else if (overview.iClass == 4) {
        log += '대본';
        log += split;
    } else if (overview.iClass == 5) {
        log += '부본';
        log += split;
    } else if (overview.iClass == 6) {
        log += '총판';
        log += split;
    } else if (overview.iClass == 7) {
        log += '매장';
        log += split;
    } else if (overview.iClass == 8) {
        log += '유저';
        log += split;
    }

    log += overview.strID;
    log += split;

    log += strNickname;
    log += split;

    log += overview.iBetB;
    log += split;

    log += overview.iWinB;
    log += split;

    log += overview.iBetUO;
    log += split;

    log += overview.iWinUO;
    log += split;

    log += overview.iBetS;
    log += split;

    log += overview.iWinS;
    log += split;

    log += overview.iRollingB;
    log += split;

    log += overview.iRollingUO;
    log += split;

    log += overview.iRollingS;
    log += split;

    log += overview.iAgentBetB;
    log += split;

    log += overview.iAgentBetUO;
    log += split;

    log += overview.iAgentBetS;
    log += split;

    log += overview.iAgentWinB;
    log += split;

    log += overview.iAgentWinUO;
    log += split;

    log += overview.iAgentWinS;
    log += split;

    log += overview.iAgentRollingB;
    log += split;

    log += overview.iAgentRollingUO;
    log += split;

    log += overview.iAgentRollingS;
    log += split;

    log += `'${overview.strGroupID}'`;

    console.log(log);
}

setTimeout(start, 1000);