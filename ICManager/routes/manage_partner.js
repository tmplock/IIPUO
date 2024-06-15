const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
//const db = require('../db');
const ITime = require('../utils/time');
const IInout = require('../implements/inout');
const {Op, where, QueryTypes}= require('sequelize');

//const IObject = require('../objects/betting');

const IAgent = require('../implements/agent3');
const IRolling = require('../implements/rolling');
const ISettle = require('../implements/settle');
const ISocket = require('../implements/socket');

//////////////////////////////////////////////////////////////////////////////
//const cGameRoomName = ["VB No.1", "VB No.2", "VB No.3"];
const cNumGameRooms = 3;


//var kRealtimeObject = new IObject.IRealtimeBetting();

const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const moment = require("moment");


router.get('/default', isLoggedIn, async(req, res) => {

    const dbuser = await IAgent.GetUserInfo(req.user.strNickname);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:dbuser.iCash, iRolling: dbuser.iRolling, iSettle: dbuser.iSettle,
        fBaccaratR: dbuser.fBaccaratR, fSlotR: dbuser.fSlotR, fUnderOverR: dbuser.fUnderOverR, fPBR: dbuser.fPBR, fPBSingleR: dbuser.fPBSingleR, fPBDoubleR: dbuser.fPBDoubleR, fPBTripleR: dbuser.fPBTripleR,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.user.strGroupID, parseInt(req.user.iClass), req.user.strNickname);

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var bobj = {overview:null, agents:null};

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    if ( req.user.iClass == 1 )
    {
        var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eViceHQ, dateStart, dateEnd);
        bobj.agents = agents;
        res.render('manage_partner/betting_listvicehq', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
    }
    else if ( req.user.iClass == 4 )
    {
        var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eViceAdmin, dateStart, dateEnd);
        bobj.agents = agents;
        res.render('manage_partner/betting_listviceadmin', {iLayout:0, iHeaderFocus:0, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
    }
    else if ( req.user.iClass == 5 )
    {
        var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eAgent, dateStart, dateEnd);
        bobj.agents = agents;
        res.render('manage_partner/betting_listagent', {iLayout:0, iHeaderFocus:0, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
    }
    else if ( req.user.iClass == 6 )
    {
        var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eShop, dateStart, dateEnd);
        bobj.agents = agents;
        res.render('manage_partner/betting_listshop', {iLayout:0, iHeaderFocus:0, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
    }
    else
    {
        res.render('manage_partner/listrealtimeuser', {iLayout:0, iHeaderFocus:0, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
    }

});


//
router.get('/betting_realtime', isLoggedIn, async(req, res) => {

    var overview = await IAgent.CalculateRealtimeBettingRecord(0, req.user.strGroupID, req.user.iClass);
    var realtime = await IAgent.CalculateRealtimeBettingRecord(0, req.user.strGroupID);
    //var m_object = await IAgent.CalculateMonthlyBettingRecord(0, req.user.strGroupID, req.user.iClass);

    var room_info = {};
    room_info.count = cNumGameRooms;

    //var bobj = {overview:overview, record_list:m_object, realtime:realtime};
    var bobj = {overview:overview, realtime:realtime};

    let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);

    res.render('manage_partner/betting_realtime', {iLayout:0, iHeaderFocus:0, room_info:room_info, data:bobj, user:req.user, iocount:iocount});

    global.io.emit("num_rooms", cNumGameRooms);

    console.log(`############################################################## /betting_realtime, ${req.user.strNickname}`);
});

router.post('/realtime', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, dbuser.strNickname, dbuser.strID);
    var realtime = await IAgent.CalculateRealtimeBettingRecord(0, user.strGroupID);

    var room_info = {};
    room_info.count = cNumGameRooms;
    var bobj = {overview:overview, realtime:realtime};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/betting_realtime', {iLayout:0, iHeaderFocus:0, room_info:room_info, data:bobj, user:user, iocount:iocount});

    global.io.emit("num_rooms", cNumGameRooms);
});


router.post('/announcement', isLoggedIn, async(req, res) => {

    const admin = req.user.strID;
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iRootClass: req.user.iClass, iPermission: req.user.iPermission};
    const list = await db.Announcements.findAll({
        order: [['id', 'DESC']],
        limit: 10,
    })

    res.render('manage_partner/announcement', {iLayout:0,iHeaderFocus:0,user:user,data:list});
});


/**
 * 본인 베팅 내역
 */
