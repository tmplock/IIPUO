const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Permissions = sequelize.define("Permissions", {
        strGroupID: {
            type:DataTypes.STRING,
        },
        iClass: {
            type:DataTypes.INTEGER,
        },
        strURL: {
            type: DataTypes.STRING,
        },
        strViewURL: {
            type: DataTypes.STRING,
        },
        // 파트너를 별도 URL로 구분하기 위한 코드
        strLoginCode: {
            type: DataTypes.STRING,
        },
        eState: {
            type:DataTypes.ENUM('NORMAL', 'BLOCK'),
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
    return Permissions;
};