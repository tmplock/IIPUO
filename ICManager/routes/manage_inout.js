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
// const util_time = require('../utils/time');
const IInout = require('../implements/inout');
const {Op}= require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const ITime = require('../utils/time');

const ISocket = require('../implements/socket');
const IAgent = require("../implements/agent");

router.post('/request_page', isLoggedIn, async(req, res) => {

    console.log(req.body);

    let eType = 'INPUT';
    if ( req.body.type == 1 )
        eType = 'OUTPUT';

    let iOffset = parseInt(req.body.iPage) * 20;

    if ( req.body.searchBy == '' )
    {
        const result = await db.Inouts.findAll({offset:iOffset, limit:20, where:{
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            //strID:req.body.searchBy,
            strGroupID:{[Op.like]:req.body.strGroupID+'%'},
            strID:{[Op.like]:'%'+req.body.searchBy+'%'},
            // strGroupID:{
            //     [Op.like]:user.strGroupID+'%'
            // },
            eType:eType
    
        },
        order:[['updatedAt','DESC']]});
    
        res.send(result);
    }
    else
    {
        const result = await db.Inouts.findAll({offset:iOffset, limit:20, where:{
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:req.body.searchBy,
            //strID:{[Op.like]:'%'+req.body.searchBy+'%'},
            // strGroupID:{
            //     [Op.like]:user.strGroupID+'%'
            // },
            eType:eType
    
        },
        order:[['updatedAt','DESC']]});
    
        res.send(result);
    
            
    }
});

router.post('/request_searchby', isLoggedIn, async(req, res) => {

    console.log(req.body);

    const iRootClass = parseInt(req.user.iClass ?? 0);
    const iClass = parseInt(req.body.iClass ?? 0);
    const bRoot = (iRootClass == 1 && iClass == 1);

    let totalCount = 0;
    let list = [];

    let iLimit = parseInt(req.body.iLimit);
    let iPage = parseInt(req.body.iPage);
    let iOffset = (iPage-1) * iLimit;

    if ( req.body.strSearchNickname == '' )
    {
        if (bRoot == true) {
            totalCount = await db.Inouts.count({
                where: {
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    eType:req.body.type,
                    iClass: 2
                }
            });
        } else {
            totalCount = await db.Inouts.count({
                where: {
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    eType:req.body.type,
                }
            });
        }

        if (bRoot == true) {
            list = await db.Inouts.findAll({
                where:{
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    eType:req.body.type,
                    iClass: 2
                },
                offset:iOffset,
                limit:iLimit,
                order:[['updatedAt','DESC']]
            });
        } else {
            list = await db.Inouts.findAll({
                where:{
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    eType:req.body.type,
                },
                offset:iOffset,
                limit:iLimit,
                order:[['updatedAt','DESC']]
            });
        }
        res.send({data: list, totalCount: totalCount, iRootClass: req.user.iClass});
    }
    else
    {
        if (bRoot == true) {
            totalCount = await db.Inouts.count({
                where: {
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strID:req.body.strSearchNickname,
                    eType:req.body.type,
                    iClass: 2
                }
            });
        } else {
            totalCount = await db.Inouts.count({
                where: {
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strID:req.body.strSearchNickname,
                    eType:req.body.type,
                }
            });
        }

        if (bRoot == true) {
            list = await db.Inouts.findAll({
                where:{
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strID:req.body.strSearchNickname,
                    eType:req.body.type,
                    iClass: 2
                },
                offset:iOffset,
                limit:iLimit,
                order:[['updatedAt','DESC']]
            });

        } else {
            list = await db.Inouts.findAll({
                where:{
                    createdAt:{
                        [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    strID:req.body.strSearchNickname,
                    eType:req.body.type,
                },
                offset:iOffset,
                limit:iLimit,
                order:[['updatedAt','DESC']]
            });
        }

        res.send({data : list, totalCount : totalCount, iRootClass:req.user.iClass});
    }
});

// 입출금 진입시 호출됨
router.post('/charge', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strOptionCode:dbuser.strOptionCode,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    const iLimit = 20;
    const iOffset = 0;

    let totalCount = 0;
    let list = [];
    if (parseInt(req.body.iClass) == 1) {
        totalCount = await db.Inouts.count({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'INPUT',
                iClass: 2
            }
        });
        list = await db.Inouts.findAll({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'INPUT',
                iClass: 2
            },
            offset:iOffset,
            limit:iLimit,
            order:[['createdAt','DESC']]
        });
    } else {
        totalCount = await db.Inouts.count({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'INPUT',
                iClass: {
                    [Op.gt]:parseInt(req.body.iClass)
                }
            }
        });
        list = await db.Inouts.findAll({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'INPUT',
                iClass: {
                    [Op.gt]:parseInt(req.body.iClass)
                }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['createdAt','DESC']]
        });
    }

    let iocount = await IInout.GetProcessing(dbuser.strGroupID, dbuser.strNickname, dbuser.iClass);

    res.render('manage_inout/list_input', {iLayout:0, iHeaderFocus:2, req_list:list, user:user, iocount:iocount, totalCount:totalCount});
});

