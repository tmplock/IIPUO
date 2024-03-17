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

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let list = [];
    // 두개를 하나의 테이블로 UNION
    if ( req.body.strSearch == '' )
    {
        list = await db.sequelize.query(`
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat 
            FROM GTs 
            WHERE strFrom = '${req.body.strNickname}'
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            UNION
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strTo = '${req.body.strNickname}' 
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            ORDER BY createdAt DESC
        `);
    } else {
        list = await db.sequelize.query(`
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strFrom = '${req.body.strNickname}' 
            AND strTo LIKE CONCAT('${req.body.strSearch}', '%') 
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
            UNION
            SELECT *, DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%S') AS createdAtFormat
            FROM GTs 
            WHERE strTo = '${req.body.strNickname}' 
            AND strFrom LIKE CONCAT('${req.body.strSearch}', '%')
            AND date(createdAt) BETWEEN '${strTimeStart}' AND '${strTimeEnd}'
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

    // 비밀번호는 로그인한 이용자
    const dbuser = await db.Users.findOne({where: {strNickname: req.user.strNickname, strPassword: input}});
    if (dbuser == null) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }

    //var agent = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass};
    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

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
        // if (IUtil.checkBlockCharNickname(req.body.strID) === true) {
        //     res.send({result:'Error', error:'', string: '닉네임에 쓸수 없는 특수문자가 있습니다'});
        //     return;
        // }
        //
        // if (IUtil.checkBlockCharNickname(req.body.strPassword) === true) {
        //     res.send({result:'Error', error:'', string: '비밀번호에 쓸수 없는 특수문자가 있습니다'});
        //     return;
        // }
        //
        // var values = [
        //     req.body.fSlotR, req.body.fBaccaratR, req.body.fUnderOverR, req.body.fPBR,
        //     req.body.fPBSingleR, req.body.fPBDoubleR, req.body.fPBTripleR,
        //     req.body.fSettleBaccarat, req.body.fSettleSlot, req.body.fSettlePBA, req.body.fSettlePBB,
        //     req.body.iPBLimit, req.body.iPBSingleLimit, req.body.iPBDoubleLimit, req.body.iPBTripleLimit];
        // for (const v in values) {
        //     if (IUtil.checkBlockNum(v)) {
        //         res.send({result:'Error', error:'', string: '비밀번호에 쓸수 없는 특수문자가 있습니다'});
        //         return;
        //     }
        // }
        let strGroupID = await CalculateGroupID(req.body.strParentGroupID, req.body.iParentClass);
        console.log(`parent : ${req.body.strParentGroupID}, child : ${strGroupID}`);

        const parent = await db.Users.findOne({where:{id:req.body.iParentID}});
        if ( parent != null )
        {
            // 총본은 롤링 입력값에 대한 체크 안함
            if (parent.iClass > 2) {
                if ( parent.fSlotR < parseInt(req.body.fSlotR) ||
                    parent.fBaccaratR < parseInt(req.body.fBaccaratR) ||
                    parent.fUnderOverR < parseInt(req.body.fUnderOverR) ||
                    parent.fPBR < parseInt(req.body.fPBR) ||
                    parent.fPBSingleR < parseInt(req.body.fPBSingleR) ||
                    parent.fPBDoubleR < parseInt(req.body.fPBDoubleR) ||
                    parent.fPBTripleR < parseInt(req.body.fPBTripleR) )
                {
                    res.send({result:'Error', error:'Rolling', string:'롤링비(%)는 상위 에이전트 보다 클 수 없습니다.'});
                    return;
                }
                else if (parent.fSettleBaccarat < parseInt(req.body.fSettleBaccarat) ||
                    parent.fSettleSlot < parseInt(req.body.fSettleSlot) ||
                    parent.fSettlePBA < parseInt(req.body.fSettlePBA) ||
                    parent.fSettlePBB < parseInt(req.body.fSettlePBB) )
                {
                    res.send({result:'Error', error:'Settle', string:'죽장(%)은 상위 에이전트 보다 클 수 없습니다.'});
                    return;
                }
            }

                // 본사에서 직접 세팅 가능
                // else if(parent.iPBLimit < req.body.iPBLimit || parent.iPBSingleLimit < req.body.iPBSingleLimit || parent.iPBDoubleLimit < req.body.iPBDoubleLimit || parent.iPBTripleLimit < req.body.iPBTripleLimit)
                // {
                //     res.send({result:'Error', error:'PB', string:'베팅값은 상위 에이전트 보다 클 수 없습니다.'});
            // }
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
        });
        //
        // // 신규등록 알림 업데이트
        // const date = ITime.getCurrentDate();
        // for ( let i in global.socket_list )
        // {
        //     const parentClass = parseInt(req.body.iParentClass);
        //     const groupID = global.socket_list[i].strGroupID;
        //     const iClass = global.socket_list[i].iClass;
        //     // 노티는 등록자보다 상위에 있는 파트너에게만 노티
        //     if ((iClass == 2 || iClass == 3) && iClass <= parentClass) {
        //         // 해당되는 소켓
        //         if (strGroupID.indexOf(groupID) != -1) {
        //             const numPartner = await db.Users.count({
        //                 where:{
        //                     createdAt:{
        //                         [Op.between]:[ date, require('moment')(date).add(1, 'days').format('YYYY-MM-DD')],
        //                     },
        //                     strGroupID: {
        //                         [Op.like]: strGroupID+'%'
        //                     },
        //                     iClass: {
        //                         [Op.lte]: parseInt(req.body.iParentClass)+1
        //                     }
        //                 },
        //             });
        //
        //             const numUser = await db.Users.count({
        //                 where:{
        //                     createdAt:{
        //                         [Op.between]:[ date, require('moment')(date).add(1, 'days').format('YYYY-MM-DD')],
        //                     },
        //                     strGroupID: {
        //                         [Op.like]: strGroupID+'%'
        //                     },
        //                     iClass: 8
        //                 },
        //             });
        //
        //             global.socket_list[i].emit('register_user', numPartner, numUser);
        //         }
        //     }
        // }

        res.send({result:'OK', string:'에이전트 생성을 완료 하였습니다.'});
    } catch (err) {
        res.send({result:'FAIL', string:`에이전트 생성을 실패했습니다.(${err})`});
    }


    // let children = await db.Users.findAll({where:{
    //     strGroupID:{
    //         [Op.like]:req.body.strParentGroupID+'%'
    //     },
    //     iClass:parseInt(req.body.iParentClass)+1
    // }});

    // let group = '';
    // if ( children == null )
    //     group = '00';
    // else
    //     group = '0'+(parseInt(children.length)+1);

    // let strGroupID = req.body.strParentGroupID + group;
    //     console.log(`strGroupID is ${strGroupID}`);
});
// router.post('/user_modify', isLoggedIn, async(req, res) => {
//     console.log(req.body);
//     if(){}
//     await db.Users.update({})
//     await db.Users.update({
//         strNickname:req.body.strPassword,
//         strMobile:strMobileNo,
//         strBankAccount:req.body.strAccountNumber,
//         strPassword:req.body.strPassword,
//         strBankname:req.body.strBankName,
//         strBankOwner:req.body.strAccountOwner,
//     })

// });
router.post('/request_agentlist', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const list = await IAgent.GetComputedAgentList(req.body.strGroupID, parseInt(req.body.iTargetClass), req.body.dateStart, req.body.dateEnd, req.body.strSearchNickname, true);

    res.send({list:list, iRootClass:req.user.iClass, iPermission: req.user.iPermission});
});

/**
 * 본인 베팅 레코드 조회
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
                [Op.in]:[0, 100]
            },
            // eState:{
            //     [Op.notIn]:['STANDBY']
            // }
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
                    [Op.in]:[0, 100]
                },
                // eState:{
                //     [Op.notIn]:['STANDBY']
                // }
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
    let fSettlePBA = parseFloat(req.body.fSettlePBA);
    let fSettlePBB = parseFloat(req.body.fSettlePBB);

    let fRollingPBA = parseFloat(req.body.fRollingPBA);
    let fRollingPBBSingle = parseFloat(req.body.fRollingPBBSingle);
    let fRollingPBBDouble = parseFloat(req.body.fRollingPBBDouble);
    let fRollingPBBTriple = parseFloat(req.body.fRollingPBBTriple);
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
        } else if (user.fPBR > fRollingPBA) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 파워볼 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fPBSingleR > fRollingPBBSingle) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 파워볼 단폴 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fPBDoubleR > fRollingPBBDouble) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 파워볼 투폴 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fPBTripleR > fRollingPBBTriple) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 파워볼 쓰리폴 롤링값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fSettleSlot > fSettleSlot) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 슬롯 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fSettleBaccarat > fSettleBaccarat) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 바카라 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fSettlePBA > fSettlePBA) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 파워볼A 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        } else if (user.fSettlePBB > fSettlePBB) {
            res.send({result:'FAIL', message:`[${user.strNickname}] 파워볼B 죽장값은 일괄 수정 비율보다 높을 수 없습니다`});
            fail = true;
            break;
        }
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
            fSettlePBA:fSettlePBA,
            fSettlePBB:fSettlePBB,
            fPBR:fRollingPBA,
            fPBSingleR:fRollingPBBSingle,
            fPBDoubleR:fRollingPBBDouble,
            fPBTripleR:fRollingPBBTriple,
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
        if ( req.body.strOriginNickname != req.body.strNickname )
        {
            let targetuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
            if ( null != targetuser )
            {
                bUpdate = false;
                strErrorCode = 'UnknownUser';
            }
        }

        if ( user.iParentID != null )
        {
            let parent = await db.Users.findOne({where:{id:user.iParentID}});
            if ( null != parent )
            {
                console.log(`####################################################### ${parent.strID}, ${parent.iPBLimit}, ${req.body.iPBLimit}`);

                // if ( 
                //     parent.fSlotR < req.body.fSlotR ||
                //     parent.fBaccaratR < req.body.fBaccaratR ||
                //     parent.fUnderOverR < req.body.fUnderOverR ||
                //     parent.fPBR < req.body.fPBR ||
                //     parent.fPBSingleR < req.body.fPBSingleR ||
                //     parent.fPBDoubleR < req.body.fPBDoubleR ||
                //     parent.fPBTripleR < req.body.fPBTripleR ||
                //     // parent.fSettleSlot < req.body.fSettleSlot ||
                //     // parent.fSettleBaccarat < req.body.fSettleBaccarat ||
                //     // parent.fSettlePBA < req.body.fSettlePBA ||
                //     // parent.fSettlePBB < req.body.fSettlePBB ||
                //     parent.iPBLimit < req.body.iPBLimit || 
                //     parent.iPBSingleLimit < req.body.iPBSingleLimit || 
                //     parent.iPBDoubleLimit < req.body.iPBDoubleLimit ||
                //     parent.iPBTripleLimit < req.body.iPBTripleLimit
                //    )
                // {
                //     console.log(`########## ModifyAgentInfo : Error Parent`);
                //     bUpdate = false;
                //     strErrorCode = 'GreaterThanParent';
                // }
                if ( 
                    parent.fSlotR < req.body.fSlotR ||
                    parent.fBaccaratR < req.body.fBaccaratR ||
                    parent.fUnderOverR < req.body.fUnderOverR ||
                    parent.fPBR < req.body.fPBR ||
                    parent.fPBSingleR < req.body.fPBSingleR ||
                    parent.fPBDoubleR < req.body.fPBDoubleR ||
                    parent.fPBTripleR < req.body.fPBTripleR
                   )
                {
                    console.log(`########## ModifyAgentInfo : Error Parent`);
                    bUpdate = false;
                    strErrorCode = 'GreaterThanParent';
                }

                // 배팅금액은 본사가 자유롭게 조정 가능함
                if ( parseInt(parent.iClass) > 3 )
                {
                    if ( parent.iPBLimit < req.body.iPBLimit ||
                        parent.iPBSingleLimit < req.body.iPBSingleLimit ||
                        parent.iPBDoubleLimit < req.body.iPBDoubleLimit ||
                        parent.iPBTripleLimit < req.body.iPBTripleLimit
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
                // 대본사는 부본사 값 무시(대본사와 부본사는 동일하게 설정됨)
                if (user.iClass == 4 && children[i].iClass == 5) {
                    continue;
                }
                let child = children[i];
                if ( 
                    child.fSlotR > req.body.fSlotR ||
                    child.fBaccaratR > req.body.fBaccaratR ||
                    child.fUnderOverR > req.body.fUnderOverR ||
                    child.fPBR > req.body.fPBR ||
                    child.fPBSingleR > req.body.fPBSingleR ||
                    child.fPBDoubleR > req.body.fPBDoubleR ||
                    child.fPBTripleR > req.body.fPBTripleR ||
                    child.iPBLimit > req.body.iPBLimit ||
                    child.iPBSingleLimit > req.body.iPBSingleLimit ||
                    child.iPBDoubleLimit > req.body.iPBDoubleLimit ||
                    child.iPBTripleLimit > req.body.iPBTripleLimit
                   )
                {
                    console.log(`########## ModifyAgentInfo : Error Children`);
                    bUpdate = false;
                    strErrorCode = 'LessThanChild';
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
                strPBOptionCode:req.body.strPBOptionCode,
                fSlotR:req.body.fSlotR,
                fBaccaratR:req.body.fBaccaratR,
                fUnderOverR:req.body.fUnderOverR,
                fPBR:req.body.fPBR,
                fPBSingleR:req.body.fPBSingleR,
                fPBDoubleR:req.body.fPBDoubleR,
                fPBTripleR:req.body.fPBTripleR,
                // fSettleBaccarat:req.body.fSettleBaccarat,
                // fSettleSlot:req.body.fSettleSlot,
                // fSettlePBA:req.body.fSettlePBA,
                // fSettlePBB:req.body.fSettlePBB,
                iPBLimit:req.body.iPBLimit,
                iPBSingleLimit:req.body.iPBSingleLimit,
                iPBDoubleLimit:req.body.iPBDoubleLimit,
                iPBTripleLimit:req.body.iPBTripleLimit,
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
                    strNickname: user.strNickname,
                    strID: user.strID,
                    strGroupID: user.strGroupID,
                    strLogs: logMsg,
                    strEditorNickname: req.user.strNickname,
                });
            }

            // 대본사 롤링값이 변경될 경우 부본사 롤링값도 같이 변경 처리
            if (user.iClass == 4) {
                let msg = '';
                if (user.fBaccaratR != data.fBaccaratR) {
                    if (msg == '')
                        msg = `바카라롤링 변경(${user.fBaccaratR}=>${data.fBaccaratR})`;
                    else
                        msg = `${msg} | 바카라롤링 변경(${user.fBaccaratR}=>${data.fBaccaratR})`;
                }
                if (user.fUnderOverR != data.fUnderOverR) {
                    if (msg == '')
                        msg = `언오버롤링 변경(${user.fUnderOverR}=>${data.fUnderOverR})`;
                    else
                        msg = `${msg} | 언오버롤링 변경(${user.fUnderOverR}=>${data.fUnderOverR})`;
                }
                if (user.fSlotR != data.fSlotR) {
                    if (msg == '')
                        msg = `슬롯롤링 변경(${user.fSlotR}=>${data.fSlotR})`;
                    else
                        msg = `${msg} | 슬롯롤링 변경(${user.fSlotR}=>${data.fSlotR})`;
                }
                if (user.fPBR != data.fPBR) {
                    if (msg == '')
                        msg = `파워볼A롤링 변경(${user.fPBR}=>${data.fPBR})`;
                    else
                        msg = `${msg} | 파워볼A롤링 변경(${user.fPBR}=>${data.fPBR})`;
                }
                if (user.fPBSingleR != data.fPBSingleR) {
                    if (msg == '')
                        msg = `파워볼B단폴롤링 변경(${user.fPBSingleR}=>${data.fPBSingleR})`;
                    else
                        msg = `${msg} | 파워볼B단폴롤링 변경(${user.fPBSingleR}=>${data.fPBSingleR})`;
                }
                if (user.fPBDoubleR != data.fPBDoubleR) {
                    if (msg == '')
                        msg = `파워볼B투폴롤링 변경(${user.fPBDoubleR}=>${data.fPBDoubleR})`;
                    else
                        msg = `${msg} | 파워볼B투폴롤링 변경(${user.fPBDoubleR}=>${data.fPBDoubleR})`;
                }
                if (user.fPBTripleR != data.fPBTripleR) {
                    if (msg == '')
                        msg = `파워볼B쓰리폴롤링 변경(${user.fPBTripleR}=>${data.fPBTripleR})`;
                    else
                        msg = `${msg} | 파워볼B쓰리폴롤링 변경(${user.fPBTripleR}=>${data.fPBTripleR})`;
                }

                if ( msg != '' ) {
                    // 부본사 리스트 가져오기
                    let children = await db.Users.findAll({
                        where: {
                            iParentID:user.id,
                            iPermission: {
                                [Op.notIn]: [100]
                            },
                        }
                    });

                    for (let i in children) {
                        await children[i].update({
                            fSlotR:data.fSlotR,
                            fBaccaratR:data.fBaccaratR,
                            fUnderOverR:data.fUnderOverR,
                            fPBR:data.fPBR,
                            fPBSingleR:data.fPBSingleR,
                            fPBDoubleR:data.fPBDoubleR,
                            fPBTripleR:data.fPBTripleR,
                        });

                        await db.DataLogs.create({
                            strNickname: children[i].strNickname,
                            strID: children[i].strID,
                            strGroupID: children[i].strGroupID,
                            strLogs: msg,
                            strEditorNickname: req.user.strNickname,
                        });
                    }
                }
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

                for ( let i in children )
                {
                    await children[i].update({
                        iPBLimit:req.body.iPBLimit,
                        iPBSingleLimit:req.body.iPBSingleLimit,
                        iPBDoubleLimit:req.body.iPBDoubleLimit,
                        iPBTripleLimit:req.body.iPBTripleLimit,
                        strPBOptionCode:req.body.strPBOptionCode,
                    });
                }
            }

            if ( req.body.strNickname != req.body.strOriginNickname && bUpdate == true )
            {
                await db.RecordBets.update({strNickname:req.body.strNickname}, {where: {strNickname:req.body.strOriginNickname}});
                await db.Inouts.update({strID:req.body.strNickname}, {where:{strID:req.body.strOriginNickname}});
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
    if (source.fPBR != data.fPBR) {
        if (msg == '')
            msg = `파워볼A롤링 변경(${source.fPBR}=>${data.fPBR})`;
        else
            msg = `${msg} | 파워볼A롤링 변경(${source.fPBR}=>${data.fPBR})`;
    }
    if (source.fPBSingleR != data.fPBSingleR) {
        if (msg == '')
            msg = `파워볼B단폴롤링 변경(${source.fPBSingleR}=>${data.fPBSingleR})`;
        else
            msg = `${msg} | 파워볼B단폴롤링 변경(${source.fPBSingleR}=>${data.fPBSingleR})`;
    }
    if (source.fPBDoubleR != data.fPBDoubleR) {
        if (msg == '')
            msg = `파워볼B투폴롤링 변경(${source.fPBDoubleR}=>${data.fPBDoubleR})`;
        else
            msg = `${msg} | 파워볼B투폴롤링 변경(${source.fPBDoubleR}=>${data.fPBDoubleR})`;
    }
    if (source.fPBTripleR != data.fPBTripleR) {
        if (msg == '')
            msg = `파워볼B쓰리폴롤링 변경(${source.fPBTripleR}=>${data.fPBTripleR})`;
        else
            msg = `${msg} | 파워볼B쓰리폴롤링 변경(${source.fPBTripleR}=>${data.fPBTripleR})`;
    }

    if (source.iPBLimit != data.iPBLimit) {
        if (msg == '')
            msg = `파워볼베팅제한 변경(${source.iPBLimit}=>${data.iPBLimit})`;
        else
            msg = `${msg} | 파워볼베팅제한 변경(${source.iPBLimit}=>${data.iPBLimit})`;
    }
    if (source.iPBSingleLimit != data.iPBSingleLimit) {
        if (msg == '')
            msg = `단폴베팅제한 변경(${source.iPBSingleLimit}=>${data.iPBSingleLimit})`;
        else
            msg = `${msg} | 단폴베팅제한 변경(${source.iPBSingleLimit}=>${data.iPBSingleLimit})`;
    }
    if (source.iPBDoubleLimit != data.iPBDoubleLimit) {
        if (msg == '')
            msg = `투폴베팅제한 변경(${source.iPBDoubleLimit}=>${data.iPBDoubleLimit})`;
        else
            msg = `${msg} | 투폴베팅제한 변경(${source.iPBDoubleLimit}=>${data.iPBDoubleLimit})`;
    }
    if (source.iPBTripleLimit != data.iPBTripleLimit) {
        if (msg == '')
            msg = `쓰리폴베팅제한 변경(${source.iPBTripleLimit}=>${data.iPBTripleLimit})`;
        else
            msg = `${msg} | 쓰리폴베팅제한 변경(${source.iPBTripleLimit}=>${data.iPBTripleLimit})`;
    }

    // 체크 여부
    // if (source.strOptionCode != data.strOptionCode) {
    //     if (msg == '')
    //         msg = `파워볼타입 변경(${source.strOptionCode}=>${data.strOptionCode})`;
    //     else
    //         msg = `${msg} | 파워볼타입 변경(${source.strOptionCode}=>${data.strOptionCode})`;
    // }
    // if (source.strPBOptionCode != data.strPBOptionCode) {
    //     if (msg == '')
    //         msg = `파워볼타입 변경(${source.strPBOptionCode}=>${data.strPBOptionCode})`;
    //     else
    //         msg = `${msg} | 파워볼B쓰리폴롤링 변경(${source.strPBOptionCode}=>${data.strPBOptionCode})`;
    // }

    return msg;
}


/**
 * 가불 현황 목록
 */
// 파트너팝업 > 가불탭
router.post('/credits', isLoggedIn, async (req, res) => {
    console.log(req.body);

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        strID = dbuser.strID;
    }
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strID:strID,
                    iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);
    agent.iRootClass = req.user.iClass;
    agent.iPermission = req.user.iPermission;

    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    let list = await db.CreditRecords.findAll({
        where:{
            strID: strID,
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
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        strID = dbuser.strID;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strID:strID,
                        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

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

    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    let strID = '';
    if ( dbuser != null ) {
        iCash = dbuser.iCash;
        strID = dbuser.strID;
    }

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strID:strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

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