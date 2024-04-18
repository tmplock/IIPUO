const cron = require('node-cron');
const db = require('./db');
const {Op}= require('sequelize');

const moment = require('moment');
const logger = require("./config/logger");

cron.schedule('*/1 * * * *', async () => {
// 정산 확인용
    let now = moment().format('YYYY-MM-DD');
    let datas= await db.sequelize.query(`
        SELECT
        t2.strID, t2.strNickname,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '2024-04-01' AND '${now}' ),0) as input,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '2024-04-01' AND '${now}'),0) as output,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3),0) as money,
        IFNULL((SELECT sum(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass > 3), 0) AS rolling,
        IFNULL((SELECT -SUM(iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS totalBet,
        IFNULL((SELECT -SUM(iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS totalWin,
        IFNULL((SELECT -SUM(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS totalRolling,
        IFNULL((SELECT -SUM((iAgentWinB + iAgentWinUO + iAgentWinS + iAgentWinPB) - (iAgentBetB + iAgentBetUO + iAgentBetS + iAgentBetPB) + (iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB)) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '2024-04-01' AND '${now}'), 0) AS total,
        IFNULL((SELECT SUM(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND iClass > 3),0) as settle,
        IFNULL((SELECT SUM(iBet) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'ROLLING' AND date(createdAt) BETWEEN  '2024-04-01' AND '${now}'),0) as bet,
        IFNULL((SELECT SUM(iWin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'ROLLING' AND date(createdAt) BETWEEN  '2024-04-01' AND '${now}'),0) as win,
        IFNULL((SELECT SUM(iBet) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'ROLLING' AND date(createdAt) BETWEEN  '2024-04-01' AND '${now}'),0) as bet
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iPermission != 100 AND t2.iClass=3 AND t1.strGroupID LIKE CONCAT('000', '%');
    `);
    if (datas.length > 0) {
        let list = datas[0];
        for (let i in list) {
            let total = list[i].input - list[i].output - list[i].money - list[i].rolling - list[i].settle;
            let cal  = Math.abs(total-list[i].total);
            let memo = '일치';
            if (cal > 10000) {
                memo = '미일치';
            }
            logger.info(`아이디: ${list[i].strID} / 닉네임: ${list[i].strNickname} / 입금: ${list[i].input} / 출금: ${list[i].output} / 보유머니: ${list[i].money} / 미전환롤링: ${list[i].rolling} / 미전환죽장: ${list[i].settle} / 계: ${total} / 배팅합: ${list[i].totalBet} / 승리합: ${list[i].totalWin} / 롤링합: ${list[i].totalRolling} / 합계: ${list[i].total} / 차이: ${cal} / 여부: ${memo} / 배팅중상태(배/윈): ${list[i].bet} / ${list[i].win}`);
            console.log(`아이디: ${list[i].strID} / 닉네임: ${list[i].strNickname} / 입금: ${list[i].input} / 출금: ${list[i].output} / 보유머니: ${list[i].money} / 미전환롤링: ${list[i].rolling} / 미전환죽장: ${list[i].settle} / 계: ${total} / 배팅합: ${list[i].totalBet} / 승리합: ${list[i].totalWin} / 롤링합: ${list[i].totalRolling} / 합계: ${list[i].total} / 차이: ${cal} / 여부: ${memo} / 배팅중상태(배/윈): ${list[i].bet} / ${list[i].win}`);
        }
        console.log('정산 정보 로그 저장 완료');
    }
});