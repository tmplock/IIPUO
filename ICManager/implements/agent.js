const db = require('../models');
const {Op, where, Sequelize}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

var kRealtimeObject = new IObject.IRealtimeBetting();

const EAgent = Object.freeze({"eHQ":1, "eViceHQ":2, "eAdmin":3, "eProAdmin":4, "eViceAdmin":5, "eAgent":6, "eShop":7, "eUser":8});
module.exports.EAgent = EAgent;

const { QueryTypes } = require('sequelize');

var inline_GetBettingRecord = async (iGameCode, strGroupID, strTimeStart, strTimeEnd, strNickname) => {

    console.log(`GetBettingRecord strTimeStart : ${strTimeStart}, strTimeEnd : ${strTimeEnd}, iGameCode : ${iGameCode}, strGroupID : ${strGroupID}`);

    if ( strNickname != undefined && strNickname != null )
    {
        let list = await db.BettingRecords.findAll({
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID:{
                    [Op.like]:strGroupID+'%'
                },
                strNickname:strNickname,
                iComplete:1
            },
            order:[['createdAt','DESC']]
        });
        return list;
    }
    else
    {
        let list = await db.BettingRecords.findAll({
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID:{
                    [Op.like]:strGroupID+'%'
                },
                iComplete:1
            },
            order:[['createdAt','DESC']]
        });
        return list;
    }
}
exports.GetBettingRecord = inline_GetBettingRecord;

/**
 * 유저정보 팝업 > 배팅내역
 */
let inline_CalculateBettingRecord = async (iGameCode, strGroupID, iClass, dateStart, dateEnd, strNickname) => {

    console.log(`CalculateBettingRecord ${dateStart}, ${dateEnd}`);

    // partner > list
    let list = await inline_GetBettingRecord(iGameCode, strGroupID, dateStart, dateEnd, strNickname);

    // partner > overview
    let iom = await inline_GetIOMFromDate(strGroupID, iClass, dateStart, dateEnd, strNickname);

    console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
    console.log(iom);

    let strStart = dateStart.substring(0,10);
    let strEnd = dateEnd.substring(0,10);

    strStart = dateStart.substr(5,5);
    strEnd = strEnd.substr(5,5);

    let strDate = strStart;
    if ( strStart != strEnd )
        strDate = `${strStart}~${strEnd}`;


    var data = new IObject.IDailyBettingObject(strDate);


    console.log(list.length);

    for ( var i in list )
    {
        let iRolling = 0;
        switch ( parseInt(iClass) )
        {
            case EAgent.eHQ:
                iRolling += list[i].iRollingUser + list[i].iRollingShop + list[i].iRollingAgent + list[i].iRollingVAdmin + list[i].iRollingPAdmin;
                break;
            case EAgent.eViceHQ:
                iRolling += list[i].iRollingUser + list[i].iRollingShop + list[i].iRollingAgent + list[i].iRollingVAdmin + list[i].iRollingPAdmin;
                break;
            case EAgent.eAdmin: //  Admin
                iRolling += list[i].iRollingUser + list[i].iRollingShop + list[i].iRollingAgent + list[i].iRollingVAdmin + list[i].iRollingPAdmin;
                break;
            case EAgent.eProAdmin: //  PAdmin
                iRolling += list[i].iRollingUser + list[i].iRollingShop + list[i].iRollingAgent + list[i].iRollingVAdmin + list[i].iRollingPAdmin;
                break;
            case EAgent.eViceAdmin: //  VAdmin
                iRolling += list[i].iRollingUser + list[i].iRollingShop + list[i].iRollingAgent + list[i].iRollingVAdmin;
                break;
            case EAgent.eAgent: //  Agent
                iRolling += list[i].iRollingUser + list[i].iRollingShop + list[i].iRollingAgent;
                break;
            case EAgent.eShop: //  Shop
                iRolling += list[i].iRollingUser + list[i].iRollingShop;
                break;
            case EAgent.eUser: //  User
                iRolling += list[i].iRollingUser;
                break;
        }

        let objectBetting = {iBetting:list[i].iBetting, iWin:list[i].iWin, iRolling:iRolling, iTarget:list[i].iTarget, iGameCode:list[i].iGameCode};

        data.kBettingInfo.push(objectBetting);
    }

    if ( iom.length > 0 )
    {
        data.iInput = parseInt(iom[0].iInput);
        data.iOutput = iom[0].iOutput;
        data.iTotalCash = iom[0].iTotalMoney;
        data.iRolling = iom[0].iRolling;
        data.iSettle = iom[0].iSettle;
        data.iExchange = iom[0].iExchange;
        data.iExchangeRolling = iom[0].iExchangeRolling;
        data.iExchangeSettle = iom[0].iExchangeSettle;
        data.iMyRollingMoney = iom[0].iMyRollingMoney;
        data.iClass = iClass;
    }

    return data;
}
exports.CalculateBettingRecord = inline_CalculateBettingRecord;


