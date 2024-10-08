const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const ITime = require('../utils/time');
const IUtil = require("../utils/util");
const ISocket = require('../implements/socket');
const {Op}= require('sequelize');
const IAgentSettle = require('../implements/agent_settle3');
const IAgent = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const IInout = require("../implements/inout");
const IAgentSec = require("../implements/agent_sec");
const moment = require("moment/moment");
//////////////////////////////////////////////////////////////////////////////
// 총총에서만 조회
router.post('/agent', isLoggedIn, async (req, res) => {

    console.log(`/agent`);
    console.log(req.body);

    if (req.user.iClass != 1) {
        res.send('조회에러');
        return;
    }

    let input = req.body.input ?? '';
    if (input == '') {
        res.send('조회에러');
        return;
    }

    let result = await IAgentSec.AccessPartnerInfoPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.send(result);
        return;
    }

    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iRootNickname = req.user.strNickname;
    user.iPermission = req.user.iPermission;

    if (user.iClass <= req.user.iClass || user.strGroupID.indexOf(req.user.strGroupID) != 0) {
        res.send('권한없음');
        return;
    }

    const sid = req.user.strID
    let iC = await db.Users.findOne({where:{strID:req.user.strID}});

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);
    let iClass = user.iClass;
    let iRootClass = iC.iClass;

    res.render('manage_partner/popup_agentinfo', {iLayout:2, iHeaderFocus:0, agent:user, sid:sid, pw_auth:iC.pw_auth, iClass:iClass, iRootClass: iRootClass, strParent:parents.strParents, iPermission:iC.iPermission});
});

router.post('/agentinfo', isLoggedIn, async (req, res) => {

    console.log(`/agentinfo`);
    console.log(req.body);
    
    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iRootNickname = req.user.strNickname;
    user.iPermission = req.user.iPermission;

    const sid = req.user.strID
    let iC = await db.Users.findOne({where:{strID:req.user.strID}});

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);
    let iClass = user.iClass;
    let iRootClass = iC.iClass;

    res.render('manage_partner/popup_agentinfo', {iLayout:2, iHeaderFocus:0, agent:user, sid:sid, pw_auth:iC.pw_auth, iClass:iClass, iRootClass: iRootClass, strParent:parents.strParents, iPermission:iC.iPermission});
});

router.post('/viceadminlist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, '', agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, dateStart, dateEnd, '', true);

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_viceadminlist', {iLayout:2, iHeaderFocus:1, agent:agent, overview:overview, agentlist:agentlist, strParent:parents.strParents});

});

router.post('/proadminlist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, '', agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, dateStart, dateEnd, '', true);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_proadminlist', {iLayout:2, iHeaderFocus:10, agent:agent, overview:overview, agentlist:agentlist, strParent:parents.strParents});

});
router.post('/agentlist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, '', agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, dateStart, dateEnd, '', true);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);

    res.render('manage_partner/popup_agentlist', {iLayout:2, iHeaderFocus:2, agent:agent, overview:overview, agentlist:agentlist, strParent:parents.strParents});
});

router.post('/shoplist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, 3, dateStart, dateEnd,  '', true);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);

    res.render('manage_partner/popup_shoplist', {iLayout:2, iHeaderFocus:3, agent:agent, overview:overview, bettingrecord:bettingrecord, agentlist:agentlist, strParent:parents.strParents});

});

router.post('/userlist', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, 8, dateStart, dateEnd);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_userlist', {iLayout:2, iHeaderFocus:4, agent:agent, overview:overview, bettingrecord:bettingrecord, agentlist:agentlist, strParent:parents.strParents});
});

router.post('/charges', isLoggedIn, async (req, res) => {

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    // let inputs = await db.Inouts.findAll({
    //     where:{
    //         strGroupID:{
    //             [Op.like]:req.body.strGroupID+'%'
    //         },
    //         eType:'INPUT',
    //         eState:'COMPLETE'
    //     },
    //     order:[['createdAt','DESC']]
    // });
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);

    res.render('manage_partner/popup_charges', {iLayout:2, iHeaderFocus:5, agent:agent, inputs:[], strParent:parents.strParents});
});

router.post('/exchanges', isLoggedIn, async (req, res) => {

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let outputs = await db.Inouts.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            eType:'OUTPUT',
            eState:'COMPLETE'
        },
        order:[['createdAt','DESC']]
    });
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);

    res.render('manage_partner/popup_exchanges', {iLayout:2, iHeaderFocus:6, agent:agent, outputs:outputs, strParent:parents.strParents});
});

router.post('/points', isLoggedIn, async (req, res) => {

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);

    res.render('manage_partner/popup_points', {iLayout:2, iHeaderFocus:7, agent:agent, strParent:parents.strParents});
});

router.post('/request_gtrecord_partner', isLoggedIn, async(req, res) => {

    console.log(`request_gtrecord_user############################################################################`);
    console.log(req.body);

    let searchType = req.body.searchType ?? '';
    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strNickname = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;
    let list = [];
    let subQuery = '';
    if (searchType == 'inout') {
        subQuery = `AND eType IN ('GIVE', 'TAKE')`;
    } else if (searchType == 'rolling') {
        subQuery = `AND eType IN ('ROLLING')`;
    }
    // 두개를 하나의 테이블로 UNION
    if ( req.body.strSearch == '' )
    {
        list = await db.sequelize.query(`
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat 
            FROM GTs 
            WHERE strFrom = '${strNickname}'
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            UNION
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strTo = '${strNickname}' 
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            ORDER BY createdAt DESC
        `);
    } else {
        list = await db.sequelize.query(`
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strFrom = '${strNickname}' 
            AND strTo LIKE CONCAT('${req.body.strSearch}', '%') 
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            UNION
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strTo = '${strNickname}' 
            AND strFrom LIKE CONCAT('${req.body.strSearch}', '%')
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            ORDER BY createdAt DESC
        `);
    }
    res.send(list[0]);
});

router.post('/logs', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_logs', {iLayout:2, iHeaderFocus:20, agent:agent, strParent: parents.strParents});
});

router.post('/games', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_games', {iLayout:2, iHeaderFocus:9, agent:agent, overview:overview, bettingrecord:bettingrecord, strParent:parents.strParents});
});

router.post('/bettingrecord', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateSelfBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermSelfBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_bettingrecord', {iLayout:2, iHeaderFocus:8, agent:agent, overview:overview, bettingrecord:bettingrecord, strParent:parents.strParents});
});

//  test
router.post('/ur', isLoggedIn, async (req, res) => {
    res.render('manage_partner/popup_ur', {iLayout:1 });
});

router.post('/request_finduserur', async (req, res) => {

    console.log(`/manage_partner_popup/request_finduserur`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user != null )
    {
        res.send({result:'OK', strNickname:user.strNickname, fRRB:user.fRRB, fRRS:user.fRRS, iRRTurn:user.iRRTurn});
    }
    else
    {
        res.send({reuslt:'Error'});
    }
});

router.post('/request_saveuserur', async (req, res) => {

    console.log(`/manage_partner_popup/request_saveuserur`);
    console.log(req.body);

    const found = await db.RecordChangeURs.findOne({where:{strNickname:req.body.strNickname}});
    if ( found != null )
    {
        //await db.Users.update({fRRB:req.body.fRRB, fRRS:req.body.fRRS, iRRTurn:req.body.iRRTurn}, {where:{strNickname:req.body.strNickname}});

        await db.RecordChangeURs.update({fRRB:req.body.fRRB, fRRS:req.body.fRRS, iRRTurn:req.body.iRRTurn}, {where:{strNickname:req.body.strNickname}})
    }
    else
    {
        await db.RecordChangeURs.create({strNickname:req.body.strNickname, fRRB:req.body.fRRB, fRRS:req.body.fRRS, iRRTurn:req.body.iRRTurn});
    }
    await db.Users.update({fRRB:req.body.fRRB, fRRS:req.body.fRRS, iRRTurn:req.body.iRRTurn}, {where:{strNickname:req.body.strNickname}});


    res.send({result:'OK'});

    // const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    // if ( user != null )
    // {
    //     res.send({result:'OK', strNickname:user.strNickname, fRRB:user.fRRB, fRRS:user.fRRS, iRRTurn:user.iRRTurn});
    // }
    // else
    // {
    //     res.send({reuslt:'Error'});
    // }
});

