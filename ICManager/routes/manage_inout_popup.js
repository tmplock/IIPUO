const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const ITime = require('../utils/time');
const ISocket = require('../implements/socket');
const IAgent = require('../implements/agent3');

const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const { IAgentObject } = require('../objects/betting');
const axios = require("axios");
const IAgentSec = require("../implements/agent_sec");

router.post('/requestcharge', isLoggedIn, async (req, res) => {
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass),
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const dbuser = await db.Users.findOne({where:{strNickname:user.strNickname}});
    if( dbuser != null ) {
        user.iCash = dbuser.iCash;
        user.strBankOwner = dbuser.strBankOwner;
    } else {
        res.render('error/popup_error', {iLayout:1, iHeaderFocus:1, user: {}, bank:{}, msg: '조회오류'});
        return;
    }

    if (req.user.iClass > dbuser.iClass || req.user.iPermission != 0 || req.user.iClass > 3) {
        res.render('error/popup_error', {iLayout:1, iHeaderFocus:1, user: {}, bank:{}, msg: '조회오류'});
        return;
    }

    // 등급체크
    let strGroupID = `${dbuser.strGroupID}`.substring(0,3);
    let iGrade = IAgent.GetGradeFromStrOptionCode(dbuser.strOptionCode);
    let list = await db.BankGradeRecords.findAll({
        where: {
            iGrade: iGrade,
            eType: 'ACTIVE',
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });

    if (list.length > 0) {
        user.msg = '';
        let key = await IAgentSec.GetCipherAndPeriod(req.user.strNickname, 10);
        res.render('manage_inout/popup_requestcharge', {iLayout:1, iHeaderFocus:1, user:user, bank:list[0]});
    } else {
        res.render('error/popup_error', {iLayout:1, iHeaderFocus:1, user: {}, bank:{}, msg:'등록된 계좌가 없습니다'});
    }
});

router.post('/requestexchange', isLoggedIn, async (req, res) => {
    let user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), strBankname:null, strBankAccount:null, strBankOwner:null,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const dbuser = await db.Users.findOne({where:{strNickname:user.strNickname}});
    if( dbuser != null ) {
        user.iCash = dbuser.iCash;
        user.pw_auth = dbuser.pw_auth;
        user.strBankname = dbuser.strBankname;
        user.strBankAccount = dbuser.strBankAccount;
        user.strBankOwner = dbuser.strBankOwner;
    } else {
        res.render('error/popup_error', {iLayout:1, iHeaderFocus:1, user: {}, iForced:req.body.iForced, msg: '조회오류'});
        return;
    }

    if (req.user.iClass > dbuser.iClass) {
        res.render('error/popup_error', {iLayout:1, iHeaderFocus:1, user: {}, iForced:req.body.iForced, msg: '조회오류'});
        return;
    }

    user.msg = '';
    res.render('manage_inout/popup_requestexchange', {iLayout:1, iHeaderFocus:1, user:user, iForced:req.body.iForced});
});

router.post('/request_changeoutputpassword', isLoggedIn, async (req, res) => {

    console.log(`/request_changeoutputpassword`);
    console.log(req.body);

    if (req.user.iClass != 1) {
        res.send({result:'FAIL'});
        return;
    }

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( null != user )
    {
        //await user.update({strOutputPassword:req.body.strOutputPassword, pw_auth:0});

        await db.Users.update({strOutputPassword:req.body.strOutputPassword, pw_auth:0}, {where:{strNickname:req.body.strNickname}});
    }

    res.send({result:'OK'});
});

router.post('/request_savememo', isLoggedIn, async (req, res) => {

    console.log(req.body);

    //let data = await db.Inouts.findOne({where:{id:req.body.id}});
    //await data.update({strMemo:req.body.strMemo});
    await db.Inouts.update({strMemo:req.body.strMemo}, {where:{id:req.body.id}});
});

