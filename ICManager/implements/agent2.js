const db = require('../models');
const {Op, where, Sequelize}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

var kRealtimeObject = new IObject.IRealtimeBetting();

const EAgent = Object.freeze({"eHQ":1, "eViceHQ":2, "eAdmin":3, "eProAdmin":4, "eViceAdmin":5, "eAgent":6, "eShop":7, "eUser":8});
module.exports.EAgent = EAgent;

const { QueryTypes } = require('sequelize');
const IAgent = require("./agent");

const GameCodeList = [0, 100, 200, 300];

var kRealtimeObject = new IObject.IRealtimeBetting();

/**
 * 이용자 조회
 */
let inline_GetPopupAgentInfo = async (strGroupID, iClass, strNickname) => {
    if ( strGroupID == undefined || iClass == undefined || strNickname == undefined )
        return null;

    console.log(`############################# 2inline_GetPopupAgentInfo ${strGroupID}, ${strNickname}, ${iClass}`);

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
                    u.*,
                    IFNULL((SELECT sum(iRollingAdmin) FROM DailyBettingRecords WHERE strID = u.strID),0) as iRolling
                    FROM Users u
                    WHERE u.strGroupID='${strGroupID}';
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
                    u.*,
                    IFNULL((SELECT sum(iRollingPAdmin) FROM DailyBettingRecords WHERE strID = u.strID),0) as iRolling
                    FROM Users u
                    WHERE u.strGroupID='${strGroupID}';
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
                    u.*,
                    IFNULL((SELECT sum(iRollingVAdmin) FROM DailyBettingRecords WHERE strID = u.strID),0) as iRolling
                    FROM Users u
                    WHERE u.strGroupID='${strGroupID}';
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
                    u.*,
                    IFNULL((SELECT sum(iRollingAgent) FROM DailyBettingRecords WHERE strID = u.strID),0) as iRolling
                    FROM Users u
                    WHERE u.strGroupID='${strGroupID}';
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
                    u.*,
                    IFNULL((SELECT sum(iRollingShop) FROM DailyBettingRecords WHERE strID = u.strID),0) as iRolling
                    FROM Users u
                    WHERE u.strGroupID='${strGroupID}';
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
                    u.*,
                    IFNULL((SELECT sum(iRollingUser) FROM DailyBettingRecords WHERE strID = u.strID),0) as iRolling
                    FROM Users u
                    WHERE u.strGroupID='${strGroupID}' AND u.iClass='${EAgent.eUser}' AND u.strNickname='${strNickname}';
                    `
            );

            return users[0];
        }
            break;
    }

}
exports.GetPopupAgentInfo = inline_GetPopupAgentInfo;

/**
 * 본인의 배팅 레코드
 */
let inline_CalculateSelfBettingRecord = async (strGroupID, iClass, dateStart, dateEnd, strNickname, strID) => {

    console.log(`############################# 2CalculateBettingRecord ${dateStart}, ${dateEnd}`);

    // partner > list
    let list = await inline_GetBettingRecord(dateStart, dateEnd, strID);

    // partner > overview
    let iom = await inline_GetIOMFromDate(strGroupID, iClass, dateStart, dateEnd, strNickname, strID);
    console.log(iom);

    let strDate = '';
    if (dateStart != dateEnd) {
        let strStart = dateStart;
        if (strStart.length >= 10) {
            strStart = strStart.substring(5,5);
        }
        let strEnd = dateEnd;
        if (strEnd.length >= 10) {
            strEnd = strEnd.substring(5,5);
        }
        if ( strStart != strEnd )
            strDate = `${strStart}~${strEnd}`;
    } else {
        strDate = dateStart;
        if (strDate.length >= 10) {
            strDate = strDate.substring(5,5);
        }
    }

    var data = new IObject.IDailyBettingObject(strDate);
    for (let i in list) {
        for (let idx in GameCodeList) {
            let gameCode = GameCodeList[idx];
            let bet = GetSelfBetting(list[i], iClass, gameCode);
            if (bet != null)
                data.kBettingInfo.push(bet);
        }
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
exports.CalculateSelfBettingRecord = inline_CalculateSelfBettingRecord;


/**
 * 본인+하위파트너 배팅 레코드
 */
let inline_CalculateBettingRecord = async (strGroupID, iClass, dateStart, dateEnd, strNickname, strID) => {

    console.log(`############################# 2CalculateBettingRecord ${dateStart}, ${dateEnd}`);

    // partner > list
    let list = await inline_GetBettingRecord(dateStart, dateEnd, strID);

    // partner > overview
    let iom = await inline_GetIOMFromDate(strGroupID, iClass, dateStart, dateEnd, '', strID);
    console.log(iom);

    let strDate = '';
    if (dateStart != dateEnd) {
        let strStart = dateStart;
        if (strStart.length >= 10) {
            strStart = strStart.substring(5,5);
        }
        let strEnd = dateEnd;
        if (strEnd.length >= 10) {
            strEnd = strEnd.substring(5,5);
        }
        if ( strStart != strEnd )
            strDate = `${strStart}~${strEnd}`;
    } else {
        strDate = dateStart;
        if (strDate.length >= 10) {
            strDate = strDate.substring(5,5);
        }
    }

    var data = new IObject.IDailyBettingObject(strDate);
    for (let i in list) {
        for (let idx in GameCodeList) {
            let gameCode = GameCodeList[idx];
            let bet = GetBetting(list[i], iClass, gameCode);
            if (bet != null)
                data.kBettingInfo.push(bet);
        }
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

/**
 * 배팅조회
 */
var inline_GetBettingRecord = async (strTimeStart, strTimeEnd, strID) => {

    console.log(`############################# 2GetBettingRecord strTimeStart : ${strTimeStart}, strTimeEnd : ${strTimeEnd}`);

    let list = await db.DailyBettingRecords.findAll({
        where: {
            daily:{
                [Op.between]:[ strTimeStart, strTimeEnd ],
            },
            strID: `${strID}`
        },
        order:[['daily','DESC']]
    });

    return list;
}
exports.GetBettingRecord = inline_GetBettingRecord;
``

/**
 *  이용자별 화면 정보(캐시, 롤링, 죽장 등)
 *  이용자 팝업 > 본인배팅내역, 파트너 팝업 > 회원, 파트너 팝업 > 정산
 */
let inline_GetIOMFromDate = async (strGroupID, iClass, strStartDate, strEndDate, strNickname, strID) => {

    console.log("############################# 2GetIOM " + strGroupID);

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
                IFNULL((SELECT sum(iSelfRollingUser) FROM DailyBettingRecords WHERE strID='${strID}' AND date(daily) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney
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
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingPAdmin) FROM DailyBettingRecords WHERE strID = '${strID}' AND date(daily) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 5 ) // 부본
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingVAdmin) FROM DailyBettingRecords WHERE strID = '${strID}' AND date(daily) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 6 ) // 총판
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingAgent) FROM DailyBettingRecords WHERE strID = '${strID}' AND date(daily) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 7 ) // 매장
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingShop) FROM DailyBettingRecords WHERE strID = '${strID}' AND date(daily) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;

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


