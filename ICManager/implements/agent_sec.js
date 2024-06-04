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


/**
 * 파트너정보팝업창 > 은행정보 조회
 */
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

        // 개별암호 확인
        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strBankPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }

        if (user.iClass == 1) {
            return {result: 'FAIL', msg: '암호 불일치'};
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
            sub = await db.SubUsers.findOne({where: {rId: partner[0].id}});
            if (sub != null) {
                if (sub.strBankPassword != input) {
                    return {result: 'FAIL', msg: '암호 불일치'};
                } else {
                    return {result:'OK', msg:'성공'};
                }
            }
        }

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
        sub = await db.SubUsers.findOne({where: {rId: partner[0].id}});
        if (sub != null) {
            if (sub.strBankPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessPartnerBankAndPassword = inline_AccessPartnerBankAndPassword;


/**
 * 입출금관리 > 입금목록 > 계좌보기
 */
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
        if (user.iClass > 2 || user.iPermission == 100) { // 총본 이상만 접근 가능
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strInoutPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessInoutPassword = inline_AccessInoutPassword;

/**
 * 입출금관리 > 출금목록 > 은행정보보기
 */
var inline_AccessOutputBankPassword = async (strNickname, input) => {
    if (input == null || input == undefined || input.length == 0) {
        return {result:'FAIL', msg:'암호를 입력해주세요'};
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

        // 개별설정 확인
        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strOutputPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }

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
        sub = await db.SubUsers.findOne({where: {rId: partner[0].id}});
        if (sub != null) {
            if (sub.strOutputPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessOutputBankPassword = inline_AccessOutputBankPassword;

/**
 * 배팅내역 관리 > 배팅 취소
 */
var inline_AccessBettingCancelPassword = async (strNickname, input) => {
    if (input == null || input == undefined || input.length == 0) {
        return {result:'FAIL', msg:'암호를 입력해주세요'};
    }

    try {
        let user = await db.Users.findOne({where:{strNickname:strNickname}});
        if (user == null) {
            return {result:'FAIL', msg:'조회 불가'};
        }

        // 클래스별 접근 권환 확인
        if (user.iClass > 2 || user.iPermission == 100) { // 총본 이상만 접근 가능
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strBettingCancelPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessBettingCancelPassword = inline_AccessBettingCancelPassword;

/**
 * 본사목록 > 일괄수정
 */
var inline_AccessOddPassword = async (strNickname, input) => {
    if (input == null || input == undefined || input.length == 0) {
        return {result:'FAIL', msg:'암호를 입력해주세요'};
    }

    try {
        let user = await db.Users.findOne({where:{strNickname:strNickname}});
        if (user == null) {
            return {result:'FAIL', msg:'조회 불가'};
        }

        // 클래스별 접근 권환 확인
        if (user.iClass > 2 || user.iPermission == 100) { // 총본 이상만 접근 가능
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strOddPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessOddPassword = inline_AccessOddPassword;

/**
 * 본사 회원가입 비밀번호
 */
var inline_AccessAdminRegisterPassword = async (strNickname, input) => {
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

        // 총본 여부 확인
        if (user.iClass != 2 || user.iPermission == 100) {
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        // 총본 암호 확인
        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strRegisterPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessAdminRegisterPassword = inline_AccessAdminRegisterPassword;

/**
 * 총본 회원가입 비밀번호
 */
var inline_AccessViceRegisterPassword = async (strNickname, input) => {
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

        // 총총 여부 확인
        if (user.iClass != 1 || user.iPermission == 100) {
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        // 총총 암호 확인
        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strRegisterPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessViceRegisterPassword = inline_AccessViceRegisterPassword;

/**
 * 총총 파트너정보 조회 암호(아이디 클릭시)
 */
var inline_AccessPartnerInfoPassword = async (strNickname, input) => {
    if (input == null || input == undefined || input.length == 0) {
        return {result:'FAIL', msg:'암호를 입력해주세요'};
    }

    try {
        let user = await db.Users.findOne({where:{strNickname:strNickname}});
        if (user == null) {
            return {result:'FAIL', msg:'조회 불가'};
        }

        // 클래스별 접근 권환 확인
        if (user.iClass != 1 || user.iPermission == 100) {
            return {result:'FAIL', msg:'접근권한 없음'};
        }

        let sub = await db.SubUsers.findOne({where: {rId: user.id}});
        if (sub != null) {
            if (sub.strPartnerInfoPassword != input) {
                return {result: 'FAIL', msg: '암호 불일치'};
            } else {
                return {result:'OK', msg:'성공'};
            }
        }
    } catch (err) {
        console.log(err);
    }

    return {result:'FAIL', msg:'조회 실패'};
}
exports.AccessPartnerInfoPassword = inline_AccessPartnerInfoPassword;


var inline_GetCipherAndPeriod = async (str, minute) => {
    if (str == null || str == undefined || str.length == 0) {
        return '';
    }
    let period = moment().add(minute, "minute");
    let secKey = `${str}&&${period}`;

    try {
        const algorithm = process.env.SEC_ALGORITHM;
        const key = process.env.SEC_KEY;
        const iv = process.env.SEC_IV;

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let result = cipher.update(secKey, 'utf8', 'base64');
        result += cipher.final('base64');
        return result;
    } catch (err) {
        return str;
    }

}
exports.GetCipherAndPeriod = inline_GetCipherAndPeriod;

var inline_GetDeCipherAndPeriod = async (str) => {
    if (str == null || str == undefined || str.length == 0) {
        return '';
    }

    try {
        const algorithm = process.env.SEC_ALGORITHM;
        const key = process.env.SEC_KEY;
        const iv = process.env.SEC_IV;

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let result = decipher.update(str, 'base64', 'utf8');
        result += decipher.final('utf8');

        // 유효기간 확인
        let arr = result.split('&&');
        if (arr.length == 2) {
            return arr[0];
        }
    } catch (err) {
    }
    return str;
}
exports.GetDeCipherAndPeriod = inline_GetDeCipherAndPeriod;