router.post('/record', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var overview = await IAgent.CalculateSelfBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', dbuser.strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_partner/betting_record', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, iocount:iocount});

});

router.post('/listvicehq', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eViceHQ, dateStart, dateEnd);
    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', dbuser.strID);
    var bobj = {overview:overview, agents:agents};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/betting_listvicehq', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/listadmin', isLoggedIn, async(req, res) => {

    console.log(req.body);
    if (req.user.iClass == 1) {
        res.send('조회 에러');
        return;
    }

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = dbuser.iPermission == 100 ? dbuser.strIDRel : dbuser.strID;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eAdmin, dateStart, dateEnd,  '', true);
    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', strID);
    var bobj = {overview:overview, agents:agents};
    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let list = await db.Users.findAll({where: {
            strGroupID: {
                [Op.like]: `${req.body.strGroupID}%`,
            },
            iClass: {
                [Op.gt]: 2
            },
            iPermission: {
                [Op.notIn]: [100]
            }
        }});

    let admin = 0;
    let proAdmin = 0;
    let viceAdmin = 0;
    let agent = 0;
    let shop = 0;
    let member = 0;

    for (let i in list) {
        if (list[i].iClass == 3) {
            admin += 1;
        } else if (list[i].iClass == 4) {
            proAdmin += 1;
        } else if (list[i].iClass == 5) {
            viceAdmin += 1;
        } else if (list[i].iClass == 6) {
            agent += 1;
        } else if (list[i].iClass == 7) {
            shop += 1;
        } else if (list[i].iClass == 8) {
            member += 1;
        }
    }

    let now = moment().format('YYYY-MM-DD');
    let dailys = await db.sequelize.query(`
        SELECT COUNT(id) AS total
        FROM RecordDailyOverviews 
        WHERE strDate = '${now}' 
          AND iClass > 5 AND strGroupID LIKE '${req.body.strGroupID}%' 
          AND (iBetB > 0 OR iBetUO > 0 OR iBetS > 0)
    `, {type: QueryTypes.SELECT});
    let userCount = 0;
    if (dailys.length > 0) {
        userCount = dailys[0].total;
    }

    let strPartnerInfo = `본사 : ${admin.toLocaleString()} / 대본사 : ${proAdmin.toLocaleString()} / 부본사 : ${viceAdmin.toLocaleString()} / 총판 : ${agent.toLocaleString()} / 매장 : ${shop.toLocaleString()} / 회원 : ${member.toLocaleString()} / 당일게임인원 : ${userCount.toLocaleString()}`;
    user.strPartnerInfo = strPartnerInfo;

    res.render('manage_partner/betting_listadmin', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/listproadmin', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = dbuser.iPermission == 100 ? dbuser.strIDRel : dbuser.strID;
    if (dbuser.iClass < req.user.iRootClass) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        fBaccaratR: dbuser.fBaccaratR, fSlotR: dbuser.fSlotR, fUnderOverR: dbuser.fUnderOverR, fPBR: dbuser.fPBR, fPBSingleR: dbuser.fPBSingleR, fPBDoubleR: dbuser.fPBDoubleR, fPBTripleR: dbuser.fPBTripleR,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID:dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eProAdmin, dateStart, dateEnd);
    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', strID);
    var bobj = {overview:overview, agents:agents};
    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/betting_listproadmin', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/listviceadmin', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = dbuser.iPermission == 100 ? dbuser.strIDRel : dbuser.strID;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', strID);
    var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eViceAdmin, dateStart, dateEnd);
    var bobj = {overview:overview, agents:agents};
    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/betting_listviceadmin', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/listagent', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = dbuser.iPermission == 100 ? dbuser.strIDRel : dbuser.strID;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        fBaccaratR: dbuser.fBaccaratR, fSlotR: dbuser.fSlotR, fUnderOverR: dbuser.fUnderOverR, fPBR: dbuser.fPBR, fPBSingleR: dbuser.fPBSingleR, fPBDoubleR: dbuser.fPBDoubleR, fPBTripleR: dbuser.fPBTripleR,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eAgent, dateStart, dateEnd);
    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', strID);
    var bobj = {overview:overview, agents:agents};
    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/betting_listagent', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/listshop', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = dbuser.iPermission == 100 ? dbuser.strIDRel : dbuser.strID;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    var agents = await IAgent.GetComputedAgentList(user.strGroupID, IAgent.EAgent.eShop, dateStart, dateEnd);
    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', strID);
    var bobj = {overview:overview, agents:agents};
    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/betting_listshop', {iLayout:0, iHeaderFocus:0, data:bobj, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/settingodds', isLoggedIn, async(req, res) => {
    console.log(req.body);

    const input = req.body.pass ?? '';

    let result = await IAgentSec.AccessOddPassword(req.user.strNickname, input);
    if (result.result != 'OK') {
        res.send(result);
        return;
    }

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission,
        fSlotR: dbuser.fSlotR, fBaccaratR: dbuser.fBaccaratR, fUnderOverR: dbuser.fUnderOverR,
        fPBR:dbuser.fPBR, fPBSingleR:dbuser.fPBSingleR, fPBDoubleR:dbuser.fPBDoubleR, fPBTripleR:dbuser.fPBTripleR};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/settingodds', {iLayout:0, iHeaderFocus:0, user:user, iocount:iocount});
});

