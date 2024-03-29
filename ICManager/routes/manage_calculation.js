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

    const dbuser = await db.Users.findOne({where:{strNickname:req.user.strNickname}});
    let iCash = 0;
    let iRolling = 0;
    let iSettle = 0;
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        iRolling = dbuser.iRolling;
        iSettle = dbuser.iSettle;
    }

    const user = {strNickname:dbuser.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:iCash, iRolling:iRolling, iSettle:iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    // 보기 권한만 있고 연결 유저 아이디가 있는 경우
    if ( dbuser.iPermission == 100 && dbuser.iRelUserID != null ) {
        const relUser = await db.Users.findOne({where:{id: dbuser.iRelUserID}});
        user.strID = relUser.strID;
        // user.strNickname = relUser.strNickname;
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
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let iRolling = 0;
    let iSettle = 0;
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        iRolling = dbuser.iRolling;
        iSettle = dbuser.iSettle;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, iRolling:iRolling, iSettle:iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    // 보기 권한만 있고 연결 유저 아이디가 있는 경우
    if ( req.user.iPermission == 100 && dbuser.iRelUserID != null ) {
        const relUser = await db.Users.findOne({where:{id: dbuser.iRelUserID}});
        user.strID = relUser.strID;
        // user.strNickname = relUser.strNickname;
    }

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    var overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, user.strNickname, user.strID);
    var bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_calculation/calculation', {iLayout:0, iHeaderFocus:6, user:user, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/settle', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let iRolling = 0;
    let iSettle = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        iRolling = dbuser.iRolling;
        iSettle = dbuser.iSettle;
        strID = dbuser.strID;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, iRolling:iRolling, iSettle:iSettle,
        strID:strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

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

    let overview = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, strQuater, dateStart, dateEnd);
    let settleCurrent = await IAgentSettle.CalculateOverviewSettleCurrent(req.body.strGroupID, strQuater);
    overview.iSettlePlus = settleCurrent.iSettlePlus;
    overview.iSettleMinus = settleCurrent.iSettleMinus;
    overview.iCurrentTotalSettle = settleCurrent.iCurrentTotalSettle;

    let overviewShare = await IAgentSettle.CalculateOverviewShare(req.body.strGroupID, strQuater);
    let shareCurrent = await IAgentSettle.CalculateOverviewShareCurrent(req.body.strGroupID, strQuater);
    overviewShare.iSharePlus = shareCurrent.iSharePlus;
    overviewShare.iShareMinus = shareCurrent.iShareMinus;
    overviewShare.iCurrentTotalShare = shareCurrent.iCurrentTotalShare;

    res.render('manage_calculation/settle', {iLayout:0, iHeaderFocus:6, user:user, agentinfo:agentinfo, iocount:iocount, overview: overview[0], overviewShare: overviewShare[0],
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
router.post('/request_applysettle', isLoggedIn, async (req, res) => {

    console.log(`/request_applysettle`);
    console.log(req.body);

    // 유저 체크
    if (req.user.iClass > 3 || req.user.iPermission == 100) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    let array = req.body.data.split(',');

    let list = [];
    for ( let i = 0; i < array.length/22; ++ i )
    {
        let idx = i*21;
        list.push({strNickname:array[idx+0], iSettle:array[idx+1], iInputSettle:array[idx+2], iQuaterSettle:array[idx+3], iAccumulated:array[idx+4],
            iCB:array[idx+5], iCS:array[idx+6], iTotal:array[idx+7], iBWinlose: array[idx+8], iUWinlose: array[idx+9],
            iSWinlose: array[idx+10], iPWinlose: array[idx+11], iRolling: array[idx+12], iResult: array[idx+13],
            fSettleBaccarat: array[idx+14], fSettleSlot: array[idx+15], fSettlePBA: array[idx+16], fSettlePBB: array[idx+17],
            iClass: array[idx+18], strID: array[idx+19], iSettleVice: array[idx+20]});
    }

    if ( list.length > 0 )
    {
        let exist = await db.SettleRecords.findOne({where:{
                strQuater:req.body.strQuater,
                strNickname:list[0].strNickname
            }});

        if ( exist != null )
        {
            res.send({result:'EXIST'});
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
            let iSettleAcc = parseInt(user.iSettleAcc); // 전웡이월
            let iSettle = parseInt(list[i].iSettle); // 분기 죽장
            let iSettleGive = parseInt(list[i].iInputSettle);   // 지급죽장
            let iSettleAccTotal = parseInt(user.iSettleAcc); // 총이월(전월죽장이월 + 죽장 - 죽장지급)

            if (user.iClass == 5) // 부본은 바로 죽장 지급(마이너스는 미지급)
            {
                if (iSettle < 0) {
                    iSettle = 0;
                }
                if (iSettleGive < 0) {
                    iSettleGive = 0;
                }
            }
            // 대본 죽장분기값(iSettle)이 마이너스일 경우 해당 금액은 모두 이월처리
            else if (parseInt(req.body.iClass) == 4) {
                if (iSettleGive < 0) {
                    iSettleGive = 0;
                }
            }

            iSettleAcc = iSettle - iSettleGive;
            iSettleAccTotal = iSettleAccTotal + iSettleAcc;

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
                    iSettleBeforeAcc:user.iSettleAcc, //전월죽장이월
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
                    strID:list[i].strID,
                    iSettleAccTotal:iSettleAccTotal,
                    iSettleVice:list[i].iSettleVice,
                    iSettleAfter:iSettleAccTotal,
                });

                // 죽장 지급시에는 1000단위 절삭
                // let iAmout = Math.floor(parseInt(iSettleGive)/10000)*10000;
                let iAmout = iSettleGive;
                await db.GTs.create(
                    {
                        eType:'GETSETTLE',
                        strTo:user.strNickname,
                        strFrom:req.body.strNickname,
                        strGroupID:user.strGroupID,
                        iAmount:iAmout,
                        iBeforeAmountTo:user.iSettle,
                        iAfterAmountTo:user.iCash,
                        iBeforeAmountFrom:from.iCash,
                        iAfterAmountFrom:from.iCash,
                        iClassTo: user.iClass,
                        iClassFrom: from.iClass,
                    });

                let iSettleUser = parseInt(user.iSettle); // 이용자가 가지고 있는 죽장
                iSettleUser = iSettleUser + iAmout; // 죽장이 실제 발생시에만 이용자에 추가
                await user.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:iSettleAccTotal});
            }
        }
    }

    console.log(list);

    if ( bFlag == true )
    {
        res.send({result:'OK'});
        return;
    }
    res.send({result:'EXIST'});
});

