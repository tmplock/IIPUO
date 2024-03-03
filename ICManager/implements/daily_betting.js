const db = require('../db');
const moment = require("moment/moment");

// 수동 처리시
exports.DailyBettingUserUpdate = async (bet) => {
    console.log(`DailyBettingUpdate ################################################################`);
    console.log(`bet : ${bet.createdAt}`);
    try {
        // 데일리 데이터 생성
        let dailyData = GetDailyBettingData(bet);
        await DailyBetting(dailyData, bet.strID);
        return dailyData;
    } catch (err) {
        console.log(`DailyBettingUpdate ERROR : ${err.toString()}`);
    }
    return null;
    console.log(`################################################################`);
}

// 배팅
let DailyBetting = async (dailyData, strID) => {
    console.log(`DailyBetting ################################################################`);
    try {
        let obj = await db.DailyBettingRecords.findOne({
            where: {
                daily: dailyData.daily,
                strID: strID,
            },
            limit: 1
        });
        // 없으면 신규로 생성후 종료
        if (obj == null || obj.length == 0) {
            await CreateDailyBettingRecord(dailyData, strID);
            return;
        }
        await UpdateDailyBettingRecord(obj, strID, dailyData);
    } catch (err) {
        console.log(`DailyBetting ERROR : ${err.toString()}`);
    }
    console.log(`################################################################`);
}

// 입금
exports.DailyInput = async (strID, iInput) => {
    console.log(`DailyInput ################################################################`);
    console.log(`strID : ${strID}`);
    console.log(`iInput : ${iInput}`);
    const daily = `${moment(Date.now()).format('YYYY-MM-DD')}`;
    let obj = await db.DailyBettingRecords.findOne({
        where: {
            daily: daily,
            strID: strID,
        }
    });
    if (obj == null) {
        return await CreateDailyBettingRecord(daily, strID, {});
    }
    await UpdateDailyBettingRecord(obj, strID, {iInput: iInput});
    console.log(`################################################################`);
}

// 출금
exports.DailyOutput = async (strID, iOutput) => {
    console.log(`DailyOutput ################################################################`);
    console.log(`strID : ${strID}`);
    console.log(`iOutput : ${iOutput}`);
    const daily = `${moment(Date.now()).format('YYYY-MM-DD')}`;
    let obj = await db.DailyBettingRecords.findOne({
        where: {
            daily: daily,
            strID: strID,
        }
    });
    if (obj == null) {
        return await CreateDailyBettingRecord(daily, strID, {});
    }
    await UpdateDailyBettingRecord(obj, strID, {iOutput: iOutput});
    console.log(`################################################################`);
}

// 전환(롤링전환)
exports.DailyTransMyRolling = async (strID, iExchange) => {
    console.log(`DailyTransMyRolling ################################################################`);
    console.log(`strID : ${strID}`);
    console.log(`iExchange : ${iExchange}`);
    const daily = `${moment(Date.now()).format('YYYY-MM-DD')}`;
    let obj = await db.DailyBettingRecords.findOne({
        where: {
            daily: daily,
            strID: strID,
        }
    });
    if (obj == null) {
        return await CreateDailyBettingRecord(daily, strID, {});
    }
    await UpdateDailyBettingRecord(obj, strID, {iExchange: iExchange});
    console.log(`################################################################`);
}

// 전환(죽장전환)
exports.DailyTransMySettle = async (strID, iExchange) => {
    console.log(`DailyTransMySettle ################################################################`);
    console.log(`strID : ${strID}`);
    console.log(`iTrans : ${iExchange}`);
    const daily = `${moment(Date.now()).format('YYYY-MM-DD')}`;
    let obj = await db.DailyBettingRecords.findOne({
        where: {
            daily: daily,
            strID: strID,
        }
    });
    if (obj == null) {
        return await CreateDailyBettingRecord(daily, strID, {});
    }
    await UpdateDailyBettingRecord(obj, strID, {iExchange: iExchange});
    console.log(`################################################################`);
}


/**
 *
 */
