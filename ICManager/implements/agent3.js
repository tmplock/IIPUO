const db = require('../models');
const {Op, where, Sequelize}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

var kRealtimeObject = new IObject.IRealtimeBetting();

const EAgent = Object.freeze({"eHQ":1, "eViceHQ":2, "eAdmin":3, "eProAdmin":4, "eViceAdmin":5, "eAgent":6, "eShop":7, "eUser":8});
module.exports.EAgent = EAgent;

const { QueryTypes } = require('sequelize');
const moment = require("moment/moment");
const {debug} = require("nodemon/lib/utils");
const crypto = require("crypto");

const GameCodeList = [0, 100, 200, 300];

var kRealtimeObject = new IObject.IRealtimeBetting();

/**
 * 이용자 조회
 */
let inline_GetPopupAgentInfo = async (strGroupID, iClass, strNickname) => {
    if ( strGroupID == undefined || iClass == undefined || strNickname == undefined )
        return null;

    console.log(`############################# 2inline_GetPopupAgentInfo ${strGroupID}, ${strNickname}, ${iClass}`);

    if (iClass > 3) {
        const [users] = await db.sequelize.query(
            `
        SELECT              
            id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
            iCash, iRolling, iSettle, iSettleAcc, iSettleAccBefore, 
            fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
            fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB,
            DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
            DATE_FORMAT(updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
            eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
        FROM Users
        WHERE strNickname='${strNickname}';
        `
        );
        return users[0];
    } else {
        const [users] = await db.sequelize.query(
            `
        SELECT
            id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
            iCash, 0 AS iRolling, 0 AS iSettle, iSettleAcc, iSettleAccBefore,
            fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
            fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB,
            DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
            DATE_FORMAT(updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
            eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
        FROM Users
        WHERE strNickname='${strNickname}';
        `
        );
        return users[0];
    }


    switch ( iClass )
    {
        case EAgent.eViceHQ:
        {
            const [users] = await db.sequelize.query(
                `
                    SELECT
                        id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
                        iCash, iRolling, iSettle, iSettleAcc, iSettleAccBefore,
                        fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
                        fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB,
                        DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
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
                        u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
                        u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
                        u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
                        u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB,
                        DATE_FORMAT(u.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(u.updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser,
                    IFNULL((SELECT sum(iRollingB+iRollingUO+iRollingS+iRollingPBA+iRollingPBB) FROM RecordDailyOverviews WHERE strID = u.strID),0) as iRolling
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
                        u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
                        u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
                        u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
                        u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB,
                        DATE_FORMAT(u.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(u.updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser,
                        IFNULL((SELECT sum(iRollingB+iRollingUO+iRollingS+iRollingPBA+iRollingPBB) FROM RecordDailyOverviews WHERE strID = u.strID),0) as iRolling
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
                        u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
                        u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
                        u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
                        u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB,
                        DATE_FORMAT(u.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(u.updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser,
                        IFNULL((SELECT sum(iRollingB+iRollingUO+iRollingS+iRollingPBA+iRollingPBB) FROM RecordDailyOverviews WHERE strID = u.strID),0) as iRolling
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
                        u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
                        u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
                        u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
                        u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB,
                        DATE_FORMAT(u.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(u.updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser,
                        IFNULL((SELECT sum(iRollingB+iRollingUO+iRollingS+iRollingPBA+iRollingPBB) FROM RecordDailyOverviews WHERE strID = u.strID),0) as iRolling
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
                        u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
                        u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
                        u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
                        u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB,
                        DATE_FORMAT(u.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(u.updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser,
                        IFNULL((SELECT sum(iRollingB+iRollingUO+iRollingS+iRollingPBA+iRollingPBB) FROM RecordDailyOverviews WHERE strID = u.strID),0) as iRolling
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
                        u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
                        u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
                        u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
                        u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB,
                        DATE_FORMAT(u.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt,
                        DATE_FORMAT(u.updatedAt,'%Y-%m-%d %H:%i:%S') AS updatedAt,
                        u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser,
                        IFNULL((SELECT sum(iRollingB+iRollingUO+iRollingS+iRollingPBA+iRollingPBB) FROM RecordDailyOverviews WHERE strID = u.strID),0) as iRolling
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

    // user
    let user = await db.Users.findOne({
        where: {
            strID: strID
        }
    });

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
            let bet = GetSelfBetting(list[i], iClass, gameCode, user.fBaccaratR, user.fUnderOverR, user.fSlotR, 0);
            if (bet != null)
                data.kBettingInfo.push(bet);
        }
    }

    if ( iom.length > 0 )
    {
        data.iInput = parseFloat(iom[0].iInput);
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
        data.iInput = parseFloat(iom[0].iInput);
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

    let list = await db.RecordDailyOverviews.findAll({
        where: {
            strDate:{
                [Op.between]:[ strTimeStart, strTimeEnd ],
            },
            strID: `${strID}`
        },
        order:[['strDate','DESC']]
    });

    return list;
}
exports.GetBettingRecord = inline_GetBettingRecord;


/**
 * 일자별 정산 조회
 * 입금, 전환머니, 출금, 보유머니
 */
var inline_GetBettingRecordMoney = async (strTimeStart, strTimeEnd, strID) => {

    console.log(`############################# 2GetBettingRecord strTimeStart : ${strTimeStart}, strTimeEnd : ${strTimeEnd}`);

    const [rList]  = await db.sequelize.query(
        `        SELECT * FROM RecordDailyOverviews
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iRolling, 
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3) ,0) as iSettle,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iOutput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='ROLLING' OR Inouts.eType = 'SETTLE' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iExchange,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' then Inouts.iAmount ELSE 0 END),0) as iExchangeRolling,
                IFNULL(SUM(case when Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchangeSettle,
                0 AS iMyRollingMoney
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}' ${strQueryNickname}
            `
    );

    let list = await db.RecordDailyOverviews.findAll({
        where: {
            strDate:{
                [Op.between]:[ strTimeStart, strTimeEnd ],
            },
            strID: `${strID}`
        },
        order:[['strDate','DESC']]
    });

    return list;
}
exports.GetBettingRecordMoney = inline_GetBettingRecordMoney;
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
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3) ,0) as iSettle,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iOutput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='ROLLING' OR Inouts.eType = 'SETTLE' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iExchange,
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
                IFNULL((SELECT SUM(iRolling) FROM Users WHERE strNickname = '${strNickname}'),0) as iRolling,
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strNickname = '${strNickname}') ,0) as iSettle,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strNickname = '${strNickname}'),0) as iTotalMoney,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strID = '${strNickname}' AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strID = '${strNickname}' AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iOutput,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' OR Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchange,
                IFNULL(SUM(case when Inouts.eType = 'ROLLING' then Inouts.iAmount ELSE 0 END),0) as iExchangeRolling,
                IFNULL(SUM(case when Inouts.eType = 'SETTLE' then Inouts.iAmount ELSE 0 END),0) as iExchangeSettle,
                IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID='${strID}' AND date(strDate) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney
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
        let strQueryMyMoney = `IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,`;

        // if ( strNickname != undefined && strNickname != null )
        // {
        //     strQueryMyMoney = `IFNULL((SELECT SUM(iCash) FROM Users WHERE strNickname = '${strNickname}' AND iClass > '3' ),0) as iTotalMoney,`;
        // }

        let strQueryMyRolling = `0 as iMyRollingMoney,`;
        if ( iClass == 4 ) // 대본
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = '${strID}' AND date(strDate) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 5 ) // 부본
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = '${strID}' AND date(strDate) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 6 ) // 총판
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = '${strID}' AND date(strDate) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;
        else if ( iClass == 7 ) // 매장
            strQueryMyRolling = `IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = '${strID}' AND date(strDate) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iMyRollingMoney,`;

        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID = '${strGroupID}' AND iClass ='${iClass}'),0) as iRolling,
                IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID = '${strGroupID}' AND iClass ='${iClass}') ,0) as iSettle,
                ${strQueryMyMoney}
                ${strQueryMyRolling}
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'),0) as iOutput,
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

