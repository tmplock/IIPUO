const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const OverviewLogs = sequelize.define("OverviewLogs", {
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
        fInput: {
            type: DataTypes.FLOAT,
        },
        fOutput: {
            type: DataTypes.FLOAT,
        },
        fCash: {
            type: DataTypes.FLOAT,
        },
        fRolling: {
            type: DataTypes.FLOAT,
        },
        fSettle: {
            type: DataTypes.FLOAT,
        },
        fTotal: {
            type: DataTypes.FLOAT,
        },
        fOverviewTotalBet: {
            type: DataTypes.FLOAT,
        },
        fOverviewTotalWin: {
            type: DataTypes.FLOAT,
        },
        fOverviewTotalRolling: {
            type: DataTypes.FLOAT,
        },
        fOverviewTotal: {
            type: DataTypes.FLOAT,
        },
        fBetRollingBetTotal: {
            type: DataTypes.FLOAT,
        },
        fBetRollingWinTotal: {
            type: DataTypes.FLOAT,
        },
        fBetStandbyBetTotal: {
            type: DataTypes.FLOAT,
        },
        fBetStandbyWinTotal: {
            type: DataTypes.FLOAT,
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

    return OverviewLogs;
};