router.post('/request_changeurlist', async (req, res) => {

    console.log(`/manage_partner_popup/request_changeurlist`);
    console.log(req.body);

    let list = await db.RecordChangeURs.findAll();

    res.send({result:'OK', list:list});

    // const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    // if ( user != null )
    // {
    //     res.send({result:'OK', strNickname:user.strNickname, fRRB:user.fRRB, fRRS:user.fRRS, iRRTurn:user.iRRTurn});
    // }
    // else
    // {
    //     res.send({reuslt:'Error'});
    // }
});

// router.post('/memos', isLoggedIn, async (req, res) => {

//     console.log(req.body);

//     //var agent = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass};
//     const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

//     res.render('manage_partner/popup_memos', {iLayout:2, iHeaderFocus:9, agent:agent});

// });

router.post('/settingodds', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const input = req.body.pass ?? '';

    let result = await IAgentSec.AccessOddPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.send(result);
        return;
    }

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dbuser = await db.Users.findOne({where: {strNickname: req.body.strNickname}});

    const user = {fSlotR: dbuser.fSlotR, fBaccaratR: dbuser.fBaccaratR, fUnderOverR: dbuser.fUnderOverR,
        fPBR:dbuser.fPBR, fPBSingleR:dbuser.fPBSingleR, fPBDoubleR:dbuser.fPBDoubleR, fPBTripleR:dbuser.fPBTripleR,
        fSettleSlot:dbuser.fSettleSlot, fSettleBaccarat:dbuser.fSettleBaccarat, fSettlePBA:dbuser.fSettlePBA, fSettlePBB:dbuser.fSettlePBB
    };

    res.render('manage_partner/popup_settingodds', {iLayout:1, iHeaderFocus:0, agent:agent, user:user});

});



router.post('/removedb', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const input = req.body.pass ?? '';

    // 비밀번호는 로그인한 이용자
    const info = await db.Users.findOne({where: {strNickname: req.user.strNickname, strPassword: input}});
    if (info == null) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }

    if (input != '' || true) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    res.render('manage_partner/popup_removedb', {iLayout:1, iHeaderFocus:0, agent:agent});

});


//  Ajax
router.post('/registeragent', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
                    iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    res.render('manage_partner/popup_registeragent', {iLayout:1, parent:user});

});

router.post('/register_agent', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    agent.iAgentClass = req.body.iAgentClass;
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_register_agent', {iLayout:2, iHeaderFocus:22, agent:agent, strParent:parents.strParents, user:agent, parent:agent});
});

router.post('/popup_listadmin_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    if (req.user.iClass > 2) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    let user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    // 비밀번호 체크
    let pass = req.body.pass ?? '';
    let result = await IAgentSec.AccessAdminRegisterPassword(req.user.strNickname, pass);
    if (result.result != 'OK') {
        user.msg = result.msg;
        res.render('manage_partner/popup_listadmin_view', {iLayout:7, iHeaderFocus:0, agent:user, list:[], strParent: ''});
        return;
    }

    let list = await db.sequelize.query(
        `
        SELECT u.strNickname AS strRelNickname, u3.strNickname, u3.strID, u3.eState, u3.strGroupID, u3.iPermission, u3.iClass
        FROM Users AS u3
        LEFT JOIN Users u ON u.id = u3.iRelUserID
        WHERE u3.iClass = 3 AND u3.iPermission = 100 AND u3.strGroupID LIKE '${req.body.strGroupID+'%'}' 
        `
    );
    res.render('manage_partner/popup_listadmin_view', {iLayout:7, iHeaderFocus:0, agent:user, list:list[0], strParent: user.strNickname});
});


router.post('/popup_listvice_view', isLoggedIn, async(req, res) => {
    console.log(req.body);

    if (req.user.iClass > 1) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    let user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    // 비밀번호 체크
    let pass = req.body.pass ?? '';
    let result = await IAgentSec.AccessViceRegisterPassword(req.user.strNickname, pass);
    if (result.result != 'OK') {
        user.msg = result.msg;
        res.render('manage_partner/popup_listvice_view', {iLayout:7, iHeaderFocus:0, agent:user, list:[], strParent: ''});
        return;
    }

    let list = await db.sequelize.query(
        `
        SELECT u.strNickname AS strRelNickname, u3.strNickname, u3.strID, u3.eState, u3.strGroupID, u3.iPermission, u3.iClass
        FROM Users AS u3
        LEFT JOIN Users u ON u.id = u3.iRelUserID
        WHERE u3.iClass = 2 AND u3.iPermission = 100 AND u3.strGroupID LIKE '${req.body.strGroupID+'%'}' 
        `
    );
    res.render('manage_partner/popup_listvice_view', {iLayout:7, iHeaderFocus:0, agent:user, list:list[0], strParent: user.strNickname});
});

