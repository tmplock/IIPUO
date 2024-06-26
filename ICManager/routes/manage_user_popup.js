const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));
const axios = require('axios');
const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
//const db = require('../db');
const ITime = require('../utils/time');
const ISocket = require('../implements/socket');

const {Op}= require('sequelize');
const IAgent = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');

router.post('/userinfo', isLoggedIn, async(req, res) => {

    console.log(`/manage_user_popup/userinfo`);
    console.log(req.body);

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if (req.user.iClass != 7) {
        user.strPassword = null;
    }
    user.iRootClass = req.user.iClass;
    user.iPermission = req.user.iPermission;
    user.strOddPassword = null;
    user.strInoutPassword = null;
    user.strMobile = null;
    user.strBankname = null;
    user.strBankAccount = null;
    user.strBankOwner = null;
    user.strBankPassword = null;

    const sid = req.user.strID;
    let iC = await db.Users.findOne({where:{strID:req.user.strID}});
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);

    const iRootClass = req.user.iClass;

    res.render('manage_user/popup_userinfo', {iLayout:3, iHeaderFocus:0, agent:user, iClass:iC.iClass, pw_auth:iC.pw_auth, parents:parents, iPermission: iC.iPermission, iRootClass: iRootClass});
});

router.post('/input', isLoggedIn, async(req, res) => {

    console.log('/input');
    console.log(req.body);

    //const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iPermission = req.user.iPermission;

    var list = await db.Inouts.findAll({ where: { 
        strID:req.body.strNickname,
        eType:'INPUT',
        strGroupID:{
            [Op.like]:req.user.strGroupID+'%'
        }
    }});
    console.log(list.length);

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);

    res.render('manage_user/popup_input', {iLayout:3, iHeaderFocus:1, agent:user, list:list, parents:parents});
});

router.post('/output', isLoggedIn, async(req, res) => {

    console.log(req.body);

    //const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iPermission = req.user.iPermission;

    var list = await db.Inouts.findAll({ where: { 
        strID:req.body.strNickname,
        eType:'OUTPUT',
        strGroupID:{
             [Op.like]:req.user.strGroupID+'%'
         }
    }});
    console.log(list.length);

    var overview = await IAgent.CalculateDailyBettingRecord(0, req.body.strGroupID, req.body.iClass);
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);

    res.render('manage_user/popup_output', {iLayout:3, iHeaderFocus:2, agent:user, list:list, overview:overview, parents:parents});
});

router.post('/pointrecord', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iPermission = req.user.iPermission;

    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);

    res.render('manage_user/popup_pointrecord', {iLayout:3, iHeaderFocus:3, agent:user, parents:parents});
});

router.post('/bettingrecord', isLoggedIn, async(req, res) => {

    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iPermission = req.user.iPermission;

    const strTimeStart = ITime.getCurrentDate();
    const strTimeEnd = ITime.getCurrentDate();

    console.log(`/bettingrecord`);
    console.log(`${strTimeStart}, ${strTimeEnd}, ${req.body.strNickname}`);

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    //var overview = await IAgent.CalculateSelfBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, user.strNickname, user.strID);
    var overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, user.strNickname, user.strID);
    
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);

    res.render('manage_user/popup_bettingrecord', {iLayout:3, iHeaderFocus:4, agent:user, overview:overview, parents:parents});
});

// router.post('/notelist', isLoggedIn, async(req, res) => {

//     console.log(req.body);

//     //const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
//     const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

//     res.render('manage_user/popup_notelist', {iLayout:3, iHeaderFocus:5, agent:user});

// });

// router.post('/memo', isLoggedIn, async(req, res) => {

//     console.log(req.body);

//     //const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
//     const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

//     res.render('manage_user/popup_memo', {iLayout:3, iHeaderFocus:6, agent:user});

// });

//  Ajax

