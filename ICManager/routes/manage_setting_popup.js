const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

let axios = require('axios');

const db = require('../models');
const IInout = require('../implements/inout');
const {Op, where}= require('sequelize');

const IAgent = require('../implements/agent3');
const ISocket = require('../implements/socket');
const {isLoggedIn} = require("./middleware");

router.post('/writeannouncement', isLoggedIn, async (req, res) => {
    
    console.log(req.body);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    res.render('manage_setting/popup_writeannouncement', {iLayout:1, iHeaderFocus:1, agent:user, eType:req.body.eType});

});

router.post('/writeletter', isLoggedIn, async (req, res) => {
    
    console.log(req.body);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    const dbuser = await db.Users.findOne({where:{strNickname:user.strNickname}});
    if ( null != dbuser )
        user.strID = dbuser.strID;
    let strTo = req.body.strTo ?? '';
    if (strTo != '') {
        res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:[], strTo:strTo, directSend: true});
        return;
    }
    if (dbuser.iClass > 3) { // 대본사부터는 본사에만 쪽지를 보낼 수 있음(강제로 본사 지정)
        // 본사를 가져오기
        let parents = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass);
        strTo = parents.strAdmin;
        res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:[], strTo:strTo, directSend: false});
        return;
    }

    let strChildes = [];
    if (dbuser.iClass == 3) { // 본사는 하위에만 쪽지 보낼 수 있음(총본에게는 관리자문의로)
        strChildes = await IAgent.GetChildNicknameList(req.body.strGroupID, parseInt(req.body.iClass)+1);
    } else if (dbuser.iClass <= 3) { // 본사 이하는 하위에 쪽지를 보낼 수 있음
        strChildes = await IAgent.GetChildNicknameList(req.body.strGroupID, parseInt(req.body.iClass)+1);
    }
    res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:strChildes, strTo: strTo, directSend: false});
});

router.post('/direct_writeletter', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:req.user.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    const dbuser = await db.Users.findOne({where:{strNickname:user.strNickname}});
    if ( null != dbuser )
        user.strID = dbuser.strID;
    let strTo = req.body.strTo ?? '';
    if (strTo != '') {
        res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:[], strTo:strTo, directSend: true});
        return;
    }
    if (dbuser.iClass > 3) { // 대본사부터는 본사에만 쪽지를 보낼 수 있음(강제로 본사 지정)
        // 본사를 가져오기
        let parents = await IAgent.GetParentList(req.user.strGroupID, req.user.iClass);
        strTo = parents.strAdmin;
        res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:[], strTo:strTo, directSend: false});
        return;
    }

    let strChildes = [];
    if (dbuser.iClass == 3) { // 본사는 하위에만 쪽지 보낼 수 있음(총본에게는 관리자문의로)
        strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, parseInt(req.user.iClass)+1);
    } else if (dbuser.iClass <= 3) { // 본사 이하는 하위에 쪽지를 보낼 수 있음
        strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, parseInt(req.user.iClass)+1);
    }
    res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:strChildes, strTo: strTo, directSend: false});
});

router.post('/direct_writeletter', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:req.user.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    const dbuser = await db.Users.findOne({where:{strNickname:user.strNickname}});
    if ( null != dbuser )
        user.strID = dbuser.strID;
    let strTo = req.body.strTo ?? '';
    if (strTo != '') {
        res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:[], strTo:strTo, directSend: true});
        return;
    }
    if (dbuser.iClass > 3) { // 대본사부터는 본사에만 쪽지를 보낼 수 있음(강제로 본사 지정)
        // 본사를 가져오기
        let parents = await IAgent.GetParentList(req.user.strGroupID, req.user.iClass);
        strTo = parents.strAdmin;
        res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:[], strTo:strTo, directSend: false});
        return;
    }

    let strChildes = [];
    if (dbuser.iClass == 3) { // 본사는 하위에만 쪽지 보낼 수 있음(총본에게는 관리자문의로)
        strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, parseInt(req.user.iClass)+1);
    } else if (dbuser.iClass <= 3) { // 본사 이하는 하위에 쪽지를 보낼 수 있음
        strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, parseInt(req.user.iClass)+1);
    }
    res.render('manage_setting/popup_writeletter', {iLayout:1, iHeaderFocus:1, agent:user, strParent: '', strChildes:strChildes, strTo: strTo, directSend: false});
});

