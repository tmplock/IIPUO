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
    let exist = await IAgentSettle.GetSettleExistList(req.body.strGroupID, req.body.strQuater, 5, req.body.iSettleDays, req.body.iSettleType);
    // let exist = await db.SettleRecords.findAll({where:{
    //         strQuater:req.body.strQuater,
    //         iClass:5,
    //         strGroupID:{[Op.like]:req.body.strGroupID+'%'},
    //         iSettleDays:req.body.iSettleDays,
    //         iSettleType:req.body.iSettleType,
    //     }, order: [['createdAt', 'DESC']]
    // });

    const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID, req.body.iSettleDays, req.body.iSettleType);

    if ( exist.length == 0 || targetUserCount > exist.length ) {
        res.send({result:'FAIL', msg: '부본사 죽장 정산을 먼저 처리해 주세요.'});
        return;
    }

    let list = [];
    let array = req.body.data.split(',');
    for ( let i = 0; i < array.length/14; ++ i )
    {
        let idx = i*14;
        list.push({strNickname:array[idx+0], strID:array[idx+1],
            fSettleBaccaratViceAdmin:parseFloat(array[idx+2]), fSettleSlotViceAdmin:parseFloat(array[idx+3]),
            iBWinlose:parseFloat(array[idx+4]), iUWinlose:parseFloat(array[idx+5]), iSWinlose:parseFloat(array[idx+6]),
            iCommissionB:parseInt(array[idx+7]), iCommissionS: parseInt(array[idx+8]),
            iSettleViceAdmin: parseInt(array[idx+9]), iSettleVice:parseFloat(array[idx+10]),
            iTotalViceAdmin: parseFloat(array[idx+11]), iTotal: parseFloat(array[idx+12]),
            iRolling: parseFloat(array[idx + 13])
        });
    }

    if ( list.length > 0 )
    {
        // let exist = await IAgentSettle.GetSubSettleExistList(req.body.strGroupID, req.body.strQuater, 5, req.body.iSettleDays, req.body.iSettleType);
        // // let exist = await db.SettleSubRecords.findAll({where:{
        // //         strQuater:req.body.strQuater,
        // //         iClass:5,
        // //         strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        // //         iSettleDays:req.body.iSettleDays,
        // //         iSettleType:req.body.iSettleType,
        // //     }, order: [['createdAt', 'DESC']]
        // // });
        //
        // const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID, req.body.iSettleDays, req.body.iSettleType);
        //
        // if ( exist > 0 && targetUserCount == exist.length )
        // {
        //     res.send({result:'EXIST'});
        //     return;
        // }
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
                    strID:obj.strID,
                    iClass:settle.iClass,
                    strGroupID:settle.strGroupID,
                    fSettleBaccaratViceAdmin:obj.fSettleBaccaratViceAdmin ?? 0,
                    fSettleSlotViceAdmin:obj.fSettleSlotViceAdmin ?? 0,
                    fSettleBaccarat:settle.fSettleBaccarat,
                    fSettleSlot:settle.fSettleSlot,
                    iTotal:settle.iTotal,
                    iRolling:obj.iRolling ?? 0,
                    iBWinlose:obj.iBWinlose ?? 0,
                    iUWinlose:obj.iUWinlose ?? 0,
                    iSWinlose:obj.iSWinlose ?? 0,
                    iSettle:settle.iSettle,
                    iSettleVice:settle.iSettleVice,
                    iCommissionB:obj.iCommissionB ?? 0,
                    iCommissionS:obj.iCommissionS ?? 0,
                    iSettleViceAdmin:obj.iSettleViceAdmin ?? 0,
                    iTotalViceAdmin:obj.iTotalViceAdmin ?? 0,
                    iSettleDays:req.body.iSettleDays,
                    iSettleType:req.body.iSettleType,
                });
            } else {
                await db.SettleSubRecords.update({
                    rId:settle.id,
                    strQuater:settle.strQuater,
                    strID:obj.strID,
                    iClass:settle.iClass,
                    strGroupID:settle.strGroupID,
                    fSettleBaccaratViceAdmin:obj.fSettleBaccaratViceAdmin ?? 0,
                    fSettleSlotViceAdmin:obj.fSettleSlotViceAdmin ?? 0,
                    fSettleBaccarat:settle.fSettleBaccarat,
                    fSettleSlot:settle.fSettleSlot,
                    iTotal:settle.iTotal,
                    iRolling:obj.iRolling ?? 0,
                    iBWinlose:obj.iBWinlose ?? 0,
                    iUWinlose:obj.iUWinlose ?? 0,
                    iSWinlose:obj.iSWinlose ?? 0,
                    iSettle:settle.iSettle,
                    iSettleVice:settle.iSettleVice,
                    iCommissionB:obj.iCommissionB ?? 0,
                    iCommissionS:obj.iCommissionS ?? 0,
                    iSettleViceAdmin:obj.iSettleViceAdmin ?? 0,
                    iTotalViceAdmin:obj.iTotalViceAdmin ?? 0,
                    iSettleDays:req.body.iSettleDays,
                    iSettleType:req.body.iSettleType,
                }, {
                    where: { id: subSettle.id }
                });
            }
        } else {
            res.send({result:'FAIL', msg: `부본사(${obj.strNickname}) 죽장 정산을 먼저 처리해 주세요.`});
            return;
        }
    }

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
    try {
        let iLimit = parseInt(req.body.iLimit);
        let iPage = parseInt(req.body.iPage);
        let iOffset = (iPage-1) * iLimit;
        let strQuater = req.body.strQuater;
        let iSettleDays = req.body.iSettleDays;
        let iSettleType = req.body.iSettleType;


        // let exist = await db.SettleSubRecords.findAll({where:{
        //         strQuater:req.body.strQuater,
        //         iClass:req.body.iClass,
        //         strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        //         // iSettleDays: iSettleDays,
        //         // iSettleType: iSettleType,
        //     }, order: [['createdAt', 'DESC']]
        // });
        let exist = await IAgentSettle.GetSubSettleExistList(req.body.strGroupID, req.body.strQuater, req.body.iClass, iSettleDays, iSettleType);

        let lastDate = IAgentSettle.GetQuaterEndDate(strQuater, iSettleDays);

        let list = await GetSettleCalulation(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.iClass, iOffset, iLimit, lastDate, iSettleDays, iSettleType);

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, req.body.iClass, req.body.strGroupID, iSettleDays, iSettleType);

        if (exist.length > 0 && targetUserCount == exist.length)
        {
            res.send({result:'EXIST', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount, bEnableSettle:false});
        }
        else
        {
            // 죽장 가능 여부
            let bEnableSettle = IAgentSettle.IsSettleEnableDate(req.body.strQuater, iSettleDays);
            if (exist.length == list.length) {
                bEnableSettle = false;
            }
            res.send({result:'OK', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount, bEnableSettle:bEnableSettle});
        }
    } catch (err) {
        console.log(err.toString());
        res.send({result:'ERROR', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회에러', totalCount: 0, bEnableSettle:false});
    }
});