router.post('/request_adjustinput', isLoggedIn, async (req, res) => {

    console.log(req.body);
    let objectParents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass);
    let dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    // 은행정보 확인(대본사부터)
    if (req.user.iClass > 3) {
        let strBankOwner = dbuser.strBankOwner ?? '';
        let strBankAccount = dbuser.strBankAccount ?? '';
        let strBankname = dbuser.strBankname ?? '';

        if (strBankOwner == '' || strBankAccount == '' || strBankname == '') {
            res.send({'result' : 'FAIL', 'msg': '출금계좌가 미등록되어 있습니다'});
            return;
        }
    }

    // 권한 체크
    if (req.user.iClass > 3 || req.user.iPermission != 0) {
        res.send({result : 'FAIL', msg: '조회 오류'});
        return;
    }

    await db.Inouts.create({
        strID:req.body.strNickname,
        strAdminNickname:objectParents.strAdmin,
        strPAdminNickname:objectParents.strPAdmin,
        strVAdminNickname:objectParents.strVAdmin,
        strAgentNickname:objectParents.strAgent,
        strShopNickname:objectParents.strShop,
        iClass:req.body.iClass,
        strGroupID:req.body.strGroupID,
        strName:req.body.strNickname,
        strAccountOwner:req.body.strBankOwner,
        strAccountNumber:req.body.strAccountNumber,
        strBankName:req.body.strBankName,
        eType:'INPUT',
        eState:'REQUEST',
        iPreviousCash:req.body.iPreviousCash,
        iAmount:req.body.iAmount,
        iRequestClass: req.user.iClass,
        strRequestNickname:req.user.strNickname,
        completedAt:null,
    });

    let iClass = parseInt(req.body.iClass);
    if (iClass == 2) {
        let nickname = ISocket.GetNicknameClass(req.body.strGroupID, 1);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_input');
        }
    } else if (iClass == 3) {
        let nickname = ISocket.GetNicknameClass(req.body.strGroupID, 2);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_input');
        }
    } else {
        let nickname = ISocket.GetNicknameClass(req.body.strGroupID, 2);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_input');
        }
        nickname = ISocket.GetNicknameClass(req.body.strGroupID, 3);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_input');
        }
    }

    res.send({'result': 'OK'});

})

router.post('/request_adjustoutput', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const userinfo = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( null == userinfo )
    {
        res.send({result:'FAIL', reason:'ERROR'});
        return;
    }

    if ( parseInt(req.body.iAmount) > userinfo.iCash )
    {
        res.send({result:'FAIL', reason:'NOTENOUGH'});
        return;
    }

    if (req.user.iClass > 3 || req.user.iPermission != 0) {
        res.send({result:'FAIL', reason:'ERROR'});
        return;
    }

    let objectParents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass);

    await db.Inouts.create({
        strID:req.body.strNickname,
        strAdminNickname:objectParents.strAdmin,
        strPAdminNickname:objectParents.strPAdmin,
        strVAdminNickname:objectParents.strVAdmin,
        strAgentNickname:objectParents.strAgent,
        strShopNickname:objectParents.strShop,
        iClass:req.body.iClass,
        strGroupID:req.body.strGroupID,
        strName:req.body.strNickname,
        strAccountOwner:req.body.strAccountOwner,
        strAccountNumber:req.body.strAccountNumber,
        strBankName:req.body.strBankName,
        eType:'OUTPUT',
        eState:'REQUEST',
        iPreviousCash:req.body.iPreviousCash,
        iAmount:req.body.iAmount,
        iRequestClass: req.user.iClass,
        strRequestNickname:req.user.strNickname,
        completedAt:null,
    });

    let target = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( null != target )
    {
        let iCash = target.iCash - parseInt(req.body.iAmount);

        console.log(`AdjustOutput : ${iCash}`);

        if ( iCash >= 0 ) {
            await db.Users.update({iCash:iCash}, {where: {strNickname:req.body.strNickname}});
            // await target.update({iCash:iCash});

            console.log(`Pre Calculated`);

            ISocket.AlertCashByNickname(req.body.strNickname, iCash);

            // user cash update
            let objectAxios = {strNickname:target.strNickname, iAmount:target.iCash};
            axios.post(`${target.strURL}/UpdateCoin`, objectAxios)
                .then((response)=> {
                    console.log(`Axios Success /UpdateCoin : ${iCash}`);
                })
                .catch((error)=> {
                    console.log('axios Error /UpdateCoin');
                });
        }
    }

    let iClass = parseInt(req.body.iClass);
    // 본사, 총본은 상부에만 알림
    if (iClass == 2) {
        let nickname = ISocket.GetNicknameClass(req.body.strGroupID, 1);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_output');
        }
    } else if (iClass == 3) {
        let nickname = ISocket.GetNicknameClass(req.body.strGroupID, 2);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_output');
        }
    } else {
        let nickname = ISocket.GetNicknameClass(req.body.strGroupID, 2);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_output');
        }
        nickname = ISocket.GetNicknameClass(req.body.strGroupID, 3);
        if (nickname != '') {
            ISocket.AlertByNickname(nickname, 'alert_output');
        }
    }

    res.send({result:'OK', reason:''});
});



module.exports = router;