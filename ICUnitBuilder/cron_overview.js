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

let FindAdjust = (strID, list) => {

    for ( let i in list )
    {
        if ( list[i].strID == strID )
            return true;
    }

    return false;
}

let Adjust = (list, db) => {

    if ( db.iBetB > 0 || db.iBetS > 0 )
    {
        if ( false == FindAdjust(db.strID, list) )
        {
            list.push({strID:db.strID, iClass:db.iClass});
        }
    }
}


cron.schedule('*/5 * * * * * ', async ()=> {

    console.log(`##### CRON ROLLING`);

    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let listUpdateDB = [];
    let listOverview = [];


    // const listOverviewDB = await db.RecordDailyOverviews.findAll({where:{strDate:'2024-08-23'}});
    // let listID = [];
    // for ( let i in listOverviewDB )
    // {
    //     Adjust(listID, listOverviewDB[i]);
    // }

    //return;
    // console.log(listID);

    // const bets = await db.RecordBets.findAll({where:{
    //     strGroupID: {
    //         [Op.like] : '000%'
    //     },
    //     createdAt:{
    //         [Op.between]:[ '2024-08-23', require('moment')('2024-08-23').add(1, 'days').format('YYYY-MM-DD')],
    //     },
    // }});

    // let list = [];
    // for ( let i in bets )
    // {
    //     if ( false == FindAdjust(bets[i].strID, list) )
    //         list.push({strID:bets[i].strID, iClass:bets[i].iClass});
    // }
    // console.log(list);

    let listID = [
            { strID: 'clxk', iClass: 8 },
            { strID: 'as05', iClass: 8 },
            { strID: 'tn4', iClass: 8 },
            { strID: 'tn10', iClass: 8 },
            { strID: 'tn7', iClass: 8 },
            { strID: 'as07', iClass: 8 },
            { strID: 'as03', iClass: 8 },
            { strID: 'cnscjs1', iClass: 8 },
            { strID: 'as02', iClass: 8 },
            { strID: 'cnscjs5', iClass: 8 },
            { strID: 'wkdfh3', iClass: 8 },
            { strID: 'abc5', iClass: 8 },
            { strID: 'wkdfh15', iClass: 8 },
            { strID: 'wkdfh1', iClass: 8 },
            { strID: 'wkdfh5', iClass: 8 },
            { strID: 'abc3', iClass: 8 },
            { strID: 'tn1', iClass: 8 },
            { strID: 'tn9', iClass: 8 },
            { strID: 'zxc741', iClass: 8 },
            { strID: 'wkdfh12', iClass: 8 },
            { strID: 'wkdfh9', iClass: 8 },
            { strID: 'wkdfh8', iClass: 8 },
            { strID: 'wkdfh11', iClass: 8 },
            { strID: 'wkdfh13', iClass: 8 },
            { strID: 'wkdfh20', iClass: 8 },
            { strID: 'wkdfh7', iClass: 8 }
    ];


    let strDate = '2024-08-23';

    for ( let i in listID )
    {
        await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
    }

    //  Update Overview
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
    //         iAgentBetB2:listOverview[i].iAgentBetB,
    //         iAgentBetUO2:listOverview[i].iAgentBetUO,
    //         iAgentBetS2:listOverview[i].iAgentBetS,
    //         iAgentBetPB2:listOverview[i].iAgentBetPB,
    //     },
    //     {
    //         where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
    //     });
    // }

    //  CREATION
    // for ( let i in listOverview )
    // {
    //     if ( listOverview[i].strID == 'cnscjs1' )
    //     {
    //         console.log(listOverview[i]);
    //     }
    // }

    // console.log(listOverview);

    // //return;

    // //console.log(listOverview);
    for ( let i in listOverview )
        {
            console.log(`${i}`);
            const user = await db.Users.findOne({where:{strID:listOverview[i].strID}});
    
            await db.RecordDailyOverviews.create({
                strDate:strDate,
                strID:user.strID,
                strGroupID:user.strGroupID,
                iClass:user.iClass,
                iInput:0,
                iOutput:0,
                iExchange:0,
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
                iAgentBetB2:listOverview[i].iAgentBetB,
                iAgentBetUO2:listOverview[i].iAgentBetUO,
                iAgentBetS2:listOverview[i].iAgentBetS,
                iAgentBetPB2:listOverview[i].iAgentBetPB,
                iNumPlayB:0,
                iNumPlayUO:0,
                iNumPlayS:0
        });
    }

    // console.log(``);
    // console.log(`##### Result `);
    // console.log(listOverview);

    //lProcessID = -1;

    console.log(`##### END OF CRON`);
});

