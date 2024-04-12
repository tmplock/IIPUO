const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const PowerballRecords = sequelize.define("PowerballRecords", {
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
        iClass: {
            type:DataTypes.INTEGER,
        },
        iPreviousCash: {
            type:DataTypes.INTEGER,
        },
        iAfterCash: {
            type:DataTypes.INTEGER,
        },
        iGameCode: {
            type:DataTypes.INTEGER,
        },
        strVender: {
            type:DataTypes.STRING,
        },
        strRound: {
            type:DataTypes.STRING,
        },
        strTableID: {
            type:DataTypes.STRING,
        },
        iTransactionID:{
            type:DataTypes.STRING,
        },
        iTarget: {
            type:DataTypes.INTEGER,
        },
        strGroupID:{
            type:DataTypes.STRING,
        },
        iComplete:{
            type:DataTypes.INTEGER,
        },
        iBetting: {
            type:DataTypes.DOUBLE(17,4),
        },
        iWin: {
            type:DataTypes.DOUBLE(17,4),
        },
        iRolling: {
            type:DataTypes.INTEGER,
        },
        iRollingUser: {
            type:DataTypes.INTEGER,
        },
        iRollingShop: {
            type:DataTypes.INTEGER,
        },
        iRollingAgent: {
            type:DataTypes.INTEGER,
        },
        iRollingVAdmin: {
            type:DataTypes.INTEGER,
        },
        iRollingPAdmin: {
            type:DataTypes.INTEGER,
        },
        fRollingUser:{
            type:DataTypes.FLOAT,
        },
        fRollingShop:{
            type:DataTypes.FLOAT,
        },
        fRollingAgent:{
            type:DataTypes.FLOAT,
        },
        fRollingVAdmin:{
            type:DataTypes.FLOAT,
        },
        fRollingPAdmin:{
            type:DataTypes.FLOAT,
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

    return PowerballRecords;
};