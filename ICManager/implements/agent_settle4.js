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
var inline_GetAgentListForSettle = async (strGroupID, iClass, strQuater, dateStart, dateEnd, strNickname) => {

    console.log(`############################################################################################### 2GetAgentListForSettle : iClass = ${iClass}, strGroupID : ${strGroupID}, ${dateStart} ~ ${dateEnd}`);

    let strQuater2 = '';
    let quaterList = strQuater.split('-');
    if (quaterList[1] == '2') {
        strQuater2 = `${quaterList[0]}-1`;
    } else {
        strQuater2 = `${parseInt(quaterList[0])-1}-2`;
    }

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
        WHERE t2.iClass=${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')
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


let inline_CalculateOverviewSettleCurrent = async (strGroupID, strQuater) => {
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
                strQuater: GetBeforeQuater(strQuater),
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
let inline_CalculateOverviewShareCurrent = async (strGroupID, strQuater) => {
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
                strQuater: GetBeforeQuater(strQuater),
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
 * 죽장 대상 리스트 조회
 * 리셋과 누진은 별도로 죽장을 해야함
 */
exports.GetSettleList = async (strGroupID, strQuater, dateStart, dateEnd, iClass, iOffset, iLimit, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, exist) => {
    let newList = [];
    // 해당 조건 파트너 목록
    if (iClass == 5) {
        // 생성되지 않은 부본 리스트 조회
        let list = await GetSettleClass5(strGroupID, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, exist);
        // 죽장 계산하기
        for (let i in list) {
            newList.push(this.CalSettle(list[i]));
        }
    } else if (iClass == 4) {
        // 대상항목에 대한 대본 리스트 조회
        let list = await GetSettleClass4(strGroupID, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, exist);
        // 죽장 계산하기
        for (let i in list) {
            newList.push(this.CalSettle(list[i]));
        }
    }
    return newList;
}


exports.GetSettleWaitList = async (ids, iClass) => {
    if (iClass == 4) {
        let list = await db.sequelize.query(`
            SELECT sr.*, u3.strNickname AS strAdminNickname
            FROM SettleRecords sr
            LEFT JOIN Users u4 ON u4.strID = sr.strID
            LEFT JOIN Users u3 ON u3.id = u4.iParentID
            WHERE sr.id IN (${ids}) AND sr.eType = 'WAIT'
        `);
        return list[0];
    } else if (iClass == 5) {
        let list = await db.sequelize.query(`
            SELECT sr.*, u3.strNickname AS strAdminNickname
            FROM SettleRecords sr
            LEFT JOIN Users u5 ON u5.strID = sr.strID
            LEFT JOIN Users u4 ON u4.id = u5.iParentID
            LEFT JOIN Users u3 ON u3.id = u4.iParentID
            WHERE sr.id IN (${ids}) AND sr.eType = 'WAIT'
        `);
        return list[0];
    }
    return [];
}

/**
 * 죽장 계산
 * 부본 : 합계 * 죽장률
 * 대본 : (합계 - 알값) * 죽장률
 */
exports.CalSettle = (obj) => {
    let settle = {
        strAdminID: '', strAdminNickname: '',
        id:0, strID:'', strNickname:'', iClass: 0, strGroupID: '', fSettleBaccarat:0, fSettleResetBaccarat:0,
        iTotal: 0, iBaccaratWinLose: 0, iUnderOverWinLose:0, iSlotWinLose: 0,
        iSettleVice:0, iCommissionBaccarat:0, iCommissionSlot:0, iSettle:0, iResult:0, // 부본죽장, 대본B알값, 대본S알값, 대본죽장, 합계
        iSettleGive:0, iSettleAcc: 0, iPayback:0,  // 죽장지급, 죽장이월, 수금(전월죽장이월금액에 대한 수금액)
        iSettleTotal:0, iSettleBeforeAcc:0, iSettleAccTotal:0, // 죽장 총합, 전월죽장 이월, 총이월
        strSettleMemo: '',
        iSettleType: 0, fCommission:0.085,
        iSettleOrigin: 0,
    };
    settle.strAdminID = obj.strAdminID;
    settle.strAdminNickname = obj.strAdminNickname;
    settle.id = obj.id;
    settle.strID = obj.strID;
    settle.strNickname = obj.strNickname;
    settle.iClass = obj.iClass;
    settle.strGroupID = obj.strGroupID;
    settle.fSettleBaccarat = obj.fSettleBaccarat;
    settle.fSettleResetBaccarat = obj.fSettleResetBaccarat;
    settle.iSettleType = obj.iSettleType
    settle.fCommission = obj.fCommission;
    settle.iPayback = obj.iPayback;
    settle.iSettleBeforeAcc = obj.iSettleBeforeAcc;
    settle.iSettleAccTotal = obj.iSettleAccTotal;

    let iSettle = 0;

    // 부본 죽장 계산
    if (obj.iClass == 5) {
        settle.iTotal = parseFloat(obj.iAgentBetB) + parseFloat(obj.iAgentBetUO) + parseFloat(obj.iAgentBetS) - parseFloat(obj.iAgentWinB) - parseFloat(obj.iAgentWinUO) - parseFloat(obj.iAgentWinS) - parseFloat(obj.iAgentRollingB) - parseFloat(obj.iAgentRollingUO) - parseFloat(obj.iAgentRollingS);
        settle.iBaccaratWinLose = obj.iAgentWinB;
        settle.iUnderOverWinLose = obj.iAgentWinUO;
        settle.iSlotWinLose = obj.iAgentWinS;

        if (obj.iSettleType == 1) {
            iSettle = parseInt(parseFloat(settle.iTotal) * parseFloat(settle.fSettleResetBaccarat) * 0.01);
            if (iSettle > 0) {
                settle.iSettleVice = iSettle;
            }
        } else {
            iSettle = parseInt(parseFloat(settle.iTotal) * parseFloat(settle.fSettleBaccarat) * 0.01);
            if (iSettle > 0) {
                settle.iSettle = iSettle;
            }
        }
    }

    // 대본 죽장 계산 및 알값 처리
    if (obj.iClass == 4) {
        settle.iTotal = obj.iTotal;
        settle.iBaccaratWinLose = obj.iBWinlose;
        settle.iUnderOverWinLose = obj.iUWinlose;
        settle.iSlotWinLose = obj.iSWinlose;
        settle.iSettleVice = obj.iSettleVice;

        if (obj.iSettleType == 1) {
            // 리셋은 알값(커미션) 미계산
            iSettle = parseFloat(settle.iTotal) * parseFloat(obj.fSettleResetBaccarat)  * 0.01; // 대본죽장 = 합계 * 리셋죽장
            if (iSettle > 0) {
                settle.iSettle = iSettle;
            }
        } else {
            // TODO:누진은 기존 방식으로 해야할 듯
            // settle.iSettle = parseInt((parseFloat(settle.iTotal) - parseFloat(settle.iCommissionBaccarat) - parseFloat(settle.iCommissionSlot)) * parseFloat(obj.fSettle) parseFloat(settle.fSettleBaccarat)  * 0.01);
        }

        this.SetCalCommission(settle);
    }

    settle.iResult = settle.iTotal - settle.iSettleVice - settle.iCommissionBaccarat - settle.iCommissionSlot - settle.iSettle;

    return settle;
}

exports.SetPayback = (settle, iSettle) => {
    // 죽장이 플러스일 경우 자동 수금 처리 표시
    if (iSettle > 0) {
        let iPayback = parseFloat(settle.iPayback ?? 0);
        let iSettleBeforeAcc = parseFloat(settle.iSettleBeforeAcc ?? 0) + iPayback;
        if (iSettle > 0 && iSettleBeforeAcc < 0) {
            // 이월 금액이 남아 있는 경우
            if (-iSettleBeforeAcc > iSettle) {
                iPayback = iPayback + iSettle;
            } else {
                iPayback = iPayback - iSettleBeforeAcc;
            }
            settle.iPayback = iPayback;
        }
    }
}

/**
 * 알값 계산
 * 리셋일 경우 계산 안함
 * 마이너스일 경우 알값 계산 안함
 */
exports.SetCalCommission = (settle) => {
    // 리셋일 경우 계산 안함
    let iSettleType = settle.iSettleType ?? 0;
    if (iSettleType == 1) {
        return;
    }

    let winloseB = (parseFloat(settle.iBaccaratWinLose) + parseFloat(settle.iUnderOverWinLose));
    if (winloseB > 0) {
        settle.iCommissionBaccarat = winloseB * parseFloat(settle.fCommission);
    }

    let winloseS = parseFloat(settle.iSlotWinLose ?? 0);
    if (winloseS > 0) {
        settle.iCommissionSlot = winloseS * parseFloat(settle.fCommission);
    }
}

/**
 * 부본 죽장 조회
 */
let GetSettleClass5 = async (strGroupID, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, exist) => {
    let offset = parseInt(iOffset ?? 0);
    let limit = parseInt(iLimit ?? 30);

    let lastDateQuery = `AND t5.createdAt < '${lastDate}'`;
    let query = `strSubQuater='${strSubQuater}' AND iSettleDays=${iSettleDays} AND iSettleType=${iSettleType}`;
    let query2 = `strSubQuater='${strSubQuater2}' AND iSettleDays=${iSettleDays} AND iSettleType=${iSettleType}`;
    let query3 = exist.length == 0 ? '' : `AND t5.id NOT IN (${exist})`;

    let list = await db.sequelize.query(`
        SELECT
            t3.strID AS strAdminID, t3.strNickname AS strAdminNickname,

            t5.id AS id, t5.strID, t5.strNickname, t5.strGroupID, t5.iClass, t5.strSettleMemo,
            t5.fSettleBaccarat, t5.fSettleResetBaccarat, t5.fSettleSlot,
            t5.iSettleDays, t5.iSettleType,
            t5.iSettleAcc, t5.iCash,
            IFNULL(t5.fCommission, ${cfCommission}) AS fCommission,
            IFNULL((SELECT SUM(iSettleAccTotal) FROM SettleRecords WHERE strNickname = t5.strNickname AND ${query2}),0) AS iSettleAfter2,

            IFNULL((SELECT SUM(iAgentBetB) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetB,
            0 AS iAgentWinB,
            0 AS iAgentRollingB,

            IFNULL((SELECT SUM(iAgentBetUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetUO,
            0 AS iAgentWinUO,
            0 AS iAgentRollingUO,
            
            IFNULL((SELECT sum(iAgentBetS) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetS,
            0 AS iAgentWinS,
            0 AS iAgentRollingS 
        FROM Users t5
                 LEFT JOIN Users t4 ON t4.id = t5.iParentID
                 LEFT JOIN Users t3 ON t3.id = t4.iParentID
        WHERE t5.iClass = 5 AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%') AND t5.iSettleDays=${iSettleDays} AND t5.iSettleType=${iSettleType}
            ${lastDateQuery}
            ${query3}
        ORDER BY strAdminNickname ASC, t5.strNickname ASC
            LIMIT ${limit}
        OFFSET ${offset}
    `);
    return list[0];
}

exports.GetSettleClass5OfIdList = async (strGroupID, strQuater, dateStart, dateEnd, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, idList) => {
    let lastDateQuery = `AND t5.createdAt < '${lastDate}'`;
    let query = `strSubQuater='${strSubQuater}' AND iSettleDays=${iSettleDays} AND iSettleType=${iSettleType}`;
    let query2 = `strSubQuater='${strSubQuater2}' AND iSettleDays=${iSettleDays} AND iSettleType=${iSettleType}`;

    let list = await db.sequelize.query(`
            SELECT
                t3.strID AS strAdminID, t3.strNickname AS strAdminNickname,
                t5.id AS id, t5.strID, t5.strNickname, t5.strGroupID, t5.iClass, t5.strSettleMemo,
                t5.fSettleBaccarat, t5.fSettleResetBaccarat, t5.fSettleSlot,
                t5.iSettleDays, t5.iSettleType,
                t5.iSettleAcc, t5.iCash,
                IFNULL((SELECT SUM(iSettleAccTotal) FROM SettleRecords WHERE strNickname = t5.strNickname AND ${query2}),0) AS iSettleAfter2,
                
                IFNULL((SELECT SUM(iAgentBetB) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetB,
                IFNULL((SELECT SUM(iAgentWinB) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentWinB,
                IFNULL((SELECT SUM(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentRollingB,
                
                IFNULL((SELECT SUM(iAgentBetUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetUO,
                IFNULL((SELECT SUM(iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentWinUO,
                IFNULL((SELECT SUM(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentRollingUO,
                
                IFNULL((SELECT SUM(iAgentBetS) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetS,
                IFNULL((SELECT SUM(iAgentWinS) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentWinS,
                IFNULL((SELECT SUM(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t5.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentRollingS
            FROM Users t5
                LEFT JOIN Users t4 ON t4.id = t5.iParentID
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE t5.id IN (${idList})
            ${lastDateQuery}
            ORDER BY strAdminNickname ASC, t5.strNickname ASC
        `);
    return list[0];
}

/**
 * 대본 죽장 조회
 * 부본에서 완료된 죽장을 가져와야 함
 */
let GetSettleClass4 = async (strGroupID, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, exist) => {
    let offset = parseInt(iOffset ?? 0);
    let limit = parseInt(iLimit ?? 30);

    let lastDateQuery = `AND t4.createdAt < '${lastDate}'`;
    let strSubQuaterMonth = `${strSubQuater}`.substring(0,2); // 1-

    let query = `iClass = 5 AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND strSubQuater LIKE CONCAT('${strSubQuaterMonth}', '%')`;
    // let query = `iClass = 5 AND eType='COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND strSubQuater LIKE CONCAT('${strSubQuaterMonth}', '%')`;

    let query2 = `strSubQuater='${strSubQuater2}' AND iSettleDays=${iSettleDays} AND iSettleType=${iSettleType}`;
    let query3 = exist.length == 0 ? '' : `AND t4.id NOT IN (${exist})`;

    let list = await db.sequelize.query(`
            SELECT
                t3.strID AS strAdminID, t3.strNickname AS strAdminNickname,
                
                t4.id, t4.strID, t4.strNickname, t4.strGroupID, t4.iClass, t4.strSettleMemo,
                t4.fSettleBaccarat, t4.fSettleResetBaccarat, t4.fSettleSlot,
                t4.iSettleDays, t4.iSettleType,
                t4.iSettleAcc, t4.iCash,
                IFNULL(t4.fCommission, ${cfCommission}) AS fCommission,
                IFNULL((SELECT SUM(iSettleVice) FROM SettleRecords WHERE ${query}),0) AS iSettleVice,
                
                IFNULL((SELECT SUM(iAgentBetB) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetB,
                IFNULL((SELECT SUM(iAgentWinB) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentWinB,
                IFNULL((SELECT SUM(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentRollingB,
                
                IFNULL((SELECT SUM(iAgentBetUO) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetUO,
                IFNULL((SELECT SUM(iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentWinUO,
                IFNULL((SELECT SUM(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentRollingUO,
                
                IFNULL((SELECT SUM(iAgentBetS) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentBetS,
                IFNULL((SELECT SUM(iAgentWinS) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentWinS,
                IFNULL((SELECT SUM(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t4.strID AND DATE(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) AS iAgentRollingS
            FROM Users t4
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE t4.iClass = 4 AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%') AND t4.iSettleDays=${iSettleDays} AND t4.iSettleType=${iSettleType}
                ${lastDateQuery}
                ${query3}
            ORDER BY strAdminNickname ASC, t4.strNickname ASC
            LIMIT ${limit}
            OFFSET ${offset}
        `);
    return list[0];
}

/**
 * 죽장 완료 목록 리스트
 */
exports.GetSettleExistList = async (strGroupID, iClass, strQuater, dateStart, dateEnd, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, limit, offset, eType) => {
    let list = [];
    if (iClass == 4) {
        list = await db.sequelize.query(`
            SELECT t3.strID AS strAdminID, t3.strNickname AS strAdminNickname,
                   t4.strID, t4.strNickname, t4.strGroupID, t4.iClass, t4.strSettleMemo,
                   t4.fSettleBaccarat, t4.fSettleResetBaccarat, t4.fSettleSlot,
                   t4.iSettleAcc, t4.iCash,
                   t4.iSettleDays, t4.iSettleType,
                   sr.*
            FROM SettleRecords sr
                    LEFT JOIN Users t4 ON t4.strID = t4.strID
                    LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE sr.strSubQuater='${strSubQuater}' AND sr.iSettleDays='${iSettleDays}' AND sr.iSettleType='${iSettleType}' AND sr.iClass=${iClass} AND sr.eType = '${eType}'
            ORDER BY strAdminNickname ASC, t4.strNickname ASC, t4.strGroupID ASC
            LIMIT ${limit}
            OFFSET ${offset}
        `, {type: db.Sequelize.QueryTypes.SELECT});
    } else if (iClass == 5) {
        list = await db.sequelize.query(`
            SELECT t3.strID AS strAdminID, t3.strNickname AS strAdminNickname,
                   t5.strID, t5.strNickname, t5.strGroupID, t5.iClass, t5.strSettleMemo,
                   t5.fSettleBaccarat, t5.fSettleResetBaccarat, t5.fSettleSlot,
                   t5.iSettleAcc, t5.iCash,
                   t5.iSettleDays, t5.iSettleType,
                   sr.*
            FROM SettleRecords sr
                    LEFT JOIN Users t5 ON t5.strID = sr.strID
                    LEFT JOIN Users t4 ON t4.id = t5.iParentID
                    LEFT JOIN Users t3 ON t3.id = t4.iParentID
            WHERE sr.strSubQuater='${strSubQuater}' AND sr.iSettleDays='${iSettleDays}' AND sr.iSettleType='${iSettleType}' AND sr.iClass=${iClass} AND sr.eType = '${eType}'
            ORDER BY strAdminNickname ASC, t5.strNickname ASC, t5.strGroupID ASC
            LIMIT ${limit}
            OFFSET ${offset}
        `, {type: db.Sequelize.QueryTypes.SELECT});
    }

    let newList = [];
    for (let i in list) {
        newList.push(ExistSettle(list[i]));
    }
    return newList;
}

exports.CheckSettleExistIDList = async (strSubQuater, iSettleDays, iSettleType, idList, iClass) => {
    let list = [];
    if (iClass == 4) {
        list = await db.SettleRecords.findAll({
            where: {
                strSubQuater: strSubQuater,
                iSettleDays: iSettleDays,
                iSettleType:iSettleType,
                strID: {
                    [Op.in]:idList
                }
            }
        });
    } else if (iClass == 5) {
        list = await db.SettleRecords.findAll({
            where: {
                strSubQuater: strSubQuater,
                iSettleDays: iSettleDays,
                iSettleType:iSettleType,
                strID: {
                    [Op.in]:idList
                }
            }
        });
    }

    return list;
}


exports.CheckSettleCompleteExistIDList = async (idList) => {
    let list = await db.SettleRecords.findAll({
        where: {
            strID: {
                [Op.in]:idList
            },
            eType:'COMPLETE'
        }
    });
    return list;
}

exports.GetSettleExistIDList = async (strSubQuater, iSettleDays, iSettleType, iClass) => {
    let list = await db.sequelize.query(`
        SELECT u.id 
        FROM SettleRecords sr
        LEFT JOIN Users u ON u.strID = sr.strID
        WHERE sr.strSubQuater='${strSubQuater}' AND sr.iSettleDays='${iSettleDays}' AND sr.iSettleType='${iSettleType}' AND sr.iClass=${iClass}
    `);
    let newList = [];
    for (let i in list[0]) {
        newList.push(list[0][i].id);
    }
    return newList;
}


// 완료된 죽장
let ExistSettle = (obj) => {
    let settle = {
        strAdminID: '', strAdminNickname: '',
        id:0, strID:'', strNickname:'', iClass: 0, strGroupID: '', fSettleBaccarat:0, fSettleResetBaccarat:0,
        iTotal: 0, iBaccaratWinLose: 0, iUnderOverWinLose:0, iSlotWinLose: 0,
        iSettleVice:0, iCommissionBaccarat:0, iCommissionSlot:0, iSettle:0, iResult:0, // 부본죽장, 대본B알값, 대본S알값, 대본죽장, 합계
        iSettleGive:0, iSettleAcc: 0, iPayback:0,  // 죽장지급, 죽장이월, 수금(전월죽장이월금액에 대한 수금액)
        iSettleTotal:0, iSettleBeforeAcc:0, iSettleAccTotal:0, // 죽장 총합, 전월죽장 이월, 총이월
        strSettleMemo: ''
    };
    settle.strAdminID == obj.strAdminID;
    settle.strAdminNickname = obj.strAdminNickname;
    settle.id = obj.id;
    settle.strID = obj.strID;
    settle.strNickname = obj.strNickname;
    settle.iClass = obj.iClass;
    settle.strGroupID = obj.strGroupID;
    settle.fSettleBaccarat = obj.fSettleBaccarat;
    settle.fSettleResetBaccarat = obj.fSettleResetBaccarat;
    settle.iTotal = obj.iTotal;
    settle.iSettleGive = obj.iSettleGive;
    settle.iPayback = obj.iPayback;
    settle.iBaccaratWinLose = obj.iBWinlose;
    settle.iUnderOverWinLose = obj.iUWinlose;
    settle.iSlotWinLose = obj.iSWinlose;
    settle.iCommissionBaccarat = obj.iCommissionB;
    settle.iCommissionSlot = obj.iCommissionS;
    settle.iSettle = obj.iSettle;
    settle.iSettleVice = obj.iSettleVice;
    settle.iResult = obj.iResult;
    settle.iSettleAcc = obj.iSettleAcc;
    settle.iSettleBeforeAcc = obj.iSettleBeforeAcc; // 전월죽장이월
    settle.iSettleAccTotal = obj.iSettleAccTotal; // 총이월
    settle.iSettleTotal = obj.iSettle + obj.iSettleVice; // 죽장 총합
    return settle;
}

let GetSubQuaterBefore = (iSettleDays, strSubQuater) => {
    let quaterList = strSubQuater.split('-');
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
exports.GetSubQuaterBefore = GetSubQuaterBefore;


let GetBeforeQuater = (strQuater) => {
    let strQuater2 = '';
    let quaterList = strQuater.split('-');
    if (quaterList[1] == '2') {
        strQuater2 = `${quaterList[0]}-1`;
    } else {
        let month = parseInt(quaterList[0])-1;
        if (month == 0) {
            strQuater2 = `12-2`;
        } else {
            strQuater2 = `${parseInt(quaterList[0])-1}-2`;
        }
    }
    return strQuater2;
}

let GetQuaterEndDate = (quater) => {
    let endDate = '';
    let quaterList = quater.split('-');
    if (quaterList[1] == '1') {
        endDate = ITime.get1QuaterEndDate(parseInt(quaterList[0])-1);
    } else if (quaterList[1] == '2') {
        endDate = ITime.get2QuaterEndDate(parseInt(quaterList[0])-1);
    }
    const date = moment(endDate).add(1, 'days').format('YYYY-MM-DD');
    return date;
}
exports.GetQuaterEndDate = GetQuaterEndDate;

let GetSubQuaterEndDate = (iSettleDays, strSubQuater) => {
    let quaterList = strSubQuater.split('-');
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
    }
    let date = new Date();
    date = new Date(date.getFullYear(), iMonth-1, eDay);
    return moment(date).add(1, 'days').format('YYYY-MM-DD');
}
exports.GetSubQuaterEndDate = GetSubQuaterEndDate;

exports.GetSettleTargetUserCount3 = async (strSubQuater, iClass, strGroupID, iSettleDays, iSettleType) => {
    let lastDate = GetSubQuaterEndDate(iSettleDays, strSubQuater);

    if (lastDate != '') {
        let count = await db.Users.count({
            where: {
                iClass: iClass,
                iPermission: {
                    [Op.notIn]: [100]
                },
                iSettleDays:iSettleDays,
                iSettleType:iSettleType,
                strGroupID: {[Op.like]: strGroupID + '%'},
                createdAt: {[Op.lt]: lastDate}
            }
        });
        return count;
    } else {
        let count = await db.Users.count({
            where: {
                iClass: iClass,
                iPermission: {
                    [Op.notIn]: [100]
                },
                iSettleDays:iSettleDays,
                iSettleType:iSettleType,
                strGroupID: {[Op.like]: strGroupID + '%'}
            }
        });
        return count;
    }
    return 0;
}

exports.GetSettleTargetUserCount = async (strQuater, iClass, strGroupID) => {
    let lastDate = GetQuaterEndDate(strQuater);

    if (lastDate != '') {
        let count = await db.Users.count({
            where: {
                iClass: iClass,
                iPermission: {
                    [Op.notIn]: [100]
                },
                strGroupID: {[Op.like]: strGroupID + '%'},
                createdAt: {[Op.lt]: lastDate}
            }
        });
        return count;
    } else {
        let count = await db.Users.count({
            where: {
                iClass: iClass,
                iPermission: {
                    [Op.notIn]: [100]
                },
                strGroupID: {[Op.like]: strGroupID + '%'}
            }
        });
        return count;
    }
    return 0;
}