router.post('/translate', isLoggedIn, async(req, res) => {

    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    const strTimeStart = '2022-02-01';
    const strTimeEnd = '2022-02-28';

    var list = await db.Inouts.findAll({ where: { 
        createdAt:{
            [Op.gt]:strTimeStart,
            [Op.lt]:strTimeEnd
        },
        strID:req.body.strNickname

        // strGroupID:{
        //     [Op.like]:strGroupID+'%'
        // }
    }});
    console.log(list.length);

    res.render('manage_user/popup_translate', {iLayout:1, iHeaderFocus:1, agent:user, list:list});
});

router.post('/changemoney', isLoggedIn, async(req, res) => {
    console.log(req.user);
    const dbuser = await IAgent.GetUserInfo(req.user.strNickname);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission, strID: dbuser.strID};

    const strTimeStart = ITime.getTodayStart();
    const strTimeEnd = ITime.getTodayEnd();

    let result = [];
    let listShops = [];
    let listAgents = [];
    let listViceAdmins = [];
    let listProAdmins = [];

    if(dbuser.iClass == 2 )
    {
        listProAdmins = await IAgent.GetProAdminList(strTimeStart, strTimeEnd, user.strGroupID);
    }
    else
    {
        result = await IAgent.GetUserList(strTimeStart, strTimeEnd, user.strGroupID);
        listShops = await IAgent.GetShopListChangeMoney(strTimeStart, strTimeEnd, user.strGroupID);
        listAgents = await IAgent.GetAgentListChangeMoney(strTimeStart, strTimeEnd, user.strGroupID);
    }
    
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
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, user);

    console.log(`###################################################### ${req.user.iClass}, ${req.user.strNickname}`);
    console.log(agentinfo);

    res.render('manage_user/popup_changemoney', {iLayout:3, iHeaderFocus:0, agent:user, userlist:result, shoplist:listShops, agentlist:listAgents, vadminlist:listViceAdmins, proadminlist: listProAdmins, total:total, data:bobj, agentinfo:agentinfo, parents:parents});

});

// router.post('/changemoney', isLoggedIn, async(req, res) => {
//     console.log(req.body);
//     const user = await IAgent.GetUserInfo(req.body.strNickname);
//     console.log(`######################################################################## ChangeMoney`);
//     console.log(user);
//     let useroObject = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
//         iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};
//     res.render('manage_user/popup_changemoney', {iLayout:1, iHeaderFocus:0, user:useroObject});

// });

// router.post('/changemoneylist', isLoggedIn, async(req, res) => {
//     console.log(req.body);
//     const user = await IAgent.GetUserInfo(req.body.strNickname);
//     console.log(`######################################################################## ChangeMoney`);
//     console.log(user);
//     let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
//         iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};
//     res.render('manage_user/popup_changemoneylist', {iLayout:1, iHeaderFocus:0, user:agent});
// });

router.post('/changemoneydetail', isLoggedIn, async(req, res) => {
    console.log(req.body);
    console.log(`######################################################################## changemoneylist`);
    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:parseInt(req.user.iClass), iPermission: req.user.iPermission};
    res.render('manage_user/popup_changemoneydetail', {iLayout:1, iHeaderFocus:0, user:user, strSearch:req.body.strNickname});
});