router.post('/listrealtimeuser', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = dbuser.iPermission == 100 ? dbuser.strIDRel : dbuser.strID;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, dateStart, dateEnd, '', strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_partner/listrealtimeuser', {iLayout:0, iHeaderFocus:0, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

/**
 * 파트너 관리 > 파트너 목록 클릭시
 */
router.post('/request_agents', isLoggedIn, async(req, res) => {

    console.log(`/request_agents : `);
    console.log(req.body);
    let list = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, req.body.dateStart, req.body.dateEnd, '', true);

    console.log(list);

    res.send({list: list, iRootClass: req.user.iClass});

});

router.post('/request_agentstate', isLoggedIn, async(req, res) => {

    console.log(`/request_agentstate : `);
    console.log(req.body);

    let agent = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( agent != null )
    {
        if (req.user.iPermission == 100) {
            res.send('FAIL');
            return;
        }
        if (req.body.eState == 'NORMAL') {

            await db.Users.update({eState:req.body.eState, iNumLoginFailed: 0}, {where:{strNickname:req.body.strNickname}});
            //await agent.update({eState:req.body.eState, iNumLoginFailed: 0});
        } else {

            await db.Users.update({eState:req.body.eState}, {where:{strNickname:req.body.strNickname}});
            //await agent.update({eState:req.body.eState});
        }
        res.send('OK');
    }
    else
        res.send('FAIL');
});

router.post('/request_modifyrollingodds', isLoggedIn, async(req, res) => {

    console.log(`/request_modifyrollingodds : `);
    console.log(req.body);


    // var va_list = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1);

    // res.send(va_list);

    var user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user == null )
        res.send('not exist user');
    else
    {
        //await user.update({fSlotTR:req.body.fSlot, fBaccaratTR:req.body.fBaccarat, fUnderOverTR:req.body.fUnderOver, fBlackjackTR:req.body.fBlackjack});
        await db.Users.update({fSlotR:req.body.fSlot, fBaccaratR:req.body.fBaccarat, fUnderOverR:req.body.fUnderOver}, {where: {strNickname:req.body.strNickname}});

        res.send('ok');
    }
});

router.post('/request_agentlist', isLoggedIn, async(req, res) => {

    console.log(`/request_agentlist : `);
    console.log(req.body);

    let sdate = req.body.dateStart ?? '';
    let edate = req.body.dateEnd ?? '';
    if (sdate == '' || edate == '') {
        sdate = moment().format('YYYY-MM-DD');
        edate = moment().format('YYYY-MM-DD');
    }

    const overview = await IAgent.GetComputedAgentTotal(req.body.strGroupID, parseInt(req.body.iTargetClass), sdate, edate, req.body.strSearchNickname);
    const list = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iTargetClass), sdate, edate, req.body.strSearchNickname, true);

    res.send({list:list, overview:overview, iRootClass: req.user.iClass, iPermission: req.user.iPermission});
});

router.post('/request_bettingrecord', isLoggedIn, async(req, res) => {

    console.log(`/request_agentbettingrecord : `);
    console.log(req.body);

    const record = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, req.body.strNickname, req.body.strID);

    let data = {record:record, iRootClass: req.user.iClass, iPermission: req.user.iPermission}

    res.send(data);
});

router.post('/request_bettingrecord_me', isLoggedIn, async(req, res) => {

    console.log(`/request_bettingrecord_me : `);
    console.log(req.body);

    const record = await IAgent.CalculateTermSelfBettingRecord(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, req.body.strNickname, req.body.strID);

    let data = {record:record, iRootClass: req.user.iClass, iPermission: req.user.iPermission}

    res.send(data);
});

