const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const ITime = require('../utils/time');
const IUtil = require("../utils/util");
const ISocket = require('../implements/socket');
const {Op}= require('sequelize');
const IAgentSettle = require('../implements/agent_settle3');
const IAgent = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const IInout = require("../implements/inout");
//////////////////////////////////////////////////////////////////////////////

router.post('/agentinfo', isLoggedIn, async (req, res) => {

    console.log(`/agentinfo`);
    console.log(req.body);
    
    const user = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    user.iRootClass = req.user.iClass;
    user.iRootNickname = req.user.strNickname;
    user.iPermission = req.user.iPermission;

    const sid = req.user.strID
    let iC = await db.Users.findOne({where:{strID:req.user.strID}});

    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    let iClass = user.iClass;
    let iRootClass = iC.iClass;

    // if (req.user.iClass > 3) {
    //     if (user.strBankname != null && user.strBankname != '') {
    //         user.strBankname = '******';
    //     }
    //     if (user.strBankAccount != null && user.strBankAccount != '') {
    //         user.strBankAccount = '******';
    //     }
    //     if (user.strBankOwner != null && user.strBankOwner != '') {
    //         user.strBankOwner = '******';
    //     }
    //     if (user.strMobile != null && user.strMobile != '') {
    //         user.strMobile = '******';
    //     }
    //     let pass = '';
    //     for (var i = 0;  i<user.strPassword.length; i++) {
    //         pass = pass + '*';
    //     }
    //     user.strPassword = pass;
    //     user.strPasswordConfirm = pass;
    // }

    res.render('manage_partner/popup_agentinfo', {iLayout:2, iHeaderFocus:0, agent:user, sid:sid, pw_auth:iC.pw_auth, iClass:iClass, iRootClass: iRootClass, strParent:strParent, iPermission:iC.iPermission});
});

router.post('/viceadminlist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, '', agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, dateStart, dateEnd, '', true);

    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_viceadminlist', {iLayout:2, iHeaderFocus:1, agent:agent, overview:overview, agentlist:agentlist, strParent:strParent});

});

router.post('/proadminlist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, '', agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, dateStart, dateEnd, '', true);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_proadminlist', {iLayout:2, iHeaderFocus:10, agent:agent, overview:overview, agentlist:agentlist, strParent:strParent});

});
router.post('/agentlist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();

    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, '', agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iClass)+1, dateStart, dateEnd, '', true);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_agentlist', {iLayout:2, iHeaderFocus:2, agent:agent, overview:overview, agentlist:agentlist, strParent:strParent});
});

router.post('/shoplist', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, 3, dateStart, dateEnd,  '', true);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_shoplist', {iLayout:2, iHeaderFocus:3, agent:agent, overview:overview, bettingrecord:bettingrecord, agentlist:agentlist, strParent:strParent});

});

router.post('/userlist', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let agentlist = await IAgent.GetComputedAgentList(req.body.strGroupID, 8, dateStart, dateEnd);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    res.render('manage_partner/popup_userlist', {iLayout:2, iHeaderFocus:4, agent:agent, overview:overview, bettingrecord:bettingrecord, agentlist:agentlist, strParent:strParent});
});

router.post('/charges', isLoggedIn, async (req, res) => {

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    let inputs = await db.Inouts.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            eType:'INPUT',
            eState:'COMPLETE'
        },
        order:[['createdAt','DESC']]
    });
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_charges', {iLayout:2, iHeaderFocus:5, agent:agent, inputs:inputs, strParent:strParent});
});

router.post('/exchanges', isLoggedIn, async (req, res) => {

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let outputs = await db.Inouts.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            eType:'OUTPUT',
            eState:'COMPLETE'
        },
        order:[['createdAt','DESC']]
    });
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_exchanges', {iLayout:2, iHeaderFocus:6, agent:agent, outputs:outputs, strParent:strParent});
});

router.post('/points', isLoggedIn, async (req, res) => {

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    res.render('manage_partner/popup_points', {iLayout:2, iHeaderFocus:7, agent:agent, strParent:strParent});
});

router.post('/request_gtrecord_partner', isLoggedIn, async(req, res) => {

    console.log(`request_gtrecord_user############################################################################`);
    console.log(req.body);

    let searchType = req.body.searchType ?? '';
    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strNickname = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;
    let list = [];
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
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat 
            FROM GTs 
            WHERE strFrom = '${strNickname}'
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            UNION
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strTo = '${strNickname}' 
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            ORDER BY createdAt DESC
        `);
    } else {
        list = await db.sequelize.query(`
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strFrom = '${strNickname}' 
            AND strTo LIKE CONCAT('${req.body.strSearch}', '%') 
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ${subQuery}
            UNION
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strTo = '${strNickname}' 
            AND strFrom LIKE CONCAT('${req.body.strSearch}', '%')
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
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

    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    res.render('manage_partner/popup_logs', {iLayout:2, iHeaderFocus:20, agent:agent, strParent: strParent});
});

