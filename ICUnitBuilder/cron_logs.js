const cron = require('node-cron');
const db = require('./db');
const {Op}= require('sequelize');

const moment = require('moment');
const logger = require("./config/logger");
const logger2 = require("./config/logger2");
const logger3 = require("./config/logger3");

cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', async () => {
    // 정산 확인용
    let now = moment().format('YYYY-MM-DD');
    let now2 = moment().format('YYYY-MM-DD HH:mm');
    console.log(`정산 정보 로그 조회 시작 : ${now2}`);
    let datas= await db.sequelize.query(`
        SELECT
        t2.strID, t2.strNickname, t2.strGroupID,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '2024-04-01' AND '${now}' ),0) as input,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '2024-04-01' AND '${now}'),0) as output,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as money,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS rolling,
        IFNULL((SELECT SUM(iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS totalBet,
        IFNULL((SELECT -SUM(iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS totalWin,
        IFNULL((SELECT -SUM(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS totalRolling,
        IFNULL((SELECT -SUM((iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) - (iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) + (iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB)) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS total,
        IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND iClass > 3),0) as settle,
        IFNULL((SELECT SUM(iBet) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eType!='CANCEL_BET' AND eState = 'ROLLING' AND date(createdAt) < '${now2}'),0) as rollingBet,
        IFNULL((SELECT SUM(iWin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eType!='CANCEL_BET' AND eState = 'ROLLING' AND date(createdAt) < '${now2}'),0) as rollingWin,
        IFNULL((SELECT SUM(iBet) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eType!='CANCEL_BET' AND eState = 'STANDBY' AND date(createdAt) < '${now2}'),0) as standbyBet,
        IFNULL((SELECT SUM(iWin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eType!='CANCEL_BET' AND eState = 'STANDBY' AND date(createdAt) < '${now2}'),0) as standbyWin
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iPermission != 100 AND t2.iClass=3 AND t1.strGroupID LIKE CONCAT('000', '%');
    `);
    if (datas.length > 0) {
        let list = datas[0];
        for (let i in list) {
            let total = list[i].input - list[i].output - list[i].money - list[i].rolling - list[i].settle;
            let cal  = Math.abs(total-list[i].total);

            try {
                // DB 저장
                await db.OverviewLogs.create({
                    strID:list[i].strID,
                    strNickname:list[i].strNickname,
                    strGroupID:list[i].strGroupID,
                    fInput: list[i].input,
                    fOutput: list[i].output,
                    fCash: list[i].money,
                    fRolling: list[i].rolling,
                    fSettle: list[i].settle,
                    fTotal: total,
                    fOverviewTotalBet: list[i].totalBet,
                    fOverviewTotalWin: list[i].totalWin,
                    fOverviewTotalRolling: list[i].totalRolling,
                    fOverviewTotal: list[i].total,
                    fBetRollingBetTotal: list[i].rollingBet,
                    fBetRollingWinTotal: list[i].rollingWin,
                    fBetStandbyBetTotal: list[i].standbyBet,
                    fBetStandbyWinTotal: list[i].standbyWin
                });
            } catch (err) {
                console.log(err);
            }

            let memo = '일치';
            if (cal > 10000) {
                memo = '미일치';
            }
        }
        let now3 = moment().format('YYYY-MM-DD HH:mm');
        console.log(`정산 정보 로그 저장 완료 : ${now3}`);
    }
});

cron.schedule('* */12 * * *', async () => {
    // 정산 확인용
    let now = moment().add(-1,'days').format('YYYY-MM-DD');
    const beforeCount = (await db.OverviewLogs.findAndCountAll()).count;
    await db.sequelize.query(`
        DELETE FROM OverviewLogs WHERE DATE(createdAt) < '${now}'
    `);
    const afterCount = (await db.OverviewLogs.findAndCountAll()).count;
    console.log(`정산 정보 로그 삭제 완료(${beforeCount} => ${afterCount})`);
});