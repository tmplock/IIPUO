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
        strOutputPassword: {
            type: DataTypes.STRING,
        },
        strInoutPassword: {
            type: DataTypes.STRING,
        },
        strBankPassword: {
            type: DataTypes.STRING,
        },
        strRegisterPassword: {
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