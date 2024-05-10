const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const SettingRecords = sequelize.define("SettingRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strKey: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strValue: {
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
        },
        updatedAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    });

    return SettingRecords;
};