router.post('/request_bettingrecord_user', isLoggedIn, async(req, res) => {

    console.log(`/request_bettingrecord_user : `);
    console.log(req.body);

    const dateEnd = ITime.getDateEnd(req.body.dateEnd);
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, req.body.iClass, req.body.strNickname);
    const record = await IAgent.CalculateTermSelfBettingRecord(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, dateEnd, req.body.strNickname, agent.strID);

    let data = {record:record, iRootClass:req.user.iClass, iPermission:req.user.iPermission}

    res.send(data);
});


router.post('/request_overview', isLoggedIn, async(req, res) => {

    console.log('request_overview : ');
    console.log(req.body);
    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = user.iPermission == 100 ? user.strIDRel : user.strID;
    const overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, '', strID);

    let data = {overview:overview, iRootClass:req.user.iClass}

    res.send(data);
});

/**
 * 팝업 > 본인 베팅 내역
 */
router.post('/request_overview_self', isLoggedIn, async(req, res) => {

    console.log('request_overview : ');
    console.log(req.body);
    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strID = user.iPermission == 100 ? user.strIDRel : user.strID;
    const overview = await IAgent.CalculateSelfBettingRecord(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, '', strID);

    let data = {overview:overview, iRootClass:req.user.iClass}

    res.send(data);
});

router.post('/request_overview_user', isLoggedIn, async(req, res) => {

    console.log('request_overview_user : ');
    console.log(req.body);
    const agent = await IAgent.GetPopupAgentInfo(req.body.strNickname, req.body.iTargetClass, req.body.strNickname);

    const overview = await IAgent.CalculateSelfBettingRecord(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, req.body.strNickname, agent.strID);

    let data = {overview:overview, iRootClass:req.user.iClass}

    res.send(data);
});



router.post('/request_modify_rollingodds_group', isLoggedIn, async(req, res) => {

    if (req.user.iPermission == 100) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }

    var json = JSON.parse(req.body.data);
    //FIXME: 죽장도 포함
    var ret = await IRolling.ModifyRollingGroup(json);
    console.log(ret);
    if ( ret.result == "OK" )
    {
        for ( let i in ret.data )
        {
            let user = await db.Users.findOne({where:{strNickname:ret.data[i].strNickname}});
            if ( user != null )
            {

                let fSettleBaccarat = ret.data[i].fSettleBaccarat ?? 0;
                let fSettleResetBaccarat = ret.data[i].fSettleResetBaccarat ?? 0;
                let fSettlePBA = ret.data[i].fSettlePBA ?? 0;
                let fSettlePBB = ret.data[i].fSettlePBB ?? 0;


                // 값이 다르면 정보로그 남기기
                let logMsg = logRollingMessage(user, ret.data[i]);
                if (logMsg != '') {
                    await db.DataLogs.create({
                        strNickname: user.strNickname,
                        strID: user.strID,
                        strGroupID: user.strGroupID,
                        strLogs: logMsg,
                        strEditorNickname: req.user.strNickname,
                    });
                }

                await db.Users.update(
                    {
                        fBaccaratR:ret.data[i].fBaccarat,
                        fSlotR:ret.data[i].fSlot,
                        fUnderOverR:ret.data[i].fUnderOver,
                        fPBR:ret.data[i].fPB,
                        fPBSingleR:ret.data[i].fPBSingle,
                        fPBDoubleR:ret.data[i].fPBDouble,
                        fPBTripleR:ret.data[i].fPBTriple,
                        fSettleBaccarat:ret.data[i].fSettleBaccarat,
                        fSettleResetBaccarat:ret.data[i].fSettleResetBaccarat,
                    }, {where:{strNickname:ret.data[i].strNickname}});
            }
        }
        res.send({result:'OK'});
    }
    else
    {
        res.send({result:'Error', data:ret.name})
    }
});