router.post('/exchange', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    let iCash = 0;
    if ( dbuser != null )
        iCash = dbuser.iCash;

    let strOptionCode = dbuser.strOptionCode ?? '11000000';
    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:iCash, strOptionCode:strOptionCode,
        iRootClass: req.user.iClass, iPermission: req.user.iPermission};

    let iLimit = 20;
    let iOffset = 0;

    let totalCount = 0;
    let list = [];
    if (parseInt(req.body.iClass) == 1) {
        totalCount = await db.Inouts.count({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'OUTPUT',
                iClass:2
            }
        });
        list = await db.Inouts.findAll({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'OUTPUT',
                iClass:2
            },
            offset:iOffset,
            limit:iLimit,
            order:[['updatedAt','DESC']]
        });
    } else {
        totalCount = await db.Inouts.count({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'OUTPUT',
                iClass:{
                    [Op.gt]:parseInt(req.body.iClass)
                }
            }
        });
        list = await db.Inouts.findAll({
            where: {
                strGroupID:{
                    [Op.like]:user.strGroupID+'%'
                },
                eType:'OUTPUT',
                iClass:{
                    [Op.gt]:parseInt(req.body.iClass)
                }
            },
            offset:iOffset,
            limit:iLimit,
            order:[['updatedAt','DESC']]
        });
    }

    let iocount = await IInout.GetProcessing(dbuser.strGroupID, dbuser.strNickname, dbuser.iClass);

    res.render('manage_inout/list_output', {iLayout:0, iHeaderFocus:2, req_list:list, user:user, iocount:iocount, totalCount:totalCount});
})

//router.post('/updatechargestate', isLoggedIn, async (req, res) => {
router.post('/request_inputstate', isLoggedIn, async (req, res) => {

    console.log(req.body);

    //let charge = await db.Charges.findOne({where:{id:req.body.id}});
    let charge = await db.Inouts.findOne({where:{id:req.body.id}});

    //console.log(charge);

    console.log(charge);

    if ( charge == null ) {
        res.send({result:"FAIL"});
        return;
    }
    else 
    {
        if ( req.body.type == 0 && charge.eState != 'REQUEST')
        {
            res.send({result:'ERROR'});
            return;
        }
        else if ( req.body.type == 1 && charge.eState != 'STANDBY')
        {
            res.send({result:'ERROR'});
            return;
        }
        else if ( req.body.type == 2 && (charge.eState == 'CANCEL' || charge.eState == 'COMPLETE'))
        {
            res.send({result:'ERROR'});
            return;
        }
    }

    if ( req.body.type == 0 )   // request
    {
        await charge.update({eState:"STANDBY"});

        res.send({result:"OK", id:req.body.id});
    }
    else if ( req.body.type == 1 )  // standby
    {
        let parent = await db.Users.findOne({where:{strNickname:charge.strAdminNickname}});

        if ( null != parent )
        {
            if ( parent.iCash >= parseInt(charge.iAmount) )
            {
                await charge.update({eState:"COMPLETE", completedAt:ITime.getCurrentDateFull(), strProcessNickname: req.user.strNickname, iProcessClass: req.user.iClass});

                let user = await db.Users.findOne({where:{strNickname:charge.strID}});
        
                await user.update({iCash:user.iCash+charge.iAmount});
                await parent.update({iCash:parent.iCash-parseInt(charge.iAmount)});

                let objectAxios = {strNickname:user.strNickname, iAmount:user.iCash};

                //axios.post('https://ppuolive.com/UpdateCoin', objectAxios)
                //axios.post(`${global.strUserPageAddress}/UpdateCoin`, objectAxios)
                axios.post(`${user.strURL}/UpdateCoin`, objectAxios)
                .then((response)=> {
                    //console.log('axios success /UpdateCoin');
                    console.log(`Axios Success /UpdateCoin : ${user.iCash}`);
                    //console.log(response);
                })
                .catch((error)=> {
                    console.log('axios Error /UpdateCoin');
                    //console.log(error);
                });

                // console.log(`############################################################################################################`);
                // console.log(`############################################################################################################`);

                // let iCash = parent.iCash-parseInt(charge.iAmount);
                // ISocket.AlertCashByNickname(parent.strNickname, iCash);

                // console.log(`############################################################################################################`);
                // console.log(`############################################################################################################`);

                res.send({result:"OK", id:req.body.id});
            }
            else
                res.send({result:"FAIL1", id:req.body.id});
        }
        else
        {
            res.send({result:"FAIL2", id:req.body.id});
        }
    }
    else if ( req.body.type == 2 )  // cancel
    {
        await charge.update({eState:"CANCEL", completedAt:ITime.getCurrentDateFull()});

        res.send({result:"OK", id:req.body.id});
  }

//    res.send({result:"OK", id:req.body.id});

});

