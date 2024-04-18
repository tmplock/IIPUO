const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const ITime = require('../utils/time');
const {Op, where}= require('sequelize');

//////////////////////////////////////////////////////////////////////////////
const IAgent = require('../implements/agent3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');

router.post('/request_logs', isLoggedIn, async  (req, res) => {

    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd;
    let strNickname = req.body.strNickname ?? '';
    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;


    let totalCount = strNickname == '' ? await db.OverviewLogs.count({
        where: {
            createdAt:{
                [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
        }
    }) : await db.OverviewLogs.count({
        where: {
            createdAt:{
                [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strNickname: strNickname,
        }
    });

    let list = strNickname == '' ? await db.OverviewLogs.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        }) : await db.OverviewLogs.findAll(
        {
            where: {
                createdAt:{
                    [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                },
                strNickname:strNickname,
            },
            offset:iOffset,
            limit:iLimit,
            order:[['id','DESC']]
        });

    res.send({result:'OK', data:list, totalCount: totalCount});
});


/**
 * move
 */

router.post('/popup_overview_logs', isLoggedIn, async (req, res) => {
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle, strID:dbuser.strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    res.render('manage_log/list', {iLayout:9, iHeaderFocus:0, user:user});
});

module.exports = router;