const logRollingMessage = (source, data) => {
    let msg = '';

    if (source.fBaccaratR != data.fBaccarat) {
        if (msg == '')
            msg = `바카라롤링 변경(${source.fBaccaratR}=>${data.fBaccarat})`;
        else
            msg = `${msg} | 바카라롤링 변경(${source.fBaccaratR}=>${data.fBaccarat})`;
    }
    if (source.fUnderOverR != data.fUnderOver) {
        if (msg == '')
            msg = `언오버롤링 변경(${source.fUnderOverR}=>${data.fUnderOver})`;
        else
            msg = `${msg} | 언오버롤링 변경(${source.fUnderOverR}=>${data.fUnderOver})`;
    }
    if (source.fSlotR != data.fSlot) {
        if (msg == '')
            msg = `슬롯롤링 변경(${source.fSlotR}=>${data.fSlot})`;
        else
            msg = `${msg} | 슬롯롤링 변경(${source.fSlotR}=>${data.fSlot})`;
    }
    if (source.fSettleBaccarat != data.fSettleBaccarat) {
        if (msg == '')
            msg = `누적 죽장 변경(${source.fSettleBaccarat}=>${data.fSettleBaccarat})`;
        else
            msg = `${msg} | 누적 죽장 변경(${source.fSettleBaccarat}=>${data.fSettleBaccarat})`;
    }
    if (source.fSettleResetBaccarat != data.fSettleResetBaccarat) {
        if (msg == '')
            msg = `리셋 죽장 변경(${source.fSettleResetBaccarat}=>${data.fSettleResetBaccarat})`;
        else
            msg = `${msg} | 리셋 죽장 변경(${source.fSettleResetBaccarat}=>${data.fSettleResetBaccarat})`;
    }

    return msg;
}

router.post('/request_modify_settle_group', isLoggedIn, async(req, res) => {

    if (req.user.iPermission == 100) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }

    var json = JSON.parse(req.body.data);

    var ret = await ISettle.ModifySettleForce(json);
    console.log(ret);
    if ( ret.result == "OK" )
    {
        for ( let i in ret.data )
        {
            let fSettleBaccarat = ret.data[i].fSettleBaccarat ?? 0;
            let fSettleResetBaccarat = ret.data[i].fSettleResetBaccarat ?? 0;
            let fSettlePBA = ret.data[i].fSettlePBA ?? 0;
            let fSettlePBB = ret.data[i].fSettlePBB ?? 0;

            let user = await db.Users.findOne({where:{strNickname:ret.data[i].strNickname}});
            if ( user != null )
            {
                // 죽장은 상부를 넘을 수 없음
                let parent = await db.Users.findOne({where:{id:user.iParentID}});

                if ( null != parent && parent.iClass == 3 || parent.iClass == 4 )
                {
                    if (
                        parent.fSettleBaccarat < fSettleBaccarat
                    )
                    {
                        console.log(`########## ModifyAgentInfo : Error Parent`);
                        res.send({result:'ERROR', msg:'상위 보다 값이 커서 변경 할 수 없습니다.'});
                        return;
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

                        if (child.iClass == 3 || child.iClass == 4 || child.iClass == 5) {
                            if (
                                child.fSettleBaccarat > fSettleBaccarat
                            )
                            {
                                console.log(`########## ModifyAgentInfo : Error Children`);
                                res.send({result:'ERROR', msg:'하위보다 값이 작아 변경 할 수 없습니다.'});
                                return;
                            }
                        }
                    }
                }

                // 값이 다르면 정보로그 남기기
                let logMsg = logSettleMessage(user, ret.data[i]);
                if (logMsg != '') {
                    await db.DataLogs.create({
                        strNickname: user.strNickname,
                        strID: user.strID,
                        strGroupID: user.strGroupID,
                        strLogs: logMsg,
                        strEditorNickname: req.user.strNickname,
                    });
                }

                await db.Users.update(
                    {
                        fSettleBaccarat:fSettleBaccarat,
                        fSettleResetBaccarat:fSettleResetBaccarat,
                        fSettlePBA:fSettlePBA,
                        fSettlePBB:fSettlePBB
                    }, {where:{strNickname:ret.data[i].strNickname}});
            }
        }
        res.send({result:'OK'});
    }
    else
    {
        res.send({result:'Error', msg:ret.name})
    }
});


const logSettleMessage = (source, data) => {
    let msg = '';

    if (source.fSettleBaccarat != data.fSettleBaccarat) {
        if (msg == '')
            msg = `누적 죽장 변경(${source.fSettleBaccarat}=>${data.fSettleBaccarat})`;
        else
            msg = `${msg} | 누적 죽장 변경(${source.fSettleBaccarat}=>${data.fSettleBaccarat})`;
    }
    if (source.fSettleResetBaccarat != data.fSettleResetBaccarat) {
        if (msg == '')
            msg = `리셋 죽장 변경(${source.fSettleResetBaccarat}=>${data.fSettleResetBaccarat})`;
        else
            msg = `${msg} | 리셋 죽장 변경(${source.fSettleResetBaccarat}=>${data.fSettleResetBaccarat})`;
    }
    return msg;
}

