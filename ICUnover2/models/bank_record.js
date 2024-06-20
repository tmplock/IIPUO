const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const BankRecords = sequelize.define("BankRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        // 계좌명
        strBankName: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        // 계좌번호
        strBankNumber: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        // 예금주
        strBankHolder: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        // 연결 아이디(본사)
        userId: {
            type:DataTypes.STRING,
            allowNull: false,
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
        eType: {
            type:DataTypes.ENUM('STOP', 'ACTIVE'),
            allowNull: false,
            default: 'STOP'
        },
        // 통장 타입(신규, 일반)
        eBankType: {
            type:DataTypes.ENUM('NEWUSER', 'NORMAL'),
        },
        strMemo: {
            type:DataTypes.TEXT,
        },
    });

    return BankRecords;
}