router.post('/request_targetclassagentlist', isLoggedIn, async(req, res) => {
    console.log(req.body);
    
    if ( req.body.eType == 'GIVE' )
    {
        let list = await db.Users.findAll({
            // attributes:['strNickname', db.sequelize.col('strNickname')],
            attributes:['strNickname', db.sequelize.col('strNickname'), 'iCash', db.sequelize.col('iCash'), 'iRolling', db.sequelize.col('iRolling'), 'iSettle', db.sequelize.col('iSettle')],
            where:{
                strGroupID:{
                    [Op.like]:req.body.strGroupID+'%'
                },
                iClass:parseInt(req.body.iTargetClass),
                iPermission: {
                    [Op.notIn]: [100]
                },
            }
        });
        res.send(list);
    }
    else
    {
        //  매장일 경우 모든 유저의 것을 차감 할수 있다.
        // 매장 보다 높은 매장에서는 차감이 불가한가??(확인 필요)
        if ( req.body.iClass == 7 )
        {
            let list = await db.Users.findAll({
                attributes:['strNickname', db.sequelize.col('strNickname'), 'iCash', db.sequelize.col('iCash'), 'iRolling', db.sequelize.col('iRolling'), 'iSettle', db.sequelize.col('iSettle')],
                where:{
                    strGroupID:{
                        [Op.like]:req.body.strGroupID+'%'
                    },
                    iClass:parseInt(req.body.iTargetClass),
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                }
            });        
            res.send(list);
        }
        else 
        {
            let temp = await db.GTs.findAll({
                attributes:['strTo', db.sequelize.col('strTo'), 'strTo'],
                where:{
                    strFrom:req.body.strNickname
                }
            });
            console.log(temp.length);
            console.log(temp);
    
            let list = await db.Users.findAll({
                attributes:['strNickname', db.sequelize.col('strNickname'), 'iCash', db.sequelize.col('iCash'), 'iRolling', db.sequelize.col('iRolling'), 'iSettle', db.sequelize.col('iSettle')],
                where:{
                    strGroupID:{
                        [Op.like]:req.body.strGroupID+'%'
                    },
                    iClass:parseInt(req.body.iTargetClass),
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                }
            });
    
            let return_array = [];
    
            for ( let j in list)
            {
                for ( let i in temp ) {
                    if ( list[j].strNickname == temp[i].strTo ) {
    
                        let bFound = false;
                        for ( let k in return_array)
                        {
                            if ( return_array[k].strNickname == list[j].strNickname )
                            {
                                bFound = true;
                            }
                        }
                        if ( false == bFound )
                            return_array.push({strNickname:list[j].strNickname, iCash:list[j].iCash, iRolling:list[j].iRolling, iSettle:list[j].iSettle});
                    }
                }
            }
    
            res.send(return_array);
        }


        // let list = await db.Users.findAll({
        //     attributes:['strNickname', db.sequelize.col('strNickname')],
        //     where:{
        //         strGroupID:{
        //             [Op.like]:req.body.strGroupID+'%'
        //         },
        //         iClass:parseInt(req.body.iTargetClass)
        //     }
        // });        
        // res.send(list);
    }
})

