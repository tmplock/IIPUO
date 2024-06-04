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

    //TODO:strOptionCode 레벨을 확인하여 체크
    const array = user.strOptionCode.split('');
    const cInputOption = array[3];

    switch ( cInputOption )
    {
        case 0:
            return res.send({
                result: 'OK',
                msg: '표시되는 계좌로 입금을 해주시기 바랍니다',
                bankType: user.eBankType,
                bankname: user.strBankname,
                banknumber: user.strBankNumber,
                bankholder: user.strBankHolder,
            });
        case 1:
        default:
            {
                const objectData = GetParentList(user.strGroupID, user.iClass);

                await db.Letters.create({
                    iClass:user.iClass,
                    strGroupID:user.strGroupID,
                    strAdminNickname:objectData.strAdmin,
                    strPAdminNickname:objectData.strPAdmin,
                    strVAdminNickname:objectData.strVAdmin,
                    strAgentNickname:objectData.strAgent,
                    strShopNickname:objectData.strShop,
                    strTo:objectData.strAdmin,
                    strToID:objectData.strAdminID,
                    strFrom:user.strNickname,
                    strFromID:user.strID,
                    eType:'ANNOUNCE',
                    eRead:'UNREAD',
                    strSubject:"입금계좌 문의",
                    strContents:"입급 계좌 문의 입니다.",
                    iClassFrom:user.iClass, // 본인의 클래스
                    iClassTo:3, // 본사로 전송 고정
                });
            }
            break;
    }

});

module.exports = router;