let GetDailyBettingData = (bet) => {
    let daily = moment(bet.createdAt).format('YYYY-MM-DD');
    let strID = bet.strID;
    let iClass = bet.iClass;
    let strGroupID = bet.strGroupID;

    let iGameCode= bet.iGameCode ?? 0;
    let iBetting = bet.iBetting ?? 0;
    // 게임별 배팅 금액
    let iBBetting = iGameCode === 0 ? bet.iBetting ?? 0 : 0;
    let iUOBetting = iGameCode === 100 ? bet.iBetting ?? 0 : 0;
    let iSlotBetting = iGameCode === 200 ? bet.iBetting ?? 0 : 0;
    let iPBBetting = iGameCode === 300 ? bet.iBetting ?? 0 : 0;
    // 개임별 승리
    let iBWin = iGameCode === 0 ? bet.iWin ?? 0 : 0;
    let iUOWin = iGameCode === 100 ? bet.iWin ?? 0 : 0;
    let iSlotWin = iGameCode === 200 ? bet.iWin ?? 0 : 0;
    let iPBWin = iGameCode === 300 ? bet.iWin ?? 0 : 0;
    // 개임별 윈로스
    let winLose = bet.iWin-bet.iBetting;
    let iBWinLose = iGameCode === 0 ? winLose ?? 0 : 0;
    let iUOWinLose = iGameCode === 100 ? winLose ?? 0 : 0;
    let iSlotWinLose = iGameCode === 200 ? winLose ?? 0 : 0;
    let iPBWinLose = iGameCode === 300 ? winLose ?? 0 : 0;
    // 개임별 롤링(수수료)
    let iBRolling = iGameCode === 0 ? bet.iRolling ?? 0 : 0;
    let iUORolling = iGameCode === 100 ? bet.iRolling ?? 0 : 0;
    let iSlotRolling = iGameCode === 200 ? bet.iRolling ?? 0 : 0;
    let iPBRolling = iGameCode === 300 ? bet.iRolling ?? 0 : 0;
    // 이용자별 롤링(수수료)
    let iRolling = bet.iRolling ?? 0; // 배팅에 대한 롤링
    let iRollingUser = bet.iRollingUser ?? 0;
    let iRollingShop = bet.iRollingShop ?? 0;
    let iRollingAgent = bet.iRollingAgent ?? 0;
    let iRollingVAdmin = bet.iRollingVAdmin ?? 0;
    let iRollingPAdmin = bet.iRollingPAdmin ?? 0;
    // 이용자+게임별 롤링
    let iBRollingUser = iGameCode === 0 ? bet.iRollingUser ?? 0 : 0;
    let iUORollingUser = iGameCode === 100 ? bet.iRollingUser ?? 0 : 0;
    let iSlotRollingUser = iGameCode === 200 ? bet.iRollingUser ?? 0 : 0;
    let iPBRollingUser = iGameCode === 300 ? bet.iRollingUser ?? 0 : 0;
    // 매장+게임별 롤링
    let iBRollingShop = iGameCode === 0 ? bet.iRollingShop ?? 0 : 0;
    let iUORollingShop = iGameCode === 100 ? bet.iRollingShop ?? 0 : 0;
    let iSlotRollingShop = iGameCode === 200 ? bet.iRollingShop ?? 0 : 0;
    let iPBRollingShop = iGameCode === 300 ? bet.iRollingShop ?? 0 : 0;
    // 부본+게임별 롤링
    let iBRollingAgent = iGameCode === 0 ? bet.iRollingAgent ?? 0 : 0;
    let iUORollingAgent = iGameCode === 100 ? bet.iRollingAgent ?? 0 : 0;
    let iSlotRollingAgent = iGameCode === 200 ? bet.iRollingAgent ?? 0 : 0;
    let iPBRollingAgent = iGameCode === 300 ? bet.iRollingAgent ?? 0 : 0;
    // 대본+게임별 롤링
    let iBRollingVAdmin = iGameCode === 0 ? bet.iRollingVAdmin ?? 0 : 0;
    let iUORollingVAdmin = iGameCode === 100 ? bet.iRollingVAdmin ?? 0 : 0;
    let iSlotRollingVAdmin = iGameCode === 200 ? bet.iRollingVAdmin ?? 0 : 0;
    let iPBRollingVAdmin = iGameCode === 300 ? bet.iRollingVAdmin ?? 0 : 0;
    // 본사, 총본, 총총은 별도 관리
    return {daily:daily, strID: strID, strGroupID: strGroupID, iClass:iClass, iGameCode: iGameCode, iBetting: iBetting,
        iBBetting: iBBetting, iUOBetting: iUOBetting, iSlotBetting: iSlotBetting, iPBBetting: iPBBetting,
        iBWin: iBWin, iUOWin: iUOWin, iSlotWin: iSlotWin, iPBWin: iPBWin,
        iBWinLose: iBWinLose, iUOWinLose: iUOWinLose, iSlotWinLose: iSlotWinLose, iPBWinLose: iPBWinLose,
        iBRolling: iBRolling, iUORolling: iUORolling, iSlotRolling: iSlotRolling, iPBRolling: iPBRolling,
        iRolling: iRolling, iRollingUser: iRollingUser, iRollingShop: iRollingShop, iRollingAgent: iRollingAgent,
        iRollingVAdmin: iRollingVAdmin, iRollingPAdmin: iRollingPAdmin,
        iBRollingUser, iUORollingUser, iSlotRollingUser, iPBRollingUser,
        iBRollingShop, iUORollingShop, iSlotRollingShop, iPBRollingShop,
        iBRollingAgent, iUORollingAgent, iSlotRollingAgent, iPBRollingAgent,
        iBRollingVAdmin, iUORollingVAdmin, iSlotRollingVAdmin, iPBRollingVAdmin}
}
let GetUserData = async (daily, strID) => {
    console.log('이용자 조회');
    let list = await db.sequelize.query(`
                SELECT u.iClass, u.strGroupID, u.iCash,
               (SELECT SUM(iAmount) FROM Inouts WHERE eType = 'INPUT' AND eState = 'COMPLETE' AND strID = u.strID AND DATE(completedAt) BETWEEN '${daily}' AND '${daily}') AS iInput,
               (SELECT SUM(iAmount) FROM Inouts WHERE eType = 'OUTPUT' AND eState = 'COMPLETE' AND strID = u.strID AND DATE(completedAt) BETWEEN '${daily}' AND '${daily}') AS iOutput,
               (SELECT SUM(iAmount) FROM GTs WHERE eType IN ('ROLLING', 'SETTLE') AND eState = 'COMPLETE' AND strID = u.strID AND DATE(createdAt) BETWEEN '${daily}' AND '${daily}') AS iExchange
                FROM Users u
                WHERE u.strID='${strID}'
                ORDER BY iClass
            `, {type: db.Sequelize.QueryTypes.SELECT});
    if (list.length === 0) {
        console.log('이용자 없음');
        return null;
    }
    return list[0];
}

