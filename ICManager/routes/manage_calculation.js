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
const {Op}= require('sequelize');

const IAgent = require('../implements/agent');
const IAgent2 = require('../implements/agent3');
const IAgentSettle = require('../implements/agent_settle3');
const IRolling = require('../implements/rolling');
const ISettle = require('../implements/settle');
const ISocket = require('../implements/socket');

const {isLoggedIn, isNotLoggedIn} = require('./middleware');


router.get('/calculation', isLoggedIn, async(req, res) => {

    const dbuser = await db.Users.findOne({where:{strNickname:req.user.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:iCash,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const agentinfo = await IAgent2.GetPopupAgentInfo(req.user.strGroupID, parseInt(req.user.iClass), req.user.strNickname);

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    var overview = await IAgent2.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, dbuser.strNickname, dbuser.strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, user.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_calculation/calculation', {iLayout:0, iHeaderFocus:6, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/calculation', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const agentinfo = await IAgent2.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    var overview = await IAgent2.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, user.strNickname, user.strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_calculation/calculation', {iLayout:0, iHeaderFocus:6, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/settle', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        strID = dbuser.strID;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strID:strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agentinfo = await IAgent2.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    // const strTimeStart = ITime.getTodayStart();
    // const strTimeEnd = ITime.getTodayEnd();

    // var overview = await IAgent.CalculateDailyBettingRecord(0, user.strGroupID, user.iClass);
    // var bobj = {overview:overview};

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    let listViceHQ = [];
    let listAdmin = [];
    let listProAdmin= [];
    let listViceAdmin = [];
    let listAgent = [];
    if ( req.body.iClass == 1 )
        listViceHQ = await GetViceHQs(req.body.strGroupID);
    else if ( req.body.iClass == 2 )
        listAdmin = await GetAdmins(req.body.strGroupID);
    else if ( req.body.iClass == 3 )
        listProAdmin = await GetProAdmins(req.body.strGroupID);
    else if ( req.body.iClass == 4 )
        listViceAdmin = await GetAgent(req.body.strNickname, 4);
    else if ( req.body.iClass == 5 )
        listAgent = await GetAgent(req.body.strNickname, 5);

    // strQuater
    let date = new Date();
    let iMonth = date.getMonth();
    let strQuater = '';
    let dateStart = '';
    let dateEnd = '';
    if ( date.getDate() < 16 ) {
        strQuater = `${iMonth+1}-1`;
        dateStart = ITime.get1QuaterStartDate(iMonth);
        dateEnd = ITime.get1QuaterEndDate(iMonth);
    } else {
        strQuater = `${iMonth+1}-2`;
        dateStart = ITime.get2QuaterStartDate(iMonth);
        dateEnd = ITime.get2QuaterEndDate(iMonth);
    }

    let list = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, strQuater, dateStart, dateEnd);

    res.render('manage_calculation/settle', {iLayout:0, iHeaderFocus:6, user:user, agentinfo:agentinfo, iocount:iocount, list: list,
        listViceHQ: listViceHQ, listAdmin:listAdmin, listProAdmin:listProAdmin, listViceAdmin: listViceAdmin, listAgent:listAgent});
});

// 죽장 조회
router.post('/request_settle', async (req, res) => {

    console.log('/request_settle');
    console.log(req.body);

    let list = [];

    await GetFullAgents(req.body.strGroupID, req.body.iClass, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.strNickname, list);

    if ( list.length > 0 )
    {
        if ( list[0].iClass == 4 || list[0].iClass == 5 )
        {
            let exist = await db.SettleRecords.findOne({where:{
                    strQuater:req.body.strQuater,
                    strNickname:list[0].strNickname
                }});

            if ( null != exist )
            {
                res.send({result:'EXIST', list:list, iRootClass: req.user.iClass});
                return;
            }
            else
            {
                res.send({result:'OK', list:list, iRootClass: req.user.iClass});
                return;
            }
        }
    }
});

// 죽장 지급
router.post('/request_applysettle', async (req, res) => {

    console.log(`/request_applysettle`);
    console.log(req.body);

    let array = req.body.data.split(',');

    let list = [];
    for ( let i = 0; i < array.length/20; ++ i )
    {
        let idx = i*20;
        list.push({strNickname:array[idx+0], iSettle:array[idx+1], iInputSettle:array[idx+2], iQuaterSettle:array[idx+3], iAccumulated:array[idx+4],
            iCB:array[idx+5], iCS:array[idx+6], iTotal:array[idx+7], iBWinlose: array[idx+8], iUWinlose: array[idx+9],
            iSWinlose: array[idx+10], iPWinlose: array[idx+11], iRolling: array[idx+12], iResult: array[idx+13],
            fSettleBaccarat: array[idx+14], fSettleSlot: array[idx+15], fSettlePBA: array[idx+16], fSettlePBB: array[idx+17],
            iClass: array[idx+18], strID: array[idx+19]});
    }

    if ( list.length > 0 )
    {
        let exist = await db.SettleRecords.findOne({where:{
                strQuater:req.body.strQuater,
                strNickname:list[0].strNickname
            }});

        if ( exist != null )
        {
            res.send({result:'Exist'});
            return;
        }
    }


    let bFlag = true;

    const from = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    for ( let i in list )
    {
        let user = await db.Users.findOne({where:{strNickname:list[i].strNickname}});
        if ( user != null )
        {

            let iSettleUser = parseInt(user.iSettle); // 이용자가 가지고 있는 죽장
            let iSettleAcc = parseInt(user.iSettleAcc); // 전웡이월
            let iSettle = parseInt(list[i].iSettle); // 분기 죽장
            let iSettleGive = parseInt(list[i].iInputSettle);   // 지급죽장
            if (user.iClass == 5 && iSettleGive < 0) // 부본은 바로 죽장 지급(마이너스는 미지급)
            {
                iSettleGive = 0;
            }
            else if ( iSettleGive < 0 ) // 대본 죽장분기값(iSettle)이 마이너스일 경우 해당 금액은 모두 이월처리
            {
                iSettleGive = 0;
                iSettleAcc = iSettleAcc + iSettle;
            }
            else
            {
                iSettleAcc = iSettleAcc + iSettle - iSettleGive;
                iSettleUser = iSettleUser + iSettleGive; // 죽장이 실제 발생시에만 이용자에 추가
            }

            let settle = await db.SettleRecords.findOne({where:{strNickname:user.strNickname, strQuater:req.body.strQuater}});

            if ( settle == null )
            {
                await db.SettleRecords.create({
                    strQuater:req.body.strQuater,
                    strNickname:list[i].strNickname,
                    strGroupID:user.strGroupID,
                    iSettle:iSettle, // 죽장 분기
                    iSettleGive:iSettleGive, // 죽장 지급
                    iSettleAcc:iSettleAcc, // 죽장이월(죽장분기-입력값)
                    iSettleBeforeAcc:user.iSettleAcc, // 전월 전월 이월
                    iSettleOrigin:iSettle, // 죽장 분기
                    iCommissionB:list[i].iCB,
                    iCommissionS:list[i].iCS,
                    iTotal:list[i].iTotal,
                    iRolling:list[i].iRolling,
                    iBWinlose:list[i].iBWinlose,
                    iUWinlose:list[i].iUWinlose,
                    iSWinlose:list[i].iSWinlose,
                    iPWinlose:list[i].iPWinlose,
                    iResult:list[i].iResult,
                    fSettleBaccarat:list[i].fSettleBaccarat,
                    fSettleSlot:list[i].fSettleSlot,
                    fSettlePBA:list[i].fSettlePBA,
                    fSettlePBB:list[i].fSettlePBB,
                    iClass:list[i].iClass,
                    strID:list[i].strID
                });
            }
            else
            {
                await settle.update({
                    iSettle:iSettle,  // 죽장 분기
                    iSettleGive:iSettleGive, // 죽장 지급
                    iSettleAcc:iSettleAcc, // 죽장이월(죽장분기-입력값)
                    iSettleBeforeAcc:user.iSettleAcc, // 죽장 전월 이월
                    iSettleOrigin:iSettle, // 죽장 분기
                    iCommissionB:list[i].iCB,
                    iCommissionS:list[i].iCS,
                    iTotal:list[i].iTotal,
                    iRolling:list[i].iRolling,
                    iBWinlose:list[i].iBWinlose,
                    iUWinlose:list[i].iUWinlose,
                    iSWinlose:list[i].iSWinlose,
                    iPWinlose:list[i].iPWinlose,
                    iResult:list[i].iResult,
                    fSettleBaccarat:list[i].fSettleBaccarat,
                    fSettleSlot:list[i].fSettleSlot,
                    fSettlePBA:list[i].fSettlePBA,
                    fSettlePBB:list[i].fSettlePBB,
                    iClass:list[i].iClass,
                    strID:list[i].strID
                });
            }

            await db.GTs.create(
                {
                    eType:'GETSETTLE',
                    strTo:user.strNickname,
                    strFrom:req.body.strNickname,
                    strGroupID:user.strGroupID,
                    iAmount:iSettleGive,
                    iBeforeAmountTo:user.iSettle,
                    iAfterAmountTo:user.iCash,
                    iBeforeAmountFrom:from.iCash,
                    iAfterAmountFrom:from.iCash,
                    iClassTo: user.iClass,
                    iClassFrom: from.iClass,
                });

            await user.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:iSettleAcc});
        }
    }

    console.log(list);

    if ( bFlag == true )
    {
        res.send({result:'OK'});
        return;
    }
    res.send({result:'Exist'});
});

