const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const util_time = require('../utils/time');

const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');

const IInout = require("../implements/inout");
const IAgent = require('../implements/agent3');
const Processor = require("../icbuilder/processor");
const ODDS = require("../icbuilder/helpers/odds");

const cPBGOdds = [
    [
        1.93,//파워볼 홀
        1.93,//파워볼 짝
        1.93,//파워볼 오버
        1.93,//파워볼 언더
        3.10,//파워볼 홀오버
        4.10,//파워볼 홀언더
        4.10,//파워볼 짝오버
        3.10,//파워볼 짝언더

        1.93, //일반볼 홀
        1.93,//일반볼 짝
        1.93,//일반볼 오버
        1.93,//일반볼 언더

        2.24,//일반볼 대
        2.23,//일반볼 중
        2.24,//일반볼 소

        3.72,//일반볼 홀오버
        3.72,//일반볼 홀언더
        3.72,//일반볼 짝오버
        3.72,//일반볼 짝언더
        
        4.40,//일반볼 홀대
        4.40,//일반볼 짝대

        4.20,//일반볼 홀중
        4.20,//일반볼 짝중

        4.40,//일반볼 홀소
        4.40,//일반볼 짝소

        7.10,//홀+언더+P홀
        7.10,//홀+언더+P짝
        7.10,//홀+오버+P홀
        7.10,//홀+오버+P짝
        7.10,//짝+언더+P홀
        7.10,//짝+언더+P짝
        7.10,//짝+오버+P홀
        7.10,//짝+오버+P짝
    ],
    [
        1.95,//파워볼 홀
        1.95,//파워볼 짝
        1.95,//파워볼 오버
        1.95,//파워볼 언더
        3.10,//파워볼 홀오버
        4.10,//파워볼 홀언더
        4.10,//파워볼 짝오버
        3.10,//파워볼 짝언더

        1.95, //일반볼 홀
        1.95,//일반볼 짝
        1.95,//일반볼 오버
        1.95,//일반볼 언더

        2.73,//일반볼 대
        2.43,//일반볼 중
        2.72,//일반볼 소

        3.72,//일반볼 홀오버
        3.72,//일반볼 홀언더
        3.72,//일반볼 짝오버
        3.72,//일반볼 짝언더
        
        4.40,//일반볼 홀대
        4.40,//일반볼 짝대

        4.20,//일반볼 홀중
        4.20,//일반볼 짝중

        4.40,//일반볼 홀소
        4.40,//일반볼 짝소

        7.10,//홀+언더+P홀
        7.10,//홀+언더+P짝
        7.10,//홀+오버+P홀
        7.10,//홀+오버+P짝
        7.10,//짝+언더+P홀
        7.10,//짝+언더+P짝
        7.10,//짝+오버+P홀
        7.10,//짝+오버+P짝
    ],
];


router.post('/casino', isLoggedIn, async(req, res) => {

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/casino', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:0, user:user, iocount:iocount});
});

router.post('/slot', isLoggedIn, async(req, res) => {

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/slot', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:1, user:user, iocount:iocount});
});

router.post('/vivo', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/vivo', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:2, user:user, iocount:iocount});
});

router.post('/pragmatic', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/pragmatic', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:3, user:user, iocount:iocount});
});

router.post('/powerball', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/powerball', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:4, user:user, iocount:iocount});
});

router.post('/izugi', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/izugi', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/habanero', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/habanero', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:6, user:user, iocount:iocount});
});

router.post('/world', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/world', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:7, user:user, iocount:iocount});
});