router.post('/request_applysettle_all', isLoggedIn, async (req, res) => {

    console.log(`/request_applysettle_all`);
    console.log(req.body);

    // 유저 체크
    if (req.user.iClass > 3 || req.user.iPermission == 100) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    // 대본사는 부본사 죽장 완료 여부 확인 필요
    if (parseInt(req.body.iClass) == 4) {
        let users = await db.Users.findAll({
            where: {
                iClass:5,
                iPermission: {
                    [Op.notIn]: [100]
                },
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }
        });

        let exist = await db.SettleRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iClass:5,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }});

        if ( users.length != exist.length ) {
            res.send({result:'FAIL', msg: '부본사 죽장 정산을 먼저 처리해 주세요.'});
            return;
        }
    }


    let array = req.body.data.split(',');

    let list = [];
    for ( let i = 0; i < array.length/24; ++ i )
    {
        let idx = i*23;
        list.push({strNickname:array[idx+0], iSettle:array[idx+1], iInputSettle:array[idx+2], iQuaterSettle:array[idx+3], iAccumulated:array[idx+4],
            iCB:array[idx+5], iCS:array[idx+6], iTotal:array[idx+7], iBWinlose: array[idx+8], iUWinlose: array[idx+9],
            iSWinlose: array[idx+10], iPWinlose: array[idx+11], iRolling: array[idx+12], iResult: array[idx+13],
            fSettleBaccarat: array[idx+14], fSettleSlot: array[idx+15], fSettlePBA: array[idx+16], fSettlePBB: array[idx+17],
            iClass: array[idx+18], strID: array[idx+19], from: array[idx+20], iSettleVice:array[idx+21], iSettleBeforeAcc:array[idx+22]});
    }

    if ( list.length > 0 )
    {
        let users = await db.Users.findAll({
            where: {
                iClass:req.body.iClass,
                iPermission: {
                    [Op.notIn]: [100]
                },
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }
        });

        let exist = await db.SettleRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iClass:req.body.iClass,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }});

        if ( users.length == exist.length )
        {
            res.send({result:'EXIST'});
            return;
        }
    }
    else
    {
        res.send({result: 'FAIL', msg: '정산할 데이터가 없습니다'});
        return;
    }


    let bFlag = true;

    let from = await db.Users.findOne({where:{strNickname:list[0].from}});

    for ( let i in list )
    {
        if (list[i].from != from.strNickname) {
            from = await db.Users.findOne({where:{strNickname:list[i].from}});
        }
        let user = await db.Users.findOne({where:{strNickname:list[i].strNickname}});
        if ( user != null )
        {
            let iSettleAcc = 0; // 죽장 이월
            let iSettle = parseInt(list[i].iSettle); // 분기 죽장
            let iSettleGive = parseInt(list[i].iInputSettle); // 지급죽장
            let iSettleBeforeAcc = parseInt(list[i].iSettleBeforeAcc); // 전월죽장이월
            let iSettleAccTotal = parseInt(user.iSettleAcc); // 총이월(전월죽장이월 + 죽장이월)
            let iPayback = 0; // 수금

            // // 부본일 경우 마이너스 죽장은 지급 안함
            // if (parseInt(req.body.iClass) == 5)
            // {
            //     if (iSettle < 0) {
            //         iSettle = 0;
            //     }
            //     if (iSettleGive < 0) {
            //         iSettleGive = 0;
            //     }
            // }
            // 대본 죽장분기값(iSettle)이 마이너스일 경우 해당 금액은 모두 이월처리
            if (parseInt(req.body.iClass) == 4 || parseInt(req.body.iClass) == 5)
            {
                if (iSettleGive < 0) {
                    iSettleGive = 0;
                }
            }

            iSettleAcc = iSettle - iSettleGive;
            if (iSettleGive > 0) {
                if (iSettleGive > iSettleBeforeAcc) {
                    iPayback = -iSettleBeforeAcc;
                } else {
                    iPayback = iSettleBeforeAcc - iSettleGive;
                }
            }

            iSettleAccTotal = iSettleAccTotal + iSettleAcc;

            let settle = await db.SettleRecords.findOne({where:{strNickname:user.strNickname, strQuater:req.body.strQuater}});

            if ( settle == null )
            {
                let iCommissionB = list[i].iCB;
                if (iCommissionB == '') {
                    iCommissionB = 0;
                }
                let iCommissionS = list[i].iCS;
                if (iCommissionS == '') {
                    iCommissionS = 0;
                }
                let iTotal = list[i].iTotal;
                if (iTotal == '') {
                    iTotal = 0;
                }
                let iRolling = list[i].iRolling;
                if (iRolling == '') {
                    iRolling = 0;
                }
                let iBWinlose = list[i].iBWinlose;
                if (iBWinlose == '') {
                    iBWinlose = 0;
                }
                let iUWinlose = list[i].iUWinlose;
                if (iUWinlose == '') {
                    iUWinlose = 0;
                }
                let iSWinlose = list[i].iSWinlose;
                if (iSWinlose == '') {
                    iSWinlose = 0;
                }
                let iPWinlose = list[i].iPWinlose;
                if (iPWinlose == '') {
                    iPWinlose = 0;
                }
                let iResult = list[i].iResult;
                if (iResult == '') {
                    iResult = 0;
                }
                let fSettleBaccarat = list[i].fSettleBaccarat;
                if (fSettleBaccarat == '') {
                    fSettleBaccarat = 0;
                }
                let fSettleSlot = list[i].fSettleSlot;
                if (fSettleSlot == '') {
                    fSettleSlot = 0;
                }
                let fSettlePBA = list[i].fSettlePBA;
                if (fSettlePBA == '') {
                    fSettlePBA = 0;
                }
                let fSettlePBB = list[i].fSettlePBB;
                if (fSettlePBB == '') {
                    fSettlePBB = 0;
                }
                let iSettleVice = list[i].iSettleVice;
                if (iSettleVice == '') {
                    iSettleVice = 0;
                }

                await db.SettleRecords.create({
                    strQuater:req.body.strQuater,
                    strNickname:list[i].strNickname,
                    strGroupID:user.strGroupID,
                    iSettle:iSettle, // 죽장 분기
                    iSettleGive:iSettleGive, // 죽장 지급
                    iSettleAcc:iSettleAcc, // 죽장이월(죽장분기-입력값)
                    iSettleBeforeAcc:iSettleBeforeAcc, // 전월죽장이월
                    iSettleOrigin:iSettle, // 죽장 분기
                    iCommissionB:iCommissionB,
                    iCommissionS:iCommissionS,
                    iTotal:iTotal,
                    iRolling:iRolling,
                    iBWinlose:iBWinlose,
                    iUWinlose:iUWinlose,
                    iSWinlose:iSWinlose,
                    iPWinlose:iPWinlose,
                    iResult:iResult,
                    fSettleBaccarat:fSettleBaccarat,
                    fSettleSlot:fSettleSlot,
                    fSettlePBA:fSettlePBA,
                    fSettlePBB:fSettlePBB,
                    iClass:list[i].iClass,
                    strID:list[i].strID,
                    iSettleAccTotal:iSettleAccTotal,
                    iSettleVice:iSettleVice,
                    iSettleAfter:iSettleAccTotal,
                    iPayback:iPayback,
                });

                // 죽장 지급시에는 1000단위 절삭
                // let iAmout = Math.floor(parseInt(iSettleGive)/10000)*10000;
                let iAmout = iSettleGive;
                await db.GTs.create(
                    {
                        eType:'GETSETTLE',
                        strTo:user.strNickname,
                        strFrom:from.strNickname,
                        strGroupID:user.strGroupID,
                        iAmount:iAmout,
                        iBeforeAmountTo:user.iSettle,
                        iAfterAmountTo:user.iCash,
                        iBeforeAmountFrom:from.iCash,
                        iAfterAmountFrom:from.iCash,
                        iClassTo: user.iClass,
                        iClassFrom: from.iClass,
                    });

                let iSettleUser = parseInt(user.iSettle); // 이용자가 가지고 있는 죽장
                iSettleUser = iSettleUser + iAmout; // 죽장이 실제 발생시에만 이용자에 추가
                await user.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:iSettleAccTotal});
            }
        }
    }

    console.log(list);

    if ( bFlag == true )
    {
        res.send({result:'OK'});
        return;
    }
    res.send({result:'EXIST'});
});

