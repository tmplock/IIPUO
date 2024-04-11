const  db = require('../models');
const {where} = require("sequelize");

let inline_GetCreditList = async (strID) => {
    console.log(`GetCreditList : ${strID}`);

    let list = await db.CreditRecords.findAll({
        where:{
            strID: strID,
        },
        order:[['createdAt','DESC']]
    });

    return list;
}
exports.GetCreditList = inline_GetCreditList;


let inline_InsertCredit = async (strID, strNickname, strGroupID, iClass, increase, writer) => {
    console.log(`InsertCredit : ${user}`);

    await db.CreditRecords.create(
        {
            strID: strID,
            strNickname: strNickname,
            strGroupID: strGroupID,
            iClass: iClass,
            increase: increase,
            writer: writer
        }
    );
}
exports.InsertCredit = inline_InsertCredit;

let inline_DeleteCredit = async (id, writer) => {
    console.log(`DeleteCredit : ${id} ${writer}`);

    let credit = await  db.CreditRecords.findOne({where: {id: id}});
    if (credit == null) {
        return;
    }
    // await credit.update({
    //     iDel:1, writer: writer
    // });
    await db.CreditRecords.update({iDel:1, writer: writer}, {where: {id: id}});
}
exports.DeleteCredit = inline_DeleteCredit;