router.post('/request_casino_record', isLoggedIn, async(req, res) => {

    console.log('/request_casino_record');
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strNickname = req.body.strNickname;

    let listComplete = req.body.iComplete.split(',');
    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            strNickname:{
                [Op.like]:'%'+strNickname+'%',
            },
            iGameCode: {
                [Op.notIn]:[200, 300]
            },
            // eState:{
            //     [Op.notIn]:['STANDBY']
            // }
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID:{
                    [Op.like]:strGroupID+'%'
                },
                strNickname:{
                    [Op.like]:'%'+strNickname+'%',
                },
                iGameCode: {
                    [Op.notIn]:[200, 300]
                },
                // eState:{
                //     [Op.notIn]:['STANDBY']
                // }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    const cancel = (req.user.iPermission != 100 && req.user.iClass < 3) ? true : false;

    for ( let i in list )
    {

        console.log(`${list[i].iWin} / ${list[i].eState == 'COMPLETE'}`);
        let isCancel = false;
        if (cancel == false || list[i].eType == 'CANCEL' || list[i].eType == 'CANCEL_BET' || list[i].eType == 'CANCEL_WIN') {
            isCancel = false;
        } else if (cancel && list[i].eState == 'COMPLETE') {
            isCancel = true;
        }
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
            updatedAt:list[i].updatedAt,
            cancel:isCancel
        });
    }
    console.log(records);

    res.send({result:'OK', data:records, totalCount: totalCount});
});

router.post('/request_slot_record', isLoggedIn, async(req, res) => {

    console.log('/request_slot_record');
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strNickname = req.body.strNickname;

    let listComplete = req.body.iComplete.split(',');
    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            strNickname:{
                [Op.like]:'%'+strNickname+'%',
            },
            iGameCode: 200,
            // eState:{
            //     [Op.notIn]:['STANDBY']
            // }
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID:{
                    [Op.like]:strGroupID+'%'
                },
                strNickname:{
                    [Op.like]:'%'+strNickname+'%',
                },
                iGameCode: 200,
                // eState:{
                //     [Op.notIn]:['STANDBY']
                // }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];
    const cancel = (req.user.iPermission != 100 && req.user.iClass < 3) ? true : false;

    for ( let i in list )
    {
        console.log(`${list[i].iWin} / ${list[i].eState == 'COMPLETE'}`);
        let isCancel = false;
        if (cancel == false || list[i].eType == 'CANCEL' || list[i].eType == 'CANCEL_BET' || list[i].eType == 'CANCEL_WIN') {
            isCancel = false;
        } else if (cancel && list[i].eState == 'COMPLETE') {
            isCancel = true;
        }

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
            updatedAt:list[i].updatedAt,
            cancel: isCancel
        });
    }
    console.log(records);

    res.send({result:'OK', data:records, totalCount: totalCount});
});


/**
 * 배팅 취소
 */

