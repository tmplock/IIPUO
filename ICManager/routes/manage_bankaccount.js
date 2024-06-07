const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));


const axios = require('axios');
const db = require('../models');
const IInout = require('../implements/inout');
const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const ITime = require('../utils/time');

const ISocket = require('../implements/socket');
const IAgent = require("../implements/agent3");
const moment = require("moment");


router.post('/account', isLoggedIn, async(req, res) => {
    console.log(req.body);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    console.log(user);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};


    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, user.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);
    

    res.render('manage_bankaccount/account', {iLayout:0, iHeaderFocus:9, user:user, agent:agent, iocount:iocount, strParent:strParent});

});

module.exports = router;