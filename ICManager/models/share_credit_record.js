const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const ShareCreditRecords = sequelize.define("ShareCreditRecords", {
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
        strGroupID: {
            type:DataTypes.STRING,
        },
        iBeforeCredit: {
            type:DataTypes.INTEGER,
        },
        // 증감
        iIncrease: {
            type:DataTypes.INTEGER,
        },
        writer: {
            type:DataTypes.STRING,
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
        iDel: {
            type:DataTypes.INTEGER,
        },
        eType: {
            type:DataTypes.ENUM('GIVE', 'TAKE'),
        },
        strMemo: {
            type:DataTypes.TEXT,
        },
    });

    return ShareCreditRecords;
}