// router.post('/request_inputlist', isLoggedIn, async (req, res) => {

//     console.log("****************************************************");
//     console.log(req.body);

//     if ( req.body.search == '' )
//     {
//         let charges = await db.Inouts.findAll({

//             attributes: [
//                 [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
//                 [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
//             ],
//             raw:true,
    
//             where: {
//                 strID:{[Op.like]:'%'+req.body.search+'%'},
//                 strGroupID:{[Op.like]:req.body.strGroupID+'%'},
//                 //strID:req.body.search,
//                 //createdAt:{
//                 // updatedAt:{
//                 //     [Op.gt]:req.body.s_date,
//                 //     [Op.lte]:req.body.e_date
//                 // },
//                 createdAt:{
//                     [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
//                 },
//                 eState:'COMPLETE',
//                 eType:'INPUT'
//             }
//         });

//         for ( var i in charges )
//         {
//             console.log(charges[i]);
//             console.log(charges[i].iTotalAmount);
//         }
//         //console.log(charges);

//         var object = {result:"OK"};

//         object.t_amount = charges[0].iTotalAmount;
//         object.t_count = charges[0].iTotalCount;
//         if ( object.t_count == 0 )
//         object.t_amount = 0;

//         object.s_date = req.body.s_date;
//         object.e_date = req.body.e_date;

//         res.send(object);
//     }
//     else
//     {
//         let charges = await db.Inouts.findAll({

//             attributes: [
//                 [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
//                 [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
//             ],
//             raw:true,
    
//             where: {
//                 //strID:{[Op.like]:'%'+req.body.search+'%'},
//                 strID:req.body.search,
//                 //createdAt:{
//                 // updatedAt:{
//                 //     [Op.gt]:req.body.s_date,
//                 //     [Op.lte]:req.body.e_date
//                 // },
//                 createdAt:{
//                     [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
//                 },
//                 eState:'COMPLETE',
//                 eType:'INPUT'
//             }
//         });

//         for ( var i in charges )
//         {
//             console.log(charges[i]);
//             console.log(charges[i].iTotalAmount);
//         }
//         //console.log(charges);

//         var object = {result:"OK"};

//         object.t_amount = charges[0].iTotalAmount;
//         object.t_count = charges[0].iTotalCount;
//         if ( object.t_count == 0 )
//         object.t_amount = 0;

//         object.s_date = req.body.s_date;
//         object.e_date = req.body.e_date;

//         res.send(object);
    
//     }
// });

