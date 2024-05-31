const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const SubUsers = sequelize.define("SubUsers", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        rId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
        },
        // 출금목록 내 은행정보보기
        strOutputPassword: {
            type: DataTypes.STRING,
        },
        // 계좌관리
        strInoutPassword: {
            type: DataTypes.STRING,
        },
        // 파트너 은행정보 조회
        strBankPassword: {
            type: DataTypes.STRING,
        },
        // 파트너 등록
        strRegisterPassword: {
            type: DataTypes.STRING,
        },
        strExchangeBankPassword: {
            type: DataTypes.STRING,
        },
        strAccessKey: {
            type: DataTypes.STRING,
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
        }
    });

    return SubUsers;
};