router.post('/registeragent_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    let [list] = await db.sequelize.query(`
        SELECT u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
            u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
            u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
            u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB, u.createdAt, u.updatedAt,
            u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser
        FROM Users u
        WHERE u.iClass = ${req.body.iAgentClass}
            AND u.strGroupID LIKE '${req.body.strGroupID}%'
            AND u.iPermission != 100
    `);
    res.render('manage_partner/popup_registeragent_view', {iLayout:1, agent:user, list:list, iAgentClass:user.iAgentClass});
});


router.post('/readagent_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    let strID = req.body.strID;
    let dbUser = await db.Users.findOne({
        where: {
            strID: strID,
        }
    });
    const user = {strNickname:dbUser.strNickname, strID:dbUser.strID, strPassword:dbUser.strPassword, strGroupID:dbUser.strGroupID, iClass:dbUser.iClass, iAgentClass:dbUser.iClass,
        iRootClass:req.user.iClass, iPermission:dbUser.iPermission, iRelUserID: dbUser.iRelUserID};

    let list = await db.sequelize.query(`
        SELECT u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
            u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
            u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
            u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB, u.createdAt, u.updatedAt,
            u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser
        FROM Users u
        WHERE u.iClass = ${user.iClass}
            AND u.strGroupID LIKE '${user.strGroupID}%'
            AND u.iPermission != 100
    `);
    res.render('manage_partner/popup_registeragent_view', {iLayout:1, agent:user, list:list[0]});
});

router.post('/request_register_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    try {
        // 신규 여부 확인
        let user = await db.Users.findOne({
            where: {
                strID: req.body.strID
            }
        });

        // 업데이트
        if (user != null) {
            // await user.update({
            //     strID:req.body.strID,
            //     strPassword:req.body.strPassword,
            //     strNickname:req.body.strNickname,
            // });
            await db.Users.update({            
                strID:req.body.strID,
                strPassword:req.body.strPassword,
                strNickname:req.body.strNickname,
            }, {where:{strID:req.body.strID}});
            res.send({result:'OK', string:'에이전트(보기용) 수정 되었습니다.'});
            return;
        }

        // 신규 등록
        if (user == null) {
            let iRelUserID = req.body.iRelUserID;
            user = await db.Users.findOne({
                where: {
                    id: iRelUserID,
                }
            });
            let iLoginMax = 1;
            if (parseInt(user.iClass) == 2) {
                iLoginMax = 10;
            } else if (parseInt(user.iClass) == 3) {
                iLoginMax = 2;
            }

            let iSettleDays = null;
            let iSettleType = null;
            if (user.iClass <= 5) {
                iSettleDays = req.body.iSettleDays ?? 15;
                iSettleType = req.body.iSettleType ?? 0;
            }

            await db.Users.create({
                strID:req.body.strID,
                strPassword:req.body.strPassword,
                strNickname:req.body.strNickname,
                strMobile:'',
                strBankname:'',
                strBankAccount:'',
                strBankOwner:'',
                strBankPassword:'',
                strOutputPassowrd:'',
                iClass:user.iClass,
                strGroupID:user.strGroupID,
                iParentID:user.iParentID,
                iCash:0,
                iLoan:0,
                iRolling:0,
                iSettle:0,
                iSettleAcc:0,
                fBaccaratR:user.fBaccaratR,
                fSlotR:user.fSlotR,
                fUnderOverR:user.fUnderOverR,
                fPBR:user.fPBR,
                fPBSingleR:user.fPBSingleR,
                fPBDoubleR:user.fPBDoubleR,
                fPBTripleR:user.fPBTripleR,
                fSettleSlot:user.fSettleSlot,
                fSettleBaccarat:user.fSettleBaccarat,
                fSettlePBA:user.fSettlePBA,
                fSettlePBB:user.fSettlePBB,
                eState:'BLOCK',
                //strOptionCode:'00000000',
                strOptionCode:user.strOptionCode,
                strPBOptionCode:user.strPBOptionCode,
                iPBLimit:user.iPBLimit,
                iPBSingleLimit:user.iPBSingleLimit,
                iPBDoubleLimit:user.iPBDoubleLimit,
                iPBTripleLimit:user.iPBTripleLimit,
                strSettleMemo:'',
                iNumLoginFailed: 0,
                iPermission:100,
                iRelUserID:iRelUserID,
                iLoginMax:iLoginMax,
                iSettleDays:iSettleDays,
                iSettleType:iSettleType
            });
            res.send({result:'OK', string:'에이전트(보기용) 생성을 완료 하였습니다.'});
        }
    } catch (err) {
        res.send({result:'FAIL', string:`에이전트(보기용) 생성을 실패했습니다.(${err})`});
    }
});

router.post('/request_removeagent_view', isLoggedIn, async (req, res) => {

    console.log(`/request_removeagent_view`);
    console.log(req.body);

    if (req.user.iPermission == 100) {
        res.send({result: 'ERROR', msg:'권한이 없습니다'});
        return;
    }

    let strID = req.body.strID;
    let target = await db.Users.findOne({where:{strID:strID, iPermission:100}});
    if (target == null) {
        res.send({result:'ERROR'});
        return;
    }

    if (req.user.iClass >= target.iClass) {
        res.send({result: 'ERROR', msg:'권한이 없습니다'});
        return;
    }

    await db.Users.destroy({where:{strID:strID}});
    res.send({result:'OK'});
});

router.post('/request_parentenablelist', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let list = await db.sequelize.query(`
        SELECT u.id, u.strID, u.strNickname, u.iClass, u.iPermission, u.strGroupID, u.iParentID,
            u.iCash, u.iRolling, u.iSettle, u.iSettleAcc, u.iSettleAccBefore,
            u.fBaccaratR, u.fSlotR, u.fUnderOverR, u.fPBR, u.fPBSingleR, u.fPBDoubleR, u.fPBTripleR,
            u.fSettleBaccarat, u.fSettleSlot, u.fSettlePBA, u.fSettlePBB, u.createdAt, u.updatedAt,
            u.eState, u.strIP, u.strOptionCode, u.strSettleMemo, u.iRelUserID, u.fCommission, u.iPassCheckNewUser
        FROM Users u
        WHERE u.iClass = ${parseInt(req.body.iRegisterClass)-1}
            AND u.strGroupID LIKE '${req.body.strGroupID}%'
            AND u.iPermission != 100 
    `);
    res.send(list[0]);
})

router.post('/request_confirmagentid', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let list = await db.Users.findOne({where:{
        strID:req.body.strID
    }});
    if ( list == null )
        res.send('OK');
    else
        res.send('EXIST');
})

router.post('/request_confirmagentnickname', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let list = await db.Users.findOne({where:{
        strNickname:req.body.strNickname
    }});
    if ( list == null )
        res.send('OK');
    else
        res.send('EXIST');
})

router.post('/request_confirm_auto_register_value', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let nickname = req.body.strNickname ?? '';
    let id = req.body.strID ?? '';
    let number = parseInt(req.body.number ?? 0);

    if (id == '') {
        res.send({result: 'FAIL', msg: '아이디을 입력해주세요'});
        return;
    }
    if (nickname == '') {
        res.send({result: 'FAIL', msg: '닉네임을 입력해주세요'});
        return;
    }
    if (number < 2) {
        res.send({result: 'FAIL', msg: '자동생성 입력값을 1보다 커야 합니다'});
        return;
    }

    let idList = GetIDList(id, number);
    let nicknameList = GetNicknameList(nickname, number);

    let listID = await db.Users.findAll({
        where: {
            strID: {
                [Op.in]:idList
            }
        }
    });
    if (listID.length > 0) {
        let msg = '';
        for (let i in listID) {
            msg = msg == '' ? `${listID[i].strID}` : `${msg}, ${listID[i].strID}`;
        }
        res.send({result: 'FAIL', msg: `중복된 아이디가 있습니다(${msg})`});
        return;
    }


    let listNickname = await db.Users.findAll({
        where: {
            strNickname: {
                [Op.in]:nicknameList
            }
        }
    });
    if (listNickname.length > 0) {
        let msg = '';
        for (let i in listNickname) {
            msg = msg == '' ? `${listNickname[i].strNickname}` : `${msg}, ${listNickname[i].strNickname}`;
        }
        res.send({result: 'FAIL', msg: `중복된 닉네임이 있습니다(${msg})`});
        return;
    }

    res.send({result:'OK' , msg: ''});
});

let GetIDList = (id, number) => {
    let numberId = "";
    for (let i = id.length - 1; i >= 0; i--) {
        if (Number.isNaN(parseInt(id[i]))) {
            if (numberId == '') {
                numberId = '1';
            }
            break;
        } else {
            numberId = `${id[i]}${numberId}`;
        }
    }
    let strID = id.replace(numberId, '');
    numberId = parseInt(numberId);

    // 체크 항목 리스트 만들기
    let idList = [];
    for (let i = 0; i<number; i++) {
        idList.push(`${strID}${numberId+i}`);
    }
    return idList;
}
let GetNicknameList = (nickname, number) => {
    let numberNickname = '';
    for (let i = nickname.length - 1; i >= 0; i--) {
        if (Number.isNaN(parseInt(nickname[i]))) {
            if (numberNickname == '') {
                numberNickname = '1';
            }
            break;
        } else {
            numberNickname = `${nickname[i]}${numberNickname}`;
        }
    }
    let strNickname = nickname.replace(numberNickname, '');
    numberNickname = parseInt(numberNickname);

    // 체크 항목 리스트 만들기
    let nicknameList = [];
    for (let i = 0; i<number; i++) {
        nicknameList.push(`${strNickname}${numberNickname+i}`);
    }
    return nicknameList;
}


var leadingZeros = (n, digits) => {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

let CalculateGroupID = async (strParentGroupID, iParentClass) => {

    let children = await db.Users.findOne({
            where:{
                strGroupID:{
                    [Op.like]:strParentGroupID+'%'
                },
                iClass:parseInt(iParentClass)+1
            },
            order:[['strGroupID','DESC']],
        });

    let group = '';

    if ( iParentClass != IAgent.EAgent.eShop)
    {
        if ( children == null )
            group = '00';
        else {
            let strGroupID = children.strGroupID;
            let id = strGroupID.substring(strGroupID.length-2);
            let newID = parseInt(id)+1;
            group = leadingZeros(newID, 2);
        }
    }
 
    const strGroupID = strParentGroupID + group;

    return strGroupID;
}

router.post('/request_register', isLoggedIn, async(req, res) => {
    console.log(req.body);
    // 권한 체크
    let iClass = parseInt(req.body.iParentClass)+1;
    if (iClass <= req.user.iClass) {
        res.send({result:'FAIL', string:`허가되지 않은 사용자입니다`});
        return;
    }

    try {
        let strID = req.body.strID;
        let strNickname = req.body.strNickname;

        let fSettleBaccarat = parseFloat(req.body.fSettleBaccarat ?? 0);
        fSettleBaccarat = Number.isNaN(fSettleBaccarat) ? 0 : fSettleBaccarat;

        let fSettleSlot = parseFloat(req.body.fSettleSlot ?? 0);
        fSettleSlot = Number.isNaN(fSettleSlot) ? 0 : fSettleSlot;

        let fBaccaratR = parseFloat(req.body.fBaccaratR ?? 0);
        fBaccaratR = Number.isNaN(fBaccaratR) ? 0 : fBaccaratR;

        let fSlotR = parseFloat(req.body.fSlotR ?? 0);
        fSlotR = Number.isNaN(fSlotR) ? 0 : fSlotR;

        let fUnderOverR = parseFloat(req.body.fUnderOverR ?? 0);
        fUnderOverR = Number.isNaN(fUnderOverR) ? 0 : fUnderOverR;

        let iPassCheckNewUser = parseInt(req.body.iPassCheckNewUser ?? 1);
        iPassCheckNewUser = Number.isNaN(iPassCheckNewUser) ? 1 : iPassCheckNewUser;

        if (fSlotR < 0 || fBaccaratR < 0 || fUnderOverR < 0) {
            res.send({result:'Error', error:'Rolling', string:'롤링 설정값을 확인해주세요'});
            return;
        }

        if (fSettleSlot < 0 || fSettleBaccarat < 0) {
            res.send({result:'Error', error:'Settle', string:'죽장 설정값을 확인해주세요'});
            return;
        }

        const parent = await db.Users.findOne({where:{id:req.body.iParentID}});
        if ( parent == null ) {
            res.send({result:'FAIL', error:'Rolling', string:'에이전트 생성을 실패했습니다.'});
            return;
        }

        if ( parent != null )
        {
            if ( parent.fSlotR < fSlotR ||
                parent.fBaccaratR < fBaccaratR ||
                parent.fUnderOverR < fUnderOverR )
            {
                res.send({result:'Error', error:'Rolling', string:'롤링비(%)는 상위 에이전트 보다 클 수 없습니다.'});
                return;
            }

            // 죽장은 본사 ~ 대본만 체크
            // 본사가 누적이면 하위는 모두 누적이어야 함, 하위 죽장률 체크 필요
            // 본사가 리셋이면 하위는 모두 리셋이어야 함, 하위 죽장률 체크 불필요
            let padmin = await IAgent.GetPAdminInfo(parent);
            if (padmin != null && padmin.iSettleType != 1) {
                if (parent.iClass == 3 || parent.iClass == 4 || parent.iClass == 5) {
                    if (parent.fSettleBaccarat < fSettleBaccarat || parent.fSettleSlot < fSettleSlot) {
                        res.send({result:'Error', error:'Settle', string:'죽장(%)은 상위 에이전트 보다 클 수 없습니다.'});
                        return;
                    }
                }
            }
        }

        let iAutoRegisterNumber = parseInt(req.body.iAutoRegisterNumber);
        let iCheckAutoRegister = parseInt(req.body.iCheckAutoRegister ?? 0);
        let idList = [];
        let nicknameList = [];
        if (iCheckAutoRegister == 1) {
            if (iAutoRegisterNumber <= 1) {
                res.send({result:'Error', error:'FAIL', string:'자동생성 입력값을 확인해주세요(1보다 커야합니다)'});
                return;
            }
            idList = GetIDList(strID, iAutoRegisterNumber);
            nicknameList = GetNicknameList(strNickname, iAutoRegisterNumber);
        } else {
            iAutoRegisterNumber = 1;
            idList.push(strID);
            nicknameList.push(strNickname);
        }

        // 아이디, 비번 중복 체크
        let listID = await db.Users.findAll({
            where: {
                [Op.or]:{
                    strID: {
                        [Op.in]:idList
                    },
                    strNickname: {
                        [Op.in]:nicknameList
                    }
                }
            }
        });

        if (listID.length > 0) {
            res.send({result:'FAIL', string:`에이전트 생성을 실패했습니다.(중복된 아이디 또는 닉네임이 있습니다)`});
            return;
        }

        let iLoginMax = 1;
        let iClass = parseInt(req.body.iParentClass)+1;
        if (iClass == 2) {
            iLoginMax = 3;
        } else if (iClass == 3) {
            iLoginMax = 1;
        }

        let eState = 'BLOCK';
        // PC방 설정은 바로 승인처리
        let strOptionCode = req.body.strOptionCode ?? '';
        if (strOptionCode == "00100000") {
            eState = 'NORMAL';
        }

        let strMobileNo = req.body.strMobileNo ?? '';
        if (strMobileNo != '') {
            // strMobileNo = await IAgent.GetCipher(strMobileNo);
        }

        let strBankName = req.body.strBankName ?? '';
        if (strBankName != '') {
            // strBankName = await IAgent.GetCipher(strBankName);
        }

        let strAccountNumber = req.body.strAccountNumber ?? '';
        if (strAccountNumber != '') {
            // strAccountNumber = await IAgent.GetCipher(strAccountNumber);
        }

        let strAccountOwner = req.body.strAccountOwner ?? '';
        if (strAccountOwner != '') {
            // strAccountOwner = await IAgent.GetCipher(strAccountOwner);
        }

        let iSettleDays = null;
        let iSettleType = null;
        if (iClass <= 5) {
            iSettleDays = req.body.iSettleDays ?? 15;
            iSettleType = req.body.iSettleType ?? 0;
        }

        for (let i = 0; i < iAutoRegisterNumber; i++) {
            let newID = idList[i];
            let newNickname = nicknameList[i];

            let strGroupID = await CalculateGroupID(req.body.strParentGroupID, req.body.iParentClass);

            await db.Users.create({
                strID:newID,
                strNickname:newNickname,
                strPassword:req.body.strPassword,
                strMobile:strMobileNo,
                strBankname:strBankName,
                strBankAccount:strAccountNumber,
                strBankOwner:strAccountOwner,
                strBankPassword:'',
                strOutputPassowrd:'',
                iClass:iClass,
                strGroupID:strGroupID,
                iParentID:req.body.iParentID,
                iCash:0,
                iLoan:0,
                iRolling:0,
                iSettle:0,
                iSettleAcc:0,
                fBaccaratR:fBaccaratR,
                fSlotR:fSlotR,
                fUnderOverR:fUnderOverR,
                fSettleSlot:fSettleSlot,
                fSettleBaccarat:fSettleBaccarat,
                eState:eState,
                //strOptionCode:'00000000',
                strOptionCode:req.body.strOptionCode,
                strPBOptionCode:req.body.strPBOptionCode,
                strSettleMemo:'',
                iNumLoginFailed: 0,
                iPermission:0,
                iLoginMax:iLoginMax,
                iPassCheckNewUser:iPassCheckNewUser,
                iSettleDays:iSettleDays,
                iSettleType:iSettleType,
            });
        }

        res.send({result:'OK', string:'에이전트 생성을 완료 하였습니다.'});
    } catch (err) {
        res.send({result:'FAIL', string:`에이전트 생성을 실패했습니다.(${err})`});
    }
});

router.post('/request_agentlist', isLoggedIn, async (req, res) => {

    console.log(req.body);

    let sdate = req.body.dateStart ?? '';
    let edate = req.body.dateEnd ?? '';
    if (sdate == '' || edate == '') {
        sdate = moment().format('YYYY-MM-DD');
        edate = moment().format('YYYY-MM-DD');
    }

    const list = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iTargetClass), sdate, edate, req.body.strSearchNickname, true);

    res.send({list:list, iRootClass:req.user.iClass, iPermission: req.user.iPermission});
});

/**
 * 본인 베팅 레코드 조회(바카라)
 */
router.post('/request_bettinglist', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strID = req.body.strID ?? '';

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:strID,
            iGameCode: {
                [Op.notIn]:[200, 300]
            }
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strID:strID,
                iGameCode: {
                    [Op.notIn]:[200, 300]
                }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    for ( let i in list )
    {
        records.push({
            id: list[i].id,
            strID:list[i].strID,
            strNickname:list[i].strNickname,
            strGroupID:list[i].strGroupID,
            iClass:list[i].iClass,
            iBalance:list[i].iBalance,
            iGameCode:list[i].iGameCode,
            strVender:list[i].strVender,
            strGameID:list[i].strGameID,
            strTableID:list[i].strTableID,
            strRound:list[i].strRound,
            strUniqueID:list[i].strUniqueID,
            strDetail:list[i].strDetail,
            strResult:list[i].strResult,
            iBet:list[i].iBet,
            iWin: list[i].iWin,
            eState:list[i].eState,
            eType:list[i].eType,
            iTarget:list[i].iTarget,
            createdAt:list[i].createdAt,
            updatedAt:list[i].updatedAt
        });
    }
    console.log(records);

    res.send({result:'OK', list:records, totalCount: totalCount});
})

/**
 * 본인 베팅 레코드 조회(슬롯)
 */
router.post('/request_bettinglist_slot', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strID = req.body.strID ?? '';

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:strID,
            iGameCode: 200
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strID:strID,
                iGameCode: 200
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    for ( let i in list )
    {
        records.push({
            id: list[i].id,
            strID:list[i].strID,
            strNickname:list[i].strNickname,
            strGroupID:list[i].strGroupID,
            iClass:list[i].iClass,
            iBalance:list[i].iBalance,
            iGameCode:list[i].iGameCode,
            strVender:list[i].strVender,
            strGameID:list[i].strGameID,
            strTableID:list[i].strTableID,
            strRound:list[i].strRound,
            strUniqueID:list[i].strUniqueID,
            strDetail:list[i].strDetail,
            strResult:list[i].strResult,
            iBet:list[i].iBet,
            iWin: list[i].iWin,
            eState:list[i].eState,
            eType:list[i].eType,
            iTarget:list[i].iTarget,
            createdAt:list[i].createdAt,
            updatedAt:list[i].updatedAt
        });
    }
    console.log(records);

    res.send({result:'OK', list:records, totalCount: totalCount});
})

router.post('/request_bettinglist_page', isLoggedIn, async (req, res) => {
    console.log(req.body);

    const full = await db.RecordBets.findAll({where:{
        createdAt:{
            [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
        },
        strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        strNickname:req.body.strNickname
        }
    });

    const cOffset = parseInt(req.body.iPage) * 50;

    const result = await db.RecordBets.findAll({offset:cOffset, limit:50, where:{
        createdAt:{
            [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
        },
        strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        strNickname:req.body.strNickname, iHistory: 0
    },
    order:[['createdAt','DESC']],
    });

    const cNumPages = Math.floor(full.length/50) + 1;

    res.send({page:cNumPages, list:result});
});

router.post('/request_settingodds', isLoggedIn, async (req, res) => {

    if (req.user.iClass > 2 || req.user.iPermission == 100) {
        return;
    }

    console.log(`request_settingodds`);
    console.log(req.body);

    let fRollingBaccarat = parseFloat(req.body.fRollingBaccarat);
    fRollingBaccarat = Number.isNaN(fRollingBaccarat) ? 0 : fRollingBaccarat;

    let fRollingSlot = parseFloat(req.body.fRollingSlot);
    fRollingSlot = Number.isNaN(fRollingSlot) ? 0 : fRollingSlot;

    let fRollingUnderOver = parseFloat(req.body.fRollingUnderOver);
    fRollingUnderOver = Number.isNaN(fRollingUnderOver) ? 0 : fRollingUnderOver;

    let fSettleSlot = parseFloat(req.body.fSettleSlot);
    fSettleSlot = Number.isNaN(fSettleSlot) ? 0 : fSettleSlot;

    let fSettleBaccarat = parseFloat(req.body.fSettleBaccarat);
    fSettleBaccarat = Number.isNaN(fSettleBaccarat) ? 0 : fSettleBaccarat;

    let iClass = parseInt(req.body.iClass);
    // 본사 밑에 부본사 비율 확인
    let subUsers = await db.Users.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            iClass:{
                [Op.in]: [4,5]
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    let fail = false;
    for ( let i in subUsers )
    {
        let user = subUsers[i];
        if (user.fBaccaratR > fRollingBaccarat) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 바카라 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fUnderOverR > fRollingUnderOver) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 언더오버 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fSlotR > fRollingSlot) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 슬롯 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        }
        // else if (user.fSettleSlot > fSettleSlot) {
        //     res.send({result:'FAIL', message:`[${user.strNickname}] 슬롯 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
        //     fail = true;
        //     break;
        // } else if (user.fSettleBaccarat > fSettleBaccarat) {
        //     res.send({result:'FAIL', message:`[${user.strNickname}] 바카라 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
        //     fail = true;
        //     break;
        // }
    }

    if (fail)
        return;

    let users = await db.Users.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            iClass:{
                [Op.in]: [2,3]
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    for ( let i in users )
    {
        //await users[i].update({
        await db.Users.update({
            fBaccaratR:fRollingBaccarat,
            fSlotR:fRollingSlot,
            fUnderOverR:fRollingUnderOver,
            fSettleSlot:fSettleSlot,
            fSettleBaccarat:fSettleBaccarat,
        }, {where:{id:users[i].id}});
    }

    res.send({result:'OK'});
});
//require('moment')
router.post('/request_removedb', isLoggedIn, async (req, res) => {
    console.log('/request_removedb');
    console.log(req.body);
    try {
        const ids = req.body.ids ?? '';
        if (-1 !== ids.indexOf(`RecordBets`)) {
            await db.RecordBets.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`GTs`)) {
            await db.GTs.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`Inouts`)) {
            await db.Inouts.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`SettleRecords`)) {
            await db.SettleRecords.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`ChargeRequest`)) {
            await db.ChargeRequest.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`CreditRecords`)) {
            await db.CreditRecords.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`Letters`)) {
            await db.Letters.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`ContactLetter`)) {
            await db.ContactLetter.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        res.send({result:'OK'});
    } catch (err) {
        res.send({result:'FAIL', msg: err});
    }
});

