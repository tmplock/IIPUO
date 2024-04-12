const cron = require('node-cron');

const db = require('./db');

const RDEzugi = require('./vender/ezugi');
const RDCQ9 = require('./vender/cq9');
const RDHLink = require('./vender/honorlink');

const RDVivo = require('./vender/vivo');

const ODDS = require('./helpers/odds');

const {Op}= require('sequelize');

/*  Per 10 Minutes
    1. EZUGI
    2. CQ9
    3. HONORLINK
    4. BET ROLLING, WIN
    5. EZUGI
    6. CQ9
    7. HONORLINK
    9. BET ROLLING, WIN
    0. CANCEL
*/

let GetElapsedSeconds = (strBaseDate) => {

    let dateCreated = new Date(strBaseDate);
    let dateCurrent = new Date();

    let iDiffSeconds = (dateCurrent.getTime() - dateCreated.getTime()) / 1000;

    return iDiffSeconds;
}

console.log(`############################### DIFF SECONDS : ${GetElapsedSeconds('2024-02-19 22:27:49')}`);

let lProcessVivo = -1;
//cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
cron.schedule('*/5 * * * * ', async ()=> {
//cron.schedule('*/10 * * * * * ', async ()=> {
    
    console.log(`##### VIVO SCHEDULE`);
    if (lProcessVivo != -1)
    {
        console.log(`##### VIVO SCHEDULE ING`);
        return;
    }
    lProcessVivo = 1;
    let listOverview = [];
    let listOdds = [];

    let now = GetNow();

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:'RD',
            strVender: 'VIVO',
            createdAt: {
                [Op.lte]:now
            }
        },
        order: [['createdAt', 'ASC']]
    });

    console.log(`VIVO list Length : ${list.length}`);

    if (list.length > 0)
    {
        for (let i in list)
        {
            console.log(`vivo detail`);
            console.log(list[i].strDetail);
            let listData = RDVivo.MakeBettingObject(list[i].strDetail);
            console.log(listData);
            if (listData != null && listData != undefined )
            {
                console.log(`##### listData ${listData.length}`);
                console.log(listData);

                let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
                console.log(odds);

                let strDate = list[i].createdAt.substr(0,10);

                //let {listCurrentOverview, objectBetRolling} = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);

                let objectReturn = ODDS.ProcessRolling(odds, listData, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;

                console.log('###### listCurrentOverview');
                console.log(listCurrentOverview);
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

                const strOverview = ODDS.GetRollingString(objectBetRolling);

                await db.RecordBets.update({eState:'COMPLETE', strOverview:strOverview}, {where:{id:list[i].id}});
            }
            else
            {
                const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
                if ( cElapsedSeconds > 60 )
                    await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
            }
        }
        await ODDS.UpdateOverview(listOverview);
    }
    lProcessVivo = -1;
    console.log(`##### VIVO SCHEDULE STOP`);
});

let lProcessEzugi = -1;
//cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
cron.schedule('*/5 * * * * ', async ()=> {
    
    console.log(`##### EZUGI SCHEDULE`);
    if (lProcessEzugi != -1)
    {
        console.log(`##### EZUGI SCHEDULE ING`);
        return;
    }
    lProcessEzugi = 1;
    let listOverview = [];
    let listOdds = [];

    let now = GetNow();

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:'RD',
            // strTableID: 'TEST-EZUGI',
            strVender: 'EZUGI',
            createdAt: {
                [Op.lte]:now
            }
        },
        order: [['createdAt', 'ASC']]
    });

    console.log(`################################################## EZUGI RD List Length : ${list.length}`);

    if (list.length > 0)
    {
        const res = await RDEzugi.GetRangeRD(list[0].updatedAt, list[list.length-1].updatedAt);
        if (res == null)
        {
            lProcessEzugi = -1;
            console.log(`##### EZUGI SCHEDULE ERROR STOP NOT RES`);
            return;
        }

        for (let i in list)
        {
            let listData = RDEzugi.GetRD(res, list[i].strUniqueID);

            if (listData != null)
            {
                console.log(`##### listData`);

                let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
                console.log(odds);

                let strDate = list[i].createdAt.substr(0,10);

                //let {listCurrentOverview, objectBetRolling} = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);

                let objectReturn = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;

                console.log('###### listCurrentOverview');
                console.log(listCurrentOverview);
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

                const strOverview = ODDS.GetRollingString(objectBetRolling);

                await db.RecordBets.update({eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview}, {where:{id:list[i].id}});
            }
            else
            {
                const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
                if ( cElapsedSeconds > 60 )
                    await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
            }
        }
        await ODDS.UpdateOverview(listOverview);
    }
    lProcessEzugi = -1;
    console.log(`##### EZUGI SCHEDULE STOP`);
});

