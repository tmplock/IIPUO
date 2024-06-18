const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const DailyBettingRecords = sequelize.define("RecordDailyOverview", {
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
            type:DataTypes.DOUBLE(17,4),
        },
        iBetUO: { // 언더오버
            type:DataTypes.DOUBLE(17,4),
        },
        iBetS: {
            type:DataTypes.DOUBLE(17,4),
        },
        iBetPB: {
            type:DataTypes.DOUBLE(17,4),
        },
        // 승리
        iWinB: {
            type:DataTypes.DOUBLE(17,4),
        },
        iWinUO: {
            type:DataTypes.DOUBLE(17,4),
        },
        iWinS: {
            type:DataTypes.DOUBLE(17,4),
        },
        iWinPB: {
            type:DataTypes.DOUBLE(17,4),
        },
        iRollingB: {
            type: DataTypes.DOUBLE(17,4),
        },
        iRollingUO: {
            type: DataTypes.DOUBLE(17,4),
        },
        iRollingS: {
            type: DataTypes.DOUBLE(17,4),
        },
        iRollingPBA: {
            type: DataTypes.DOUBLE(17,4),
        },
        iRollingPBB: {
            type: DataTypes.DOUBLE(17,4),
        },
        // 배팅
        iAgentBetB: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentBetUO: { // 언더오버
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentBetS: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentBetPB: {
            type:DataTypes.DOUBLE(17,4),
        },
        // 승리
        iAgentWinB: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentWinUO: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentWinS: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentWinPB: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentRollingB: {
            type: DataTypes.DOUBLE(17,4),
        },
        iAgentRollingUO: {
            type: DataTypes.DOUBLE(17,4),
        },
        iAgentRollingS: {
            type: DataTypes.DOUBLE(17,4),
        },
        iAgentRollingPBA: {
            type: DataTypes.DOUBLE(17,4),
        },
        iAgentRollingPBB: {
            type: DataTypes.DOUBLE(17,4),
        },
        // 배팅 수정 금액
        iAgentBetB2: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentBetUO2: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentBetS2: {
            type:DataTypes.DOUBLE(17,4),
        },
        iAgentBetPB2: {
            type:DataTypes.DOUBLE(17,4),
        },
        // iAgentRollingB2: {
        //     type: DataTypes.DOUBLE(17,4),
        // },
        // iAgentRollingUO2: {
        //     type: DataTypes.DOUBLE(17,4),
        // },
        // iAgentRollingS2: {
        //     type: DataTypes.DOUBLE(17,4),
        // },
        // iAgentRollingPBA2: {
        //     type: DataTypes.DOUBLE(17,4),
        // },
        // iAgentRollingPBB2: {
        //     type: DataTypes.DOUBLE(17,4),
        // },
        //  플레이 횟수
        iNumPlayB: {
            type:DataTypes.INTEGER,
        },
        iNumPlayUO: {
            type:DataTypes.INTEGER,
        },
        iNumPlayS: {
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

    return DailyBettingRecords;
};

