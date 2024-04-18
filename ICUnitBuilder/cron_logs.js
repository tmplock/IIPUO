const cron = require('node-cron');
const db = require('./db');
const {Op}= require('sequelize');

const moment = require('moment');
const logger = require("./config/logger");
const logger2 = require("./config/logger2");
const logger3 = require("./config/logger3");

cron.schedule('*/1 * * * *', async () => {
// 정산 확인용
    let checkNicknameList = ['구로동01', '호용01', '대전01', '압구정01', '왕십리01', '성남01', '설악01', '신당동01', '중랑01'];
    let now = moment().format('YYYY-MM-DD');
    let now2 = moment().subtract(20, 'minutes');
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
        IFNULL((SELECT SUM(iBet) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'ROLLING' AND date(createdAt) BETWEEN  '2024-04-01' AND '${now}'),0) as rollingBet,
        IFNULL((SELECT SUM(iWin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'ROLLING' AND date(createdAt) BETWEEN  '2024-04-01' AND '${now}'),0) as rollingWin,
        IFNULL((SELECT SUM(iBet) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'STANDBY' AND date(createdAt) BETWEEN  '${now2}' AND '${now}'),0) as standbyBet,
        IFNULL((SELECT SUM(iWin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%') AND eState = 'STANDBY' AND date(createdAt) BETWEEN  '${now2}' AND '${now}'),0) as standbyWin
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
                logger2.info(`${list[i].strNickname},${memo},${cal},${list[i].input},${list[i].output},${list[i].money},${list[i].rolling},${list[i].settle},${total},${list[i].totalBet},${list[i].totalWin},${list[i].totalRolling},${list[i].total},${list[i].rollingBet},${list[i].rollingWin},${list[i].standbyBet},${list[i].standbyWin}`);
            }
            if (checkNicknameList.indexOf(list[i].strNickname) > -1) {
                logger3.info(`${list[i].strNickname},${memo},${cal},${list[i].input},${list[i].output},${list[i].money},${list[i].rolling},${list[i].settle},${total},${list[i].totalBet},${list[i].totalWin},${list[i].totalRolling},${list[i].total},${list[i].rollingBet},${list[i].rollingWin},${list[i].standbyBet},${list[i].standbyWin}`);
            }
            // 닉네임,일치여부,차이,입금,출금,보유머니,미전환롤링,미전환죽장,합계,배팅합,승리합,롤링합,합계,롤링중배팅,롤링중승리,스탠바이배팅,스탠바이승리
            logger.info(`${list[i].strNickname},${memo},${cal},${list[i].input},${list[i].output},${list[i].money},${list[i].rolling},${list[i].settle},${total},${list[i].totalBet},${list[i].totalWin},${list[i].totalRolling},${list[i].total},${list[i].rollingBet},${list[i].rollingWin},${list[i].standbyBet},${list[i].standbyWin}`);

            // logger.info(`아이디: ${list[i].strID} / 닉네임: ${list[i].strNickname} / 입금: ${list[i].input} / 출금: ${list[i].output} / 보유머니: ${list[i].money} / 미전환롤링: ${list[i].rolling} / 미전환죽장: ${list[i].settle} / 계: ${total} / 배팅합: ${list[i].totalBet} / 승리합: ${list[i].totalWin} / 롤링합: ${list[i].totalRolling} / 합계: ${list[i].total} / 차이: ${cal} / 여부: ${memo} / 배팅중상태(배/윈): ${list[i].rollingBet} / ${list[i].rollingWin}`);
            console.log(`아이디: ${list[i].strID} / 닉네임: ${list[i].strNickname} / 입금: ${list[i].input} / 출금: ${list[i].output} / 보유머니: ${list[i].money} / 미전환롤링: ${list[i].rolling} / 미전환죽장: ${list[i].settle} / 계: ${total} / 배팅합: ${list[i].totalBet} / 승리합: ${list[i].totalWin} / 롤링합: ${list[i].totalRolling} / 합계: ${list[i].total} / 차이: ${cal} / 여부: ${memo} / 배팅중상태(배/윈): ${list[i].rollingBet} / ${list[i].rollingWin} / 배팅중대기(배/윈) ${list[i].standbyBet} / ${list[i].standbyWin}`);
        }
        console.log('정산 정보 로그 저장 완료');
    }
});