//router.post('/initialization', isLoggedIn, async (req, res) => {
router.post('/request_initoutputpass', isLoggedIn, async (req, res) => {

    // let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    // await user.update({pw_auth:1});

    await db.Users.update({pw_auth:1}, {where:{strNickname:req.body.strNickname}});

    res.send({result:'OK'});
});

// 파트너정보 내 은행정보 보기 체크
router.post('/request_bank', isLoggedIn, async (req, res) => {
    let input = req.body.input ?? '';
    let result = await IAgentSec.AccessPartnerBankAndPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        return res.send(result);
    }

    let dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let bankname = dbuser.strBankname ?? '';
    let bankAccount = dbuser.strBankAccount ?? '';
    let bankOwner = dbuser.strBankOwner ?? '';
    let cell = dbuser.strMobile ?? '';
    let pass = dbuser.strPassword ?? '';
    let iInputGrade = 0;
    let gradelist = [];
    if (req.user.iClass <= 3 && req.user.iPermission == 0) {
        if (req.user.iClass == 2) {
            iInputGrade = IAgent.GetGradeFromStrOptionCode(dbuser.strOptionCode);
            gradelist = IAgent.GetGradeList();
        }
        let iSettleDays = 15;
        let iSettleType = 0;
        // 대본사의 죽장옵션값으로
        if (dbuser.iClass == 4) {
            iSettleDays = dbuser.iSettleDays ?? 15;
            iSettleType = dbuser.iSettleType ?? 0;
        }
        // 본인 옵션
        let iSettleCommission = dbuser.iSettleCommission ?? 0;
        res.send({result:'OK', msg:'정상 조회', bankname:bankname, bankAccount:bankAccount, bankOwner:bankOwner, cell:cell, pass:pass, grade:iInputGrade, gradelist:gradelist, iSettleType:iSettleType, iSettleDays:iSettleDays, iSettleCommission:iSettleCommission});
        return ;
    }
    res.send({result:'OK', msg:'정상 조회', bankname:bankname, bankAccount:bankAccount, bankOwner:bankOwner, cell:cell, pass:pass, grade:0, gradelist: [], iSettleType:-1, iSettleDays:-1});
});

