const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const RecordDailyOverviews = sequelize.define("RecordDailyOverviews", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strDate: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strGroupID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        iClass: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        iInput: {
            type:DataTypes.INTEGER,
        },
        iOutput: {
            type:DataTypes.INTEGER,
        },
        iExchange: {
            type:DataTypes.INTEGER,
        },
        // 배팅
        iBetB: {
            type:DataTypes.INTEGER,
        },
        iBetUO: { // 언더오버
            type:DataTypes.INTEGER,
        },
        iBetS: {
            type:DataTypes.INTEGER,
        },
        iBetPB: {
            type:DataTypes.INTEGER,
        },
        // 승리
        iWinB: {
            type:DataTypes.INTEGER,
        },
        iWinUO: {
            type:DataTypes.INTEGER,
        },
        iWinS: {
            type:DataTypes.INTEGER,
        },
        iWinPB: {
            type:DataTypes.INTEGER,
        },
        iRollingB: {
            type:DataTypes.INTEGER,
        },
        iRollingUO: {
            type:DataTypes.INTEGER,
        },
        iRollingS: {
            type:DataTypes.INTEGER,
        },
        iRollingPBA: {
            type:DataTypes.INTEGER,
        },
        iRollingPBB: {
            type:DataTypes.INTEGER,
        },
        // 배팅
        iAgentBetB: {
            type:DataTypes.INTEGER,
        },
        iAgentBetUO: { // 언더오버
            type:DataTypes.INTEGER,
        },
        iAgentBetS: {
            type:DataTypes.INTEGER,
        },
        iAgentBetPB: {
            type:DataTypes.INTEGER,
        },
        // 승리
        iAgentWinB: {
            type:DataTypes.INTEGER,
        },
        iAgentWinUO: {
            type:DataTypes.INTEGER,
        },
        iAgentWinS: {
            type:DataTypes.INTEGER,
        },
        iAgentWinPB: {
            type:DataTypes.INTEGER,
        },
        iAgentRollingB: {
            type:DataTypes.INTEGER,
        },
        iAgentRollingUO: {
            type:DataTypes.INTEGER,
        },
        iAgentRollingS: {
            type:DataTypes.INTEGER,
        },
        iAgentRollingPBA: {
            type:DataTypes.INTEGER,
        },
        iAgentRollingPBB: {
            type:DataTypes.INTEGER,
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

    return RecordDailyOverviews;
};