router.post('/request_betting_cancel', isLoggedIn, async (req, res) => {
    console.log('/request_betting_cancel');
    console.log(req.body);

    const betId = req.body.betId ?? 0;
    const cash = req.body.cash ?? 0;
    const betting = req.body.betting ?? 0;
    const rolling = req.body.rolling ?? 0; // 롤링 롤백 여부

    if (betId == 0 || (cash == 0 && betting == 0 && rolling == 0)) {
        res.send({result: 'FAIL', msg:'잘못된 요청입니다'});
        return;
    }

    const bet = await db.RecordBets.findOne({where: {id: betId}});

    if (bet.eType == 'CANCEL' || bet.eType == 'CANCEL_BET' || bet.eType == 'CANCEL_WIN') {
        res.send({result: 'FAIL', msg:'이미 취소된 배팅입니다'});
        return;
    }

    if (bet.eState == 'PENDING' || bet.eState == 'ERROR') {
        res.send({result: 'FAIL', msg:'취소할 수 없는 베팅입니다'});
        return;
    }

    let iCash = bet.iBet - bet.iWin;

    let log = `배팅취소 | 취소금액(배팅-승리) : ${iCash}`;
    if (cash == 1) {
        log = `${log} | 보유금액롤백`;
    }
    if (betting == 1) {
        log = `${log} | 배팅금액롤백`;
    }
    if (rolling == 1) {
        log = `${log} | 유저 보유 롤링 롤백`;
    }
    log = `${log} | 벤더(게임) : ${bet.strVender}(${bet.strGameID}) | BetID : ${bet.id}`;

    try {
        if (bet.eState == 'STANDBY') {
            if (iCash < 0 && cash == 1) {
                let user = await db.Users.findOne({where: {strID: bet.strID}});
                let userCash = parseInt(user.iCash ?? 0) + iCash;
                if (userCash < 0) {
                    res.send({result: 'FAIL', msg:'처리 실패(보유 캐시 부족)'});
                    return;
                }
            }

            await db.RecordBets.update({
                eType: 'CANCEL_BET', eState: 'COMPLETE'
            }, {where: {id: betId}});

            await db.Users.increment({
                iCash:iCash
            }, {where: { strID: bet.strID }});

            log = `${log} | 롤링 지급전`;

            // 로그 남기기
            await db.BettingLogs.create({
                strNickname: bet.strNickname,
                strID:bet.strID,
                iClass:bet.iClass,
                strGroupID:bet.strGroupID,
                strLogs:log,
                strEditorID: req.user.strID,
                strEditorNickname:req.user.strNickname,
            });

            res.send({result: 'OK'});

        } else if (bet.eState == 'COMPLETE') {

            // 상부 Overview 감소처리(ICBuilder 참고)
            let listOverview = [];
            let listUpdateDB = [];
            let listBetDB = [bet];
            let listOdds = await ODDS.FullCalculteOdds(listBetDB);
            const listCancelBet = [bet];
            Processor.ProcessCancel('ALL', listCancelBet, listOverview, listOdds, listUpdateDB);


            // 1. 보유 캐시 체크
            if (iCash < 0 && cash == 1) {
                let user = await db.Users.findOne({where: {strID: bet.strID}});
                let userCash = parseInt(user.iCash ?? 0) + iCash;
                if (userCash < 0) {
                    res.send({result: 'FAIL', msg:'처리 실패(보유 캐시 부족)'});
                    return;
                }
            }

            // 롤백시에 보유 롤링 체크(마이너스 안되도록)
            if (betting == 1 || rolling == 1) {
                for (let i in listOverview) {
                    const t = listOverview[i];
                    const cRolling = t.iRollingB + t.iRollingUO + t.iRollingS + t.iRollingPBA + t.iRollingPBB; // 요게 맞음
                    if (cRolling < 0) {
                        let user = await db.Users.findOne({where: {strID:t.strID}});
                        let userRolling = parseInt(user.iRolling ?? 0) + cRolling;
                        if (userRolling < 0) {
                            res.send({result: 'FAIL', msg:`처리 실패(${user.strNickname} 보유 롤링 부족)`});
                            return;
                        }
                    }
                }
            }

            // 배팅 처리
            await db.RecordBets.update({
                eType: 'CANCEL_BET', eState: 'COMPLETE'
            }, {where: {id: betId}});

            // 정산데이터 롤백
            if (betting == 1) {
                await ODDS.UpdateOverview(listOverview, rolling);
            }

            // 유저 보유머니
            if (cash == 1) {
                await db.Users.increment({
                    iCash:iCash
                }, {where: { strID: bet.strID }});
            }

            log = `${log} | 롤링 롤백`;

            // 로그 남기기
            await db.BettingLogs.create({
                strNickname: bet.strNickname,
                strID:bet.strID,
                iClass:bet.iClass,
                strGroupID:bet.strGroupID,
                strLogs:log,
                strEditorID: req.user.strID,
                strEditorNickname:req.user.strNickname,
            });

            res.send({result: 'OK'});
        } else {
            res.send({result: 'FAIL', msg:'처리 실패'});
        }
    } catch (err) {
        res.send({result: 'FAIL', msg:`처리 실패(${err})`});
    }
});

