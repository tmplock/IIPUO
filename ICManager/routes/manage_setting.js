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
const IInout = require('../implements/inout');
const IAgent = require('../implements/agent3');
const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');

router.get('/letterlistreceive', isLoggedIn, async(req, res) => {
    const dbuser = await IAgent.GetUserInfo(req.user.strNickname);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    if (user.iPermission == 100) {
        user.strID = dbuser.strIDRel;
    }

    let iocount = await IInout.GetProcessing(dbuser.strGroupID, dbuser.strNickname, dbuser.iClass);

    res.render('manage_setting/letterlistreceive', {iLayout:0, iHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/letterlistsend', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling: dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission:req.user.iPermission};

    if (user.iPermission == 100) {
        user.strID = dbuser.strIDRel;
    }

    let iocount = await IInout.GetProcessing(req.body.strGroupID, req.body.strNickname, dbuser.iClass);
    res.render('manage_setting/letterlistsend', {iLayout:0, iHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/letterlistreceive', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    if (dbuser.iPermission == 100) {
        user.strID = dbuser.strIDRel;
    }

    let iocount = await IInout.GetProcessing(dbuser.strGroupID, dbuser.strNickname, dbuser.iClass);

    res.render('manage_setting/letterlistreceive', {iLayout:0, iHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/announcement', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    if (dbuser.iPermission == 100) {
        user.strID = dbuser.strIDRel;
    }

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_setting/announcement', {iLayout:0, iHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/popup', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_setting/popup', {iLayout:0, iHeaderFocus:5, user:user, iocount:iocount});
});

router.post('/request_agentinfo', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if (req.user.iClass <= dbuser.iClass) {
        let iCash = 0;
        if ( dbuser != null )
            iCash = dbuser.iCash;

        res.send({result:'OK', data:dbuser});
    } else {
        res.send({result:'FAIL', msg: '잘못된 접근입니다'});
    }
});


module.exports = router;