/**
 * 전체 죽장 조회
 */
router.post('/settle_all', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let iRolling = 0;
    let iSettle = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        iRolling = dbuser.iRolling;
        iSettle = dbuser.iSettle;
        strID = dbuser.strID;
    }


    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, iRolling:iRolling, iSettle:iSettle, strID:strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

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


    let overviewList = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, strQuater, dateStart, dateEnd);
    let overview = {};
    if (overviewList.length > 0) {
        overview = overviewList[0];
    }

    let overviewShare = {};

    if (dbuser.iClass <= 3) {
        // 대.부본 보관죽장*
        let settleCurrent = await IAgentSettle.CalculateOverviewSettleCurrent(req.body.strGroupID, strQuater);
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

    res.render('manage_calculation/settle_all', {iLayout:0, iHeaderFocus:6, user:user, agentinfo:agentinfo, iocount:iocount, list:[], overview:overview, overviewShare:overviewShare});
});

router.post('/request_settle_partner', isLoggedIn, async(req, res) => {

    console.log(req.body);

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;


});

let SettleViceAll = async (req, res) => {

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let list = [];
    if (req.body.iClass == 4 || req.body.iUserClass == 4) {
        // 본인것
        list = await GetSettleAll2(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, 4, 0, 1);
        // 부본 리스트
        let list2 = await GetSettleAll2(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, 5, iOffset, iLimit);
        for (let i in list2) {
            list.push(list2[i]);
        }
    } else if (req.body.iClass == 5 || req.body.iUserClass == 5) {
        list = await GetSettleAll2(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, 5, iOffset, iLimit);
    }

    let users = await db.Users.findAll({
        where: {
            iClass: req.body.iClass,
            iPermission: {
                [Op.notIn]: [100]
            },
            strGroupID: {[Op.like]: req.body.strGroupID + '%'},
        }
    });

    let exist = await db.SettleRecords.findAll({
        where: {
            strQuater: req.body.strQuater,
            iClass: req.body.iClass,
            strGroupID: {[Op.like]: req.body.strGroupID + '%'},
        }
    });

    if (users.length == exist.length) {
        res.send({
            result: 'EXIST',
            list: list,
            iRootClass: req.user.iClass,
            exist: exist,
            msg: '정상조회',
            totalCount: users.length
        });
    } else {
        res.send({
            result: 'OK',
            list: list,
            iRootClass: req.user.iClass,
            exist: exist,
            msg: '조회불가',
            totalCount: users.length
        });
    }
}