let GetSettleCalulation = async (strGroupID, strQuater, dateStart, dateEnd, iClass, iOffset, iLimit, lastDate, iSettleDays, iSettleType) => {
    // strQuater
    let start = dateStart ?? '';
    let end = dateEnd ?? '';

    // 값이 없으면 현재 시간을 기준으로 설정
    if (start == '' || end == '') {
        // let date = new Date();
        // let iMonth = date.getMonth();
        //
        // if (date.getDate() < 16) {
        //     strQuater = `${iMonth + 1}-1`;
        //     start = ITime.get1QuaterStartDate(iMonth);
        //     end = ITime.get1QuaterEndDate(iMonth);
        // } else {
        //     strQuater = `${iMonth + 1}-2`;
        //     start = ITime.get2QuaterStartDate(iMonth);
        //     end = ITime.get2QuaterEndDate(iMonth);
        // }
        return [];
    }

    // 파트너 목록
    let partnerList = await GetSettlePartnerList(strGroupID, iClass, strQuater, start, end, iOffset, iLimit, lastDate, iSettleDays, iSettleType);
    return partnerList;
}

/**
 * 죽장 대상 목록
 */
let GetSettlePartnerList = async (strGroupID, iClass, strQuater, dateStart, dateEnd, iOffset, iLimit, lastDate, iSettleDays, iSettleType) => {
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

    let strQuater2 = IAgentSettle.GetBeforeQuater(strQuater, iSettleDays);
    // let subQuery = `AND t5.iSettleDays = ${iSettleDays} AND t5.iSettleType = ${iSettleType}`;
    let subQuery = '';
    // 총본에서 조회할 경우
    if (strGroupID.length == 5) {
        subQuery = `AND t4.iSettleDays = ${iSettleDays} AND t4.iSettleType = ${iSettleType}`;
    }
    let list = await db.sequelize.query(`
            SELECT
                t3.strID AS strID3, t3.strNickname AS strNickname3,
                t4.strID AS strID4, t4.strNickname AS strNickname4,
                t4.fBaccaratR AS fBaccaratR4, t4.fSlotR AS fSlotR4, t4.fUnderOverR AS fUnderOverR4,
                t4.fSettleBaccarat AS fSettleBaccarat4, t4.fSettleSlot AS fSettleSlot4,
                t4.iSettleCommission,
                
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
                CASE 
                    WHEN sub.id IS NOT NULL THEN sub.iSettleVice
                    ELSE sr.iSettle
                END AS iSettleVice
            FROM Users t5
                LEFT JOIN Users t4 ON t4.id = t5.iParentID
                LEFT JOIN Users t3 ON t3.id = t4.iParentID
                LEFT JOIN (
                    SELECT * FROM SettleRecords WHERE strQuater='${strQuater}' 
                ) sr ON sr.strID = t5.strID
                LEFT JOIN (
                    SELECT * FROM SettleSubRecords WHERE strQuater='${strQuater}'
                ) sub ON sub.strID = t5.strID
            WHERE t5.iClass = ${iClass} AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%') 
            ${subQuery}
            ${lastDateQuery}
            ORDER BY strNickname3 ASC, strNickname4 ASC, t5.strGroupID ASC
            LIMIT ${limit}
            OFFSET ${offset}
        `);
    return list[0];
}

