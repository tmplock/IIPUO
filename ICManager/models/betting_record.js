const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const BettingRecords = sequelize.define("BettingRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type:DataTypes.STRING,
        },
        strNickname: {
            type:DataTypes.STRING,
        },
        iClass: {
            type:DataTypes.INTEGER,
        },
        iPreviousCash: {
            type:DataTypes.INTEGER,
        },
        iAfterCash: {
            type:DataTypes.INTEGER,
        },
        strVender: {
            type:DataTypes.STRING,
        },
        //'0:Baccarat, 200:Slot, 300:Powerball(100: UnderOver)
        //'0:Baccarat, 200:Slot, 300:Powerball(100: UnderOver-BettingRecord에서 별도 처리)
        // 생성시점에는 바카라 언오버 구분 불가 0으로 세팅
        iGameCode: {
            type:DataTypes.INTEGER,
        },
        strGameID: {
            type:DataTypes.STRING,
        },
        strRound: {
            type:DataTypes.STRING,
        },
        strTableID: {
            type:DataTypes.STRING,
        },
        iTransactionID:{
            type:DataTypes.STRING,
        },
        strDetails: {
            type:DataTypes.TEXT,
        },
        iTarget: {
            type:DataTypes.INTEGER,
        },
        strGroupID:{
            type:DataTypes.STRING,
        },
        iComplete:{
            type:DataTypes.INTEGER,
        },
        iBetting: {
            type:DataTypes.DOUBLE(17,4),
        },
        iWin: {
            type:DataTypes.DOUBLE(17,4),
        },
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
        createdAt:{
            type:DataTypes.DATE,
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
        eState: {
            type:DataTypes.ENUM('COMPLETE', 'PENDING'),
        },
        strBets: {
            type:DataTypes.TEXT,
        },
        eType: {
            type:DataTypes.ENUM('BET', 'WIN', 'CANCEL'),
            allowNull: false
        },
        // BuildBets ID (결과값 업데이트를 위한 찾기용)
        bId: {
            type:DataTypes.INTEGER
        },
        // BuildBets ID 화면 정렬용(Win일 경우 Bet상태의 BuildBets ID)
        bRId: {
            type:DataTypes.INTEGER
        }
    });

    return BettingRecords;
};