/**
 *  파트너
 */
/**
 * 월간 기간 조회
 */
var inline_CalculateMonthlySelfBettingRecord = async (strGroupID, iClass, strNickname, strID) => {

    const dateStart = ITime.getMonthlyStart();
    const dateEnd = ITime.getMonthlyEnd();

    console.log(`CalculateMonthlyBettingRecord ${dateStart}, ${dateEnd}`);

    return inline_CalculateTermSelfBettingRecord(strGroupID, iClass, dateStart, dateEnd, strNickname, strID);
}
exports.CalculateMonthlySelfBettingRecord = inline_CalculateMonthlySelfBettingRecord;

/**
 * 기간별 본인 배팅 계산
 */
var inline_CalculateTermSelfBettingRecord = async (strGroupID, iClass, dateStart, dateEnd, strNickname, strID) => {

    console.log(`CalculateTermBettingRecord ${dateStart}, ${dateEnd}, ${iClass}, ${strGroupID}`);

    let records = await inline_GetBettingRecord(dateStart, dateEnd, strID);
    let iom = await inline_GetIOMFromDate(strGroupID, iClass, dateStart, dateEnd, strNickname, strID);
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

        for (let idx in GameCodeList) {
            let gameCode = GameCodeList[idx];
            let bet = GetSelfBetting(records[i], iClass, gameCode);
            if (bet != null)
                list[iCurrent].kBettingInfo.push(bet);
        }
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
exports.CalculateTermSelfBettingRecord = inline_CalculateTermSelfBettingRecord;

/**
 * 기간별 본인 + 하위파트너 배팅 계산
 *
 */
var inline_CalculateTermBettingRecord = async (strGroupID, iClass, dateStart, dateEnd, strNickname, strID) => {

    console.log(`CalculateTermBettingRecord ${dateStart}, ${dateEnd}, ${iClass}, ${strGroupID}`);

    let records = await inline_GetBettingRecord(dateStart, dateEnd, strID);
    let iom = await inline_GetIOMFromDate(strGroupID, iClass, dateStart, dateEnd, strNickname, strID);
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

        for (let idx in GameCodeList) {
            let gameCode = GameCodeList[idx];
            let bet = GetBetting(records[i], iClass, gameCode);
            if (bet != null)
                list[iCurrent].kBettingInfo.push(bet);
        }
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

/**
 * 배팅 레코드 날짜의 위치 가져오기
 */
let FindIndexFromBettingRecord = (date, list) => {
    for ( let i in list )
    {
        if ( list[i].strDate == date )
            return i;
    }
    return -1;
}

/**
 * 본인 배팅 롤링
 * 유저팝업 > 본인배팅
 * 파트너팝업 > 본인배팅
 * */
let GetClassSelfRolling = (daiyBetting, iClass, iGameCode) => {
    let iRolling = 0;
    switch ( parseInt(iClass) )
    {
        case EAgent.eHQ:
            if (iGameCode == 0)
                return 0;
            else if (iGameCode == 100)
                return 0;
            else if (iGameCode == 200)
                return 0;
            else if (iGameCode == 300)
                return 0;
            break;
        case EAgent.eViceHQ:
            if (iGameCode == 0)
                return 0;
            else if (iGameCode == 100)
                return 0;
            else if (iGameCode == 200)
                return 0;
            else if (iGameCode == 300)
                return 0;
            break;
        case EAgent.eAdmin: //  Admin
            if (iGameCode == 0)
                return daiyBetting.iSelfBRollingVAdmin;
            else if (iGameCode == 100)
                return daiyBetting.iSelfUORollingVAdmin;
            else if (iGameCode == 200)
                return daiyBetting.iSelfSlotRollingVAdmin;
            else if (iGameCode == 300)
                return daiyBetting.iSelfPBRollingVAdmin;
            break;
        case EAgent.eProAdmin: //  PAdmin
            if (iGameCode == 0)
                return daiyBetting.iSelfBRollingPAdmin;
            else if (iGameCode == 100)
                return daiyBetting.iSelfUORollingPAdmin;
            else if (iGameCode == 200)
                return daiyBetting.iSelfSlotRollingPAdmin;
            else if (iGameCode == 300)
                return daiyBetting.iSelfPBRollingPAdmin;
            break;
        case EAgent.eViceAdmin: //  VAdmin
            if (iGameCode == 0)
                return daiyBetting.iSelfBRollingVAdmin;
            else if (iGameCode == 100)
                return daiyBetting.iSelfUORollingVAdmin;
            else if (iGameCode == 200)
                return daiyBetting.iSelfSlotRollingVAdmin;
            else if (iGameCode == 300)
                return daiyBetting.iSelfPBRollingVAdmin;
            break;
        case EAgent.eAgent: //  Agent
            if (iGameCode == 0)
                return daiyBetting.iSelfBRollingAgent;
            else if (iGameCode == 100)
                return daiyBetting.iSelfUORollingAgent;
            else if (iGameCode == 200)
                return daiyBetting.iSelfSlotRollingAgent;
            else if (iGameCode == 300)
                return daiyBetting.iSelfPBRollingAgent;
            break;
        case EAgent.eShop: //  Shop
            if (iGameCode == 0)
                return daiyBetting.iSelfBRollingShop;
            else if (iGameCode == 100)
                return daiyBetting.iSelfUORollingShop;
            else if (iGameCode == 200)
                return daiyBetting.iSelfSlotRollingShop;
            else if (iGameCode == 300)
                return daiyBetting.iSelfPBRollingShop;
            break;
        case EAgent.eUser: //  User
            if (iGameCode == 0)
                return daiyBetting.iSelfBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iSelfUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSelfSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iSelfPBRollingUser;
            break;
    }
    return 0;
}

/**
 * 본인 + 하위 파트너 배팅 롤링
 * 파트너팝업 > 회원
 * */
let GetClassRolling = (daiyBetting, iClass, iGameCode) => {
    let iRolling = 0;
    switch ( parseInt(iClass) )
    {
        case EAgent.eHQ:
            if (iGameCode == 0)
                return daiyBetting.iBRollingPAdmin + daiyBetting.iBRollingVAdmin + daiyBetting.iBRollingAgent + daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingPAdmin + daiyBetting.iUORollingVAdmin + daiyBetting.iUORollingAgent + daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingPAdmin + daiyBetting.iSlotRollingVAdmin + daiyBetting.iSlotRollingAgent + daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingPAdmin + daiyBetting.iPBRollingVAdmin + daiyBetting.iPBRollingAgent + daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eViceHQ:
            if (iGameCode == 0)
                return daiyBetting.iBRollingPAdmin + daiyBetting.iBRollingVAdmin + daiyBetting.iBRollingAgent + daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingPAdmin + daiyBetting.iUORollingVAdmin + daiyBetting.iUORollingAgent + daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingPAdmin + daiyBetting.iSlotRollingVAdmin + daiyBetting.iSlotRollingAgent + daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingPAdmin + daiyBetting.iPBRollingVAdmin + daiyBetting.iPBRollingAgent + daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eAdmin: //  Admin
            if (iGameCode == 0)
                return daiyBetting.iBRollingPAdmin + daiyBetting.iBRollingVAdmin + daiyBetting.iBRollingAgent + daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingPAdmin + daiyBetting.iUORollingVAdmin + daiyBetting.iUORollingAgent + daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingPAdmin + daiyBetting.iSlotRollingVAdmin + daiyBetting.iSlotRollingAgent + daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingPAdmin + daiyBetting.iPBRollingVAdmin + daiyBetting.iPBRollingAgent + daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eProAdmin: //  PAdmin
            if (iGameCode == 0)
                return daiyBetting.iBRollingPAdmin + daiyBetting.iBRollingVAdmin + daiyBetting.iBRollingAgent + daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingPAdmin + daiyBetting.iUORollingVAdmin + daiyBetting.iUORollingAgent + daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingPAdmin + daiyBetting.iSlotRollingVAdmin + daiyBetting.iSlotRollingAgent + daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingPAdmin + daiyBetting.iPBRollingVAdmin + daiyBetting.iPBRollingAgent + daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eViceAdmin: //  VAdmin
            if (iGameCode == 0)
                return daiyBetting.iBRollingVAdmin + daiyBetting.iBRollingAgent + daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingVAdmin + daiyBetting.iUORollingAgent + daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingVAdmin + daiyBetting.iSlotRollingAgent + daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingVAdmin + daiyBetting.iPBRollingAgent + daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eAgent: //  Agent
            if (iGameCode == 0)
                return daiyBetting.iBRollingAgent + daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingAgent + daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingAgent + daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingAgent + daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eShop: //  Shop
            if (iGameCode == 0)
                return daiyBetting.iBRollingShop + daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingShop + daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingShop + daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingShop + daiyBetting.iPBRollingUser;
            break;
        case EAgent.eUser: //  User
            if (iGameCode == 0)
                return daiyBetting.iBRollingUser;
            else if (iGameCode == 100)
                return daiyBetting.iUORollingUser;
            else if (iGameCode == 200)
                return daiyBetting.iSlotRollingUser;
            else if (iGameCode == 300)
                return daiyBetting.iPBRollingUser;
            break;
    }
    return 0;
}

/**
 * 본인 배팅
 */
let GetSelfBetting = (daiyBetting, iClass, iGameCode) => {
    if (iGameCode == 0) {
        return {iBetting:daiyBetting.iSelfBBetting, iWin:daiyBetting.iSelfBWin, iRolling:GetClassSelfRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    } else if (iGameCode == 100) {
        return {iBetting:daiyBetting.iSelfUOBetting, iWin:daiyBetting.iSelfUOWin, iRolling:GetClassSelfRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    } else if (iGameCode == 200) {
        return {iBetting:daiyBetting.iSelfSlotBetting, iWin:daiyBetting.iSelfSlotWin, iRolling:GetClassSelfRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    } else if (iGameCode == 300) {
        return {iBetting:daiyBetting.iSelfPBBetting, iWin:daiyBetting.iSelfPBWin, iRolling:GetClassSelfRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    }
    return null;
}

/**
 * 본인 + 하위파트너 배팅
 */
let GetBetting = (daiyBetting, iClass, iGameCode) => {
    if (iGameCode == 0) {
        return {iBetting:daiyBetting.iBBetting, iWin:daiyBetting.iBWin, iRolling:GetClassRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    } else if (iGameCode == 100) {
        return {iBetting:daiyBetting.iUOBetting, iWin:daiyBetting.iUOWin, iRolling:GetClassRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    } else if (iGameCode == 200) {
        return {iBetting:daiyBetting.iSlotBetting, iWin:daiyBetting.iSlotWin, iRolling:GetClassRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    } else if (iGameCode == 300) {
        return {iBetting:daiyBetting.iPBBetting, iWin:daiyBetting.iPBWin, iRolling:GetClassRolling(daiyBetting, parseInt(iClass), iGameCode), iTarget:daiyBetting.iTarget, iGameCode:iGameCode};
    }
    return null;
}

/**
 * 회원목록 조회
 * 매장 > 회원 > 회원목록
 * 파트너관리 > 파트너 목록
 */
var inline_GetComputedAgentList = async (strGroupID, iClass, dateStart, dateEnd, strSearchNickname, bTotal) => {

    console.log(`############################################################################################### 2GetComputedAgentList : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd} bTotal: ${bTotal}`);
    let subQuery = '';
    let subQuery2 = GetSelfDailyBettingQuery(iClass, dateStart, dateEnd);
    if (bTotal != undefined && bTotal == true) {
        subQuery2 = GetDailyBettingQuery(iClass, dateStart, dateEnd);
    }
    if ( iClass == EAgent.eViceHQ )
    {
        subQuery = `
            IFNULL((SELECT sum(iAmount) FROM GTs WHERE iClassFrom=1 AND eType = 'GIVE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInputGts,
            IFNULL((SELECT sum(iAmount) FROM GTs WHERE iClassTo=1 AND eType = 'TAKE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutputGts,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAdmin}),0) as iNumAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eProAdmin}),0) as iNumProAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney
        `;
    }
    else if ( iClass == EAgent.eAdmin )
    {
        subQuery = `
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eProAdmin}),0) as iNumProAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney
        `;
    }
    else if ( iClass == EAgent.eProAdmin )
    {
        subQuery = `
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney
        `;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        subQuery = `
            0 as iNumViceAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney
        `;
    }
    else if ( iClass == EAgent.eAgent )
    {
        subQuery = `
            0 as iNumViceAdmins,
            0 as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney    
        `;
    }
    else if ( iClass == EAgent.eShop )
    {
        subQuery = `
            0 as iNumViceAdmins,
            0 as iNumAgents,
            0 as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney
        `;
    }
    else if ( iClass == EAgent.eUser )
    {
        subQuery = `
            0 as iNumViceAdmins,
            0 as iNumAgents,
            0 as iNumShops,
            0 as iNumUsers
        `;
    }

    if (subQuery == '' || subQuery2 == '') {
        return  null;
    }

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = ` AND t2.strNickname = '${strSearchNickname}'`;

    const [list] = await db.sequelize.query(`
        SELECT
        ${subQuery},
        ${subQuery2},
        t2.*,
        t2.iCash as iMyMoney,
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,    
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentRollingTotal,
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')), 0) AS iCurrentSettleTotal,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iPermission != 100 AND t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
    `);
    return list;
};
exports.GetComputedAgentList = inline_GetComputedAgentList;

/**
 * DailyBettingRecords에서 파트너,유저 데이터 조회 컬럼
 */
let GetSelfDailyBettingQuery = (iClass, dateStart, dateEnd) => {
    let subQuery = '';
    if ( iClass == EAgent.eViceHQ )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser + iSelfRollingShop + iSelfRollingAgent + iSelfRollingVAdmin + iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser + iSelfBRollingShop + iSelfBRollingAgent + iSelfBRollingVAdmin + iSelfBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser + iSelfUORollingShop + iSelfUORollingAgent + iSelfUORollingVAdmin + iSelfUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser + iSelfSlotRollingShop + iSelfSlotRollingAgent + iSelfSlotRollingVAdmin + iSelfSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser + iSelfPBRollingShop + iSelfPBRollingAgent + iSelfPBRollingVAdmin + iSelfPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser - iSelfRollingShop - iSelfRollingAgent - iSelfRollingVAdmin - iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser - iSelfBRollingShop - iSelfBRollingAgent - iSelfBRollingVAdmin - iSelfBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser - iSelfUORollingShop - iSelfUORollingAgent - iSelfUORollingVAdmin - iSelfUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser - iSelfSlotRollingShop - iSelfSlotRollingAgent - iSelfSlotRollingVAdmin - iSelfSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser - iSelfPBRollingShop - iSelfPBRollingAgent - iSelfPBRollingVAdmin - iSelfPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eAdmin )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser + iSelfRollingShop + iSelfRollingAgent + iSelfRollingVAdmin + iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser + iSelfBRollingShop + iSelfBRollingAgent + iSelfBRollingVAdmin + iSelfBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser + iSelfUORollingShop + iSelfUORollingAgent + iSelfUORollingVAdmin + iSelfUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser + iSelfSlotRollingShop + iSelfSlotRollingAgent + iSelfSlotRollingVAdmin + iSelfSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser + iSelfPBRollingShop + iSelfPBRollingAgent + iSelfPBRollingVAdmin + iSelfPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser - iSelfRollingShop - iSelfRollingAgent - iSelfRollingVAdmin - iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser - iSelfBRollingShop - iSelfBRollingAgent - iSelfBRollingVAdmin - iSelfBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser - iSelfUORollingShop - iSelfUORollingAgent - iSelfUORollingVAdmin - iSelfUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser - iSelfSlotRollingShop - iSelfSlotRollingAgent - iSelfSlotRollingVAdmin - iSelfSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser - iSelfPBRollingShop - iSelfPBRollingAgent - iSelfPBRollingVAdmin - iSelfPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eProAdmin )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser + iSelfRollingShop + iSelfRollingAgent + iSelfRollingVAdmin + iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser + iSelfBRollingShop + iSelfBRollingAgent + iSelfBRollingVAdmin + iSelfBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser + iSelfUORollingShop + iSelfUORollingAgent + iSelfUORollingVAdmin + iSelfUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser + iSelfSlotRollingShop + iSelfSlotRollingAgent + iSelfSlotRollingVAdmin + iSelfSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser + iSelfPBRollingShop + iSelfPBRollingAgent + iSelfPBRollingVAdmin + iSelfPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser - iSelfRollingShop - iSelfRollingAgent - iSelfRollingVAdmin - iSelfRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser - iSelfBRollingShop - iSelfBRollingAgent - iSelfBRollingVAdmin - iSelfBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser - iSelfUORollingShop - iSelfUORollingAgent - iSelfUORollingVAdmin - iSelfUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser - iSelfSlotRollingShop - iSelfSlotRollingAgent - iSelfSlotRollingVAdmin - iSelfSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser - iSelfPBRollingShop - iSelfPBRollingAgent - iSelfPBRollingVAdmin - iSelfPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser + iSelfRollingShop + iSelfRollingAgent + iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser + iSelfBRollingShop + iSelfBRollingAgent + iSelfBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser + iSelfUORollingShop + iSelfUORollingAgent + iSelfUORollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser + iSelfSlotRollingShop + iSelfSlotRollingAgent + iSelfSlotRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser + iSelfPBRollingShop + iSelfPBRollingAgent + iSelfPBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser - iSelfRollingShop - iSelfRollingAgent - iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser - iSelfBRollingShop - iSelfBRollingAgent - iSelfBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser - iSelfUORollingShop - iSelfUORollingAgent - iSelfUORollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser - iSelfSlotRollingShop - iSelfSlotRollingAgent - iSelfSlotRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser - iSelfPBRollingShop - iSelfPBRollingAgent - iSelfPBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eAgent )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser + iSelfRollingShop + iSelfRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser + iSelfBRollingShop + iSelfBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser + iSelfUORollingShop + iSelfUORollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser + iSelfSlotRollingShop + iSelfSlotRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser + iSelfPBRollingShop + iSelfPBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser - iSelfRollingShop - iSelfRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser - iSelfBRollingShop - iSelfBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser - iSelfUORollingShop - iSelfUORollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser - iSelfSlotRollingShop - iSelfSlotRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser - iSelfPBRollingShop - iSelfPBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal    
        `;
    }
    else if ( iClass == EAgent.eShop )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser + iSelfRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser + iSelfBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser + iSelfUORollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser + iSelfSlotRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser + iSelfPBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser - iSelfRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser - iSelfBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser - iSelfUORollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser - iSelfSlotRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser - iSelfPBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eUser )
    {
        subQuery = `
            IFNULL((SELECT SUM(iSelfRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iSelfBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iSelfUORollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iSelfSlotRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iSelfPBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iSelfRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT SUM(-(iSelfBWinLose + iSelfUOWinLose + iSelfSlotWinLose + iSelfPBWinLose) - iSelfRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iSelfBWinLose - iSelfBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iSelfUOWinLose - iSelfUORollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iSelfSlotWinLose - iSelfSlotRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iSelfPBWinLose - iSelfPBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    return subQuery;
}

let GetDailyBettingQuery = (iClass, dateStart, dateEnd) => {
    let subQuery = '';
    if ( iClass == EAgent.eViceHQ )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin + iBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin + iUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin + iSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin + iPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            0 AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + (iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin)) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose - iBRollingUser - iBRollingShop - iBRollingAgent - iBRollingVAdmin - iBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose - iUORollingUser - iUORollingShop - iUORollingAgent - iUORollingVAdmin - iUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose - iSlotRollingUser - iSlotRollingShop - iSlotRollingAgent - iSlotRollingVAdmin - iSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose - iPBRollingUser - iPBRollingShop - iPBRollingAgent - iPBRollingVAdmin - iPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eAdmin )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin + iBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin + iUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin + iSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin + iPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            0 AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + (iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin)) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose - iBRollingUser - iBRollingShop - iBRollingAgent - iBRollingVAdmin - iBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose - iUORollingUser - iUORollingShop - iUORollingAgent - iUORollingVAdmin - iUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose - iSlotRollingUser - iSlotRollingShop - iSlotRollingAgent - iSlotRollingVAdmin - iSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose - iPBRollingUser - iPBRollingShop - iPBRollingAgent - iPBRollingVAdmin - iPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eProAdmin )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin + iBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin + iUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin + iSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin + iPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + (iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin)) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose + iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin + iBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose + iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin + iUORollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose + iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin + iSlotRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose + iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin + iPBRollingPAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + (iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin)) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose + iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose + iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose + iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose + iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eAgent )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser + iRollingShop + iRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser + iBRollingShop + iBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser + iUORollingShop + iUORollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser + iPBRollingShop + iPBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM(-(iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + (iRollingUser + iRollingShop + iRollingAgent)) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose + iBRollingUser + iBRollingShop + iBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose + iUORollingUser + iUORollingShop + iUORollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose + iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose + iPBRollingUser + iPBRollingShop + iPBRollingAgent) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal    
        `;
    }
    else if ( iClass == EAgent.eShop )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser + iRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser + iBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser + iUORollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser + iSlotRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser + iPBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + (iRollingUser + iRollingShop)) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose + iBRollingUser + iBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose + iUORollingUser + iUORollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose + iSlotRollingUser + iSlotRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose + iPBRollingUser + iPBRollingShop) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    else if ( iClass == EAgent.eUser )
    {
        subQuery = `
            IFNULL((SELECT -SUM(iRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iUORollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iSlotRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iPBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM(-(iBWinLose + iUOWinLose + iSlotWinLose + iPBWinLose) + iRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iBWinLose + iBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iUOWinLose + iUORollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iSlotWinLose + iSlotRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iPBWinLose + iPBRollingUser) FROM DailyBettingRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    }
    return subQuery;
}

/**
 * 회원목록 조회
 * 본사 목록
 */
var inline_GetComputedAgentTotal = async (strGroupID, iClass, dateStart, dateEnd, strSearchNickname) => {
    console.log(`############################################################################################### 2GetComputedAgentTotal : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd}`);
    let subQuery2 = GetDailyBettingQuery(iClass, dateStart, dateEnd);

    if (subQuery2 == '') {
        return null;
    }

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = ` AND t2.strNickname = '${strSearchNickname}'`;

    const [list] = await db.sequelize.query(`
        SELECT
        t2.iRolling AS iCurrentRolling,
        t2.iSettle AS iCurrentSettle,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT SUM(iSettleOrigin) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettle,
        ${subQuery2}
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
    `);
    return list;
};
exports.GetComputedAgentTotal = inline_GetComputedAgentTotal;


/**
 * 실시간 접속 목록
 */
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


exports.GetUserList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t6.strNickname='${strSearchNickname}'`;

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t5.strNickname as lev5, t6.strNickname as lev6, t6.iClass, t6.strID, t6.strNickname,
        t6.iCash, t6.iClass, t6.strGroupID, t6.eState, t6.createdAt, t6.loginedAt, t6.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput, 
        IFNULL(dailyBetting.iMyRollingMoney,0) AS iMyRollingMoney, 
        IFNULL((SELECT sum(iBBetting + iUOBetting + iSlotBetting + iPBBetting)-sum(iBWin + iUOWin + iSlotWin + iPBWin) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t6.strGroupID,'%') AND t6.strID = strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
        t6.iRolling AS iCurrentRolling,
        t6.iLoan
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'INPUT'
                    GROUP BY strID) charges
                ON t6.strNickname = charges.strID
        LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'OUTPUT'
                    GROUP BY strID) exchanges
                ON t6.strNickname = exchanges.strID
        LEFT JOIN ( SELECT strID, sum(iRollingUser) as iMyRollingMoney
                    FROM DailyBettingRecords
                    where DATE(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    GROUP BY strID) dailyBetting
                ON t6.strID = dailyBetting.strID
        WHERE t6.iClass=${IAgent.EAgent.eUser} AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `
    );
    return result;
}

exports.GetShopList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t5.strNickname='${strSearchNickname}'`;

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t5.strNickname as lev5, t5.strNickname as lev6, t5.iClass, t5.strID, t5.strNickname,
        t5.iCash, t5.iClass, t5.strGroupID, t5.eState, t5.createdAt, t5.loginedAt, t5.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput,
        IFNULL((SELECT sum(iSelfRollingShop) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t5.strGroupID,'%') AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t5.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
        t5.iRolling AS iCurrentRolling,
        t5.iLoan
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'INPUT'
                    GROUP BY strID) charges
                ON t5.strNickname = charges.strID
        LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'OUTPUT'
                    GROUP BY strID) exchanges
                ON t5.strNickname = exchanges.strID
        WHERE t5.iClass=${IAgent.EAgent.eShop} AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `
    );
    return result;
}

exports.GetAgentList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t4.strNickname='${strSearchNickname}'`;

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t4.strNickname as lev5, t4.strNickname as lev6, t4.iClass, t4.strID, t4.strNickname,
        t4.iCash, t4.iClass, t4.strGroupID, t4.eState, t4.createdAt, t4.loginedAt, t4.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput, 
        IFNULL((SELECT sum(iSelfRollingAgent) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID,'%') AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t4.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
        t4.iRolling AS iCurrentRolling,
        t4.iLoan
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'INPUT'
                    GROUP BY strID) charges
                ON t4.strNickname = charges.strID
        LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'OUTPUT'
                    GROUP BY strID) exchanges
                ON t4.strNickname = exchanges.strID
        WHERE t4.iClass=${IAgent.EAgent.eAgent} AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `
    );
    return result;
}

