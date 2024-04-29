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

    const listFaq =     await db.Faqs.findAll({
        where:{eState:'ENABLE'},
        order:[['createdAt','DESC']]
    });
    const objectOutput = await IHelper.GetOutputRecords();
    res.render('faq/list', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, listFaq:listFaq, ePublishing:global.ePublishing});
});

router.get('/view', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }
    const objectOutput = await IHelper.GetOutputRecords();
    res.render('faq/view', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/get', async (req, res) => {

    console.log(`#####/faq`);
    console.log(req.query);

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const obj = await db.Faqs.findOne({where:{id:req.query.id}});
    const objectOutput = await IHelper.GetOutputRecords();
    res.render('faq/view', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, obj:obj, eDocumentType:'FAQ', ePublishing:global.ePublishing});
});


module.exports = router;