router.post('/games', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    res.render('manage_partner/popup_games', {iLayout:2, iHeaderFocus:9, agent:agent, overview:overview, bettingrecord:bettingrecord, strParent:strParent});
});

router.post('/bettingrecord', isLoggedIn, async (req, res) => {
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;
    const dateStart = ITime.getTodayStart();
    const dateEnd = ITime.getTodayEnd();
    let overview = await IAgent.CalculateSelfBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let bettingrecord = await IAgent.CalculateTermSelfBettingRecord(req.body.strGroupID, req.body.iClass, dateStart, dateEnd, agent.strNickname, agent.strID);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    res.render('manage_partner/popup_bettingrecord', {iLayout:2, iHeaderFocus:8, agent:agent, overview:overview, bettingrecord:bettingrecord, strParent:strParent});
});


// router.post('/memos', isLoggedIn, async (req, res) => {

//     console.log(req.body);

//     //var agent = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass};
//     const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

//     res.render('manage_partner/popup_memos', {iLayout:2, iHeaderFocus:9, agent:agent});

// });

router.post('/settingodds', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const input = req.body.pass ?? '';

    const info = await db.Users.findOne({where: {strNickname: req.user.strNickname, strOddPassword: input}});
    if (info == null) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    const dbuser = await db.Users.findOne({where: {strNickname: req.body.strNickname}});

    const user = {fSlotR: dbuser.fSlotR, fBaccaratR: dbuser.fBaccaratR, fUnderOverR: dbuser.fUnderOverR,
        fPBR:dbuser.fPBR, fPBSingleR:dbuser.fPBSingleR, fPBDoubleR:dbuser.fPBDoubleR, fPBTripleR:dbuser.fPBTripleR,
        fSettleSlot:dbuser.fSettleSlot, fSettleBaccarat:dbuser.fSettleBaccarat, fSettlePBA:dbuser.fSettlePBA, fSettlePBB:dbuser.fSettlePBB
    };

    res.render('manage_partner/popup_settingodds', {iLayout:1, iHeaderFocus:0, agent:agent, user:user});

});



router.post('/removedb', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const input = req.body.pass ?? '';

    // 비밀번호는 로그인한 이용자
    const info = await db.Users.findOne({where: {strNickname: req.user.strNickname, strPassword: input}});
    if (info == null) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    res.render('manage_partner/popup_removedb', {iLayout:1, iHeaderFocus:0, agent:agent});

});


//  Ajax
router.post('/registeragent', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
                    iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    res.render('manage_partner/popup_registeragent', {iLayout:1, parent:user});

})

router.post('/popup_listadmin_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    if (req.user.iClass > 2) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    let list = await db.sequelize.query(
        `
        SELECT u.strNickname AS strRelNickname, u3.strNickname, u3.strID, u3.eState, u3.strGroupID, u3.iPermission, u3.iClass
        FROM Users AS u3
        LEFT JOIN Users u ON u.id = u3.iRelUserID
        WHERE u3.iClass = 3 AND u3.iPermission = 100 AND u3.strGroupID LIKE '${req.body.strGroupID+'%'}' 
        `
    );
    res.render('manage_partner/popup_listadmin_view', {iLayout:7, iHeaderFocus:0, agent:user, list:list[0], strParent: user.strNickname});
});