router.post('/request_removeagent', isLoggedIn, async (req, res) => {

    console.log(`/request_removeagent`);
    console.log(req.body);

    if (req.user.iPermission == 100) {
        res.send({result: 'ERROR', msg:'권한이 없습니다'});
        return;
    }

    let strNickname = req.body.strNickname;
    let strGroupID = req.body.strGroupID;

    let dateStart = ITime.GetDay(ITime.getCurrentDate(), -45);
    let dateEnd = ITime.GetDay(ITime.getCurrentDate(), 0);

    console.log(`${req.body.strNickname}, ${dateStart}, ${dateEnd}`);

    let listBettings = await db.RecordBets.findAll({
        where: {
            createdAt:{
                [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
        },
        order:[['createdAt','DESC']]
    });
    console.log(listBettings.length);

    let target = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( target == null || (target != null && target.iCash > 0)) {
        res.send({result:'ERROR'});
        return;
    }

    if (req.user.iClass >= target.iClass) {
        res.send({result: 'ERROR', msg:'권한이 없습니다'});
        return;
    }

    let listChilds = await db.Users.findAll({
        where:{
            strGroupID: {
                [Op.like]: strGroupID+'%'
            },
            iClass: parseInt(target.iClass)+1,
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    if (listChilds.length > 0)
    {
        res.send({result:'ERROR'});
        return;
    }
    else
    {
        for (let i in listChilds)
        {
            if (listChilds[i].iCash > 0) {
                res.send({result:'ERROR'});
                return;
            }
        }
    }

    await db.Users.destroy({where:{strNickname:req.body.strNickname}});
    res.send({result:'OK'});

});

router.post('/realtimegameround', (req, res) => {
    // console.log(req.body);

    // var bobj = {roomno:req.body.roomno, round:req.body.round};

    // global.io.emit("realtime_gameround", bobj);
    ISocket.RealtimeBettingRound(req.body.roomno, req.body.round);

    res.send("OK");
});

router.post('/realtimebetting', async (req, res) => {

    console.log("도착")
    console.log(req.body.roomno)
    console.log(req.body.chips)
    console.log(req.body.target)
    console.log(req.body.group)

    ISocket.RealtimeBetting(req.body.roomno, req.body.chips, req.body.target, req.body.group);

    res.send("OK");
});

router.post('/realtimebettingwin', async (req, res) => {

    ISocket.RealtimeBettingWin(req.body.roomno, req.body.result, req.body.target, req.body.group);
    res.send("OK");
});

//router.post('/realtimebettingend', isLoggedIn, async (req, res) => {
router.post('/realtimebettingend', async (req, res) => {

    ISocket.RealtimeBettingEnd(req.body.roomno);
    res.send("OK");
});

/**
 * 파트너관리 > 신규 회원 조회
 */
router.post('/listtodayregist', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID:dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = await IAgent.GetUserList(strTimeStart, strTimeEnd, user.strGroupID, '', true);
    // TODO: iClass에 따라 조정 필요
    let listShops = await IAgent.GetShopList(strTimeStart, strTimeEnd, user.strGroupID, '', true);
    let listAgents = await IAgent.GetAgentList(strTimeStart, strTimeEnd, user.strGroupID, '', true);
    let listViceAdmins = await IAgent.GetViceAdminList(strTimeStart, strTimeEnd, user.strGroupID, '', true);
    let listProAdmins = await  IAgent.GetProAdminList(strTimeStart, strTimeEnd, user.strGroupID, '', true);

    let total = {iTotalCash:0};

    for ( let i in result )
    {
        if ( result[i].lev5 == null )
        {
            result.splice(i, 1);
        }
        else
            total.iTotalCash += parseFloat(result[i].iCash);
    }

    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, '', dbuser.strID);
    var bobj = {overview:overview};
    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_partner/listtodayregist', {iLayout:0, iHeaderFocus:0, user:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, total:total, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/request_todayregistlist', isLoggedIn, async ( req, res ) => {
    console.log(`/request_todaylist`);

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = await IAgent.GetUserList(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname, true);
    // TODO: iClass에 따라 조정 필요
    let listShops = await IAgent.GetShopList(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname, true);
    let listAgents = await IAgent.GetAgentList(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname, true);
    let listViceAdmins = await IAgent.GetViceAdminList(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname, true);
    let listProAdmins = await IAgent.GetProAdminList(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname, true);

    res.send({userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, iRootClass: req.user.iClass});
});

module.exports = router;