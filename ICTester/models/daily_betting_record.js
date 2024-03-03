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
        // 게임별 파트너 롤링
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