router.post('/popup_cancel', isLoggedIn, async (req, res) => {
    console.log(`popup_cancel`);
    console.log(req.body);

    // res.send({result: 'FAIL', msg:'기능 준비중'});
    // return;

    const strID = req.user.strID ?? '';
    const betId = req.body.betId ?? 0;
    const password = req.body.password ?? '';
    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iClass > 3 || iPermission == 100) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }

    if (betId == 0 || strID == '' || password == '') {
        res.send({result: 'FAIL', msg:'잘못된 요청입니다'});
        return;
    }

    let dbuser = await db.Users.findOne({where: {strNickname: req.user.strNickname}});
    let subUser = await db.SubUsers.findOne({where: dbuser.id, strOddPassword: password});
    if (subUser == null) {
        res.send({result: 'FAIL', msg:'취소 비밀번호를 확인해주세요'});
        return;
    }

    const bet = await db.RecordBets.findOne({where: {id: betId}});
    if (bet.eType == 'CANCEL' || bet.eType == 'CANCEL_BET' || bet.eType == 'CANCEL_WIN') {
        res.send({result: 'FAIL', msg:'이미 취소된 배팅입니다'});
        return;
    }

    let betInfo = {
        id:bet.id,
        strVender:bet.strVender,
        strGameID:bet.strGameID,
        strID: bet.strID,
        strNickname: bet.strNickname,
        iBet: bet.iBet,
        iWin: bet.iWin,
        strOverview: bet.strOverview,
        createdAt:bet.createdAt,
        eType: bet.eType,
        eState: bet.eState,
    }

    const info = await db.Users.findOne({where: {strID: strID}});
    res.render('manage_bettingrecord/popup_cancel', {iLayout:1, iHeaderFocus:0, agent:info, user:info, bet:betInfo});
});


/**
 * 게임사별 조회시
 */
router.post('/request_record', isLoggedIn, async(req, res) => {

    console.log('/request_record');
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strNickname = req.body.strNickname;
    let strVender = req.body.strVender;

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID:{
                    [Op.like]:strGroupID+'%'
                },
                strNickname:{
                    [Op.like]:'%'+strNickname+'%',
                },
                strVender: strVender,
                // eState:{
                //     [Op.notIn]:['STANDBY']
                // }
            }
    });

    let list = await db.RecordBets.findAll(
    { 
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            strNickname:{
                [Op.like]:'%'+strNickname+'%',
            },
            strVender: strVender,
        },
        offset:iOffset,
        limit:iLimit,
        order:[['id','DESC']]
    });

    let records = [];
    let cancel = (req.user.iPermission != 100 && req.user.iClass < 3) ? true : false;

    for ( let i in list )
    {
        if (list[i].eType == 'CANCEL' || list[i].eType == 'CANCEL_BET' || list[i].eType == 'CANCEL_WIN') {
            cancel = false;
        }
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
            updatedAt:list[i].updatedAt,
            cancel:(cancel && list[i].iWin == 0 && list[i].eState == 'COMPLETE')
        });
    }
    console.log(records);

    res.send({result:'OK', data:records, totalCount: totalCount});
});

/**
 * Pending 조회
 */
router.post('/pending', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/pending', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:8, user:user, iocount:iocount});
});
router.post('/request_pending_record', isLoggedIn, async(req, res) => {

    console.log('/request_pending_record');
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strNickname = req.body.strNickname;

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            strNickname:{
                [Op.like]:'%'+strNickname+'%',
            },
            eState:{
                [Op.notIn]:['COMPLETE']
            }
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID:{
                    [Op.like]:strGroupID+'%'
                },
                strNickname:{
                    [Op.like]:'%'+strNickname+'%',
                },
                eState:{
                    [Op.notIn]:['COMPLETE']
                }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];
    let cancel = (req.user.iPermission != 100 && req.user.iClass < 3) ? true : false;
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
            updatedAt:list[i].updatedAt,
            cancel:cancel
        });
    }
    console.log(records);

    res.send({result:'OK', data:records, totalCount: totalCount});
});

