const db = require('../models');
const {Op, where, Sequelize}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

const EAgent = Object.freeze({"eHQ":1, "eViceHQ":2, "eAdmin":3, "eProAdmin":4, "eViceAdmin":5, "eAgent":6, "eShop":7, "eUser":8});
module.exports.EAgent = EAgent;

const { QueryTypes } = require('sequelize');
const moment = require("moment/moment");
const {debug} = require("nodemon/lib/utils");
const crypto = require("crypto");

var inline_AccessPartnerBankAndPassword = async (strNickname, input) => {
    if (input == null || input == undefined || input.length == 0) {
        return {result:'FAIL', msg:'암호를 입력해주세요'};
    }

    if (strNickname == null || strNickname == '') {
        return {result:'FAIL', msg:'조회 불가'};
    }

    try {
        let user = await db.Users.findOne({where:{strNickname:strNickname}});
        if (user == null) {
            return {result:'FAIL', msg:'조회 불가'};
        }

        // 클래스별 접근 권환 확인
        if (user.iClass > 3 || user.iPermission == 100) {
            if (!(user.iClass == 8 || user.iClass == 7)) {
                return {result:'FAIL', msg:'접근권한 없음'};    // 매장, 총판, 본사 이상만 접근 가능
            }
        }

        let sub = await db.SubUsers.findOne({where: {rId: user.id, strBankPassword: input}});

        if (sub == null) {
            if (user.iClass == 1) {
                if (sub == null) {
                    return {result: 'FAIL', msg: '암호 불일치'};
                }
            }

            if (user.iClass == 8 || user.iClass == 7) {
                // 본사 조회(GroupID 앞5자리)
                let strGroupID = (user.strGroupID ?? '').substring(0, 5);
                let partner = await db.Users.findAll({
                    where: {
                        strGroupID: strGroupID,
                        iClass:3,
                        iPermission: {
                            [Op.notIn]: [100]
                        },
                    }
                });
                sub = await db.SubUsers.findOne({where: {rId: partner[0].id, strBankPassword:input}});
            }

            if (sub == null) {
                // 총본 조회(GroupID 앞3자리)
                let strGroupID = (user.strGroupID ?? '').substring(0, 3);
                let partner = await db.Users.findAll({
                    where: {
                        strGroupID: strGroupID,
                        iClass:2,
                        iPermission: {
                            [Op.notIn]: [100]
                        },
                    }
                });
                sub = await db.SubUsers.findOne({where: {rId: partner[0].id, strBankPassword:input}});
            }
        }

        if (sub == null) {
            return {result:'FAIL', msg:'암호 불일치'};
        }

        return {result:'OK', msg:'성공'};

    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessPartnerBankAndPassword = inline_AccessPartnerBankAndPassword;



var inline_AccessInoutPassword = async (strNickname, input) => {
    if (input == null || input == undefined || input.length == 0) {
        return {result:'FAIL', msg:'암호를 입력해주세요'};
    }

    if (strNickname == null || strNickname == '') {
        return {result:'FAIL', msg:'조회 불가'};
    }

    try {
        let user = await db.Users.findOne({where:{strNickname:strNickname}});
        if (user == null) {
            return {result:'FAIL', msg:'조회 불가'};
        }

        // 클래스별 접근 권환 확인
        if (user.iClass > 3 || user.iPermission == 100) { // 본사 이상만 접근 가능
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        let sub = await db.SubUsers.findOne({where: {rId: user.id, strInoutPassword: input}});
        if (sub == null) {
            return {result: 'FAIL', msg: '암호 불일치'};
        }
        return {result:'OK', msg:'성공'};

    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessInoutPassword = inline_AccessInoutPassword;