let Find = (strID, list) => {

    for ( let i in list )
    {
        if ( list[i].strID == strID )
            return list[i];
    }
    return null;
}


let FindNickname = (strID, list) => {
    for (let i in list) {
        if (list[i].strID == strID) {
            return list[i].strNickname;
        }
    }
    return 'none';
}

let Compare = (objectNormal, objectExist) => {

    let object = {strID:objectNormal.strID, iB:0, iS:0, iAgentB:0, iAgentS:0, iAgentWinB:0, iAgentWinS:0};

    if ( objectNormal.iAgentBetB != objectExist.iAgentBetB ) {
        object.iAgentB = parseFloat(objectNormal.iAgentBetB) - parseFloat(objectExist.iAgentBetB);
    }
    if ( objectNormal.iAgentBetS != objectExist.iAgentBetS ) {
        object.iAgentS = parseFloat(objectNormal.iAgentBetS) - parseFloat(objectExist.iAgentBetS);
    }
    if ( objectNormal.iAgentWinB != objectExist.iAgentWinB ) {
        object.iAgentWinB = parseFloat(objectNormal.iAgentWinB) - parseFloat(objectExist.iAgentWinB);
    }
    if ( objectNormal.iAgentWinS != objectExist.iAgentWinS ) {
        object.iAgentWinS = parseFloat(objectNormal.iAgentWinS) - parseFloat(objectExist.iAgentWinS);
    }
    if ( objectNormal.iRollingB != objectExist.iRollingB )
    {
        object.iB = parseFloat(objectNormal.iRollingB) - parseFloat(objectExist.iRollingB);
    }
    if ( objectNormal.iRollingS != objectExist.iRollingS )
    {
        object.iS = parseFloat(objectNormal.iRollingS) - parseFloat(objectExist.iRollingS);
    }
    return object;
}

// let start = async () => {
//     console.log(`##### 오버뷰 계산 및 롤링 차이 계산`);

//     if (lProcessID != -1) {
//         console.log(`##### CRON IS PROCESSING`);
//         return;
//     }
//     lProcessID = 1;

//     let listUpdateDB = [];
//     let listOverview = [];

//     let listGroupUser = [];

//     let strDate = '2024-05-30';

//     let listDBData = await db.RecordDailyOverviews.findAll({where:
//         {
//             strDate:strDate,
//         }
//     });
//     let listID = [];

//     for ( let i in listDBData )
//     {
//         const cData = listDBData[i];
//         if ( cData.iBetB > 0 || cData.iBetUO > 0 || cData.iBetS > 0 )
//         {
//             listID.push(cData);
//         }
//     }

//     console.log(`listDBData : ${listDBData.length}`);

//     // let listID = [
//     //     {strID:'cvcv1', iClass:6},
//     // ];
//     //let listID = [];

//     for (let i in listID) {
//         await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
//     }

//     for ( let i in listOverview )
//     {
//         console.log(`${i}`);

//         if ( listOverview[i].iClass == '2' )
//             console.log(listOverview[i]);
//     }

//     return;


//     let nicknameList = await db.Users.findAll();

//     let index = 1;
//     let dataOverviewList = [];
//     let dataObjectList = [];

//     for ( let i in listOverview )
//     {
//         console.log(`${i}`);