router.post('/request_incompletecancel', async (req, res) => {

    console.log('/request_incompletecancel');
    console.log(req.body);

    let list = await db.RecordBets.findAll({where:{
            eType:'BET'
    }});

    for ( let i in list )
    {
        await db.RecordBets.update({
            iComplete:2,
        }, {where: {id: list[i].id}});

        let aUser = await db.Users.findOne({where:{strNickname:list[i].strID}});
        if ( aUser != null )
        {
            let iAmount = parseFloat(aUser.iCash)+parseFloat(list[i].iBetting);

            await db.Users.findOne({iCash:iAmount}, {where:{strNickname:list[i].strID}});
            //await aUser.update({iCash:iAmount});
        }
    }

    res.send({result:'OK'});
});

router.post('/request_incompletedmanual', async (req, res) => {

    console.log('/request_incompletedmanual');
    console.log(req.body);

    let list = await db.RecordBets.findAll({where:{strRound:req.body.strRound, eType:'BET'}});

    for ( let i in list )
    {
        let iWin = 0;
        if ( true == IsWinPBG(list[i].strTableID, req.body))
        {
            const cTarget = parseInt(list[i].strTableID);
            const cWin = parseFloat(list[i].iBetting) * cPBGOdds[parseInt(list[i].iGameCode)][cTarget];
            iWin = cWin;

            console.log(`WinScore : ${cWin}`);
        }
        else
        {
            console.log(`Default`);
        }

        //TODO:파워볼 취소시 롤링 롤백 기능 확인 필요
        //  Update Rolling & Settle
        const cTotalOdds = list[i].fRollingAdmin + list[i].fRollingVAdmin + list[i].fRollingAgent + list[i].fRollingShop + list[i].fRollingUser;

        const objectRolling = {

            iUser:list[i].iBetting * list[i].fRollingUser * 0.01,
            iShop:list[i].iBetting * list[i].fRollingShop * 0.01,
            iAgent:list[i].iBetting * list[i].fRollingAgent * 0.01,
            iVAdmin:list[i].iBetting * list[i].fRollingVAdmin * 0.01,
            iPAdmin:list[i].iBetting * list[i].fRollingPAdmin * 0.01,
            // iAdmin:list[i].iBetting * list[i].fRollingAdmin * 0.01,
            iAdmin:0
        };

        await db.RecordBets.update(
            {
                iRolling:list[i].iBetting * cTotalOdds * 0.01,
                iRollingUser:objectRolling.iUser,
                iRollingShop:objectRolling.iShop,
                iRollingAgent:objectRolling.iAgent,
                iRollingVAdmin:objectRolling.iVAdmin,
                iRollingPAdmin:objectRolling.iPAdmin,
                iRollingAdmin:objectRolling.iAdmin,

                // iSettleUser:(list[i].iBetting-list[i].iWin) * list[i].fSettleUser * 0.01,
                // iSettleShop:(list[i].iBetting-list[i].iWin) * list[i].fSettleShop * 0.01,
                // iSettleAgent:(list[i].iBetting-list[i].iWin) * list[i].fSettleAgent * 0.01,
                // iSettleVAdmin:(list[i].iBetting-list[i].iWin) * list[i].fSettleVAdmin * 0.01,
                // iSettlePAdmin:(list[i].iBetting-list[i].iWin) * list[i].fSettlePAdmin * 0.01,
                // iSettleAdmin:(list[i].iBetting-list[i].iWin) * list[i].fSettleAdmin * 0.01,
                iComplete:1,
                iWin:iWin
            },
            {
                where: {
                    id: list[i].id
                }
            }
        );

        let aUser = await db.Users.findOne({where:{strNickname:list[i].strID}});
        if ( aUser != null )
        {
            const cRolling = list[i].iBetting * list[i].fRollingUser * 0.01;
            const cSettle = 0;
            await db.Users.update({iRolling:aUser.iRolling+cRolling}, {where:{strNickname:list[i].strID}});
            //await aUser.update({iRolling:aUser.iRolling+cRolling});

            let aShop = await db.Users.findOne({where:{id:aUser.iParentID}});
            if ( aShop != null )
            {
                const cShopRolling = objectRolling.iShop;
                const cShopSettle = 0;

                await db.Users.update({iRolling:aShop.iRolling+cShopRolling}, {where:{id:aUser.iParentID}});
                //await aShop.update({iRolling:aShop.iRolling+cShopRolling});

                let aAgent = await db.Users.findOne({where:{id:aShop.iParentID}});
                if ( aAgent != null )
                {
                    const cAgentRolling = objectRolling.iAgent;
                    const cAgentSettle = 0;

                    await db.Users.update({iRolling:aAgent.iRolling+cAgentRolling}, {where:{id:aShop.iParentID}});
                    //await aAgent.update({iRolling:aAgent.iRolling+cAgentRolling});

                    let aViceAdmin = await db.Users.findOne({where:{id:aAgent.iParentID}});
                    if ( aViceAdmin != null )
                    {
                        const cViceAdminRolling = objectRolling.iVAdmin;
                        const cViceAdminSettle = 0;
                        //await aViceAdmin.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling});
                        await db.Users.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling}, {where:{id:aAgent.iParentID}});

                        let aProAdmin = await db.Users.findOne({where:{id:aViceAdmin.iParentID}});
                        if ( aProAdmin != null )
                        {
                            const cProAdminRolling = objectRolling.iPAdmin;
                            const cProAdminSettle = 0;
                            await db.Users.update({iRolling:aProAdmin.iRolling+cProAdminRolling}, {where:{id:aViceAdmin.iParentID}});
                            //await aProAdmin.update({iRolling:aProAdmin.iRolling+cProAdminRolling});

                            let aAdmin = await db.Users.findOne({where:{id:aProAdmin.iParentID}});
                            if ( aAdmin != null )
                            {
                                const cAdminRolling = 0;
                                const cAdminSettle = 0;

                                await db.Users.update({iRolling:0}, {where:{id:aProAdmin.iParentID}});
                                //await aAdmin.update({iRolling:0});
                            }
                        }
                    }
                }
            }
        }

    }

    res.send({result:'OK'});

});