router.post('/group_writeletter', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const user = {strNickname:req.user.strNickname, strGroupID:req.user.strGroupID, iClass:req.user.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    const dbuser = await db.Users.findOne({where:{strNickname:user.strNickname}});
    if ( null != dbuser )
        user.strID = dbuser.strID;

    res.render('manage_setting/popup_group_writeletter', {iLayout:1, iHeaderFocus:1, agent:user});
});

router.post('/readletter', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass, strTarget:req.body.target,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    let contents = await db.Letters.findOne({where:{id:parseInt(req.body.id)}});

    if (user.iPermission != 100) {
        if (contents.eRead == 'UNREAD') {
            // 읽음 처리는 작성자와 다른 사람이 볼 경우에만 처리
            if (user.strNickname != contents.strFrom) {
                await db.Letters.update({eRead:'READED'}, {where:{id:parseInt(req.body.id)}});
            }
        } else if (contents.eRead == 'REPLY') {
            // 답변확인은 작성자일 경우에만 처리
            if (user.strNickname == contents.strFrom) {
                await db.Letters.update({eRead:'REPLY_READED'}, {where:{id:parseInt(req.body.id)}});
            }
        }
    }

    let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);

    // 알림들 업데이트
    ISocket.AlertUpdateByNickname(req.body.strNickname, iocount);

    contents.strSubject = (contents.strSubject ?? '').replace(/(\n|\r\n)/g, '');
    contents.strContents = (contents.strContents ?? '').replace(/(\n|\r\n)/g, '<br>');

    if (contents.strFrom == req.body.strNickname || contents.eRead == 'REPLY' || contents.eRead == 'REPLY_READED' || req.user.iPermission == 100) {
        res.render('manage_setting/popup_readletter', {iLayout:1, iHeaderFocus:1, agent:user, contents:contents, iocount:iocount, letterType: req.body.letterType});
    } else {
        res.render('manage_setting/popup_readwriteletter', {iLayout:1, iHeaderFocus:1, agent:user, contents:contents, iocount:iocount, letterType: req.body.letterType});
    }
});

router.post('/request_replyletter', isLoggedIn, async (req, res) => {

    if (req.user.iClass != 2 || req.user.iPermission == 100) {
        res.send({result : 'FAIL', msg : '권한없음'});
        return;
    }

    let letter = await db.Letters.findOne({where : {id: req.body.id}});
    if (letter == null) {
        res.send({'result' : 'FAIL', 'msg' : '해당 쪽지 없음'});
        return;
    }

    await db.Letters.update({eRead:'REPLY', strAnswers: req.body.strAnswers}, {where : {id: req.body.id}});

    if (letter.iClassFrom >= 6) {
        // letter_reply
        let objectAxios = {strNickname:letter.strFrom, strID:letter.strFromID};
        let user = await db.Users.findOne({where:{strNickname:letter.strFrom}});
        const cAddress = `${user.strURL}/letter/letter_reply`;
        axios.post(cAddress, objectAxios)
            .then((response)=> {
                console.log(`Axios Success to ${cAddress}`);
                console.log(response);
            })
            .catch((error)=> {
                console.log('axios Error');
                console.log(error);
            });
    }

    if (letter.iClassFrom < 8) {
        ISocket.AlertByNickname(letter.strFrom, 'alert_letter_reply');
    }

    let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);
    ISocket.AlertUpdateByNickname(req.user.strNickname, iocount);

    res.send({'result' : 'OK'});
});

