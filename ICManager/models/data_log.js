const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const DataLogs = sequelize.define("DataLogs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
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
        strEditorNickname: {
            type:DataTypes.STRING,
        },
        strMemo: {
            type:DataTypes.STRING,
        },
        createdAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });

    return DataLogs;
};