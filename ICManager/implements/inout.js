const db = require('../models');
const {Op}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../objects/betting');

let inline_GetProcessing = async (strGroupID, strNickname, iClass) => {
    let iclass = parseInt(iClass) ?? 0;
    // 총총은 총본것만 확인
    if (iclass == 1) {
        const input = await inline_GetProcessingInputClass(strGroupID, 2);
        const output = 0;
        const charge = await inline_GetProcessingCharge(strNickname);
        const letter = 0;
        const contact = await inline_GetProcessingContact(strNickname, 'UNREAD'); // 받은쪽지
        const letterreply = 0;
        const contactreply = await inline_GetProcessingContactReply(strNickname, 'REPLY'); // 보낸쪽지
        return {input:input, output:output, letter:letter, charge:charge, contact:contact, letterreply: letterreply, contactreply:contactreply};
    }

    // 총본사는 하위 모두 수신
    if (iClass != null && parseInt(iClass) == 2) {
        const input = await inline_GetProcessingInput(strGroupID, 2);
        const output = await inline_GetProcessingOutput(strGroupID);
        const charge = await inline_GetProcessingChargeGroup(strGroupID);
        const letter = await inline_GetProcessingLetterGroup(strGroupID, strNickname, iClass, 'UNREAD');
        const contact = await inline_GetProcessingContact(strNickname, 'UNREAD'); // 받은쪽지
        const letterreply = await inline_GetProcessingLetterReply(strNickname, 'REPLY');// 보낸쪽지
        const contactreply = await inline_GetProcessingContactReply(strNickname, 'REPLY'); // 보낸쪽지
        return {input:input, output:output, letter:letter, charge:charge, contact:contact, letterreply: letterreply, contactreply:contactreply};
    }

    let strNickname2 = strNickname ?? '';
    if (strNickname2 != undefined && strNickname2 != null && strNickname2.length > 0) {
        const input = await inline_GetProcessingInput(strGroupID, iClass);
        const output = await inline_GetProcessingOutput(strGroupID);
        const charge = await inline_GetProcessingCharge(strNickname2);
        const letter = await inline_GetProcessingLetter(strNickname2, 'UNREAD');
        const contact = await inline_GetProcessingContact(strNickname2, 'UNREAD'); // 받은쪽지
        const letterreply = await inline_GetProcessingLetterReply(strNickname2, 'REPLY'); // 보낸쪽지
        const contactreply = await inline_GetProcessingContactReply(strNickname2, 'REPLY', iClass); // 보낸쪽지
        return {input:input, output:output, letter:letter, charge:charge, contact:contact, letterreply: letterreply, contactreply:contactreply};
    } else {
        return {};
    }
}
exports.GetProcessing = inline_GetProcessing;


let inline_GetProcessingInput = async (strGroupID, iClass) => {
    try {
        const result = await db.Inouts.findAll({where:{
                strGroupID:{[Op.like]:strGroupID+'%'},
                eType:'INPUT',
                iClass: {
                    [Op.gt]:parseInt(iClass)
                },
                eState:'REQUEST',
            }});
        return result.length;
    } catch (err) {
        console.log(err);
    }
    return [];

}
exports.GetProcessingInput = inline_GetProcessingInput;

let inline_GetProcessingInputClass = async (strGroupID, iClass) => {

    const result = await db.Inouts.findAll({where:{
            strGroupID:{[Op.like]:strGroupID+'%'},
            eType:'INPUT',
            eState:'REQUEST',
            iClass: iClass,
        }});

    return result.length;
}
exports.GetProcessingInput = inline_GetProcessingInput;


let inline_GetProcessingOutput = async (strGroupID) => {
    
    const result = await db.Inouts.findAll({where:{
        strGroupID:{[Op.like]:strGroupID+'%'},
        eType:'OUTPUT',
        eState:'REQUEST',
    }});

    return result.length;
}
exports.GetProcessingOutput = inline_GetProcessingOutput;


let inline_GetProcessingLetter = async (strNickname, eRead) => {

    const result = await db.Letters.findAll({where:{
            strTo: strNickname,
            eRead:`${eRead}`,
        }});

    return result.length;
}
exports.GetProcessingLetter = inline_GetProcessingLetter;