//
router.post('/request_letterreceiver', isLoggedIn, async (req, res) => {
    console.log(req.body);

    if ( req.body.strKeyword == '' )
    {
        if ( req.body.strGroup == 'ALL')
        {
            let receivers = await db.Users.findAll({
                attributes:[
                    'strNickname',
                    'strID'
                ],
                where:
                {
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    iClass:{[Op.gte]:parseInt(req.body.iTargetClass)+1},
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                },
            });
            res.send(receivers);        
        }        
        else if ( req.body.iTargetClass == req.body.iClass )
        {
            let receivers = await db.Users.findAll({
                attributes:[
                    'strNickname','strID'
                ],
                where:
                {
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    iClass:{[Op.gte]:parseInt(req.body.iTargetClass)+1},
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                },
            });
            res.send(receivers);        
        }
        else 
        {
            let receivers = await db.Users.findAll({
                attributes:[
                    'strNickname', 'strID'
                ],
                where:
                {
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    iClass:parseInt(req.body.iTargetClass),
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                },
            });
            res.send(receivers);        
        }
    }
    else
    {
        let receivers = await db.Users.findAll({
            attributes:[
                'strNickname',
                'strID'
            ],
            where:
            {
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                //iClass:{[Op.gte]:parseInt(req.body.iTargetClass)},
                //strNickname:{[Op.like]:'%'+req.body.strKeyword+'%'}
                strNickname:req.body.strKeyword,
                iPermission: {
                    [Op.notIn]: [100]
                },
            },
        });
        res.send(receivers);        
    }
});


router.post('/request_receiver', isLoggedIn, async (req, res) => {
    if (req.user.iClass > req.body.iClass) {
        res.send({'result' : 'FAIL'});
        return;
    }

    let strChildes = await IAgent.GetChildNicknameList(req.body.strGroupID, parseInt(req.body.iClass));
    res.send({'result' : 'OK', 'strChildes' : strChildes, 'iClass' : req.body.iClass});
});

//FIXME: 유저가 쪽지를 보낼 경우 아래 호출됨
router.post('/request_writeletter', async (req, res) => {

    let strReceivers = req.body.receivers;
    let arrayTos = strReceivers.split(',');
    let arrayObject = [];
    for ( let i = 0; i < arrayTos.length/2; ++ i )
    {
        arrayObject.push({strID:arrayTos[i*2+0], strNickname:arrayTos[i*2+1]});
    }
    console.log(req.body.receivers);
    console.log(arrayObject);

    console.log(`################################################## /manage_setting_popup/request_writeletter`);
    console.log(req.body);

    let dbuser = await db.Users.findOne({where: {strNickname:req.body.strFrom}});
    if (dbuser == null) {
        res.send({result:'FAIL', msg: '작성 유저 없음'});
        return;
    }

    let objectData = await IAgent.GetParentList(req.body.strGroupID, req.body.iClass);

    for ( let i in arrayObject )
    {
        console.log(arrayObject[i]);

        await db.Letters.create({
            iClass:dbuser.iClass,
            strGroupID:req.body.strGroupID,
            strAdminNickname:objectData.strAdmin,
            strPAdminNickname:objectData.strPAdmin,
            strVAdminNickname:objectData.strVAdmin,
            strAgentNickname:objectData.strAgent,
            strShopNickname:objectData.strShop,
            strFrom:req.body.strFrom,
            strFromID:req.body.strFromID,
            strTo:arrayObject[i].strNickname,
            strToID:arrayObject[i].strID,
            eType:'NORMAL',
            eRead:'UNREAD',
            strSubject:'',
            strContents:req.body.contents,
            iClassTo:req.body.iClass,
            iClassFrom:dbuser.iClass,
            strWriter:req.user.strNickname
        });

        let objectAxios = {strNickname:arrayObject[i].strNickname, strID:arrayObject[i].strID, strContents:req.body.contents};

        const user = await db.Users.findOne({where:{strID:arrayObject[i].strID}});
        
        //axios.post(`${global.strUserPageAddress}/AlertLetter`, objectAxios)
        axios.post(`${user.strURL}/AlertLetter`, objectAxios)
        // axios.post('https://ppuolive.com/AlertLetter', objectAxios)
        .then((response)=> {
            console.log(`Axios Success /AlertLetter : ${arrayObject[i].strNickname} : ${user.strURL}`);
        })
        .catch((error)=> {
            console.log('axios Error /AlertLetter');
        });

        ISocket.AlertByNickname(arrayObject[i].strNickname, 'alert_letter');
    }
    res.send({result:'OK'});
});