// let inline_DailyBettingRecord = async (strID, strGroupID, dateStart, dateEnd) => {
//
//     console.log(`inline_DailyBettingRecord ${dateStart}, ${dateEnd}`);
//     let strStart = dateStart.substring(0,10);
//     let strEnd = dateEnd.substring(0,10);
//
//     strStart = dateStart.substr(5,5);
//     strEnd = strEnd.substr(5,5);
//
//     let strDate = strStart;
//     if ( strStart != strEnd )
//         strDate = `${strStart}~${strEnd}`;
//
//     let list = await db.DailyBettingRecords.findAll({
//         where: {
//             strID: strID,
//             // strGroupID: {
//             //     [Op.like]: strGroupID+'%'
//             // },
//             createdAt:{
//                 [Op.between]:[dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
//             }
//         }
//     });
//
//     let rollingList = await db.sequelize.query(`
//         SELECT SUM(u.iRolling) AS total
//         FROM Users u
//         WHERE u.strGroupID LIKE CONCAT('${strGroupID}', '%')
//     `, {type: db.Sequelize.QueryTypes.SELECT});
//     let totalRolling = rollingList[0].total;
//
//     return {strDate: strDate, list: list, totalRolling: totalRolling};
// }
// exports.DailyBettingRecord = inline_DailyBettingRecord;
// // partner overview
var inline_CalculateDailyBettingRecord = async (iGameCode, strGroupID, iClass, strNickname) => {

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    console.log(`CalculateDailyBettingRecord ${dateStart, dateEnd}`);

    return inline_CalculateBettingRecord(iGameCode, strGroupID, iClass, dateStart, dateEnd, strNickname);
}
exports.CalculateDailyBettingRecord = inline_CalculateDailyBettingRecord;

var inline_CalculateRealtimeBettingRecord = async (iGameCode, strGroupID) =>
{
    kRealtimeObject.ResetRealtime();
    const realtime_list = await db.BettingRecords.findAll({where:{iGameCode:iGameCode, iComplete:0,
        strGroupID:{
            [Op.like]:strGroupID+'%'
        }
    }});

    for ( var i in realtime_list)
    {
        console.log(realtime_list[i].iTarget);
        kRealtimeObject.AddRealTimeBetting(0, 0, realtime_list[i].iBetting, realtime_list[i].iTarget, realtime_list[i].strGroupID);
    }
    return kRealtimeObject.kRealtime;
}
exports.CalculateRealtimeBettingRecord = inline_CalculateRealtimeBettingRecord;

let FindIndexFromBettingRecord = (date, list) => {

    for ( let i in list )
    {
        if ( list[i].strDate == date )
            return i;
    }

    return -1;
}