exports.GetViceAdminList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t3.strNickname='${strSearchNickname}'`;

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t3.strNickname as lev4, t3.strNickname as lev5, t3.strNickname as lev6, t3.iClass, t3.strID, t3.strNickname,
        t3.iCash, t3.iClass, t3.strGroupID, t3.eState, t3.createdAt, t3.loginedAt, t3.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput, 
        IFNULL((SELECT sum(iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t3.strGroupID,'%') AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t3.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
        t3.iRolling AS iCurrentRolling, 
        t3.iLoan
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'INPUT'
                    GROUP BY strID) charges
                ON t3.strNickname = charges.strID
        LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'OUTPUT'
                    GROUP BY strID) exchanges
                ON t3.strNickname = exchanges.strID
        WHERE t3.iClass=${IAgent.EAgent.eViceAdmin} AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `
    );
    return result;
}

exports.GetProAdminList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t3.strNickname='${strSearchNickname}'`;

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t3.strNickname as lev4, t3.strNickname as lev5, t3.strNickname as lev6, t3.iClass, t3.strID, t3.strNickname,
        t3.iCash, t3.iClass, t3.strGroupID, t3.eState, t3.createdAt, t3.loginedAt, t3.strIP,
        0 AS iInput,
        0 AS iOutput,
        IFNULL((SELECT sum(iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strID = t3.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t3.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
        t3.iRolling AS iCurrentRolling,
        t3.iLoan
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'INPUT'
                    GROUP BY strID) charges
                ON t3.strNickname = charges.strID
        LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
                    FROM Inouts
                    where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    AND eState = 'COMPLETE'
                    AND eType = 'OUTPUT'
                    GROUP BY strID) exchanges
                ON t3.strNickname = exchanges.strID
        WHERE t3.iClass=${IAgent.EAgent.eProAdmin} AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
        `
    );
    return result;
}