let CreateDailyBettingRecord = async (dailyData, strID) => {
    console.log('DailyBetting 신규 생성');
    let user = await GetUserData(dailyData.daily, strID);

    let obj = await db.DailyBettingRecords.create({
        daily: dailyData.daily,
        strID: strID,
        strGroupID: user.strGroupID,
        iClass: user.iClass,

        iInput: user.iInput,
        iExchange: user.iExchange,
        iOutput: user.iOutput,
        iCash: user.iCash,

        // 배팅
        iBBetting: dailyData.iBBetting,
        iUOBetting: dailyData.iUOBetting,
        iSlotBetting: dailyData.iSlotBetting,
        iPBBetting: dailyData.iPBBetting,

        // 윈
        iBWin: dailyData.iBWin,
        iUOWin: dailyData.iUOWin,
        iSlotWin: dailyData.iSlotWin,
        iPBWin: dailyData.iPBWin,

        iBWinLose: dailyData.iBWinLose,
        iUOWinLose: dailyData.iUOWinLose,
        iSlotWinLose: dailyData.iSlotWinLose,
        iPBWinLose: dailyData.iPBWinLose,

        iBRolling: dailyData.iBRolling,
        iUORolling: dailyData.iUORolling,
        iSlotRolling: dailyData.iSlotRolling,
        iPBRolling: dailyData.iPBRolling,

        iRolling: dailyData.iRolling,

        iRollingUser: dailyData.iRollingUser,
        iRollingShop: dailyData.iRollingShop,
        iRollingAgent: dailyData.iRollingAgent,
        iRollingVAdmin: dailyData.iRollingVAdmin,
        iRollingPAdmin: dailyData.iRollingPAdmin,

        iBRollingUser: dailyData.iRollingUser,
        iUORollingUser: dailyData.iRollingUser,
        iSlotRollingUser: dailyData.iRollingUser,
        iPBRollingUser: dailyData.iRollingUser,

        iBRollingShop: dailyData.iRollingShop,
        iUORollingShop: dailyData.iRollingShop,
        iSlotRollingShop: dailyData.iRollingShop,
        iPBRollingShop: dailyData.iRollingShop,

        iBRollingAgent: dailyData.iRollingAgent,
        iUORollingAgent: dailyData.iRollingAgent,
        iSlotRollingAgent: dailyData.iRollingAgent,
        iPBRollingAgent: dailyData.iRollingAgent,

        iBRollingVAdmin: dailyData.iRollingVAdmin,
        iUORollingVAdmin: dailyData.iRollingVAdmin,
        iSlotRollingVAdmin: dailyData.iRollingVAdmin,
        iPBRollingVAdmin: dailyData.iRollingVAdmin,

        createdAt: dailyData.createdAt
    });
    return obj;
}