//FIXME: 관리자 페이지에서 쪽지를 보낼 경우 아래 호출됨
router.post('/request_writeletter_partner', isLoggedIn, async (req, res) => {
    console.log(`################################################## /manage_setting_popup/request_writeletter_partner`);
    console.log(req.body);

    const fromUser = await IAgent.GetUserInfo(req.body.strFrom);
    if (fromUser.iPermission == 100) {
        fromUser.strID = fromUser.strIDRel;
        fromUser.strNickname = fromUser.strNicknameRel;
    }

    const toUser = await db.Users.findOne({where:{strNickname:req.body.receivers}});

    const parents = await IAgent.GetParentList(fromUser.strGroupID, fromUser.iClass);

    await db.Letters.create({
        strAdminNickname:parents.strAdmin,
        strPAdminNickname:parents.strPAdmin,
        strVAdminNickname:parents.strVAdmin,
        strAgentNickname:parents.strAgent,
        strShopNickname:parents.strShop,
        strGroupID:fromUser.strGroupID,
        iClass:fromUser.iClass,
        strFrom:fromUser.strNickname,
        strFromID:fromUser.strID,
        strTo:toUser.strNickname,
        strToID:toUser.strID,
        eType:'NORMAL',
        eRead:'UNREAD',
        strSubject:req.body.subjects,
        strContents:req.body.contents,
        strAnswers:'',
        iClassTo:toUser.iClass,
        iClassFrom:fromUser.iClass,
        strWriter:req.user.strNickname
    });

    if (toUser.iClass >= 6) {
        // letter_reply
        let objectAxios = {strNickname:toUser.strNickname, strID:toUser.strID};
        const cAddress = `${toUser.strURL}/letter/letter_admin`;
        axios.post(cAddress, objectAxios)
            .then((response)=> {
                console.log(`Axios Success to ${cAddress}`);
                console.log(response);
            })
            .catch((error)=> {
                console.log('axios Error');
                console.log(error);
            });
    }

    if (toUser.iClass < 8) {
        // 본사에게 보내는 쪽지일 경우에는 소속 총본에도 보내줘야 함
        if (toUser.iClass == 3 && fromUser.iClass != 2) {
            let nickname = ISocket.GetNicknameClass(toUser.strGroupID, 2);
            if (nickname != '') {
                ISocket.AlertByNickname(nickname, 'alert_letter');
            }
        }
        // 받는 사람에게만 알림 보내기
        ISocket.AlertByNickname(toUser.strNickname, 'alert_letter');
    }

    res.send({result:'OK'});
});