router.post('/settle_cal', isLoggedIn, async (req, res) => {
    console.log('settle_cal');
    console.log(req.body);

    let strQuater = req.body.strQuater ?? '';
    let dateQuaterStart = req.body.dateQuaterStart ?? '';
    let dateQuaterEnd = req.body.dateQuaterEnd ?? '';
    let iSettleDays = 15;
    let iSettleType = 0;

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    if (dbuser.iClass < 4) {
        iSettleDays = req.body.iSettleDays;
        iSettleType = req.body.iSettleType;
    } else {
        const padminUser = await IAgent.GetPAdminInfo(dbuser);
        iSettleDays = padminUser.iSettleDays;
        iSettleType = padminUser.iSettleType;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, iSettleDays: iSettleDays, iSettleType:iSettleType};

    res.render('manage_calculation/settle_cal', {iLayout:9, iHeaderFocus:0, user:user, list:[], strQuater:strQuater, dateQuaterStart:dateQuaterStart, dateQuaterEnd:dateQuaterEnd});
});


router.post('/settle_cal_history', isLoggedIn, async (req, res) => {
    console.log('settle_cal_history');
    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:dbuser.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    let strQuater = req.body.strQuater;
    let iSettleDays = 15;
    let iSettleType = 0;
    const padmin = await IAgent.GetPAdminInfo(dbuser);
    if (padmin == null) {
        res.render('manage_calculation/settle_cal_history', {iLayout:9, iHeaderFocus:0, user:user, list:[], strQuater:strQuater});
        return;
    }
    iSettleDays = padmin.iSettleDays;
    iSettleType = padmin.iSettleType;

    if (iSettleType == 1) {
        let dateStart = IAgentSettle.GetQuaterStartDate(strQuater, iSettleDays);
        let dateEnd = IAgentSettle.GetQuaterEndDate(strQuater, iSettleDays);
        let [list] = await db.sequelize.query(`
            SELECT s.*, u.strNickname, 
                    IFNULL((SELECT sum(iAgentBetB - iAgentWinB) FROM RecordDailyOverviews WHERE strID = s.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBWinlose,
                    IFNULL((SELECT sum(iAgentBetUO - iAgentWinUO) FROM RecordDailyOverviews WHERE strID = s.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iUWinlose,
                    IFNULL((SELECT sum(iAgentBetS - iAgentWinS) FROM RecordDailyOverviews WHERE strID = s.strID AND date(strDate) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iSWinlose
            FROM SettleRecords s
            LEFT JOIN Users u ON u.strID = s.strID
            WHERE s.strQuater = '${req.body.strQuater}'
              AND s.iSettleDays = ${iSettleDays}
              AND s.iSettleType = ${iSettleType} 
              AND s.iClass = ${parseInt(req.body.iClass) + 1} 
              AND s.strGroupID LIKE '${req.body.strGroupID}%'
        `);
        let newList = [];
        for (let i in list) {
            let obj = list[i];
            obj.iTotalViceAdmin = obj.iTotal - obj.iSettleVice;
            newList.push(obj);
        }
        res.render('manage_calculation/settle_cal_history_reset', {iLayout:9, iHeaderFocus:0, user:user, list:newList, strQuater:strQuater});
    } else {
        let list = await db.sequelize.query(`
            SELECT ss.*, u.strNickname
            FROM SettleSubRecords ss
            LEFT JOIN Users u ON u.strID = ss.strID
            WHERE ss.strQuater = '${strQuater}'
              AND ss.iSettleDays = ${iSettleDays}
              AND ss.iSettleType = ${iSettleType} 
              AND ss.iClass = ${parseInt(req.body.iClass) + 1} 
              AND ss.strGroupID LIKE '${req.body.strGroupID}%'
        `);
        res.render('manage_calculation/settle_cal_history', {iLayout:9, iHeaderFocus:0, user:user, list:list[0], strQuater:strQuater});
    }
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
                iSettleDays:req.body.iSettleDays,
                iSettleType:req.body.iSettleType,
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID, req.body.iSettleDays, req.body.iSettleType);

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
                iSettleDays:req.body.iSettleDays,
                iSettleType:req.body.iSettleType,
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, 5, req.body.strGroupID, req.body.iSettleDays, req.body.iSettleType);

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
                iSettleDays:req.body.iSettleDays,
                iSettleType:req.body.iSettleType,
            }, order: [['createdAt', 'DESC']]
        });

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, req.body.iClass, req.body.strGroupID, req.body.iSettleDays, req.body.iSettleType);

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

            // 리셋일 경우 마이너스 죽장은 지급 안함
            if (req.body.iSettleType == 1)
            {
                if (iSettle < 0) {
                    iSettle = 0;
                }
                if (iSettleGive < 0) {
                    iSettleGive = 0;
                }
            }

            // 대본 죽장분기값(iSettle)이 마이너스일 경우 해당 금액은 모두 이월처리
            if (parseInt(req.body.iClass) == 4 || parseInt(req.body.iClass) == 5)
            {
                if (iSettleGive < 0) {
                    iSettleGive = 0;
                }
            }

            iSettleAcc = iSettle - iSettleGive;

            // 수금 계산
            // 죽장 지급액이 있을 경우 && 죽장 이월금액이 마이너스일 경우
            if (iSettleGive > 0) {
                // 수금액은 지난달 금액이 수금액임(죽장값이 더 클 경우)
                if (iSettleGive > Math.abs(iSettleBeforeAcc)) {
                    iPayback = -iSettleBeforeAcc;
                } else {
                    // 수금액은 이번달 지급한 죽장값이 수금액임(수금액이 더 클 경우)
                    iPayback = iSettleGive;
                }
            } else if (iSettle > 0) {
                // 수금액은 이번달 발생한 죽장값이 수금액임
                iPayback = iSettle;
            }

            iSettleAccTotal = iSettleAccTotal + iSettleAcc;

            let settle = await db.SettleRecords.findOne({where:{strNickname:user.strNickname, strQuater:req.body.strQuater, iSettleDays: req.body.iSettleDays, iSettleType: req.body.iSettleType}});

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
                    iSettleDays: req.body.iSettleDays,
                    iSettleType: req.body.iSettleType,
                });

                // 죽장 지급시에는 1000단위 절삭
                // let iAmout = iSettleGive;
                // await db.GTs.create(
                //     {
                //         eType:'GETSETTLE',
                //         strTo:user.strNickname,
                //         strFrom:from.strNickname,
                //         strGroupID:user.strGroupID,
                //         iAmount:iAmout,
                //         iBeforeAmountTo:user.iSettle,
                //         iAfterAmountTo:user.iCash,
                //         iBeforeAmountFrom:from.iCash,
                //         iAfterAmountFrom:from.iCash,
                //         iClassTo: user.iClass,
                //         iClassFrom: from.iClass,
                //     });
                //
                // // 입금처리
                // if (iAmout > 0) {
                //     const parents = await IAgent.GetParentList(user.strGroupID, user.iClass);
                //     let strAdminNickname = parents.strAdmin;
                //     let strPAdminNickname = parents.strPAdmin;
                //     let strVAdminNickname = parents.strVAdmin;
                //     await db.Inouts.create({
                //         strID:user.strNickname,
                //         strAdminNickname:strAdminNickname,
                //         strPAdminNickname:strPAdminNickname,
                //         strVAdminNickname:strVAdminNickname,
                //         strAgentNickname:'',
                //         strShopNickname:'',
                //         iClass:user.iClass,
                //         strName:user.strNickname,
                //         strGroupID:user.strGroupID,
                //         strAccountOwner:'관리자죽장지급',
                //         strBankName:'',
                //         strAccountNumber:'',
                //         iPreviousCash:user.iCash,
                //         iAmount:iAmout,
                //         eType:'INPUT',
                //         eState:'COMPLETE',
                //         completedAt:new Date(),
                //     });
                // }
                //
                // let iSettleUser = parseFloat(user.iSettle); // 이용자가 가지고 있는 죽장
                // iSettleUser = iSettleUser + iAmout; // 죽장이 실제 발생시에만 이용자에 추가
                // await db.Users.update({iSettle:iSettleUser, iSettleAccBefore: user.iSettleAcc, iSettleAcc:iSettleAccTotal}, {where:{strNickname:list[i].strNickname}});
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