let inline_GetProcessingLetterReply = async (strNickname, eRead) => {

    const result = await db.Letters.findAll({where:{
            strFrom: strNickname,
            eRead:`${eRead}`,
        }});

    return result.length;
}
exports.GetProcessingLetterReply = inline_GetProcessingLetterReply;


let inline_GetProcessingLetterGroup = async (strGroupID, strNickname, iClass, eRead) => {
    if (iClass == 2) {
        const result = await db.Letters.findAll({where:{
                strGroupID:{[Op.like]:strGroupID+'%'},
                eRead:`${eRead}`,
                strFrom: {[Op.notIn]: [`${strNickname}`]}, // 자기가 보낸것은 제외
                iClassTo: {[Op.in]:[2,3]}
            }});
        return result.length;
    } else if (iClass == 3) {
        const result = await db.Letters.findAll({where:{
                strGroupID:{[Op.like]:strGroupID+'%'},
                eRead:`${eRead}`,
                strFrom: {[Op.notIn]: [`${strNickname}`]}, // 자기가 보낸것은 제외
                iClassTo: 3,
            }});
        return result.length;
    }
    const result = await db.Letters.findAll({where:{
            strTo:strNickname,
            eRead:`${eRead}`,
        }});

    return result.length;
}
exports.GetProcessingLetterGroup = inline_GetProcessingLetterGroup;

let inline_GetProcessingLetterGroupReply = async (strGroupID, strNickname, iClass, eRead) => {
    if (iClass == 2) {
        const result = await db.Letters.findAll({where:{
                strGroupID:{[Op.like]:strGroupID+'%'},
                eRead:`${eRead}`,
                strTo: {[Op.notIn]: [`${strNickname}`]}, // 자기가 보낸것은 제외
                iClassFrom: {[Op.in]:[2,3]}
            }});
        return result.length;
    } else if (iClass == 3) {
        const result = await db.Letters.findAll({where:{
                strGroupID:{[Op.like]:strGroupID+'%'},
                eRead:`${eRead}`,
                strTo: {[Op.notIn]: [`${strNickname}`]}, // 자기가 보낸것은 제외
                iClassFrom: 3,
            }});
        return result.length;
    }
    const result = await db.Letters.findAll({where:{
            strFrom:strNickname,
            eRead:`${eRead}`,
        }});

    return result.length;
}
exports.GetProcessingLetterGroupReply = inline_GetProcessingLetterGroupReply;

let inline_GetProcessingCharge = async (strNickname) => {

    const result = await db.ChargeRequest.findAll({where:{
            strTo: strNickname,
            eState:'REQUEST',
        }});

    return result.length;
}
exports.GetProcessingCharge = inline_GetProcessingCharge;


let inline_GetProcessingChargeGroup = async (strGroupID) => {

    const result = await db.ChargeRequest.findAll({where:{
            strGroupID:{[Op.like]:strGroupID+'%'},
            eState:'REQUEST',
        }});

    return result.length;
}
exports.GetProcessingChargeGroup = inline_GetProcessingChargeGroup;

// 받은쪽지
let inline_GetProcessingContact = async (strNickname, eRead) => {

    const result = await db.ContactLetter.findAll({where:{
            strTo: strNickname,
            eRead:`${eRead}`,
        }});

    return result.length;
}
exports.GetProcessingContact = inline_GetProcessingContact;

// 보낸쪽지
let inline_GetProcessingContactReply = async (strNickname, eRead, iClass) => {
    let iclass = iClass ?? 0;
    if (iclass == 3) {
        const result = await db.ContactLetter.findAll({where:{
                [Op.or]: {
                    strFrom: strNickname,
                    strWriter: strNickname,
                },
                eRead:`${eRead}`,
            }});
        return result.length;
    }
    const result = await db.ContactLetter.findAll({where:{
            strFrom: strNickname,
            eRead:`${eRead}`,
        }});

    return result.length;
}
exports.GetProcessingContactReply = inline_GetProcessingContactReply;