var inline_CalculateTermBettingRecord = async (iGameCode, strGroupID, iClass, dateStart, dateEnd, strNickname) => {

    console.log(`CalculateTermBettingRecord ${dateStart}, ${dateEnd}, ${iClass}, ${strGroupID}`);

    let records = await inline_GetBettingRecord(iGameCode, strGroupID, dateStart, dateEnd, strNickname);
    let iom = await inline_GetIOMFromDate(strGroupID, iClass, dateStart, dateEnd, strNickname);
    var iCurrent = -1;
    var list = [];

    let diff = Math.floor((Date.parse(dateEnd)-Date.parse(dateStart))/86400000);
    for ( let i = 0; i < diff+1; ++ i)
    {
        let date = ITime.GetDay(dateEnd, -i);
        list.push(new IObject.IDailyBettingObject(date));

        if ( iom.length > 0 )
            list[i].iTotalCash = iom[0].iTotalMoney;

    }

    for ( var i in records)
    {
        var td = records[i].createdAt.substring(0,10);

        iCurrent = FindIndexFromBettingRecord(td, list);
        if ( iCurrent == -1 )
            continue;

        let iRolling = 0;
        switch ( parseInt(iClass) )
        {
            case EAgent.eHQ:
            case EAgent.eViceHQ:
            case EAgent.eAdmin: //  Admin
                iRolling += records[i].iRollingUser + records[i].iRollingShop + records[i].iRollingAgent + records[i].iRollingVAdmin + records[i].iRollingPAdmin;
                break;
            case EAgent.eProAdmin: //  VAdmin
                iRolling += records[i].iRollingUser + records[i].iRollingShop + records[i].iRollingAgent + records[i].iRollingVAdmin + records[i].iRollingPAdmin;
                break;
            case EAgent.eViceAdmin: //  PAdmin
                iRolling += records[i].iRollingUser + records[i].iRollingShop + records[i].iRollingAgent + records[i].iRollingVAdmin;
                break;
            case EAgent.eAgent: //  Agent
                iRolling += records[i].iRollingUser + records[i].iRollingShop + records[i].iRollingAgent;
                break;
            case EAgent.eShop: //  Shop
                iRolling += records[i].iRollingUser + records[i].iRollingShop;
                break;
            case EAgent.eUser: //  User
                iRolling += records[i].iRollingUser;
                break;
        }

        let objectBetting = {iBetting:records[i].iBetting, iWin:records[i].iWin, iRolling:iRolling, iTarget:records[i].iTarget, iGameCode:records[i].iGameCode};
        list[iCurrent].kBettingInfo.push(objectBetting);

    }

    for ( let date in iom)
    {
        let iCurrent = FindIndexFromBettingRecord(iom[date].date, list);
        if ( iCurrent == -1 )
            continue;

        list[iCurrent].iInput = parseInt(iom[date].iInput);
        list[iCurrent].iOutput = iom[date].iOutput;
        list[iCurrent].iExchange = iom[date].iExchange;
    }


    //  For Total Records
    list.push(new IObject.IDailyBettingObject(''));

    return list;
}
exports.CalculateTermBettingRecord = inline_CalculateTermBettingRecord;


var inline_CalculateMonthlyBettingRecord = async (iGameCode, strGroupID, iClass) => {

    const dateStart = ITime.getMonthlyStart();
    const dateEnd = ITime.getMonthlyEnd();

    console.log(`CalculateMonthlyBettingRecord ${dateStart}, ${dateEnd}`);

    return inline_CalculateTermBettingRecord(iGameCode, strGroupID, iClass, dateStart, dateEnd);
}
exports.CalculateMonthlyBettingRecord = inline_CalculateMonthlyBettingRecord;

var inline_GetViceAdminList = async () => {

    var va_list = await db.Users.findAll({where:{iClass:4}});

    return va_list;
};
exports.GetViceAdminList = inline_GetViceAdminList;

var inline_GetNumAgents = async(strGroupID, iClass) => {
    console.log(strGroupID);
    var list = await db.Users.findAll({
        attributes:[
            'strGroupID'
        ],
        where:{
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            iClass:iClass,
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    return list;
}
exports.GetNumAgents = inline_GetNumAgents;

var inline_GetTotalMoney = async(strGroupID) => {
    console.log(strGroupID);

    var list = await db.Users.findAll({
        attributes:[[db.sequelize.fn('sum', db.sequelize.col('iCash')), 'total']],
        raw:true,
        where:{
            strGroupID:{[Op.like]:strGroupID+'%'},
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });
    return list;
}
exports.GetTotalMoney = inline_GetTotalMoney;

var inline_GetComputedAgentTotal = async (strGroupID, iClass, dateStart, dateEnd, strSearchNickname) => {

    console.log(`############################################################################################### GetComputedAgentTotal : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd}`);

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = ` AND t2.strNickname = '${strSearchNickname}'`;

    if ( iClass == EAgent.eViceHQ )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        0 as iMyRollingMoney,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        console.log(`get computed agent list######################################################################################################################`);
        console.log(list);

        return list;
    }
    else if ( iClass == EAgent.eAdmin )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        0 as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eProAdmin )
    {
        console.log(`############################################################################################# EAgent.eProAdmin`);

        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eAgent )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eShop )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eUser )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='0' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='100' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='200' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;

    }

    return null;
};
exports.GetComputedAgentTotal = inline_GetComputedAgentTotal;

