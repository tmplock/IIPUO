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
const {GetQuaterEndDate} = require("../implements/agent_settle3");


/**
 * 테스트
 */
router.post('/settle_input', async (req, res) => {
    console.log('settle_input');
    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo('본사10');

    const user = {strNickname:dbuser.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: dbuser.iClass, iPermission: dbuser.iPermission};

    // 부본 리스트 목록
    let list = await db.sequelize.query(`
        SELECT u3.strID As strID3, u3.strNickname AS strNickname3, u4.strID AS strID4, u4.strNickname AS strNickname4, u.fBaccaratR AS fBaccaratR4, u.fUnderOverR AS fUnderOverR4, u.fSlotR AS fSlotR4, 
               u.strNickname, u.fBaccaratR, u.fUnderOverR, u.fSlotR, o.* FROM RecordDailyOverviews o
           LEFT JOIN Users u ON u.strID = o.strID
           LEFT JOIN Users u4 ON u4.id = u.iParentID
           LEFT JOIN Users u3 ON u3.id = u4.iParentID
           WHERE o.strGroupID LIKE '${dbuser.strGroupID}%' AND o.iClass = 5
    `);

    res.render('manage_calculation/settle_input', {iLayout:9, iHeaderFocus:0, user:user, list:list[0]});
});


router.post('/request_settle_input', async (req, res) => {
    console.log('request_settle_input');
    console.log(req.body);

    const strNickname = req.body.strNickname;

    const dbuser = await IAgent.GetUserInfo(strNickname);

    const user = {strNickname:dbuser.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: dbuser.iClass, iPermission: dbuser.iPermission};

    // 부본 리스트 목록
    let list = await db.sequelize.query(`
        SELECT u3.strID As strID3, u3.strNickname AS strNickname3, u4.strID AS strID4, u4.strNickname AS strNickname4, u.fBaccaratR AS fBaccaratR4, u.fUnderOverR AS fUnderOverR4, u.fSlotR AS fSlotR4, 
               u.strNickname, u.fBaccaratR, u.fUnderOverR, u.fSlotR, o.* FROM RecordDailyOverviews o
           LEFT JOIN Users u ON u.strID = o.strID
           LEFT JOIN Users u4 ON u4.id = u.iParentID
           LEFT JOIN Users u3 ON u3.id = u4.iParentID
           WHERE o.strGroupID LIKE '${dbuser.strGroupID}%' AND o.iClass = 5
    `);

    res.send({result: 'OK', list: list[0]});

});

router.post('/settle_input_apply', async (req, res) => {
    console.log('settle_input_apply');
    console.log(req.body);

    let rollingB = 0;
    let rollingUO = 0;
    let rollingS = 0;

    let betB = 0;
    let betUO = 0;
    let betS = 0;

    let winB = 0;
    let winUO = 0;
    let winS = 0;

    let list = req.body.dataList ?? [];
    for (let i in list) {
        let obj = list[i];
        await db.RecordDailyOverviews.update({
            iAgentBetB: obj.iAgentBetB,
            iAgentBetUO: obj.iAgentBetUO,
            iAgentBetS: obj.iAgentBetS,

            iAgentWinB: obj.iAgentWinB,
            iAgentWinUO: obj.iAgentWinUO,
            iAgentWinS: obj.iAgentWinS,

            iAgentRollingB: obj.iAgentRollingB,
            iAgentRollingUO: obj.iAgentRollingUO,
            iAgentRollingS: obj.iAgentRollingS,
        }, {
            where: {
                id: obj.id
            }
        });

        betB += obj.iAgentBetB;
        betUO += obj.iAgentBetUO;
        betS += obj.iAgentBetS;

        winB += obj.iAgentWinB;
        winUO += obj.iAgentWinUO;
        winS += obj.iAgentWinS;

        rollingB += obj.iAgentBetB * (obj.fBaccaratR4 - obj.fBaccaratR) * 0.01;
        rollingUO += obj.iAgentBetUO * (obj.fUnderOverR4 - obj.fUnderOverR) * 0.01;
        rollingS += obj.iAgentBetS * (obj.fSlotR4 - obj.fSlotR) * 0.01;
    }

    // 대본사 추가
    await db.RecordDailyOverviews.update({
        iAgentBetB: betB,
        iAgentBetUO: betUO,
        iAgentBetS: betS,

        iAgentWinB: winB,
        iAgentWinUO: winUO,
        iAgentWinS: winS,

        iAgentRollingB: rollingB,
        iAgentRollingUO: rollingUO,
        iAgentRollingS: rollingS,
    }, {
        where: {
            id: obj.id
        }
    });


    res.send({result: 'OK'});
});

module.exports = router;