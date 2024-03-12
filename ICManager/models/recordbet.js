const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const RecordBets = sequelize.define("RecordBets", {
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
        strGroupID:{
            type:DataTypes.STRING,
        },
        iClass: {
            type:DataTypes.INTEGER,
        },
        iBalance: {
            type:DataTypes.INTEGER,
            default:0,
        },
        iGameCode: {
            type:DataTypes.INTEGER,
        },
        strVender: {
            type:DataTypes.STRING,
        },
        strGameID: {
            type:DataTypes.STRING,
        },
        strTableID: {
            type:DataTypes.STRING,
        },
        strRound: {
            type:DataTypes.STRING,
        },
        strUniqueID: {
            type:DataTypes.STRING,
        },
        strDetail: {
            type:DataTypes.STRING,
        },
        strResult: {
            type:DataTypes.STRING,
        },
        iTarget: {
            type:DataTypes.INTEGER,
        },
        iBet: {
            type:DataTypes.FLOAT,
            default:0,
        },
        iWin: {
            type:DataTypes.FLOAT,
            default:0,
        },
        eState: {
            type:DataTypes.ENUM('STANDBY', 'COMPLETE', 'PENDING', 'ERROR', 'CANCEL_STANDBY', 'CANCELED'),
        },
        eType: {
            type:DataTypes.ENUM('BET', 'WIN', 'CANCEL'),
            allowNull: false
        },
        strURL: {
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

    return RecordBets;
};