//         if ( listOverview[i].iClass == '2' )
//             console.log(listOverview[i]);

//         // await db.RecordDailyOverviews.update({
//         //     iBetB:listOverview[i].iBetB,
//         //     iBetUO:listOverview[i].iBetUO,
//         //     iBetS:listOverview[i].iBetS,
//         //     iBetPB:listOverview[i].iBetPB,
//         //     iWinB:listOverview[i].iWinB,
//         //     iWinUO:listOverview[i].iWinUO,
//         //     iWinS:listOverview[i].iWinS,
//         //     iWinPB:listOverview[i].iWinPB,
//         //     iRollingB:listOverview[i].iRollingB,
//         //     iRollingUO:listOverview[i].iRollingUO,
//         //     iRollingS:listOverview[i].iRollingS,
//         //     iRollingPBA:listOverview[i].iRollingPBA,
//         //     iRollingPBB:listOverview[i].iRollingPBB,
//         //     iAgentBetB:listOverview[i].iAgentBetB,
//         //     iAgentBetUO:listOverview[i].iAgentBetUO,
//         //     iAgentBetS:listOverview[i].iAgentBetS,
//         //     iAgentBetPB:listOverview[i].iAgentBetPB,
//         //     iAgentWinB:listOverview[i].iAgentWinB,
//         //     iAgentWinUO:listOverview[i].iAgentWinUO,
//         //     iAgentWinS:listOverview[i].iAgentWinS,
//         //     iAgentWinPB:listOverview[i].iAgentWinPB,
//         //     iAgentRollingB:listOverview[i].iAgentRollingB,
//         //     iAgentRollingUO:listOverview[i].iAgentRollingUO,
//         //     iAgentRollingS:listOverview[i].iAgentRollingS,
//         //     iAgentRollingPBA:listOverview[i].iAgentRollingPBA,
//         //     iAgentRollingPBB:listOverview[i].iAgentRollingPBB,
//         // },
//         // {
//         //     where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
//         // });
//     }



//     for ( let i in listOverview )
//     {
//         console.log(listOverview[i]);

//         // console.log(`########## strID : ${listOverview[i].strID}, iClass : ${listOverview[i].iClass}`);
//         // if ( listOverview[i].strID == 'jjg1218')
//         // {
//         //     //console.log(listOverview[i]);
//         //     logHeader(listOverview[i]);
//         // }


//         // let found = Find(listOverview[i].strID, listDBData);
//         // if ( found != null )
//         // {
//         //     let object = Compare(listOverview[i], found);
//         //     if ( object.iB != 0 || object.iS != 0 || object.iAgentB != 0 || object.iAgentS != 0 || object.iAgentWinS != 0 || object.iAgentWinB != 0 )
//         //     {
//         //         dataObjectList.push(object);
//         //         dataOverviewList.push(listOverview[i]);
//         //
//         //         console.log(index+1);
//         //
//         //         await db.RecordDailyOverviews.update({
//         //             iBetB:listOverview[i].iBetB,
//         //             iBetUO:listOverview[i].iBetUO,
//         //             iBetS:listOverview[i].iBetS,
//         //             iBetPB:listOverview[i].iBetPB,
//         //             iWinB:listOverview[i].iWinB,
//         //             iWinUO:listOverview[i].iWinUO,
//         //             iWinS:listOverview[i].iWinS,
//         //             iWinPB:listOverview[i].iWinPB,
//         //             iRollingB:listOverview[i].iRollingB,
//         //             iRollingUO:listOverview[i].iRollingUO,
//         //             iRollingS:listOverview[i].iRollingS,
//         //             iRollingPBA:listOverview[i].iRollingPBA,
//         //             iRollingPBB:listOverview[i].iRollingPBB,
//         //             iAgentBetB:listOverview[i].iAgentBetB,
//         //             iAgentBetUO:listOverview[i].iAgentBetUO,
//         //             iAgentBetS:listOverview[i].iAgentBetS,
//         //             iAgentBetPB:listOverview[i].iAgentBetPB,
//         //             iAgentWinB:listOverview[i].iAgentWinB,
//         //             iAgentWinUO:listOverview[i].iAgentWinUO,
//         //             iAgentWinS:listOverview[i].iAgentWinS,
//         //             iAgentWinPB:listOverview[i].iAgentWinPB,
//         //             iAgentRollingB:listOverview[i].iAgentRollingB,
//         //             iAgentRollingUO:listOverview[i].iAgentRollingUO,
//         //             iAgentRollingS:listOverview[i].iAgentRollingS,
//         //             iAgentRollingPBA:listOverview[i].iAgentRollingPBA,
//         //             iAgentRollingPBB:listOverview[i].iAgentRollingPBB,
//         //         },
//         //         {
//         //             where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
//         //         });
//         //
//         //         console.log(object);
//         //     }
//         // }
//     }