let lProcessCq9 = -1;
//cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
cron.schedule('*/5 * * * * ', async ()=> {
    console.log(`##### CQ9 SCHEDULE`);
    if (lProcessCq9 != -1) {
        console.log(`##### CQ9 SCHEDULE ING`);
        return;
    }
    lProcessCq9 = 1;
    let listOverview = [];
    let listOdds = [];

    let now = GetNow();

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType: 'RD',
            strVender: 'CQ9',
            createdAt: {
                [Op.lte]:now
            }
        },
        order: [['createdAt', 'ASC']]
    });

    console.log(`################################################## CQ9 RD List Length : ${list.length}`);

    if (list.length > 0) 
    {
        const res = await RDCQ9.GetRangeRD(list[0].createdAt, list[list.length - 1].updatedAt);
        console.log(res);

        if (res == null) {
            console.log(`##### CQ9 SCHEDULE ERROR NOT RES`);
            lProcessCq9 = -1;
            return;
        }

        for ( let i in list )
        {
            const listData = RDCQ9.GetRD(res, list[i].strRound, list[i].strID);
            if ( listData != null )
            {
                console.log(`##### listData`);
                console.log(listData);

                let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
                console.log(odds);

                let strDate = list[i].createdAt.substr(0,10);

                //let {listCurrentOverview, objectBetRolling} = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);

                let objectReturn = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;

                console.log('###### listCurrentOverview');
                console.log(listCurrentOverview);
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

                const strOverview = ODDS.GetRollingString(objectBetRolling);

                await db.RecordBets.update({eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview}, {where:{id:list[i].id}});
            }
            else
            {
                const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
                if ( cElapsedSeconds > 60 )
                    await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
            }
        }
        await ODDS.UpdateOverview(listOverview);
    }

    lProcessCq9 = -1;
    console.log(`##### CQ9 SCHEDULE STOP`);
});

let lProcessHLink = -1;
//cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
cron.schedule('*/5 * * * * ', async ()=> {
    console.log(`##### HONORLINK SCHEDULE`);
    if (lProcessHLink != -1)
    {
        console.log(`##### HONORLINK SCHEDULE ING`);
        return;
    }
    lProcessHLink = 1;
    let listOverview = [];
    let listOdds = [];

    let now = GetNow();

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            strVender: 'HONORLINK',
            eType: 'RD',
            createdAt: {
                [Op.lte]:now
            }
        },
        order: [['createdAt', 'ASC']]
    });

    console.log(`################################################## HLINK List Length : ${list.length}`);

    if ( list.length > 0 )
    {
        let res = await RDHLink.GetRangeRD(list[0].updatedAt, list[list.length-1].updatedAt);
        if (res == null) {
            lProcessHLink = -1;
            console.log(`##### HONORLINK SCHEDULE ERROR STOP NOT RES`);
            return;
        }

        for (let i in list)
        {
            let listData = RDHLink.GetRD(res, list[i].strUniqueID);
            if (listData != null)
            {
                console.log(`##### listData`);
                console.log(listData);

                let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
                console.log(odds);

                let strDate = list[i].createdAt.substr(0,10);

                //let {listCurrentOverview, objectBetRolling} = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);

                let objectReturn = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;

                console.log('###### listCurrentOverview');
                console.log(listCurrentOverview);
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

                const strOverview = ODDS.GetRollingString(objectBetRolling);

                await db.RecordBets.update({eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview}, {where:{id:list[i].id}});
            }
            else
            {
                await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
            }
        }
        await ODDS.UpdateOverview(listOverview);
    }
    lProcessHLink = -1;
    console.log(`##### HONORLINK SCHEDULE STOP`);
});

