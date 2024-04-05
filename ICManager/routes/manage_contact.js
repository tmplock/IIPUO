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

const {Op, where}= require('sequelize');

const IAgent = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const IInout = require("../implements/inout");
const {DATETIME} = require("mysql/lib/protocol/constants/types");

router.post('/list_contact_receive', isLoggedIn, async(req, res) => {
    const user = await IAgent.GetUserInfo(req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, user.iClass);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    res.render('manage_contact/list_contact_receive', {iLayout:0, iHeaderFocus:7, user:agent, agent:agent, iocount:iocount, list:[], page:1});
});

router.post('/request_list_contact_receive', isLoggedIn, async(req, res) => {
    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strKeyword = req.body.strKeyword ?? '';
    let eRead = req.body.eRead;

    let listRead = [];
    if ( eRead == 'ALL')
    {
        listRead.push('READED');
        listRead.push('UNREAD');
        listRead.push('REPLY');
        listRead.push('REPLY_READED');
    }
    else
        listRead.push(req.body.eRead);

    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strTo = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = strKeyword == '' ? await db.ContactLetter.count({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strTo: strTo,
            eRead:{[Op.or]:listRead}
        },
    }) : await db.ContactLetter.count({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strTo: strTo,
            strFrom:{[Op.like]:'%'+strKeyword+'%'},
            eRead:{[Op.or]:listRead}
        },
    });

    let list = strKeyword == '' ? await db.ContactLetter.findAll({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strTo: strTo,
            eRead:{[Op.or]:listRead}
        },
        limit:iLimit,
        offset:iOffset,
        order:[['createdAt','DESC']]
    }) : await db.ContactLetter.findAll({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strTo: strTo,
            strFrom:{[Op.like]:'%'+strKeyword+'%'},
            eRead:{[Op.or]:listRead}
        },
        limit:iLimit,
        offset:iOffset,
        order:[['createdAt','DESC']]
    });

    let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);
    res.send({result: 'OK', list:list, totalCount: totalCount, iocount:iocount});
});

router.post('/request_contact_select_remove', isLoggedIn, async(req, res) => {
    console.log(req.body);
    try {
        let ids = req.body.ids.split(',');
        await db.ContactLetter.destroy({
            where:{
                id: {
                    [Op.in] : ids
                }
            }
        });
        res.send({result:'OK'});
    } catch (err) {
        res.send({result: 'FAIL', msg:'삭제 오류'});
    }
});
router.post('/list_contact_send', isLoggedIn, async(req, res) => {
    const user = await IAgent.GetUserInfo(req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, user.iClass);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    res.render('manage_contact/list_contact_send', {iLayout:0, iHeaderFocus:7, user:agent, agent:agent, iocount:iocount, list:[], page:1});
});

router.post('/request_list_contact_send', isLoggedIn, async(req, res) => {
    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strKeyword = req.body.strKeyword ?? '';
    let eRead = req.body.eRead;

    let listRead = [];
    if ( eRead == 'ALL')
    {
        listRead.push('READED');
        listRead.push('UNREAD');
        listRead.push('REPLY');
        listRead.push('REPLY_READED');
    }
    else
        listRead.push(req.body.eRead);


    let user = await IAgent.GetUserInfo(req.body.strNickname);
    let strFrom = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    let totalCount = strKeyword == '' ? await db.ContactLetter.count({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strFrom:strFrom,
            eRead:{[Op.or]:listRead}
        },
    }) : await db.ContactLetter.count({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strFrom:strFrom,
            strTo:{[Op.like]:'%'+strKeyword+'%'},
            eRead:{[Op.or]:listRead}
        },
    });

    let list = strKeyword == '' ? await db.ContactLetter.findAll({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strFrom:strFrom,
            eRead:{[Op.or]:listRead}
        },
        limit:iLimit,
        offset:iOffset,
        order:[['createdAt','DESC']]
    }) : await db.ContactLetter.findAll({
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strFrom:strFrom,
            strTo:{[Op.like]:'%'+strKeyword+'%'},
            eRead:{[Op.or]:listRead}
        },
        limit:iLimit,
        offset:iOffset,
        order:[['createdAt','DESC']]
    });

    let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);
    res.send({result: 'OK', list:list, totalCount: totalCount, iocount:iocount});
});
router.post('/list_charge_request', isLoggedIn, async(req, res) => {
    const user = await IAgent.GetUserInfo(req.body.strNickname);
    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, req.user.iClass);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    res.render('manage_contact/list_charge_request', {iLayout:0, iHeaderFocus:7, user:agent, agent:agent, iocount:iocount, list:[], page:1});
});

