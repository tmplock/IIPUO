const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const BettingLogs = sequelize.define("BettingLogs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        // 대상자 정보
        strNickname: {
            type:DataTypes.STRING,
        },
        strID: {
            type:DataTypes.STRING,
        },
        iClass: {
            type:DataTypes.INTEGER,
        },
        strGroupID: {
            type:DataTypes.STRING,
        },
        strLogs: {
            type:DataTypes.TEXT,
        },
        // 취소자 정보
        strEditorID: {
            type:DataTypes.STRING,
        },
        strEditorNickname: {
            type:DataTypes.STRING,
        },
        createdAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });

    return BettingLogs;
};