router.post('/request_writeletter_partner_group', isLoggedIn, async (req, res) => {
    console.log(`################################################## /manage_setting_popup/request_writeletter_partner_group`);
    console.log(req.body);

    let receiverType = req.body.receiverType ?? '';
    let receiverClass = parseInt(req.body.receiverClass ?? 0);
    let receiverNickname = req.body.receiverNickname ?? '';
    let bIncludeUser = req.body.bIncludeUser ?? false;

    if (receiverClass == 0 || receiverType == '') {
        res.send({result:'FAIL', msg: '전송 실패'});
        return;
    }

    const fromUser = await IAgent.GetUserInfo(req.body.strFrom);
    if (fromUser.iPermission == 100) {
        fromUser.strID = fromUser.strIDRel;
        fromUser.strNickname = fromUser.strNicknameRel;
    }

    const toGroupUser = await db.Users.findOne({where: { strNickname: receiverNickname }});
    let receiverGroupID = toGroupUser.strGroupID;

    let dataList = [];
    // 전체 + 하위포함
    if (receiverType == 0) {
        dataList = await db.Users.findAll({
            where: {
                iClass:{
                    [Op.gte]:receiverClass,
                },
                strGroupID: {
                    [Op.like]:`${fromUser.strGroupID}%`
                }
            }});
    } else if (receiverType == 1) { // 해당 클래만
        dataList = await db.Users.findAll({
            where: {
                iClass:receiverClass,
                strGroupID: {
                    [Op.like]:`${fromUser.strGroupID}%`
                }
            }});
    } else if (receiverType == 2) { // 선택 클래스만
        dataList = await db.Users.findAll({
            where: {
                iClass:{
                    [Op.gte]:receiverClass,
                },
                strGroupID: {
                    [Op.like]:`${receiverGroupID}%`
                }
            }});
    }

    let groupList = [];
    for (let i in dataList) {
        if (dataList[i].iClass == 8 && bIncludeUser == true) {
            groupList.push(dataList[i]);
        } else {
            groupList.push(dataList[i]);
        }
    }

    for (let i in groupList) {
        let toUser = groupList[i];
        const parents = await IAgent.GetParentList(toUser.strGroupID, toUser.iClass);
        await db.Letters.create({
            strAdminNickname:parents.strAdmin,
            strPAdminNickname:parents.strPAdmin,
            strVAdminNickname:parents.strVAdmin,
            strAgentNickname:parents.strAgent,
            strShopNickname:parents.strShop,
            strGroupID:fromUser.strGroupID,
            iClass:fromUser.iClass,
            strFrom:fromUser.strNickname,
            strFromID:fromUser.strID,
            strTo:toUser.strNickname,
            strToID:toUser.strID,
            eType:'NORMAL',
            eRead:'UNREAD',
            strSubject:req.body.subjects,
            strContents:req.body.contents,
            strAnswers:'',
            iClassTo:toUser.iClass,
            iClassFrom:fromUser.iClass,
            strWriter:req.user.strNickname
        });
    }

    for (let i in groupList) {
        let toUser = groupList[i];
        if (toUser.iClass >= 6) {
            if (bIncludeUser == false && toUser.iClass != 8) {

            }
            // letter_reply
            let objectAxios = {strNickname:toUser.strNickname, strID:toUser.strID};
            const cAddress = `${toUser.strURL}/letter/letter_admin`;
            axios.post(cAddress, objectAxios)
                .then((response)=> {
                    console.log(`Axios Success to ${cAddress}`);
                    console.log(response);
                })
                .catch((error)=> {
                    console.log('axios Error');
                    console.log(error);
                });
        }

        if (toUser.iClass < 8) {
            // 본사에게 보내는 쪽지일 경우에는 소속 총본에도 보내줘야 함
            if (toUser.iClass == 3 && fromUser.iClass != 2) {
                let nickname = ISocket.GetNicknameClass(toUser.strGroupID, 2);
                if (nickname != '') {
                    ISocket.AlertByNickname(nickname, 'alert_letter');
                }
            }
            // 받는 사람에게만 알림 보내기
            ISocket.AlertByNickname(toUser.strNickname, 'alert_letter');
        }
    }

    res.send({result:'OK'});
});

/**
 * 보낸 쪽지 목록
 * 총본에서 쪽지 삭제시 실제 해당 쪽지 삭제
 * 총본외에 하위 파트너에서 삭제한 쪽지는 조회만 안되게 하기
 */
router.post('/request_letterrecord', isLoggedIn, async (req, res) => {

    if (req.user.iPermission == 100) {
        res.redirect("/");
        return;
    }

    const cNumElementsPage = 50;

    let listFrom = [];

    let listState = [];
    if ( req.body.eState == 'ALL')
    {
        listState.push('READED');
        listState.push('UNREAD');
        listState.push('REPLY');
        listState.push('REPLY_READED');
        listState.push('');
    }
    else
        listState.push(req.body.eState);

    let strKeyword = req.body.strKeyword ?? '';

    const user = await IAgent.GetUserInfo(req.body.strNickname);
    let strFrom = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;

    let totalCount = 0;
    if (req.body.iClass == 2 && req.user.iClass == 2) {
        totalCount = strKeyword == '' ? await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                eRead:{[Op.or]:listState}
            },
        }) : await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                strTo:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
            },
        });
    } else {
        totalCount = strKeyword == '' ? await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                eRead:{[Op.or]:listState},
                iDelFrom: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                }
            },
        }) : await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                strTo:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
                iDelFrom: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                }
            },
        });
    }

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let letters = [];
    if (req.body.iClass == 2 && req.user.iClass == 2) {
        letters = strKeyword == '' ? await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                eRead:{[Op.or]:listState},
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        }) :  await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                strTo:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        });
    } else {
        letters = strKeyword == '' ? await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                eRead:{[Op.or]:listState},
                iDelFrom: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                }
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        }) : await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strFrom:strFrom,
                strTo:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
                iDelFrom: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                }
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        });
    }

    res.send({letters:letters, currentPage:req.body.iPage, totalCount:totalCount});
});