//에이전트 정보 수정
router.post('/request_agentinfo_modify', isLoggedIn,async (req, res) => {

    console.log(`/request_agentinfo_modify`);
    console.log(req.body);

    try {
        let user = await db.Users.findOne({where:{strNickname:req.body.strOriginNickname}});
        if (req.user.iClass != 1 && user.iClass == 1) {
            res.send({result:'ERROR', code:'ERRORMSG', msg: '접근권한 없음'});
            return;
        }

        if (req.user.iClass > 1) {
            // 수정이 하위임
            if (req.user.iClass >= user.iClass) {
                res.send({result:'ERROR', code:'ERRORMSG', msg: '접근권한 없음'});
                return;
            }

            // 소속 그룹 아님
            if (user.strGroupID.indexOf(req.user.strGroupID) != 0) {
                res.send({result:'ERROR', code:'ERRORMSG', msg: '접근권한 없음'});
                return;
            }
        }

        let strPassword = req.body.strPassword ?? '';
        let strPasswordConfirm = req.body.strPasswordConfirm ?? '';
        if (strPassword != strPasswordConfirm) {
            res.send({result:'ERROR', code:'ERRORMSG', msg: '입력 비밀번호가 다릅니다'});
            return;
        }

        if (strPassword != '' && strPassword != user.strPassword) {
            if ((req.user.iClass > 3 && req.user.iClass != 7) || req.user.iPermission == 100) {
                res.send({result:'ERROR', code:'ERRORMSG', msg: '비밀번호 변경은 고객센터로 문의주세요'});
                return;
            }
        }

        let strErrorCode = '';

        let fSettleBaccarat = parseFloat(req.body.fSettleBaccarat ?? 0);
        fSettleBaccarat = Number.isNaN(fSettleBaccarat) ? 0 : fSettleBaccarat;

        let fSettleSlot = parseFloat(req.body.fSettleSlot ?? 0);
        fSettleSlot = Number.isNaN(fSettleSlot) ? 0 : fSettleSlot;

        let fSlotR = parseFloat(req.body.fSlotR ?? 0);
        fSlotR = Number.isNaN(fSlotR) ? 0 : fSlotR;

        let fBaccaratR = parseFloat(req.body.fBaccaratR ?? 0);
        fBaccaratR = Number.isNaN(fBaccaratR) ? 0 : fBaccaratR;

        let fUnderOverR = parseFloat(req.body.fUnderOverR ?? 0);
        fUnderOverR = Number.isNaN(fUnderOverR) ? 0 : fUnderOverR;

        let iPassCheckNewUser = parseInt(req.body.iPassCheckNewUser ?? 1);
        iPassCheckNewUser = Number.isNaN(iPassCheckNewUser) ? 1 : iPassCheckNewUser;

        if (fSlotR < 0 || fBaccaratR < 0 || fUnderOverR < 0) {
            strErrorCode = 'ERRORMSG';
            res.send({result:'ERROR', code:strErrorCode, msg: '롤링 설정값을 확인해주세요'});
            return;
        }

        if ( null != user )
        {
            let bUpdate = true;

            let historyInfo = {};
            if ( user.strNickname != req.body.strNickname || user.strID != req.body.strID ) {
                historyInfo = await GetHistoryInfo(user.strNickname, user.strID);
                if (historyInfo.result != 'OK') {
                    res.send(historyInfo);
                    return;
                }
            }

            // 대본사 죽장옵션
            let padminSettleType = 0;
            if ( user.iParentID != null )
            {
                let parent = await db.Users.findOne({where:{id:user.iParentID}});
                if ( null != parent && parent.iClass > 1 )
                {
                    console.log(`####################################################### ${parent.strID}, ${parent.iPBLimit}, ${req.body.iPBLimit}`);
                    if (
                        parent.fSlotR < fSlotR ||
                        parent.fBaccaratR < fBaccaratR ||
                        parent.fUnderOverR < fUnderOverR
                    )
                    {
                        console.log(`########## ModifyAgentInfo : Error Parent`);
                        bUpdate = false;
                        res.send({result:'ERRORMSG', code:'ERRORMSG', msg: `롤링값은 ${parent.strNickname}의 롤링보다 커서 변경 할 수 없습니다.`});
                        return;
                    }

                    // 죽장은 본사 ~ 대본만 체크
                    let padmin = await IAgent.GetPAdminInfo(parent);
                    if (padmin != null && padmin.iSettleType != 1) { // 리셋은 죽장을 자유롭게 설정 가능
                        padminSettleType = padmin.iSettleType;

                        if (parent.iClass == 4 || parent.iClass == 5) {
                            if (
                                parent.fSettleBaccarat < fSettleBaccarat ||
                                parent.fSettleSlot < fSettleSlot
                            )
                            {
                                console.log(`########## ModifyAgentInfo : Error Parent`);
                                bUpdate = false;
                                res.send({result:'ERROR', code:'ERRORMSG', msg: `죽장값은 ${parent.strNickname}의 죽장보다 커서 변경 할 수 없습니다.`});
                                return;
                            }
                        }
                    }
                }
            }

            //  children
            if ( user.iClass < 7)
            {
                let children = await db.Users.findAll({
                    where: {
                        iParentID:user.id,
                        iPermission: {
                            [Op.notIn]: [100]
                        },
                    }
                });

                for ( let i in children )
                {
                    let child = children[i];
                    if (
                        child.fSlotR > fSlotR ||
                        child.fBaccaratR > fBaccaratR ||
                        child.fUnderOverR > fUnderOverR
                    )
                    {
                        console.log(`########## ModifyAgentInfo : Error Children`);
                        bUpdate = false;
                        res.send({result:'ERROR', code:'ERRORMSG', msg: `${child.strNickname}의 롤링보다 작아서 변경 할 수 없습니다.`});
                        return;
                    }

                    // 죽장은 대본사 ~ 대본만 체크
                    // 대본사가 누적이면 하위는 모두 누적이어야 함, 하위 죽장률 체크 필요
                    // 대본사가 리셋이면 하위는 모두 리셋이어야 함, 하위 죽장률 체크 불필요
                    if (padminSettleType != 1) {
                        if (child.iClass == 4 || child.iClass == 5 || child.iClass == 6) {
                            if (
                                child.fSettleBaccarat > fSettleBaccarat
                            )
                            {
                                console.log(`########## ModifyAgentInfo : Error Children`);
                                bUpdate = false;
                                strErrorCode = 'LessThanChild';
                                res.send({result:'ERROR', code:'ERRORMSG', msg: `${child.strNickname}의 죽장이 작아서 변경 할 수 없습니다.`});
                                return;
                            }
                        }
                    }
                }
            }

            if ( bUpdate )
            {
                // 변경 로그 생성
                let data = {
                    strNickname:req.body.strNickname,
                    strID:req.body.strID,
                    strOptionCode:req.body.strOptionCode,
                    fSlotR:fSlotR,
                    fBaccaratR:fBaccaratR,
                    fUnderOverR:fUnderOverR,
                    fSettleBaccarat:fSettleBaccarat,
                    fSettleSlot:fSettleSlot,
                    iPermission:0,
                    iPassCheckNewUser:iPassCheckNewUser,
                };

                let strPassword = req.body.strPassword ?? '';
                if (strPassword != '') {
                    data['strPassword'] = strPassword;
                }

                let strPasswordConfirm = req.body.strPasswordConfirm ?? '';
                if (strPasswordConfirm != '') {
                    data['strPasswordConfirm'] = strPasswordConfirm;
                }

                let bUsingPc = false;
                try {
                    let strOptionCode = req.body.strOptionCode ?? '';
                    if (strOptionCode != undefined && strOptionCode.length > 0) {
                        let arr2 = strOptionCode.split('')[2];
                        if (parseInt(arr2) == 1) {
                            bUsingPc = true;
                        }
                    }
                } catch (err) {
                }

                // PC방 전용이 아닐 경우에만 은행정보를 수정
                if (bUsingPc == false) {
                    let strBankname = req.body.strBankname ?? '';
                    if (strBankname != '') {
                        // data['strBankname'] = await IAgent.GetCipher(strBankname);
                        data['strBankname'] = strBankname;
                    }

                    let strBankOwner = req.body.strBankOwner ?? '';
                    if (strBankOwner != '') {
                        // data['strBankOwner'] = await IAgent.GetCipher(strBankOwner);
                        data['strBankOwner'] = strBankOwner;
                    }

                    let strBankAccount = req.body.strBankAccount ?? '';
                    if (strBankAccount != '') {
                        // data['strBankAccount'] = await IAgent.GetCipher(strBankAccount);
                        data['strBankAccount'] = strBankAccount;
                    }

                    // 은행정보 수정 가능 권한 체크
                    if (data.hasOwnProperty('strBankname') || data.hasOwnProperty('strBankOwner') || data.hasOwnProperty('strBankAccount')) {
                        if (user.strBankname != data.strBankname || user.strBankAccount != data.strBankAccount || user.strBankOwner != data.strBankOwner) {
                            if (data.strBankname != '' || data.strBankAccount != '' || data.strBankOwner != '') {
                                if (req.user.iClass == 8 || req.user.iClass == 7) {
                                } else if (req.user.iClass > 3) {
                                    strErrorCode = 'ERRORMSG';
                                    res.send({result:'ERROR', code:strErrorCode, msg: '접근권한 없음'});
                                    return;
                                }
                            }
                        }
                    }
                }

                let strMobile = req.body.strMobile ?? '';
                if (strMobile != '') {
                    // data['strMobile'] = await IAgent.GetCipher(strMobile);
                    data['strMobile'] = strMobile;
                }

                // 대본사일 경우에만 죽장옵션 수정 가능
                if (req.user.iClass <= 3 && user.iClass == 4) {
                    let iSettleDays = parseInt(req.body.iSettleDays ?? -1);
                    if (iSettleDays != -1) {
                        data['iSettleDays'] = iSettleDays;
                    }
                    let iSettleType = parseInt(req.body.iSettleType ?? -1);
                    if (iSettleType != -1) {
                        data['iSettleType'] = iSettleType;
                    }
                    let iSettleCommission = parseInt(req.body.iSettleCommission ?? -1);
                    if (iSettleCommission != -1) {
                        data['iSettleCommission'] = iSettleCommission;
                    }
                }

                let logMsg = logMessage(user, data);
                let msg = logMsg.msg ?? '';
                let strMemo = logMsg.strMemo ?? '';
                if (msg != '' || strMemo != '') {
                    await db.DataLogs.create({
                        strNickname: req.body.strNickname,
                        strID: req.body.strID,
                        strGroupID: user.strGroupID,
                        strLogs: msg,
                        strMemo: strMemo,
                        strEditorNickname: req.user.strNickname
                    });
                }

                await db.Users.update(data, {where: {id:user.id}});

                //  현재 정책상 본사일 경우만 롤링을 수정할 수 있다. 아래의 코드는 하위 에이전트 전체를 같은 값으로 세팅 하는 것이다.
                if ( req.user.iClass == 3 && user.iClass != 8 )
                {
                    let children = await db.Users.findAll({
                        where:{
                            strGroupID:{
                                [Op.like]:user.strGroupID+'%'
                            },
                            iPermission: {
                                [Op.notIn]: [100]
                            },
                        }
                    });
                }

                if ( (req.body.strNickname != user.strNickname || req.body.strID != user.strID) && bUpdate == true )
                {
                    await UpdateHistoryInfo(historyInfo);
                }

                res.send({result:'OK'});
            }
            else
            {
                res.send({result:'ERROR', code:strErrorCode});
            }
        }
        else
        {
            res.send({result:'ERROR', code:strErrorCode});
        }
    } catch (err) {
        console.log(err.toString());
        res.send({result:'ERROR', code:'ERRORMSG', msg: '처리오류'});
    }
});

