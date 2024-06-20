const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const RecordErrorCashes = sequelize.define("RecordErrorCashes", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type:DataTypes.STRING(10),
        },
        iAmount: {
            type:DataTypes.FLOAT,
            default:0,
        },
        strDesc: {
            type:DataTypes.STRING,
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

    return RecordErrorCashes;
};