//     if (dataObjectList.length > 0) {
//         logHeader();
//         for (let i = 0; i<dataObjectList.length; i++) {
//             let obj = dataOverviewList[i];
//             obj.index = i+1;
//             obj.strNickname = FindNickname(obj.strID, nicknameList);
//             obj.iB = dataObjectList[i].iB;
//             obj.iS = dataObjectList[i].iS;
//             obj.iAgentB = dataObjectList[i].iAgentB;
//             obj.iAgentS = dataObjectList[i].iAgentS;
//             obj.iAgentWB = dataObjectList[i].iAgentWinB;
//             obj.iAgentWS = dataObjectList[i].iAgentWinS;
//             log2(obj);
//         }
//     }


//     return;

//     // for ( let i in listOverview )
//     // {
//     //     console.log(`${i}`);

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

//     // console.log(``);
//     // console.log(`##### Result `);
//     // console.log(listOverview);

//     lProcessID = -1;

//     console.log(`##### END OF CRON`);
// }

// let logHeader = (overview) => {
//     let logHeader = '';
//     logHeader += '날짜';
//     logHeader += ', 클래스';
//     logHeader += ', 아이디';
//     logHeader += ', 닉네임';
//     logHeader += ', 바카라';
//     logHeader += ', 승리';
//     logHeader += ', 언오버';
//     logHeader += ', 승리';
//     logHeader += ', 슬롯';
//     logHeader += ', 승리';
//     logHeader += ', 바카라 로링';
//     logHeader += ', 언오버 로링';
//     logHeader += ', 슬롯 로링';
//     logHeader += ', iBetB';
//     logHeader += ', iBetUO';
//     logHeader += ', iBetS';
//     logHeader += ', iWinB';
//     logHeader += ', iWinUO';
//     logHeader += ', iWinS';
//     logHeader += ', iRollingB';
//     logHeader += ', iRollingUO';
//     logHeader += ', iRollingS';
//     logHeader += ', strGroupID';
//     logHeader += ', B롤링차액';
//     logHeader += ', S롤링차액';
//     logHeader += ', B배팅차액';
//     logHeader += ', S배팅차액';
//     logHeader += ', B승리차액';
//     logHeader += ', S승리차액';
//     console.log(logHeader);
// }
// let log = (overview, strNickname, strID) => {

//     let split = ', ';
//     let split2 = ' ';
//     let log = ``;
//     if (overview.strID == strID) {
//         log += strID;
//         log += split2;
//     }

//     log += overview.strDate;
//     log += split;

//     if (overview.iClass == 1) {
//         log += '총총';
//         log += split;
//     } else if (overview.iClass == 2) {
//         log += '총본';
//         log += split;
//     } else if (overview.iClass == 3) {
//         log += '본사';
//         log += split;
//     } else if (overview.iClass == 4) {
//         log += '대본';
//         log += split;
//     } else if (overview.iClass == 5) {
//         log += '부본';
//         log += split;
//     } else if (overview.iClass == 6) {
//         log += '총판';
//         log += split;
//     } else if (overview.iClass == 7) {
//         log += '매장';
//         log += split;
//     } else if (overview.iClass == 8) {
//         log += '유저';
//         log += split;
//     }