router.post('/request_settle_all', isLoggedIn, async(req, res) => {

    console.log(req.body);

    // 대본, 부본은 별도 처리(정산완료건만 조회 가능)
    // if (req.user.iClass == 4 || req.user.iClass == 5) {
    //     SettleViceAll(req, res);
    //     return;
    // }

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let list = await GetSettleAll2(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.iClass, iOffset, iLimit);

    let users = await db.Users.findAll({where: {
            iClass:req.body.iClass,
            iPermission: {
                [Op.notIn]: [100]
            },
            strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        }});

    let exist = await db.SettleRecords.findAll({where:{
            strQuater:req.body.strQuater,
            iClass:req.body.iClass,
            strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        }});

    if ( users.length == exist.length )
    {
        res.send({result:'EXIST', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: users.length});
    }
    else
    {
        res.send({result:'OK', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: users.length});
    }
});

let GetSettleAll = async (strGroupID, strQuater, dateStart, dateEnd) => {
    // strQuater
    let start = dateStart ?? '';
    let end = dateEnd ?? '';

    // 값이 없으면 현재 시간을 기준으로 설정
    if (start == '' || end == '') {
        let date = new Date();
        let iMonth = date.getMonth();

        if (date.getDate() < 16) {
            strQuater = `${iMonth + 1}-1`;
            start = ITime.get1QuaterStartDate(iMonth);
            end = ITime.get1QuaterEndDate(iMonth);
        } else {
            strQuater = `${iMonth + 1}-2`;
            start = ITime.get2QuaterStartDate(iMonth);
            end = ITime.get2QuaterEndDate(iMonth);
        }
    }

    // 본사, 대본사, 부본사 목록
    let adminList = await GetAdmins(strGroupID, strQuater);
    let proAdminList = await IAgentSettle.GetSettleClass(strGroupID, 4, strQuater, start, end);
    let viceAdminList = await IAgentSettle.GetSettleClass(strGroupID, 5, strQuater, start, end);

    let list = [];
    for (let i in adminList) {
        let obj = adminList[i];
        obj.list = GetChildrenList(obj.id, proAdminList);

        for (let j in obj.list) {
            obj.list[j].list = GetChildrenList(obj.list[j].id, viceAdminList);
        }
        list.push(obj);
    }
    return list;
}

