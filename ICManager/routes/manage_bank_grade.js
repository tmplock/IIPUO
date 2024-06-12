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
// const util_time = require('../utils/time');
const IInout = require('../implements/inout');
const {Op, where}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const ITime = require('../utils/time');

const ISocket = require('../implements/socket');
const IAgent = require("../implements/agent3");
const moment = require("moment");
const IAgentSec = require("../implements/agent_sec");


/**
 * 입출금관리 > 입금목록 > 계좌보기 > 비밀번호 체크
 */
router.post('/request_input_pass', isLoggedIn, async (req, res) => {
    console.log(`request_inout_pass`);
    console.log(req.body);

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }

    const input = req.body.input;

    let result = await IAgentSec.AccessInoutPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.send(result);
        return;
    }

    let key = await IAgentSec.GetCipherAndPeriod(req.user.strNickname, 10);
    res.send({result: 'OK', msg: '조회 성공', key:key});
});

/**
 * 입출금관리 > 계좌보기
 */
// deprecate
// 계좌관리 비번 체크
router.post('/request_bank', isLoggedIn, async (req, res) => {
    console.log(`request_bank`);
    console.log(req.body);

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }

    const input = req.body.input;

    let result = await IAgentSec.AccessInoutPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.send(result);
        return;
    }
    res.send({result: 'OK'});
});

// 입출금관리 > 계좌관리
router.post('/popup_bank', isLoggedIn, async (req, res) => {
    console.log(`popup_bank`);
    console.log(req.body);

    const input = req.body.input ?? '';
    if (input == '') {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, msg:'비밀번호 미입력'});
        return;
    }

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, msg:'권한 없음'});
        return;
    }

    let result = await IAgentSec.AccessInoutPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, msg:result.msg});
        return;
    }

    let period = moment().add(10, "minute");
    let str = `${(req.user.strNickname ?? '')}&&${period}`;
    let key = await IAgent.GetCipher(str);
    let agent = {iClass:req.body.iClass, iRootClass: req.user.iClass, iPermission: req.user.iPermission, strNickname: req.body.strNickname, key:key};
    res.render('manage_bank_grade/popup_bank_grade', {iLayout:8, iHeaderFocus:0, user:agent, msg:''});
});

router.post('/request_bank_list', isLoggedIn, async (req, res) => {
    console.log(`request_bank_list`);
    console.log(req.body);
    if (req.user.iPermission != 0 || req.user.iClass != 2) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    let key = req.body.key ?? '';
    if (key == '') {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }
    let period = await IAgent.GetDeCipher(key);
    let arr = period.split('&&');
    if (arr.length != 2) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    if (arr[0] != req.user.strNickname) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    if (moment(arr[1]).isBefore(Date.now())) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    let user = await db.Users.findOne({
        where: {
            strNickname: req.user.strNickname
        }
    });
    let strGroupID = `${user.strGroupID}`.substring(0, 3);

    let list = await db.BankGradeRecords.findAll({
        where: {
            strGroupID:{
                [Op.like]:`${strGroupID}`
            }
        },
        order:[['iGrade', 'ASC']]
    });

    let newList = [];
    for (let i in list) {
        let grade = IAgent.GetGrade(list[i].iGrade);

        let obj = {id: list[i].id,
            iGrade: list[i].iGrade,
            strBankName: list[i].strBankName,
            strBankNumber: list[i].strBankNumber,
            strBankHolder: list[i].strBankHolder,
            createdAt: list[i].createdAt,
            eType: list[i].eType,
            strMemo: list[i].strMemo,
            strTitle: list[i].strTitle,
            strMsg: list[i].strMsg,
            strSubMsg: list[i].strSubMsg,
            strGrade: `${grade.id}:${grade.str}`
        };
        newList.push(obj);
    }
    res.send({result: 'OK', data: newList});
});

router.post('/request_change_bank_type', isLoggedIn, async (req, res) => {
    console.log(`request_change_bank_type`);
    console.log(req.body);

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }

    let id = req.body.id ?? 0;
    let eType = req.body.eType ?? '';
    if (id == 0 || eType == '') {
        res.send({result:'FAIL', msg: '필수값 없음'});
        return;
    }

    let obj = await db.BankGradeRecords.findOne({where : {id:id}});
    if (obj == null) {
        res.send({result:'FAIL', msg: '해당 정보 없음'});
        return;
    }

    // 동일 항목 사용중 체크
    if (eType == 'ACTIVE') {
        let list = await db.BankGradeRecords.findAll({where: {strGroupID: obj.strGroupID, eType:'ACTIVE', iGrade:obj.iGrade}});
        if (list.length > 0) {
            res.send({result:'FAIL', msg: '사용중인 계좌가 있습니다. 미사용으로 변경 후에 변경해주세요.'});
            return;
        }
    }

    await obj.update({
        eType: eType
    }, {
        where : {
            id : obj.id
        }
    });

    res.send({result: 'OK'});
});

