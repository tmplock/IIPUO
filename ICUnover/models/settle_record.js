const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const SettleRecords = sequelize.define("SettleRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strQuater: {
            type:DataTypes.STRING,
        },
        strNickname: {
            type:DataTypes.STRING,
        },
        strGroupID: {
            type:DataTypes.STRING,
        },
        iSettleOrigin: {
            type:DataTypes.INTEGER,
        },
        iSettle: {
            type:DataTypes.INTEGER,
        },
        iSettleAcc: {
            type:DataTypes.INTEGER,
        },
        iCommissionB: {
            type:DataTypes.INTEGER,
        },
        iCommissionS: {
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
    });

    return SettleRecords;
};