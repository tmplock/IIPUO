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
    res.render('board/list', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, listAnnouncement:listAnnouncement});
});

router.get('/view', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const objectOutput = await IHelper.GetOutputRecords();
    res.render('board/view', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank});
});

router.get('/write', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const objectOutput = await IHelper.GetOutputRecords();
    res.render('board/write', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank});
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
    res.render('board/view', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, objectAnn:objectAnn, eDocumentType:'ANN'});
});


module.exports = router;