const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

let realtime_userlist = [];
let realtime_site_map = new Map();

const db = require('../models');
const ITime = require('../utils/time');

const axios = require('axios');

const IInout = require('../implements/inout');

const moment = require('moment');

const {Op}= require('sequelize');

const IAgent = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const { isNumberObject } = require('util/types');

router.get('/userlist', isLoggedIn, async(req, res) => {

    console.log(req.user);
    const dbuser = await IAgent.GetUserInfo(req.user.strNickname);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = await IAgent.GetUserList(strTimeStart, strTimeEnd, user.strGroupID);
    let listShops = await IAgent.GetShopList(strTimeStart, strTimeEnd, user.strGroupID);
    let listAgents = await IAgent.GetAgentList(strTimeStart, strTimeEnd, user.strGroupID);
    let listViceAdmins = [];
    let listProAdmins = [];
    // let listViceAdmins = await GetViceAdminList(strTimeStart, strTimeEnd, user.strGroupID);
    // let listProAdmins = await  GetProAdminList(strTimeStart, strTimeEnd, user.strGroupID);

    let total = {iTotalCash:0};

    for ( let i in result )
    {
        if ( result[i].lev5 == null )
        {
            result.splice(i, 1);
        }
        else
            total.iTotalCash += parseFloat(result[i].iCash);
    }
    //  Shops
    var bobj = {overview:null};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.user.strGroupID, parseInt(req.user.iClass), req.user.strNickname);

    console.log(`###################################################### ${req.user.iClass}, ${req.user.strNickname}`);
    console.log(agentinfo);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_user/list', {iLayout:0, iHeaderFocus:1, user:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, total:total, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/userlist', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = await IAgent.GetUserList(strTimeStart, strTimeEnd, user.strGroupID);
    let listShops = await IAgent.GetShopList(strTimeStart, strTimeEnd, user.strGroupID);
    let listAgents = await IAgent.GetAgentList(strTimeStart, strTimeEnd, user.strGroupID);
    let listViceAdmins = [];
    let listProAdmins = [];
    // let listViceAdmins = await GetViceAdminList(strTimeStart, strTimeEnd, user.strGroupID);
    // let listProAdmins = await  GetProAdminList(strTimeStart, strTimeEnd, user.strGroupID);

    let total = {iTotalCash:0};

    for ( let i in result )
    {
        if ( result[i].lev5 == null )
        {
            result.splice(i, 1);
        }
        else
            total.iTotalCash += parseFloat(result[i].iCash);
    }

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let overview = await IAgent.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, '', agentinfo.strID);
    let bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_user/list', {iLayout:0, iHeaderFocus:1, user:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, total:total, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/realtimeuserlist', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
                        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_user/realtimeuserlist', {iLayout:0, iHeaderFocus:1, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/request_userlist', isLoggedIn, async ( req, res ) => {

    console.log(`/request_userlist : ${req.body.dateStart}, ${req.body.dateEnd}`);

    let result = await IAgent.GetUserList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    let listShops = await IAgent.GetShopList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    let listAgents = await IAgent.GetAgentList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    // let listViceAdmins = await GetViceAdminList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    // let listProAdmins = await GetProAdminList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);

    res.send({userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:[], proadminlist: [], iRootClass: req.user.iClass, iPermission: req.user.iPermission});
});

