const moment = require('moment');
const {DATETIME} = require("mysql/lib/protocol/constants/types");

module.exports = (sequelize, DataTypes) => {

    const Letters = sequelize.define("Letters", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strAdminNickname: {
            type:DataTypes.STRING,
        },
        strPAdminNickname: {
            type:DataTypes.STRING,
        },
        strVAdminNickname: {
            type:DataTypes.STRING,
        },
        strAgentNickname: {
            type:DataTypes.STRING,
        },
        strShopNickname: {
            type:DataTypes.STRING,
        },
        strGroupID:{
            type:DataTypes.STRING,
        },
        strTo: {
            type:DataTypes.STRING,
        },
        iClassTo: {
            type:DataTypes.INTEGER,
        },
        strToID: {
            type:DataTypes.STRING,
        },
        strFrom: {
            type:DataTypes.STRING,
        },
        strFromID: {
            type:DataTypes.STRING,
        },
        iClassFrom: {
            type:DataTypes.INTEGER,
        },
        eType: {
            type:DataTypes.ENUM('NORMAL', 'ANNOUNCE'),
        },
        eRead: {
            type:DataTypes.ENUM('UNREAD', 'READED', 'REPLY', 'REPLY_READED'),
        },
        strSubject: {
            type:DataTypes.TEXT,
        },
        strContents: {
            type:DataTypes.TEXT,
        },
        iClass: {
            type: DataTypes.INTEGER,
        },
        strAnswers: {
            type: DataTypes.TEXT,
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
    }, {
        indexes: [
            { name: 'idx_letters_createdat', fields: ['createdAt'] },
            { name: 'idx_letters_updatedat', fields: ['updatedAt'] },
            { name: 'idx_letters_strfromid', fields: ['strFromID'] },
            { name: 'idx_letters_strtoid', fields: ['strToID'] },
        ]
        
    });

    return Letters;
};