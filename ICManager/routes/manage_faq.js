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

router.get('/list', isLoggedIn, async (req, res) => {
    console.log(`#####/faq/list`);
    const listFaq =     await db.Faqs.findAll({
        where:{eState:'ENABLE'},
        order:[['createdAt','DESC']]
    });
    res.render('faq/list', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listFaq:listFaq});
});

router.get('/read', isLoggedIn, async (req, res) => {
    console.log(`#####/faq/view`);
    const obj = await db.Faqs.findOne({where:{id:req.query.id}});
    res.render('faq/popup_read', {iLayout:0, user:req.user, messages:null, obj:obj});
});

router.post('/popup_write', isLoggedIn, async (req, res) => {
    console.log(`#####/faq/request_write`);
    console.log(req.query);

    const obj = await db.Faqs.findOne({where:{id:req.query.id}});
    res.render('faq/popup_write', {iLayout:0, user:req.user, messages:null, obj:obj, eDocumentType:'FAQ'});
});

router.get('/request_list', isLoggedIn, async (req, res) => {
    console.log(`#####/faq/request_list`);
    const listFaq =     await db.Faqs.findAll({
        where:{eState:'ENABLE'},
        order:[['createdAt','DESC']]
    });
    res.send({result: 'OK', list:listFaq});
});

router.post('/request_remove', isLoggedIn, async (req, res) => {
    console.log(`#####/faq/request_remove`);
    console.log(req.body);
    if (parseInt(req.user.iClass) > 3) {
        res.send({result: 'FAIL', msg:'권한없음'});
        return;
    }
    await db.Faqs.destroy({where:{id:req.body.id}});
    res.send({result: 'OK'});
});

router.post('/request_update', isLoggedIn, async (req, res) => {

    console.log(`#####/faq/request_update`);
    console.log(req.body);
    if (parseInt(req.user.iClass) > 3) {
        res.send({result: 'FAIL', msg:'권한없음'});
        return;
    }
    const obj = await db.Faqs.findOne({where:{id:req.query.id}});
    if (obj == null) {
        res.send({result: 'OK'});
        return;
    }
    res.send({result: 'OK'});
});


router.post('/request_write', async (req, res) => {

    console.log(`#####/faq/request_write`);
    console.log(req.body);
    if (parseInt(req.user.iClass) > 3) {
        res.send({result: 'FAIL', msg:'권한없음'});
        return;
    }

    await db.Faqs.create({strSubject:req.body.strSubject, strContents:req.body.strContents, eState:'ENABLE'});

    res.send({result:'OK'});
});



module.exports = router;