var inline_GetComputedAgentList = async (strGroupID, iClass, dateStart, dateEnd, strSearchNickname) => {

    console.log(`############################################################################################### GetComputedAgentList : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd}`);

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = ` AND t2.strNickname = '${strSearchNickname}'`;

    if ( iClass == EAgent.eViceHQ )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE iClassFrom=1 AND eType = 'GIVE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInputGts,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE iClassTo=1 AND eType = 'TAKE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutputGts,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAdmin}),0) as iNumAdmins,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eProAdmin}),0) as iNumProAdmins,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        0 as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iPermission != 100 AND t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        console.log(`get computed agent list######################################################################################################################`);
        console.log(list);

        return list;
    }
    else if ( iClass == EAgent.eAdmin )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eProAdmin}),0) as iNumProAdmins,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        0 as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingPAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iPermission != 100 AND t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        // console.log(`get computed agent list`);
        // console.log(list);

        return list;
    }
    else if ( iClass == EAgent.eProAdmin )
    {
        console.log(`############################################################################################# EAgent.eProAdmin`);

        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
--         IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')) ,0) as iSettle,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
--         t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID=t2.strGroupID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strID=t2.strID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTotal
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        console.log(`==================================================================== get computed agent list`);
        console.log(list);

        return list;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
        0 as iNumViceAdmins,
--         IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')) ,0) as iSettle,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strID=t2.strID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eAgent )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
        0 as iNumViceAdmins,
        0 as iNumAgents,
--         IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')) ,0) as iSettle,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strID=t2.strID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eShop )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
        0 as iNumViceAdmins,
        0 as iNumAgents,
        0 as iNumShops,
--         IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')) ,0) as iSettle,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strID=t2.strID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eUser )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*,
        t2.iCash as iMyMoney,
        0 as iNumViceAdmins,
        0 as iNumAgents,
        0 as iNumShops,
        0 as iNumUsers,
--         IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')) ,0) as iSettle,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='0' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='100' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='200' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strID = t2.strID AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strID=t2.strID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;

    }

    return null;
};
exports.GetComputedAgentList = inline_GetComputedAgentList;