let UpdateDailyBettingRecord = async (obj, strID, dailyData) => {
    // 업데이트
    await obj.update({
        iInput: obj.iInput + (dailyData.iInput ?? 0),
        iExchange: obj.iExchange + (dailyData.iExchange ?? 0),
        iOutput: obj.iOutput + (dailyData.iOutput ?? 0),

        iCash: obj.iCash + (dailyData.iBetting ?? 0),

        iBBetting: obj.iBBetting + (dailyData.iBBetting ?? 0),
        iUOBetting: obj.iUOBetting + (dailyData.iUOBetting ?? 0),
        iSlotBetting: obj.iSlotBetting + (dailyData.iSlotBetting ?? 0),
        iPBBetting: obj.iPBBetting + (dailyData.iPBBetting ?? 0),

        iBWin: obj.iBWin + (dailyData.iBWin ?? 0),
        iUOWin: obj.iUOWin + (dailyData.iUOWin ?? 0),
        iSlotWin: obj.iSlotWin + (dailyData.iSlotWin ?? 0),
        iPBWin: obj.iPBWin + (dailyData.iPBWin ?? 0),

        iBWinLose: obj.iBWinLose + (dailyData.iBWinLose ?? 0),
        iUOWinLose: obj.iUOWinLose + (dailyData.iUOWinLose ?? 0),
        iSlotWinLose: obj.iSlotWinLose + (dailyData.iSlotWinLose ?? 0),
        iPBWinLose: obj.iPBWinLose + (dailyData.iPBWinLose ?? 0),

        iBRolling: obj.iBRolling + (dailyData.iBRolling ?? 0),
        iUORolling: obj.iUORolling + (dailyData.iUORolling ?? 0),
        iSlotRolling: obj.iSlotRolling + (dailyData.iSlotRolling ?? 0),
        iPBRolling: obj.iPBRolling + (dailyData.iPBRolling ?? 0),

        iRolling: obj.iRolling + (dailyData.iRolling ?? 0),

        iRollingUser: obj.iRollingUser + (dailyData.iRollingUser ?? 0),
        iRollingShop: obj.iRollingShop + (dailyData.iRollingShop ?? 0),
        iRollingAgent: obj.iRollingAgent + (dailyData.iRollingAgent ?? 0),
        iRollingVAdmin: obj.iRollingVAdmin + (dailyData.iRollingVAdmin ?? 0),
        iRollingPAdmin: obj.iRollingPAdmin + (dailyData.iRollingPAdmin ?? 0),

        iBRollingUser: obj.iBRollingUser + (dailyData.iRollingUser ?? 0),
        iUORollingUser: obj.iUORollingUser + (dailyData.iRollingUser ?? 0),
        iSlotRollingUser: obj.iSlotRollingUser + (dailyData.iRollingUser ?? 0),
        iPBRollingUser: obj.iPBRollingUser + (dailyData.iRollingUser ?? 0),

        iBRollingShop: obj.iBRollingShop + (dailyData.iRollingShop ?? 0),
        iUORollingShop: obj.iUORollingShop + (dailyData.iRollingShop ?? 0),
        iSlotRollingShop: obj.iSlotRollingShop + (dailyData.iRollingShop ?? 0),
        iPBRollingShop: obj.iPBRollingShop + (dailyData.iRollingShop ?? 0),

        iBRollingAgent: obj.iBRollingAgent + (dailyData.iRollingAgent ?? 0),
        iUORollingAgent: obj.iUORollingAgent + (dailyData.iRollingAgent ?? 0),
        iSlotRollingAgent: obj.iSlotRollingAgent + (dailyData.iRollingAgent ?? 0),
        iPBRollingAgent: obj.iPBRollingAgent + (dailyData.iRollingAgent ?? 0),

        iBRollingVAdmin: obj.iBRollingVAdmin + (dailyData.iRollingVAdmin ?? 0),
        iUORollingVAdmin: obj.iUORollingVAdmin + (dailyData.iRollingVAdmin ?? 0),
        iSlotRollingVAdmin: obj.iSlotRollingVAdmin + (dailyData.iRollingVAdmin ?? 0),
        iPBRollingVAdmin: obj.iPBRollingVAdmin + (dailyData.iRollingVAdmin ?? 0),
    });
}

