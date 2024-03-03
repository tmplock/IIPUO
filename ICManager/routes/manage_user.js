const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

let realtime_userlist = [];

const db = require('../models');
const ITime = require('../utils/time');

const axios = require('axios');

const IInout = require('../implements/inout');

const moment = require('moment');

const {Op}= require('sequelize');

const IAgent = require('../implements/agent');
const IAgent2 = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const { isNumberObject } = require('util/types');

// let GetUserList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {
//
//     let tagSearch = '';
//     if ( strSearchNickname != undefined && strSearchNickname != '' )
//         tagSearch = `AND t6.strNickname='${strSearchNickname}'`;
//
//     const [result] = await db.sequelize.query(
//         `
//         SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t5.strNickname as lev5, t6.strNickname as lev6, t6.iClass, t6.strID, t6.strNickname,
//         t6.iCash, t6.iClass, t6.strGroupID, t6.eState, t6.createdAt, t6.loginedAt, t6.strIP,
//         IFNULL(charges.iInput,0) AS iInput,
//         IFNULL(exchanges.iOutput,0) AS iOutput,
//         IFNULL(dailyBetting.iMyRollingMoney,0) AS iMyRollingMoney,
//         IFNULL((SELECT sum(iBBetting + iUOBetting + iSlotBetting + iPBBetting)-sum(iBWin + iUOWin + iSlotWin + iPBWin) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t6.strGroupID,'%') AND t6.strID = strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
//         t6.iRolling AS iCurrentRolling,
//         t6.iLoan
//         FROM Users AS t1
//         LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
//         LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
//         LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
//         LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
//         LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'INPUT'
//                     GROUP BY strID) charges
//                 ON t6.strNickname = charges.strID
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'OUTPUT'
//                     GROUP BY strID) exchanges
//                 ON t6.strNickname = exchanges.strID
//         LEFT JOIN ( SELECT strID, sum(iRollingUser) as iMyRollingMoney
//                     FROM DailyBettingRecords
//                     where DATE(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     GROUP BY strID) dailyBetting
//                 ON t6.strID = dailyBetting.strID
//         WHERE t6.iClass=${IAgent.EAgent.eUser} AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
//         `
//         );
//         return result;
// }
//
// let GetShopList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {
//
//     let tagSearch = '';
//     if ( strSearchNickname != undefined && strSearchNickname != '' )
//         tagSearch = `AND t5.strNickname='${strSearchNickname}'`;
//
//     const [result] = await db.sequelize.query(
//         `
//         SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t5.strNickname as lev5, t5.strNickname as lev6, t5.iClass, t5.strID, t5.strNickname,
//         t5.iCash, t5.iClass, t5.strGroupID, t5.eState, t5.createdAt, t5.loginedAt, t5.strIP,
//         IFNULL(charges.iInput,0) AS iInput,
//         IFNULL(exchanges.iOutput,0) AS iOutput,
//         IFNULL((SELECT sum(iSelfRollingShop) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t5.strGroupID,'%') AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
//         IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t5.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
//         t5.iRolling AS iCurrentRolling,
//         t5.iLoan
//         FROM Users AS t1
//         LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
//         LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
//         LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
//         LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'INPUT'
//                     GROUP BY strID) charges
//                 ON t5.strNickname = charges.strID
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'OUTPUT'
//                     GROUP BY strID) exchanges
//                 ON t5.strNickname = exchanges.strID
//         WHERE t5.iClass=${IAgent.EAgent.eShop} AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
//         `
//         );
//         return result;
// }
//
// let GetAgentList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {
//
//     let tagSearch = '';
//     if ( strSearchNickname != undefined && strSearchNickname != '' )
//         tagSearch = `AND t4.strNickname='${strSearchNickname}'`;
//
//     const [result] = await db.sequelize.query(
//         `
//         SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t4.strNickname as lev4, t4.strNickname as lev5, t4.strNickname as lev6, t4.iClass, t4.strID, t4.strNickname,
//         t4.iCash, t4.iClass, t4.strGroupID, t4.eState, t4.createdAt, t4.loginedAt, t4.strIP,
//         IFNULL(charges.iInput,0) AS iInput,
//         IFNULL(exchanges.iOutput,0) AS iOutput,
//         IFNULL((SELECT sum(iSelfRollingAgent) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t4.strGroupID,'%') AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
//         IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t4.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
//         t4.iRolling AS iCurrentRolling,
//         t4.iLoan
//         FROM Users AS t1
//         LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
//         LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
//         LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'INPUT'
//                     GROUP BY strID) charges
//                 ON t4.strNickname = charges.strID
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'OUTPUT'
//                     GROUP BY strID) exchanges
//                 ON t4.strNickname = exchanges.strID
//         WHERE t4.iClass=${IAgent.EAgent.eAgent} AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
//         `
//         );
//         return result;
// }
//
// let GetViceAdminList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {
//
//     let tagSearch = '';
//     if ( strSearchNickname != undefined && strSearchNickname != '' )
//         tagSearch = `AND t3.strNickname='${strSearchNickname}'`;
//
//     const [result] = await db.sequelize.query(
//         `
//         SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t3.strNickname as lev4, t3.strNickname as lev5, t3.strNickname as lev6, t3.iClass, t3.strID, t3.strNickname,
//         t3.iCash, t3.iClass, t3.strGroupID, t3.eState, t3.createdAt, t3.loginedAt, t3.strIP,
//         IFNULL(charges.iInput,0) AS iInput,
//         IFNULL(exchanges.iOutput,0) AS iOutput,
//         IFNULL((SELECT sum(iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strGroupID LIKE CONCAT(t3.strGroupID,'%') AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
//         IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t3.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
//         t3.iRolling AS iCurrentRolling,
//         t3.iLoan
//         FROM Users AS t1
//         LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
//         LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'INPUT'
//                     GROUP BY strID) charges
//                 ON t3.strNickname = charges.strID
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'OUTPUT'
//                     GROUP BY strID) exchanges
//                 ON t3.strNickname = exchanges.strID
//         WHERE t3.iClass=${IAgent.EAgent.eViceAdmin} AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
//         `
//         );
//         return result;
// }
//
// let GetProAdminList = async (strTimeStart, strTimeEnd, strGroupID, strSearchNickname) => {
//
//     let tagSearch = '';
//     if ( strSearchNickname != undefined && strSearchNickname != '' )
//         tagSearch = `AND t3.strNickname='${strSearchNickname}'`;
//
//     const [result] = await db.sequelize.query(
//         `
//         SELECT t1.strNickname AS lev1, t2.strNickname as lev2, t3.strNickname as lev3, t3.strNickname as lev4, t3.strNickname as lev5, t3.strNickname as lev6, t3.iClass, t3.strID, t3.strNickname,
//         t3.iCash, t3.iClass, t3.strGroupID, t3.eState, t3.createdAt, t3.loginedAt, t3.strIP,
//         0 AS iInput,
//         0 AS iOutput,
//         IFNULL((SELECT sum(iSelfRollingVAdmin) FROM DailyBettingRecords WHERE strID = t3.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iMyRollingMoney,
//         IFNULL((SELECT sum(iSelfBBetting + iSelfUOBetting + iSelfSlotBetting + iSelfPBBetting)-sum(iSelfBWin + iSelfUOWin + iSelfSlotWin + iSelfPBWin) FROM DailyBettingRecords WHERE strID = t3.strID AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'),0) as iTotal,
//         t3.iRolling AS iCurrentRolling,
//         t3.iLoan
//         FROM Users AS t1
//         LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
//         LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iInput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'INPUT'
//                     GROUP BY strID) charges
//                 ON t3.strNickname = charges.strID
//         LEFT JOIN ( SELECT strID, sum(iAmount) as iOutput
//                     FROM Inouts
//                     where DATE(completedAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
//                     AND eState = 'COMPLETE'
//                     AND eType = 'OUTPUT'
//                     GROUP BY strID) exchanges
//                 ON t3.strNickname = exchanges.strID
//         WHERE t3.iClass=${IAgent.EAgent.eProAdmin} AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%')${tagSearch};
//         `
//     );
//     return result;
// }

