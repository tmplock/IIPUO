const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const ContactLetter = sequelize.define("ContactLetter", {
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
        strSubject: {
            type:DataTypes.TEXT,
        },
        strContents: {
            type:DataTypes.TEXT,
        },
        strAnswers: {
            type:DataTypes.TEXT,
        },
        eRead: {
            type:DataTypes.ENUM('UNREAD', 'READED', 'REPLY', 'REPLY_READED'),
        },
        eState: {
            type:DataTypes.ENUM('WAIT', 'REPLY', 'DELETE'),
        },
        strWriter: {
            type:DataTypes.STRING,
        },
        completedAt: {
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('completedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
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

    return ContactLetter;
};