//     log += overview.strID;
//     log += split;

//     log += strNickname;
//     log += split;

//     log += overview.iBetB;
//     log += split;

//     log += overview.iWinB;
//     log += split;

//     log += overview.iBetUO;
//     log += split;

//     log += overview.iWinUO;
//     log += split;

//     log += overview.iBetS;
//     log += split;

//     log += overview.iWinS;
//     log += split;

//     log += overview.iRollingB;
//     log += split;

//     log += overview.iRollingUO;
//     log += split;

//     log += overview.iRollingS;
//     log += split;

//     log += overview.iAgentBetB;
//     log += split;

//     log += overview.iAgentBetUO;
//     log += split;

//     log += overview.iAgentBetS;
//     log += split;

//     log += overview.iAgentWinB;
//     log += split;

//     log += overview.iAgentWinUO;
//     log += split;

//     log += overview.iAgentWinS;
//     log += split;

//     log += overview.iAgentRollingB;
//     log += split;

//     log += overview.iAgentRollingUO;
//     log += split;

//     log += overview.iAgentRollingS;
//     log += split;

//     log += `'${overview.strGroupID}'`;

//     console.log(log);
// }

// let log2 = (overview) => {

//     let split = ', ';
//     let split2 = ' ';
//     let log = ``;

//     log += overview.index;
//     log += split2;

//     log += overview.strID;
//     log += split2;

//     log += overview.strDate;
//     log += split;

//     if (overview.iClass == 1) {
//         log += '총총';
//         log += split;
//     } else if (overview.iClass == 2) {
//         log += '총본';
//         log += split;
//     } else if (overview.iClass == 3) {
//         log += '본사';
//         log += split;
//     } else if (overview.iClass == 4) {
//         log += '대본';
//         log += split;
//     } else if (overview.iClass == 5) {
//         log += '부본';
//         log += split;
//     } else if (overview.iClass == 6) {
//         log += '총판';
//         log += split;
//     } else if (overview.iClass == 7) {
//         log += '매장';
//         log += split;
//     } else if (overview.iClass == 8) {
//         log += '유저';
//         log += split;
//     }

//     log += overview.strID;
//     log += split;

//     log += overview.strNickname;
//     log += split;

//     log += overview.iBetB;
//     log += split;

//     log += overview.iWinB;
//     log += split;

//     log += overview.iBetUO;
//     log += split;

//     log += overview.iWinUO;
//     log += split;

//     log += overview.iBetS;
//     log += split;

//     log += overview.iWinS;
//     log += split;

//     log += overview.iRollingB;
//     log += split;

//     log += overview.iRollingUO;
//     log += split;

//     log += overview.iRollingS;
//     log += split;

//     log += overview.iAgentBetB;
//     log += split;

//     log += overview.iAgentBetUO;
//     log += split;

//     log += overview.iAgentBetS;
//     log += split;

//     log += overview.iAgentWinB;
//     log += split;

//     log += overview.iAgentWinUO;
//     log += split;

//     log += overview.iAgentWinS;
//     log += split;

//     log += overview.iAgentRollingB;
//     log += split;

//     log += overview.iAgentRollingUO;
//     log += split;

//     log += overview.iAgentRollingS;
//     log += split;

//     log += `'${overview.strGroupID}'`;
//     log += split;

//     log += `'${overview.iB}'`;
//     log += split;

//     log += `'${overview.iS}'`;
//     log += split;

//     log += `'${overview.iAgentB}'`;
//     log += split;

//     log += `'${overview.iAgentS}'`;
//     log += split;

//     log += `'${overview.iAgentWB}'`;
//     log += split;

//     log += `'${overview.iAgentWS}'`;
//     log += split;

//     console.log(log);
// }

// setTimeout(start, 1000);