router.post('/popup_listvice_view', isLoggedIn, async(req, res) => {
    console.log(req.body);

    if (req.user.iClass > 1) {
        res.send({result:'FAIL', msg: '허가되지 않은 사용자입니다'});
        return;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    let list = await db.sequelize.query(
        `
        SELECT u.strNickname AS strRelNickname, u3.strNickname, u3.strID, u3.eState, u3.strGroupID, u3.iPermission, u3.iClass
        FROM Users AS u3
        LEFT JOIN Users u ON u.id = u3.iRelUserID
        WHERE u3.iClass = 2 AND u3.iPermission = 100 AND u3.strGroupID LIKE '${req.body.strGroupID+'%'}' 
        `
    );
    res.render('manage_partner/popup_listvice_view', {iLayout:7, iHeaderFocus:0, agent:user, list:list[0], strParent: user.strNickname});
});

router.post('/registeragent_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, iAgentClass:req.body.iAgentClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    let list = await db.Users.findAll({
        where: {
            iClass:req.body.iAgentClass,
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    res.render('manage_partner/popup_registeragent_view', {iLayout:1, agent:user, list:list, iAgentClass:user.iAgentClass});
});


router.post('/readagent_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    let strID = req.body.strID;
    let dbUser = await db.Users.findOne({
        where: {
            strID: strID,
        }
    });
    const user = {strNickname:dbUser.strNickname, strID:dbUser.strID, strPassword:dbUser.strPassword, strGroupID:dbUser.strGroupID, iClass:dbUser.iClass, iAgentClass:dbUser.iClass,
        iRootClass:req.user.iClass, iPermission:dbUser.iPermission, iRelUserID: dbUser.iRelUserID};

    let list = await db.Users.findAll({
        where: {
            iClass:user.iClass,
            strGroupID:{
                [Op.like]:user.strGroupID+'%'
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    res.render('manage_partner/popup_registeragent_view', {iLayout:1, agent:user, list:list});
});

router.post('/request_register_view', isLoggedIn, async(req, res) => {
    console.log(req.body);
    try {
        // 신규 여부 확인
        let user = await db.Users.findOne({
            where: {
                strID: req.body.strID
            }
        });

        // 업데이트
        if (user != null) {
            await user.update({
                strID:req.body.strID,
                strPassword:req.body.strPassword,
                strNickname:req.body.strNickname,
            });
            res.send({result:'OK', string:'에이전트(보기용) 수정 되었습니다.'});
            return;
        }

        // 신규 등록
        if (user == null) {
            let iRelUserID = req.body.iRelUserID;
            user = await db.Users.findOne({
                where: {
                    id: iRelUserID,
                }
            });
            let iLoginMax = 1;
            if (parseInt(user.iClass) == 2) {
                iLoginMax = 10;
            } else if (parseInt(user.iClass) == 3) {
                iLoginMax = 2;
            }

            await db.Users.create({
                strID:req.body.strID,
                strPassword:req.body.strPassword,
                strNickname:req.body.strNickname,
                strMobile:'',
                strBankname:'',
                strBankAccount:'',
                strBankOwner:'',
                strBankPassword:'',
                strOutputPassowrd:'',
                iClass:user.iClass,
                strGroupID:user.strGroupID,
                iParentID:user.iParentID,
                iCash:0,
                iLoan:0,
                iRolling:0,
                iSettle:0,
                iSettleAcc:0,
                fBaccaratR:user.fBaccaratR,
                fSlotR:user.fSlotR,
                fUnderOverR:user.fUnderOverR,
                fPBR:user.fPBR,
                fPBSingleR:user.fPBSingleR,
                fPBDoubleR:user.fPBDoubleR,
                fPBTripleR:user.fPBTripleR,
                fSettleSlot:user.fSettleBaccarat,
                fSettleBaccarat:user.fSettleSlot,
                fSettlePBA:user.fSettlePBA,
                fSettlePBB:user.fSettlePBB,
                eState:'BLOCK',
                //strOptionCode:'00000000',
                strOptionCode:user.strOptionCode,
                strPBOptionCode:user.strPBOptionCode,
                iPBLimit:user.iPBLimit,
                iPBSingleLimit:user.iPBSingleLimit,
                iPBDoubleLimit:user.iPBDoubleLimit,
                iPBTripleLimit:user.iPBTripleLimit,
                strSettleMemo:'',
                iNumLoginFailed: 0,
                iPermission:100,
                iRelUserID:iRelUserID,
                iLoginMax:iLoginMax,
            });
            res.send({result:'OK', string:'에이전트(보기용) 생성을 완료 하였습니다.'});
        }
    } catch (err) {
        res.send({result:'FAIL', string:`에이전트(보기용) 생성을 실패했습니다.(${err})`});
    }
});

router.post('/request_removeagent_view', async (req, res) => {

    console.log(`/request_removeagent_view`);
    console.log(req.body);

    let strID = req.body.strID;
    let target = await db.Users.findOne({where:{strID:strID, iPermission:100}});
    if (target == null) {
        res.send({result:'ERROR'});
        return;
    }
    await db.Users.destroy({where:{strID:strID}});
    res.send({result:'OK'});
});

router.post('/request_parentenablelist', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let list = await db.Users.findAll({
        where: {
            iClass:parseInt(req.body.iRegisterClass)-1,
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });
    res.send(list);
})

router.post('/request_confirmagentid', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let list = await db.Users.findOne({where:{
        strID:req.body.strID
    }});
    if ( list == null )
        res.send('OK');
    else
        res.send('EXIST');
})

router.post('/request_confirmagentnickname', isLoggedIn, async(req, res) => {
    console.log(req.body);

    let list = await db.Users.findOne({where:{
        strNickname:req.body.strNickname
    }});
    if ( list == null )
        res.send('OK');
    else
        res.send('EXIST');
})

var leadingZeros = (n, digits) => {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

let CalculateGroupID = async (strParentGroupID, iParentClass) => {

    let children = await db.Users.findOne({
            where:{
                strGroupID:{
                    [Op.like]:strParentGroupID+'%'
                },
                iClass:parseInt(iParentClass)+1
            },
            order:[['strGroupID','DESC']],
        });

    let group = '';

    if ( iParentClass != IAgent.EAgent.eShop)
    {
        if ( children == null )
            group = '00';
        else {
            let strGroupID = children.strGroupID;
            let id = strGroupID.substring(strGroupID.length-2);
            let newID = parseInt(id)+1;
            group = leadingZeros(newID, 2);
        }
    }
 
    const strGroupID = strParentGroupID + group;

    return strGroupID;
}

router.post('/request_register', isLoggedIn, async(req, res) => {
    console.log(req.body);
    try {
        let strGroupID = await CalculateGroupID(req.body.strParentGroupID, req.body.iParentClass);
        console.log(`parent : ${req.body.strParentGroupID}, child : ${strGroupID}`);

        const parent = await db.Users.findOne({where:{id:req.body.iParentID}});
        if ( parent == null ) {
            res.send({result:'FAIL', error:'Rolling', string:'에이전트 생성을 실패했습니다.(${err})'});
            return;
        }
        if ( parent != null )
        {
            if ( parent.fSlotR < parseFloat(req.body.fSlotR) ||
                parent.fBaccaratR < parseFloat(req.body.fBaccaratR) ||
                parent.fUnderOverR < parseFloat(req.body.fUnderOverR) ||
                parent.fPBR < parseFloat(req.body.fPBR) ||
                parent.fPBSingleR < parseFloat(req.body.fPBSingleR) ||
                parent.fPBDoubleR < parseFloat(req.body.fPBDoubleR) ||
                parent.fPBTripleR < parseFloat(req.body.fPBTripleR) )
            {
                res.send({result:'Error', error:'Rolling', string:'롤링비(%)는 상위 에이전트 보다 클 수 없습니다.'});
                return;
            }
            else if (parent.fSettleBaccarat < parseFloat(req.body.fSettleBaccarat) ||
                parent.fSettleSlot < parseFloat(req.body.fSettleSlot) ||
                parent.fSettlePBA < parseFloat(req.body.fSettlePBA) ||
                parent.fSettlePBB < parseFloat(req.body.fSettlePBB) )
            {
                res.send({result:'Error', error:'Settle', string:'죽장(%)은 상위 에이전트 보다 클 수 없습니다.'});
                return;
            }
        }

        let iLoginMax = 1;
        let iClass = parseInt(req.body.iParentClass)+1;
        if (iClass == 2) {
            iLoginMax = 3;
        } else if (iClass == 3) {
            iLoginMax = 1;
        }

        await db.Users.create({
            strID:req.body.strID,
            strPassword:req.body.strPassword,
            strNickname:req.body.strNickname,
            strMobile:req.body.strMobileNo,
            strBankname:req.body.strBankName,
            strBankAccount:req.body.strAccountNumber,
            strBankOwner:req.body.strAccountOwner,
            strBankPassword:'',
            strOutputPassowrd:'',
            iClass:parseInt(req.body.iParentClass)+1,
            strGroupID:strGroupID,
            iParentID:req.body.iParentID,
            iCash:0,
            iLoan:0,
            iRolling:0,
            iSettle:0,
            iSettleAcc:0,
            fBaccaratR:req.body.fBaccaratR,
            fSlotR:req.body.fSlotR,
            fUnderOverR:req.body.fUnderOverR,
            fPBR:req.body.fPBR,
            fPBSingleR:req.body.fPBSingleR,
            fPBDoubleR:req.body.fPBDoubleR,
            fPBTripleR:req.body.fPBTripleR,
            fSettleSlot:req.body.fSettleBaccarat,
            fSettleBaccarat:req.body.fSettleSlot,
            fSettlePBA:req.body.fSettlePBA,
            fSettlePBB:req.body.fSettlePBB,
            eState:'BLOCK',
            //strOptionCode:'00000000',
            strOptionCode:req.body.strOptionCode,
            strPBOptionCode:req.body.strPBOptionCode,
            iPBLimit:req.body.iPBLimit,
            iPBSingleLimit:req.body.iPBSingleLimit,
            iPBDoubleLimit:req.body.iPBDoubleLimit,
            iPBTripleLimit:req.body.iPBTripleLimit,
            strSettleMemo:'',
            iNumLoginFailed: 0,
            iPermission:0,
            iLoginMax:iLoginMax
        });
        res.send({result:'OK', string:'에이전트 생성을 완료 하였습니다.'});
    } catch (err) {
        res.send({result:'FAIL', string:`에이전트 생성을 실패했습니다.(${err})`});
    }
});

router.post('/request_agentlist', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const list = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, req.body.strSearchNickname, true);

    res.send({list:list, iRootClass:req.user.iClass, iPermission: req.user.iPermission});
});

/**
 * 본인 베팅 레코드 조회(바카라)
 */
router.post('/request_bettinglist', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strID = req.body.strID ?? '';

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:strID,
            iGameCode: {
                [Op.notIn]:[200, 300]
            }
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strID:strID,
                iGameCode: {
                    [Op.notIn]:[200, 300]
                }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    for ( let i in list )
    {
        records.push({
            id: list[i].id,
            strID:list[i].strID,
            strNickname:list[i].strNickname,
            strGroupID:list[i].strGroupID,
            iClass:list[i].iClass,
            iBalance:list[i].iBalance,
            iGameCode:list[i].iGameCode,
            strVender:list[i].strVender,
            strGameID:list[i].strGameID,
            strTableID:list[i].strTableID,
            strRound:list[i].strRound,
            strUniqueID:list[i].strUniqueID,
            strDetail:list[i].strDetail,
            strResult:list[i].strResult,
            iBet:list[i].iBet,
            iWin: list[i].iWin,
            eState:list[i].eState,
            eType:list[i].eType,
            iTarget:list[i].iTarget,
            createdAt:list[i].createdAt,
            updatedAt:list[i].updatedAt
        });
    }
    console.log(records);

    res.send({result:'OK', list:records, totalCount: totalCount});
})

/**
 * 본인 베팅 레코드 조회(슬롯)
 */
router.post('/request_bettinglist_slot', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strGroupID = req.body.strGroupID;
    let strID = req.body.strID ?? '';

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = await db.RecordBets.count({
        where: {
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:strID,
            iGameCode: 200
        }
    });

    let list = await db.RecordBets.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strID:strID,
                iGameCode: 200
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    let records = [];

    for ( let i in list )
    {
        records.push({
            id: list[i].id,
            strID:list[i].strID,
            strNickname:list[i].strNickname,
            strGroupID:list[i].strGroupID,
            iClass:list[i].iClass,
            iBalance:list[i].iBalance,
            iGameCode:list[i].iGameCode,
            strVender:list[i].strVender,
            strGameID:list[i].strGameID,
            strTableID:list[i].strTableID,
            strRound:list[i].strRound,
            strUniqueID:list[i].strUniqueID,
            strDetail:list[i].strDetail,
            strResult:list[i].strResult,
            iBet:list[i].iBet,
            iWin: list[i].iWin,
            eState:list[i].eState,
            eType:list[i].eType,
            iTarget:list[i].iTarget,
            createdAt:list[i].createdAt,
            updatedAt:list[i].updatedAt
        });
    }
    console.log(records);

    res.send({result:'OK', list:records, totalCount: totalCount});
})

