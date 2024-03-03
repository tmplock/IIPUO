const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const SettleRecords = sequelize.define("SettleRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type:DataTypes.STRING,
        },
        iClass: {
            type:DataTypes.INTEGER,
        },
        strNickname: {
            type:DataTypes.STRING,
        },
        strGroupID: {
            type:DataTypes.STRING,
        },
        // 분기
        strQuater: {
            type:DataTypes.STRING,
        },
        // 바카라 죽장%
        fSettleBaccarat: {
            type: DataTypes.FLOAT,
        },
        // 슬록 죽장%
        fSettleSlot: {
            type: DataTypes.FLOAT,
        },
        // 파워볼A 죽장%
        fSettlePBA: {
            type: DataTypes.FLOAT,
        },
        // 파워볼B 죽장%
        fSettlePBB: {
            type: DataTypes.FLOAT,
        },
        // 부본합계 : B윈로스 + U윈로스 + S윈로스 + P윈로스 - 롤링비
        // 대본합계 : B윈로스 + U윈로스 + S윈로스 + P윈로스 - 롤링비 - 부본죽장
        iTotal: {
            type:DataTypes.INTEGER,
        },
        // 대본 B알값
        iCommissionB: {
            type:DataTypes.INTEGER,
        },
        // 대본 S알값
        iCommissionS: {
            type:DataTypes.INTEGER,
        },
        // 롤링비
        iRolling: {
            type:DataTypes.INTEGER,
        },
        iBWinlose: {
            type:DataTypes.INTEGER,
        },
        iUWinlose: {
            type:DataTypes.INTEGER,
        },
        iSWinlose: {
            type:DataTypes.INTEGER,
        },
        iPWinlose: {
            type:DataTypes.INTEGER,
        },
        // 죽장(부본죽장 or 대본죽장)
        iSettle: {
            type:DataTypes.INTEGER,
        },
        // 순이익(매출 합계 - B윈로스 - S윈로스 - 부본죽장 - 대본B알값 - 대본S알값 - 대본죽장)
        iResult: {
            type:DataTypes.INTEGER,
        },
        // 죽장 분기값
        iSettleOrigin: {
            type:DataTypes.INTEGER,
        },
        // 죽장 지급
        iSettleGive: {
            type:DataTypes.INTEGER,
        },
        // 죽장 이월(죽장 분기 - 죽장 지급)
        iSettleAcc: {
            type:DataTypes.INTEGER,
        },
        // 전월죽장이월
        iSettleBeforeAcc: {
            type:DataTypes.INTEGER,
        },
        iClass: {
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
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    });

    return SettleRecords;
};