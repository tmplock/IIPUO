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
const IAgentSettle = require('../implements/agent_settle4');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const {GetQuaterEndDate} = require("../implements/agent_settle3");
const {GetSubQuaterEndDate} = require("../implements/agent_settle4");
const ISettle = require("../implements/settle");

const cfCommission = 0.085; // 8.5 * 0.01

router.post('/applysettle', isLoggedIn, async (req, res) => {

    console.log(`/applysettle`);
    console.log(req.body);

    // 유저 체크
    if (req.user.iClass > 3 || req.user.iPermission == 100) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    // 죽장 대상 ID list
    let checkIdList = req.body.checkIdList.split(',');

    if (checkIdList.length == 0) {
        res.send({result:'FAIL', msg: '죽장할 대상이 없습니다'});
        return;
    }

    let strSubQuater = req.body.strSubQuater ?? '';
    let iSettleDays = req.body.iSettleDays ?? '';
    let iSettleType = req.body.iSettleType ?? '';
    let iClass = req.body.iClass;

    // id에 대한 완료 여부 확인하기
    let existList =  await IAgentSettle.CheckSettleExistIDList(strSubQuater, iSettleDays, iSettleType, checkIdList, iClass);
    if (existList.length > 0) {
        res.send({result:'FAIL', msg: '이미 죽장처리된 항목이 있습니다. 다시 조회 후 죽장 지급을 해주세요'});
        return;
    }

    let strGroupID = req.body.strGroupID ?? '';
    let strQuater = req.body.strQuater ?? '';
    let dateStart = req.body.dateStart ?? '';
    let dateEnd = req.body.dateEnd ?? '';
    let lastDate = IAgentSettle.GetSubQuaterEndDate(iSettleDays, strSubQuater);
    let strSubQuater2 = IAgentSettle.GetSubQuaterBefore(iSettleDays, strSubQuater);

    let list = [];
    // 죽장 클래스 확인
    if (req.body.iClass == 5) {
        // 죽장 목록 조회
        list = await IAgentSettle.GetSettleClass5OfIdList(strGroupID, strQuater, dateStart, dateEnd, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, checkIdList);

    } else if (req.body.iClass == 4) {
        //TODO: 부본사 죽장 완료여부 체크 로직 필요
        res.send({result: 'FAIL', msg: '부본사 죽장 정산을 먼저 처리해 주세요.'});
        return;
    }

    if (list.length == 0) {
        res.send({result: 'FAIL', msg: '죽장 적용할 대상이 없습니다'});
        return;
    }

    for (let i in list) {
        let obj = list[i];
        let data = IAgentSettle.CalSettle(obj);

        let from = await db.Users.findOne({where:{strNickname:data.strAdminNickname}});

        let user = await db.Users.findOne({where:{strNickname:data.strNickname}});

        let settle = await db.SettleRecords.findOne({where:{strID:data.strID, strSubQuater:strSubQuater, iSettleType:iSettleType, iSettleDays:iSettleDays}});

        let eType = iClass == 4 ? 'COMPLETE' : 'WAIT';

        if (settle == null) {
            await db.SettleRecords.create({
                strQuater:strQuater,
                strSubQuater:strSubQuater,
                iSettleDays:iSettleDays,
                iSettleType:iSettleType,
                strGroupID:data.strGroupID,
                strNickname:data.strNickname,
                iSettle:data.iSettle, // 죽장 분기
                iSettleGive:data.iSettleGive, // 죽장 지급
                iSettleAcc:data.iSettleAcc, // 죽장이월(죽장분기-입력값)
                iSettleBeforeAcc:data.iSettleBeforeAcc, // 전월죽장이월
                iSettleOrigin:data.iSettle, // 죽장 분기
                iCommissionB:data.iCommissionB,
                iCommissionS:data.iCommissionS,
                iTotal:data.iTotal,
                iBWinlose:data.iBaccaratWinLose,
                iUWinlose:data.iUnderOverWinLose,
                iSWinlose:data.iSlotWinLose,
                iResult:data.iResult,
                fSettleBaccarat:data.fSettleBaccarat,
                fSettleSlot:data.fSettleSlot,
                iClass:data.iClass,
                strID:data.strID,
                iSettleAccTotal:data.iSettleAccTotal,
                iSettleVice:data.iSettleVice,
                iSettleAfter:data.iSettleAccTotal,
                iPayback:data.iPayback,
                eType: eType
            });

            // iClass4 일 경우에는 하부에 대한 죽장도 완료처리할 것
            await db.SettleRecords

            // 죽장 지급시에는 1000단위 절삭
            // let iAmout = Math.floor(parseInt(iSettleGive)/10000)*10000;
            let iAmout = data.iSettleGive;
            await db.GTs.create(
                {
                    eType:'GETSETTLE',
                    strTo:data.strNickname,
                    strFrom:data.strAdminNickname,
                    strGroupID:data.strGroupID,
                    iAmount:iAmout,
                    iBeforeAmountTo:user.iSettle,
                    iAfterAmountTo:user.iCash,
                    iBeforeAmountFrom:from.iCash,
                    iAfterAmountFrom:from.iCash,
                    iClassTo: user.iClass,
                    iClassFrom: from.iClass,
                });

            // 입금처리
            if (iAmout > 0) {
                const parents = await IAgent.GetParentList(user.strGroupID, user.iClass);
                let strAdminNickname = parents.strAdmin;
                let strPAdminNickname = parents.strPAdmin;
                let strVAdminNickname = parents.strVAdmin;
                await db.Inouts.create({
                    strID:user.strNickname,
                    strAdminNickname:strAdminNickname,
                    strPAdminNickname:strPAdminNickname,
                    strVAdminNickname:strVAdminNickname,
                    strAgentNickname:'',
                    strShopNickname:'',
                    iClass:user.iClass,
                    strName:user.strNickname,
                    strGroupID:user.strGroupID,
                    strAccountOwner:'관리자죽장지급',
                    strBankName:'',
                    strAccountNumber:'',
                    iPreviousCash:user.iCash,
                    iAmount:iAmout,
                    eType:'INPUT',
                    eState:'COMPLETE',
                    completedAt:new Date(),
                });
            }

            let iSettleUser = parseFloat(user.iSettle); // 이용자가 가지고 있는 죽장
            iSettleUser = iSettleUser + iAmout; // 죽장이 실제 발생시에만 이용자에 추가
            await db.Users.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:data.iSettleAccTotal}, {where:{strNickname:data.strNickname}});
        }




    }



    res.send({result:'OK', msg:'죽장완료'});
});