const GetHistoryInfo = async (strNickname, strID) => {
    let listShare = [];
    let listLog = [];
    let listContactTo = [];
    let listContactFrom = [];
    let listLetterTo = [];
    let listLetterFrom = [];
    let listInout = [];
    let listSettle = [];
    let listDaily = [];
    let listRecordBet = [];
    let listGtTo = [];
    let listGtFrom = [];
    let listHistory = [];

    const maxCount = 30;
    let count = 0;
    // 지분자 정보 확인
    listShare = await db.ShareUsers.findAll({where: {strID: strID}});
    count += listShare.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 로그
    listLog = await db.DataLogs.findAll({where: {strID: strID}});
    count += listLog.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 관리자 문의
    listContactTo = await db.ContactLetter.findAll({where: {strTo: strNickname}});
    count += listContactTo.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    listContactFrom = await db.ContactLetter.findAll({where: {strFrom: strNickname}});
    count += listContactFrom.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 쪽지
    listLetterTo = await db.Letters.findAll({where: {strTo: strNickname}});
    count += listLetterTo.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    listLetterFrom = await db.Letters.findAll({where: {strFrom: strNickname}});
    count += listLetterFrom.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 입출금
    listInout = await db.Inouts.findAll({where: {strID: strNickname}});
    count += listInout.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 죽장
    listSettle = await db.SettleRecords.findAll({where: {strNickname: strID}});
    count += listSettle.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 레코드 데일리
    listDaily = await db.RecordDailyOverviews.findAll({where: {strID: strID}});
    count += listDaily.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 배팅 레코드
    listRecordBet = await db.RecordBets.findAll({where: {strID: strID}});
    count += listRecordBet.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 전환
    listGtTo = await db.GTs.findAll({where: {strTo: strNickname}});
    count += listGtTo.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    listGtFrom = await db.GTs.findAll({where: {strFrom: strNickname}});
    count += listGtFrom.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }
    // 가불히스토리
    listHistory = await db.CreditRecords.findAll({where: {strID: strID}});
    count += listHistory.length;
    if (count > maxCount) {
        return {result: 'ERROR', code: 'Impossible'};
    }

    return {result: 'OK', code: '', listShare:listShare, listLog:listLog, listContactTo:listContactTo, listContactFrom:listContactFrom,
        listLetterTo:listLetterTo, listLetterFrom:listLetterFrom, listInout:listInout, listSettle:listSettle,
        listDaily:listDaily, listRecordBet:listRecordBet, listGtTo:listGtTo, listGtFrom:listGtFrom, listHistory:listHistory};
}

