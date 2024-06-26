const moment = require('moment');

/**
 * 부본에서 대본사 죽장 계산 결과 저장 레코드
 */
module.exports = (sequelize, DataTypes) => {

    const SettleSubRecords = sequelize.define("SettleSubRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        // 죽장 Id
        rId: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        // 분기
        strQuater: {
            type:DataTypes.STRING,
        },
        // 부본 아이디
        strID: {
            type:DataTypes.STRING,
        },
        // 부본 클래스
        iClass: {
            type:DataTypes.INTEGER,
        },
        // 부본 그룹
        strGroupID: {
            type:DataTypes.STRING,
        },
        // 대본 바카라 죽장%
        fSettleBaccaratViceAdmin: {
            type: DataTypes.FLOAT,
        },
        // 대본 슬록 죽장%
        fSettleSlotViceAdmin: {
            type: DataTypes.FLOAT,
        },
        // 부본 바카라 죽장%
        fSettleBaccarat: {
            type: DataTypes.FLOAT,
        },
        // 부본 슬록 죽장%
        fSettleSlot: {
            type: DataTypes.FLOAT,
        },
        // 부본 합계
        iTotal: {
            type:DataTypes.INTEGER,
        },
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
        // 대본죽장
        iSettle: {
            type:DataTypes.INTEGER,
        },
        // 부본죽장
        iSettleVice: {
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
        // 대본죽장
        iSettleViceAdmin: {
            type:DataTypes.INTEGER,
        },
        iTotalViceAdmin: {
            type:DataTypes.INTEGER,
        },
        // 죽장정산단위 : 15일, 10일, 5일
        iSettleDays: {
            type: DataTypes.INTEGER,
        },
        // 0: 누적, 1: 리셋
        iSettleType: {
            type: DataTypes.INTEGER,
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
    });

    return SettleSubRecords;
};