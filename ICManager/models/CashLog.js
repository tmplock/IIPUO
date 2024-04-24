const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const CashLogs = sequelize.define("CashLogs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strNickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strGroupID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        iAmoutBefore:{
            type: DataTypes.INTEGER,
        },
        iAmout:{
            type: DataTypes.INTEGER,
        },
        iAmoutAfter:{
            type: DataTypes.INTEGER,
        },
        eType:{
            type: DataTypes.STRING,
        },
        strLog: {
            type: DataTypes.STRING,
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
    });

    return CashLogs;
};