const UpdateHistoryInfo = async (info) => {
    if (info.listShare.length > 0) {
        await db.ShareUsers.update({strID: req.body.strID}, {where: {strID: user.strID}});
    }
    if (info.listLog.length > 0) {
        await db.DataLogs.update({strNickname:req.body.strNickname, strID:req.body.strID}, {where: {strID: user.strID}});
    }
    if (info.listContactTo.length > 0) {
        await db.ContactLetter.update({strTo:req.body.strNickname}, {where: {strTo: user.strNickname}});
    }
    if (info.listContactFrom.length > 0) {
        await db.ContactLetter.update({strFrom:req.body.strNickname}, {where: {strFrom: user.strNickname}});
    }
    if (info.listLetterTo.length > 0) {
        await db.Letters.update({strTo:req.body.strNickname, strToID: req.body.strID}, {where: {strTo: user.strNickname}});
    }
    if (info.listLetterFrom.length > 0) {
        await db.Letters.update({strFrom:req.body.strNickname, strFromID: req.body.strID}, {where: {strFrom: user.strNickname}});
    }
    if (info.listInout.length > 0) {
        await db.Inouts.update({strID: req.body.strNickname, strName: req.body.strNickname}, {where: {strID: user.strNickname}});
    }
    if (info.listSettle.length > 0) {
        await db.SettleRecords.update({strNickname: req.body.strNickname, strID:req.body.strID}, {where: {strID: user.strID}});
    }
    if (info.listDaily.length > 0) {
        await db.RecordDailyOverviews.update({strID: req.body.strID}, {where: {strID: user.strID}});
    }
    if (info.listRecordBet.length > 0) {
        await db.RecordBets.update({strID: req.body.strID, strNickname: req.body.strNickname}, {where: {strID: user.strID}});
    }
    if (info.listGtTo.length > 0) {
        await db.GTs.update({strTo:req.body.strNickname}, {where: {strTo: user.strNickname}});
    }
    if (info.listGtFrom.length > 0) {
        await db.GTs.update({strFrom:req.body.strNickname}, {where: {strFrom: user.strNickname}});
    }
    if (info.listHistory.length > 0) {
        await db.CreditRecords.update({strID: req.body.strID, strNickname:req.body.strNickname}, {where: {strID: user.strID}});
    }
}

