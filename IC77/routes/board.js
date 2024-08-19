const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const db = require('../db');

const {isLoggedIn, isNotLoggedIn} = require('./middleware');

const IHelper = require('../helpers/IHelper');

router.get('/list', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const listAnnouncement =     await db.Announcements.findAll({
        where:{eType:'ANN', eState:'ENABLE'},
        order:[['createdAt','DESC']]
    });
    const objectOutput = await IHelper.GetOutputRecords();
    const user = IHelper.GetUser(req.user);
    res.render('board/list', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, listAnnouncement:listAnnouncement, ePublishing:global.ePublishing});
});

router.get('/view', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const objectOutput = await IHelper.GetOutputRecords();
    const user = IHelper.GetUser(req.user);
    res.render('board/view', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/write', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const objectOutput = await IHelper.GetOutputRecords();
    const user = IHelper.GetUser(req.user);
    res.render('board/write', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/ann', async (req, res) => {

    console.log(`#####/board/ann`);
    console.log(req.query);

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const objectAnn = await db.Announcements.findOne({where:{id:req.query.id}});

    const objectOutput = await IHelper.GetOutputRecords();
    const user = IHelper.GetUser(req.user);
    res.render('board/view', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, objectAnn:objectAnn, eDocumentType:'ANN', ePublishing:global.ePublishing});
});

router.get('/popup', async (req, res) => {
    console.log(`#####/board/popup`);
    const popuplist = await db.Announcements.findAll({where:{eType: 'POPUP', eState: 'ENABLE'}});
    res.send({list: popuplist});
});

module.exports = router;