let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const Inout = sequelize.define("Inouts", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strAdminNickname: {
            type:DataTypes.STRING,
            allowNull: false,
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
        iClass: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        strName: {
            type:DataTypes.STRING,
        },
        strGroupID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strAccountOwner: {
            type:DataTypes.STRING,
        },
        strBankName: {
            type:DataTypes.STRING,
        },
        strAccountNumber: {
            type:DataTypes.STRING,
        },
        iPreviousCash: {
            type:DataTypes.INTEGER,
        },
        iAmount: {
            type:DataTypes.INTEGER,
        },
        strMemo: {
            type:DataTypes.TEXT,
        },
        eType: {
            type:DataTypes.ENUM('INPUT', 'OUTPUT', 'BONUS', 'ROLLING', 'SETTLE'),
        },
        strRequestNickname: {
            type:DataTypes.STRING,
        },
        iRequestClass: {
            type:DataTypes.INTEGER,
        },
        strProcessNickname: {
            type:DataTypes.STRING,
        },
        iProcessClass: {
            type:DataTypes.INTEGER,
        },
        eState: {
            type:DataTypes.ENUM('REQUEST', 'STANDBY', 'COMPLETE', 'CANCEL'),
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
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    }, {
        indexes: [
            { name: 'idx_inouts_createdat_groupid_state', fields: ['createdAt', 'strGroupID', 'eState'] },
            { name: 'idx_inouts_strid_completedat', fields: ['strID', 'completedAt'] },
            { name: 'idx_inouts_stradminnickname', fields: ['strAdminNickname'] },
            { name: 'idx_inouts_etype', fields: ['eType'] },
        ]
    });

    return Inout;
};