router.post('/request_inoutoverview', isLoggedIn, async (req, res) => {

    console.log(req.body);

    const iRootClass = req.user.iClass;
    const iClass = req.body.iClass;
    const bRoot = (iRootClass == 1 && iClass == 1);

    let charges = [];
    let exchanges = [];

    if ( req.body.strSearchNickname == '' )
    {
        if (bRoot == true) {
            charges = await db.Inouts.findAll({
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:{[Op.like]:'%'+req.body.strSearchNickname+'%'},
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'INPUT',
                    iClass: 2
                }
            });
            exchanges = await db.Inouts.findAll({

                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:{[Op.like]:'%'+req.body.strSearchNickname+'%'},
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'OUTPUT',
                    iClass: 2
                }
            });
        } else {
            charges = await db.Inouts.findAll({
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:{[Op.like]:'%'+req.body.strSearchNickname+'%'},
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'INPUT'
                }
            });
            exchanges = await db.Inouts.findAll({

                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:{[Op.like]:'%'+req.body.strSearchNickname+'%'},
                    strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'OUTPUT'
                }
            });
        }

    }
    else
    {
        if (bRoot == true) {
            charges = await db.Inouts.findAll({

                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:req.body.strSearchNickname,
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'INPUT',
                    iClass: 2
                }
            });

            exchanges = await db.Inouts.findAll({
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:req.body.strSearchNickname,
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'OUTPUT',
                    iClass: 2
                }
            });
        } else {
            charges = await db.Inouts.findAll({

                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:req.body.strSearchNickname,
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'INPUT'
                }
            });

            exchanges = await db.Inouts.findAll({
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
                ],
                raw:true,
                where: {
                    strID:req.body.strSearchNickname,
                    createdAt:{
                        [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                    },
                    eState:'COMPLETE',
                    eType:'OUTPUT'
                }
            });
        }

    }

    var object = {result:"OK", input:0, output:0};

    if ( charges.length > 0 )
    {
        if ( charges[0].iTotalAmount != null )
            object.input = charges[0].iTotalAmount;
    }
    if ( exchanges.length > 0 )
    {
        if ( exchanges[0].iTotalAmount != null )
            object.output = exchanges[0].iTotalAmount;
    }
    object.dateStart = req.body.s_date;
    object.dateEnd = req.body.e_date;

    res.send(object);
    console.log(exchanges);
});


router.post('/request_inouttotal', isLoggedIn, async (req, res) => {    
    console.log(req.body);

    let charges = await db.Inouts.findAll({

        attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
        ],
        where: {
            strID:{[Op.like]:'%'+req.body.search+'%'},
            updatedAt:{
                [Op.gt]:req.body.s_date,
                [Op.lte]:req.body.e_date
            },
            eState:'COMPLETE',
            eType:'INPUT'
        },
    });

    let exchanges = await db.Inouts.findAll({

        attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
        ],
        where: {
            strID:{[Op.like]:'%'+req.body.search+'%'},
            updatedAt:{
                [Op.gt]:req.body.s_date,
                [Op.lte]:req.body.e_date
            },
            eState:'COMPLETE',
            eType:'OUTPUT'
        },
    });

    let result = {input:0, output:0};

    if ( charges.length > 0 )
        result.input = charges[0].iTotalAmount;
    if ( exchanges.length > 0 )
        result.output = exchanges[0].iTotalAmount;

    res.send(result);

});


//router.post('/search_daily', isLoggedIn, async (req, res) => {
// router.post('/request_monthlyinputlist', isLoggedIn, async (req, res) => {    
//     console.log(req.body);

//     //let charges = await db.Charges.findAll({
//     let charges = await db.Inouts.findAll({

//         attributes: [
//             //[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m-%d'), 'dates'],
//             [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('updatedAt'), '%Y-%m-%d'), 'dates'],
//             [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
//             [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
//         ],
//         group:'dates',
//         raw:true,
//         where: {
//             strID:{[Op.like]:'%'+req.body.search+'%'},
//             //createdAt:{
//             updatedAt:{
//                 [Op.gt]:req.body.s_date,
//                 [Op.lte]:req.body.e_date
//             },
//             eState:'COMPLETE',
//             eType:'INPUT'
//         },
//         order:[['updatedAt','DESC']]
//     });

//     console.log(`result length ${charges.length}`);

//     for ( var i in charges )
//     {
//         console.log(charges[i]);
//         console.log(charges[i].iTotalAmount);
//     }
//     // //console.log(charges);

//     // var object = {result:"OK"};

//     // object.t_amount = charges[0].iTotalAmount;
//     // object.t_count = charges[0].iTotalCount;
    
//     // object.s_date = req.body.s_date;
//     // object.e_date = req.body.e_date;

