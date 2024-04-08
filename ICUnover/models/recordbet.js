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
            type:DataTypes.STRING(10),
        },
        strNickname: {
            type:DataTypes.STRING(10),
        },
        strGroupID:{
            type:DataTypes.STRING(32),
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
            type:DataTypes.STRING(32),
        },
        strGameID: {
            type:DataTypes.STRING(64),
        },
        strTableID: {
            type:DataTypes.STRING(64),
        },
        strRound: {
            type:DataTypes.STRING(64),
        },
        strUniqueID: {
            type:DataTypes.STRING(64),
        },
        strDetail: {
            type:DataTypes.STRING,
        },
        strResult: {
            type:DataTypes.STRING,
        },
        strOverview: {
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
            //type:DataTypes.ENUM('STANDBY', 'COMPLETE', 'PENDING', 'ERROR', 'CANCEL_STANDBY', 'CANCELED', 'BET_STANDBY', 'WIN_STANDBY'),
            type:DataTypes.ENUM('STANDBY', 'PENDING', 'COMPLETE', 'ERROR', 'ROLLING'),
        },
        eType: {
            type:DataTypes.ENUM('BET', 'BETRD', 'WIN', 'RD', 'CANCEL', 'CANCEL_BET', 'CANCEL_WIN', 'BETWIN'),
            allowNull: false
        },
        strURL: {
            type:DataTypes.STRING(32),
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