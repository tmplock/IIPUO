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


router.post('/popup_chip', isLoggedIn, async(req, res) => {
    console.log(req.body);
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    console.log(user);
    let agent = {strNickname:user.strNickname, iClass:user.iClass, strGroupID:user.strGroupID, iCash:user.iCash, iSettle:user.iSettle, iRolling:user.iRolling, iSettleAcc:user.iSettleAcc,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission, iRootNickname:req.user.strNickname};
    res.render('manage_chip/popup_chip', {iLayout:1, iHeaderFocus:0, user:user, agent:agent, strParent:strParent});

});

router.post('/request_gtrecord', isLoggedIn, async(req, res) => {

    console.log(`############################################################################`);
    console.log(req.body);

    let strTimeStart = req.body.dateStart;
    let strTimeEnd = req.body.dateEnd;
    let iClass = parseInt(req.body.iClass);

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    if ( req.body.eType == 'TO')
    {
        if ( req.body.strSearch == '' )
        {
            const totalCount = await db.Chips.count({where:{
                    strFrom:req.body.strNickname,
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
            });

            const list = await db.Chips.findAll({where:{
                    strFrom:req.body.strNickname,
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                limit:iLimit,
                offset:iOffset,
                order:[['createdAt','DESC']]});

            res.send({result:'OK', list:list, totalCount:totalCount});
        }
        else
        {
            const totalCount = await db.Chips.count({where:{
                    strFrom:req.body.strNickname,
                    strTo:{[Op.like]:'%'+req.body.strSearch+'%'},
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
            });

            const list = await db.Chips.findAll({where:{
                    strFrom:req.body.strNickname,
                    strTo:{[Op.like]:'%'+req.body.strSearch+'%'},
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                limit:iLimit,
                offset:iOffset,
                order:[['createdAt','DESC']]});

            res.send({result:'OK', list:list, totalCount:totalCount});
        }
    }
    else if ( req.body.eType == 'FROM' )
    {
        if ( req.body.strSearch == '' )
        {
            const totalCount = await db.Chips.count({where:{
                    strTo:req.body.strNickname,
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
            });

            const list = await db.Chips.findAll({where:{
                    strTo:req.body.strNickname,
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                limit:iLimit,
                offset:iOffset,
                order:[['createdAt','DESC']]});

            res.send({result:'OK', list:list, totalCount:totalCount});

        }
        else
        {
            const totalCount = await db.Chips.count({where:{
                    strTo:req.body.strNickname,
                    strFrom:{[Op.like]:'%'+req.body.strSearch+'%'},
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
            });

            const list = await db.Chips.findAll({where:{
                    strTo:req.body.strNickname,
                    strFrom:{[Op.like]:'%'+req.body.strSearch+'%'},
                    createdAt:{
                        [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                },
                limit:iLimit,
                offset:iOffset,
                order:[['createdAt','DESC']]});

            res.send({result:'OK', list:list, totalCount:totalCount});
        }
    }
});

module.exports = router;