// partner > overview
let inline_GetIOMFromDate = async (strGroupID, iClass, strStartDate, strEndDate, strNickname) => {

    console.log("############################# GetIOM " + strGroupID);

    let strQueryNickname = ``;
    if ( strNickname != undefined && strNickname != null )
    {
        strQueryNickname = `AND Inouts.strID = '${strNickname}'`;
    }

    if ( iClass == 1 || iClass == 2 || iClass == 3 )
    {
        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iRolling, 
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%')) ,0) as iSettle,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,
                IFNULL(SUM(case when Inouts.eType = 'INPUT' then Inouts.iAmount ELSE 0 END), 0) as iInput,
                IFNULL(SUM(case when Inouts.eType = 'OUTPUT' then Inouts.iAmount ELSE 0 END),0) as iOutput,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' OR Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchange,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' then Inouts.iAmount ELSE 0 END),0) as iExchangeRolling,
                IFNULL(SUM(case when Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchangeSettle,
                0 AS iMyRollingMoney
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}' ${strQueryNickname}
            `
            );
        return rList;
    }
    else if ( iClass == 8 )
    {
        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iRolling) FROM Users WHERE strNickname = '${strNickname}' AND iClass ='${iClass}'),0) as iRolling,
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strNickname = '${strNickname}' AND iClass ='${iClass}') ,0) as iSettle,
                IFNULL((SELECT iCash FROM Users WHERE strNickname = '${strNickname}'),0) as iTotalMoney,
                IFNULL(SUM(case when Inouts.eType = 'INPUT' then Inouts.iAmount ELSE 0 END), 0) as iInput,
                IFNULL(SUM(case when Inouts.eType = 'OUTPUT' then Inouts.iAmount ELSE 0 END),0) as iOutput,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' OR Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchange,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' then Inouts.iAmount ELSE 0 END),0) as iExchangeRolling,
                IFNULL(SUM(case when Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchangeSettle,
                IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strNickname='${strNickname}' AND iComplete = 1 AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}' ${strQueryNickname}
            `
            );
        return rList;
    }
    else
    {
        let strQueryMyMoney = `IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' ),0) as iTotalMoney,`;

        if ( strNickname != undefined && strNickname != null )
        {
            strQueryMyMoney = `IFNULL((SELECT SUM(iCash) FROM Users WHERE strNickname = '${strNickname}' AND iClass > '3' ),0) as iTotalMoney,`;
        }

        let strQueryMyRolling = `0 as iMyRollingMoney,`;
        if ( iClass == 4 ) // 대본
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 5 ) // 부본
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 6 ) // 총판
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 7 ) // 매장
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;

        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID = '${strGroupID}' AND iClass ='${iClass}'),0) as iRolling,
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID = '${strGroupID}' AND iClass ='${iClass}') ,0) as iSettle,
                ${strQueryMyMoney}
                ${strQueryMyRolling}
                IFNULL(SUM(case when Inouts.eType = 'INPUT' then Inouts.iAmount ELSE 0 END), 0) as iInput,
                IFNULL(SUM(case when Inouts.eType = 'OUTPUT' then Inouts.iAmount ELSE 0 END),0) as iOutput,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' OR Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchange,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' then Inouts.iAmount ELSE 0 END),0) as iExchangeRolling,
                IFNULL(SUM(case when Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchangeSettle
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}' ${strQueryNickname}
            `
            );
        return rList;
    }
}
exports.GetIOMFromDate = inline_GetIOMFromDate;

//FIXME: Inout의 컬럼명 strID가 유저의 strNickname과 매칭됨
let inline_GetIORFromDate = async (strGroupID, iClass, strStartDate, strEndDate) => {

    const [rList]  = await db.sequelize.query(
    `
    SELECT
    iCash as iTotalMoney,
    SUM(case when Inouts.eType = 'INPUT' then Inouts.iAmount ELSE 0 END) iInput,
    SUM(case when Inouts.eType = 'OUTPUT' then Inouts.iAmount ELSE 0 END) iOutput 
    from Inouts 
    LEFT OUTER JOIN Users
    ON Inouts.strID = Users.strNickname
    WHERE Users.strGroupID LIKE CONCAT('${strGroupID}','%') AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}';
    `
    );

    return rList;
}
exports.GetIORFromDate = inline_GetIORFromDate;

var inline_GetIOM = async (strGroupID, iClass) => {

    console.log(`GetIOM strGroupID : ${strGroupID}, iClass : ${iClass}`);

    const [rLists] = await db.sequelize.query(
        `
        SELECT              
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND eState = 'COMPLETE' AND eType = 'INPUT'),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND eState = 'COMPLETE' AND eType = 'OUTPUT'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%')),0) as iTotalMoney
        FROM Users
        WHERE iClass=${iClass} AND strGroupID LIKE CONCAT('${strGroupID}', '%');
        `
    );

    return rLists;
}
exports.GetIOM = inline_GetIOM;

let inline_GetPopupAgentInfo = async (strGroupID, iClass, strNickname) => {

    if ( strGroupID == undefined || iClass == undefined || strNickname == undefined )
        return null;

    console.log(`###########################################@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ${strGroupID}, ${strNickname}, ${iClass}`);

    const [users] = await db.sequelize.query(
        `
        SELECT              
        *
        FROM Users
        WHERE strNickname='${strNickname}';
        `
        );

    return users[0];

    switch ( iClass )
    {
        case EAgent.eViceHQ:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *
                    FROM Users
                    WHERE strNickname='${strNickname}';
                    `
                    );

                return users[0];
            }
            break;
        case EAgent.eAdmin:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *,
                    IFNULL((SELECT sum(iRollingAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1),0) as iRolling
                    FROM Users
                    WHERE strGroupID='${strGroupID}';
                    `
                    );

                return users[0];
            }
            break;
        case EAgent.eProAdmin:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *,
                    IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1),0) as iRolling
                    FROM Users
                    WHERE strGroupID='${strGroupID}';
                    `
                    );

                return users[0];
            }
            break;
        case EAgent.eViceAdmin:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *,
                    IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1),0) as iRolling
                    FROM Users
                    WHERE strGroupID='${strGroupID}';
                    `
                    );

                return users[0];
            }
            break;
        case EAgent.eAgent:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *,
                    IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1),0) as iRolling
                    FROM Users
                    WHERE strGroupID='${strGroupID}';
                    `
                    );

                return users[0];
            }
            break;
        case EAgent.eShop:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *,
                    IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1),0) as iRolling
                    FROM Users
                    WHERE strGroupID='${strGroupID}';
                    `
                    );

                return users[0];
            }
            break;
        case EAgent.eUser:
            {
                const [users] = await db.sequelize.query(
                    `
                    SELECT              
                    *,
                    IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1),0) as iRolling
                    FROM Users
                    WHERE strGroupID='${strGroupID}' AND iClass='${EAgent.eUser}' AND strNickname='${strNickname}';
                    `
                    );

                return users[0];
            }
            break;
    }

}
exports.GetPopupAgentInfo = inline_GetPopupAgentInfo;

