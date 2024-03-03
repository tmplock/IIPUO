const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const ShareUsers = sequelize.define("ShareUsers", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strNickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // 지분 비율
        fShareR: {
            type: DataTypes.FLOAT,
        },
        // 지분금액(현재 잔액)
        iShare: {
            type:DataTypes.INTEGER,
        },
        // 전월금액
        iShareAccBefore: {
            type:DataTypes.INTEGER,
        },
        // 본사 아이디
        strID: {
            type: DataTypes.STRING,
        },
        strGroupID: {
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
        },
    });

    return ShareUsers;
};