/**
 * 죽장정산 Overview
 */
router.post('/request_overview', async (req, res) => {

    console.log(`/request_overview`);
    console.log(req.body);

    let list = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, req.body.strQuater, req.body.dateStart, req.body.dateEnd);
    if ( parseInt(req.body.iClass) == 3 )
    {
        let share = await db.ShareRecords.findOne({
            where: {
                strID: req.body.strID,
                strQuater: req.body.strQuater,
            }
        });

        if ( share != null )
        {
            res.send({result: 'OK', list: list, strMemo: share.strMemo, strMemo2: share.strMemo2, iRootClass: req.user.iClass});
            return;
        }
    }
    res.send({result:'OK', list:list, strMemo: '', strMemo2: '', iRootClass: req.user.iClass});
});

// 대본보관죽장 목록
router.post('/popup_proadmin_settle', isLoggedIn, async(req, res) => {
    console.log(req.body);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    const user = {strNickname:req.body.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agent = await IAgent2.GetPopupAgentInfo(dbuser.strGroupID, parseInt(dbuser.iClass), dbuser.strNickname);

    res.render('manage_calculation/popup_proadmin_settle', {iLayout:7, iHeaderFocus:0, user:user, agent:agent, list:[], strParent: strParent});
});

/**
 * [총본사] 정산관리 > 대본보관죽장 목록
 */
router.post('/request_proadmin_settle_list', async (req, res) => {
    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    const list = await db.sequelize.query(`
        SELECT u2.strNickname AS parentNickname, u2.strGroupID AS parentGroupID, u2.iClass AS parentClass,
               u.strNickname, u.strGroupID, u.strSettleMemo, u.strID, u.strGroupID, u.iClass,
               IFNULL((SELECT sum(iSettleAcc) FROM Users WHERE strGroupID LIKE CONCAT(u.strGroupID, '%')), 0) AS iSettleAcc,
               IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(u.strGroupID, '%')), 0) AS iSettle
        FROM Users u
                 JOIN Users u2 ON u.iParentID = u2.id
        WHERE 1=1
          AND u.iClass=4
          AND u.strGroupID LIKE CONCAT('${dbuser.strGroupID}', '%');
    `);

    res.send({result: 'OK', list: list[0]});
});

router.post('/settle_credits', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        strID = dbuser.strID;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strID:strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agent = await IAgent2.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let list = await GetUsersForCredit(parseInt(req.body.iClass)+1, req.body.strGroupID);

    res.render('manage_calculation/settle_credits', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, iocount:iocount, list:list});
});

