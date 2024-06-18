const db = require('../models');
const {Op, where, Sequelize}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

var kRealtimeObject = new IObject.IRealtimeBetting();

const EAgent = Object.freeze({"eHQ":1, "eViceHQ":2, "eAdmin":3, "eProAdmin":4, "eViceAdmin":5, "eAgent":6, "eShop":7, "eUser":8});
module.exports.EAgent = EAgent;

const { QueryTypes } = require('sequelize');
const moment = require("moment/moment");

const GameCodeList = [0, 100, 200, 300];

const cfCommission = 0.085; // 8.5 * 0.01
// const cfCommission = 0.1; // 8.5 * 0.01


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
var inline_GetAgentListForSettle = async (strGroupID, iClass, strQuater, dateStart, dateEnd, strNickname, iSettleDays, iSettleType) => {

    console.log(`############################################################################################### 2GetAgentListForSettle : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd}`);

    let strQuater2 = GetBeforeQuater(strQuater, iSettleDays);

    let subQuery = '';
    if ( iClass == EAgent.eProAdmin )
    {
        subQuery = `
            IFNULL((SELECT iSettleOrigin FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleOrigin,
            IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAcc,
        `;
    }

    let subQuery11 = `
            IFNULL((SELECT sum(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
            IFNULL((SELECT sum(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
            IFNULL((SELECT sum(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
            IFNULL((SELECT sum(iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
            
            IFNULL((SELECT sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
            
            IFNULL((SELECT -sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
            IFNULL((SELECT -sum(-(iAgentBetB - iAgentWinB) + iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
            IFNULL((SELECT -sum(-(iAgentBetUO - iAgentWinUO) + iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
            IFNULL((SELECT -sum(-(iAgentBetS - iAgentWinS) + iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
            IFNULL((SELECT -sum(-(iAgentBetPB - iAgentWinPB) + iAgentRollingPBA) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
            IFNULL((SELECT -sum(-(iAgentBetPB - iAgentWinPB) + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,

            IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
            IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
            IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
            IFNULL((SELECT sum(iAgentBetPB - iAgentWinPB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose
    `;

    let subQuery2 = `
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
    `;
    if ( iClass == EAgent.eUser ) {
        subQuery2 = `
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
        `;
    }

    const [list] = await db.sequelize.query(`
        SELECT
        t2.*, t2.iSettleAcc AS iSettleAccUser, t2.iCash as iMyMoney,
        IFNULL((SELECT iSettleAccTotal FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater2}'),0) as iSettleAccTotalBefore,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        ${subQuery2},
        ${subQuery}
        ${subQuery11}
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%') AND t2.iSettleDays = ${iSettleDays} AND t2.iSettleType = ${iSettleType}
    `);
    console.log(list);
    return list;
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


let inline_CalculateOverviewSettleCurrent = async (strGroupID, strQuater, iSettleDays) => {
    let data = {iSettlePlus:0, iSettleMinus:0, iCurrentTotalSettle:0};

    let list = await db.SettleRecords.findAll({
        where: {
            strQuater: strQuater,
            iClass: {
                [Op.in]:[4,5]
            },
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });

    if (list.length == 0) {
        list = await db.SettleRecords.findAll({
            where: {
                strQuater: GetBeforeQuater(strQuater, iSettleDays),
                iClass: {
                    [Op.in]:[4,5]
                },
                strGroupID: {
                    [Op.like]:`${strGroupID}%`
                }
            }
        });
    }

    for (let i in list) {
        const iSettleAfter = parseFloat(list[i].iSettleAfter ?? 0);
        if (iSettleAfter > 0) {
            data.iSettlePlus += iSettleAfter;
        } else {
            data.iSettleMinus += iSettleAfter;
        }
        data.iCurrentTotalSettle += iSettleAfter;
    }
    return data;
};
exports.CalculateOverviewSettleCurrent = inline_CalculateOverviewSettleCurrent;
let inline_CalculateOverviewSettle = async (strGroupID, iClass, strQuater, dateStart, dateEnd) => {

    let iTotalSettle = `IFNULL((SELECT sum(iSettle) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalSettle,`;
    if (iClass > 3) {
        iTotalSettle = `IFNULL((SELECT sum(iSettle) FROM SettleRecords WHERE strNickname = t1.strNickname AND strQuater = '${strQuater}'),0) as iTotalSettle,`;
    }
    let iRolling = `IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' ),0) as iRolling,`;
    if (iClass > 4) {
        iRolling = `IFNULL((SELECT SUM(iRolling) FROM Users WHERE strNickname = t1.strNickname AND iClass > '4' ),0) as iRolling,`;
    }

    let subQuery = `
        IFNULL((SELECT sum(iAgentBetB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBetting,
        IFNULL((SELECT sum(iAgentBetUO) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingUnover,
        IFNULL((SELECT sum(iAgentBetS) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingSlot,
        IFNULL((SELECT sum(iAgentBetPB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingPB,
        
        IFNULL((SELECT sum(iAgentWinB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWin,
        IFNULL((SELECT sum(iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinUnover,
        IFNULL((SELECT sum(iAgentWinS) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinSlot,
        IFNULL((SELECT sum(iAgentWinPB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinPB,
    
        IFNULL((SELECT sum(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRolling,
        IFNULL((SELECT sum(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingUnover,
        IFNULL((SELECT sum(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingSlot,
        IFNULL((SELECT sum(iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingPB,
        
        IFNULL((SELECT sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        
        IFNULL((SELECT sum(iAgentBetB - iAgentWinB - iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO - iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalUnover,
        IFNULL((SELECT sum(iAgentBetS - iAgentWinS - iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalSlot,
        IFNULL((SELECT sum(iAgentBetPB - iAgentWinPB - iAgentRollingPBA - iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalPB,
        
        IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLose,
        IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLoseUnover,
        IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLoseSlot,
        IFNULL((SELECT sum(iAgentBetPB - iAgentWinPB) FROM RecordDailyOverviews WHERE strID = t1.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLosePB
    `;

    const [list] = await db.sequelize.query(`
        SELECT
        IFNULL(t1.fCommission, ${cfCommission}) AS fCommission,
        IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iSettleCount,
        ${iTotalSettle}
        IFNULL((SELECT SUM(iSettleAccTotal) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iTotalSettleAcc,
        IFNULL((SELECT SUM(iSettleAcc - iPayback) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iTotalSettleBeforeAcc1,
        IFNULL((SELECT SUM(iSettleBeforeAcc + iPayback) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iTotalSettleBeforeAcc2,
        IFNULL((SELECT sum(iCommissionB)+sum(iCommissionS) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalCommission,
        IFNULL((SELECT sum(iSettleGive) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}' AND iClass IN (4,5)),0) as iSettleGive,
        IFNULL((SELECT sum(iSWinlose) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}' AND iClass = 4 AND fSettleSlot = 0),0) as iSWinlose,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        ${iRolling}
        IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3) ,0) as iSettle,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' ),0) as iTotalMoney,
        IFNULL((SELECT SUM(iSettleAcc) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > 3) ,0) as iSettleAcc,
        IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iInput,
        IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        ${subQuery}
        FROM Users AS t1
        WHERE t1.iClass='${iClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');
    `);

    return list;
};
exports.CalculateOverviewSettle = inline_CalculateOverviewSettle;



/**
 * 죽장 정산 Overview 내 지분자 정보
 */
let inline_CalculateOverviewShareCurrent = async (strGroupID, strQuater, iSettleDays) => {
    let data = {iSharePlus:0, iShareMinus:0, iCurrentTotalShare:0};

    let list = await db.ShareRecords.findAll({
        where: {
            strQuater: strQuater,
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });

    if (list.length == 0) {
        // 이전분기에서 한번더 검색
        list = await db.ShareRecords.findAll({
            where: {
                strQuater: GetBeforeQuater(strQuater, iSettleDays),
                strGroupID: {
                    [Op.like]:`${strGroupID}%`
                }
            }
        });
    }

    for (let i in list) {
        const iCreditAfter = parseFloat(list[i].iCreditAfter ?? 0);
        if (iCreditAfter > 0) {
            data.iSharePlus += iCreditAfter;
        } else {
            data.iShareMinus += iCreditAfter;
        }
        data.iCurrentTotalShare += iCreditAfter;
    }

    return data;
};
exports.CalculateOverviewShareCurrent = inline_CalculateOverviewShareCurrent;

/**
 * 죽장 정산 Overview 내 지분자 정보
 */
let inline_CalculateOverviewShare = async (strGroupID, strQuater) => {
    const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT SUM(iShareOrgin) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iShareOrgin,
        IFNULL((SELECT SUM(iShare) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iShare,
        IFNULL((SELECT SUM(iSlotCommission) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iSlotCommission,
        IFNULL((SELECT SUM(iPayback) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iPayback,
        IFNULL((SELECT SUM(iShareAccBefore) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iShareAccBefore,
        IFNULL((SELECT SUM(iCreditBefore) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iCreditBefore,
        IFNULL((SELECT SUM(iCreditAfter) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iCreditAfter
        FROM ShareRecords AS sr
        WHERE sr.strGroupID LIKE CONCAT('${strGroupID}', '%') AND sr.strQuater = '${strQuater}';
    `);

    return list;
};
exports.CalculateOverviewShare = inline_CalculateOverviewShare;

/**
 * 죽장 정산 클래스 데이터 조회
 */
exports.GetSettleClass = async (strGroupID, iClass, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate, settleDays, settleType) => {
    let offset = parseInt(iOffset ?? 0);
    let limit = parseInt(iLimit ?? 30);

    let lastDateQuery = '';
    let date = lastDate ?? '';
    if (date.length > 0) {
        if (iClass == 4) {
            lastDateQuery = `AND t4.createdAt < '${date}'`;
        } else if (iClass == 5) {
            lastDateQuery = `AND t5.createdAt < '${date}'`;
        }
    }

    let iSettleDays = parseInt(settleDays);
    let iSettleType = parseInt(settleType);

    let strQuater2 = GetBeforeQuater(strQuater, iSettleDays);

    if (iClass == 4) {
        let subQuery = `AND t4.iSettleDays = ${iSettleDays} AND t4.iSettleType = ${iSettleType}`;

        let subQuery2 = '';
        // 리셋은 하부 합으로 가져오기
        if (iSettleType == 1) {
            let subQuery3 = `AND iClass = ${parseInt(iClass) + 1}`;
            subQuery2 = `
                IFNULL((SELECT sum(iTotal) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iTotal,
                IFNULL((SELECT sum(iTotal) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' AND iTotal < 0 ${subQuery3}),0) as iTotalLose,
                IFNULL((SELECT sum(iRolling) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iRolling,
                IFNULL((SELECT sum(iSettleVice) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iSettleVice,
                IFNULL((SELECT sum(iCommissionB) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iCommissionBaccarat,
                IFNULL((SELECT sum(iCommissionS) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iCommissionSlot,
                IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = t4.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
                IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t4.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
                IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = t4.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
                IFNULL((SELECT sum(iSettleVice) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iSettle,
                IFNULL((SELECT sum(iSettleVice) FROM SettleRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' ${subQuery3}),0) as iTotalViceAdmin
            `;
        } else { // 누진은
            subQuery2 = `
                IFNULL((SELECT sum(iTotal) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iTotal,
                IFNULL((SELECT sum(iTotal) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}' AND iTotal < 0),0) as iTotalLose,
                IFNULL((SELECT sum(iRolling) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iRolling,
                IFNULL((SELECT sum(iSettleVice) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iSettleVice,
                IFNULL((SELECT sum(iCommissionB) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iCommissionBaccarat,
                IFNULL((SELECT sum(iCommissionS) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iCommissionSlot,
                IFNULL((SELECT sum(iBWinlose) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iBaccaratWinLose,
                IFNULL((SELECT sum(iUWinlose) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iUnderOverWinLose,
                IFNULL((SELECT sum(iSWinlose) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iSlotWinLose,
                IFNULL((SELECT sum(iSettleViceAdmin) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iSettle,
                IFNULL((SELECT sum(iTotalViceAdmin) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID, '%') AND strQuater='${strQuater}'),0) as iTotalViceAdmin
            `;
        }

        let list = await db.sequelize.query(`
            SELECT
                t3.strID AS strAdminID, t3.strNickname AS strAdminNickname, 
                t4.strID, t4.strNickname, t4.strGroupID, t4.iClass, t4.strSettleMemo,
                t4.fBaccaratR, t4.fSlotR, t4.fUnderOverR, t4.fPBR, t4.fPBSingleR, t4.fPBDoubleR, t4.fPBTripleR,
                t4.fSettleBaccarat AS fSettleBaccarat4, t4.fSettleSlot AS fSettleSlot4, 0 AS fSettlePBA4, 0 AS fSettlePBB4,
                sr4.fSettleBaccarat AS fSettleBaccarat42, sr4.fSettleSlot AS fSettleSlot42, 0 AS fSettlePBA42, 0 AS fSettlePBB42,
                0 AS fSettleBaccarat5, 0 AS fSettleSlot5, 0 AS fSettlePBA5, 0 AS fSettlePBB5,
                0 AS fSettleBaccarat52, 0 AS fSettleSlot52, 0 AS fSettlePBA52, 0 AS fSettlePBB52,
                t4.iSettleCommission,
                IFNULL(t4.fCommission, ${cfCommission}) AS fCommission,
                t4.iSettleAcc AS iSettleAccUser, t4.iCash as iMyMoney,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t4.strGroupID,'%')),0) as iTotalMoney,
                
                IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE strID = t4.strID AND strQuater='${strQuater}'),0) as settleCount,
                IFNULL((SELECT iSettleAccTotal FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleAccTotal,
                IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleAccQuater,
                IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleComplete,
                IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname =t4.strNickname AND strQuater='${strQuater}'),0) as iSettleGive,
                IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,
                IFNULL((SELECT iSettleAfter FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleAfter,
                IFNULL((SELECT iSettleAccTotal FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater2}'),0) as iSettleAfter2,
                IFNULL((SELECT iSettleOrigin FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleOrigin,
                IFNULL((SELECT (iSettleAcc - iPayback) FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iSettleAcc,
                IFNULL((SELECT iPayback FROM SettleRecords WHERE strNickname = t4.strNickname AND strQuater='${strQuater}'),0) as iPayback,
                ${subQuery2}
            FROM Users t4
                     LEFT JOIN Users t3 ON t3.id = t4.iParentID
                     LEFT JOIN (
                         SELECT fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, strID FROM SettleRecords WHERE strQuater='${strQuater}'
                     ) sr4 ON sr4.strID=t4.strID
            WHERE t4.iClass = ${iClass} AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%')
            ${subQuery}
            ${lastDateQuery}
            ORDER BY settleCount ASC, strAdminNickname ASC, t4.strNickname ASC, t4.strGroupID ASC
                LIMIT ${limit}
            OFFSET ${offset}
        `, {type: db.Sequelize.QueryTypes.SELECT});

        return list;
    } else if (iClass == 5) {
        let subQuery = `AND t4.iSettleDays = ${iSettleDays} AND t4.iSettleType = ${iSettleType}`;
        let list = await db.sequelize.query(`
            SELECT
                t3.strID AS strAdminID, t3.strNickname AS strAdminNickname,
                t4.strID AS strPAdminID, t4.strNickname AS strPAdminNickname,
                t5.strID, t5.strNickname, t5.strGroupID, t5.iClass, t5.strSettleMemo,
                t5.fBaccaratR, t5.fSlotR, t5.fUnderOverR, t5.fPBR, t5.fPBSingleR, t5.fPBDoubleR, t5.fPBTripleR,
                t5.fSettleBaccarat AS fSettleBaccarat5, t5.fSettleSlot AS fSettleSlot5, 0 AS fSettlePBA5, 0 AS fSettlePBB5,
                sr5.fSettleBaccarat AS fSettleBaccarat52, sr5.fSettleSlot AS fSettleSlot52, 0 AS fSettlePBA52, 0 AS fSettlePBB52,
                t4.fSettleBaccarat AS fSettleBaccarat4, t4.fSettleSlot AS fSettleSlot4, 0 AS fSettlePBA4, 0 AS fSettlePBB4,
                sr4.fSettleBaccarat AS fSettleBaccarat42, sr4.fSettleSlot AS fSettleSlot42, 0 AS fSettlePBA42, 0 AS fSettlePBB42,
                t5.iSettleCommission,
                IFNULL(t5.fCommission, ${cfCommission}) AS fCommission,
                t5.iSettleAcc AS iSettleAccUser, t5.iCash as iMyMoney,
                IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t5.strGroupID,'%')),0) as iTotalMoney,
                
                IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE strID = t5.strID AND strQuater='${strQuater}'),0) as settleCount,
                IFNULL((SELECT iSettleAccTotal FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleAccTotal,
                IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleAccQuater,
                IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleComplete,
                IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleGive,
                IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,
                IFNULL((SELECT iSettleAfter FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleAfter,
                IFNULL((SELECT iSettleAccTotal FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater2}'),0) as iSettleAfter2,
                IFNULL((SELECT iSettleOrigin FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleOrigin,
                IFNULL((SELECT (iSettleAcc - iPayback) FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iSettleAcc,
                IFNULL((SELECT iPayback FROM SettleRecords WHERE strNickname = t5.strNickname AND strQuater='${strQuater}'),0) as iPayback,

                IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t5.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
                IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t5.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,

                IFNULL((SELECT sum(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
                IFNULL((SELECT sum(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
                IFNULL((SELECT sum(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
                0 as iPBRollingMoney,
                IFNULL((SELECT sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
                IFNULL((SELECT -sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
                IFNULL((SELECT -sum(-(iAgentBetB - iAgentWinB) + iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
                IFNULL((SELECT -sum(-(iAgentBetUO - iAgentWinUO) + iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
                IFNULL((SELECT -sum(-(iAgentBetS - iAgentWinS) + iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
                0 as iPBATotal,
                0 as iPBBTotal,
                IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
                IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
                IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
                0 as iPBWinLose,
                      
                IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t5.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
                IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t5.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
                IFNULL((SELECT sum(iAmount) FROM Inouts WHERE eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t5.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
                IFNULL((SELECT sum(iAmount) FROM Inouts WHERE eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t5.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
            FROM Users t5
                LEFT JOIN Users t4 ON t4.id = t5.iParentID
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
                LEFT JOIN (
                    SELECT fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, strID FROM SettleRecords WHERE strQuater='${strQuater}'
                ) sr5 ON sr5.strID=t5.strID
                LEFT JOIN (
                    SELECT fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, strID FROM SettleRecords WHERE strQuater='${strQuater}'
                ) sr4 ON sr4.strID=t4.strID
            WHERE t5.iClass = ${iClass} AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%') 
            ${subQuery}
            ${lastDateQuery}
            ORDER BY settleCount ASC, strAdminNickname ASC, t5.strNickname ASC, t5.strGroupID ASC
            LIMIT ${limit}
            OFFSET ${offset}
        `);
        return list[0];
    }
    return [];
}

exports.GetSettleExistList = async (strGroupID, strQuater, iClass, iSettleDays, iSettleType) => {
    let subQuery = '';
    if (iClass == 5) {
        let list = await db.sequelize.query(`
            SELECT sr.* 
            FROM SettleRecords sr
                LEFT JOIN Users t5 ON t5.strID = sr.strID 
                LEFT JOIN Users t4 ON t4.id = t5.iParentID
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE sr.strQuater = '${strQuater}'
                AND sr.iClass = ${iClass}
                AND sr.strGroupID LIKE CONCAT('${strGroupID}', '%')
                AND sr.iSettleDays = ${iSettleDays} AND sr.iSettleType = ${iSettleType}
                ${subQuery} 
        `);
        return list[0];
    } else if (iClass == 4) {
        let list = await db.sequelize.query(`
            SELECT sr.* 
            FROM SettleRecords sr
                LEFT JOIN Users t4 ON t4.strID = sr.strID 
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE sr.strQuater = '${strQuater}'
                AND sr.iClass = ${iClass}
                AND sr.strGroupID LIKE CONCAT('${strGroupID}', '%')
                AND sr.iSettleDays = ${iSettleDays} AND sr.iSettleType = ${iSettleType}
                ${subQuery}
        `);
        return list[0];
    }
    return [];
}

exports.GetSubSettleExistList = async (strGroupID, strQuater, iClass, iSettleDays, iSettleType) => {
    // let exist = await db.SettleSubRecords.findAll({where:{
    //         strQuater:req.body.strQuater,
    //         iClass:5,
    //         strGroupID:{[Op.like]:req.body.strGroupID+'%'},
    //         iSettleDays:req.body.iSettleDays,
    //         iSettleType:req.body.iSettleType,
    //     }, order: [['createdAt', 'DESC']]
    // });

    let subQuery = '';
    // 총본에서 조회할 경우
    if (strGroupID.length == 5) {
        // subQuery = `AND t3.iSettleDays = ${iSettleDays} AND t3.iSettleType = ${iSettleType}`;
    }
    let list = await db.sequelize.query(`
            SELECT sr.* 
            FROM SettleSubRecords sr
                LEFT JOIN Users t5 ON t5.strID = sr.strID 
                LEFT JOIN Users t4 ON t4.id = t5.iParentID
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE sr.strQuater = '${strQuater}'
                AND sr.iClass = 5
                AND sr.strGroupID LIKE CONCAT('${strGroupID}', '%')
                AND sr.iSettleDays = ${iSettleDays} AND sr.iSettleType = ${iSettleType}
                ${subQuery} 
        `);
    return list[0];
}

exports.GetSettleList = async (strGroupID, strQuater) => {
    let list = await db.SettleRecords.findAll({where: {
            strQuater: `${strQuater}`,
            strGroupID: {
                [Op.like] : `${strGroupID}%`
            }
        },
        order: [['iClass', 'ASC']],
    });
    return list;
}

let GetBeforeQuater = (strQuater, iSettleDays) => {
    let quaterList = strQuater.split('-');
    let iMonth = quaterList[0];
    let quater = quaterList[1];
    if (iSettleDays == 5) {
        if (quater == 1) {
            if (iMonth == 1) {
                iMonth = 12;
                quater = 6;
            } else {
                iMonth = iMonth - 1;
                quater = 6;
            }
        } else if (quater == 2 || quater == 3 || quater == 4 || quater == 5 || quater == 6) {
            quater = parseInt(quater) - 1;
        }
    } else if (iSettleDays == 10) {
        if (quater == 1) {
            if (iMonth == 1) {
                iMonth = 12;
                quater = 3;
            } else {
                iMonth = iMonth - 1;
                quater = 3;
            }
        } else if (quater == 2 || quater == 3) {
            quater = parseInt(quater) - 1;
        }
    } else if (iSettleDays == 15) {
        if (quater == 1) {
            if (iMonth == 1) {
                iMonth = 12;
                quater = 2;
            } else {
                iMonth = iMonth - 1;
                quater = 1;
            }
        } else if (quater == 2) {
            quater = parseInt(quater) - 1;
        }
    }
    return `${iMonth}-${quater}`;
}
exports.GetBeforeQuater = GetBeforeQuater;

let GetQuaterStartDate = (strQuater, iSettleDays) => {
    let quaterList = strQuater.split('-');
    let iMonth = quaterList[0];
    let quater = quaterList[1];
    let sDay = 0;
    let eDay = 0;
    if (iSettleDays == 5) {
        if (quater == 1) {
            sDay = 1;
            eDay = 5;
        } else if (quater == 2) {
            sDay = 6;
            eDay = 10;
        } else if (quater == 3) {
            sDay = 11;
            eDay = 15;
        } else if (quater == 4) {
            sDay = 16;
            eDay = 20;
        } else if (quater == 5) {
            sDay = 21;
            eDay = 25;
        } else if (quater == 6) {
            sDay = 26;
            eDay = 31;
        }
    } else if (iSettleDays == 10) {
        if (quater == 1) {
            sDay = 1;
            eDay = 10;
        } else if (quater == 2) {
            sDay = 11;
            eDay = 20;
        } else if (quater == 3) {
            sDay = 21;
            eDay = 31;
        }
    } else if (iSettleDays == 15) {
        if (quater == 1) {
            sDay = 1;
            eDay = 15;
        } else if (quater == 2) {
            sDay = 16;
            eDay = 31;
        }
    }
    let date = new Date();
    date = new Date(date.getFullYear(), iMonth-1, sDay);
    return moment(date).format('YYYY-MM-DD');
}
exports.GetQuaterStartDate = GetQuaterStartDate;

let GetQuaterEndDate = (strQuater, iSettleDays) => {
    let quaterList = strQuater.split('-');
    let iMonth = quaterList[0];
    let quater = quaterList[1];
    let sDay = 0;
    let eDay = 0;
    if (iSettleDays == 5) {
        if (quater == 1) {
            sDay = 1;
            eDay = 5;
        } else if (quater == 2) {
            sDay = 6;
            eDay = 10;
        } else if (quater == 3) {
            sDay = 11;
            eDay = 15;
        } else if (quater == 4) {
            sDay = 16;
            eDay = 20;
        } else if (quater == 5) {
            sDay = 21;
            eDay = 25;
        } else if (quater == 6) {
            sDay = 26;
            eDay = 31;
        }
    } else if (iSettleDays == 10) {
        if (quater == 1) {
            sDay = 1;
            eDay = 10;
        } else if (quater == 2) {
            sDay = 11;
            eDay = 20;
        } else if (quater == 3) {
            sDay = 21;
            eDay = 31;
        }
    } else if (iSettleDays == 15) {
        if (quater == 1) {
            sDay = 1;
            eDay = 15;
        } else if (quater == 2) {
            sDay = 16;
            eDay = 31;
        }
    }
    let date = new Date();
    date = new Date(date.getFullYear(), iMonth-1, eDay);
    return moment(date).add(1, 'days').format('YYYY-MM-DD');
}
exports.GetQuaterEndDate = GetQuaterEndDate;

// 죽장 지급 날짜 여부
exports.IsSettleEnableDate = (strQuater, iSettleDays) => {
    return true;
    let endDate = this.GetQuaterEndDate(strQuater, iSettleDays);
    let endDay = moment(endDate).date();
    let date = new Date();
    if (endDay == date.getDate()) {
        return true;
    }
    return false;
}

exports.GetSettleTargetUserCount = async (strQuater, iClass, strGroupID, iSettleDays, iSettleType) => {
    let lastDate = GetQuaterEndDate(strQuater, iSettleDays);

    let subQuery = '';
    if (strGroupID.length == 5) {
        subQuery = `AND u3.iSettleDays = ${iSettleDays} AND u3.iSettleType = ${iSettleType}`;
    }
    let subQuery2 = ''
    if (lastDate != '') {
        subQuery2 = `AND u.createdAt > '${lastDate}'`;
    }
    if (iClass == 4) {
        let list = await db.sequelize.query(`
            SELECT u.id 
            FROM Users u
                LEFT JOIN Users u3 ON u3.id = u.iParentID
            WHERE u.iClass = ${iClass}
                AND u.iPermission NOT IN (100)
                AND u.strGroupID LIKE CONCAT('${strGroupID}', '%')
                ${subQuery2}
                ${subQuery}
        `);
        return list[0].length;
    } else if (iClass == 5) {
        let list = await db.sequelize.query(`
            SELECT u.id 
            FROM Users u
                LEFT JOIN Users u4 ON u4.id = u.iParentID
                LEFT JOIN Users u3 ON u3.id = u4.iParentID
            WHERE u.iClass = ${iClass}
                AND u.iPermission NOT IN (100)
                AND u.strGroupID LIKE CONCAT('${strGroupID}', '%')
                ${subQuery2}
                ${subQuery}
        `);
        return list[0].length;
    }
    return 0;

    // if (lastDate != '') {
    //     let count = await db.Users.count({
    //         where: {
    //             iClass: iClass,
    //             iPermission: {
    //                 [Op.notIn]: [100]
    //             },
    //             // iSettleDays: iSettleDays,
    //             // iSettleType: iSettleType,
    //             strGroupID: {[Op.like]: strGroupID + '%'},
    //             createdAt: {[Op.lt]: lastDate}
    //         }
    //     });
    //     return count;
    // } else {
    //     let count = await db.Users.count({
    //         where: {
    //             iClass: iClass,
    //             iPermission: {
    //                 [Op.notIn]: [100]
    //             },
    //             // iSettleDays: iSettleDays,
    //             // iSettleType: iSettleType,
    //             strGroupID: {[Op.like]: strGroupID + '%'}
    //         }
    //     });
    //     return count;
    // }
    // return 0;
}
