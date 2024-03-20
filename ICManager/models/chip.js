const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Chips = sequelize.define("Chips", {
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
            type:DataTypes.ENUM('GIVE', 'TAKE'),
        },
        iBeforeAmountTo: {
            type: DataTypes.DOUBLE(17,2),
        },
        iBeforeAmountFrom: {
            type: DataTypes.DOUBLE(17,2),
        },
        iAmount: {
            type: DataTypes.DOUBLE(17,2),
        },
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

    return Chips;
};