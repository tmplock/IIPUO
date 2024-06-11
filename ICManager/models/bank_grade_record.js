const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const BankGradeRecords = sequelize.define("BankGradeRecords", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        // 계좌명
        iGrade: {
            type:DataTypes.INTEGER,
            allowNull: false,
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
        strMemo: {
            type:DataTypes.STRING,
        },
        strGroupID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strWriter: {
            type:DataTypes.STRING,
        },
        strTitle: {
            type:DataTypes.STRING,
        },
        strMsg: {
            type:DataTypes.STRING,
        },
        strSubMsg: {
            type:DataTypes.STRING,
        }
    });

    return BankGradeRecords;
}