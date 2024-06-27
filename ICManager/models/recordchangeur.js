const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const RecordChangeURs = sequelize.define("RecordChangeURs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strNickname: {
            type:DataTypes.STRING,
        },
        fRRB: {
            type:DataTypes.FLOAT,
        },
        fRRS: {
            type:DataTypes.FLOAT,
        },
        fRRUO: {
            type:DataTypes.FLOAT,
        },
        iRRTurn: {
            type:DataTypes.INTEGER,
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

    return RecordChangeURs;
};