router.post('/popup_bank_add', isLoggedIn,  async (req, res) => {
    console.log(`popup_bank_add`);

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }

    let id = req.body.id ?? -1;

    let bank = {iEdit: 0};
    // 수정용
    if (id != -1) {
        bank = await db.BankGradeRecords.findOne({
            where: {
                id: req.body.id
            }
        });

        if (bank == null) {
            res.render('error/popup_error', {msg: '조회 오류'});
            return;
        }
        bank.iEdit = 1;
    }

    let agent = {iClass: req.body.iClass, iRootClass: req.user.iClass, strNickname: req.body.strNickname};

    let gradelist = IAgent.GetGradeList();

    res.render('manage_bank_grade/popup_bank_grade_add', {iLayout:8, iHeaderFocus:0, user:agent, list:gradelist, bank:bank});
});

router.post('/request_bank_add', isLoggedIn, async (req, res) => {
    console.log(`request_bank_add`);

    if (req.user.iPermission != 0 || req.user.iClass != 2) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    let grade = parseInt(req.body.grade ?? -1);
    if (Number.isNaN(grade)) {
        grade = -1;
    }
    let bankName = req.body.bankName ?? '';
    let bankNumber = req.body.bankNumber ?? '';
    let bankHolder = req.body.bankHolder ?? '';
    let strGroupID = req.user.strGroupID;
    let strWriter = req.user.strNickname;
    let strMemo = IAgent.GetReplaceText(req.body.strMemo ?? '');
    let strTitle = IAgent.GetReplaceText(req.body.title ?? '');
    let strMsg = IAgent.GetReplaceText(req.body.msg ?? '');
    let strSubMsg = IAgent.GetReplaceText(req.body.subMsg ?? '');

    if (grade == -1 || strGroupID == '' || strWriter == '') {
        res.send({result:'FAIL', msg: '입력값 부족'});
        return;
    }

    if (strTitle == '' || strMsg == '') {
        res.send({result:'FAIL', msg: '경고 문구를 입력해주세요'});
        return;
    }


    let id = parseInt(req.body.id ?? 0);
    if (id != 0) {
        let bank = await db.BankGradeRecords.findOne({
            where: {
                id: id
            }
        });
        if (bank == null) {
            res.send({result:'FAIL', msg: '해당 정보가 없습니다'});
            return;
        }

        await db.BankGradeRecords.update({
            iGrade: parseInt(grade),
            strBankName: bankName,
            strBankNumber: bankNumber,
            strBankHolder: bankHolder,
            strGroupID: strGroupID,
            strWriter: strWriter,
            strMemo: strMemo,
            strTitle:strTitle,
            strMsg:strMsg,
            strSubMsg:strSubMsg,
        },{
            where: {
                id: id
            }
        });

        res.send({result:'OK', msg:'수정성공'});
    } else {

        await db.BankGradeRecords.create({
            iGrade: parseInt(grade),
            strBankName: bankName,
            strBankNumber: bankNumber,
            strBankHolder: bankHolder,
            strGroupID: strGroupID,
            strWriter: strWriter,
            strMemo: strMemo,
            strTitle:strTitle,
            strMsg:strMsg,
            strSubMsg:strSubMsg,
            eType: 'STOP'
        });
        res.send({result:'OK', msg:'등록성공'});
    }
});

router.post('/request_bank_memo_apply', isLoggedIn, async (req, res) => {
    console.log(`request_bank_memo_apply`);

    if (req.user.iPermission != 0 || req.user.iClass != 2) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    let id = parseInt(req.body.id ?? -1) ;
    if (Number.isNaN(id)) {
        id = -1;
    }
    let strMemo = req.body.strMemo ?? '';
    // 불필요한 입력값 제거
    strMemo = IAgent.GetReplaceText(strMemo);

    if (id == -1) {
        res.send({result:'FAIL', msg: '입력값 부족'});
        return;
    }

    let bank = await db.BankGradeRecords.findOne({where: {id: id}});
    if (bank == null) {
        res.send({result:'FAIL', msg: '해당 항목 조회 불가'});
        return;
    }

    await bank.update({
        strMemo: strMemo
    }, {
        where: {
            id: id
        }
    });

    res.send({result:'OK', msg:'등록성공'});
});

router.post('/request_bank_del', isLoggedIn, async (req, res) => {
    console.log(`request_bank_del`);

    if (req.user.iPermission != 0 || req.user.iClass != 2) {
        res.send({result: 'FAIL', data: [], msg:'권한 없음'});
        return;
    }

    let id = parseInt(req.body.id ?? -1) ;
    if (Number.isNaN(id)) {
        id = -1;
    }

    if (id == -1) {
        res.send({result:'FAIL', msg: '입력값 부족'});
        return;
    }

    await db.BankRecords.destroy({where: {id: id}});

    res.send({result:'OK', msg:'삭제성공'});
});

module.exports = router;