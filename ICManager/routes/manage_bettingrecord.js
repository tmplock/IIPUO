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

const IAgent = require('../implements/agent');
const IInout = require("../implements/inout");

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

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/casino', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:0, user:user, iocount:iocount});
});

router.post('/slot', isLoggedIn, async(req, res) => {

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/slot', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:1, user:user, iocount:iocount});
});

router.post('/vivo', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/vivo', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:2, user:user, iocount:iocount});
});

router.post('/pragmatic', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/pragmatic', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:3, user:user, iocount:iocount});
});

router.post('/powerball', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/powerball', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:4, user:user, iocount:iocount});
});

router.post('/izugi', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/izugi', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/habanero', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/habanero', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:6, user:user, iocount:iocount});
});

router.post('/world', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass:req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    res.render('manage_bettingrecord/world', {iLayout:0, iHeaderFocus:3, iSubHeaderFocus:7, user:user, iocount:iocount});
});

router.post('/request_pending_record', isLoggedIn, async(req, res) => {

    console.log('/request_pending_record');
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strNickname = req.body.strNickname;

    let listComplete = req.body.iComplete.split(',');
    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.BettingRecords.count({
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
                [Op.or]:['PENDING', 'ERROR']
            }
        }
    });

    let list = await db.BettingRecords.findAll(
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
                    [Op.or]:['PENDING', 'ERROR']
                }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    for ( let i in list )
    {
        let updatedAt = '';
        if (list[i].strBets != '' && list[i].strDetails != '') {
            updatedAt = list[i].updatedAt;
        }

        records.push({
            id: list[i].id,
            strVender:list[i].strVender,
            strNickname:list[i].strNickname,
            iPreviousCash:list[i].iPreviousCash,
            iAfterCash:list[i].iAfterCash,
            iGameCode:list[i].iGameCode,
            iBetting:list[i].iBetting,
            iWin: list[i].iWin,
            iTarget:list[i].iTarget,
            strRound:list[i].strRound,
            strRoundDetails: list[i].strDetails,
            strTableID:list[i].strTableID,
            iTransactionID:list[i].iTransactionID,
            strGroupID:list[i].strGroupID,
            iComplete:list[i].iComplete,
            iClass:list[i].iClass,
            createdAt:list[i].createdAt,
            updatedAt:updatedAt,
            strBets:list[i].strBets,
            eState:list[i].eState
        });
    }
    console.log(records);

    res.send({result:'OK', list:records, totalCount: totalCount});
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

    let totalCount = await db.BettingRecords.count({
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
            iGameCode:{
                [Op.or]:[0, 100]
            },
            // iComplete:{
            //     [Op.or]:listComplete
            // },
        }
    });

    let list = await db.BettingRecords.findAll(
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
                iGameCode:{
                    [Op.or]:[0, 100]
                },
                // iComplete:{
                //     [Op.or]:listComplete
                // },
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    for ( let i in list )
    {
        let updatedAt = '';
        if (list[i].strBets != '' && list[i].strDetails != '') {
            updatedAt = list[i].updatedAt;
        }

        records.push({
            id: list[i].id,
            strVender:list[i].strVender,
            strNickname:list[i].strNickname,
            iPreviousCash:list[i].iPreviousCash,
            iAfterCash:list[i].iAfterCash,
            iGameCode:list[i].iGameCode,
            iBetting:list[i].iBetting,
            iWin: list[i].iWin,
            iTarget:list[i].iTarget,
            strRound:list[i].strRound,
            strRoundDetails: list[i].strDetails,
            strTableID:list[i].strTableID,
            iTransactionID:list[i].iTransactionID,
            strGroupID:list[i].strGroupID,
            iComplete:list[i].iComplete,
            iClass:list[i].iClass,
            createdAt:list[i].createdAt,
            updatedAt:updatedAt,
            strBets:list[i].strBets,
            eState:list[i].eState
        });
    }
    console.log(records);

    res.send({result:'OK', list:records, totalCount: totalCount});
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

    let totalCount = await db.BettingRecords.count({
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
            iGameCode:200,
            iComplete:{
                [Op.or]:listComplete
            },
        }
    });

    let list = await db.BettingRecords.findAll(
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
                iGameCode:200,
                iComplete:{
                    [Op.or]:listComplete
                },
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
            strVender:list[i].strVender,
            strNickname:list[i].strNickname,
            iPreviousCash:list[i].iPreviousCash,
            iAfterCash:list[i].iAfterCash,
            iGameCode:list[i].iGameCode,
            iBetting:list[i].iBetting,
            iWin:list[i].iWin,
            iTarget:list[i].iTarget,
            strRound:list[i].strRound,
            strTableID:list[i].strTableID,
            iTransactionID:list[i].iTransactionID,
            createdAt:list[i].createdAt,
            strGroupID:list[i].strGroupID,
            iComplete:list[i].iComplete,
            iClass:list[i].iClass,
        });
    }
    console.log(records);

    res.send({result:'OK', data:records, totalCount: totalCount});
});