let inline_GetIOMFromDateList = async (strGroupID, iClass, strStartDate, strEndDate, strNickname, strID) => {

    console.log("############################# 2GetIOM " + strGroupID);

    let strQueryNickname = ``;

    if ( iClass == 1 || iClass == 2 || iClass == 3 )
    {
        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iOutput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='ROLLING' OR Inouts.eType = 'SETTLE' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iExchange
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'
            `
        );
        return rList;
    }
    else if ( iClass == 8 )
    {
        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iOutput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='ROLLING' OR Inouts.eType = 'SETTLE' AND eState = 'COMPLETE' AND strID = '${strNickname}' AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iExchange
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'
            `
        );
        return rList;
    }
    else
    {
        const [rList]  = await db.sequelize.query(
            `
                SELECT DATE(Inouts.createdAt) AS date,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3 ),0) as iTotalMoney,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iInput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iOutput,
                IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='ROLLING' OR Inouts.eType = 'SETTLE' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND date(createdAt) BETWEEN DATE(date) AND DATE(date)),0) as iExchange
                from Inouts 
                LEFT OUTER JOIN Users
                ON Inouts.strAdminNickname = Users.strNickname
                WHERE Inouts.strGroupID LIKE CONCAT('${strGroupID}','%') AND Inouts.eState = 'COMPLETE' AND DATE(Inouts.createdAt) BETWEEN '${strStartDate}' AND '${strEndDate}'
            `
        );
        return rList;
    }
}
exports.GetIOMFromDateList = inline_GetIOMFromDateList;

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

    let user = await db.Users.findOne({
        where: {
            strID: strID
        }
    });

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
            let bet = GetSelfBetting(records[i], iClass, gameCode, user.fBaccaratR, user.fUnderOverR, user.fSlotR, 0);
            if (bet != null)
                list[iCurrent].kBettingInfo.push(bet);
        }
    }

    for ( let date in iom)
    {
        let iCurrent = FindIndexFromBettingRecord(iom[date].strDate, list);
        if ( iCurrent == -1 )
            continue;

        list[iCurrent].iInput = parseFloat(iom[date].iInput);
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
    let iom = await inline_GetIOMFromDateList(strGroupID, iClass, dateStart, dateEnd, strNickname, strID);
    var iCurrent = -1;
    var list = [];

    // let dt = new Date(dateEnd);
    // let now = new Date();
    // if (dt > now) {
    //     dt = moment(now).format('YYYY-MM-DD');
    // }

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
        var td = records[i].strDate;

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

        list[iCurrent].iInput = parseFloat(iom[date].iInput);
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
 * 베팅 금액이 없으면 0, 롤링값도 재계산 0.01
 */
let GetSelfBetting = (daiyBetting, iClass, iGameCode, fB, fUO, fS, fPB) => {
    if (iGameCode == 0) {
        if (parseFloat(daiyBetting.iBetB) > 0) {
            return {iBetting:daiyBetting.iBetB, iWin:daiyBetting.iWinB, iRolling:(daiyBetting.iBetB)*fB*0.01, iTarget:0, iGameCode:iGameCode};
        }
        return {iBetting:0, iWin:0, iRolling:0, iTarget:0, iGameCode:iGameCode};
    } else if (iGameCode == 100) {
        if (parseFloat(daiyBetting.iBetUO) > 0) {
            return {iBetting:daiyBetting.iBetUO, iWin:daiyBetting.iWinUO, iRolling:(daiyBetting.iBetUO)*fUO*0.01, iTarget:0, iGameCode:iGameCode};
        }
        return {iBetting:0, iWin:0, iRolling:0, iTarget:0, iGameCode:iGameCode};
    } else if (iGameCode == 200) {
        if (parseFloat(daiyBetting.iBetS) > 0) {
            return {iBetting:daiyBetting.iBetS, iWin:daiyBetting.iWinS, iRolling:(daiyBetting.iBetS)*fS*0.01, iTarget:0, iGameCode:iGameCode};
        }
        return {iBetting:0, iWin:0, iRolling:0, iTarget:0, iGameCode:iGameCode};
    } else if (iGameCode == 300) {
        if (parseFloat(daiyBetting.iBetPB) > 0) {
            return {iBetting:daiyBetting.iBetPB, iWin:daiyBetting.iWinPB, iRolling:(daiyBetting.iBetPB)*fPB*0.01, iTarget:0, iGameCode:iGameCode};
        }
        return {iBetting:0, iWin:0, iRolling:0, iTarget:0, iGameCode:iGameCode};
    }
    return null;
}

/**
 * 본인 + 하위파트너 배팅
 */
let GetBetting = (daiyBetting, iClass, iGameCode) => {
    if (iGameCode == 0) {
        return {iBetting:daiyBetting.iAgentBetB, iWin:daiyBetting.iAgentWinB, iRolling:daiyBetting.iAgentRollingB, iTarget:0, iGameCode:iGameCode};
    } else if (iGameCode == 100) {
        return {iBetting:daiyBetting.iAgentBetUO, iWin:daiyBetting.iAgentWinUO, iRolling:daiyBetting.iAgentRollingUO, iTarget:0, iGameCode:iGameCode};
    } else if (iGameCode == 200) {
        return {iBetting:daiyBetting.iAgentBetS, iWin:daiyBetting.iAgentWinS, iRolling:daiyBetting.iAgentRollingS, iTarget:0, iGameCode:iGameCode};
    } else if (iGameCode == 300) {
        return {iBetting:daiyBetting.iAgentBetPB, iWin:daiyBetting.iAgentWinPB, iRolling:(daiyBetting.iAgentRollingPBA) + (daiyBetting.iAgentRollingPBB), iTarget:0, iGameCode:iGameCode};
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
    let subQuery3 = `
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
    `;
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
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentRollingTotal
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
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentRollingTotal
        `;
    }
    else if ( iClass == EAgent.eProAdmin )
    {
        subQuery = `
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eViceAdmin}),0) as iNumViceAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE t2.strID = strID AND iClass > 3), 0) AS iCurrentRollingTotal
            
        `;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        subQuery = `
            0 as iNumViceAdmins,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eAgent}),0) as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentRollingTotal
        `;
    }
    else if ( iClass == EAgent.eAgent )
    {
        subQuery = `
            0 as iNumViceAdmins,
            0 as iNumAgents,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eShop}),0) as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentRollingTotal    
        `;
    }
    else if ( iClass == EAgent.eShop )
    {
        subQuery = `
            0 as iNumViceAdmins,
            0 as iNumAgents,
            0 as iNumShops,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as iTotalMoney,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentRollingTotal
        `;
    }
    else if ( iClass == EAgent.eUser )
    {
        subQuery = `
            0 as iNumViceAdmins,
            0 as iNumAgents,
            0 as iNumShops,
            0 as iNumUsers,
            IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentRollingTotal
        `;
        subQuery3 = `
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strID = t2.strNickname AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strID = t2.strNickname AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
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
        t2.id, t2.strID, t2.strNickname, t2.iClass, t2.iPermission, t2.strGroupID, t2.iParentID,
        t2.iCash, t2.iRolling, t2.iSettle, t2.iSettleAcc, t2.iSettleAccBefore,
        t2.fBaccaratR, t2.fSlotR, t2.fUnderOverR, t2.fPBR, t2.fPBSingleR, t2.fPBDoubleR, t2.fPBTripleR,
        t2.fSettleBaccarat, t2.fSettleSlot, t2.fSettlePBA, t2.fSettlePBB, t2.createdAt, t2.updatedAt,
        t2.eState, t2.strIP, t2.strOptionCode, t2.strSettleMemo, t2.iRelUserID, t2.fCommission, t2.iPassCheckNewUser,
        t2.iCash as iMyMoney,
        CASE
            WHEN t2.iClass > 3 THEN t2.iRolling
            ELSE 0
        END AS iCurrentRolling,
        CASE
            WHEN t2.iClass > 3 THEN t2.iSettle
            ELSE 0
        END AS iCurrentSettle,
        CASE
            WHEN t2.iClass > 3 THEN t2.iSettleAcc
            ELSE 0
        END AS iCurrentSettleAcc,
        ${subQuery3},    
        IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS iCurrentSettleTotal
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iPermission != 100 AND t2.iClass=${iClass} AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch}
        ORDER BY t2.strNickname ASC
        ;
    `);
    return list;
};
exports.GetComputedAgentList = inline_GetComputedAgentList;

/**
 * RecordDailyOverviews에서 파트너,유저 데이터 조회 컬럼
 */
let GetSelfDailyBettingQuery = (iClass, dateStart, dateEnd) => {
    let subQuery = '';
    subQuery = `
            IFNULL((SELECT SUM(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT SUM(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iWinB + iWinUO + iWinS + iWinPB) - (iBetB + iBetUO + iBetS + iBetPB) + (iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB)) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iWinB - iBetB - iRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iWinUO - iBetUO - iRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iWinS - iBetS - iRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iWinPB - iBetPB - iRollingPBA - iRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    return subQuery;
}

let GetDailyBettingQuery = (iClass, dateStart, dateEnd) => {
    let subQuery = '';

    if ( iClass == EAgent.eViceHQ || iClass == EAgent.eAdmin ) {
        subQuery = `
            IFNULL((SELECT SUM(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT SUM(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT SUM(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT SUM(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT SUM(iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            0 AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) - (iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) + (iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB)) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT SUM(iAgentBetB - iAgentWinB - iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT SUM(iAgentBetUO - iAgentWinUO - iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT SUM(iAgentBetS - iAgentWinS - iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT SUM(iAgentBetPB - iAgentWinPB - iAgentRollingPBA - iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    } else if (iClass == EAgent.eProAdmin) {
        subQuery = `
            IFNULL((SELECT -SUM(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) - (iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) + (iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB)) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iAgentWinB - iAgentBetB + iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iAgentWinUO - iAgentBetUO + iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iAgentWinS - iAgentBetS + iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iAgentWinPB - iAgentBetPB + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
        `;
    } else {
        subQuery = `
            IFNULL((SELECT -SUM(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotRollingMoney,
            IFNULL((SELECT -SUM(iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBRollingMoney,
            IFNULL((SELECT -SUM(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iMyRollingMoney,
            IFNULL((SELECT -SUM((iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) - (iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) + (iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB)) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iTotal,
            IFNULL((SELECT -SUM(iAgentWinB - iAgentBetB + iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iBaccaratTotal,
            IFNULL((SELECT -SUM(iAgentWinUO - iAgentBetUO + iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iUnderOverTotal,
            IFNULL((SELECT -SUM(iAgentWinS - iAgentBetS + iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iSlotTotal,
            IFNULL((SELECT -SUM(iAgentWinPB - iAgentBetPB + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND strDate BETWEEN '${dateStart}' AND '${dateEnd}'), 0) AS iPBTotal
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
        CASE
            WHEN t2.iClass > 3 THEN t2.iRolling
            ELSE 0
        END AS iCurrentRolling,
        CASE
            WHEN t2.iClass > 3 THEN t2.iSettle
            ELSE 0
        END AS iCurrentSettle,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
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
    const realtime_list = await db.RecordBets.findAll({where:{iGameCode:iGameCode,
            eType: {
                [Op.in] : ['BET', 'WIN']
            },
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


exports.GetUserList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname, bOnToday) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t6.strNickname='${strSearchNickname}'`;

    let isOnToday = bOnToday ?? false;
    if (isOnToday == true) {
        tagSearch = `${tagSearch} AND DATE(t6.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'`;
    }

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t5.strNickname as lev5, t6.strNickname as lev6, t6.iClass, t6.strID, t6.strNickname,
        t6.iCash, t6.iClass, t6.strGroupID, t6.eState, DATE_FORMAT(t6.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, DATE_FORMAT(t6.loginedAt,'%Y-%m-%d %H:%i:%S') AS loginedAt, t6.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput, 
        IFNULL(dailyBetting.iMyRollingMoney,0) AS iMyRollingMoney, 
        IFNULL((SELECT sum(iBetB + iBetUO + iBetS + iBetPB)-sum(iWinB + iWinUO + iWinS + iWinPB) FROM RecordDailyOverviews WHERE t6.strID = strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
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
        LEFT JOIN ( SELECT strID, sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) as iMyRollingMoney
                    FROM RecordDailyOverviews
                    where DATE(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
                    GROUP BY strID) dailyBetting
                ON t6.strID = dailyBetting.strID
        WHERE t6.iClass=${EAgent.eUser} AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%') ${tagSearch};
        `
    );
    return result;
}

exports.GetShopList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname, bOnToday) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t5.strNickname='${strSearchNickname}'`;

    let isOnToday = bOnToday ?? false;
    if (isOnToday == true) {
        tagSearch = `${tagSearch} AND DATE(t5.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'`;
    }

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t5.strNickname as lev5, t5.strNickname as lev6, t5.iClass, t5.strID, t5.strNickname,
        t5.iCash, t5.iClass, t5.strGroupID, t5.eState, DATE_FORMAT(t5.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, DATE_FORMAT(t5.loginedAt,'%Y-%m-%d %H:%i:%S') AS loginedAt, t5.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput,
        IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iBetB + iBetUO + iBetS + iBetPB)-sum(iWinB + iWinUO + iWinS + iWinPB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
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
        WHERE t5.iClass=${EAgent.eShop} AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%') ${tagSearch};
        `
    );
    return result;
}

exports.GetAgentList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname, bOnToday) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t4.strNickname='${strSearchNickname}'`;

    let isOnToday = bOnToday ?? false;
    if (isOnToday == true) {
        tagSearch = `${tagSearch} AND DATE(t4.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'`;
    }

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t4.strNickname as lev5, t4.strNickname as lev6, t4.iClass, t4.strID, t4.strNickname,
        t4.iCash, t4.iClass, t4.strGroupID, t4.eState, DATE_FORMAT(t4.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, DATE_FORMAT(t4.loginedAt,'%Y-%m-%d %H:%i:%S') AS loginedAt, t4.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput, 
        IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t4.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iBetB + iBetUO + iBetS + iBetPB)-sum(iWinB + iWinUO + iWinS + iWinPB) FROM RecordDailyOverviews WHERE strID = t4.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
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
        WHERE t4.iClass=${EAgent.eAgent} AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%') ${tagSearch};
        `
    );
    return result;
}

exports.GetViceAdminList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname, bOnToday) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t3.strNickname='${strSearchNickname}'`;

    let isOnToday = bOnToday ?? false;
    if (isOnToday == true) {
        tagSearch = `${tagSearch} AND DATE(t3.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'`;
    }

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t3.strNickname as lev4, t3.strNickname as lev5, t3.strNickname as lev6, t3.iClass, t3.strID, t3.strNickname,
        t3.iCash, t3.iClass, t3.strGroupID, t3.eState, DATE_FORMAT(t3.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, DATE_FORMAT(t3.loginedAt,'%Y-%m-%d %H:%i:%S') AS loginedAt, t3.strIP,
        IFNULL(charges.iInput,0) AS iInput, 
        IFNULL(exchanges.iOutput,0) AS iOutput, 
        IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t3.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iBetB + iBetUO + iBetS + iBetPB)-sum(iWinB + iWinUO + iWinS + iWinPB) FROM RecordDailyOverviews WHERE strID = t3.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
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
        WHERE t3.iClass=${EAgent.eViceAdmin} AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%') ${tagSearch};
        `
    );
    return result;
}

exports.GetProAdminList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname, bOnToday) => {

    let tagSearch = '';
    if ( strSearchNickname != undefined && strSearchNickname != '' )
        tagSearch = `AND t3.strNickname='${strSearchNickname}'`;

    let isOnToday = bOnToday ?? false;
    if (isOnToday == true) {
        tagSearch = `${tagSearch} AND DATE(t3.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'`;
    }

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t3.strNickname as lev4, t3.strNickname as lev5, t3.strNickname as lev6, t3.iClass, t3.strID, t3.strNickname,
        t3.iCash, t3.iClass, t3.strGroupID, t3.eState, DATE_FORMAT(t3.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, DATE_FORMAT(t3.loginedAt,'%Y-%m-%d %H:%i:%S') AS loginedAt, t3.strIP,
        0 AS iInput,
        0 AS iOutput,
        IFNULL((SELECT sum(iRollingB + iRollingUO + iRollingS + iRollingPBA + iRollingPBB) FROM RecordDailyOverviews WHERE strID = t3.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
        IFNULL((SELECT sum(iBetB + iBetUO + iBetS + iBetPB)-sum(iWinB + iWinUO + iWinS + iWinPB) FROM RecordDailyOverviews WHERE strID = t3.strID AND date(strDate) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
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
        WHERE t3.iClass=${EAgent.eProAdmin} AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%') ${tagSearch};
        `
    );
    return result;
}

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

var inline_GetParentList = async (strGroupID, iClass, user) => {

    console.log(`GetParentList : ${strGroupID}, ${iClass}`);

    let strParents = '';

    let objectData = {strAdmin:'', strPAdmin:'', strVAdmin:'', strAgent:'', strShop:'', strParents:''};

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

        if ( result.length > 0 ) {
            if (user != null) {
                strParents = user.iRootClass <= 3 ? `[본사]${result[0].lev1} ▶ [대본]${result[0].lev2} ▶ [부본]${result[0].lev3} ▶ [총판]${result[0].lev4} ▶ [매장]${result[0].lev5} ▶ [회원] ${user.strNickname}(${user.strID})` : `[매장]${result[0].lev5} ▶ [회원] ${user.strNickname}(${user.strID})`;
            }
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:result[0].lev5, strParents:strParents};
        }
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

        if ( result.length > 0 ) {
            if (user != null) {
                strParents =  user.iRootClass <= 3 ? `[본사]${result[0].lev1} ▶ [대본]${result[0].lev2} ▶ [부본]${result[0].lev3} ▶ [총판]${result[0].lev4} ▶ [매장] ${user.strNickname}(${user.strID})` : `[총판]${result[0].lev4} ▶ [매장] ${user.strNickname}(${user.strID})`;
            }
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:'', strParents: strParents};
        }
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

        if ( result.length > 0 ) {
            if (user != null) {
                strParents = user.iRootClass <= 3 ? `[본사]${result[0].lev1} ▶ [대본]${result[0].lev2} ▶ [부본]${result[0].lev3} ▶ [총판] ${user.strNickname}(${user.strID})` : `[부본]${result[0].lev3} ▶ [총판] ${user.strNickname}(${user.strID})`;
            }
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:'', strShop:'', strParents: strParents};
        }
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

        if ( result.length > 0 ) {
            if (user != null) {
                strParents = user.iRootClass <= 3 ? `[본사]${result[0].lev1} ▶ [대본]${result[0].lev2} ▶ [부본] ${user.strNickname}(${user.strID})` : `[대본]${result[0].lev2} ▶ [부본] ${user.strNickname}(${user.strID})`;
            }
            objectData = {strAdmin:result[0].lev1, strPAdmin:result[0].lev2, strVAdmin:'', strAgent:'', strShop:'', strParents: strParents};
        }
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

        if ( result.length > 0 ) {
            if (user != null) {
                strParents = user.iRootClass <= 3 ? `[본사]${result[0].lev1} ▶ [대본] ${user.strNickname}(${user.strID})` : `[본사]${result[0].lev1} ▶ [대본] ${user.strNickname}(${user.strID})`;
            }
            objectData = {strAdmin:result[0].lev1, strPAdmin:'', strVAdmin:'', strAgent:'', strShop:'', strParents: strParents};
        }
    }
    else if ( iClass == 3 )
    {
        if (user != null) {
            strParents = `[본사] ${user.strNickname}(${user.strID})`;
        }
        objectData = {strAdmin:'', strPAdmin:'', strVAdmin:'', strAgent:'', strShop:'', strParents: strParents};
    }
    else if ( iClass == 2 )
    {
        if (user != null) {
            strParents = `[총본] ${user.strNickname}(${user.strID})`;
        }
        objectData = {strAdmin:'', strPAdmin:'', strVAdmin:'', strAgent:'', strShop:'', strParents: strParents};
    }
    return objectData;
}
exports.GetParentList = inline_GetParentList;

var inline_CalculateDailyBettingRecord = async (iGameCode, strGroupID, iClass, strNickname) => {

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    console.log(`CalculateDailyBettingRecord ${dateStart, dateEnd}`);

    return inline_CalculateBettingRecord(iGameCode, strGroupID, iClass, dateStart, dateEnd, strNickname);
}
exports.CalculateDailyBettingRecord = inline_CalculateDailyBettingRecord;


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

let inline_GetPopupShareInfo = async (strID, strGroupID) => {
    if ( strID == undefined )
        return null;

    const list = await db.sequelize.query(`
        SELECT u.strNickname AS parentNickname, su.strNickname AS strNickname, su.strID AS strID, su.strGroupID AS strGroupID,  
        su.fShareR AS fShareR, 
        0 AS iShare,
        0 AS iShareAccBefore,       
        su.iCreditBefore AS iCreditBefore,
        su.iCreditAfter AS iCreditAfter
        FROM ShareUsers su
        LEFT JOIN Users u ON u.strID = su.strID
        WHERE su.strGroupID LIKE CONCAT('${strGroupID}', '%')
    `);
    return list[0];
}
exports.GetPopupShareInfo = inline_GetPopupShareInfo;


let inline_GetPopupGetShareInfo = async (strID, strGroupID, strQuater) => {
    if ( strID == undefined )
        return null;

    const list = await db.sequelize.query(`
        SELECT u.strNickname AS parentNickname, sr.strNickname AS strNickname, u.strID,
            sr.iShareOrgin, sr.iSlotCommission, sr.iPayback AS iPayback, sr.iShareReceive AS iShareReceive,
            sr.fShareR AS fShareR,
            sr.iShare AS iShare,
            sr.iShareAccBefore AS iShareAccBefore,
            sr.iCreditBefore AS iCreditBefore,
            sr.iCreditAfter AS iCreditAfter
        FROM ShareRecords sr
        LEFT JOIN ShareUsers su ON su.strNickname = sr.strNickname
        LEFT JOIN Users u ON u.strID = su.strID
        WHERE sr.strQuater = '${strQuater}' AND sr.strGroupID LIKE CONCAT('${strGroupID}', '%')
    `);
    return list[0];
}
exports.GetPopupGetShareInfo = inline_GetPopupGetShareInfo;

var inline_GetChildNicknameList = async (strGroupID, iClass) => {

    let children = await db.Users.findAll({
        attributes: ['strNickname'],
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

var inline_GetUserInfo = async (strNickname) => {
    let strID = '';
    let iClass = '';
    let strGroupID = '';
    let iCash = 0;
    let iRolling = 0;
    let iSettle = 0;
    let strOptionCode = '';
    let strIDRel = '' // 연결된 strID
    let strNicknameRel = '' // 연결된 strNickname
    let iSettleAcc = 0;

    let fBaccaratR = 0;
    let fSlotR = 0;
    let fUnderOverR = 0;
    let fPBR = 0;
    let fPBSingleR = 0;
    let fPBDoubleR = 0;
    let fPBTripleR = 0;

    let iRelUserID = 0;

    let iPermission = 0;

    let dbuser = await db.Users.findOne({where:{strNickname:strNickname}});
    if (dbuser != null) {
        strID = dbuser.strID;
        iPermission = dbuser.iPermission;
        // 연결된 이용자 정보
        iRelUserID = dbuser.iRelUserID ?? 0;
        if (iRelUserID != 0) {
            dbuser = await db.Users.findOne({where: {id: dbuser.iRelUserID}});
            strIDRel = dbuser.strID;
            strNicknameRel = dbuser.strNickname;
        }

        if ( dbuser != null ) {
            iCash = dbuser.iCash;
            iRolling = dbuser.iRolling;
            iSettle = dbuser.iSettle;
            iClass = dbuser.iClass;
            strGroupID = dbuser.strGroupID;
            strOptionCode = dbuser.strOptionCode;
            iSettleAcc = dbuser.iSettleAcc;

            fBaccaratR = dbuser.fBaccaratR;
            fSlotR = dbuser.fSlotR;
            fUnderOverR = dbuser.fUnderOverR;
            fPBR = dbuser.fPBR;
            fPBSingleR = dbuser.fPBSingleR;
            fPBDoubleR = dbuser.fPBDoubleR;
            fPBTripleR = dbuser.fPBTripleR;
        }
    }

    return {iCash:iCash, iRolling: iRolling, iSettle:iSettle, strID:strID, strNickname:strNickname, iClass:iClass, strGroupID:strGroupID, strOptionCode:strOptionCode, iSettleAcc: iSettleAcc,
        strIDRel: strIDRel, strNicknameRel: strNicknameRel, iPermission:iPermission,
        fBaccaratR: fBaccaratR, fSlotR: fSlotR, fUnderOverR: fUnderOverR, fPBR: fPBR, fPBSingleR: fPBSingleR, fPBDoubleR: fPBDoubleR, fPBTripleR: fPBTripleR};
}
exports.GetUserInfo = inline_GetUserInfo;

var inline_GetSecUserList = async (list) => {
    let newList = [];
    for (let i in list) {
        let obj = list[i];
        obj.strBankName = '';
        obj.strAccountNumber = '';
        obj.strBankHolder = '';
        newList.push(obj);
    }
    return newList;
}
exports.GetSecUserList = inline_GetSecUserList;

var inline_GetSecUserInfo = async (obj) => {
    obj.strBankName = '';
    obj.strAccountNumber = '';
    obj.strBankHolder = '';
    return obj;
}
exports.GetSecUserInfo = inline_GetSecUserInfo;

var inline_GetCipher = async (str) => {
    if (str == null || str == undefined || str.length == 0) {
        return '';
    }

    try {
        const algorithm = process.env.SEC_ALGORITHM;
        const key = process.env.SEC_KEY;
        const iv = process.env.SEC_IV;

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let result = cipher.update(str, 'utf8', 'base64');
        result += cipher.final('base64');
        return result;
    } catch (err) {
        return str;
    }

}
exports.GetCipher = inline_GetCipher;

var inline_GetDeCipher = async (str) => {
    if (str == null || str == undefined || str.length == 0) {
        return '';
    }
    try {
        const algorithm = process.env.SEC_ALGORITHM;
        const key = process.env.SEC_KEY;
        const iv = process.env.SEC_IV;

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let result = decipher.update(str, 'base64', 'utf8');
        result += decipher.final('utf8');
        return result;
    } catch (err) {
        return str;
    }
}
exports.GetDeCipher = inline_GetDeCipher;
