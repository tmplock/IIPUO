const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));


const axios = require('axios');
const db = require('../models');
const IInout = require('../implements/inout');
const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const ITime = require('../utils/time');

const ISocket = require('../implements/socket');
const IAgent = require("../implements/agent3");
const moment = require("moment");


router.post('/changechip', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    console.log(user);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};
    res.render('manage_user/popup_chip', {iLayout:1, iHeaderFocus:0, agent:agent});

});

router.post('/request_gtrecord', isLoggedIn, async(req, res) => {

    console.log(`############################################################################`);
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let iClass = parseInt(req.body.iClass);

    if ( req.body.eType == 'TO')
    {
        // 본사는 보낸내역 불필요
        if (iClass == 3) {
            res.send([]);
            return;
        }
        if ( req.body.strSearch == '' )
        {
            const list = await db.Chips.findAll({where:{
                    strFrom:req.body.strNickname,
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                order:[['createdAt','DESC']]});
            res.send(list);
        }
        else
        {
            const list = await db.Chips.findAll({where:{
                    strFrom:req.body.strNickname,
                    strTo:{[Op.like]:'%'+req.body.strSearch+'%'},
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                order:[['createdAt','DESC']]});
            res.send(list);
        }
    }
    else if ( req.body.eType == 'FROM' )
    {
        if ( req.body.strSearch == '' )
        {
            const list = await db.Chips.findAll({where:{
                    strTo:req.body.strNickname,
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                order:[['createdAt','DESC']]});
            res.send(list);

        }
        else
        {
            const list = await db.Chips.findAll({where:{
                    strTo:req.body.strNickname,
                    strFrom:{[Op.like]:'%'+req.body.strSearch+'%'},
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                order:[['createdAt','DESC']]});
            res.send(list);
        }
    }
});

module.exports = router;