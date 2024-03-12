const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const ShareRecords = sequelize.define("ShareRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strNickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // 순이익
        iShareOrgin: {
            type: DataTypes.INTEGER,
        },
        // 슬롯 알값
        iSlotCommission: {
            type: DataTypes.INTEGER,
        },
        // 수금
        iPayback: {
            type: DataTypes.INTEGER,
        },
        // 지분율
        fShareR: {
            type: DataTypes.FLOAT,
        },
        // 배당금
        iShare: {
            type:DataTypes.INTEGER,
        },
        // 전월 이월 금액
        iShareAccBefore: {
            type:DataTypes.INTEGER,
        },
        // 입출전 금액(배당금+전월이월)
        iCreditBefore: {
            type:DataTypes.INTEGER,
        },
        // 입출후 금액(해당분기)
        iCreditAfter: {
            type:DataTypes.INTEGER,
        },
        // 메모
        strMemo: {
            type: DataTypes.TEXT,
        },
        // 메모
        strMemo2: {
            type: DataTypes.TEXT,
        },
        // 본사 아이디
        strID: {
            type: DataTypes.STRING,
        },
        strGroupID: {
            type: DataTypes.STRING,
        },
        strQuater: {
            type: DataTypes.STRING,
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

    return ShareRecords;
};