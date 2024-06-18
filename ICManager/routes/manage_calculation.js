const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const ITime = require('../utils/time');
const IInout = require('../implements/inout');
const {Op}= require('sequelize');

const IAgent = require('../implements/agent3');
const IAgentSettle = require('../implements/agent_settle3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');


router.get('/calculation', isLoggedIn, async(req, res) => {

    const dbuser = await IAgent.GetUserInfo(req.user.strNickname);

    const user = {strNickname:dbuser.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    if (req.user.iPermission == 100) {
        user.strID = dbuser.strIDRel;
    }

    const agentinfo = await IAgent.GetPopupAgentInfo(req.user.strGroupID, parseInt(req.user.iClass), req.user.strNickname);

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, user.strNickname, user.strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, user.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_calculation/calculation', {iLayout:0, iHeaderFocus:6, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/calculation', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    if (req.user.iPermission == 100) {
        user.strID = dbuser.strIDRel;
    }

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, user.strNickname, user.strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_calculation/calculation', {iLayout:0, iHeaderFocus:6, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

/**
 * 전체 죽장 조회2
 */
router.post('/settle_all2', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle, strID:dbuser.strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let strQuater = req.body.strQuater;
    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd;
    let iSettleDays = req.body.iSettleDays;
    let iSettleType = req.body.iSettleType;

    let overview = {};
    if (dateStart != '' && dateEnd != '') {
        let overviewList = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, strQuater, dateStart, dateEnd, iSettleDays, iSettleType);
        if (overviewList.length > 0) {
            overview = overviewList[0];
        }
    }

    if (dbuser.iClass <= 3) {
        // 대.부본 보관죽장*
        let settleCurrent = await IAgentSettle.CalculateOverviewSettleCurrent(req.body.strGroupID, strQuater, iSettleDays, iSettleType);
        overview.iSettlePlus = settleCurrent.iSettlePlus;
        overview.iSettleMinus = settleCurrent.iSettleMinus;
        overview.iCurrentTotalSettle = settleCurrent.iCurrentTotalSettle;

        // 순이익, 배당금, 지분자 전월 이월, 지분자 총이월, 합계
        let overviewShareList = await IAgentSettle.CalculateOverviewShare(req.body.strGroupID, strQuater);
        if (overviewShareList.length > 0) {
            overviewShare = overviewShareList[0];
        }
        // 지분자보관죽장*
        let shareCurrent = await IAgentSettle.CalculateOverviewShareCurrent(req.body.strGroupID, strQuater);
        overviewShare.iSharePlus = shareCurrent.iSharePlus;
        overviewShare.iShareMinus = shareCurrent.iShareMinus;
        overviewShare.iCurrentTotalShare = shareCurrent.iCurrentTotalShare;
    }

    res.render('manage_calculation/settle_all2', {iLayout:0, iHeaderFocus:6, user:user, agentinfo:agentinfo, iocount:iocount, list:[], overview:overview, overviewShare:overviewShare});
});

/**
 * 리셋 죽장 조회
 */
router.post('/settle_all4', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    let iSettleDays = 15;
    let iSettleType = 0;
    if (dbuser.iClass <= 3) {
        iSettleType = -1;
        iSettleDays = -1;
    } else if (dbuser.iClass >= 4) {
        const padminUser = await IAgent.GetPAdminInfo(dbuser);
        iSettleDays = padminUser.iSettleDays;
        iSettleType = padminUser.iSettleType;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle, strID:dbuser.strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iSettleDays:iSettleDays, iSettleType:iSettleType};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    // let date = new Date();
    // let iMonth = date.getMonth();
    // let strQuater = '';
    // let dateStart = '';
    // let dateEnd = '';
    // if ( date.getDate() < 16 ) {
    //     strQuater = `${iMonth+1}-1`;
    //     dateStart = ITime.get1QuaterStartDate(iMonth);
    //     dateEnd = ITime.get1QuaterEndDate(iMonth);
    // } else {
    //     strQuater = `${iMonth+1}-2`;
    //     dateStart = ITime.get2QuaterStartDate(iMonth);
    //     dateEnd = ITime.get2QuaterEndDate(iMonth);
    // }

    // let overviewList = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, strQuater, dateStart, dateEnd);
    // let overview = {};
    // if (overviewList.length > 0) {
    //     overview = overviewList[0];
    // }
    let overview = {};

    let overviewShare = {};

    if (dbuser.iClass <= 3) {
        // 대.부본 보관죽장*
        // let settleCurrent = await IAgentSettle.CalculateOverviewSettleCurrent(req.body.strGroupID, strQuater);
        // overview.iSettlePlus = settleCurrent.iSettlePlus;
        // overview.iSettleMinus = settleCurrent.iSettleMinus;
        // overview.iCurrentTotalSettle = settleCurrent.iCurrentTotalSettle;
        //
        // // 순이익, 배당금, 지분자 전월 이월, 지분자 총이월, 합계
        // let overviewShareList = await IAgentSettle.CalculateOverviewShare(req.body.strGroupID, strQuater);
        // if (overviewShareList.length > 0) {
        //     overviewShare = overviewShareList[0];
        // }
        // // 지분자보관죽장*
        // let shareCurrent = await IAgentSettle.CalculateOverviewShareCurrent(req.body.strGroupID, strQuater);
        // overviewShare.iSharePlus = shareCurrent.iSharePlus;
        // overviewShare.iShareMinus = shareCurrent.iShareMinus;
        // overviewShare.iCurrentTotalShare = shareCurrent.iCurrentTotalShare;
    }

    res.render('manage_calculation/settle_all4', {iLayout:0, iHeaderFocus:6, user:user, agentinfo:agentinfo, iocount:iocount, list:[], overview:overview, overviewShare:overviewShare});
});