let GetSettleAll2 = async (strGroupID, strQuater, dateStart, dateEnd, iClass, iOffset, iLimit) => {
    // strQuater
    let start = dateStart ?? '';
    let end = dateEnd ?? '';

    // 값이 없으면 현재 시간을 기준으로 설정
    if (start == '' || end == '') {
        let date = new Date();
        let iMonth = date.getMonth();

        if (date.getDate() < 16) {
            strQuater = `${iMonth + 1}-1`;
            start = ITime.get1QuaterStartDate(iMonth);
            end = ITime.get1QuaterEndDate(iMonth);
        } else {
            strQuater = `${iMonth + 1}-2`;
            start = ITime.get2QuaterStartDate(iMonth);
            end = ITime.get2QuaterEndDate(iMonth);
        }
    }

    // 파트너 목록
    let partnerList = await IAgentSettle.GetSettleClass(strGroupID, iClass, strQuater, start, end, iOffset, iLimit);

    let list = [];
    for (let i in partnerList) {
        let obj = partnerList[i];
        if (obj.iClass == 4) {
            obj.iSettleVice = GetSettleVice(obj);
        } else {
            obj.iSettleVice = 0;
        }
        list.push(obj);
    }
    return list;
}

let GetSettleVice = (obj) => {
    // 죽장 계산
    let iBTotal = parseInt(obj.iBaccaratTotalVice ?? 0) + parseInt(obj.iUnderOverTotalVice ?? 0);
    let iSTotal = parseInt(obj.iSlotTotalVice ?? 0);
    let iPBATotal = parseInt(obj.iPBATotalVice ?? 0);
    let iPBBTotal = parseInt(obj.iPBBTotalVice ?? 0);

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

let GetSettleClass = async (strGroupID, iClass, strQuater, dateStart, dateEnd) => {
    let strQuater2 = '';
    let quaterList = strQuater.split('-');
    if (quaterList[1] == '2') {
        strQuater2 = `${quaterList[0]}-1`;
    } else {
        strQuater2 = `${parseInt(quaterList[0])-1}-2`;
    }

    let list = await db.sequelize.query(`
        SELECT
        t2.strNickname, t2.strGroupID, t2.iClass,
        t2.*, t2.iSettleAcc AS iSettleAccUser, t2.iCash as iMyMoney,
        IFNULL((SELECT iSettleAccTotal FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater2}'),0) as iSettleAccTotalBefore,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%')),0) as iTotalMoney,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater}'),0) as iSettleAccQuater,
        IFNULL((SELECT iSettle FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater}'),0) as iSettleComplete,
        IFNULL((SELECT iSettleGive FROM SettleRecords WHERE strNickname =t2.strNickname AND strQuater='${strQuater}'),0) as iSettleGive,
        IFNULL((SELECT iSettleBeforeAcc FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater}'),0) as iSettleBeforeAcc,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='ROLLING' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingTranslate,
        IFNULL((SELECT sum(iAmount) FROM GTs WHERE eType='SETTLE' AND strGroupID LIKE CONCAT(t2.strGroupID, '%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSettleTranslate,
        IFNULL((SELECT iSettleOrigin FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater}'),0) as iSettleOrigin,
        IFNULL((SELECT iSettleAcc FROM SettleRecords WHERE strNickname = t2.strNickname AND strQuater='${strQuater}'),0) as iSettleAcc,
        IFNULL((SELECT sum(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
        IFNULL((SELECT sum(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
        IFNULL((SELECT sum(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
        IFNULL((SELECT sum(iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBRollingMoney,
        
        IFNULL((SELECT sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
        
        IFNULL((SELECT -sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
        IFNULL((SELECT -sum(-(iAgentBetB - iAgentWinB) + iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
        IFNULL((SELECT -sum(-(iAgentBetUO - iAgentWinUO) + iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
        IFNULL((SELECT -sum(-(iAgentBetS - iAgentWinS) + iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
        IFNULL((SELECT -sum(-(iAgentBetPB - iAgentWinPB) + iAgentRollingPBA) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBATotal,
        IFNULL((SELECT -sum(-(iAgentBetPB - iAgentWinPB) + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBBTotal,
        
        IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
        IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
        IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
        IFNULL((SELECT sum(iAgentBetPB - iAgentWinPB) FROM RecordDailyOverviews WHERE strID = t2.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPBWinLose,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE eState = 'COMPLETE' AND eType = 'INPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE eState = 'COMPLETE' AND eType = 'OUTPUT' AND strID = t2.strNickname AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
        FROM Users t2
        WHERE t2.iClass = ${iClass} AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%')
        ORDER BY t2.strGroupID ASC
    `);
    return list[0];
}

let GetChildrenList = (id, list) => {
    let results = [];
    for (let i in list) {
        if (list[i].iParentID == id) {
            results.push(list[i]);
        }
    }
    return results;
}

/**
 * 죽장정산 Overview
 */
router.post('/request_overview', isLoggedIn, async (req, res) => {

    console.log(`/request_overview`);
    console.log(req.body);

    let overviewList = await IAgentSettle.CalculateOverviewSettle(req.body.strGroupID, req.body.iClass, req.body.strQuater, req.body.dateStart, req.body.dateEnd);
    let overview = {};
    if (overviewList.length > 0) {
        overview = overviewList[0];
    }
    let settleCurrent = await IAgentSettle.CalculateOverviewSettleCurrent(req.body.strGroupID, req.body.strQuater);
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
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
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
    let iRolling = 0;
    let iSettle = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        iRolling = dbuser.iRolling;
        iSettle = dbuser.iSettle;
        strID = dbuser.strID;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, iRolling:iRolling, iSettle:iSettle, strID:strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let list = await GetUsersForCredit(parseInt(req.body.iClass)+1, req.body.strGroupID);

    res.render('manage_calculation/settle_credits', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, iocount:iocount, list:list});
});