//     // res.send(object);
//     res.send(charges);

// });


//router.post('/updateexchangestate', isLoggedIn, async (req, res) => {
router.post('/request_outputstate', isLoggedIn, async (req, res) => {

    console.log(`request_outputstate`);
    console.log(req.body);

    //let charge = await db.Exchanges.findOne({where:{id:req.body.id}});
    let charge = await db.Inouts.findOne({where:{id:req.body.id}});

    console.log(charge);

    if ( charge == null )
        res.send({result:"FAIL"});

    if ( req.body.type == 0 )   // request
    {
        await charge.update({eState:"STANDBY"});
    }
    else if ( req.body.type == 1 )  // standby
    {
        await charge.update({eState:"COMPLETE", completedAt:ITime.getCurrentDateFull(), strProcessNickname: req.user.strNickname, iProcessClass: req.user.iClass});

        // let user = await db.Users.findOne({where:{strNickname:charge.strID}});

        // await user.update({iCash:user.iCash-charge.iAmount});

        let parent = await db.Users.findOne({where:{strNickname:charge.strAdminNickname}});
        if ( parent != null )
        {
            parent.update({iCash:parent.iCash+parseInt(charge.iAmount)});

            // let iCash = parent.iCash+parseInt(charge.iAmount);
            // ISocket.AlertCashByNickname(parent.strNickname, iCash);
        }

        // await user.update({iCash:user.iCash-charge.iAmount});

    }
    else if ( req.body.type == 2 )  // cancel
    {
        await charge.update({eState:"CANCEL", completedAt:ITime.getCurrentDateFull()});

        let user = await db.Users.findOne({where:{strNickname:charge.strID}});

        await user.update({iCash:user.iCash+charge.iAmount});

        let objectAxios = {strNickname:user.strNickname, iAmount:user.iCash};

        //axios.post('https://ppuolive.com/UpdateCoin', objectAxios)
        //axios.post(`${global.strUserPageAddress}/UpdateCoin`, objectAxios)
        axios.post(`${user.strURL}/UpdateCoin`, objectAxios)
        
        .then((response)=> {
            //console.log('axios success /UpdateCoin');
            console.log(`Axios Success /UpdateCoin : ${user.iCash}`);
            //console.log(response);
        })
        .catch((error)=> {
            console.log('axios Error /UpdateCoin');
            //console.log(error);
        });
    }

    res.send({result:"OK", id:req.body.id});

});


//router.post('/search_total_exchange', isLoggedIn, async (req, res) => {
router.post('/request_outputlist', isLoggedIn, async (req, res) => {    

    console.log("****************************************************");
    console.log(req.body);

    if ( req.body.search == '' )
    {
        let charges = await db.Inouts.findAll({

            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
            ],
            raw:true,
    
            where: {
                strID:{[Op.like]:'%'+req.body.search+'%'},
                strGroupID:{[Op.like]:req.body.strGroupID+'%'},
                //strID:req.body.search,
                //createdAt:{
                // updatedAt:{
                //     [Op.gt]:req.body.s_date,
                //     [Op.lte]:req.body.e_date
                // },
                createdAt:{
                    [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                },
                eState:'COMPLETE',
                eType:'OUTPUT'
            }
        });

        for ( var i in charges )
        {
            console.log(charges[i]);
            console.log(charges[i].iTotalAmount);
        }
        //console.log(charges);

        var object = {result:"OK"};

        object.t_amount = charges[0].iTotalAmount;
        object.t_count = charges[0].iTotalCount;
        if ( object.t_count == 0 )
        object.t_amount = 0;

        object.s_date = req.body.s_date;
        object.e_date = req.body.e_date;

        res.send(object);
    }
    else
    {
        let charges = await db.Inouts.findAll({

            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'iTotalAmount'],
                [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'iTotalCount'],
            ],
            raw:true,
    
            where: {
                //strID:{[Op.like]:'%'+req.body.search+'%'},
                strID:req.body.search,
                //createdAt:{
                // updatedAt:{
                //     [Op.gt]:req.body.s_date,
                //     [Op.lte]:req.body.e_date
                // },
                createdAt:{
                    [Op.between]:[ req.body.s_date, require('moment')(req.body.e_date).add(1, 'days').format('YYYY-MM-DD')],
                },
                eState:'COMPLETE',
                eType:'OUTPUT'
            }
        });

        for ( var i in charges )
        {
            console.log(charges[i]);
            console.log(charges[i].iTotalAmount);
        }
        //console.log(charges);

        var object = {result:"OK"};

        object.t_amount = charges[0].iTotalAmount;
        object.t_count = charges[0].iTotalCount;
        if ( object.t_count == 0 )
        object.t_amount = 0;

        object.s_date = req.body.s_date;
        object.e_date = req.body.e_date;

        res.send(object);
    
    }
});

