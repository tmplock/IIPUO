let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const RecordInoutAccounts = sequelize.define("RecordInoutAccounts", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strAdminNickname: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strPAdminNickname: {
            type:DataTypes.STRING,
        },
        strVAdminNickname: {
            type:DataTypes.STRING,
        },
        strAgentNickname: {
            type:DataTypes.STRING,
        },
        strShopNickname: {
            type:DataTypes.STRING,
        },
        iClass: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        strGroupID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strMemo: {
            type:DataTypes.TEXT,
        },
        eType: {
            type:DataTypes.ENUM('REQUEST', 'INPUT', 'OUTPUT'),
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

    return RecordInoutAccounts;
};