router.post('/request_gt', isLoggedIn, async(req, res) => {
    console.log(req.body);
    
    if ( req.body.eType == 'GIVE' )
    {
        
        // if (req.user.iClass == 3 || req.user.iPermission == 100) {
        //     res.send({result:'FAIL', reason:''});
        //     return;
        // }

        let to = await db.Users.findOne({where:{strNickname:req.body.strTo}});
        let from = await db.Users.findOne({where:{strNickname:req.body.strFrom}});

        let cAmount = parseInt(req.body.iAmount);
        if (Number.isNaN(cAmount)) {
            cAmount = 0;
        }

        if (cAmount <= 0) {
            res.send({result:'FAIL', reason:''});
            return;
        }

        if ( to != null && from != null )
        {
            console.log(`FROM : ${from.iCash}, TO : ${to.iCash}`);

            if ( from.iCash >= cAmount || from.iClass == IAgent.EAgent.eHQ)
            {
                const iBeforeCashTo = parseFloat(to.iCash);
                const iAfterCashTo = iBeforeCashTo+cAmount;
                //await to.update({iCash:iAfterCashTo});
                await db.Users.update({iCash:iAfterCashTo}, {where:{strNickname:req.body.strTo}});

                const iBeforeCashFrom = parseFloat(from.iCash);
                const iAfterCashFrom = iBeforeCashFrom - cAmount;
                if ( from.iClass != IAgent.EAgent.eHQ ) {
                    //await from.update({iCash:iAfterCashFrom});

                    await db.Users.update({iCash:iAfterCashFrom}, {where:{strNickname:req.body.strFrom}});
                }

                await db.GTs.create({
                    eType:'GIVE',
                    strTo:req.body.strTo,
                    strFrom:req.body.strFrom,
                    iAmount:cAmount,
                    iBeforeAmountTo:iBeforeCashTo,
                    iAfterAmountTo:iAfterCashTo,
                    iBeforeAmountFrom:iBeforeCashFrom,
                    iAfterAmountFrom:iAfterCashFrom,
                    iClassTo: to.iClass,
                    iClassFrom: from.iClass,
                });
                res.send({result:'OK', cash:from.iCash, rolling:from.iRolling, settle:from.iSettle});

                ISocket.AlertCashByNickname(req.body.strFrom, iAfterCashFrom);
                ISocket.AlertCashByNickname(req.body.strTo, iAfterCashTo);

                let objectAxios = {strNickname:req.body.strTo, iAmount:iAfterCashTo};
                axios.post(`${to.strURL}/UpdateCoin`, objectAxios)
                .then((response)=> {
                })
                .catch((error)=> {
                });
            }
            else {
                res.send({result:'FAIL', reason:'NOTENOUGH'});
            }
        }
    }
    else if ( req.body.eType == 'TAKE' )
    {
        // if (req.user.iClass == 3 || req.user.iPermission == 100) {
        //     res.send({result:'FAIL', reason:''});
        //     return;
        // }

        let to = await db.Users.findOne({where:{strNickname:req.body.strTo}});
        let from = await db.Users.findOne({where:{strNickname:req.body.strFrom}});

        const iFromCash = from.iCash + parseInt(req.body.iAmount);
        const iToCash = to.iCash - parseInt(req.body.iAmount);

        let cAmount = parseInt(req.body.iAmount);
        if (Number.isNaN(cAmount)) {
            cAmount = 0;
        }

        if (cAmount <= 0) {
            res.send({result:'FAIL', reason:''});
            return;
        }

        if ( to != null && from != null )
        {
            console.log(`FROM : ${from.iCash}, TO : ${to.iCash}`);

            if ( to.iCash >= cAmount )
            {
                const iBeforeCashTo = parseFloat(to.iCash);
                const iAfterCashTo = iBeforeCashTo-cAmount;
                //await to.update({iCash:iAfterCashTo});
                await db.Users.update({iCash:iAfterCashTo}, {where:{strNickname:req.body.strTo}});

                const iBeforeCashFrom = parseFloat(from.iCash);
                const iAfterCashFrom = iBeforeCashFrom + cAmount;
                if ( from.iClass != IAgent.EAgent.eHQ ) {
                    //await from.update({iCash:iAfterCashFrom});
                    await db.Users.update({iCash:iAfterCashFrom}, {where:{strNickname:req.body.strFrom}});
                }

                await db.GTs.create({
                    eType:'TAKE',
                    strTo:req.body.strTo,
                    strFrom:req.body.strFrom,
                    iAmount:parseInt(req.body.iAmount),
                    iBeforeAmountTo:iBeforeCashTo,
                    iAfterAmountTo:iAfterCashTo,
                    iBeforeAmountFrom:iBeforeCashFrom,
                    iAfterAmountFrom:iAfterCashFrom,
                    iClassTo: to.iClass,
                    iClassFrom: from.iClass,
                });
                res.send({result:'OK', cash:from.iCash, rolling:from.iRolling, settle:from.iSettle});

                ISocket.AlertCashByNickname(req.body.strFrom, iAfterCashFrom);
                ISocket.AlertCashByNickname(req.body.strTo, iAfterCashTo);

                let objectAxios = {strNickname:req.body.strTo, iAmount:iAfterCashTo};
                axios.post(`${to.strURL}/UpdateCoin`, objectAxios)
                .then((response)=> {
                })
                .catch((error)=> {
                });
            }
            else {
                //res.send({result:'fail', string:'금액이 부족하여 차감 할 수 없습니다.'});
                res.send({result:'FAIL', reason:'NOTENOUGH'});
            }
        }
    }
    else if ( req.body.eType == 'ROLLING')
    {
        let to = await db.Users.findOne({where:{strNickname:req.body.strTo}});
        let strAdminNickname = (await IAgent.GetParentList(to.strGroupID, to.iClass)).strAdmin;
        let from = await db.Users.findOne({where:{strNickname:strAdminNickname}});

        //  알 파는 버전
        if ( to != null && from != null )
        {
            let cAmount = parseInt(req.body.iAmount);
            if (Number.isNaN(cAmount)) {
                cAmount = 0;
            }

            if (cAmount <= 0) {
                res.send({result:'FAIL', reason:''});
                return;
            }

            // 회장님 지시로 롤링/죽장은 본사 머니와 상관없이 되도록 수정(추후 확인 필요)
            // if ( from.iCash < cAmount )
            // {
            //     res.send({result:'FAIL', reason:'NOTENOUGH'});
            //     return;
            // }

            if ( to.iRolling < cAmount )
            {
                res.send({result:'FAIL', reason:'NOTENOUGH'});
                return;
            }

            const iBeforeCashTo = parseFloat(to.iCash);
            const iAfterCashTo = iBeforeCashTo+cAmount;
            const iBeforeRollingTo = parseFloat(to.iRolling);
            const iAfterRollingTo = iBeforeRollingTo-cAmount;
            // 롤링전환시에는 전환전 금액에 전환전 롤링값을 표시

            await db.Users.update({
                iCash:iAfterCashTo,
                iRolling:iAfterRollingTo,
            }, {where:{strNickname:req.body.strTo}});
            // await to.update({
            //     iCash:iAfterCashTo,
            //     iRolling:iAfterRollingTo,
            // });

            const iBeforeCashFrom = parseFloat(from.iCash);
            const iAfterCashFrom = iBeforeCashFrom - cAmount;
            //await from.update({iCash:iAfterCashFrom, iRolling: from.iRolling + cAmount});
            await db.Users.update({iCash:iAfterCashFrom, iRolling: from.iRolling + cAmount}, {where:{strNickname:strAdminNickname}});


            // 롤링전환시에는 전환전 금액에 전환전 롤링값을 표시
            await db.GTs.create({
                eType:'ROLLING',
                strTo:req.body.strTo,
                strFrom:req.body.strFrom,
                strGroupID:to.strGroupID,
                iAmount:cAmount,
                //iBeforeAmountTo:iBeforeRollingTo,
                iBeforeAmountTo:iBeforeCashTo,
                iAfterAmountTo:iAfterCashTo,
                iBeforeAmountFrom:iBeforeCashFrom,
                iAfterAmountFrom:iAfterCashFrom,
                iClassTo: to.iClass,
                iClassFrom: from.iClass,
            });

            await db.Inouts.create({
                strID:to.strNickname,
                strAdminNickname:strAdminNickname,
                iClass:to.iClass,
                strName:to.strNickname,
                strGroupID:to.strGroupID,
                iAmount:cAmount,
                eType:'ROLLING',
                eState:'COMPLETE',
                iRequestClass: req.user.iClass,
                strRequestNickname:req.user.strNickname,
            });

            res.send({result:'OK', cash:to.iCash, rolling:to.iRolling, settle:to.iSettle});
        }
        else
        {
            res.send({result:'FAIL', reason:''});
        }
    }
    else if ( req.body.eType == 'SETTLE' )
    {
        let to = await db.Users.findOne({where:{strNickname:req.body.strTo}});
        let strAdminNickname = (await IAgent.GetParentList(to.strGroupID, to.iClass)).strAdmin;
        let from = await db.Users.findOne({where:{strNickname:strAdminNickname}});
        
        if ( to != null && from != null)
        {
            let cAmount = parseInt(req.body.iAmount);
            if (Number.isNaN(cAmount)) {
                cAmount = 0;
            }

            if (cAmount <= 0) {
                res.send({result:'FAIL', reason:''});
                return;
            }

            // 회장님 지시로 롤링/죽장은 본사 머니와 상관없이 되도록 수정(추후 확인 필요)
            // if ( from.iCash < cAmount )
            // {
            //     res.send({result:'FAIL', reason:'NOTENOUGH'});
            //     return;
            // }

            if ( to.iSettle < cAmount )
            {
                res.send({result:'FAIL', reason:'NOTENOUGH'});
                return;
            }

            const iBeforeCashTo = parseFloat(to.iCash);
            const iAfterCashTo = iBeforeCashTo+cAmount;
            const iBeforeSettleTo = parseFloat(to.iSettle);
            const iAfterSettleTo = iBeforeSettleTo-cAmount;
            await db.Users.update({iCash:iAfterCashTo, iSettle:iAfterSettleTo},{where:{strNickname:req.body.strTo}});
            // await to.update({
            //     iCash:iAfterCashTo,
            //     iSettle:iAfterSettleTo,
            // });

            // 마지막 죽장의 입출후 금액을 갱신하기
            let settle = await db.SettleRecords.findAll({
                where: {
                    strID: to.strID,
                },
                order: [['id', 'DESC']],
                limit: 1
            });

            for (let i in settle) {
                await db.SettleRecords.update({
                    iSettleAfter:iAfterSettleTo
                }, {where:{id:settle[i].id}});
            }
            // if (settle.length > 0) {
            //     for (let i in settle) {
            //         await settle[i].update({
            //             iSettleAfter:iAfterSettleTo
            //         });
            //     }
            // }

            const iBeforeCashFrom = parseFloat(from.iCash);
            const iAfterCashFrom = iBeforeCashFrom - cAmount;
            //await from.update({iCash:iAfterCashFrom, iSettle: from.iSettle + cAmount});
            await db.Users.update({iCash:iAfterCashFrom, iSettle: from.iSettle + cAmount}, {where:{strNickname:strAdminNickname}});

            // 죽장전환시에는 전환전 금액에 전환전 죽장값을 표시
            await db.GTs.create({
                eType:'SETTLE',
                strTo:req.body.strTo,
                strFrom:req.body.strFrom,
                strGroupID:to.strGroupID,
                iAmount:cAmount,
                iBeforeAmountTo:iBeforeSettleTo,
                iAfterAmountTo:iAfterCashTo,
                iBeforeAmountFrom:iBeforeCashFrom,
                iAfterAmountFrom:iAfterCashFrom,
                iClassTo: to.iClass,
                iClassFrom: from.iClass,
            });

            await db.Inouts.create({
                strID:to.strNickname,
                strAdminNickname:strAdminNickname,
                iClass:to.iClass,
                strName:to.strNickname,
                strGroupID:to.strGroupID,
                iAmount:cAmount,
                eType:'SETTLE',
                eState:'COMPLETE',
                iRequestClass: req.user.iClass,
                strRequestNickname:req.user.strNickname,
            });

            res.send({result:'OK', cash:to.iCash, rolling:to.iRolling, settle:to.iSettle});
        }
        else
        {
            res.send({result:'FAIL', reason:''});
        }
    }
})