router.post('/popup_write_contact', async(req, res) => {
    console.log(req.body);
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    let strTo = req.body.strTo ?? '';
    if (strTo != '') {
        res.render('manage_contact/popup_write_contact', {iLayout:1, iHeaderFocus:1, user:user, strParent:'', strChildes:[], strTo: strTo, directSend: true});
        return;
    }
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    let strChildes = [];
    if (req.body.iClass <= 2) { // 대상자 선정 쪽지는 총본부터 가능
        strChildes = await IAgent.GetChildNicknameList(req.body.strGroupID, parseInt(req.body.iClass)+1);
    }
    res.render('manage_contact/popup_write_contact', {iLayout:1, iHeaderFocus:1, user:user, strParent:strParent, strChildes:strChildes, strTo:'', directSend: false});
});

router.post('/request_writecontact', async(req, res) => {
    let user = await IAgent.GetUserInfo(req.body.strFrom);
    let strNickname = user.iPermission == 100 ? user.strNicknameRel : user.strNickname;

    await db.ContactLetter.create({
        strTo:req.body.strTo,
        strFrom:strNickname,
        strGroupID:user.strGroupID,
        strSubject:req.body.strSubject,
        strContents:req.body.strContents,
        eRead:'UNREAD',
        eState:'WAIT',
        strWriter:req.user.strNickname,
    });

    ISocket.AlertByNickname(req.body.strTo, 'alert_contact');

    res.send({result:'OK'});
});

router.post('/request_removecontact', async(req, res) => {
    await db.ContactLetter.destroy({where:{id:req.body.id}});
    res.send({result:'OK'});
});


router.post('/request_replycontact', async(req, res) => {
    let obj = await db.ContactLetter.findByPk(req.body.id);
    if (obj != null ) {
        await obj.update({
            strAnswers:req.body.strAnswers,
            completedAt:ITime.getCurrentDateFull(),
            eRead:'REPLY',
            eState:'REPLY'
        });
        ISocket.AlertByNickname(obj.strFrom, 'alert_contact_reply');
        let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);
        ISocket.AlertUpdateByNickname(req.user.strNickname, iocount);

        res.send({result:'OK'});
    } else {
        res.send({result:'FAIL'});
    }
});

router.post('/popup_read_contact', async(req, res) => {
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    let obj = await db.ContactLetter.findByPk(req.body.id);
    let dbuser = await IAgent.GetUserInfo(req.body.strNickname);
    let strNickname = dbuser.iPermission == 100 ? dbuser.strNicknameRel : dbuser.strNickname;
    user.strNickname = strNickname;

    if (user.iPermission != 100) {
        if (obj.eRead == 'UNREAD') {
            // 읽음 처리는 작성자와 다른 사람이 볼 경우에만 처리
            if (user.strNickname != obj.strFrom) {
                await obj.update({eRead:'READED'}, {where:{id:parseInt(req.body.id)}});
            }
        } else if (obj.eRead == 'REPLY') {
            // 답변확인은 작성자일 경우에만 읽음 처리
            if (user.strNickname == obj.strFrom) {
                await obj.update({eRead:'REPLY_READED'}, {where:{id:parseInt(req.body.id)}});
            }
        }
    } else if (user.iClass == 3 && user.iPermission == 100) {
        if (obj.eRead == 'REPLY') {
            // 답변확인은 작성자일 경우에만 읽음 처리
            if (dbuser.strNickname == obj.strWriter) {
                await obj.update({eRead:'REPLY_READED'}, {where:{id:parseInt(req.body.id)}});
            }
        }
    }

    let iocount = await IInout.GetProcessing(user.strGroupID, user.strNickname, req.user.iClass);
    // 알림들 업데이트
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('알림 읽음');
    ISocket.AlertUpdateByNickname(req.body.strNickname, iocount);

    res.render('manage_contact/popup_read_contact', {iLayout:1, iHeaderFocus:1, user:user, letter:obj.toJSON()});
});


