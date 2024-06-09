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

router.post('/detail', isLoggedIn, async(req, res) => {

    console.log(`/manage_bankaccount/detail`);
    console.log(req.body);

    let listRecordAccount = await db.RecordInoutAccounts.findAll({
        where: {
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:req.body.strID,
        },
        order:[['createdAt','DESC']]
    });

    res.render('manage_bankaccount/popup_detail', {iLayout:1, iHeaderFocus:0, list:listRecordAccount, dateStart:req.body.dateStart, dateEnd:req.body.dateEnd});

});

let BuildPartner = (objectUser, strOptionCode, listRecordAccount) => {

    console.log(`BuildPartner : ${listRecordAccount.length}`);

    let list = [];

    //let obj = await IAgent.GetParentList(objectUser.strGroupID, objectUser.iClass);

    let object = {strID:objectUser.strID, strGroupID:objectUser.strGroupID, iClass:objectUser.iClass, iNumRequest:0, iNumValidInput:0, iNumInvalidInput:0, iNumStandbyInput:0, strAdminNickname:'', strPAdminNickname:'', strVAdminNickname:'', strAgentNickname:'', strShopNickname:'', strNickname:objectUser.strNickname, strOptionCode:strOptionCode};

    for ( let i in listRecordAccount )
    {
        if ( listRecordAccount[i].strID == objectUser.strID )
        {
            list.push(listRecordAccount[i]);
            object.strAdminNickname = listRecordAccount[i].strAdminNickname;
            object.strPAdminNickname = listRecordAccount[i].strPAdminNickname;
            object.strVAdminNickname = listRecordAccount[i].strVAdminNickname;
            object.strAgentNickname = listRecordAccount[i].strAgentNickname;
            object.strShopNickname = listRecordAccount[i].strShopNickname;
        }
    }


    for ( let i in list )
    {
        if ( list[i].eType == 'REQUEST' )
            object.iNumRequest ++;
        else if ( list[i].eType == 'INPUT' && list[i].eState == 'VALID' )
            object.iNumValidInput ++;
        else if ( list[i].eType == 'INPUT' && list[i].eState == 'INVALID' )
            object.iNumInvalidInput ++;
        else if ( list[i].eType == 'INPUT' && list[i].eState == 'STANDBY' )
            object.iNumStandbyInput ++;
    }

    return object;
}

router.post('/request_partner', isLoggedIn, async (req, res) => {

    console.log(`/request_partner`);
    console.log(req.body);

    let listPartner = await db.Users.findAll({
        where:{
            iClass:req.body.iClass,
            strGroupID: {
                [Op.like]:`${req.body.strGroupID}%`
            }
        },
        order:[['updatedAt','DESC']]
    });

    let listRecordAccount = await db.RecordInoutAccounts.findAll({
        where: {
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strGroupID: {
                [Op.like]:`${req.body.strGroupID}%`
            }
        },
        order:[['createdAt','DESC']]
    });

    let list = [];
    for ( let i in listPartner )
    {
        const object = BuildPartner(listPartner[i], listPartner[i].strOptionCode, listRecordAccount);
        if ( object.iNumRequest == 0 && object.iNumInvalidInput == 0 && object.iNumStandbyInput == 0 && object.iNumValidInput == 0 )
            continue;
        
        list.push(object);   
    }

    res.send({result:'OK', list:list});
});

router.post('/request_updategrade', isLoggedIn, async (req, res) => {

    console.log(`/request_updategrade`);
    console.log(req.body.data);

    const str = req.body.data;
    const array = str.split(',');

    for ( let i in array )
    {
        let a2 = array[i].split(':');
        
        await db.Users.update({strOptionCode:a2[1]}, {where:{strID:a2[0]}});
    }

    //console.log(list);

    res.send({result:'OK'});
});

module.exports = router;