router.post('/request_bettinglist_page', isLoggedIn, async (req, res) => {
    console.log(req.body);

    const full = await db.RecordBets.findAll({where:{
        createdAt:{
            [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
        },
        strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        strNickname:req.body.strNickname
        }
    });

    const cOffset = parseInt(req.body.iPage) * 50;

    const result = await db.RecordBets.findAll({offset:cOffset, limit:50, where:{
        createdAt:{
            [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
        },
        strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        strNickname:req.body.strNickname, iHistory: 0
    },
    order:[['createdAt','DESC']],
    });

    const cNumPages = Math.floor(full.length/50) + 1;

    res.send({page:cNumPages, list:result});
});

router.post('/request_settingodds', isLoggedIn, async (req, res) => {

    console.log(`request_settingodds`);
    console.log(req.body);

    let fRollingBaccarat = parseFloat(req.body.fRollingBaccarat);
    let fRollingSlot = parseFloat(req.body.fRollingSlot);
    let fRollingUnderOver = parseFloat(req.body.fRollingUnderOver);
    let fSettleSlot = parseFloat(req.body.fSettleSlot);
    let fSettleBaccarat = parseFloat(req.body.fSettleBaccarat);
    let iClass = parseInt(req.body.iClass);
    // 본사 밑에 부본사 비율 확인
    let subUsers = await db.Users.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            iClass:{
                [Op.in]: [4,5]
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    let fail = false;
    for ( let i in subUsers )
    {
        let user = subUsers[i];
        if (user.fBaccaratR > fRollingBaccarat) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 바카라 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fUnderOverR > fRollingUnderOver) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 언더오버 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fSlotR > fRollingSlot) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 슬롯 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        }
        // else if (user.fSettleSlot > fSettleSlot) {
        //     res.send({result:'FAIL', message:`[${user.strNickname}] 슬롯 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
        //     fail = true;
        //     break;
        // } else if (user.fSettleBaccarat > fSettleBaccarat) {
        //     res.send({result:'FAIL', message:`[${user.strNickname}] 바카라 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
        //     fail = true;
        //     break;
        // }
    }

    if (fail)
        return;

    let users = await db.Users.findAll({
        where:{
            strGroupID:{
                [Op.like]:req.body.strGroupID+'%'
            },
            iClass:{
                [Op.in]: [2,3]
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }
    });

    for ( let i in users )
    {
        await users[i].update({
            fBaccaratR:fRollingBaccarat,
            fSlotR:fRollingSlot,
            fUnderOverR:fRollingUnderOver,
            fSettleSlot:fSettleSlot,
            fSettleBaccarat:fSettleBaccarat,
        });
    }

    res.send({result:'OK'});
});
//require('moment')
router.post('/request_removedb', isLoggedIn, async (req, res) => {
    console.log('/request_removedb');
    console.log(req.body);
    try {
        const ids = req.body.ids ?? '';
        if (-1 !== ids.indexOf(`RecordBets`)) {
            await db.RecordBets.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`GTs`)) {
            await db.GTs.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`Inouts`)) {
            await db.Inouts.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`SettleRecords`)) {
            await db.SettleRecords.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`ChargeRequest`)) {
            await db.ChargeRequest.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`CreditRecords`)) {
            await db.CreditRecords.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`Letters`)) {
            await db.Letters.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        if (-1 !== ids.indexOf(`ContactLetter`)) {
            await db.ContactLetter.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});
        }
        res.send({result:'OK'});
    } catch (err) {
        res.send({result:'FAIL', msg: err});
    }
});