router.post('/request_record', isLoggedIn, async(req, res) => {

    console.log('/request_record');
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strNickname = req.body.strNickname;

    let listComplete = req.body.iComplete.split(',');
    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.BettingRecords.count({
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
                strVender:req.body.strVender,
                iComplete:{
                    [Op.or]:listComplete
                },
            }
    });

    let list = await db.BettingRecords.findAll(
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
            strVender:req.body.strVender,
            iComplete:{
                [Op.or]:listComplete
            },
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
            strVender:list[i].strVender,
            strNickname:list[i].strNickname,
            iPreviousCash:list[i].iPreviousCash,
            iAfterCash:list[i].iAfterCash,
            iGameCode:list[i].iGameCode,
            iBetting:list[i].iBetting,
            iWin:list[i].iWin,
            iTarget:list[i].iTarget,
            strRound:list[i].strRound,
            strTableID:list[i].strTableID,
            iTransactionID:list[i].iTransactionID,
            createdAt:list[i].createdAt,
            strGroupID:list[i].strGroupID,
            iComplete:list[i].iComplete,
            iClass:list[i].iClass,
        });
    }
    // let objectData = await IAgent.GetParentList(strGroupID, 8);
    // if ( objectData != null )
    // {
    //     console.log(objectData);
    //     for ( let i in records )
    //     {
    //         records[i].strAdmin = objectData.strAdmin;
    //         records[i].strPAdmin = objectData.strPAdmin;
    //         records[i].strVAdmin = objectData.strVAdmin;
    //         records[i].strAgent = objectData.strAgent;
    //         records[i].strShop = objectData.strShop;
    //     }
    // }
    console.log(records);

    res.send({result:'OK', data:records, totalCount: totalCount});
});

router.post('/request_incompletecancel', async (req, res) => {

    console.log('/request_incompletecancel');
    console.log(req.body);

    let list = await db.BettingRecords.findAll({where:{iComplete:0}});

    for ( let i in list )
    {
        await list[i].update(
            {
                iComplete:2,
            });

        let aUser = await db.Users.findOne({where:{strNickname:list[i].strID}});
        if ( aUser != null )
        {
            let iAmount = parseInt(aUser.iCash)+parseInt(list[i].iBetting);

            await aUser.update({iCash:iAmount});
        }
    }

    res.send({result:'OK'});
});