let ProcessCancel = async (eType, list, listOverview, listOdds) => {

    for (let i in list)
    {
        let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
        console.log(odds);

        let strDate = list[i].createdAt.substr(0,10);

        if ( list[i].strOverview != '' )
        {
            let listCurrentOverview = ODDS.ProcessRollingCancel(odds, list[i].strOverview, strDate, eType);
            console.log('###### listCurrentOverview');
            console.log(listCurrentOverview);
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
        }

        await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
    }

}

//  ##### BETTING CANCEL PROCESSOR
let lProcessCancel = -1;
cron.schedule('*/1 * * * * ', async ()=> {
//cron.schedule('*/10 * * * * * ', async ()=> {
    
    console.log(`##### CANCEL SCHEDULE`);
    if (lProcessCancel != -1)
    {
        console.log(`##### CANCEL SCHEDULE ING`);
        return;
    }
    lProcessCancel = 1;
    let listOverview = [];
    let listOdds = [];

    let listFull = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType: 'CANCEL'
        },
    });
    //0,40,40,60,60,0,8,16,36,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20000,4000,0,0,20000,4200,0,0,
    await ProcessCancel('FULL', listFull, listOverview, listOdds);

    let listBet = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType: 'CANCEL_BET'
        },
    });
    //0,40,40,60,60,0,8,16,36,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20000,4000,0,0,20000,4200,0,0,
    await ProcessCancel('BET', listBet, listOverview, listOdds);

    let listWin = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType: 'CANCEL_WIN'
        },
    });
    //0,40,40,60,60,0,8,16,36,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20000,4000,0,0,20000,4200,0,0,
    await ProcessCancel('WIN', listWin, listOverview, listOdds);

    console.log(`##### Converted listOverview`);
    console.log(listOverview);
    await ODDS.UpdateOverview(listOverview);

    lProcessCancel = -1;
    console.log(`##### CANCEL SCHEDULE STOP`);
});

//  ##### BET PROCESSOR
let lProcessBet = -1;
//cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
cron.schedule('*/5 * * * * ', async ()=> {
//cron.schedule('*/10 * * * * * ', async ()=> {
    
    console.log(`##### BET SCHEDULE`);
    if (lProcessBet != -1)
    {
        console.log(`##### BET SCHEDULE ING`);
        return;
    }
    lProcessBet = 1;
    let listOverview = [];
    let listOdds = [];

    let now = GetNow();

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:'BET',
            createdAt: {
                [Op.lte]:now
            }
        },
    });

    console.log(`Cancel List Length : ${list.length}`);

    if (list.length > 0)
    {
        for (let i in list)
        {
            let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
            console.log(odds);

            let strDate = list[i].createdAt.substr(0,10);

            let objectReturn = ODDS.ProcessRollingBet(odds, list[i].iGameCode, list[i].iBet, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;

            console.log('###### listCurrentOverview');
            console.log(listCurrentOverview);
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

            const strOverview = ODDS.GetRollingString(objectBetRolling);

            await db.RecordBets.update({eState:'COMPLETE', strOverview:strOverview}, {where:{id:list[i].id}});
        }

        console.log(`##### Converted listOverview`);
        console.log(listOverview);
        await ODDS.UpdateOverview(listOverview);
    }
    lProcessBet = -1;
    console.log(`##### BET SCHEDULE STOP`);
});

// ##### WIN PROCESSOR
let lProcessWin = -1;
//cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
cron.schedule('*/5 * * * * ', async ()=> {
//cron.schedule('*/10 * * * * * ', async ()=> {
    
    console.log(`##### WIN SCHEDULE`);
    if (lProcessWin != -1)
    {
        console.log(`##### WIN SCHEDULE ING`);
        return;
    }
    lProcessWin = 1;
    let listOverview = [];
    let listOdds = [];

    let now = GetNow();

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            eType:'WIN',
            createdAt: {
                [Op.lte]:now
            }
        },
    });

    console.log(`Cancel List Length : ${list.length}`);

    if (list.length > 0)
    {
        for (let i in list)
        {
            let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
            console.log(odds);

            let strDate = list[i].createdAt.substr(0,10);

            let objectReturn = ODDS.ProcessRollingWin(odds, list[i].iGameCode, list[i].iWin, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;

            console.log('###### listCurrentOverview');
            console.log(listCurrentOverview);
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

            await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
        }

        console.log(`##### Converted listOverview`);
        console.log(listOverview);
        await ODDS.UpdateOverview(listOverview);
    }
    lProcessWin = -1;
    console.log(`##### WIN SCHEDULE STOP`);
});






