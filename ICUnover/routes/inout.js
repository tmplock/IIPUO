const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const db = require('../db');

const IHelper = require('../helpers/IHelper');
const {Axios} = require("axios");
const moment = require('moment');

router.get('/input', async (req, res) => {

    console.log(`/inout/input : user ( ${req.user} )`);

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
    const user = IHelper.GetUser(req.user);
    res.render('inout/input', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/output', async (req, res) => {
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
    const user = IHelper.GetUser(req.user);
    res.render('inout/output', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/virtual', async (req, res) => {
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
    const user = IHelper.GetUser(req.user);
    res.render('inout/virtual', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/exchange', async (req, res) => {
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
    const user = IHelper.GetUser(req.user);
    res.render('inout/exchange', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/record', async (req, res) => {
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
    const user = IHelper.GetUser(req.user);
    res.render('inout/record', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/recordcoupon', async (req, res) => {
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
    const user = IHelper.GetUser(req.user);
    res.render('inout/recordcoupon', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});
//
router.post('/request_input', async (req, res) => {

    console.log(`request_input`);
    console.log(req.body);

    let iAmout  = parseInt(req.body.iAmount ?? 0);
    if (iAmout <= 0) {
        res.send({result:'NO', reason:'Error'});
        return;
    }

    const userinfo = await db.Users.findOne({where:{strID:req.body.strID}});

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1,
        t2.strNickname AS lev2,
        t3.strNickname AS lev3,
        t4.strNickname AS lev4,
        t5.strNickname AS lev5
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.iClass='${userinfo.iClass}' AND t6.strGroupID LIKE CONCAT('${userinfo.strGroupID}', '%');
        `
        );

        console.log(userinfo);

    let strAccountOwner = req.body.strInputName;
    let strBankName = req.body.strBankName;
    let strAccountNumber = req.body.strAccountNumber;
    let strBankType = req.body.strBankType;

    if ( userinfo != null )
    {

        let strAdminNickname = '';
        let strPAdminNickname = '';
        let strVAdminNickname = '';
        let strAgentNickname = '';
        let strShopNickname = '';

        if (userinfo.iClass == 6) {
            strAdminNickname = result[0].lev3;
            strPAdminNickname = result[0].lev4;
            strVAdminNickname = result[0].lev5;
            strAgentNickname = '';
            strShopNickname = '';
        } else if (userinfo.iClass == 7) {
            strAdminNickname = result[0].lev2;
            strPAdminNickname = result[0].lev3;
            strVAdminNickname = result[0].lev4;
            strAgentNickname = result[0].lev5;
            strShopNickname = '';
        } else if (userinfo.iClass == 8) {
            strAdminNickname = result[0].lev1;
            strPAdminNickname = result[0].lev2;
            strVAdminNickname = result[0].lev3;
            strAgentNickname = result[0].lev4;
            strShopNickname = result[0].lev5;
        }

        const inputmoney = await db.Inouts.create({
            strID:userinfo.strNickname,
            strAdminNickname:strAdminNickname,
            strPAdminNickname:strPAdminNickname,
            strVAdminNickname:strVAdminNickname,
            strAgentNickname:strAgentNickname,
            strShopNickname:strShopNickname,
            iClass:userinfo.iClass,
            strName:userinfo.strNickname,
            strGroupID:userinfo.strGroupID,
            strAccountOwner:strAccountOwner,
            strBankName:strBankName,
            strAccountNumber:strAccountNumber,
            strBankType:strBankType,
            iPreviousCash:userinfo.iCash,
            iAmount:req.body.iAmount,
            eType:'INPUT',
            eState:'REQUEST',
            completedAt:null,
        });

    let objectAxios = {strNickname:userinfo.strNickname, strID:userinfo.strID, strGroupID:userinfo.strGroupID};

    const cAddress = `${global.strAdminAddress}/manage_inout/input_alert`;

    axios.post(cAddress, objectAxios)
        .then((response)=> {
        })
        .catch((error)=> {
            // console.log('axios Error');
            // console.log(error);
        });

        res.send({result:'OK', reason:'OK'});
    }
    else
    {
        res.send({result:'NO', reason:'Error'});
    }
});

router.post('/request_output', async (req, res) => {

    console.log(`request_output : ${1}`);
    console.log(req.body);

    let iAmout = parseInt(req.body.iAmount ?? 0);
    if (iAmout < 50000) {
        res.send({result:'Error', reason:'Error'});
        return;
    }

    const userinfo = await db.Users.findOne({where:{
        strID:req.body.strID
    }});

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1,
        t2.strNickname AS lev2,
        t3.strNickname AS lev3,
        t4.strNickname AS lev4,
        t5.strNickname AS lev5
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.iClass=${userinfo.iClass} AND t6.strGroupID LIKE CONCAT('${userinfo.strGroupID}', '%');
        `
        );

    if(userinfo != undefined){

        if ( userinfo.iCash >= req.body.iAmount )
        {
            let strAdminNickname = '';
            let strPAdminNickname = '';
            let strVAdminNickname = '';
            let strAgentNickname = '';
            let strShopNickname = '';

            if (userinfo.iClass == 6) {
                strAdminNickname = result[0].lev3;
                strPAdminNickname = result[0].lev4;
                strVAdminNickname = result[0].lev5;
                strAgentNickname = '';
                strShopNickname = '';
            } else if (userinfo.iClass == 7) {
                strAdminNickname = result[0].lev2;
                strPAdminNickname = result[0].lev3;
                strVAdminNickname = result[0].lev4;
                strAgentNickname = result[0].lev5;
                strShopNickname = '';
            } else if (userinfo.iClass == 8) {
                strAdminNickname = result[0].lev1;
                strPAdminNickname = result[0].lev2;
                strVAdminNickname = result[0].lev3;
                strAgentNickname = result[0].lev4;
                strShopNickname = result[0].lev5;
            }

            console.log(`Password Checking : ${req.body.strPassword}, ${userinfo.strOutputPassword}`);

            //if ( userinfo.strOutputPassword == req.body.strPassword )
            //{
                const inputmoney = await db.Inouts.create({
                    strID:userinfo.strNickname,
                    strAdminNickname:strAdminNickname,
                    strPAdminNickname:strPAdminNickname,
                    strVAdminNickname:strVAdminNickname,
                    strAgentNickname:strAgentNickname,
                    strShopNickname:strShopNickname,
                    iClass:userinfo.iClass,
                    strName:userinfo.strNickname,
                    strGroupID:userinfo.strGroupID,
                    strAccountOwner:userinfo.strBankOwner,
                    strBankName:userinfo.strBankname,
                    strAccountNumber:userinfo.strBankAccount,
                    iPreviousCash:userinfo.iCash,
                    iAmount:req.body.iAmount,
                    eType:'OUTPUT',
                    eState:'REQUEST',
                    completedAt:null,
                });
    
                let objectAxios = {strNickname:userinfo.strNickname, strID:userinfo.strID, strContents:req.body.strContents, strGroupID:userinfo.strGroupID};

                const cAddress = `${global.strAdminAddress}/manage_inout/output_alert`;
                axios.post(cAddress, objectAxios)
                .then((response)=> {
                    console.log(`Axios Success Output_Alert`);
                    console.log(response);
                })
                .catch((error)=> {
                    console.log('axios Error');
                    console.log(error);
                });
        
                let resultCash = userinfo.iCash - parseInt(req.body.iAmount);
    
                await db.Users.update({iCash:resultCash},
                    {where:{
                        strID:req.body.strID
                    }});

                res.send({result:'OK', reason:'OK', iAmount:resultCash});
            // }
            // else
            // {
            //     res.send({result:"FAIL", reason:"INCORRECTPASSWORD"});    
            // }
        }
        else
        {
            res.send({result:"FAIL", reason:"NOTENOUGH"});
        }
    }
    else
    {
        res.send({result:'Error', reason:'Error'});
    }
});

router.post('/request_exchange', async (req, res) => {

    if ( req.user == null )
    {
        res.send({result:'Error'});
        return;
    }

    console.log(`/request_exchange`);
    console.log(req.body);

    const iUserRolling = parseInt(req.user.iRolling);
    const iRolling = parseInt(req.body.iRolling);

    if ( iUserRolling < iRolling )
    {
        res.send({result:'Error', code:'InvalidAmount'});
        return;
    }

    console.log(`Rolling UserRolling : ${req.user.iRolling}, `);

    let objectData = await IHelper.GetParentList(req.body.strGroupID, req.body.iClass);

    let admin = await db.Users.findOne({where:{strNickname:objectData.strAdmin}});
    let target = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    if ( admin != null && target != null )
    {
        const cAmount = parseInt(req.body.iRolling);

        if (cAmount <= 0) {
            res.send({result:'Error'});
            return;
        }

        // 롤링전환시에는 전환전 금액에 전환전 롤링값을 표시
        const iBeforeCashTo = parseInt(target.iCash);
        const iAfterCashTo = iBeforeCashTo+cAmount;
        const iBeforeRollingTo = parseInt(target.iRolling);
        const iAfterRollingTo = iBeforeRollingTo-cAmount;

        const iBeforeCashFrom = parseInt(admin.iCash);
        const iAfterCashFrom = iBeforeCashFrom - cAmount;

        await db.GTs.create({
            eType:'ROLLING',
            strTo:req.body.strNickname,
            strFrom:objectData.strAdmin,
            strGroupID:req.body.strGroupID,
            iAmount:cAmount,
            //iBeforeAmountTo:iBeforeRollingTo,
            iBeforeAmountTo:iBeforeCashTo,
            iAfterAmountTo:iAfterCashTo,
            iBeforeAmountFrom:iBeforeCashFrom,
            iAfterAmountFrom:iAfterCashFrom,
            iClassTo:target.iClass,
            iClassFrom:admin.iClass,
        });
    
        await db.Inouts.create({
            strID:req.body.strNickname,
            strAdminNickname:objectData.strAdmin,
            iClass:req.body.iClass,
            strName:req.body.strNickname,
            strGroupID:req.body.strGroupID,
            iAmount:cAmount,
            eType:'ROLLING',
            eState:'COMPLETE'
        });
    
        const cAdminCash = parseInt(admin.iCash)-cAmount;

        await db.Users.update({iCash:parseInt(target.iCash)+cAmount, iRolling:parseInt(target.iRolling)-cAmount}, {where:{strNickname:req.body.strNickname}});
        await db.Users.update({iCash:cAdminCash, iRolling:parseInt(admin.iRolling)+cAmount}, {where:{strNickname:objectData.strAdmin}});

        // await target.update({
        //     iCash:parseInt(target.iCash)+cAmount,
        //     iRolling:parseInt(target.iRolling)-cAmount,
        // });

        // const cAdminCash = parseInt(admin.iCash)-cAmount;
        // await admin.update({iCash:cAdminCash, iRolling:parseInt(admin.iRolling)+cAmount});
    
        res.send({result:'OK'});
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.post('/request_inputlist', async (req, res) => {

    console.log(`request_inputlist : ${1}`);
    console.log(req.body);

    const list = await db.Inouts.findAll({
        where:{
            eType:'INPUT',
            strID:req.user.strNickname,
            // strGroupID:{
            //     [Op.like]:req.user.strGroupID+'%'
            // }
        },
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

router.post('/request_outputlist', async (req, res) => {

    console.log(`request_inputlist : ${1}`);
    console.log(req.body);

    const list = await db.Inouts.findAll({
        where:{
            eType:'OUTPUT',
            strID:req.user.strNickname,
            // strGroupID:{
            //     [Op.like]:req.user.strGroupID+'%'
            // }
        },
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

/**
 * 계좌 관련
 */
router.post('/request_bank', async (req, res) => {

    console.log(`########## /inout/request_bank`);

    if ( req.user == null )
    {
        res.send({result:'Error', eCode:'InvalidSession'});
        return;
    }

    try {

        const objectData = {strID:req.user.strID, strInput:req.body.input};

        const objectResult = await IHelper.RequestAxios2(`${process.env.ADMIN_URL}/user/request_bank`, objectData);

        console.log(objectResult);

        let obj = await IHelper.GetParentList(req.user.strGroupID, req.user.iClass);

        await db.RecordInoutAccounts.create({

            strID:req.user.strID,
            strNickname:req.user.strNickname,
            strAdminNickname:obj.strAdmin,
            strPAdminNickname:obj.strPAdmin,
            strVAdminNickname:obj.strVAdmin,
            strAgentNickname:obj.strAgent,
            strShopNickname:obj.strShop,
            iClass:req.user.iClass,
            strGroupID:req.user.strGroupID,
            strMemo:'',
            eType:'REQUEST',
            eState:'VALID',
            iAllowedTime :5,
        });

        let recent = await db.RecordDailyOverviews.findOne({
            where: {
                // strDate:{
                //     [Op.between]:[ strTimeStart, strTimeEnd ],
                // },
                strID:req.user.strID,
                eType:'REQUEST',
            },
            order:[['createdAt','DESC']]
        });

        if ( recent != null )
        {
            const start = moment(recent.createdAt);
            const end = moment();

            const seconds = moment.duration(end.diff(start)).asSeconds();

            console.log(`recent id : ${recent.id}`);
            console.log(`##### Difference of Time as Seconds : ${seconds}`);
        }

    

        res.send(objectResult);
    }
    catch {
        res.send({result:'Error', eCode:'Null'});
    }

    return;

    if ( objectResult.result == 'OK')
    {
        res.send({result:'OK', })        
    }

    try {
        console.log(`request_bank`);
        console.log(req.body);

        const strNickname = req.user.strNickname;
        const input = req.body.input;

        const info = await db.Users.findOne({where: {strNickname: strNickname, strPassword: input}});
        if (info == null) {
            res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
            return;
        }

        let iMin = 15;
        // 총본용 strGroupID
        let strKey = `${info.strGroupID}`.substring(0, 3);
        let setting = await db.SettingRecords.findOne({where:{ strKey: strKey}});
        if (setting != null) {
            iMin = parseInt(setting.strValue ?? '15');
            iMin = Number.isNaN(iMin) ? 0 : iMin;
        }

        let eBankType = 'NORMAL';
        if (info.iPassCheckNewUser != 1) {
            let list = await db.Inouts.findAll({where: {strID: info.strNickname, eState: 'COMPLETE'}});
            if (list.length < iMin) {
                let iPassCheckNewUser = info.iPassCheckNewUser ?? 1;
                if (iPassCheckNewUser != 1) {
                    eBankType = 'NEWUSER';
                }
            } else {
                await db.Users.update({iPassCheckNewUser:1}, {where: {id: info.id}});
            }
        }

        let obj = await IHelper.GetParentList(info.strGroupID, info.iClass);
        console.log(obj);

        let bankList = await db.sequelize.query(`
            SELECT b.eBankType,  b.strBankName AS strBankName, b.strBankNumber AS strBankNumber, b.strBankHolder AS strBankHolder, DATE_FORMAT(b.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt
            FROM BankRecords b
            LEFT JOIN Users u ON u.id = b.userId
            WHERE b.eType='ACTIVE' AND u.strNickname = '${obj.strAdmin}' AND b.eBankType = '${eBankType}'
            LIMIT 1
        `, {type: db.Sequelize.QueryTypes.SELECT});
        // 총본 날려도 되는지 확인 필요
        // if (bank.length == 0) {
        //     bank = await db.sequelize.query(`
        //     SELECT b.strBankName AS strBankName, b.strBankNumber AS strBankNumber, b.strBankHolder AS strBankHolder
        //     FROM BankRecords b
        //     LEFT JOIN Users u ON u.id = b.userId
        //     WHERE b.eType='ACTIVE' AND u.strNickname = '${obj.strPAdmin}'
        //     LIMIT 1
        // `, {type: db.Sequelize.QueryTypes.SELECT});
        // }
        let bankType = '';
        let bankname = '';
        let banknumber = '';
        let bankholder = '';

        if (bankList.length > 0) {
            let bank = bankList[0];
            bankType = bank.eBankType;
            bankname = bank.strBankName;
            banknumber = bank.strBankNumber;
            bankholder = bank.strBankHolder;
            let msg = `입금신청을 해주시기 바랍니다`;
            res.send({result: 'OK', msg: msg, bankType:bankType, bankname: bankname, banknumber: banknumber, bankholder:bankholder, iUpdateAccount:1});
            return;
        }

        // 혹시 등록된 통장이 있는지 확인
        // bankList = await db.sequelize.query(`
        //     SELECT b.eBankType,  b.strBankName AS strBankName, b.strBankNumber AS strBankNumber, b.strBankHolder AS strBankHolder, DATE_FORMAT(b.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt
        //     FROM BankRecords b
        //     LEFT JOIN Users u ON u.id = b.userId
        //     WHERE b.eType='STOP' AND u.strNickname = '${obj.strAdmin}' AND b.eBankType = '${eBankType}'
        //     LIMIT 1
        // `, {type: db.Sequelize.QueryTypes.SELECT});
        res.send({result: 'FAIL', msg: '현재 계좌 준비 중입니다', bankType: '', bankname:'', banknumber:'', bankholder:''});
    } catch (err) {
        console.log(err);
        res.send({result: 'FAIL', msg: `오류가 발생했습니다(${err})`, bankType: '', bankname:'', banknumber:'', bankholder:''});
    }
});

router.post('/request_user_bank', async (req, res) => {
    try {
        console.log(`request_user_bank`);
        console.log(req.body);

        const strNickname = req.user.strNickname;
        const input = req.body.input;

        const info = await db.Users.findOne({where: {strNickname: strNickname, strPassword: input}});
        if (info == null) {
            res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
            return;
        }
        console.log(info);
        let bankname = info.strBankname ?? '';
        let banknumber = info.strBankAccount ?? '';
        let bankholder = info.strBankOwner ?? '';
        if (bankname == '' || banknumber == '' || bankholder == '') {
            res.send({result: 'FAIL', msg: `등록된 출금 계좌가 없습니다`, bankname:'', banknumber:'', bankholder:''});
            return;
        }
        res.send({result: 'OK', msg:'출금 계좌 조회 성공', bankname:info.strBankname, banknumber:info.strBankAccount, bankholder:info.strBankOwner});
    } catch (err) {
        console.log(err);
        res.send({result: 'FAIL', msg: `오류가 발생했습니다(${err})`, bankname:'', banknumber:'', bankholder:''});
    }
});

let SendBankLetter = async (req, res, userinfo) => {
    console.log(req.body);

    let strSubject = '입금계좌문의';
    let strContents = '입금계좌문의';

    let objectData = await IHelper.GetParentList(req.user.strGroupID, req.user.iClass);

    if (userinfo != null) {
        const letter = await db.Letters.create({
            iClass: userinfo.iClass,
            strGroupID: req.user.strGroupID,
            strAdminNickname: objectData.strAdmin,
            strPAdminNickname: objectData.strPAdmin,
            strVAdminNickname: objectData.strVAdmin,
            strAgentNickname: objectData.strAgent,
            strShopNickname: objectData.strShop,
            strTo: objectData.strAdmin,
            strToID: objectData.strAdminID,
            strFrom: userinfo.strNickname,
            strFromID: userinfo.strID,
            eType: 'NORMAL',
            eRead: 'UNREAD',
            strSubject: strSubject,
            strContents: strContents,
            iClassFrom: userinfo.iClass, // 본인의 클래스
            iClassTo: 3, // 본사로 전송 고정
        });

        let objectAxios = {
            strNickname: userinfo.strNickname,
            strID: userinfo.strID,
            strContents: strContents,
            strGroupID: userinfo.strGroupID
        };

        const cAddress = `${global.strAdminAddress}/manage_inout/letter_alert`;

        axios.post(cAddress, objectAxios)
            .then((response) => {
                console.log('axios success to ${cAddress}');
                console.log(response);
            })
            .catch((error) => {
                console.log('axios Error');
                console.log(error);
            });

        res.send({result: 'OK', msg: '계좌문의가 정상적으로 요청되었습니다. 쪽지로 계좌정보가 전달됩니다', bankname: '쪽지문의'});
    } else {
        res.send({result: 'FAIL', msg: '오류가 발생했습니다', bankname: ''});
    }
}

module.exports = router;