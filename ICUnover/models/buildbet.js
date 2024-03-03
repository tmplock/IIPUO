const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const BuildBets = sequelize.define("BuildBets", {
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
            allownull:false,
        },
        strGroupID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        iClass: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        iAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        iCash: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        strVender: {
            type: DataTypes.STRING,
        },
        strOptions: {
            type: DataTypes.STRING,
        },
        //'0:Baccarat, 200:Slot, 300:Powerball(100: UnderOver-BettingRecord에서 별도 처리)
        // 생성시점에는 바카라 언오버 구분 불가 0으로 세팅
        iGameCode: {
            type:DataTypes.INTEGER,
        },
        strGameID: {
            type:DataTypes.STRING,
        },
        strRound: {
            type:DataTypes.STRING,
        },
        strTableID: {
            type:DataTypes.STRING,
        },
        strDetails: {
            type: DataTypes.STRING,
        },
        strUniqueID: {
            type: DataTypes.STRING,
        },
        eType: {
            type:DataTypes.ENUM('BET', 'WIN', 'CANCEL'),
        },
        eState: {
            type:DataTypes.ENUM('STANDBY', 'COMPLETE', 'PENDING', 'ERROR'),
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
        strMemo: {
            type: DataTypes.STRING,
        }
    });

    return BuildBets;
};