//  ####################################################################################################
//  PREVIOIS CODES
//  END OF PREVIOIS CODES
//  ####################################################################################################

// let lProcessCancel = -1;
// cron.schedule('*/5 * * * * * ', async ()=> {
// //cron.schedule('*/10 * * * * * ', async ()=> {
    
//     console.log(`##### CANCEL SCHEDULE`);
//     if (lProcessCancel != -1)
//     {
//         console.log(`##### CANCEL SCHEDULE ING`);
//         return;
//     }
//     lProcessCancel = 1;
//     let listOverview = [];
//     let listOdds = [];

//     let list = await db.RecordBets.findAll({
//         where: {
//             eState: 'STANDBY',
//             eType: 'CANCEL'
//         },
//     });
//     //0,40,40,60,60,0,8,16,36,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20000,4000,0,0,20000,4200,0,0,

//     console.log(`Cancel List Length : ${list.length}`);

//     if (list.length > 0)
//     {
//         for (let i in list)
//         {
//             let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
//             console.log(odds);

//             let strDate = list[i].createdAt.substr(0,10);

//             if ( list[i].strOverview != '' )
//             {
//                 let listCurrentOverview = ODDS.ProcessRollingCancel(odds, list[i].strOverview, strDate, 'FULL');
//                 console.log('###### listCurrentOverview');
//                 console.log(listCurrentOverview);
//                 ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
//             }

//             await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
//         }

//         console.log(`##### Converted listOverview`);
//         console.log(listOverview);
//         await ODDS.UpdateOverview(listOverview);
//     }
//     lProcessCancel = -1;
//     console.log(`##### CANCEL SCHEDULE STOP`);
// });


//  ####################################################################################################
//  UNKNOWN CODES

// let lProcessEzugi = -1;
// cron.schedule('*/10 * * * * * ', async ()=> {
    
//     console.log(`##### EZUGI SCHEDULE`);
//     if (lProcessEzugi != -1)
//     {
//         console.log(`##### EZUGI SCHEDULE ING`);
//         return;
//     }
//     lProcessEzugi = 1;

//     let listOverview = [];
//     let listOdds = [];

//     let list = await db.RecordBets.findAll({
//         where: {
//             eState: 'STANDBY',
//             strVender: 'EZUGI',
//         },
//         order: [['createdAt', 'ASC']]
//     });

//     console.log(`list Length : ${list.length}`);

//     if (list.length > 0)
//     {
//         const res = await RDEzugi.GetRangeRD(list[0].updatedAt, list[list.length-1].updatedAt);
//         if (res == null)
//         {
//             lProcessEzugi = -1;
//             console.log(`##### EZUGI SCHEDULE ERROR STOP NOT RES`);
//             return;
//         }
//         console.log(res);

//         for (let i in list)
//         {
//             let listData = RDEzugi.GetRD(res, list[i].strUniqueID);
//             if (listData != null)
//             {
//                 console.log(`##### listData`);
//                 console.log(listData);

//                 //let odds = await ODDS.GetOdds('test', 8, listOdds);
//                 let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
//                 console.log(odds);

//                 let strDate = list[i].createdAt.substr(0,10);

//                 let listCurrentOverview = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);
//                 console.log('###### listCurrentOverview');
//                 console.log(listCurrentOverview);
//                 ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
//                 //await db.RecordBets.update({eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards}, {where:{id:list[i].id}});
//             }
//             else
//             {
//                 console.log('##### Not Found RD');
//                 //await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
//             }
//         }

//         await ODDS.UpdateOverview(listOverview);
//     }
//     lProcessEzugi = -1;
//     console.log(`##### EZUGI SCHEDULE STOP`);
// });
//  END OF UNKNOWN CODES
//  ####################################################################################################


let GetNow = () => {
    let now = new Date();
    now.setMinutes(now.getMinutes() - 2);
    return now;
}