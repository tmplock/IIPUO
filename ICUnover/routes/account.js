const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const IHelper = require('../helpers/IHelper');

const db = require('../db');
// // const db = require('../models');
// const db = require('../models');
// const time = require('../utils/time');

// const {Op}= require('sequelize');

const Enum = require('../constants/enum');


const {isLoggedIn, isNotLoggedIn} = require('./middleware');

router.use(function (request,response,next){
    var ua = request.header('User-Agent');

    request.platform = (/lgtelecom/.test(ua) || /Android/.test(ua) || /blackberry/.test(ua) || /iphone/.test(ua) || /Iphone/.test(ua) || /iPhone/.test(ua) || /IPHONE/.test(ua)  || /ipad/.test(ua) || /samsung/.test(ua) || /symbian/.test(ua) || /sony/.test(ua) || /SCH-/.test(ua) || /SPH-/.test(ua)) ?
        'mobile' :
        'pc';

    next();
})

router.get('/login', (req, res) => {

    if ( req.platform == 'mobile' )
    {
        res.redirect('/account/login_m');
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/login_m', async(req, res) => {

    res.render('login_m', {iLayout:1, messages:req.flash('error')[0]});
});

router.get('/loginsuccess', (req, res) => {

    res.redirect('/');
});

router.get('/loginfail', (req, res) => {

    if ( req.platform == 'mobile' )
    {
        res.redirect('/account/login_m');
    }
    else
    {
        res.redirect('/');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/account/loginsuccess',
    failureRedirect: '/account/loginfail',
    failureFlash: true
}), (req, res) => {

    console.log(req.body);
});

router.get('/logout', isLoggedIn, (req, res) => {

    req.logout(async function (err) {
        if (err) {
          return next(err);
        }

        await db.Sessions.destroy({where:{strID:req.session.uid}, truncate:true});
        delete req.session.uid;

        // if you're using express-flash
        req.flash('success_msg', 'session terminated');
        res.redirect('/');
      });
});

router.get('/mypage', async (req, res) => {
    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }
    else
    {
        res.redirect('/account/login');
        return;
    }
    const objectOutput = await IHelper.GetOutputRecords();
    res.render('mypage', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank});
});

module.exports = router;