router.get('/popup_requestexchange', isLoggedIn, async (req, res) => {

    // if ( req.user == undefined )
    // {
    //     res.redirect('/account/login');
    // }
    // else
        res.render('manage_inout/popup_requestexchange', {iLayout:1, iHeaderFocus:1});
});

router.post('/request_savememo', isLoggedIn, async (req, res) => {

    console.log(req.body);

    let data = await db.Inouts.findOne({where:{id:req.body.id}});
    await data.update({strMemo:req.body.strMemo});

});

let IsSameGroup = (strGroupID1, strGroupID2) => {

    if ( strGroupID1 != undefined && strGroupID2 != undefined )
    {
        let strBaseGroupID = '';
        let strTargetGroupID = '';

        if ( strGroupID1.length > strGroupID2.length )
        {
            strBaseGroupID = strGroupID2;
            strTargetGroupID = strGroupID1;
        }
        else
        {
            strBaseGroupID = strGroupID1;
            strTargetGroupID = strGroupID2;
        }

        strTargetGroupID = strTargetGroupID.substring(0, strBaseGroupID.length);

        console.log(`IsSameGroup ${strBaseGroupID}, ${strTargetGroupID}`);

        if ( strTargetGroupID == strBaseGroupID )
            return true;
    }
    return false;
}

//router.get('/input_alert', (req, res)=> {
router.post('/input_alert', (req, res)=> {

    console.log(`input_alert`);
    console.log(req.body);

    for ( var i in global.socket_list)
    {
        if ( IsSameGroup(req.body.strGroupID, global.socket_list[i].strGroupID)) {
            if (global.socket_list[i].iClass == 2 || global.socket_list[i].iClass == 3) {
                global.socket_list[i].emit("alert_input");
            }
        }
    }
    res.send("OK");
});


router.post('/letter_alert', (req, res)=> {

    console.log(`input_alert`);
    console.log(req.body);

    for ( var i in global.socket_list)
    {
        if ( IsSameGroup(req.body.strGroupID, global.socket_list[i].strGroupID)) {
            if (global.socket_list[i].iClass == 2 || global.socket_list[i].iClass == 3) {
                global.socket_list[i].emit("alert_letter");
            }
        }
    }
    res.send("OK");
});


//router.get('/output_alert', (req, res)=> {
router.post('/output_alert', (req, res)=> {

    console.log(`output_alert`);
    console.log(req.body);
    
    for ( var i in global.socket_list)
    {
        if ( IsSameGroup(req.body.strGroupID, global.socket_list[i].strGroupID)) {
            if (global.socket_list[i].iClass == 2 || global.socket_list[i].iClass == 3) {
                global.socket_list[i].emit("alert_output");
            }
        }
    }

    //axios.post('https://ppuolive.com/UpdateCoin')
    // axios.get('https://ppuolive.com/UpdateCoin', {params:{iAmount:req.query.iAmount}})
    //     .then((response)=> {
    //         //console.log('axios success /UpdateCoin');
    //         console.log(`Axios Success /UpdateCoin : ${req.query.iAmount}`);
    //         //console.log(response);
    //     })
    //     .catch((error)=> {
    //         console.log('axios Error /UpdateCoin');
    //         //console.log(error);
    //     });

    res.send("OK");
});

/**
 * 입출금관리
 */