router.post('/request_incompletedmanual', async (req, res) => {

    console.log('/request_incompletedmanual');
    console.log(req.body);

    let list = await db.BettingRecords.findAll({where:{strRound:req.body.strRound, iComplete:0}});

    for ( let i in list )
    {
        let iWin = 0;
        if ( true == IsWinPBG(list[i].strTableID, req.body))
        {
            const cTarget = parseInt(list[i].strTableID);
            const cWin = parseInt(list[i].iBetting) * cPBGOdds[parseInt(list[i].iGameCode)][cTarget];
            iWin = cWin;

            console.log(`WinScore : ${cWin}`);
        }
        else
        {
            console.log(`Default`);
        }

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

        await list[i].update(
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
            }
        );

        let aUser = await db.Users.findOne({where:{strNickname:list[i].strID}});
        if ( aUser != null )
        {
            const cRolling = list[i].iBetting * list[i].fRollingUser * 0.01;
            const cSettle = 0;
            await aUser.update({iRolling:aUser.iRolling+cRolling});

            let aShop = await db.Users.findOne({where:{id:aUser.iParentID}});
            if ( aShop != null )
            {
                const cShopRolling = objectRolling.iShop;
                const cShopSettle = 0;
                await aShop.update({iRolling:aShop.iRolling+cShopRolling});

                let aAgent = await db.Users.findOne({where:{id:aShop.iParentID}});
                if ( aAgent != null )
                {
                    const cAgentRolling = objectRolling.iAgent;
                    const cAgentSettle = 0;
                    await aAgent.update({iRolling:aAgent.iRolling+cAgentRolling});

                    let aViceAdmin = await db.Users.findOne({where:{id:aAgent.iParentID}});
                    if ( aViceAdmin != null )
                    {
                        const cViceAdminRolling = objectRolling.iVAdmin;
                        const cViceAdminSettle = 0;
                        await aViceAdmin.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling});

                        let aProAdmin = await db.Users.findOne({where:{id:aViceAdmin.iParentID}});
                        if ( aProAdmin != null )
                        {
                            const cProAdminRolling = objectRolling.iPAdmin;
                            const cProAdminSettle = 0;
                            await aProAdmin.update({iRolling:aProAdmin.iRolling+cProAdminRolling});

                            let aAdmin = await db.Users.findOne({where:{id:aProAdmin.iParentID}});
                            if ( aAdmin != null )
                            {
                                const cAdminRolling = 0;
                                const cAdminSettle = 0;
                                await aAdmin.update({iRolling:0});
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
        iTransactionID: '',
        strNickname:'',
        strVender:'',
        strTableID:'',
        strRound:'',
        createdAt:'', // 배팅시간
        endedAt:'', // 배팅 종료시간
        status:'',

        iBetting: '',
        iTarget: '',
        iWin: '',
    }

    let obj = await db.BettingRecords.findOne({
        where: {
            id: id
        },
    });
    if (obj == null) {
        res.render('manage_bettingrecord/popup_round_detail', {iLayout:1, iHeaderFocus:0, result: 'FAIL', msg: '해당 항목을 조회할 수 없습니다', cards:cards, info: {}, bets:[]});
        return;
    }
    let obj2 = await db.BettingRecords.findOne({
        where: {
            strID: obj.strID,
            strVender: obj.strVender,
            strRound:obj.strRound,
            strTableID:obj.strTableID
        }
    });

    info.iTransactionID = obj.iTransactionID;
    info.strNickname = obj.strNickname;
    info.strVender = obj.strVender;
    info.strTableID = obj.strTableID;
    info.strRound = obj.strRound;
    info.createdAt = obj.createdAt;
    info.endedAt = obj.updatedAt;
    info.status = obj.iComplete == 1 ? '완료' : '처리중';

    info.iBetting = obj2.iBetting;
    info.iTarget = obj.iTarget;
    info.iWin = obj.iWin;

    let strDetail = obj.strDetails ?? '';
    if (strDetail == '') {
        res.render('manage_bettingrecord/popup_round_detail', {iLayout:1, iHeaderFocus:0, result: 'FAIL', msg: '해당 항목을 조회할 수 없습니다', cards:cards, info: {}, bets:[]});
        return;
    }

    let cards = JSON.parse(strDetail);
    let bets = [];
    let strBets = obj.strBets ?? '';
    if (strBets != '') {
        bets = JSON.parse(strBets);
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