let ForceUpdateDailyBettingRecord = async (strID, strGroupID, iClass, daily) => {
    let obj = await db.DailyBettingRecords.findOne({
        where: {
            daily: daily,
            strID: strID,
        }
    });

    let data = await GetPartnerData(daily, strID, strGroupID, iClass);

    // 없으면 신규로 생성후 종료
    if (obj == null) {
        await db.DailyBettingRecords.create({
            daily: daily,
            strID: strID,
            strGroupID: strGroupID,
            iClass: iClass,

            iInput: data.iInput,
            iExchange: data.iExchange,
            iOutput: data.iOutput,
            iCash: data.iCash,

            // 배팅
            iBBetting: data.iBBetting,
            iUOBetting: data.iUOBetting,
            iSlotBetting: data.iSlotBetting,
            iPBBetting: data.iPBBetting,

            // 윈
            iBWin: data.iBWin,
            iUOWin: data.iUOWin,
            iSlotWin: data.iSlotWin,
            iPBWin: data.iPBWin,

            iBWinLose: data.iBWinLose,
            iUOWinLose: data.iUOWinLose,
            iSlotWinLose: data.iSlotWinLose,
            iPBWinLose: data.iPBWinLose,

            iBRolling: data.iBRolling,
            iUORolling: data.iUORolling,
            iSlotRolling: data.iSlotRolling,
            iPBRolling: data.iPBRolling,

            iRolling: data.iRolling,

            iRollingUser: data.iRollingUser,
            iRollingShop: data.iRollingShop,
            iRollingAgent: data.iRollingAgent,
            iRollingVAdmin: data.iRollingVAdmin,
            iRollingPAdmin: data.iRollingPAdmin,

            iBRollingUser: data.iRollingUser,
            iUORollingUser: data.iRollingUser,
            iSlotRollingUser: data.iRollingUser,
            iPBRollingUser: data.iRollingUser,

            iBRollingShop: data.iRollingShop,
            iUORollingShop: data.iRollingShop,
            iSlotRollingShop: data.iRollingShop,
            iPBRollingShop: data.iRollingShop,

            iBRollingAgent: data.iRollingAgent,
            iUORollingAgent: data.iRollingAgent,
            iSlotRollingAgent: data.iRollingAgent,
            iPBRollingAgent: data.iRollingAgent,

            iBRollingVAdmin: data.iRollingVAdmin,
            iUORollingVAdmin: data.iRollingVAdmin,
            iSlotRollingVAdmin: data.iRollingVAdmin,
            iPBRollingVAdmin: data.iRollingVAdmin,

            createdAt: data.createdAt
        });
        return;
    }


    // 업데이트
    await obj.update({
        iInput: data.iInput,
        iExchange: data.iExchange,
        iOutput: data.iOutput,
        iCash: data.iCash,

        // 배팅
        iBBetting: data.iBBetting,
        iUOBetting: data.iUOBetting,
        iSlotBetting: data.iSlotBetting,
        iPBBetting: data.iPBBetting,

        // 윈
        iBWin: data.iBWin,
        iUOWin: data.iUOWin,
        iSlotWin: data.iSlotWin,
        iPBWin: data.iPBWin,

        iBWinLose: data.iBWinLose,
        iUOWinLose: data.iUOWinLose,
        iSlotWinLose: data.iSlotWinLose,
        iPBWinLose: data.iPBWinLose,

        iBRolling: data.iBRolling,
        iUORolling: data.iUORolling,
        iSlotRolling: data.iSlotRolling,
        iPBRolling: data.iPBRolling,

        iRolling: data.iRolling,

        iRollingUser: data.iRollingUser,
        iRollingShop: data.iRollingShop,
        iRollingAgent: data.iRollingAgent,
        iRollingVAdmin: data.iRollingVAdmin,
        iRollingPAdmin: data.iRollingPAdmin,

        iBRollingUser: data.iRollingUser,
        iUORollingUser: data.iRollingUser,
        iSlotRollingUser: data.iRollingUser,
        iPBRollingUser: data.iRollingUser,

        iBRollingShop: data.iRollingShop,
        iUORollingShop: data.iRollingShop,
        iSlotRollingShop: data.iRollingShop,
        iPBRollingShop: data.iRollingShop,

        iBRollingAgent: data.iRollingAgent,
        iUORollingAgent: data.iRollingAgent,
        iSlotRollingAgent: data.iRollingAgent,
        iPBRollingAgent: data.iRollingAgent,

        iBRollingVAdmin: data.iRollingVAdmin,
        iUORollingVAdmin: data.iRollingVAdmin,
        iSlotRollingVAdmin: data.iRollingVAdmin,
        iPBRollingVAdmin: data.iRollingVAdmin,
    });
}

