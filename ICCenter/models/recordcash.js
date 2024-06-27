const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const RecordCashs = sequelize.define("RecordCashs", {
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
            type:DataTypes.INTEGER,
            default: 0,
        },
        iBalance: {
            type: DataTypes.DOUBLE(17,4),
            default: 0,
        },
        eType: {
            type:DataTypes.ENUM('INPUT', 'OUTPUT', 'ROLLING', 'SETTLE', 'GIVE', 'TAKE', 'INSERT'),
            allowNull: false
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

    return RecordCashs;
};