//router.post('/initialization', isLoggedIn, async (req, res) => {
router.post('/request_initoutputpass', isLoggedIn, async (req, res) => {

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    await user.update({pw_auth:1});

    res.send({result:'OK'});
});

//에이전트 정보 수정
router.post('/request_agentinfo_modify',isLoggedIn, async (req, res) => {

    console.log(`/request_agentinfo_modify`);
    console.log(req.body);

    let user = await db.Users.findOne({where:{strNickname:req.body.strOriginNickname}});

    let strErrorCode = '';

    if ( null != user )
    {
        let bUpdate = true;

        let listShare = [];
        let listLog = [];
        let listContactTo = [];
        let listContactFrom = [];
        let listLetterTo = [];
        let listLetterFrom = [];
        let listInout = [];
        let listSettle = [];
        let listDaily = [];
        let listRecordBet = [];
        let listGtTo = [];
        let listGtFrom = [];
        let listHistory = [];
        if ( user.strNickname != req.body.strNickname || user.strID != req.body.strID )
        {
            let targetuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
            if ( null != targetuser )
            {
                res.send({result:'ERROR', code:'UnknownUser'});
                return;
            }

            const maxCount = 30;
            let count = 0;
            // 지분자 정보 확인
            listShare = await db.ShareUsers.findAll({where: {strID: user.strID}});
            count += listShare.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 로그
            listLog = await db.DataLogs.findAll({where: {strID: user.strID}});
            count += listLog.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 관리자 문의
            listContactTo = await db.ContactLetter.findAll({where: {strTo: user.strNickname}});
            count += listContactTo.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            listContactFrom = await db.ContactLetter.findAll({where: {strFrom: user.strNickname}});
            count += listContactFrom.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 쪽지
            listLetterTo = await db.Letters.findAll({where: {strTo: user.strNickname}});
            count += listLetterTo.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            listLetterFrom = await db.Letters.findAll({where: {strFrom: user.strNickname}});
            count += listLetterFrom.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 입출금
            listInout = await db.Inouts.findAll({where: {strID: user.strNickname}});
            count += listInout.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 죽장
            listSettle = await db.SettleRecords.findAll({where: {strNickname: user.strID}});
            count += listSettle.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 레코드 데일리
            listDaily = await db.RecordDailyOverviews.findAll({where: {strID: user.strID}});
            count += listDaily.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 배팅 레코드
            listRecordBet = await db.RecordBets.findAll({where: {strID: user.strID}});
            count += listRecordBet.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 전환
            listGtTo = await db.GTs.findAll({where: {strTo: user.strNickname}});
            count += listGtTo.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            listGtFrom = await db.GTs.findAll({where: {strFrom: user.strNickname}});
            count += listGtFrom.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
            // 가불히스토리
            listHistory = await db.CreditRecords.findAll({where: {strID: user.strID}});
            count += listHistory.length;
            if (count > maxCount) {
                res.send({result:'ERROR', code:'Impossible'});
                return;
            }
        }

        if ( user.iParentID != null )
        {
            let parent = await db.Users.findOne({where:{id:user.iParentID}});
            if ( null != parent )
            {
                console.log(`####################################################### ${parent.strID}, ${parent.iPBLimit}, ${req.body.iPBLimit}`);
                if ( 
                    parent.fSlotR < req.body.fSlotR ||
                    parent.fBaccaratR < req.body.fBaccaratR ||
                    parent.fUnderOverR < req.body.fUnderOverR
                   )
                {
                    console.log(`########## ModifyAgentInfo : Error Parent`);
                    bUpdate = false;
                    strErrorCode = 'GreaterThanParent';
                    res.send({result:'ERROR', code:strErrorCode});
                    return;
                }
            }
        }

        //  children
        if ( user.iClass < 7)
        {
            let children = await db.Users.findAll({
                where: {
                    iParentID:user.id,
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                }
            });
            for ( let i in children )
            {
                let child = children[i];
                if ( 
                    child.fSlotR > req.body.fSlotR ||
                    child.fBaccaratR > req.body.fBaccaratR ||
                    child.fUnderOverR > req.body.fUnderOverR
                   )
                {
                    console.log(`########## ModifyAgentInfo : Error Children`);
                    bUpdate = false;
                    strErrorCode = 'LessThanChild';
                    res.send({result:'ERROR', code:strErrorCode});
                    return;
                }               
            }
        }

        if ( bUpdate )
        {
            // 변경 로그 생성
            let data = {
                strNickname:req.body.strNickname,
                strID:req.body.strID,
                strOptionCode:req.body.strOptionCode,
                fSlotR:req.body.fSlotR,
                fBaccaratR:req.body.fBaccaratR,
                fUnderOverR:req.body.fUnderOverR,
                iPermission:req.body.iPermission,
            };

            if (req.body.strPassword != undefined && req.body.strPassword != '******') {
                data['strPassword'] = req.body.strPassword;
            }
            if (req.body.strPasswordConfirm != undefined && req.body.strPasswordConfirm != '******') {
                data['strPasswordConfirm'] = req.body.strPasswordConfirm;
            }
            if (req.body.strBankname != undefined && req.body.strBankname != '******') {
                data['strBankname'] = req.body.strBankname;
            }
            if (req.body.strBankOwner != undefined && req.body.strBankOwner != '******') {
                data['strBankOwner'] = req.body.strBankOwner;
            }
            if (req.body.strBankAccount != undefined && req.body.strBankAccount != '******') {
                data['strBankAccount'] = req.body.strBankAccount;
            }
            if (req.body.strMobile != undefined && req.body.strMobile != '******') {
                data['strMobile'] = req.body.strMobile;
            }

            let logMsg = logMessage(user, data);
            if (logMsg != '') {
                await db.DataLogs.create({
                    strNickname: req.body.strNickname,
                    strID: req.body.strID,
                    strGroupID: user.strGroupID,
                    strLogs: logMsg,
                    strEditorNickname: req.user.strNickname,
                });
            }

            await user.update(data);

            //  현재 정책상 본사일 경우만 롤링을 수정할 수 있다. 아래의 코드는 하위 에이전트 전체를 같은 값으로 세팅 하는 것이다.
            if ( req.user.iClass == 3 && user.iClass != 8 )
            {
                let children = await db.Users.findAll({
                    where:{
                        strGroupID:{
                            [Op.like]:user.strGroupID+'%'
                        },
                        iPermission: {
                            [Op.notIn]: [100]
                        },
                    }
                });
            }

            if ( (req.body.strNickname != user.strNickname || req.body.strID != user.strID) && bUpdate == true )
            {
                if (listShare.length > 0) {
                    await db.ShareUsers.update({strID: req.body.strID}, {where: {strID: user.strID}});
                }
                if (listLog.length > 0) {
                    await db.DataLogs.update({strNickname:req.body.strNickname, strID:req.body.strID}, {where: {strID: user.strID}});
                }
                if (listContactTo.length > 0) {
                    await db.ContactLetter.update({strTo:req.body.strNickname}, {where: {strTo: user.strNickname}});
                }
                if (listContactFrom.length > 0) {
                    await db.ContactLetter.update({strFrom:req.body.strNickname}, {where: {strFrom: user.strNickname}});
                }
                if (listLetterTo.length > 0) {
                    await db.Letters.update({strTo:req.body.strNickname, strToID: req.body.strID}, {where: {strTo: user.strNickname}});
                }
                if (listLetterFrom.length > 0) {
                    await db.Letters.update({strFrom:req.body.strNickname, strFromID: req.body.strID}, {where: {strFrom: user.strNickname}});
                }
                if (listInout.length > 0) {
                    await db.Inouts.update({strID: req.body.strNickname, strName: req.body.strNickname}, {where: {strID: user.strNickname}});
                }
                if (listSettle.length > 0) {
                    await db.SettleRecords.update({strNickname: req.body.strNickname, strID:req.body.strID}, {where: {strID: user.strID}});
                }
                if (listDaily.length > 0) {
                    await db.RecordDailyOverviews.update({strID: req.body.strID}, {where: {strID: user.strID}});
                }
                if (listRecordBet.length > 0) {
                    await db.RecordBets.update({strID: req.body.strID, strNickname: req.body.strNickname}, {where: {strID: user.strID}});
                }
                if (listGtTo.length > 0) {
                    await db.GTs.update({strTo:req.body.strNickname}, {where: {strTo: user.strNickname}});
                }
                if (listGtFrom.length > 0) {
                    await db.GTs.update({strFrom:req.body.strNickname}, {where: {strFrom: user.strNickname}});
                }
                if (listHistory.length > 0) {
                    await db.CreditRecords.update({strID: req.body.strID, strNickname:req.body.strNickname}, {where: {strID: user.strID}});
                }
            }

            res.send({result:'OK'});
        }
        else
        {
            res.send({result:'ERROR', code:strErrorCode});
        }
    }
    else
    {
        res.send({result:'ERROR', code:strErrorCode});
    }
});