router.post('/request_userlistchangemoney', isLoggedIn, async ( req, res ) => {

    console.log(`/request_userlistchangemoney : ${req.body.dateStart}, ${req.body.dateEnd}`);

    let result = [];
    let listShops = [];
    let listAgents = [];
    let listViceAdmins = [];
    let listProAdmins = [];
    let listAdmins = [];
    if(req.body.iClass == 2)
    {
        // listProAdmins = await IAgent.GetAdminListChangeMoney(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
        listAdmins = await IAgent.GetAdminListChangeMoney(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    }
    else
    {
        listViceAdmins = await IAgent.GetViceAdminListChangeMoney(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
        result = await IAgent.GetUserList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
        listShops = await IAgent.GetShopListChangeMoney(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
        listAgents = await IAgent.GetAgentListChangeMoney(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    }

    res.send({userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist:listProAdmins, adminlist:listAdmins, iRootClass: req.user.iClass, iPermission: req.user.iPermission});
});

router.post('/changemoney', isLoggedIn, async(req, res) => {
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = [];
    let listShops = [];
    let listAgents = [];
    let listViceAdmins = [];
    let listProAdmins = [];
    let listAdmins = [];
    if(req.body.iClass == 2)
    {
        // listProAdmins = await IAgent.GetAdminListChangeMoney(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname);
        listAdmins = await IAgent.GetAdminListChangeMoney(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname);
    }
    else
    {
        listViceAdmins = await IAgent.GetViceAdminListChangeMoney(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname);
        result = await IAgent.GetUserList(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname);
        listShops = await IAgent.GetShopListChangeMoney(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname);
        listAgents = await IAgent.GetAgentListChangeMoney(strTimeStart, strTimeEnd, req.body.strGroupID, req.body.strSearchNickname);
    }

    let total = {iTotalCash:0};

    for ( let i in result )
    {
        if ( result[i].lev5 == null )
        {
            result.splice(i, 1);
        }
        else
            total.iTotalCash += parseFloat(result[i].iCash);
    }
    //  Shops
    var bobj = {overview:null};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    console.log(`###################################################### ${req.body.iClass}, ${req.body.strNickname}`);
    console.log(agentinfo);
    
    res.render('manage_user/changemoney', {iLayout:0, iHeaderFocus:10, user:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, adminlist:listAdmins, total:total, data:bobj, agentinfo:agentinfo, iocount:iocount});

});

router.post('/changemoneylist', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = await IAgent.GetUserInfo(req.body.strNickname);
    console.log(`######################################################################## ChangeMoney`);
    console.log(user);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, user.iClass);
    res.render('manage_user/changemoneylist', {iLayout:0, iHeaderFocus:10, user:agent, iocount:iocount});
});

let GetNicknameList = (strGroupID, listUsers) => {

    let list = [];

    for ( let i in listUsers ) {

        let str = listUsers[i].strGroupID.substring(0, strGroupID.length);
        
        if ( strGroupID == str )
            list.push(`'${listUsers[i].strNickname}'`);
    }

    return list;
}

let GetClassList = (strGroupID, listUsers) => {

    let list = [];

    for ( let i in listUsers ) {

        let str = listUsers[i].strGroupID.substring(0, strGroupID.length);
        
        if ( strGroupID == str )
            list.push(`${listUsers[i].iClass}`);
    }

    return list;
}

router.post('/request_realtimeuserlist', isLoggedIn, async ( req, res ) => {

    let list = GetNicknameList(req.body.strGroupID, realtime_userlist);
    let listClass = GetClassList(req.body.strGroupID, realtime_userlist);
    let result = [];

    for ( let i in realtime_userlist )
    {
        if ( realtime_userlist[i].iClass == 5 )
        {
            let list = await IAgent.GetViceAdminList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
        else if ( realtime_userlist[i].iClass == 6 )
        {
            let list = await IAgent.GetAgentList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
        else if ( realtime_userlist[i].iClass == 7 )
        {
            let list = await IAgent.GetShopList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
        else if ( realtime_userlist[i].iClass == 8 )
        {
            let list = await IAgent.GetUserList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
    }

    res.send({userlist:result, iPermission: req.user.iPermission, iClass: req.user.iClass});
});

router.post('/request_removeuser', async (req, res) => {

    console.log(`/request_removeuser`);
    console.log(req.body);

    if (req.user.iPermission != 0) {
        res.send({result:'ERROR'});
        return;
    }

    let dateStart = ITime.GetDay(ITime.getCurrentDate(), -45);
    let dateEnd = ITime.GetDay(ITime.getCurrentDate(), 0);

    console.log(`${req.body.strNickname}, ${dateStart}, ${dateEnd}`);

    let target = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( target == null || (target != null && target.iCash > 0)) {
        res.send({result:'ERROR'});
        return;
    }

    // 하부 유저 체크
    if (req.user.iClass >= target.iClass) {
        res.send({result: 'ERROR', msg:'권한이 없습니다'});
        return;
    }

    let listBettings = await db.RecordBets.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:target.strID,
        },
        order:[['createdAt','DESC']]
    });
    console.log(listBettings.length);

    if ( listBettings.length > 0 )
    {
        res.send({result:'ERROR'});
        return;
    }

    if (parseInt(req.body.iClass) < 8) {
        let listChilds = await db.Users.findAll({
            where:{
                strGroupID: {
                    [Op.like]: req.body.strGroupID+'%'
                },
                iClass: parseInt(target.iClass) + 1,
                iPermission: {
                    [Op.notIn]: [100]
                },
            }
        });

        if (listChilds.length > 0)
        {
            res.send({result:'ERROR'});
            return;
        }
    }

    await db.Users.destroy({where:{strNickname:req.body.strNickname}});
    res.send({result:'OK'});
});

setInterval(async () => {
    let list = await db.sequelize.query(`
        SELECT DISTINCT strURL FROM Users WHERE strURL IS NOT NULL 
    `);
    if (list.length > 0) {
        let urls = list[0];
        for (let i in urls) {
            axios.post(`${urls[i].strURL}/realtime_user`)
                .then((response)=> {
                    console.log(`Axios Success /realtime_user : `);
                })
                .catch((error)=> {
                });
        }
    }
}, 3000);

let GetNumUser = (strGroupID, listUsers) => {

    let iNum = 0;

    for ( let i in listUsers ) {

        let str = listUsers[i].strGroupID.substring(0, strGroupID.length);
        
        if ( strGroupID == str )
            ++ iNum;
    }

    return iNum;
}

router.post('/realtime_user', (req, res) => {

    if ( req.user != undefined && req.user != null )
    {
        console.log(`/manage_user/realtime_user ${req.user.strGroupID}`);
    }

    try {
        let userlist = [];
        for ( let i in req.body )
        {
            userlist.push({strURL:req.headers.host, strGroupID:req.body[i].strGroupID, strNickname:req.body[i].strNickname, iClass:req.body[i].iClass});
        }

        let key = req.headers.host ?? '';
        realtime_site_map[key] = userlist;

        // 재 계산
        realtime_userlist = [];
        for (let i in realtime_site_map) {
            for (let j in realtime_site_map[i]) {
                realtime_userlist.push(realtime_site_map[i][j]);
            }
        }
    } catch (err) {

    }

    for ( let i in global.socket_list )
    {
        try {
            console.log(`socket ${i} : ${global.socket_list[i].strGroupID}`);

            const cNumUser = GetNumUser(global.socket_list[i].strGroupID, realtime_userlist);

            global.socket_list[i].emit('realtime_user', cNumUser);
        } catch (err) {

        }
    }

    res.send('OK');
});

router.post('/logout', async (req, res) => {
    if (req.user.iClass <= 3 && req.user.iPermission == 0) {
        let strNickname = req.body.strNickname ?? '';
        let user = await db.Users.findOne({where:{strNickname:strNickname}});
        let strURL = global.strAPIAddress ?? '';
        if (user != null && strURL != null && strURL.length > 0) {
            axios.post(`${strURL}/account/insertlogout`, {eType:'USER', strID:user.strID})
                .then((response)=> {
                    console.log(`Axios Success /account/insertlogout : `);
                    res.send({'result' : true, msg:'로그아웃처리 성공'});
                })
                .catch((error)=> {
                    console.log(error);
                    res.send({'result' : false, msg:'로그아웃처리 실패'});
                });
            return;
        }
    }
    res.send({'result' : false, msg:'로그아웃처리 실패'});

});

module.exports = router;