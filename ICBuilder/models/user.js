const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        strPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strNickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strMobile: {
            type: DataTypes.STRING,
        },
        strBankname: {
            type: DataTypes.STRING,
        },
        strBankAccount: {
            type: DataTypes.STRING,
        },
        strBankOwner: {
            type: DataTypes.STRING,
        },
        strBankPassword: {
            type: DataTypes.STRING,
        },
        iClass: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // iClass별 편집 권한(기본값 0 : 가능)
        iPermission: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pw_auth: {
            type: DataTypes.INTEGER,
            default:0,
        },
        strGroupID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strOutputPassword: {
            type: DataTypes.STRING,
        },
        iParentID: {
            type: DataTypes.INTEGER,
        },
        iCash: {
            type: DataTypes.DOUBLE(17,4),
            default: 0,
        },
        iLoan: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        // 롤링
        iRolling: {
            type: DataTypes.DOUBLE(17,4),
            default: 0,
        },
        // 죽장(시스템상으로 지급하는 금액, 죽장전환을 통해 캐시로 변경 가능)
        iSettle: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        // 죽장 이월(본사가 가지고 있는 금액임) - 현금거래
        iSettleAcc: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        // 죽장 전월
        iSettleAccBefore: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        fBaccaratR: {
            type: DataTypes.FLOAT,
        },
        fSlotR: {
            type: DataTypes.FLOAT,
        },
        fUnderOverR: {
            type: DataTypes.FLOAT,
        },
        fPBR: {
            type: DataTypes.FLOAT,
        },
        fPBSingleR: {
            type: DataTypes.FLOAT,
        },
        fPBDoubleR: {
            type: DataTypes.FLOAT,
        },
        fPBTripleR: {
            type: DataTypes.FLOAT,
        },
        fSettleBaccarat: {
            type: DataTypes.FLOAT,
        },
        fSettleSlot: {
            type: DataTypes.FLOAT,
        },
        fSettlePBA: {
            type: DataTypes.FLOAT,
        },
        fSettlePBB: {
            type: DataTypes.FLOAT,
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
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        loginedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('loginedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        eState: {
            type:DataTypes.ENUM('NORMAL', 'NOTICE', 'BLOCK'),
        },
        vivoToken: {
            type: DataTypes.STRING,
        },
        pragmaticToken: {
            type: DataTypes.STRING,
        },
        ezugiToken: {
            type: DataTypes.STRING,
        },
        strIP: {
            type: DataTypes.STRING,
        },
        strOptionCode: {
            type: DataTypes.STRING,
        },
        strPBOptionCode: {
            type: DataTypes.STRING,
        },
        iPBLimit: {
            type: DataTypes.INTEGER,
        },
        iPBSingleLimit: {
            type: DataTypes.INTEGER,
        },
        iPBDoubleLimit: {
            type: DataTypes.INTEGER,
        },
        iPBTripleLimit: {
            type: DataTypes.INTEGER,
        },
        strSettleMemo: {
            type: DataTypes.TEXT,
        },
        iNumLoginFailed: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        strURL: {
            type: DataTypes.STRING,
        },
        fRRB: {
            type: DataTypes.FLOAT,
        },
        fRRUO: {
            type: DataTypes.FLOAT,
        },
        fRRS: {
            type: DataTypes.FLOAT,
        },
        iRRTurn:{
            type: DataTypes.INTEGER,
        },

    }, {
        indexes: [
            { name: 'idx_users_id', fields: ['id'] },
            { name: 'idx_users_groupid_iclass', fields: ['strGroupID', 'iClass'] },
            { name: 'idx_users_iparentid', fields: ['iParentID'] },
            { name: 'idx_users_strnickname', fields: ['strNickname'] },
            { name: 'idx_users_strmobile', fields: ['strMobile'] },
        ]

    });

    return Users;
};