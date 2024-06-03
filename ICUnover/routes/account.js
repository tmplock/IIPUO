const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const IHelper = require('../helpers/IHelper');

const db = require('../db');

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

router.get('/register', (req, res) => {

    if ( global.ePublishing != 'ON' )
    {
        res.redirect('/account/login');
        return;
    }

    res.render('account/register', {iLayout:0, user:null, bLogin:'false', messages:null, listOutputRecent:[], listOutputRank:[], ePublishing:global.ePublishing});
});


router.get('/login_m', async(req, res) => {

    res.render('login_m', {iLayout:1, messages:req.flash('error')[0], ePublishing:global.ePublishing});
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

    console.log(`/account/logout`);

    req.logout(async function (err) {
        if (err) {
          return next(err);
        }
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
    res.render('mypage', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});


router.post('/request_checkid', async (req, res) => {

    console.log('/request_checkid');
    console.log(req.body);

    const user = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( user == null )
        res.send({result:'OK'});
    else
        res.send({result:'Error'});
});

router.post('/request_checknickname', async (req, res) => {

    console.log('/request_checknickname');
    console.log(req.body);

    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user == null )
        res.send({result:'OK'});
    else
        res.send({result:'Error'});
});

router.post('/request_register', async (req, res) => {

    console.log('/request_register');
    console.log(req.body);

    try
    {
        let user = await db.Users.findOne({where:{strID:req.body.strRegisterID}});
        let user2 = await db.Users.findOne({where:{strNickname:req.body.strRegisterNickname}});
        if ( user != null || user2 != null )
        {
            res.send({result:'Error', eCode:'ExistUser'});
            return;
        }

        let parent = null;
        if ( req.body.strRegisterRecommender != '' )
        {
            parent = await db.Users.findOne({where:{strID:req.body.strRegisterRecommender, iClass:7}});
            if ( parent == null )
            {
                res.send({result:'Error', eCode:'InvalidParent'});
                return;
            }
        }
        else
        {
            parent = await db.Users.findOne({where:{strID:'rhkddksfl4'}});
            if ( parent == null )
            {
                res.send({result:'Error', eCode:'InvalidParent'});
                return;
            }
        }

        console.log(`##### Error Registration`);

        await db.Users.create({
            strID:req.body.strRegisterID,
            strPassword:req.body.strRegisterPassword,
            strNickname:req.body.strRegisterNickname,
            strMobile:req.body.strRegisterMobile,
            strBankname:req.body.strRegisterBankName,
            strBankAccount:req.body.strRegisterBankAccount,
            strBankOwner:req.body.strRegisterBankAccountHolder,
            strBankPassword:'',
            strOutputPassowrd:'',
            iClass:8,
            strGroupID:parent.strGroupID,
            iParentID:parent.id,
            iCash:0,
            iLoan:0,
            iRolling:0,
            iSettle:0,
            iSettleAcc:0,
            fBaccaratR:0,
            fSlotR:0,
            fUnderOverR:0,
            fPBR:0,
            fPBSingleR:0,
            fPBDoubleR:0,
            fPBTripleR:0,
            fSettleSlot:0,
            fSettleBaccarat:0,
            fSettlePBA:0,
            fSettlePBB:0,
            eState:'BLOCK',
            //strOptionCode:'00000000',
            strOptionCode:'00000000',
            strPBOptionCode:'00000000',
            iPBLimit:0,
            iPBSingleLimit:0,
            iPBDoubleLimit:0,
            iPBTripleLimit:0,
            strSettleMemo:'',
            iNumLoginFailed: 0,
            iPermission:0,
            iLoginMax:1
        });

        res.send({result:'OK'});
    }
    catch 
    {
        res.send({result:'Error'});
    }
});

module.exports = router;