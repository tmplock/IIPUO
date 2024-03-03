const db = require('../models');
const {Op, where, Sequelize}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

var kRealtimeObject = new IObject.IRealtimeBetting();

const EAgent = Object.freeze({"eHQ":1, "eViceHQ":2, "eAdmin":3, "eProAdmin":4, "eViceAdmin":5, "eAgent":6, "eShop":7, "eUser":8});
module.exports.EAgent = EAgent;

const { QueryTypes } = require('sequelize');

const GameCodeList = [0, 100, 200, 300];


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
    let subQuery = '';
    if ( iClass == EAgent.eProAdmin )
    {
        subQuery = `
            IFNULL((SELECT iSettleOrigin FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleOrigin,
            IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAcc,
            
            IFNULL((SELECT sum(iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
            IFNULL((SELECT sum(iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
            IFNULL((SELECT sum(iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
            IFNULL((SELECT sum(iPBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
            
            IFNULL((SELECT sum(iRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
            
            IFNULL((SELECT -sum(iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin + iRollingPAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
            IFNULL((SELECT -sum(iBWinLose + iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
            IFNULL((SELECT -sum(iUOWinLose + iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
            IFNULL((SELECT -sum(iSlotWinLose + iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
            IFNULL((SELECT -(sum(iPBWinLose + iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin) - sum(iPBBWinLose + iPBBRollingUser + iPBBRollingShop + iPBBRollingAgent + iPBBRollingVAdmin)) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
            IFNULL((SELECT -sum(iPBBWinLose + iPBBRollingUser + iPBBRollingShop + iPBBRollingAgent + iPBBRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,

            IFNULL((SELECT -sum(iBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
            IFNULL((SELECT -sum(iUOWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
            IFNULL((SELECT -sum(iSlotWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
            IFNULL((SELECT -sum(iPBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose
        `;
    }
    else if ( iClass == EAgent.eViceAdmin )
    {
        subQuery = `
            IFNULL((SELECT sum(iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
            IFNULL((SELECT sum(iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
            IFNULL((SELECT sum(iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
            IFNULL((SELECT sum(iPBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
            
            IFNULL((SELECT sum(iRollingVAdmin) FROM DailyRecords WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
            
            IFNULL((SELECT -sum(iRollingUser + iRollingShop + iRollingAgent + iRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
            IFNULL((SELECT -sum(iBWinLose + iBRollingUser + iBRollingShop + iBRollingAgent + iBRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
            IFNULL((SELECT -sum(iUOWinLose + iUORollingUser + iUORollingShop + iUORollingAgent + iUORollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
            IFNULL((SELECT -sum(iSlotWinLose + iSlotRollingUser + iSlotRollingShop + iSlotRollingAgent + iSlotRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
            IFNULL((SELECT -(sum(iPBWinLose + iPBRollingUser + iPBRollingShop + iPBRollingAgent + iPBRollingVAdmin) - sum(iPBBWinLose + iPBBRollingUser + iPBBRollingShop + iPBBRollingAgent + iPBBRollingVAdmin)) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
            IFNULL((SELECT -sum(iPBBWinLose + iPBBRollingUser + iPBBRollingShop + iPBBRollingAgent + iPBBRollingVAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,
            
            IFNULL((SELECT -sum(iBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
            IFNULL((SELECT -sum(iUOWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
            IFNULL((SELECT -sum(iSlotWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
            IFNULL((SELECT -sum(iPBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose
        `;
    }
    else if ( iClass == EAgent.eAgent )
    {
        subQuery = `
            IFNULL((SELECT sum(iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
            IFNULL((SELECT sum(iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
            IFNULL((SELECT sum(iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
            IFNULL((SELECT sum(iPBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
            
            IFNULL((SELECT sum(iRollingAgent) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
            
            IFNULL((SELECT -sum(iRollingUser + iRollingShop + iRollingAgent) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
            IFNULL((SELECT -sum(iBWinLose + iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
            IFNULL((SELECT -sum(iUOWinLose + iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
            IFNULL((SELECT -sum(iSlotWinLose + iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
            IFNULL((SELECT -(sum(iPBWinLose + iPBRolling) - sum(iPBBWinLose + iPBBRolling)) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
            IFNULL((SELECT -sum(iPBBWinLose + iPBBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,
            
            IFNULL((SELECT -sum(iBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
            IFNULL((SELECT -sum(iUOWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
            IFNULL((SELECT -sum(iSlotWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
            IFNULL((SELECT -sum(iPBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose
        `;
    }
    else if ( iClass == EAgent.eShop )
    {
        subQuery = `
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass=${EAgent.eUser}),0) as iNumUsers,
            
            IFNULL((SELECT sum(iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
            IFNULL((SELECT sum(iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
            IFNULL((SELECT sum(iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
            IFNULL((SELECT sum(iPBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
            
            IFNULL((SELECT sum(iRollingShop) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
            
            IFNULL((SELECT -sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
            IFNULL((SELECT -sum(iBWinLose + iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
            IFNULL((SELECT -sum(iUOWinLose + iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
            IFNULL((SELECT -sum(iSlotWinLose + iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
            IFNULL((SELECT -(sum(iPBWinLose + iPBRolling) - sum(iPBBWinLose + iPBBRolling)) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
            IFNULL((SELECT -sum(iPBBWinLose + iPBBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,
            
            IFNULL((SELECT -sum(iBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
            IFNULL((SELECT -sum(iUOWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
            IFNULL((SELECT -sum(iSlotWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
            IFNULL((SELECT -sum(iPBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose
        `;
    }
    else if ( iClass == EAgent.eUser )
    {
        subQuery = `
            0 as iNumViceAdmins, 0 as iNumAgents, 0 as iNumShops, 0 as iNumUsers,
            
            IFNULL((SELECT sum(iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
            IFNULL((SELECT sum(iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
            IFNULL((SELECT sum(iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
            IFNULL((SELECT sum(iPBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
            
            IFNULL((SELECT sum(iRollingUser) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
            
            IFNULL((SELECT -sum(iRollingUser)+sum(iRollingShop)+sum(iRollingAgent)+sum(iRollingVAdmin)+sum(iRollingPAdmin) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
            IFNULL((SELECT -sum(iBWinLose + iBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
            IFNULL((SELECT -sum(iUOWinLose + iUORolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
            IFNULL((SELECT -sum(iSlotWinLose + iSlotRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
            IFNULL((SELECT -(sum(iPBWinLose + iPBRolling) - sum(iPBBWinLose + iPBBRolling)) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
            IFNULL((SELECT -sum(iPBBWinLose + iPBBRolling) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,
            
            IFNULL((SELECT -sum(iBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
            IFNULL((SELECT -sum(iUOWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
            IFNULL((SELECT -sum(iSlotWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
            IFNULL((SELECT -sum(iPBWinLose) FROM DailyRecords WHERE strID = t2.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose
        `;
    } else {
        return null;
    }

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
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname ='${strNickname}' AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        ${subQuery2},
        ${subQuery}
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
        IFNULL((SELECT sum(iBBetting) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBetting,
        IFNULL((SELECT sum(iUOBetting) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingUnover,
        IFNULL((SELECT sum(iSlotBetting) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingSlot,
        IFNULL((SELECT sum(iPBBetting) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingPB,
        
        IFNULL((SELECT sum(iBWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWin,
        IFNULL((SELECT sum(iUOWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinUnover,
        IFNULL((SELECT sum(iSlotWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinSlot,
        IFNULL((SELECT sum(iPBWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinPB,
    
        IFNULL((SELECT sum(iBRollingPAdmin)+sum(iBRollingVAdmin)+sum(iBRollingAgent)+sum(iBRollingShop)+sum(iBRollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRolling,
        IFNULL((SELECT sum(iUORollingPAdmin)+sum(iUORollingVAdmin)+sum(iUORollingAgent)+sum(iUORollingShop)+sum(iUORollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingUnover,
        IFNULL((SELECT sum(iSlotRollingPAdmin)+sum(iSlotRollingVAdmin)+sum(iSlotRollingAgent)+sum(iSlotRollingShop)+sum(iSlotRollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingSlot,
        IFNULL((SELECT sum(iPBRollingPAdmin)+sum(iPBRollingVAdmin)+sum(iPBRollingAgent)+sum(iPBRollingShop)+sum(iPBRollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalRollingPB,
        
        IFNULL((SELECT sum(iSelfRollingPAdmin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        
        IFNULL((SELECT sum(iBBetting)-sum(iBWin)-sum(iBRollingPAdmin)-sum(iBRollingAgent)-sum(iBRollingVAdmin)-sum(iBRollingShop)-sum(iBRollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotal,
        IFNULL((SELECT sum(iUOBetting)-sum(iUOWin)-sum(iUORollingPAdmin)-sum(iUORollingAgent)-sum(iUORollingVAdmin)-sum(iUORollingShop)-sum(iUORollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalUnover,
        IFNULL((SELECT sum(iSlotBetting)-sum(iSlotWin)-sum(iSlotRollingPAdmin)-sum(iSlotRollingAgent)-sum(iSlotRollingVAdmin)-sum(iSlotRollingShop)-sum(iSlotRollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalSlot,
        IFNULL((SELECT sum(iSlotBetting)-sum(iSlotWin)-sum(iSlotRollingPAdmin)-sum(iSlotRollingAgent)-sum(iSlotRollingVAdmin)-sum(iSlotRollingShop)-sum(iSlotRollingUser) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iTotalPB,
        
        IFNULL((SELECT sum(iBBetting)-sum(iBWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLose,
        IFNULL((SELECT sum(iUOBetting)-sum(iUOWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLoseUnover,
        IFNULL((SELECT sum(iSlotBetting)-sum(iSlotWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLoseSlot,
        IFNULL((SELECT sum(iPBBetting)-sum(iPBWin) FROM DailyRecords WHERE strID = t1.strID AND date(daily) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLosePB
    `;

    const [list] = await db.sequelize.query(`
        SELECT
        IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iSettleCount,
        ${iTotalSettle}
        IFNULL((SELECT SUM(iSettleAcc) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}') ,0) as iTotalSettleAcc,
        IFNULL((SELECT sum(iShareAccBefore) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalShareAccBefore,
        IFNULL((SELECT sum(iShare) FROM ShareRecords WHERE strGroupID LIKE CONCAT('${strGroupID}', '%') AND strQuater = '${strQuater}'),0) as iTotalShare,
        IFNULL((SELECT sum(iShare) FROM ShareUsers WHERE strGroupID LIKE CONCAT('${strGroupID}', '%')),0) as iCurrentTotalShare,
        IFNULL((SELECT sum(iCommissionB)+sum(iCommissionS) FROM SettleRecords WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND strQuater = '${strQuater}'),0) as iTotalCommission,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT('${strGroupID}', '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        ${iRolling}
        IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%')) ,0) as iSettle,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' ),0) as iTotalMoney,
        IFNULL((SELECT SUM(iSettleAcc) FROM Users WHERE strGroupID LIKE CONCAT('${strGroupID}','%')) ,0) as iSettleAcc,
        IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='INPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iInput,
        IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType='OUTPUT' AND eState = 'COMPLETE' AND strGroupID LIKE CONCAT('${strGroupID}','%') AND iClass > '3' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        ${subQuery}
        FROM Users AS t1
        WHERE t1.iClass='${iClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');
    `);

    return list;
};
exports.CalculateOverviewSettle = inline_CalculateOverviewSettle;