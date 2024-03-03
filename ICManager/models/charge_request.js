let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const ChargeRequest = sequelize.define("ChargeRequest", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        iClass: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        strTo: {
            type:DataTypes.STRING,
        },
        strFrom: {
            type:DataTypes.STRING,
        },
        strGroupID: {
            type:DataTypes.STRING,
        },
        iPreviousCash: {
            type:DataTypes.INTEGER,
        },
        iAmount: {
            type:DataTypes.INTEGER,
        },
        strMemo: {
            type:DataTypes.STRING,
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
            { name: 'idx_chargerequest_groupid', fields: ['strGroupID'] },
            { name: 'idx_chargerequest_estate', fields: ['eState'] },
            { name: 'idx_chargerequest_createdat', fields: ['createdAt'] },
            { name: 'idx_chargerequest_from_to_createdat', fields: ['strFrom', 'strTo', 'createdAt'] }
        ]
        
    });

    return ChargeRequest;
};