const logMessage = (source, data) => {
    let msg = '';

    if (source.strNickname != data.strNickname) {
        msg = `닉네임 변경(${source.strNickname}=>${data.strNickname})`;
    }
    if (source.strID != data.strID) {
        if (msg == '')
            msg = `아이디 변경(${source.strID}=>${data.strID})`;
        else
            msg = `${msg} | 아이디 변경(${source.strMobile}=>${data.strMobile})`;
    }
    if (source.strPassword != data.strPassword) {
        if (msg == '')
            msg = `비밀번호 변경`;
        else
            msg = `${msg} | 비밀번호 변경`;
    }

    let bankMsg = '';

    if (source.strBankname != data.strBankname) {
        bankMsg = `계좌정보 변경`;
    }
    if (source.strBankAccount != data.strBankAccount) {
        bankMsg = `계좌정보 변경`;
    }
    if (source.strBankOwner != data.strBankOwner) {
        bankMsg = `계좌정보 변경`;
    }
    if (bankMsg != '') {
        if (msg == '') {
            msg = bankMsg;
        } else {
            msg = `${msg} | ${bankMsg}`;
        }
    }
    if (source.strMobile != data.strMobile) {
        if (msg == '')
            msg = `연락처 변경(${source.strMobile}=>${data.strMobile})`;
        else
            msg = `${msg} | 연락처 변경(${source.strMobile}=>${data.strMobile})`;
    }

    if (source.fBaccaratR != data.fBaccaratR) {
        if (msg == '')
            msg = `바카라롤링 변경(${source.fBaccaratR}=>${data.fBaccaratR})`;
        else
            msg = `${msg} | 바카라롤링 변경(${source.fBaccaratR}=>${data.fBaccaratR})`;
    }
    if (source.fUnderOverR != data.fUnderOverR) {
        if (msg == '')
            msg = `언오버롤링 변경(${source.fUnderOverR}=>${data.fUnderOverR})`;
        else
            msg = `${msg} | 언오버롤링 변경(${source.fUnderOverR}=>${data.fUnderOverR})`;
    }
    if (source.fSlotR != data.fSlotR) {
        if (msg == '')
            msg = `슬롯롤링 변경(${source.fSlotR}=>${data.fSlotR})`;
        else
            msg = `${msg} | 슬롯롤링 변경(${source.fSlotR}=>${data.fSlotR})`;
    }

    return msg;
}