router.post('/request_settle_all', isLoggedIn, async(req, res) => {
    console.log(req.body);

    try {
        // 대본, 부본은 별도 처리(정산완료건만 조회 가능)
        // if (req.user.iClass == 4 || req.user.iClass == 5) {
        //     SettleViceAll(req, res);
        //     return;
        // }

        let iLimit = parseInt(req.body.iLimit);
        let iPage = parseInt(req.body.iPage);
        let iOffset = (iPage-1) * iLimit;
        let iSettleType = req.body.iSettleType;
        let iSettleDays = req.body.iSettleDays;

        let exist = await db.SettleRecords.findAll({where:{
                strQuater:req.body.strQuater,
                iSettleType: iSettleType,
                iSettleDays: iSettleDays,
                iClass:req.body.iClass,
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            }, order: [['createdAt', 'DESC']]
        });

        let lastDate = IAgentSettle.GetQuaterEndDate(req.body.strQuater, iSettleDays);

        let list = await GetSettleAll2(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.iClass, iOffset, iLimit, lastDate, iSettleDays, iSettleType);

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, req.body.iClass, req.body.strGroupID, iSettleDays, iSettleType);

        if ( exist.length > 0 && targetUserCount == exist.length )
        {
            res.send({result:'EXIST', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount});
        }
        else
        {
            res.send({result:'OK', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount});
        }
    } catch (err) {
        res.send({result:'ERROR', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회오류', totalCount: 0});
    }
});

/**
 * 리셋 죽장 조회
 */
router.post('/request_settle_all_reset', isLoggedIn, async(req, res) => {

    console.log(req.body);
    try {
        // 대본, 부본은 별도 처리(정산완료건만 조회 가능)
        // if (req.user.iClass == 4 || req.user.iClass == 5) {
        //     SettleViceAll(req, res);
        //     return;
        // }

        let iLimit = parseInt(req.body.iLimit);
        let iPage = parseInt(req.body.iPage);
        let iOffset = (iPage-1) * iLimit;
        let iSettleType = req.body.iSettleType;
        let iSettleDays = req.body.iSettleDays;

        let exist = await IAgentSettle.GetSettleExistList(req.body.strGroupID, req.body.strQuater, req.body.iClass, iSettleDays, iSettleType);

        let lastDate = IAgentSettle.GetQuaterEndDate(req.body.strQuater, iSettleDays);

        let list = await GetSettleClass(req.body.strGroupID, req.body.strQuater, req.body.dateStart, req.body.dateEnd, req.body.iClass, iOffset, iLimit, lastDate, iSettleDays, iSettleType);

        const targetUserCount = await IAgentSettle.GetSettleTargetUserCount(req.body.strQuater, req.body.iClass, req.body.strGroupID, iSettleDays, iSettleType);

        if ( exist.length > 0 && targetUserCount == exist.length )
        {
            res.send({result:'EXIST', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount, bEnableSettle:false});
        }
        else
        {
            // 죽장 가능 여부
            let bEnableSettle = IAgentSettle.IsSettleEnableDate(req.body.strQuater, iSettleDays);
            if (exist.length == list.length) {
                bEnableSettle = false;
            }
            res.send({result:'OK', list:list, iRootClass: req.user.iClass, exist: exist, msg: '정상조회', totalCount: targetUserCount, bEnableSettle:bEnableSettle});
        }
    } catch (err) {
        console.log(err.toString());
        res.send({result:'ERROR', list:[], iRootClass: req.user.iClass, exist: [], msg: '조회오류', totalCount: 0, bEnableSettle:false});
    }
});


let GetSettleClass = async (strGroupID, strQuater, dateStart, dateEnd, iClass, iOffset, iLimit, lastDate, iSettleDays, iSettleType) => {
    let start = dateStart ?? '';
    let end = dateEnd ?? '';

    // 파트너 목록
    let partnerList = await IAgentSettle.GetSettleClass(strGroupID, iClass, strQuater, start, end, iOffset, iLimit, lastDate, iSettleDays, iSettleType);

    let list = [];
    for (let i in partnerList) {
        let obj = partnerList[i];
        if (obj.iClass == 4) {
            // 리셋일 경우 죽장값을 재 계산하기(합계 * 죽장)
            if (iSettleType == 1) {
                if (obj.settleCount == 0) {
                    obj.iTotal = obj.iBaccaratWinLose + obj.iUnderOverWinLose + obj.iSlotWinLose - obj.iTotalRolling;

                    if (obj.iTotal > 0) {
                        obj.iSettle = obj.iTotal * obj.fSettleBaccarat4 * 0.01;
                    } else {
                        obj.iSettle = 0;
                    }
                    obj.iTotalViceAdmin = obj.iTotal - obj.iSettle - obj.iSettleVice - obj.iCommissionSlot - obj.iCommissionBaccarat;
                } else {
                    obj.iTotalViceAdmin = obj.iResult;
                }
            }
        } else if (obj.iClass == 5) {
            if (iSettleType == 1) {
                if (obj.settleCount == 0) {
                    obj.iTotal = obj.iBaccaratTotal + obj.iUnderOverTotal + obj.iSlotTotal;
                    if (obj.iTotal > 0) {
                        obj.iSettleVice = obj.iTotal * obj.fSettleBaccarat5 * 0.01;
                    } else {
                        obj.iSettleVice = 0;
                    }
                }
            }
            obj.iSettle = 0;
        }
        list.push(obj);
    }
    return list;
}

let GetSettleAll2 = async (strGroupID, strQuater, dateStart, dateEnd, iClass, iOffset, iLimit, lastDate, iSettleDays, iSettleType) => {
    // strQuater
    let start = dateStart ?? '';
    let end = dateEnd ?? '';

    // 값이 없으면 현재 시간을 기준으로 설정
    if (start == '' || end == '') {
        // let date = new Date();
        // let iMonth = date.getMonth();
        //
        // if (date.getDate() < 16) {
        //     strQuater = `${iMonth + 1}-1`;
        //     start = ITime.get1QuaterStartDate(iMonth);
        //     end = ITime.get1QuaterEndDate(iMonth);
        // } else {
        //     strQuater = `${iMonth + 1}-2`;
        //     start = ITime.get2QuaterStartDate(iMonth);
        //     end = ITime.get2QuaterEndDate(iMonth);
        // }
        return [];
    }

    // 파트너 목록
    let partnerList = await IAgentSettle.GetSettleClass(strGroupID, iClass, strQuater, start, end, iOffset, iLimit, lastDate, iSettleDays, iSettleType);

    let list = [];
    for (let i in partnerList) {
        let obj = partnerList[i];
        if (obj.iClass == 4) {
            // obj.iSettleVice = GetSettleVice(obj);
        } else {
            obj.iSettleVice = 0;
        }
        list.push(obj);
    }
    return list;
}



module.exports = router;