const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
const ITime = require('../utils/time');
const IInout = require('../implements/inout');
const {Op}= require('sequelize');

const IAgent = require('../implements/agent3');
const IAgentSettle = require('../implements/agent_settle3');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');

router.post('/init', async (req, res) => {

    await db.GTs.destroy({where:{}, truncate:true});
    await db.Inouts.destroy({where:{}, truncate:true});
    await db.SettleRecords.destroy({where:{}, truncate:true});
    await db.ChargeRequest.destroy({where:{}, truncate:true});
    await db.CreditRecords.destroy({where:{}, truncate:true});
    await db.Letters.destroy({where:{}, truncate:true});
    await db.ContactLetter.destroy({where:{}, truncate:true});
    await db.ShareRecords.destroy({where:{}, truncate:true});
    await db.ShareCreditRecords.destroy({where:{}, truncate:true});
    await db.DataLogs.destroy({where:{}, truncate:true});
    await db.DailyBettingRecords.destroy({where: {}, truncate:true});
    await db.DailyRecords.destroy({where: {}, truncate:true});
    await db.RecordBets.destroy({where:{}, truncate:true});
    await db.RecordDailyOverviews.destroy({where:{}, truncate:true});
    let shares = await db.ShareUsers.findAll();
    for ( let i in shares )
    {
        await shares[i].update({
            iShare: 0,
            iShareAccBefore: 0,
            iCreditBefore: 0,
            iCreditAfter: 0,
        });
    }

    let users = await db.Users.findAll();
    for ( let i in users )
    {
        await users[i].update({
            iCash:0,
            iLoan:0,
            iRolling:0,
            iSettle:0,
            iSettleAcc:0,
            iSettleAccBefore:0,
        });
    }

    res.send({string:'OK'});
})


// 죽장 전체 초기화
router.post('/testinit', async (req, res) => {

    await db.SettleRecords.destroy({where:{}, truncate:true});

    let users = await db.Users.findAll();
    for ( let i in users )
    {
        await users[i].update({
            iSettle:0,
            iSettleAcc:0,
            iSettleAccBefore:0,
        });
    }

    let shares = await db.ShareUsers.findAll();
    for ( let i in shares )
    {
        await shares[i].update({
            iShare: 0,
            iShareAccBefore: 0,
            iCreditBefore:0,
            iCreditAfter:0
        });
    }

    await db.GTs.destroy({where:{}, truncate:true});
    await db.CreditRecords.destroy({where:{}, truncate:true});
    await db.ShareRecords.destroy({where:{}, truncate:true});
    await db.ShareCreditRecords.destroy({where:{}, truncate:true});
    await db.ChargeRequest.destroy({where: {}, truncate:true});
    await db.SettleRecords.destroy({where: {}, truncate: true});

    res.send({result:'OK'});
});

// 현재 죽장 초기화
router.post('/testinitcurrent', async (req, res) => {

    await db.SettleRecords.destroy({where:{
            strQuater: req.body.strQuater
        }, truncate:true});

    await db.ShareRecords.destroy({where:{
            strQuater: req.body.strQuater
        }, truncate:true});
    res.send({result:'OK'});
});


module.exports = router;