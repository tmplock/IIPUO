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

const cfCommission = 0.085; // 8.5 * 0.01

router.post('/request_apply_sub_settle', isLoggedIn, async (req, res) => {

    console.log(`/request_apply_sub_settle`);
    console.log(req.body);

    // 유저 체크
    if (req.user.iClass > 3 || req.user.iPermission == 100) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    // 부본사 죽장 완료 여부 확인 필요
    let exist = await db.SettleRecords.findAll({where:{
            strQuater:req.body.strQuater,
            iClass:5,
            strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        }, order: [['createdAt', 'DESC']]
    });

    const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID);

    if ( targetUserCount > exist.length ) {
        res.send({result:'FAIL', msg: '부본사 죽장 정산을 먼저 처리해 주세요.'});
        return;
    }

    let list = [];
    let array = req.body.data.split(',');
    for ( let i = 0; i < array.length/11; ++ i )
    {
        let idx = i*11;
        list.push({strNickname:array[idx+0], strID:array[idx+1],
            fSettleBaccaratViceAdmin:parseFloat(array[idx+2]), fSettleSlotViceAdmin:parseFloat(array[idx+3]),
            iBWinlose:parseFloat(array[idx+4]), iUWinlose:parseFloat(array[idx+5]), iSWinlose:parseFloat(array[idx+6]),
            iCommissionB:parseInt(array[idx+7]), iCommissionS: parseInt(array[idx+8]),
            iSettleViceAdmin: parseInt(array[idx+9]), iTotalViceAdmin: parseInt(array[idx+10])});
    }

    if ( list.length > 0 )
    {
        let exist = await db.SettleSubRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iClass:5,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID);

        if ( exist.length > 0 && targetUserCount > exist.length )
        {
            res.send({result:'EXIST'});
            return;
        }
    }
    else
    {
        res.send({result: 'FAIL', msg: '계산 적용할 데이터가 없습니다'});
        return;
    }


    let bFlag = true;

    for (let i in list) {
        let obj = list[i];
        let settle = GetSettleFromList(exist, obj.strID);
        if (settle != null) {
            let subSettle = await db.SettleSubRecords.findOne({where:{
                    rId:settle.id, strQuater:settle.strQuater,
                }});
            if (subSettle == null) {
                await db.SettleSubRecords.create({
                    rId:settle.id,
                    strQuater:settle.strQuater,
                    iClass:settle.iClass,
                    strGroupID:settle.strGroupID,
                    fSettleBaccarat:settle.fSettleBaccarat,
                    fSettleSlot:settle.fSettleSlot,
                    iTotal:settle.iTotal,
                    iSettle:settle.iSettle,
                    fSettleBaccaratViceAdmin:obj.fSettleBaccaratViceAdmin ?? 0,
                    fSettleSlotViceAdmin:obj.fSettleSlotViceAdmin ?? 0,
                    iBWinlose:obj.iBWinlose ?? 0,
                    iUWinlose:obj.iUWinlose ?? 0,
                    iSWinlose:obj.iSWinlose ?? 0,
                    iCommissionB:obj.iCommissionB ?? 0,
                    iCommissionS:obj.iCommissionS ?? 0,
                    iSettleViceAdmin:obj.iSettleViceAdmin ?? 0,
                    iTotalViceAdmin:obj.iTotalViceAdmin ?? 0,
                });
            } else {
                await db.SettleSubRecords.update({
                    rId:settle.id,
                    strQuater:settle.strQuater,
                    iClass:settle.iClass,
                    strGroupID:settle.strGroupID,
                    fSettleBaccarat:settle.fSettleBaccarat,
                    fSettleSlot:settle.fSettleSlot,
                    iTotal:settle.iTotal,
                    iSettle:settle.iSettle,
                    fSettleBaccaratViceAdmin:obj.fSettleBaccaratViceAdmin ?? 0,
                    fSettleSlotViceAdmin:obj.fSettleSlotViceAdmin ?? 0,
                    iBWinlose:obj.iBWinlose ?? 0,
                    iUWinlose:obj.iUWinlose ?? 0,
                    iSWinlose:obj.iSWinlose ?? 0,
                    iCommissionB:obj.iCommissionB ?? 0,
                    iCommissionS:obj.iCommissionS ?? 0,
                    iSettleViceAdmin:obj.iSettleViceAdmin ?? 0,
                    iTotalViceAdmin:obj.iTotalViceAdmin ?? 0,
                }, {
                    where: { id: subSettle.id }
                });
            }
        } else {
            res.send({result:'FAIL', msg: `부본사(${obj.strNickname}) 죽장 정산을 먼저 처리해 주세요.`});
            return;
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

let GetSettleFromList = (settleList, strID) => {
    for (let i in settleList) {
        let settle = settleList[i];
        // 동일 부본 체크
        if (settle.strID == strID) {
            return settle;
        }
    }
    return null;
}

router.post('/request_settle_cal', isLoggedIn, async(req, res) => {

    console.log(req.body);

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let exist = await db.SettleRecords.findAll({where:{
            strQuater:req.body.strQuater,
            iClass:req.body.iClass,
            strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        }, order: [['createdAt', 'DESC']]
    });

    let lastDate = IAgentSettle.GetQuaterEndDate(req.body.strQuater);

    let list = await GetSettleCalulation(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.iClass, iOffset, iLimit, lastDate);

    const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, req.body.iClass, req.body.strGroupID);

    if (exist.length > 0 && targetUserCount > exist.length )
    {
        res.send({result:'EXIST', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount});
    }
    else
    {
        res.send({result:'OK', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount});
    }
});

let GetSettleCalulation = async (strGroupID, strQuater, dateStart, dateEnd, iClass, iOffset, iLimit, lastDate) => {
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
    let partnerList = await GetSettlePartnerList(strGroupID, iClass, strQuater, start, end, iOffset, iLimit, lastDate);
    return partnerList;
}

/**
 * 죽장 대상 목록
 */
let GetSettlePartnerList = async (strGroupID, iClass, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate) => {
    let offset = parseInt(iOffset ?? 0);
    let limit = parseInt(iLimit ?? 30);

    let lastDateQuery = '';
    let date = lastDate ?? '';
    if (date.length > 0) {
        if (iClass == 4) {
            lastDateQuery = `AND t4.createdAt < '${date}'`;
        } else if (iClass == 5) {
            lastDateQuery = `AND t5.createdAt < '${date}'`;
        }
    }

    let strQuater2 = '';
    let quaterList = strQuater.split('-');
    if (quaterList[1] == '2') {
        strQuater2 = `${quaterList[0]}-1`;
    } else {
        let month = parseInt(quaterList[0])-1;
        if (month == 0) {
            strQuater2 = `12-2`;
        } else {
            strQuater2 = `${parseInt(quaterList[0])-1}-2`;
        }
    }

    let list = await db.sequelize.query(`
            SELECT
                t3.strID AS strID3, t3.strNickname AS strNickname3,
                t4.strID AS strID4, t4.strNickname AS strNickname4,
                t4.fBaccaratR AS fBaccaratR4, t4.fSlotR AS fSlotR4, t4.fUnderOverR AS fUnderOverR4,
                t4.fSettleBaccarat AS fSettleBaccarat4, t4.fSettleSlot AS fSettleSlot4,
                
                t5.strID AS strID, t5.strNickname AS strNickname, t5.strGroupID AS strGroupID, t5.iClass, t5.strSettleMemo,
                t5.fBaccaratR AS fBaccaratR, t5.fSlotR AS fSlotR, t5.fUnderOverR AS fUnderOverR,
                t5.fSettleBaccarat AS fSettleBaccarat, t5.fSettleSlot AS fSettleSlot,               
                IFNULL(t5.fCommission, ${cfCommission}) AS fCommission, 
                IFNULL((SELECT COUNT(id) FROM SettleRecords WHERE strID = t5.strID AND strQuater='${strQuater}'),0) as settleCount,
                IFNULL((SELECT sum(iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratRollingMoney,
                IFNULL((SELECT sum(iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverRollingMoney,
                IFNULL((SELECT sum(iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotRollingMoney,
                IFNULL((SELECT sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iMyRollingMoney,
                IFNULL((SELECT -sum(iAgentRollingB + iAgentRollingUO + iAgentRollingS + iAgentRollingPBA + iAgentRollingPBB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iRollingMoney,
                
                IFNULL((SELECT sum(iAgentBetB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccarat,
                IFNULL((SELECT sum(iAgentBetUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOver,
                IFNULL((SELECT sum(iAgentBetS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlot,
                
                IFNULL((SELECT -sum(-(iAgentBetB - iAgentWinB) + iAgentRollingB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratTotal,
                IFNULL((SELECT -sum(-(iAgentBetUO - iAgentWinUO) + iAgentRollingUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverTotal,
                IFNULL((SELECT -sum(-(iAgentBetS - iAgentWinS) + iAgentRollingS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotTotal,
                IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBaccaratWinLose,
                IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUnderOverWinLose,
                IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = t5.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSlotWinLose,
                sr.iSettle AS iSettleVice
            FROM Users t5
                LEFT JOIN Users t4 ON t4.id = t5.iParentID
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
                LEFT JOIN (
                    SELECT * FROM SettleRecords WHERE strQuater='${strQuater}' 
                ) sr ON sr.strID = t5.strID  
            WHERE t5.iClass = ${iClass} AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%')
            ${lastDateQuery}
            ORDER BY t5.strGroupID ASC
            LIMIT ${limit}
            OFFSET ${offset}
        `);
    return list[0];
}

/**
 * 부본 합계 구하기
 */
let GetSettleVice = (obj) => {
    // 죽장 계산
    let iBTotal = parseFloat(obj.iBaccaratTotalVice ?? 0) + parseFloat(obj.iUnderOverTotalVice ?? 0);
    let iSTotal = parseFloat(obj.iSlotTotalVice ?? 0);
    let iPBATotal = parseFloat(obj.iPBATotalVice ?? 0);
    let iPBBTotal = parseFloat(obj.iPBBTotalVice ?? 0);

    return iBTotal + iSTotal + iPBATotal + iPBBTotal;
}

router.post('/settle_cal', async (req, res) => {
    console.log('settle_cal');
    console.log(req.body);

    let strQuater = req.body.strQuater ?? '';
    let dateQuaterStart = req.body.dateQuaterStart ?? '';
    let dateQuaterEnd = req.body.dateQuaterEnd ?? '';

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    res.render('manage_calculation/settle_cal', {iLayout:9, iHeaderFocus:0, user:user, list:[], strQuater:strQuater, dateQuaterStart:dateQuaterStart, dateQuaterEnd:dateQuaterEnd});
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
        let exist = await db.SettleRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iClass:5,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID);

        if ( targetUserCount > exist.length ) {
            res.send({result:'FAIL', msg: '부본사 죽장 정산을 먼저 처리해 주세요.'});
            return;
        }
    }

    // 죽장 계산 완료 여부 확인
    if (parseInt(req.body.iClass) == 4) {
        let exist = await db.SettleSubRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iClass:5,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID);

        if ( targetUserCount > exist.length ) {
            res.send({result:'FAIL', msg: '죽장 계산을 먼저 처리해 주세요.'});
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
        let exist = await db.SettleRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iClass:req.body.iClass,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, req.body.iClass, req.body.strGroupID);

        if ( exist.length > 0 && targetUserCount == exist.length )
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
            let iSettle = parseFloat(list[i].iSettle); // 분기 죽장
            let iSettleGive = parseFloat(list[i].iInputSettle); // 지급죽장
            let iSettleBeforeAcc = parseFloat(list[i].iSettleBeforeAcc); // 전월죽장이월
            let iSettleAccTotal = parseFloat(user.iSettleAcc); // 총이월(전월죽장이월 + 죽장이월)
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
            } else if (iSettle > 0) {
                // 죽장은 발생했지만 수금할 금액이 많아서 죽장 지급이 없는 경우(이월금액 - 이번분기 죽장값)
                iPayback = iSettleBeforeAcc - iSettle;
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
                //await user.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:iSettleAccTotal});
                await db.Users.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:iSettleAccTotal}, {where:{strNickname:list[i].strNickname}});
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



module.exports = router;