router.post('/request_settle_list', isLoggedIn, async(req, res) => {

    console.log(req.body);

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let strSubQuater = req.body.strSubQuater ?? '';
    let iSettleDays = req.body.iSettleDays ?? -1;
    let iSettleType = req.body.iSettleType ?? -1;
    let lastDate = IAgentSettle.GetSubQuaterEndDate(iSettleDays, strSubQuater);

    // 입력값 체크
    if (strSubQuater == '' || iSettleDays == -1 || iSettleType == -1 || lastDate == '') {
        res.send({result:'FAIL', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회실패(-1)', totalCount: 0});
        return;
    }
    let start = req.body.dateStart ?? '';
    let end = req.body.dateEnd ?? '';
    if (start == '' || end == '') {
        res.send({result:'FAIL', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회기간 오류(-1)', totalCount: 0});
        return;
    }

    let strSubQuater2 = IAgentSettle.GetSubQuaterBefore(iSettleDays, strSubQuater);

    // 죽장 완료 ids
    let exist = await IAgentSettle.GetSettleExistIDList(req.body.strSubQuater, req.body.iSettleDays, req.body.iSettleType, req.body.iClass);

    let list = await IAgentSettle.GetSettleList(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.iClass, iOffset, iLimit, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, exist);
    res.send({result:'OK', list:list, iRootClass: req.user.iClass, msg: '정상조회'});
});

router.post('/request_settle_exist', isLoggedIn, async(req, res) => {

    console.log(req.body);

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let strSubQuater = req.body.strSubQuater ?? '';
    let iSettleDays = req.body.iSettleDays ?? -1;
    let iSettleType = req.body.iSettleType ?? -1;
    let lastDate = IAgentSettle.GetSubQuaterEndDate(iSettleDays, strSubQuater);
    // 입력값 체크
    if (strSubQuater == '' || iSettleDays == -1 || iSettleType == -1 || lastDate == '') {
        res.send({result:'FAIL', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회실패(-1)', totalCount: 0});
        return;
    }
    let start = req.body.dateStart ?? '';
    let end = req.body.dateEnd ?? '';
    if (start == '' || end == '') {
        res.send({result:'FAIL', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회기간 오류(-1)', totalCount: 0});
        return;
    }

    let strSubQuater2 = IAgentSettle.GetSubQuaterBefore(iSettleDays, strSubQuater);
    let list = await IAgentSettle.GetSettleExistList(req.body.strGroupID, req.body.iClass, req.body.strQuater, req.body.dateStart, req.body.dateEnd, lastDate, strSubQuater, strSubQuater2, iSettleDays, iSettleType, iLimit, iOffset);
    res.send({result:'OK', list:list, iRootClass: req.user.iClass, msg: '정상조회'});
});

router.post('/request_overview3', isLoggedIn, async (req, res) => {

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

router.post('/request_savememo', isLoggedIn, async (req, res) => {
    if (req.user.iClass > 3 || req.user.iPermission != 0) {
        res.send({result:'Error', msg: '처리실패(-1)'});
        return;
    }

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user != null )
    {
        await db.Users.update({strSettleMemo:req.body.strValue}, {where:{strNickname:req.body.strNickname}});
        res.send({result:'OK', msg:'처리성공'});
    }
    else
        res.send({result:'Error', msg:'처리실패(-2)'});
});

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
            let fSettleSlot = ret.data[i].fSettleSlot ?? 0;
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
                        parent.fSettleBaccarat < fSettleBaccarat ||
                        parent.fSettleSlot < fSettleSlot
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
                                child.fSettleBaccarat > fSettleBaccarat ||
                                child.fSettleSlot > fSettleSlot
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
                        fSettleSlot:fSettleSlot,
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

module.exports = router;