router.post('/credits_history', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let iRolling = 0;
    let iSettle = 0;
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        iRolling = dbuser.iRolling;
        iSettle = dbuser.iSettle;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, iRolling:iRolling, iSettle:iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, strID:dbuser.strID};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

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
                    iCreditBefore: user.iSettleAcc,
                    writer: strWriter,
                    eType: eType,
                    strMemo: stMemo
                });

                let iSettleAcc = user.iSettleAcc + iCredit;

                await user.update({iSettleAccBefore:user.iSettleAcc, iSettleAcc:iSettleAcc});

                // 마지막 죽장의 입출후 금액을 갱신하기
                let settle = await db.SettleRecords.findAll({
                    where: {
                        strID: user.strID,
                    },
                    order: [['id', 'DESC']],
                    limit: 1
                });
                if (settle.length > 0) {
                    for (let i in settle) {
                        await settle[i].update({
                            iSettleAfter:iSettleAcc
                        });
                    }
                }
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

router.post('/request_listsettle', async (req, res) => {

    console.log('/request_listsettle');
    console.log(req.body);

    let list = await IAgentSettle.GetSettleList(req.body.strGroupID, req.body.strQuater);
    res.send({result:'OK', list:list});
});

router.post('/request_padmininfo', async (req, res) => {

    console.log('/request_padmininfo');
    console.log(req.body);

    let objectData = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    res.send({result:'OK', objectData:objectData});
});

module.exports = router;