router.get('/userlist', isLoggedIn, async(req, res) => {

    console.log(req.user);
    const dbuser = await db.Users.findOne({where:{strNickname:req.user.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:iCash,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = await IAgent2.GetUserList(strTimeStart, strTimeEnd, user.strGroupID);
    let listShops = await IAgent2.GetShopList(strTimeStart, strTimeEnd, user.strGroupID);
    let listAgents = await IAgent2.GetAgentList(strTimeStart, strTimeEnd, user.strGroupID);
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
            total.iTotalCash += parseInt(result[i].iCash);
    }
    //  Shops
    var bobj = {overview:null};

    const agentinfo = await IAgent2.GetPopupAgentInfo(req.user.strGroupID, parseInt(req.user.iClass), req.user.strNickname);

    console.log(`###################################################### ${req.user.iClass}, ${req.user.strNickname}`);
    console.log(agentinfo);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_user/list', {iLayout:0, iHeaderFocus:1, user:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, total:total, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/userlist', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = await IAgent2.GetUserList(strTimeStart, strTimeEnd, user.strGroupID);
    let listShops = await IAgent2.GetShopList(strTimeStart, strTimeEnd, user.strGroupID);
    let listAgents = await IAgent2.GetAgentList(strTimeStart, strTimeEnd, user.strGroupID);
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
            total.iTotalCash += parseInt(result[i].iCash);
    }

    const agentinfo = await IAgent2.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    let overview = await IAgent2.CalculateBettingRecord(user.strGroupID, user.iClass, strTimeStart, strTimeEnd, '', agentinfo.strID);
    let bobj = {overview:overview};
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    res.render('manage_user/list', {iLayout:0, iHeaderFocus:1, user:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, total:total, data:bobj, agentinfo:agentinfo, iocount:iocount});
});

router.post('/realtimeuserlist', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash,
                        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const agentinfo = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);
    console.log(`ic : ${iocount.input}, oc : ${iocount.output}`);

    res.render('manage_user/realtimeuserlist', {iLayout:0, iHeaderFocus:1, user:user, agentinfo:agentinfo, iocount:iocount});
});