/**
 * 가불 현황 목록
 */
// 파트너팝업 > 가불탭
router.post('/credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        strID:dbuser.strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    let list = await db.CreditRecords.findAll({
        where:{
            strID: dbuser.strID,
        },
        order:[['createdAt','DESC']]
    });
    res.render('manage_partner/popup_credits', {iLayout:2, iHeaderFocus:11, user:user, agent:agent, list:list, strParent:strParent, isEdit:true});
});

router.post('/popup_credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let list = await db.CreditRecords.findAll({
        where:{
            strID: req.body.strID,
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
        },
        order:[['createdAt','DESC']]
    });
    res.send(list);
});

// 가불내역 > 조회하기
router.post('/popup_credits_history', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        strID:dbuser.strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let list = await db.CreditRecords.findAll({
        where:{
            strID: req.body.strID,
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
        },
        order:[['createdAt','DESC']]
    });

    res.render('manage_partner_popup/popup_credits_history', {iLayout:0, iHeaderFocus:6, user:user, agent:agent, creadits:list});
});

// 가불 내역
router.post('/popup_credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let parent = await IAgent.GetParentNickname();
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    let strParentGroupID = await IAgent.GetParentGroupID(req.body.strNickname);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle,
        strID:dbuser.strID, iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, dbuser.iClass);

    let list    = null;

    if ( req.body.iClass == 1 )
        list = await GetViceHQs(req.body.strGroupID);
    else if ( req.body.iClass == 2 )
        list = await GetAdmins(req.body.strGroupID);
    else if ( req.body.iClass == 3 )
        list = await GetProAdmins(req.body.strGroupID);
    else if ( req.body.iClass == 4 )
        list = await GetAgent(req.body.strNickname, 4);

    res.render('manage_partner/popup_credits_history', {iLayout:5, iHeaderFocus:1, user:user, agent:agent, iocount:iocount, list:list, strParent:strParent});
});

let GetViceHQs = async (strGroupID) => {

    let list = await db.Users.findAll({where:{iClass:2,
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }})

    return list;
};

let GetAdmins = async (strGroupID, strQuater) => {
    if (strQuater != null && strQuater.length > 0) {
        let list = await IAgentSettle.GetAdminForSettle(strGroupID, strQuater, 3);
        return list;
    }

    let list = await db.Users.findAll({where:{iClass:3,
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
            iPermission: {
                [Op.notIn]: [100]
            },
        }})

    return list;
};

let GetProAdmins = async (strGroupID, strQuater) => {

    if (strQuater != null && strQuater.length > 0) {
        let list = await IAgentSettle.GetAdminForSettle(strGroupID, strQuater, 4);
        return list;
    }

    let list = await db.Users.findAll({where:{iClass:4,
            strGroupID:{
                [Op.like]:strGroupID+'%'
            },
        }})

    return list;
};

let GetAgent = async (strNickname, iClass) => {

    let list = await db.Users.findAll({where:{iClass:iClass,
            strNickname:strNickname,
            iPermission: {
                [Op.notIn]: [100]
            },
        }})
    return list;
};


module.exports = router;