router.post('/credits_history', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const agent = await IAgent2.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    res.render('manage_calculation/credits_history', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, creadits:[]});
});

let GetFullAgents = async (strGroupID, iClass, strQuater, dateStart, dateEnd, strNickname, listReturn) => {

    if ( iClass >= 8 )
        return;

    console.log(`##### GetFullAgents : ${strNickname}, Class : ${iClass}`);

    let list = await IAgentSettle.GetAgentListForSettle(strGroupID, iClass, strQuater, dateStart, dateEnd, strNickname);

    console.log(`!#!#!#!#!!#!#!#!#!#!#!!#!#!#!#!#!#!!#!#!#!#!#!#!!#!#!#!#!#!#!!#!#!#!#!#!#!!#!#!#!#!#!#!!#!#!#!#!#!#!!#!#`);
    console.log(list.length);
    if ( list.length > 0 )
    {
        listReturn.push(list[0]);

        let children = await db.Users.findAll({
            where:{
                iParentID:list[0].id,
                iPermission: {
                    [Op.notIn]: [100]
                },
            }
        });
        console.log(`children length : ${children.length}`);
        for ( let i in children )
        {
            await GetFullAgents(children[i].strGroupID, parseInt(children[i].iClass), strQuater, dateStart, dateEnd, children[i].strNickname, listReturn);
        }
    }
}