let GetSettleVice = (obj) => {
    // 죽장 계산
    let iBTotal = parseFloat(obj.iBaccaratTotalVice ?? 0) + parseFloat(obj.iUnderOverTotalVice ?? 0);
    let iSTotal = parseFloat(obj.iSlotTotalVice ?? 0);
    let iPBATotal = parseFloat(obj.iPBATotalVice ?? 0);
    let iPBBTotal = parseFloat(obj.iPBBTotalVice ?? 0);

    // if (iBTotal < 0) {
    //     iBTotal = 0;
    //     obj.iBaccaratTotalVice = 0;
    //     obj.iUnderOverTotalVice = 0;
    // }
    // if (iSTotal < 0) {
    //     iSTotal = 0;
    //     obj.iSlotTotalVice = 0;
    // }
    // if (iPBATotal < 0) {
    //     iPBATotal = 0;
    //     obj.iPBATotalVice = 0;
    // }
    // if (iPBBTotal < 0) {
    //     iPBBTotal = 0;
    //     obj.iPBBTotalVice = 0;
    // }

    return iBTotal + iSTotal + iPBATotal + iPBBTotal;
}

/**
 * 죽장정산 Overview
 */
router.post('/request_overview', isLoggedIn, async (req, res) => {

    console.log(`/request_overview`);
    console.log(req.body);

    let strQuater = req.body.strQuater;
    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd;
    let iSettleDays = req.body.iSettleDays;
    let iSettleType = req.body.iSettleType;

    let overviewList = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, req.body.strQuater, req.body.dateStart, req.body.dateEnd, iSettleDays, iSettleType);
    let overview = {};
    if (overviewList.length > 0) {
        overview = overviewList[0];
    }
    let settleCurrent = await IAgentSettle.CalculateOverviewSettleCurrent(req.body.strGroupID, req.body.strQuater, iSettleDays, iSettleType);
    overview.iSettlePlus = settleCurrent.iSettlePlus;
    overview.iSettleMinus = settleCurrent.iSettleMinus;
    overview.iCurrentTotalSettle = settleCurrent.iCurrentTotalSettle;

    let overviewShareList = await IAgentSettle.CalculateOverviewShare(req.body.strGroupID, req.body.strQuater);
    let overviewShare = {};
    if (overviewShareList.length > 0) {
        overviewShare = overviewShareList[0];
    }
    let shareCurrent = await IAgentSettle.CalculateOverviewShareCurrent(req.body.strGroupID, req.body.strQuater);
    overviewShare.iSharePlus = shareCurrent.iSharePlus;
    overviewShare.iShareMinus = shareCurrent.iShareMinus;
    overviewShare.iCurrentTotalShare = shareCurrent.iCurrentTotalShare;

    if ( parseInt(req.body.iClass) == 3 )
    {
        // let share = await db.sequelize.query(`
        //     SELECT * FROM ShareRecords
        // `);
        let share = await db.ShareRecords.findOne({
            where: {
                strID: req.body.strID,
                strQuater: req.body.strQuater,
            }
        });

        if ( share != null )
        {
            res.send({result: 'OK', overview: overview, overviewShare: overviewShare, strMemo: share.strMemo, strMemo2: share.strMemo2, iRootClass: req.body.iClass});
            return;
        }
    }
    res.send({result:'OK', overview: overview, overviewShare: overviewShare, strMemo: '', strMemo2: '', iRootClass: req.body.iClass});
});