//  받은 쪽지 목록
/**
 * 받은 쪽지 목록
 * 총본에서 쪽지 삭제시 실제 해당 쪽지 삭제
 * 총본외에 하위 파트너에서 삭제한 쪽지는 조회만 안되게 하기
 */
router.post('/request_letterlist', isLoggedIn, async (req, res) => {
    console.log(req.body);

    if (req.user.iPermission == 100) {
        res.redirect("/");
        return;
    }

    const cNumElementsPage = 50;

    let listState = [];
    if ( req.body.eState == 'ALL')
    {
        listState.push('READED');
        listState.push('UNREAD');
        listState.push('REPLY');
        listState.push('REPLY_READED');
        listState.push('');
    }
    else
        listState.push(req.body.eState);

    let strKeyword = req.body.strKeyword ?? '';

    const user = await IAgent.GetUserInfo(req.body.strNickname);
    let strTo = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;

    const eType = 'NORMAL';

    // 전체 쪽지 수량
    let totalCount = 0;
    if (req.body.iClass == 2 && req.user.iClass == 2) {
        totalCount = strKeyword == '' ? await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID: {
                    [Op.like]: req.body.strGroupID+'%'
                },
                iClassTo: {[Op.in]:[3,2]},
                iClassFrom: {[Op.notIn]:[2]}, // 총본이 보낸것은 제외
                eRead:{[Op.or]:listState},
                eType:eType
            },
        }) : await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID: {
                    [Op.like]: req.body.strGroupID+'%'
                },
                iClassTo: {[Op.in]:[3,2]},
                iClassFrom: {[Op.notIn]:[2]}, // 총본이 보낸것은 제외
                strFrom:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
                eType:eType
            },
        });
    } else {
        totalCount = strKeyword == '' ? await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo:strTo,
                eRead:{[Op.or]:listState},
                iDelTo: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                },
                eType:eType
            },
        }) :  await db.Letters.count({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo:strTo,
                strFrom:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
                iDelTo: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                },
                eType:eType
            },
        });
    }

    // 쪽지 조회
    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let letters = [];
    if (req.body.iClass == 2 && req.user.iClass == 2) {
        letters = strKeyword == '' ? await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID: {
                    [Op.like]: req.body.strGroupID+'%'
                },
                iClassTo: {[Op.in]:[3,2]},
                iClassFrom: {[Op.notIn]:[2]}, // 총본이 보낸것은 제외
                eRead:{[Op.or]:listState},
                eType:eType
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        }) : await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strGroupID: {
                    [Op.like]: req.body.strGroupID+'%'
                },
                iClassTo: {[Op.in]:[3,2]},
                iClassFrom: {[Op.notIn]:[2]}, // 총본이 보낸것은 제외
                strFrom:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
                eType:eType
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        });
    } else {
        letters = strKeyword == '' ? await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo: strTo,
                eRead:{[Op.or]:listState},
                iDelTo: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                },
                eType:eType
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        }) :  await db.Letters.findAll({
            where:{
                createdAt:{
                    [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo: strTo,
                strFrom:{[Op.like]:'%'+strKeyword+'%'},
                eRead:{[Op.or]:listState},
                iDelTo: {
                    [Op.or]:{
                        [Op.is]: null,
                        [Op.not]:1
                    }
                },
                eType:eType
            },
            limit:iLimit,
            offset:iOffset,
            order:[['createdAt','DESC']]
        });
    }

    res.send({letters:letters, currentPage:req.body.iPage, totalCount:totalCount});
});