let GetViceHQs = async (strGroupID) => {
    let list = await db.Users.findAll({where:{
            iClass:2,
            iPermission: {
                [Op.notIn]: [100]
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
        }})

    return list;
};

let GetAdmins = async (strGroupID, strQuater) => {
    // 총총/총본에서 본사 목록 조회용
    if (strQuater != null && strQuater.length > 0) {
        let list = await IAgentSettle.GetAdminForSettle(strGroupID, strQuater, 3);
        return list;
    }

    let list = await db.Users.findAll({where:{
            iClass:3,
            iPermission: {
                [Op.notIn]: [100]
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
        }})

    return list;
};

let GetUsersForCredit = async (iClass, strGroupID) => {
    let list = await db.sequelize.query(`
        SELECT
            u.*,
            IFNULL((SELECT sum(iSettleAcc + iSettleBeforeAcc) FROM SettleRecords WHERE strID = u.strID ORDER BY createdAt DESC LIMIT 1), 0) AS iCreditAccBefore
        FROM Users u
        WHERE u.iClass = ${iClass} AND u.strGroupID LIKE '${strGroupID}%'
    `);
    return list[0];
};

let GetProAdmins = async (strGroupID, strQuater) => {

    if (strQuater != null && strQuater.length > 0) {
        let list = await IAgentSettle.GetAdminForSettle(strGroupID, strQuater, 4);
        return list;
    }

    let list = await db.Users.findAll({where:{iClass:4,
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
        }})

    return list;
};

let GetAgent = async (strNickname, iClass) => {

    let list = await db.Users.findAll({
        where:{
            iClass:iClass,
            strNickname:strNickname,
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });
    return list;
};

let GetViceAdmins = async (strGroupID) => {

    let list = await db.Users.findAll({where:{iClass:5,
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
        }})

    return list;
};

/**
 * TODO: 추후 삭제
 * 테스트 초기화
 */
router.post('/testinit', async (req, res) => {

    await db.SettleRecords.destroy({where:{}, truncate:true});

    let users = await db.Users.findAll();
    for ( let i in users )
    {
        await users[i].update({
            iSettle:0,
            iSettleAcc:0,
            iSettleAccBefore:0,
        });
    }

    let shares = await db.ShareUsers.findAll();
    for ( let i in shares )
    {
        await shares[i].update({
            iShare: 0,
            iShareAccBefore: 0,
        });
    }

    await db.GTs.destroy({where:{}, truncate:true});
    await db.CreditRecords.destroy({where:{}, truncate:true});
    await db.ShareRecords.destroy({where:{}, truncate:true});
    await db.ShareCreditRecords.destroy({where:{}, truncate:true});
    await db.ChargeRequest.destroy({where: {}, truncate:true});
    await db.SettleRecords.destroy({where: {}, truncate: true});
    await db.BettingRecords.destroy({where:{}, truncate:true});
    await db.DailyBettingRecords.destroy({where:{}, truncate:true});

    res.send({result:'OK'});
});

router.post('/testinitcurrent', async (req, res) => {

    await db.SettleRecords.destroy({where:{
            strQuater: req.body.strQuater
        }, truncate:true});

    await db.ShareRecords.destroy({where:{
            strQuater: req.body.strQuater
        }, truncate:true});
    res.send({result:'OK'});
});

router.post('/request_credit_apply', async (req, res) => {

    console.log(`request_credit_apply`);
    let array = req.body.data.split(',');

    let list = [];
    for ( let i = 0; i < array.length/4; i++ ) {
        let idx = i*4;
        list.push({strID: array[idx+0], iCredit: array[idx+1], strMemo: array[idx+2], writer: array[idx+3]});
    }

    let bFlag = true;
    let failStrIDs = [];

    if ( list.length > 0 ) {
        for (let i in list) {
            let user = await db.Users.findOne({where:{strID:list[i].strID}});
            if ( user != null )
            {
                // 가불은 마이너스 처리
                let iCredit = parseInt(list[i].iCredit);
                let eType = 'TAKE';
                if (iCredit < 0) {
                    eType = 'GIVE';
                }
                let stMemo = list[i].strMemo;
                let strWriter = list[i].writer;

                await db.CreditRecords.create({
                    strID: user.strID,
                    strNickname: user.strNickname,
                    strGroupID: user.strGroupID,
                    iClass: user.iClass,
                    iIncrease: iCredit,
                    iBeforeCredit: user.iSettleAcc,
                    writer: strWriter,
                    eType: eType,
                    strMemo: stMemo
                });

                let iSettleAcc = user.iSettleAcc + iCredit;

                await user.update({iSettleAccBefore:user.iSettleAcc, iSettleAcc:iSettleAcc});

            } else {
                failStrIDs.push(user.strID);
            }
        }
    } else {
        res.send({result:'Exist', 'msg' : '저장할 항목이 없습니다'});
        return;
    }

    if ( bFlag == true )
        res.send({result:'OK'});
    else
        res.send({result:'Exist', 'msg' : failStrIDs});
});

router.post('/request_savememo', async (req, res) => {

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user != null )
    {
        await user.update({strSettleMemo:req.body.strValue});
        res.send({result:'OK'});
    }
    else
        res.send({result:'Error'});
});

router.post('/request_share_savememo', async (req, res) => {

    let strQuater = req.body.strQuater;
    let strID = req.body.strID;

    if ( strQuater == '' || strQuater == undefined ||  strID == '' || strID == undefined )
    {
        res.send({result:'ERROR', msg: '필수값 부족'});
        return;
    }

    let shares = await db.ShareRecords.findAll({where:{strID:req.body.strID}});
    for ( let i in shares )
    {
        await shares[i].update({
            strMemo: req.body.strMemo,
            strMemo2: req.body.strMemo2
        });
    }

    res.send({result:'OK'});
});

router.post('/request_listvicehq', async (req, res) => {

    console.log('/request_listvicehq');
    console.log(req.body);

    let listData = await GetViceHQs(req.body.strGroupID);

    res.send({result:'OK', listData:listData});
});

router.post('/request_listadmin', async (req, res) => {

    console.log('/request_listadmin');
    console.log(req.body);

    let listData = await GetAdmins(req.body.strGroupID, req.body.strQuater);

    res.send({result:'OK', listData:listData});
});

router.post('/request_listpadmin', async (req, res) => {

    console.log('/request_listpadmin');
    console.log(req.body);

    let listData = await GetProAdmins(req.body.strGroupID, req.body.strQuater);

    console.log(listData);

    res.send({result:'OK', listData:listData});
});

router.post('/request_padmininfo', async (req, res) => {

    console.log('/request_padmininfo');
    console.log(req.body);

    let objectData = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    res.send({result:'OK', objectData:objectData});
});

module.exports = router;