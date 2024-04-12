const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const DailyBettingRecords = sequelize.define("DailyBettingRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        daily: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strGroupID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        iClass: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        // [본인]
        // 입금
        iInput: {
            type:DataTypes.INTEGER,
        },
        // 전환머니
        iExchange: {
            type:DataTypes.INTEGER,
        },
        // 출금
        iOutput: {
            type:DataTypes.INTEGER,
        },
        // 보유머니
        iCash: {
            type:DataTypes.INTEGER,
        },
        // 배팅
        iBBetting: {
            type:DataTypes.INTEGER,
        },
        iUOBetting: { // 언더오버
            type:DataTypes.INTEGER,
        },
        iSlotBetting: {
            type:DataTypes.INTEGER,
        },
        iPBBetting: {
            type:DataTypes.INTEGER,
        },
        iPBBBetting: {
            type:DataTypes.INTEGER,
        },
        // 승리
        iBWin: {
            type:DataTypes.INTEGER,
        },
        iUOWin: {
            type:DataTypes.INTEGER,
        },
        iSlotWin: {
            type:DataTypes.INTEGER,
        },
        iPBWin: {
            type:DataTypes.INTEGER,
        },
        iPBBWin: {
            type:DataTypes.INTEGER,
        },
        // 윈로스
        iBWinLose: {
            type:DataTypes.INTEGER,
        },
        iUOWinLose: {
            type:DataTypes.INTEGER,
        },
        iSlotWinLose: {
            type:DataTypes.INTEGER,
        },
        iPBWinLose: {
            type:DataTypes.INTEGER,
        },
        iPBBWinLose: {
            type:DataTypes.INTEGER,
        },
        // 게임별 수수료(롤링)
        iBRolling: {
            type:DataTypes.INTEGER,
        },
        iUORolling: {
            type:DataTypes.INTEGER,
        },
        iSlotRolling: {
            type:DataTypes.INTEGER,
        },
        iPBRolling: {
            type:DataTypes.INTEGER,
        },
        iPBBRolling: {
            type:DataTypes.INTEGER,
        },
        // 본인 수수료(롤링)
        iRolling: {
            type:DataTypes.INTEGER,
        },
        iRollingUser: {
            type:DataTypes.INTEGER,
        },
        iRollingShop: {
            type:DataTypes.INTEGER,
        },
        iRollingAgent: {
            type:DataTypes.INTEGER,
        },
        iRollingVAdmin: {
            type:DataTypes.INTEGER,
        },
        iRollingPAdmin: {
            type:DataTypes.INTEGER,
        },
        // 유저
        iBRollingUser: {
            type:DataTypes.INTEGER
        },
        iUORollingUser: {
            type:DataTypes.INTEGER
        },
        iSlotRollingUser: {
            type:DataTypes.INTEGER
        },
        iPBRollingUser: {
            type:DataTypes.INTEGER
        },
        iPBBRollingUser: {
            type:DataTypes.INTEGER
        },
        // 매장
        iBRollingShop: {
            type:DataTypes.INTEGER
        },
        iUORollingShop: {
            type:DataTypes.INTEGER
        },
        iSlotRollingShop: {
            type:DataTypes.INTEGER
        },
        iPBRollingShop: {
            type:DataTypes.INTEGER
        },
        iPBBRollingShop: {
            type:DataTypes.INTEGER
        },
        // 본사
        iBRollingAgent: {
            type:DataTypes.INTEGER
        },
        iUORollingAgent: {
            type:DataTypes.INTEGER
        },
        iSlotRollingAgent: {
            type:DataTypes.INTEGER
        },
        iPBRollingAgent: {
            type:DataTypes.INTEGER
        },
        iPBBRollingAgent: {
            type:DataTypes.INTEGER
        },
        // 부본사
        iBRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iUORollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iSlotRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iPBRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iPBBRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        // 대본사
        iBRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iUORollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iSlotRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iPBRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iPBBRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        // [본인]
        // 배팅
        iSelfBBetting: {
            type:DataTypes.INTEGER,
        },
        iSelfUOBetting: { // 언더오버
            type:DataTypes.INTEGER,
        },
        iSelfSlotBetting: {
            type:DataTypes.INTEGER,
        },
        iSelfPBBetting: {
            type:DataTypes.INTEGER,
        },
        iSelfPBBBetting: {
            type:DataTypes.INTEGER,
        },
        // 승리
        iSelfBWin: {
            type:DataTypes.INTEGER,
        },
        iSelfUOWin: {
            type:DataTypes.INTEGER,
        },
        iSelfSlotWin: {
            type:DataTypes.INTEGER,
        },
        iSelfPBWin: {
            type:DataTypes.INTEGER,
        },
        iSelfPBBWin: {
            type:DataTypes.INTEGER,
        },
        // 윈로스
        iSelfBWinLose: {
            type:DataTypes.INTEGER,
        },
        iSelfUOWinLose: {
            type:DataTypes.INTEGER,
        },
        iSelfSlotWinLose: {
            type:DataTypes.INTEGER,
        },
        iSelfPBWinLose: {
            type:DataTypes.INTEGER,
        },
        iSelfPBBWinLose: {
            type:DataTypes.INTEGER,
        },
        // 게임별 수수료(롤링)
        iSelfBRolling: {
            type:DataTypes.INTEGER,
        },
        iSelfUORolling: {
            type:DataTypes.INTEGER,
        },
        iSelfSlotRolling: {
            type:DataTypes.INTEGER,
        },
        iSelfPBRolling: {
            type:DataTypes.INTEGER,
        },
        iSelfPBBRolling: {
            type:DataTypes.INTEGER,
        },
        // 이용자별 수수료(롤링)
        iSelfRollingUser: {
            type:DataTypes.INTEGER,
        },
        iSelfRollingShop: {
            type:DataTypes.INTEGER,
        },
        iSelfRollingAgent: {
            type:DataTypes.INTEGER,
        },
        iSelfRollingVAdmin: {
            type:DataTypes.INTEGER,
        },
        iSelfRollingPAdmin: {
            type:DataTypes.INTEGER,
        },
        // 이용자
        iSelfBRollingUser: {
            type:DataTypes.INTEGER
        },
        iSelfUORollingUser: {
            type:DataTypes.INTEGER
        },
        iSelfSlotRollingUser: {
            type:DataTypes.INTEGER
        },
        iSelfPBRollingUser: {
            type:DataTypes.INTEGER
        },
        iSelfPBBRollingUser: {
            type:DataTypes.INTEGER
        },
        // 매장
        iSelfBRollingShop: {
            type:DataTypes.INTEGER
        },
        iSelfUORollingShop: {
            type:DataTypes.INTEGER
        },
        iSelfSlotRollingShop: {
            type:DataTypes.INTEGER
        },
        iSelfPBRollingShop: {
            type:DataTypes.INTEGER
        },
        iSelfPBBRollingShop: {
            type:DataTypes.INTEGER
        },
        // 총판
        iSelfBRollingAgent: {
            type:DataTypes.INTEGER
        },
        iSelfUORollingAgent: {
            type:DataTypes.INTEGER
        },
        iSelfSlotRollingAgent: {
            type:DataTypes.INTEGER
        },
        iSelfPBRollingAgent: {
            type:DataTypes.INTEGER
        },
        iSelfPBBRollingAgent: {
            type:DataTypes.INTEGER
        },
        // 부본
        iSelfBRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfUORollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfSlotRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfPBRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfPBBRollingVAdmin: {
            type:DataTypes.INTEGER
        },
        // 대본
        iSelfBRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfUORollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfSlotRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfPBRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        iSelfPBBRollingPAdmin: {
            type:DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    }, {
        indexes: [
            { name: 'idx_daily_betting_daily', fields: ['daily'] },
            { name: 'idx_daily_betting_strID', fields: ['strID'] }
        ]

    });

    return DailyBettingRecords;
};