router.post('/request_userlist', isLoggedIn, async ( req, res ) => {

    console.log(`/request_userlist : ${req.body.dateStart}, ${req.body.dateEnd}`);

    let result = await IAgent2.GetUserList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    let listShops = await IAgent2.GetShopList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    let listAgents = await IAgent2.GetAgentList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    // let listViceAdmins = await GetViceAdminList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);
    // let listProAdmins = await GetProAdminList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, req.body.strSearchNickname);

    res.send({userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:[], proadminlist: [], iRootClass: req.user.iClass, iPermission: req.user.iPermission});
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

    console.log(`################################################## /request_realtimeuserlist`);
    let list = GetNicknameList(req.body.strGroupID, realtime_userlist);
    let listClass = GetClassList(req.body.strGroupID, realtime_userlist);
    console.log(req.body);
    let result = [];

    for ( let i in realtime_userlist )
    {
        if ( realtime_userlist[i].iClass == 5 )
        {
            let list = await IAgent2.GetViceAdminList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
        else if ( realtime_userlist[i].iClass == 6 )
        {
            let list = await IAgent2.GetAgentList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
        else if ( realtime_userlist[i].iClass == 7 )
        {
            let list = await IAgent2.GetShopList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
        else if ( realtime_userlist[i].iClass == 8 )
        {
            let list = await IAgent2.GetUserList(req.body.dateStart, req.body.dateEnd, req.body.strGroupID, realtime_userlist[i].strNickname);

            for ( let i in list )
            {
                result.push(list[i]);
            }
        }
    }

    res.send({userlist:result});
});

router.post('/request_removeuser', async (req, res) => {

    console.log(`/request_removeuser`);
    console.log(req.body);

    let dateStart = ITime.GetDay(ITime.getCurrentDate(), -45);
    let dateEnd = ITime.GetDay(ITime.getCurrentDate(), 0);

    console.log(`${req.body.strNickname}, ${dateStart}, ${dateEnd}`);

    let target = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( target == null || (target != null && target.iCash > 0)) {
        res.send({result:'ERROR'});
        return;
    }

    let listBettings = await db.BettingRecords.findAll({ 
        where: {  
            createdAt:{
                [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:req.body.strNickname,
            iComplete:1
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

    axios.post(`${global.strUserPageAddress}/realtime_user`)
    .then((response)=> {
        console.log(`Axios Success /realtime_user : `);
    })
    .catch((error)=> {
    });

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

    realtime_userlist = [];
    for ( let i in req.body )
    {
        realtime_userlist.push({strGroupID:req.body[i].strGroupID, strNickname:req.body[i].strNickname, iClass:req.body[i].iClass});

        console.log(`${i} : ${req.body[i].strNickname}, ${req.body[i].strGroupID}`);
    }

    for ( let i in global.socket_list )
    {
        console.log(`socket ${i} : ${global.socket_list[i].strGroupID}`);

        const cNumUser = GetNumUser(global.socket_list[i].strGroupID, req.body);

        global.socket_list[i].emit('realtime_user', cNumUser);
    }

    res.send('OK');
});

router.post('/logout', isLoggedIn, async (req, res) => {
    let strNickname = req.body.strNickname ?? '';

    let user = await db.Users.findOne({where:{strNickname:strNickname}});
    let strURL = user.strURL;
    if (user != null && user.strURL != null) {
        axios.post(`${strURL}/realtime_user_logout`, {'strID' : user.strID})
            .then((response)=> {
                console.log(`Axios Success /realtime_user_logout : `);
            })
            .catch((error)=> {
                console.log(error);
            });
    }

    res.send({'result' : true});
});

module.exports = router;