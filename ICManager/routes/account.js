const express = require('express');
const passport = require('passport');
const router = express.Router();

const requestip = require('request-ip');
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.use(express.static(path.join(__dirname, '../', 'public')));

// const db = require('../models');
const db = require('../models');
const time = require('../utils/time');

const {Op}= require('sequelize');

const {isLoggedIn, isNotLoggedIn} = require('./middleware');


//  #####
const { default: axios2 } = require('axios');

let RequestAxios = async (strAddress, objectData) =>
{
    console.log(`RequestAxios ${strAddress}`);
    console.log(objectData);

    try {

        const customAxios = axios2.create({});
        const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json'}});

        return response.data;
        //console.log(response.data);
        // if ( response.data.eResult == 'OK' )
        //     return {result:'OK', data:response.data};
        // else
        //     return {result:'error', error:response.data.error};    
    }
    catch (error) {
        console.log('axios error', error);
        return {result:'error', error:'axios'};
    }
}
//

//
router.get('/login', async(req, res) => {
    res.render('account/login', {iLayout:1, messages:req.flash('error')[0]});
});

router.post('/login', passport.authenticate('local', {
    //successRedirect: '/manage_partner/betting_realtime',
    // successRedirect: '/manage_partner/default',
    successRedirect:'/account/loginsuccess',
    failureRedirect:'/account/login',
    failureFlash: true
}), (req, res) => {

    console.log(`post : /account/login : req.session.messages}`);
});

router.get('/loginsuccess', async (req, res) => {

    console.log(`################################################## /account/loginsuccess`);

    let strIP = requestip.getClientIp(req);

    const objectResult = await RequestAxios(`${global.strAPIAddress}/account/login`, {eType:'CMS', strID:req.user.strID, strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:req.user.iClass, strIP:strIP});

    console.log(objectResult);

    if ( objectResult.result == 'OK' )
    {
        res.redirect('/');        
    }
    else
    {
        res.redirect('/account/login');
    }
});

// router.post('/login_viceadmin', passport.authenticate('local_viceadmin', {
//     successRedirect: '/manage_partner/betting_realtime',    
//     failureRedirect: '/account/login',
//     failureFlash: true
// }), (req, res) => {

//     console.log(req.body);

//     console.log(`post : /account/login : req.session.messages}`);
// });

router.get('/logout', isLoggedIn, (req, res) => {
    // //req.session.destroy();
    // //console.log('get : /account/logout');
    // req.logout();
    // req.session.save(function () {
    //     res.redirect('/account/login');
    // });
    if ( req.user != null )
    {
        const strID = req.user.strID;

        req.logout(async function (err) {
            if (err) {
                return next(err);
            }
    
            const objectResult = await RequestAxios(`${global.strAPIAddress}/account/logoutcomplete`, {eType:'CMS', strID:strID});
    
            // if you're using express-flash
            req.flash('success_msg', 'session terminated');
            res.redirect('/account/login');
            });
    
    }
});

router.post('/request_checklogout', async (req, res) => {

    // console.log(`/request_checklogout`);
    // console.log(req.body);

    if ( req.user != null )
    {
        const objectResult = await RequestAxios(`${global.strAPIAddress}/account/checklogout`, {eType:'CMS', strID:req.user.strID});

        console.log(objectResult);
    
        if ( objectResult.result == 'OK' )
        {
            res.send({result:'OK', iLogout:objectResult.iLogout});
        }
        else
        {
            res.send({result:'OK', iLogout:0});
        }
    }
    else
    {
        res.send({result:'OK', iLogout:0});
    }
});

module.exports = router;