// 대본보관죽장 목록
router.post('/popup_proadmin_settle', isLoggedIn, async(req, res) => {
    console.log(req.body);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    const user = {strNickname:req.body.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(dbuser.strGroupID, parseInt(dbuser.iClass), dbuser.strNickname);

    res.render('manage_calculation/popup_proadmin_settle', {iLayout:7, iHeaderFocus:0, user:user, agent:agent, list:[], strParent: strParent});
});

/**
 * [총본사] 정산관리 > 대본보관죽장 목록
 */
router.post('/request_proadmin_settle_list', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    const list = await db.sequelize.query(`
        SELECT u2.strNickname AS parentNickname, u2.strGroupID AS parentGroupID, u2.iClass AS parentClass,
               u.strNickname, u.strGroupID, u.strSettleMemo, u.strID, u.strGroupID, u.iClass,
               IFNULL((SELECT sum(iSettleAcc) FROM Users WHERE strGroupID LIKE CONCAT(u.strGroupID, '%')), 0) AS iSettleAcc,
               IFNULL((SELECT sum(iSettle) FROM Users WHERE strGroupID LIKE CONCAT(u.strGroupID, '%')), 0) AS iSettle
        FROM Users u
                 JOIN Users u2 ON u.iParentID = u2.id
        WHERE 1=1
          AND u.iClass=4
          AND u.strGroupID LIKE CONCAT('${dbuser.strGroupID}', '%') AND u.iSettleDays = ${dbuser.iSettleDays} AND u.iSettleType = ${dbuser.iSettleType}
        ORDER BY parentNickname ASC, u.strNickname ASC, parentGroupID ASC
        ;
    `);

    res.send({result: 'OK', list: list[0]});
});

router.post('/settle_credits', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle, strID:dbuser.strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let list = await GetUsersForCredit(parseInt(req.body.iClass)+1, req.body.strGroupID);

    res.render('manage_calculation/settle_credits', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, iocount:iocount, list:list});
});

router.post('/credits_history', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    res.render('manage_calculation/credits_history', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, creadits:[]});
});

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

router.post('/request_credit_apply', isLoggedIn, async (req, res) => {

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
                    iCreditBefore: user.iSettleAcc,
                    writer: strWriter,
                    eType: eType,
                    strMemo: stMemo
                });

                let iSettleAcc = user.iSettleAcc + iCredit;
                //await user.update({iSettleAccBefore:user.iSettleAcc, iSettleAcc:iSettleAcc});
                await db.Users.update({iSettleAccBefore:user.iSettleAcc, iSettleAcc:iSettleAcc}, {where:{strID:list[i].strID}});

                // 마지막 죽장의 입출후 금액을 갱신하기
                let settle = await db.SettleRecords.findAll({
                    where: {
                        strID: user.strID,
                    },
                    order: [['id', 'DESC']],
                    limit: 1
                });

                for ( let i in settle )
                {
                    await db.SettleRecords.update({iSettleAfter:iSettleAcc}, {where:{id:settle[i].id}});
                }

                // if (settle.length > 0) {
                //     for (let i in settle) {
                //         await settle[i].update({
                //             iSettleAfter:iSettleAcc
                //         });
                //     }
                // }
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

router.post('/request_savememo', isLoggedIn, async (req, res) => {

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user != null )
    {
        await db.Users.update({strSettleMemo:req.body.strValue}, {where:{strNickname:req.body.strNickname}});
        //await user.update({strSettleMemo:req.body.strValue});
        res.send({result:'OK'});
    }
    else
        res.send({result:'Error'});
});

router.post('/request_share_savememo', isLoggedIn, async (req, res) => {

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
        await db.ShareRecords.update({
            strMemo: req.body.strMemo,
            strMemo2: req.body.strMemo2
        }, {where:{id:shares[i].id}});

        // await shares[i].update({
        //     strMemo: req.body.strMemo,
        //     strMemo2: req.body.strMemo2
        // });
    }

    res.send({result:'OK'});
});

router.post('/request_listvicehq', isLoggedIn, async (req, res) => {

    console.log('/request_listvicehq');
    console.log(req.body);

    let listData = await GetViceHQs(req.body.strGroupID);

    res.send({result:'OK', listData:listData});
});

router.post('/request_listadmin', isLoggedIn, async (req, res) => {

    console.log('/request_listadmin');
    console.log(req.body);

    let listData = await GetAdmins(req.body.strGroupID, req.body.strQuater);

    res.send({result:'OK', listData:listData});
});

router.post('/request_listpadmin', isLoggedIn, async (req, res) => {

    console.log('/request_listpadmin');
    console.log(req.body);

    let listData = await GetProAdmins(req.body.strGroupID, req.body.strQuater);

    console.log(listData);

    res.send({result:'OK', listData:listData});
});

router.post('/request_listsettle', isLoggedIn, async (req, res) => {

    console.log('/request_listsettle');
    console.log(req.body);

    let list = await IAgentSettle.GetSettleList(req.body.strGroupID, req.body.strQuater);
    res.send({result:'OK', list:list});
});

router.post('/request_padmininfo', isLoggedIn, async (req, res) => {

    console.log('/request_padmininfo');
    console.log(req.body);

    let objectData = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    res.send({result:'OK', objectData:objectData});
});

module.exports = router;