let inline_GetPopupShareInfo = async (strID, strGroupID) => {
    if ( strID == undefined )
        return null;

    const list = await db.sequelize.query(`
        SELECT u.strNickname AS parentNickname, su.strNickname AS strNickname, su.fShareR AS fShareR, su.strID AS strID, 0 AS iShareAccBefore, 0 AS iShare,
               IFNULL((SELECT sum(iShare+iShareAccBefore) FROM ShareRecords WHERE strNickname = su.strNickname ORDER BY createdAt DESC LIMIT 1), 0) AS iCreditBefore,
               su.iShare AS iCreditAfer
        FROM ShareUsers su
        LEFT JOIN Users u ON u.strID = su.strID
        WHERE su.strGroupID LIKE CONCAT('${strGroupID}', '%')
    `);
    return list[0];
}
exports.GetPopupShareInfo = inline_GetPopupShareInfo;

var inline_GetAdminNickname = async (strGroupID) => {

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.iClass='8' AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%');
        `
        );

    return result[0].lev1;
}
exports.GetAdminNickname = inline_GetAdminNickname;

var inline_GetParentList = async (strGroupID, iClass) => {

    console.log(`GetParentList : ${strGroupID}, ${iClass}`);

    let objectData = {strAdmin:'', strPAdmin:'', strVAdmin:'', strAgent:'', strShop:''};

    if ( iClass == 8 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3,
            t4.strNickname AS lev4,
            t5.strNickname AS lev5
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
            WHERE t6.iClass='8' AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:result[0].lev5};

        //return result[0].lev1;
    }
    else if ( iClass == 7 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3,
            t4.strNickname AS lev4
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            WHERE t5.iClass='7' AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:''};
    }
    else if ( iClass == 6 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            WHERE t4.iClass='6' AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:'', strShop:''};
    }
    else if ( iClass == 5 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t2.strNickname AS lev2
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            WHERE t3.iClass='5' AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:'', strAgent:'', strShop:''};
    }
    else if ( iClass == 4 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.iClass='4' AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strPAdmin:'', strVAdmin:'', strAgent:'', strShop:''};
    }
    else if ( iClass == 3 )
    {

    }
    return objectData;
}
exports.GetParentList = inline_GetParentList;

var inline_GetParentNickname = async (strNickname) => {

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname as parent
        FROM Users as t1
        LEFT JOIN Users as t2 ON t2.iParentID = t1.id
        where t2.strNickname = '${strNickname}';`
    );

    console.log(`GetParentNickname : ${result.length}`);

    if ( result.length > 0 )
        return result[0].parent;

    return '';
}
exports.GetParentNickname = inline_GetParentNickname;

var inline_GetParentGroupID = async (strNickname) => {

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strGroupID as parent
        FROM Users as t1
        LEFT JOIN Users as t2 ON t2.iParentID = t1.id
        where t2.strNickname = '${strNickname}';`
    );

    console.log(`inline_GetParentGroupID : ${result.length}`);

    if ( result.length > 0 )
        return result[0].parent;

    return '';
}
exports.GetParentGroupID = inline_GetParentGroupID;

var inline_GetChildAdminList = async (strGroupID) => {

    let children = await db.Users.findAll({
        where:{
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            iClass:3,
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    })

    let list = [];
    for ( let i in children )
    {
        list.push(`${children[i].strNickname}`);
    }

    return list;
}
exports.GetChildAdminList = inline_GetChildAdminList;

var inline_GetChildNicknameList = async (strGroupID, iClass) => {

    let children = await db.Users.findAll({
        where:{
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            iClass:iClass,
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    })

    let list = [];
    for ( let i in children )
    {
        list.push(`${children[i].strNickname}`);
    }

    return list;
}
exports.GetChildNicknameList = inline_GetChildNicknameList;

var inline_GetAdminForSettle = async (strGroupID, strQuater, iClass) => {

    console.log(`############################################################################################# EAgent.eProAdmin`);

    const [list] = await db.sequelize.query(`
        SELECT IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE iClass=4 AND strQuater='${strQuater}' AND strGroupID like CONCAT(u.strGroupID, '%')),0) AS iSettleCount,
               u.*
        FROM Users u
        WHERE u.iClass = ${iClass} AND u.iPermission != 100 AND u.strGroupID like CONCAT('${strGroupID}', '%')
        `);
    console.log(`==================================================================== get computed agent + settle list`);
    console.log(list);

    return list;
}
exports.GetAdminForSettle = inline_GetAdminForSettle;

