const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Announcements = sequelize.define("Announcements", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strSubject: {
            type:DataTypes.TEXT,
        },
        strContents: {
            type:DataTypes.TEXT,
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
        eType: {
            type:DataTypes.ENUM('ANN', 'POPUP'),
        },
        eState: {
            type:DataTypes.ENUM('ENABLE', 'DISABLE'),
        },
        strURL: {
            type:DataTypes.STRING,
        }
    });

    return Announcements;
};