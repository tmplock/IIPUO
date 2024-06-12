const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));


const axios = require('axios');
const db = require('../models');
const IInout = require('../implements/inout');
const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const ITime = require('../utils/time');

const ISocket = require('../implements/socket');
const IAgent = require("../implements/agent3");
const moment = require("moment");
const IAgentSec = require("../implements/agent_sec");

/*
    상부 얻어오는 것 (변경 필요할수 있음)
*/
let GetParentList = async (strGroupID, iClass) => {

    console.log(`GetParentList : ${strGroupID}, ${iClass}`);

    let objectData = {strAdmin:'', strPAdmin:'', strVAdmin:'', strAgent:'', strShop:''};

    if ( iClass == 8 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3,
            t4.strNickname AS lev4,
            t5.strNickname AS lev5
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
            WHERE t6.iClass='8' AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:result[0].lev5};
            
        //return result[0].lev1;
    }
    else if ( iClass == 7 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3,
            t4.strNickname AS lev4
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            WHERE t5.iClass='7' AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:''};
    }
    else if ( iClass == 6 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            WHERE t4.iClass='6' AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:'', strShop:''};
    }
    else if ( iClass == 5 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            WHERE t3.iClass='5' AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:'', strAgent:'', strShop:''};
    }
    else if ( iClass == 4 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.iClass='4' AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:'', strAgent:'', strShop:''};
    }
    else if ( iClass == 3 )
    {

    }
    return objectData;
}

router.post('/request_bank', async(req, res) => {
    console.log(req.body);
    let strID = req.body.strID ?? '';
    let strInput = req.body.strInput ?? '';
    if (strID == '' || strInput == '') {
        return res.send({result: 'FAIL', msg: '조회 실패'});
    }

    let user = await db.Users.findOne({where: {strID: strID}});
    if (user == null) {
        return res.send({result: 'FAIL', msg: '조회 실패'});
    }

    if (user.strPassword != strInput) {
        return res.send({result: 'FAIL', msg: '조회 실패'});
    }

    try {
        let obj = await IAgent.GetParentList(user.strGroupID, user.iClass);
        await db.RecordInoutAccounts.create({
            strID:user.strID,
            strNickname:user.strNickname,
            strAdminNickname:obj.strAdmin,
            strPAdminNickname:obj.strPAdmin,
            strVAdminNickname:obj.strVAdmin,
            strAgentNickname:obj.strAgent,
            strShopNickname:obj.strShop,
            iClass:user.iClass,
            strGroupID:user.strGroupID,
            strMemo:'',
            eType:'REQUEST',
            eState:'VALID',
            iAllowedTime :5,
            strLoginNickname: 'SYSTEM'
        });

        let iGrade = IAgent.GetGradeFromStrOptionCode(user.strOptionCode);

        let list = await db.BankGradeRecords.findAll({
            where: {
                iGrade: iGrade,
                eType: 'ACTIVE'
            }
        });

        if (list.length > 0) {
            let bankname = list[0].strBankName ?? '';
            let banknumber = list[0].strBankNumber ?? '';
            let bankholder = list[0].strBankHolder ?? '';
            if (bankname == '' && banknumber == '' && bankholder == '') {
                await InsertLetter(user);
            }

            res.send({
                result: 'OK',
                title: list[0].strTitle ?? '',
                msg: list[0].strMsg ?? '',
                msg2: list[0].strSubMsg ?? '',
                bankType: '',
                bankname: list[0].strBankName ?? '',
                banknumber: list[0].strBankNumber ?? '',
                bankholder: list[0].strBankHolder ?? ''
            });
        } else {
            await InsertLetter(user);
            res.send({
                result: 'OK',
                title: '입금 계좌는 쪽지를 통해 전달드립니다. 쪽지 내용을 확인하여 입금해주시기 바랍니다.',
                msg: '이전 계좌나 다른 계좌에 입금시 당사는 해당 금액을 책임지지 않으며',
                msg2: '회원님께서도 돌려받을 수 없음을 안내드립니다.',
                bankType: '',
                bankname: '',
                banknumber: '',
                bankholder: ''
            });
        }
    } catch (err) {
        console.log(err);
        res.send({
            result: 'FAIL',
            title: '',
            msg: '조회실패',
            msg2: '',
            bankType: '',
            bankname: '',
            banknumber: '',
            bankholder: ''
        });
    }
});

let InsertLetter = async (user) => {
    const objectData = await GetParentList(user.strGroupID, user.iClass);

    await db.Letters.create({
        iClass: user.iClass,
        strGroupID: user.strGroupID,
        strAdminNickname: objectData.strAdmin,
        strPAdminNickname: objectData.strPAdmin,
        strVAdminNickname: objectData.strVAdmin,
        strAgentNickname: objectData.strAgent,
        strShopNickname: objectData.strShop,
        strTo: objectData.strAdmin,
        strToID: objectData.strAdminID,
        strFrom: user.strNickname,
        strFromID: user.strID,
        eType: 'NORMAL',
        eRead: 'UNREAD',
        strSubject: "입금계좌 문의",
        strContents: "입급 계좌 문의 입니다.",
        iClassFrom: user.iClass, // 본인의 클래스
        iClassTo: 3, // 본사로 전송 고정
        strWriter: 'SYSTEM'
    });
}

module.exports = router;