router.post('/request_gtrecord', isLoggedIn, async(req, res) => {

    console.log(`############################################################################123`);
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let iClass = parseInt(req.body.iClass);
    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strNickname = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;

    let types = [];
    if (iClass != undefined)
    {
        if (iClass == 3)
            types = ['GIVE', 'TAKE', 'GETSETTLE'];
    }
    if ( req.body.eType == 'TO')
    {
        // 본사는 보낸내역 불필요
        if (iClass == 3) {
            res.send([]);
            return;
        }
        if ( req.body.strSearch == '' )
        {
            const list = await db.GTs.findAll({where:{
                strFrom:strNickname,
                eType:{[Op.or]: types},
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
            },
            order:[['createdAt','DESC']]});
            console.log(list.length);
            for ( let i in list )
                console.log(`To : ${list[i].strTo}, eType : ${list[i].eType}`);
                
            res.send(list);
        }
        else
        {
            const list = await db.GTs.findAll({where:{
                strFrom:strNickname,
                strTo:{[Op.like]:'%'+req.body.strSearch+'%'},
                eType:{[Op.or]: types},
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
            },
            order:[['createdAt','DESC']]});
            console.log(list.length);
            for ( let i in list )
                console.log(`To : ${list[i].strTo}, eType : ${list[i].eType}`);
                
            res.send(list);
        }
    }
    else if ( req.body.eType == 'FROM' )
    {
        if ( req.body.strSearch == '' )
        {
            const list = await db.GTs.findAll({where:{
                strTo:strNickname,
                eType:{[Op.or]: ['GETSETTLE', 'TAKE', 'GIVE']},
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
            },
            order:[['createdAt','DESC']]});
            console.log(list.length);
            for ( let i in list )
                console.log(`To : ${list[i].strTo}, eType : ${list[i].eType}`);
                
            res.send(list);
    
        }
        else
        {
            const list = await db.GTs.findAll({where:{
                strTo:strNickname,
                strFrom:{[Op.like]:'%'+req.body.strSearch+'%'},
                eType:{[Op.or]: ['GETSETTLE', 'TAKE']},
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
            },
            order:[['createdAt','DESC']]});
            console.log(list.length);
            for ( let i in list )
                console.log(`To : ${list[i].strTo}, eType : ${list[i].eType}`);
                
            res.send(list);
        }
    }
});