router.post('/request_removeletter', isLoggedIn, async(req, res) => {
    console.log(req.body);
    // await db.Letters.destroy({where:{id:req.body.id}});
    res.send({result:'OK'});
});


//TODO: 이용자 업데이트 필요
router.post('/request_letter_select_remove', isLoggedIn, async(req, res) => {
    console.log(req.body);

    if (req.user.iPermission == 100) {
        res.send({result: 'FAIL', msg:'삭제 오류(권한없음)'});
        return;
    }

    let type = req.body.type ?? '';

    if ((type == 'RECEIVE' || type == 'SEND') == false) {
        res.send({result: 'FAIL', msg:'삭제 오류(타입오류)'});
        return;
    }

    try {
        // 로그인 유저의 그룹 아이디 체크
        if (req.body.strGroupID.indexOf(req.user.strGroupID) != 0) {
            res.send({result: 'FAIL', msg:'삭제 오류(권한없음)'});
            return;
        }

        let ids = req.body.ids.split(',');
        if (ids.length > 0) {
            // 삭제 가능 권한 체크
            let list = await db.Letters.findAll({
                where: {
                    strGroupID: {
                        [Op.like]:`${req.body.strGroupID}%`
                    },
                    id: {
                        [Op.in]:ids
                    }
                }
            });
            if (ids.length != list.length) {
                res.send({result: 'FAIL', msg:'삭제 오류(권한없음)'});
                return;
            }

            // 실제 삭제는 총본에서만 삭제되게 나머지는 플래그만 변경
            if (req.user.iClass == 2) {
                await db.Letters.destroy({
                    where:{
                        id: {
                            [Op.in] : ids
                        }
                    }
                });
            } else {
                if (type == 'RECEIVE') {
                    await db.Letters.update(
                        {
                            iDelTo:1
                        },
                        {
                        where:{
                            id: {
                                [Op.in] : ids
                            }
                        }
                    });
                } else if (type == 'SEND') {
                    await db.Letters.update(
                        {
                            iDelFrom:1
                        },
                        {
                            where:{
                                id: {
                                    [Op.in] : ids
                                }
                            }
                        });
                }
            }
            res.send({result:'OK'});
        } else {
            res.send({result: 'FAIL', msg:'삭제할 항목을 선택해주세요'});
        }
    } catch (err) {
        res.send({result: 'FAIL', msg:'삭제 오류'});
    }
});

//  Announcement
router.post('/request_announcementlist', isLoggedIn, async (req, res) => {

    console.log(req.body);

    let eType = 'ANN';
    if ( req.body.eType != undefined )
        eType = req.body.eType;

    let fullanns = await db.Announcements.findAll({where:{eType:eType}});

    res.send({anns:fullanns});
});

router.post('/request_removeannouncement', isLoggedIn, async (req, res) => {

    console.log(`request_removeannouncement`);

    console.log(req.body);

    await db.Announcements.destroy({where:{id:req.body.id}});

    res.send({result:'OK'});
});

router.post('/request_writeannouncement', isLoggedIn, async (req, res) => {

    console.log(`request_writeannouncement`);

    console.log(req.body);

    await db.Announcements.create({strSubject:req.body.strSubject, strContents:req.body.strContents, eType:req.body.eType, eState:'ENABLE'});

    res.send({result:'OK'});
});

router.post('/readannouncement', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass};
    const contents = await db.Announcements.findOne({where:{id:parseInt(req.body.id)}});

    res.render('manage_setting/popup_readannouncement', {iLayout:1, iHeaderFocus:1, user:user, contents:contents});
});

router.post('/request_annchangestate', isLoggedIn, async (req, res) => {

    console.log('/request_annchangestate');
    console.log(req.body);

    let value = await db.Announcements.findOne({where:{id:req.body.id}});
    if ( value != null )
    {
        await value.update({eState:req.body.eState});

        res.send({result:'OK'});
    }
    else
    {
        res.send({result:'ERROR'});
    }
});

module.exports = router;