router.post('/popup_round_detail', async (req, res) => {
    console.log('/request_round_detail');
    console.log(req.body);

    let id = req.body.id ?? 0;
    if (id == 0) {
        res.render('manage_bettingrecord/popup_round_detail', {iLayout:1, iHeaderFocus:0, result: 'FAIL', msg: '해당 항목을 조회할 수 없습니다', cards:cards, info: {}});
        return;
    }

    let info = {
        strUniqueID: '',
        strNickname:'',
        strVender:'',
        strTableID:'',
        strRound:'',
        createdAt:'', // 배팅시간
        endedAt:'', // 배팅 종료시간
        status:'',

        iBalance:'',
        iBet: '',
        iWin: '',
        iTarget: '',
    }

    let obj = await db.RecordBets.findOne({
        where: {
            id: id
        },
    });
    if (obj == null) {
        res.render('manage_bettingrecord/popup_round_detail', {iLayout:1, iHeaderFocus:0, result: 'FAIL', msg: '해당 항목을 조회할 수 없습니다', cards:cards, info: {}, bets:[]});
        return;
    }

    info.strUniqueID = obj.strUniqueID;
    info.strNickname = obj.strNickname;
    info.strVender = obj.strVender;
    info.strTableID = obj.strTableID;
    info.strRound = obj.strRound;
    info.createdAt = obj.createdAt;
    info.endedAt = obj.updatedAt;
    info.status = obj.eState;
    if (obj.eState == 'STANDBY') {
        info.status = '확인중';
    } else if (obj.eState == 'COMPLETE') {
      info.status = '완료';
    } else if (obj.eState == 'PENDING') {
        info.status = '확인필요';
    } else if (obj.eState == 'ERROR') {
        info.status = '조회오류';
    }
    info.iBalance = obj.iBalance;
    info.iBet = obj.iBet;
    info.iWin = obj.iWin;
    info.iTarget = obj.iTarget;

    let cards = {};
    let strResult = obj.strResult ?? '';
    if (strResult != '') {
        try {
            cards = JSON.parse(strResult);
        } catch (err) {}
    }

    let bets = [];
    let strDetails = obj.strDetail ?? '';
    if (strDetails != '') {
        try {
            bets = JSON.parse(strDetails);
        } catch (err) {
        }
    }
    res.render('manage_bettingrecord/popup_round_detail', {iLayout:1, iHeaderFocus:0, result:'OK', msg:'조회성공', info:info, cards: cards, bets:bets});
});

