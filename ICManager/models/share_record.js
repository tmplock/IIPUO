const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const ShareRecords = sequelize.define("ShareRecords", {
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
        // 순이익
        iShareOrgin: {
            type: DataTypes.INTEGER,
        },
        // 지분 비율
        fShareR: {
            type: DataTypes.FLOAT,
        },
        // 지분 금액(배당금)
        iShare: {
            type:DataTypes.INTEGER,
        },
        // 전월죽장이월
        iShareAccBefore: {
            type:DataTypes.INTEGER,
        },
        // 메모
        strMemo: {
            type: DataTypes.TEXT,
        },
        // 메모
        strMemo2: {
            type: DataTypes.TEXT,
        },
        // 본사 아이디
        strID: {
            type: DataTypes.STRING,
        },
        strGroupID: {
            type: DataTypes.STRING,
        },
        strQuater: {
            type: DataTypes.STRING,
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

    return ShareRecords;
};