router.post('/request_gtrecord_user', isLoggedIn, async(req, res) => {

    console.log(`request_gtrecord_user############################################################################`);
    console.log(req.body);

    let searchType = req.body.searchType ?? '';
    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let list = [];
    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strNickname = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;
    let subQuery = '';
    if (searchType == 'inout') {
        subQuery = `AND eType IN ('GIVE', 'TAKE')`;
    } else if (searchType == 'rolling') {
        subQuery = `AND eType IN ('ROLLING')`;
    }
    // 두개를 하나의 테이블로 UNION
    if ( req.body.strSearch == '' )
    {
        list = await db.sequelize.query(`
            SELECT g.*, DATE_FORMAT(g.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs g
            WHERE g.strFrom = '${strNickname} '
            AND date(g.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery} 
            UNION
            SELECT g.*, DATE_FORMAT(g.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs g
            WHERE g.strTo = '${strNickname}' 
            AND date(g.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            ORDER BY createdAt DESC
        `);
    } else {
        list = await db.sequelize.query(`
            SELECT g.*, DATE_FORMAT(g.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs g
            WHERE g.strFrom = '${strNickname}' 
            AND g.strTo LIKE CONCAT('${req.body.strSearch}', '%') 
            AND date(g.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            UNION
            SELECT g.*, DATE_FORMAT(g.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs g
            WHERE g.strTo = '${strNickname}' 
            AND g.strFrom LIKE CONCAT('${req.body.strSearch}', '%')
            AND date(g.createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            ORDER BY createdAt DESC
        `);
    }
    res.send(list[0]);
});

router.post('/logs', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass, agent);
    res.render('manage_partner/popup_logs', {iLayout:2, iHeaderFocus:20, agent:agent, strParent: parents.strParents});
});

router.post('/request_logs', isLoggedIn, async (req, res) => {
    console.log(`###################request_logs#########################################################`);
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strNickname = req.body.strNickname;

    const list = await db.DataLogs.findAll({
        attributes:['strNickname', db.sequelize.col('strNickname'), 'strLogs', db.sequelize.col('strLogs'), 'strEditorNickname', db.sequelize.col('strEditorNickname'), 'createdAt', db.sequelize.col('createdAt')],
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strNickname: strNickname,
        },
        order:[['createdAt','DESC']]
    });

    // const list = await db.DataLogs.findAll({
    //     where:{
    //         strNickname: strNickname,
    //         createdAt : {
    //             [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')]
    //         },
    //     }
    // });

    res.send(list);
});

module.exports = router;