let IsWinPBG = (target, result) => {

    console.log(`IsWinPBG : ${target}`);
    console.log(result);

    switch(parseInt(target))
    {
    case 0: //파워볼 홀
        console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'odd')
            return true;
        break;
    case 1: //파워볼 짝
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'even')
            return true;
        break;
    case 2: //파워볼 오버
    console.log(`target : ${target}, ${result.strPowerUnderOver}`);
        if ( result.strPowerUnderOver == 'over')
            return true;
        break;
    case 3: //파워볼 언더
    console.log(`target : ${target}, ${result.strPowerUnderOver}`);
        if ( result.strPowerUnderOver == 'under')
            return true;
        break;
    case 4: //파워볼 홀오버
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'odd' && result.strPowerUnderOver == 'over' )
            return true;
        break;
    case 5: //파워볼 홀언더
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'odd' && result.strPowerUnderOver == 'under' )
            return true;
        break;
    case 6: //파워볼 짝오버
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'even' && result.strPowerUnderOver == 'over' )
            return true;
        break;
    case 7: //파워볼 짝언더
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'even' && result.strPowerUnderOver == 'under' )
            return true;
        break;

    case 8: //일반볼 홀
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalOddEven == 'odd')
            return true;
        break;
    case 9: //일반볼 짝
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalOddEven == 'even')
            return true;
        break;
    case 10: //일반볼 오버
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalUnderOver == 'over')
            return true;    
        break;
    case 11: //일반볼 언더
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalUnderOver == 'under')
            return true;    
        break;
    case 12: //일반볼 대
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPeriod == 'big')
            return true;
        break;
    case 13: //일반볼 중
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPeriod != 'big' && result.strPeriod != 'small' )
            return true;
        break;
    case 14: //일반볼 소
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPeriod == 'small')
            return true;
        break;

    case 15: //일반볼 홀오버
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'over')
            return true;
        break;
    case 16: //일반볼 홀언더
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'under')
            return true;
        break;
    case 17: //일반볼 짝오버
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'over')
            return true;
        break;
    case 18: //일반볼 짝언더
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'under')
            return true;
        break;

    case 19: //일반볼 홀대
        if ( result.strNormalOddEven == 'odd' && result.strPeriod == 'big')
            return true;
        break;
    case 20: //일반볼 짝대
        if ( result.strNormalOddEven == 'even' && result.strPeriod == 'big')
            return true;
        break;
    case 21: //일반볼 홀중
        if ( result.strNormalOddEven == 'odd' && result.strPeriod != 'big' && result.strPeriod != 'small')
            return true;
        break;
    case 22: //일반볼 짝중
        if ( result.strNormalOddEven == 'even' && result.strPeriod != 'big' && result.strPeriod != 'small')
            return true;
        break;
    case 23: //일반볼 홀소
        if ( result.strNormalOddEven == 'odd' && result.strPeriod == 'small')
            return true;
        break;
    case 24: //일반볼 짝소
        if ( result.strNormalOddEven == 'even' && result.strPeriod == 'small')
            return true;
        break;
    case 25: //홀+언더+P홀
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'odd')
            return true;
        break;

    case 26: //홀+언더+P짝
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'even')
            return true;
        break;
    case 27: //홀+오버+P홀
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'odd')
            return true;
        break;
    case 28: //홀+오버+P짝
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'even')
            return true;
        break;
    case 29: //짝+언더+P홀
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'odd')
            return true;
        break;
    case 30: //짝+언더+P짝
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'even')
            return true;
        break;
    case 31: //짝+오버+P홀
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'odd')
            return true;
        break;
    case 32: //짝+오버+P짝
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'even')
            return true;
        break;
    }
    return false;
}




module.exports = router;