let GetPartnerData = async (daily, strID, strGroupID, iClass) => {
    console.log('파트너 조회');
    let list = await db.sequelize.query(`
               SELECT u.strID, u.iClass, u.strGroupID, u.iCash,
               IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType = 'INPUT' AND eState = 'COMPLETE' AND strID = u.strID AND DATE(completedAt) BETWEEN '${daily}' AND '${daily}'), 0) AS iInput,
               IFNULL((SELECT SUM(iAmount) FROM Inouts WHERE eType = 'OUTPUT' AND eState = 'COMPLETE' AND strID = u.strID AND DATE(completedAt) BETWEEN '${daily}' AND '${daily}'), 0) AS iOutput,
               IFNULL((SELECT SUM(iAmount) FROM GTs WHERE eType IN ('ROLLING', 'SETTLE') AND eState = 'COMPLETE' AND strTo = u.strID AND DATE(createdAt) BETWEEN '${daily}' AND '${daily}'), 0) AS iExchange,
               SUM(d.iBBetting) AS iBBetting, SUM(d.iUOBetting) AS iUOBetting, SUM(d.iSlotBetting) AS iSlotBetting, SUM(d.iPBBetting) AS iPBBetting, 
               SUM(d.iBWin) AS iBWin, SUM(d.iUOWin) AS iUOWin, SUM(d.iSlotWin) AS iSlotWin, SUM(d.iPBWin) AS iBBetting,
               SUM(d.iBWinLose) AS iBWinLose, SUM(d.iUOWinLose) AS iUOWinLose, SUM(d.iSlotWinLose) AS iSlotWinLose, SUM(d.iPBWinLose) AS iPBWinLose, 
               SUM(d.iBRolling) AS iBRolling, SUM(d.iUORolling) AS iUORolling, SUM(d.iSlotRolling) AS iSlotRolling, SUM(d.iPBRolling) AS iPBRolling, SUM(d.iRolling) AS iRolling,
               SUM(d.iRollingUser) AS iRollingUser, SUM(d.iRollingShop) AS iRollingShop, SUM(d.iRollingAgent) AS iRollingAgent, SUM(d.iRollingVAdmin) AS iRollingVAdmin, SUM(d.iRollingPAdmin) AS iRollingPAdmin,
               SUM(d.iBRollingUser) AS iBRollingUser, SUM(d.iUORollingUser) AS iUORollingUser, SUM(d.iSlotRollingUser) AS iSlotRollingUser, SUM(d.iPBRollingUser) AS iPBRollingUser,
               SUM(d.iBRollingShop) AS iBRollingShop, SUM(d.iUORollingShop) AS iUORollingShop, SUM(d.iSlotRollingShop) AS iSlotRollingShop, SUM(d.iPBRollingShop) AS iPBRollingShop,
               SUM(d.iBRollingAgent) AS iBRollingAgent, SUM(d.iUORollingAgent) AS iUORollingAgent, SUM(d.iSlotRollingAgent) AS iSlotRollingAgent, SUM(d.iPBRollingAgent) AS iPBRollingAgent,
               SUM(d.iBRollingVAdmin) AS iBRollingVAdmin, SUM(d.iUORollingVAdmin) AS iUORollingVAdmin, SUM(d.iSlotRollingVAdmin) AS iSlotRollingVAdmin, SUM(d.iPBRollingVAdmin) AS iPBRollingVAdmin
                FROM (SELECT * FROM Users WHERE strID='${strID}') u,
                  (SELECT d.*
                    FROM DailyBettingRecords d
                    WHERE d.strGroupID LIKE CONCAT('${strGroupID}', '%')
                    AND iClass > ${iClass}
                    AND DATE(d.daily) BETWEEN '${daily}' AND '${daily}') d
            `, {type: db.Sequelize.QueryTypes.SELECT});
    if (list.length === 0) {
        console.log('이용자 없음');
        return null;
    }
    return list[0];
}