const logMessage = (source, data) => {
    let msg = '';
    let strMemo = '';

    if (source.strNickname != data.strNickname && data.strNickname != undefined) {
        msg = `닉네임 변경(${source.strNickname}=>${data.strNickname})`;
    }
    if (source.strID != data.strID && data.strID != undefined) {
        if (msg == '')
            msg = `아이디 변경(${source.strID}=>${data.strID})`;
        else
            msg = `${msg} | 아이디 변경(${source.strMobile}=>${data.strMobile})`;
    }
    if (source.strPassword != data.strPassword && data.strPassword != undefined) {
        strMemo = `비번 변경(${source.strPassword}=>${data.strPassword})`;
        if (msg == '')
            msg = `비밀번호 변경`;
        else
            msg = `${msg} | 비밀번호 변경`;
    }

    let isPc = false;
    let arr = source.strOptionCode.split('');
    if (arr[2] == 1) {
        isPc = true;
    }

    if (source.strOptionCode != data.strOptionCode && data.strOptionCode != undefined) {
        let arr2 = data.strOptionCode.split('');
        if (arr[2] != arr2[2]) {
            if (arr2[2] == 1) {
                isPc = true;
            }
            const m = `PC방사용 변경(${arr[2] == 0 ? '사용안함' : '사용'} => ${arr2[2] == 0 ? '사용안함' : '사용'})`;
            if (msg == '')
                msg = m;
            else
                msg = `${msg} | ${m}`;
        }

        if (isPc == false && source.iClass < 8) {
            if (arr[0] != arr2[0]) {
                const m = `입금상태 변경(${arr[0] == 0 ? '사용안함' : '사용'} => ${arr2[0] == 0 ? '사용안함' : '사용'})`;
                if (msg == '')
                    msg = m;
                else
                    msg = `${msg} | ${m}`;
            }
            if (arr[1] != arr2[1]) {
                const m = `출금상태 변경(${arr[1] == 0 ? '사용안함' : '사용'} => ${arr2[1] == 0 ? '사용안함' : '사용'})`;
                if (msg == '')
                    msg = m;
                else
                    msg = `${msg} | ${m}`;
            }
        }
    }

    if (data.hasOwnProperty('strBankname') || data.hasOwnProperty('strBankOwner') || data.hasOwnProperty('strBankAccount')) {
        if (isPc == false) {
            let bankMsg = '';
            let strMemo2 = '';
            if (source.strBankname != data.strBankname && data.strBankname != undefined) {
                bankMsg = `계좌정보 변경`;
                strMemo2 = `은행명 변경(${source.strBankname}=>${data.strBankname})`;
            }
            if (source.strBankAccount != data.strBankAccount && data.strBankAccount != undefined) {
                bankMsg = `계좌정보 변경`;
                strMemo2 = strMemo2 == '' ? `계좌번호 변경(${source.strBankAccount}=>${data.strBankAccount})` : `${strMemo2} | 계좌번호 변경(${source.strBankAccount}=>${data.strBankAccount})`;
            }
            if (source.strBankOwner != data.strBankOwner && data.strBankOwner != undefined) {
                bankMsg = `계좌정보 변경`;
                strMemo2 = strMemo2 == '' ? `예금주 변경(${source.strBankOwner}=>${data.strBankOwner})` : `${strMemo2} | 예금주 변경(${source.strBankOwner}=>${data.strBankOwner})`;
            }
            if (bankMsg != '') {
                if (msg == '') {
                    msg = bankMsg;
                } else {
                    msg = `${msg} | ${bankMsg}`;
                }
                strMemo = strMemo == '' ? strMemo2 : `${strMemo} | ${strMemo2}`;
            }
        }
    }

    if (data.hasOwnProperty('strMobile')) {
        if (source.strMobile != data.strMobile && data.strMobile != undefined) {
            if (msg == '')
                msg = `연락처 변경(${source.strMobile}=>${data.strMobile})`;
            else
                msg = `${msg} | 연락처 변경(${source.strMobile}=>${data.strMobile})`;
        }
    }

    if (source.fBaccaratR != data.fBaccaratR && data.fBaccaratR != undefined) {
        if (msg == '')
            msg = `바카라롤링 변경(${source.fBaccaratR}=>${data.fBaccaratR})`;
        else
            msg = `${msg} | 바카라롤링 변경(${source.fBaccaratR}=>${data.fBaccaratR})`;
    }
    if (source.fUnderOverR != data.fUnderOverR && data.fUnderOverR != undefined) {
        if (msg == '')
            msg = `언오버롤링 변경(${source.fUnderOverR}=>${data.fUnderOverR})`;
        else
            msg = `${msg} | 언오버롤링 변경(${source.fUnderOverR}=>${data.fUnderOverR})`;
    }
    if (source.fSlotR != data.fSlotR && data.fSlotR != undefined) {
        if (msg == '')
            msg = `슬롯롤링 변경(${source.fSlotR}=>${data.fSlotR})`;
        else
            msg = `${msg} | 슬롯롤링 변경(${source.fSlotR}=>${data.fSlotR})`;
    }
    if (source.fSettleBaccarat != data.fSettleBaccarat && data.fSettleBaccarat != undefined) {
        if (msg == '')
            msg = `바카라 죽장 변경(${source.fSettleBaccarat}=>${data.fSettleBaccarat})`;
        else
            msg = `${msg} | 바카라 죽장 변경(${source.fSettleBaccarat}=>${data.fSettleBaccarat})`;
    }
    if (source.fSettleSlot != data.fSettleSlot && data.fSettleSlot != undefined) {
        if (msg == '')
            msg = `슬롯 죽장 변경(${source.fSettleSlot}=>${data.fSettleSlot})`;
        else
            msg = `${msg} | 슬롯 죽장 변경(${source.fSettleSlot}=>${data.fSettleSlot})`;
    }

    if (data.hasOwnProperty('iSettleDays')) {
        if (source.iSettleDays != data.iSettleDays) {
            if (msg == '')
                msg = `죽장일자 변경(${source.iSettleDays}=>${data.iSettleDays})`;
            else
                msg = `${msg} | 죽장일자 변경(${source.iSettleDays}=>${data.iSettleDays})`;
        }
    }

    if (data.hasOwnProperty('iSettleType')) {
        if (source.iSettleType != data.iSettleType) {
            let sType = null;
            let dType = null;
            if (source.iSettleType == 1) {
                sType = '리셋';
            } else if (source.iSettleType == 0) {
                sType = '누적';
            }
            if (data.iSettleType == 1) {
                dType = '리셋';
            } else if (data.iSettleType == 0) {
                dType = '누적';
            }
            if (msg == '')
                msg = `죽장타입 변경(${sType}=>${dType})`;
            else
                msg = `${msg} | 죽장타입 변경(${sType}=>${dType})`;
        }
    }

    return {msg: msg, strMemo:strMemo};
}


/**
 * 가불 현황 목록
 */
// 파트너팝업 > 가불탭
router.post('/credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        strID:dbuser.strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    let list = await db.CreditRecords.findAll({
        where:{
            strID: dbuser.strID,
        },
        order:[['createdAt','DESC']]
    });
    res.render('manage_partner/popup_credits', {iLayout:2, iHeaderFocus:11, user:user, agent:agent, list:list, strParent:parents.strParents, isEdit:true});
});

router.post('/popup_credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let list = await db.CreditRecords.findAll({
        where:{
            strID: req.body.strID,
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
        },
        order:[['createdAt','DESC']]
    });
    res.send(list);
});

// 가불내역 > 조회하기
router.post('/popup_credits_history', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        strID:dbuser.strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let list = await db.CreditRecords.findAll({
        where:{
            strID: req.body.strID,
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
        },
        order:[['createdAt','DESC']]
    });

    res.render('manage_partner_popup/popup_credits_history', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, creadits:list});
});

// 가불 내역
router.post('/popup_credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let parent = await IAgent.GetParentNickname();
    let strParentGroupID = await IAgent.GetParentGroupID(req.body.strNickname);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        strID:dbuser.strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let list    = null;

    if ( req.body.iClass == 1 )
        list = await GetViceHQs(req.body.strGroupID);
    else if ( req.body.iClass == 2 )
        list = await GetAdmins(req.body.strGroupID);
    else if ( req.body.iClass == 3 )
        list = await GetProAdmins(req.body.strGroupID);
    else if ( req.body.iClass == 4 )
        list = await GetAgent(req.body.strNickname, 4);

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);

    res.render('manage_partner/popup_credits_history', {iLayout:5, iHeaderFocus:1, user:user, agent:agent, iocount:iocount, list:list, strParent:parents.strParents});
});

let GetViceHQs = async (strGroupID) => {
    let list = await db.sequelize.query(`
        SELECT              
            id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
            iCash, iRolling, iSettle, iSettleAcc, iSettleAccBefore, 
            fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
            fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, createdAt, updatedAt,
            eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
        FROM Users
        WHERE iClass = 2 
            AND strGroupID LIKE '${strGroupID}%'
            AND iPermission != 100
    `);
    return list[0];
};

let GetAdmins = async (strGroupID, strQuater) => {
    if (strQuater != null && strQuater.length > 0) {
        let list = await IAgentSettle.GetAdminForSettle(strGroupID, strQuater, 3);
        return list;
    }

    let list = await db.sequelize.query(`
        SELECT              
            id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
            iCash, iRolling, iSettle, iSettleAcc, iSettleAccBefore, 
            fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
            fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, createdAt, updatedAt,
            eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
        FROM Users
        WHERE iClass = 3 
            AND strGroupID LIKE '${strGroupID}%'
            AND iPermission != 100
    `);
    return list[0];
};

let GetProAdmins = async (strGroupID, strQuater) => {

    if (strQuater != null && strQuater.length > 0) {
        let list = await IAgentSettle.GetAdminForSettle(strGroupID, strQuater, 4);
        return list;
    }

    let list = await db.sequelize.query(`
        SELECT              
            id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
            iCash, iRolling, iSettle, iSettleAcc, iSettleAccBefore, 
            fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
            fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, createdAt, updatedAt,
            eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
        FROM Users
        WHERE iClass = 4
            AND strGroupID LIKE '${strGroupID}%'
            AND iPermission != 100
    `);
    return list[0];
};

let GetAgent = async (strNickname, iClass) => {
    let list = await db.sequelize.query(`
        SELECT              
            id, strID, strNickname, iClass, iPermission, strGroupID, iParentID,
            iCash, iRolling, iSettle, iSettleAcc, iSettleAccBefore, 
            fBaccaratR, fSlotR, fUnderOverR, fPBR, fPBSingleR, fPBDoubleR, fPBTripleR,
            fSettleBaccarat, fSettleSlot, fSettlePBA, fSettlePBB, createdAt, updatedAt,
            eState, strIP, strOptionCode, strSettleMemo, iRelUserID, fCommission, iPassCheckNewUser
        FROM Users
        WHERE iClass = ${iClass}
            AND strNickname = '${strNickname}'
            AND iPermission != 100
    `);
    return list[0];
};


module.exports = router;