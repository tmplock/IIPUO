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
        // 일괄수정
        strOddPassword: {
            type: DataTypes.STRING,
        },
        // 배팅관리 > 배팅취소
        strBettingCancelPassword: {
            type: DataTypes.STRING,
        },
        // 입출금관리 > 출금목록 > 은행정보보기
        strOutputPassword: {
            type: DataTypes.STRING,
        },
        // 입출금관리 > 입금목록 > 계좌보기
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