router.post('/request_inout_pass', async (req, res) => {
    console.log(`request_bank`);
    console.log(req.body);

    const iClass = parseInt(req.body.iClass);
    const input = req.body.input;

    // 비밀번호는 로그인한 이용자
    const info = await db.Users.findOne({where: {strNickname: req.user.strNickname, strPassword: input}});
    if (info == null) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }
    let iRootClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iRootClass > iClass || iPermission == 100) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }

    let strAdmin = '';
    if (iClass == 1) {
        res.send({result: 'OK', msg: '입금 계좌 조회 성공'});
        return;
    } else if (iClass == 2) {
        // 총총에 등록된 계좌 조회
        strAdmin = await IAgent.GetParentNickname(req.body.strNickname);
    } else if (iClass == 3) {
        // 총본에 등록된 계좌 조회
        strAdmin = await IAgent.GetParentNickname(req.body.strNickname);
    } else {
        let obj = await IAgent.GetParentList(req.body.strGroupID, iClass);
        strAdmin = obj.strAdmin;
    }
    console.log(strAdmin);
    let bank = await db.sequelize.query(`
            SELECT b.strBankName AS strBankName, b.strBankNumber AS strBankNumber, b.strBankHolder AS strBankHolder
            FROM BankRecords b
            LEFT JOIN Users u ON u.id = b.userId
            WHERE b.eType='ACTIVE' AND u.strNickname = '${strAdmin}'
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
    console.log(bank);
    if (bank.length > 0) {
        res.send({result: 'OK', msg: '입금 계좌 조회 성공'});
    } else {
        res.send({result: 'FAIL', msg: '등록된 계좌가 없습니다'});
    }
});

/**
 * 계좌관리
 */
router.post('/request_bank', async (req, res) => {
    console.log(`request_bank`);
    console.log(req.body);

    const strNickname = req.user.strNickname;
    const input = req.body.input;

    const info = await db.Users.findOne({where: {strNickname: strNickname, strPassword: input}});
    if (info == null) {
        res.send({result: 'FAIL', msg:'비밀번호가 틀립니다'});
        return;
    }
    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iClass > 3 || iPermission == 100) {
        res.send({result: 'FAIL', msg:'권한이 없습니다'});
        return;
    }
    res.send({result: 'OK'});
});

router.post('/popup_bank', async (req, res) => {
    console.log(`popup_bank`);
    console.log(req.body);

    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iClass > 3 || iPermission == 100) {
        return;
    }
    let agent = {iClass:req.body.iClass, iRootClass: req.user.iClass, iPermission: req.user.iPermission, strNickname: req.body.strNickname};
    res.render('manage_inout/popup_bank', {iLayout:8, iHeaderFocus:0, user:agent});
});

router.post('/request_bank_list', async (req, res) => {
    console.log(`request_bank_list`);
    console.log(req.body);
    let iRootClass = parseInt(req.user.iClass ?? 100);
    let iClass = parseInt(req.body.iClass ?? 0);
    let iPermission = parseInt(req.user.iPermission ?? 0);
    if (iClass > 3 || iPermission == 100) {
        return;
    }

    let where = `AND u.strNickname = '${req.body.strNickname}'`;
    if (iRootClass == 1) {
        if (iClass == 1) {
            let user = await db.Users.findOne({
                where: {
                    strNickname: req.body.strNickname
                }
            });

            where = `
                AND u.iClass IN (1,2,3)
                AND u.strGroupID LIKE CONCAT('${user.strGroupID}', '%')
            `;
        } else if (iClass == 2) {
            let user = await db.Users.findOne({
                where: {
                    strNickname: req.body.strNickname
                }
            });
            where = `
                AND u.iClass IN (2,3)
                AND u.strGroupID LIKE CONCAT('${user.strGroupID}', '%')
            `;
        } else {
            where = `
                AND u.iClass = 3
                AND u.strNickname='${req.body.strNickname}'
            `;
        }

    } else if (iRootClass == 2) {
        if (iClass == 2) {
            let user = await db.Users.findOne({
                where: {
                    strNickname: req.body.strNickname
                }
            });
            where = `
                AND u.iClass IN (2,3)
                AND u.strGroupID LIKE CONCAT('${user.strGroupID}', '%')
            `;
        } else {
            where = `
                AND u.iClass = 3
                AND u.strNickname='${req.body.strNickname}'
            `;
        }
    } else if (iRootClass == 3) {
        where = `
                AND u.iClass = 3
                AND u.strNickname='${req.body.strNickname}'
            `;
    }

    let list = await db.sequelize.query(`
        SELECT b.*, u.iClass, u.strNickname, DATE_FORMAT(b.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, IFNULL(b.strMemo, '') AS strMemo
        FROM BankRecords b
        JOIN Users u ON u.id = b.userId
        WHERE 1=1
        ${where}
        ORDER BY u.iClass ASC, u.id ASC
    `, {type: db.Sequelize.QueryTypes.SELECT});

    res.send({result: 'OK', data: list});
});

router.post('/request_change_bank_type', async (req, res) => {
    console.log(`request_change_bank_type`);
    console.log(req.body);

    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);
    if (iClass > 3 || iPermission == 100) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }

    let id = req.body.id ?? 0;
    let eType = req.body.eType ?? '';
    if (id == 0 || eType == '') {
        res.send({result:'FAIL', msg: '필수값 없음'});
        return;
    }
    let obj = await db.BankRecords.findOne({where : {id:id}});
    if (obj == null) {
        res.send({result:'FAIL', msg: '해당 정보 없음'});
        return;
    }

    await obj.update({
        eType: eType
    });

    res.send({result: 'OK'});
});

router.post('/popup_bank_add', async (req, res) => {
    console.log(`popup_bank_add`);

    let iClass = parseInt(req.body.iClass ?? 100);
    let iRootClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iRootClass > 3 || iPermission == 100) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }
    let strChildes = [];
    let strChildes2 = [];
    if (iRootClass == 1) {
        if (iClass == 1) { // 총총이 볼 경우(본사목록, 총본목록)
            strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, 3);
            strChildes2 = await IAgent.GetChildNicknameList(req.user.strGroupID, 2);
        } else if (iClass == 2) { // 총총이 총본이동으로 볼 경우(총본목록)
            strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, 3);
        }
    } else if (iRootClass == 2) {
        if (iClass == 2) { // 총본이 총본으로 볼경우(본사목록)
            strChildes = await IAgent.GetChildNicknameList(req.user.strGroupID, 3);
        }
    }

    let agent = {iClass: req.body.iClass, iRootClass: req.user.iClass, strNickname: req.body.strNickname}

    res.render('manage_inout/popup_bank_add', {iLayout:8, iHeaderFocus:0, user:agent, strChildes:strChildes, strChildes2:strChildes2});
});

router.post('/request_bank_add', async (req, res) => {
    console.log(`request_bank_add`);

    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iClass > 3 || iPermission == 100) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }

    let bankName = req.body.bankName ?? '';
    let bankNumber = req.body.bankNumber ?? '';
    let bankHolder = req.body.bankHolder ?? '';
    let strNickname = req.body.strNickname;

    if (bankName == '' || bankName == '' || bankHolder == '' || strNickname == '') {
        res.send({result:'FAIL', msg: '입력값 부족'});
        return;
    }

    const user = await db.Users.findOne({where: {strNickname: strNickname}});

    await db.BankRecords.create({
        strBankName: bankName,
        strBankNumber: bankNumber,
        strBankHolder: bankHolder,
        userId: user.id,
        eType:'STOP',
    });
    res.send({result:'OK', msg:'등록성공'});
});

router.post('/request_bank_memo_apply', async (req, res) => {
    console.log(`request_bank_add`);

    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iClass > 3 || iPermission == 100) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }

    let id = parseInt(req.body.id ?? 0) ;
    let strMemo = req.body.strMemo;

    if (id == 0) {
        res.send({result:'FAIL', msg: '입력값 부족'});
        return;
    }

    let bank = await db.BankRecords.findOne({where: {id: id}});
    if (bank == null) {
        res.send({result:'FAIL', msg: '해당 항목 조회 불가'});
        return;
    }

    await bank.update({
        strMemo: strMemo
    });

    res.send({result:'OK', msg:'등록성공'});
});


router.post('/request_bank_del', async (req, res) => {
    console.log(`request_bank_del`);

    let iClass = parseInt(req.user.iClass ?? 100);
    let iPermission = parseInt(req.user.iPermission ?? 0);

    if (iClass > 3 || iPermission == 100) {
        res.send({result:'FAIL', msg: '권한 없음'});
        return;
    }

    let id = parseInt(req.body.id ?? 0) ;

    if (id == 0) {
        res.send({result:'FAIL', msg: '입력값 부족'});
        return;
    }

    await db.BankRecords.destroy({where: {id: id}});

    res.send({result:'OK', msg:'삭제성공'});
});

module.exports = router;