//  For Settle
var inline_GetAgentListForSettle = async (strGroupID, iClass, strQuater, dateStart, dateEnd, strNickname) => {

    console.log(`############################################################################################### GetAgentListForSettle : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd}`);

    let tagSearch = '';

    if ( iClass == EAgent.eProAdmin )
    {
        console.log(`############################################################################################# EAgent.eProAdmin`);

        const [list] = await db.sequelize.query(`
        SELECT
        t2.*, t2.iSettleAcc AS iSettleAccUser,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,

        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleOrigin FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleOrigin,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAcc,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,

        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose,

        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        console.log(`==================================================================== get computed agent list`);
        console.log(list);

        return list;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*, t2.iSettleAcc AS iSettleAccUser,
        t2.iCash as iMyMoney,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentSlotRollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strTableID ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBARollingMoney,
        IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strTableID ='1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBBRollingMoney,

        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,

        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,

        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,

        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose,

        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eAgent )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*, t2.iSettleAcc AS iSettleAccUser,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentSlotRollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode = '300' AND strTableID ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBARollingMoney,
        IFNULL((SELECT sum(iRollingVAdmin) FROM BettingRecords WHERE iGameCode = '300' AND strTableID ='1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBBRollingMoney,

        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strTableID = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingAgent)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strTableID = '1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,

        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,

        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose,

        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eShop )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*, t2.iSettleAcc AS iSettleAccUser,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentSlotRollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBARollingMoney,
        IFNULL((SELECT sum(iRollingAgent) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBBRollingMoney,

        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,

        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,

        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose,

        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;
    }
    else if ( iClass == EAgent.eUser )
    {
        const [list] = await db.sequelize.query(`
        SELECT
        t2.*, t2.iSettleAcc AS iSettleAccUser,
        t2.iCash as iMyMoney,
        0 as iNumViceAdmins,
        0 as iNumAgents,
        0 as iNumShops,
        0 as iNumUsers,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentSlotRollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode ='300' AND strTableID ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBARollingMoney,
        IFNULL((SELECT sum(iRollingShop) FROM BettingRecords WHERE iGameCode ='300' AND strTableID ='1' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iParentPBBRollingMoney,

        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE iGameCode ='300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        IFNULL((SELECT sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '0' AND strID = t2.strNickname AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '100' AND strID = t2.strNickname AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '200' AND strID = t2.strNickname AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '0' AND strID = t2.strNickname AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
        IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingUser) FROM BettingRecords WHERE iGameCode = '300' AND strTableID = '1' AND strID = t2.strNickname AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,
        
        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,

        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '0' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '100' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '200' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
        IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE iGameCode = '300' AND strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose,

        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `);

        return list;

    }

    return null;
};
exports.GetAgentListForSettle = inline_GetAgentListForSettle;

var inline_GetAgentListForSettleRecord = async (strGroupID, iClass, strQuater, dateStart, dateEnd, strNickname) => {

    console.log(`############################################################################################### inline_GetAgentListForSettleRecord : strNickname = ${strNickname}, strQuater : ${strQuater}`);

    const [list] = await  db.sequelize.query(`
        SELECT s1.*, u.*
        FROM SettleRecords s1
        JOIN Users u on  s1.strNickname = u.strNickname
        WHERE s1.strNickname = '${strNickname}' AND s1.strQuater = '${strQuater}';
    `);
    return list;
};
exports.GetAgentListForSettleRecord = inline_GetAgentListForSettleRecord;

let inline_CalculateOverviewSettle = async (strGroupID, iClass, strQuater, dateStart, dateEnd) => {

    let iTotalSettle = `IFNULL((SELECT sum(iSettle) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalSettle,`;
    if (iClass > 3) {
        iTotalSettle = `IFNULL((SELECT sum(iSettle) FROM SettleRecords WHERE strNickname = t1.strNickname AND strQuater = '${strQuater}'),0) as iTotalSettle,`;
    }
    let iRolling = `IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' ),0) as iRolling,`;
    if (iClass > 4) {
        iRolling = `IFNULL((SELECT SUM(iRolling) FROM Users WHERE strNickname = t1.strNickname AND iClass > '4' ),0) as iRolling,`;
    }

    const [list] = await db.sequelize.query(
    `
    SELECT
    IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iSettleCount,
    ${iTotalSettle}
    IFNULL((SELECT SUM(iSettleAcc) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iTotalSettleAcc,
    IFNULL((SELECT sum(iShareAccBefore) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalShareAccBefore,
    IFNULL((SELECT sum(iShare) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}', '%') AND strQuater = '${strQuater}'),0) as iTotalShare,
    IFNULL((SELECT sum(iShare) FROM ShareUsers WHERE strGroupID LIKE CONCAT('${strGroupID}', '%')),0) as iCurrentTotalShare,
    
    IFNULL((SELECT sum(iBetting) FROM BettingRecords WHERE iGameCode = 0 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBetting,
    IFNULL((SELECT sum(iBetting) FROM BettingRecords WHERE iGameCode = 100 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingUnover,
    IFNULL((SELECT sum(iBetting) FROM BettingRecords WHERE iGameCode = 200 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingSlot,
    IFNULL((SELECT sum(iBetting) FROM BettingRecords WHERE iGameCode = 300 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingPB,
    
    IFNULL((SELECT sum(iWin) FROM BettingRecords WHERE iGameCode = 0 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWin,
    IFNULL((SELECT sum(iWin) FROM BettingRecords WHERE iGameCode = 100 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinUnover,
    IFNULL((SELECT sum(iWin) FROM BettingRecords WHERE iGameCode = 200 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinSlot,
    IFNULL((SELECT sum(iWin) FROM BettingRecords WHERE iGameCode = 300 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinPB,

    IFNULL((SELECT sum(iRollingPAdmin)+sum(iRollingVAdmin)+sum(iRollingAgent)+sum(iRollingShop)+sum(iRollingUser) FROM BettingRecords WHERE iGameCode = 0 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRolling,
    IFNULL((SELECT sum(iRollingPAdmin)+sum(iRollingVAdmin)+sum(iRollingAgent)+sum(iRollingShop)+sum(iRollingUser) FROM BettingRecords WHERE iGameCode = 100 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingUnover,
    IFNULL((SELECT sum(iRollingPAdmin)+sum(iRollingVAdmin)+sum(iRollingAgent)+sum(iRollingShop)+sum(iRollingUser) FROM BettingRecords WHERE iGameCode = 200 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingSlot,
    IFNULL((SELECT sum(iRollingPAdmin)+sum(iRollingVAdmin)+sum(iRollingAgent)+sum(iRollingShop)+sum(iRollingUser) FROM BettingRecords WHERE iGameCode = 300 AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingPB,
    
    IFNULL((SELECT sum(iCommissionB)+sum(iCommissionS) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalCommission,
    IFNULL((SELECT sum(iRollingPAdmin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
    
    IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iGameCode = 0 AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
    IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iGameCode = 100 AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalUnover,
    IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iGameCode = 200 AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalSlot,
    IFNULL((SELECT sum(iBetting)-sum(iWin)-sum(iRollingPAdmin)-sum(iRollingAgent)-sum(iRollingVAdmin)-sum(iRollingShop)-sum(iRollingUser) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iGameCode = 300 AND iComplete = 1 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalPB,
    
    IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND iGameCode = 0 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLose,
    IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND iGameCode = 100 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLoseUnover,
    IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND iGameCode = 200 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLoseSlot,
    IFNULL((SELECT sum(iBetting)-sum(iWin) FROM BettingRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iComplete = 1 AND iGameCode = 300 AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLosePB,
    
    IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
    IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,

    ${iRolling}
    IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%')) ,0) as iSettle,
    IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' ),0) as iTotalMoney,
    IFNULL((SELECT SUM(iSettleAcc) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%')) ,0) as iSettleAcc,

    IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iInput,
    IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput

    FROM Users AS t1
    
    WHERE t1.iClass='${iClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');
    `);

    return list;
};
exports.CalculateOverviewSettle = inline_CalculateOverviewSettle;

/**
 *
 */
let inline_GetCreditList = async (strID) => {
    console.log(`GetCreditList : ${strID}`);

    let list = await db.CreditRecords.findAll({
        where:{
            strID: strID,
        },
        order:[['createdAt','DESC']]
    });

    return list;
}
exports.GetCreditList = inline_GetCreditList;