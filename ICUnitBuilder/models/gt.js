const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const GTs = sequelize.define("GTs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strTo: {
            type:DataTypes.STRING,
        },
        iClassTo: {
            type:DataTypes.INTEGER,
        },
        strFrom: {
            type:DataTypes.STRING,
        },
        iClassFrom: {
            type:DataTypes.INTEGER,
        },
        strGroupID: {
            type:DataTypes.STRING,
        },
        eType: {
            type:DataTypes.ENUM('GIVE', 'TAKE', 'ROLLING', 'SETTLE', 'GETSETTLE'),
        },
        // 롤링전환은 롤링 금액으로, 기타는 캐쉬 금액
        iBeforeAmountTo: {
            type: DataTypes.DOUBLE(17,2),
        },
        iBeforeAmountFrom: {
            type: DataTypes.DOUBLE(17,2),
        },
        iAmount: {
            type: DataTypes.DOUBLE(17,2),
        },
        // 캐쉬값
        iAfterAmountTo: {
            type: DataTypes.DOUBLE(17,2),
        },
        iAfterAmountFrom: {
            type: DataTypes.DOUBLE(17,2),
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

    return GTs;
};