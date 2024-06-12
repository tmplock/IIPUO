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

router.post('/account', isLoggedIn, async(req, res) => {
    console.log(req.body);

    const input = req.body.input ?? '';
    if (input == '') {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, yesterday:0, msg:'비밀번호 미입력'});
        return;
    }

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, msg:'조회오류', yesterday:0});
        return;
    }

    let result = await IAgentSec.AccessInoutPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, msg:result.msg, yesterday:0});
        return;
    }

    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};

    res.render('manage_bankaccount/account', {iLayout:8, iHeaderFocus:0, user:agent, msg:'', yesterday:0});

});

router.post('/yesterday', isLoggedIn, async(req, res) => {
    console.log(req.body);

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, user: {}, msg:'조회오류', yesterday:0});
        return;
    }

    let yesterday = parseInt(req.body.iYesterday ?? 0);
    if (Number.isNaN(yesterday)) {
        yesterday = 0;
    }
    yesterday = yesterday + 1;

    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};

    res.render('manage_bankaccount/account', {iLayout:8, iHeaderFocus:0, user:agent, msg:'', yesterday:yesterday});

});


router.post('/detail', isLoggedIn, async(req, res) => {

    console.log(`/manage_bankaccount/detail`);
    console.log(req.body);

    if (req.user.iClass != 2 && req.user.iPermission != 0) {
        res.render('error/popup_error', {iLayout:8, iHeaderFocus:0, msg: '조회에러', list:[], dateStart:req.body.dateStart, dateEnd:req.body.dateEnd});
        return;
    }

    let listRecordAccount = await db.RecordInoutAccounts.findAll({
        where: {
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:req.body.strID,
        },
        order:[['createdAt','DESC']]
    });

    res.render('manage_bankaccount/popup_detail', {iLayout:8, iHeaderFocus:0, list:listRecordAccount, dateStart:req.body.dateStart, dateEnd:req.body.dateEnd});

});

let BuildPartner = (objectUser, strOptionCode, listRecordAccount) => {

    console.log(`BuildPartner : ${listRecordAccount.length}`);

    let list = [];

    //let obj = await IAgent.GetParentList(objectUser.strGroupID, objectUser.iClass);

    let object = {strID:objectUser.strID, strGroupID:objectUser.strGroupID, iClass:objectUser.iClass, iNumRequest:0, iNumValidInput:0, iNumInvalidInput:0, iNumStandbyInput:0, strNickname:objectUser.strNickname, strOptionCode:strOptionCode};

    for ( let i in listRecordAccount )
    {
        if ( listRecordAccount[i].strID == objectUser.strID )
        {
            list.push(listRecordAccount[i]);
        }
    }


    for ( let i in list )
    {
        if ( list[i].eType == 'REQUEST' )
            object.iNumRequest ++;
        else if ( list[i].eType == 'INPUT' && list[i].eState == 'VALID' )
            object.iNumValidInput ++;
        else if ( list[i].eType == 'INPUT' && list[i].eState == 'INVALID' )
            object.iNumInvalidInput ++;
        else if ( list[i].eType == 'INPUT' && list[i].eState == 'STANDBY' )
            object.iNumStandbyInput ++;
    }

    return object;
}

router.post('/request_partner', isLoggedIn, async (req, res) => {

    console.log(`/request_partner`);
    console.log(req.body);

    if (req.user.iClass != 2 || req.user.iPermission != 0) {
        res.send({result:'FAIL', list:[], msg:'조회에러'});
        return;
    }

    let strNickname = req.body.strSearchNickname ?? '';
    let strGroupID = `${req.user.strGroupID}`.substring(0, 3);
    let dateStart = req.body.dateStart ?? '';
    let dateEnd = req.body.dateEnd ?? '';

    let subQuery = strNickname == '' ? '' : `AND t.strNickname = '${strNickname}'`;

    let [list] = await db.sequelize.query(`
        SELECT t.strNickname, t.createdAt, t.updatedAt, t.strGroupID, u.strID, u.strOptionCode,
               (SELECT MAX(createdAt) FROM RecordInoutAccounts WHERE DATE(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' AND strID = t.strID) AS lastDate,
               IFNULL((SELECT COUNT(id) FROM RecordInoutAccounts WHERE DATE(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' AND strID = t.strID AND eType = 'REQUEST'),0) AS iNumRequest,
               IFNULL((SELECT COUNT(id) FROM RecordInoutAccounts WHERE DATE(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' AND strID = t.strID AND eType = 'INPUT' AND eState = 'VALID'),0) AS iNumValidInput,
               IFNULL((SELECT COUNT(id) FROM RecordInoutAccounts WHERE DATE(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' AND strID = t.strID AND eType = 'INPUT' AND eState = 'INVALID'),0) AS iNumInvalidInput,
               IFNULL((SELECT COUNT(id) FROM RecordInoutAccounts WHERE DATE(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' AND strID = t.strID AND eType = 'INPUT' AND eState = 'STANDBY'),0) AS iNumStandbyInput
        FROM RecordInoutAccounts t
                 LEFT JOIN Users u ON u.strID = t.strID
        WHERE DATE(t.createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' AND t.strGroupID LIKE '${strGroupID}%'
        ${subQuery}
        GROUP BY t.strID
        ORDER BY lastDate DESC ;
    `);

    // let listPartner = strNickname == '' ? await db.Users.findAll({
    //     where:{
    //         strGroupID: {
    //             [Op.like]:`${strGroupID}%`
    //         }
    //     },
    //     order:[['updatedAt','DESC']]
    // }) : await db.Users.findAll({
    //     where:{
    //         strNickname:`${strNickname}`,
    //         strGroupID: {
    //             [Op.like]:`${strGroupID}%`
    //         }
    //     },
    //     order:[['updatedAt','DESC']]
    // });
    // let listRecordAccount = strNickname == '' ? await db.RecordInoutAccounts.findAll({
    //     where: {
    //         createdAt:{
    //             [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
    //         },
    //         strGroupID: {
    //             [Op.like]:`${strGroupID}%`
    //         }
    //     },
    //     order:[['createdAt','DESC']]
    // }) : await db.RecordInoutAccounts.findAll({
    //     where: {
    //         strNickname: `${strNickname}`,
    //         createdAt:{
    //             [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
    //         },
    //         strGroupID: {
    //             [Op.like]:`${strGroupID}%`
    //         }
    //     },
    //     order:[['createdAt','DESC']]
    // });
    // let list = [];
    // for ( let i in listPartner )
    // {
    //     const object = BuildPartner(listPartner[i], listPartner[i].strOptionCode, listRecordAccount);
    //     if ( object.iNumRequest == 0 && object.iNumInvalidInput == 0 && object.iNumStandbyInput == 0 && object.iNumValidInput == 0 )
    //         continue;
    //
    //     list.push(object);
    // }

    res.send({result:'OK', list:list});
});

router.post('/request_updategrade', isLoggedIn, async (req, res) => {

    console.log(`/request_updategrade`);
    console.log(req.body.data);

    const str = req.body.data;
    const array = str.split(',');

    for ( let i in array )
    {
        let a2 = array[i].split(':');
        
        await db.Users.update({strOptionCode:a2[1]}, {where:{strID:a2[0]}});
    }

    //console.log(list);

    res.send({result:'OK'});
});

module.exports = router;