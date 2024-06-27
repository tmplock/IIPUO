const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const db = require('../db');

const {isLoggedIn, isNotLoggedIn} = require('./middleware');

const IHelper = require('../helpers/IHelper');
const {Op} = require("sequelize");

router.use(function (request,response,next){
    var ua = request.header('User-Agent');

    request.platform = (/lgtelecom/.test(ua) || /Android/.test(ua) || /blackberry/.test(ua) || /iphone/.test(ua) || /Iphone/.test(ua) || /iPhone/.test(ua) || /IPHONE/.test(ua)  || /ipad/.test(ua) || /samsung/.test(ua) || /symbian/.test(ua) || /sony/.test(ua) || /SCH-/.test(ua) || /SPH-/.test(ua)) ?
        'mobile' :
        'pc';

    next();
});

router.get('/list', async (req, res) => {
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
    res.render('letter/list', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/list_write', async (req, res) => {
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
    res.render('letter/list_write', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/listcs', async (req, res) => {
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
    res.render('letter/listcs', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/view', async (req, res) => {
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

    let objectLetter = await db.Letters.findOne({where:{id:req.query.id}});

    // 관리자가 보낸 쪽지 읽음 처리
    if ( objectLetter.strTo == req.user.strNickname ) {
        if (objectLetter.eRead == 'UNREAD') {
            await objectLetter.update({eRead:'READED'});
        }
    }

    const objectOutput = await IHelper.GetOutputRecords();
    const user = IHelper.GetUser(req.user);
    res.render('letter/view', {iLayout:0, bLogin:bLogin, user:user, messages:null, objectLetter:objectLetter, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

router.get('/write', async (req, res) => {
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
    res.render('letter/write', {iLayout:0, bLogin:bLogin, user:user, messages:null, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, ePublishing:global.ePublishing});
});

//
router.post('/request_writeletter',async (req, res) => {

    console.log(req.body);

    const userinfo = await db.Users.findOne({where:{strID:req.body.strID}});
    let objectData = await IHelper.GetParentList(req.user.strGroupID, req.user.iClass);

    if ( userinfo != null )
    {
        const letter = await db.Letters.create({
            iClass:userinfo.iClass,
            strGroupID:req.user.strGroupID,
            strAdminNickname:objectData.strAdmin,
            strPAdminNickname:objectData.strPAdmin,
            strVAdminNickname:objectData.strVAdmin,
            strAgentNickname:objectData.strAgent,
            strShopNickname:objectData.strShop,
            strTo:objectData.strAdmin,
            strToID:objectData.strAdminID,
            strFrom:userinfo.strNickname,
            strFromID:req.body.strID,
            eType:'NORMAL',
            eRead:'UNREAD',
            strSubject:req.body.strSubject,
            strContents:req.body.strContents,
            iClassFrom:userinfo.iClass, // 본인의 클래스
            iClassTo:3, // 본사로 전송 고정
        });

        let objectAxios = {strNickname:userinfo.strNickname, strID:userinfo.strID, strContents:req.body.strContents, strGroupID:userinfo.strGroupID};

        const cAddress = `${global.strAdminAddress}/manage_inout/letter_alert`;

        axios.post(cAddress,objectAxios)
        .then((response)=> {
            console.log('axios success to ${cAddress}');
            console.log(response);
        })
        .catch((error)=> {
            console.log('axios Error');
            console.log(error);
        });

        res.send({result:'OK', reason:'OK'});
    }
    else
    {
        res.send({result:'NO', reason:'Error'});
    }
});

router.post('/request_allread', async (req, res) => {
    try {
        await db.Letters.update({eRead:'READED'}, {
            where: {
                strTo:req.body.strNickname
            }
        });
        res.send({result: 'OK', msg:'정상처리'});
    } catch (err) {
        res.send({result: 'FAIL', msg:'처리중오류'});
    }
});

router.post('/request_listallletter', async (req, res) => {

    const strFrom = req.body.strID;
    const strTo = req.body.strID;

    const list = await db.Letters.findAll({
        where:{
            [Op.or]:[{
                strFrom: strFrom,
                iDelFrom: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                }
            }, {
                strTo:strTo,
                iDelTo: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                }
            }]
        },
        limit:10,
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

router.post('/request_listsendingletter', async (req, res) => {
    
    const strFrom = req.body.strID;
    
    const list = await db.Letters.findAll({
        where:{
            strFrom:strFrom,
            iDelFrom: {
                [Op.or]:{
                    [Op.is]: null,
                    [Op.not]:1
                }
            }
        },
        limit:10,
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

router.post('/request_listreceivingletter', async (req, res) => {
    
    const strTo = req.body.strID;
    
    const list = await db.Letters.findAll({
        where:{
            strTo:strTo,
            iDelTo: {
                [Op.or]:{
                    [Op.is]: null,
                    [Op.not]:1
                }
            }
        },
        limit:10,
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

router.post('/request_removeletter', async(req, res) => {
    console.log(req.body);
    let letter = await db.Letters.findOne({where: {id:req.body.id}});
    if (req.user.strID == letter.strTo) {
        await db.Letters.update({iDelTo:1}, {where:{id:req.body.id}});
    } else if (req.user.strID == letter.strFrom) {
        await db.Letters.update({iDelFrom:1}, {where:{id:req.body.id}});
    }
    res.send({result:'OK'});
});

router.post('/request_letterread', async (req, res) => {

    console.log('/request_letterread');
    console.log(req.body);

    await db.Letters.update({eRead:'READED'}, {where:{id:req.body.id}});

    res.send({result:'OK'});
});

router.post('/letter_reply', async (req, res) => {

    console.log('/letter_reply');
    console.log(req.body);

    for ( let i in global.socket_list )
    {
        if ( global.socket_list[i].strID == req.body.strID )
        {
            global.socket_list[i].emit('AlertLetter', '고객센터에 답변 메세지가 왔습니다.');
        }
    }
    res.send({result:'OK'});
});

router.post('/letter_admin', async (req, res) => {

    console.log('/letter_admin');
    console.log(req.body);

    for ( let i in global.socket_list )
    {
        if ( global.socket_list[i].strID == req.body.strID )
        {
            global.socket_list[i].emit('AlertAdminLetter', '고객센터에 관리자 메세지가 왔습니다.');
        }
    }
    res.send({result:'OK'});
});

module.exports = router;