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


    return res.send({
        eResult: 'OK',
        msg: '표시되는 계좌로 입금을 해주시기 바랍니다',
        bankType: user.eBankType,
        bankname: user.strBankname,
        banknumber: user.strBankNumber,
        bankholder: user.strBankHolder,
    });
});

module.exports = router;