/**
 * 미사용 api
 */
router.post('/popup_charge_request', async(req, res) => {
    console.log(req.body);
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:req.body.iClass,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};
    let strTo = await IAgent.GetParentNickname(req.body.strNickname);
    res.render('manage_contact/popup_charge_request', {iLayout:1, iHeaderFocus:1, user:user, strTo:strTo});
});


router.post('/request_charge_request', async(req, res) => {
    await db.ChargeRequest.create({
        iClass:req.body.iClass,
        strTo:req.body.strTo,
        strFrom:req.body.strFrom,
        strGroupID:req.body.strGroupID,
        // iPreviousCash:req.body.iPreviousCash,
        iAmount:req.body.iAmount,
        strMemo:req.body.strMemo,
        eState:'REQUEST',
    });

    ISocket.AlertByNickname(req.body.strTo, 'alert_charge');

    res.send({result:'OK'});
});

router.post('/request_list_charge_request', isLoggedIn, async(req, res) => {
    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let strKeyword = req.body.strKeyword;
    let strTo = req.body.strNickname;


    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    if (strKeyword.length > 0) {
        let total = await db.ChargeRequest.findAndCountAll({
            where:{
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo:strTo,
                strFrom:{[Op.like]:'%'+strKeyword+'%'},
            },
        });

        const list = await db.ChargeRequest.findAll({
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo:strTo,
                strFrom:{[Op.like]:'%'+strKeyword+'%'},
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });
        let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);
        res.send({result: 'OK', list:list, totalCount: total.count, iocount:iocount});
    } else {
        let total = await db.ChargeRequest.findAndCountAll({
            where:{
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo:strTo
                // [Op.or] : [{strFrom:strTo}, {strTo:strTo}],
            },
        });

        const list = await db.ChargeRequest.findAll({
            where: {
                createdAt:{
                    [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strTo:strTo
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });
        let iocount = await IInout.GetProcessing(req.user.strGroupID, req.user.strNickname, req.user.iClass);
        res.send({result: 'OK', list:list, totalCount: total.count, iocount:iocount});
    }
});

router.post('/request_charge_apply', async (req, res) => {
    let charge = await db.ChargeRequest.findOne({where:{id:req.body.id}});

    if ( charge != null ) {
        if ( req.body.type == 0 && charge.eState != 'REQUEST') {
            res.send({result:'ERROR'});
            return;
        } else if ( req.body.type == 1 && charge.eState != 'STANDBY') {
            res.send({result:'ERROR'});
            return;
        } else if ( req.body.type == 2 && (charge.eState == 'CANCEL' || charge.eState == 'COMPLETE')) {
            res.send({result:'ERROR'});
            return;
        }
        if ( req.body.type == 0 ) { //  대기 클릭
            await charge.update({eState:"STANDBY"});
            res.send({result:"OK", id:req.body.id});
            return;
        } else if ( req.body.type == 1 ) { // 처리 클릭
            await charge.update({
                eState:"COMPLETE",
                completedAt: ITime.getCurrentDate()
            });
            res.send({result:"OK", id:req.body.id});
            return;
        } else if ( req.body.type == 2 ) { // 취소 클릭
            await charge.update({eState:"CANCEL", completedAt:ITime.getCurrentDateFull()});
            res.send({result:"OK", id:req.body.id});
            return;
        }

    }
    res.send({result:"FAIL"});
});



module.exports = router;