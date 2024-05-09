const moment = require('moment');

/**
 * 유저에 대한 설정값들
 */
module.exports = (sequelize, DataTypes) => {

    const SubUsers = sequelize.define("SubUsers", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        // 유저 아이디
        rId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        // 신규자 통장 체크 기능 사용 여부(1:사용, 0:미사용)
        iNewUserCheck: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default:0
        },
        // 신규자 통장 체크 기한(가입일 기준 일자로부터 해당 일자 체크)
        iNewUserDays: {
            type:DataTypes.INTEGER,
            allowNull: false,
            default:0
        }
    });

    return SubUsers;
};