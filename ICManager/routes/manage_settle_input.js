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

const testData = require('./overview_4_2.json');

/**
 * 테스트
 */
router.post('/settle_input', async (req, res) => {
    console.log('settle_input');
    console.log(req.body);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:dbuser.strNickname, strGroupID:dbuser.strGroupID, iClass:parseInt(dbuser.iClass), strID:dbuser.strID,
        iRootClass: dbuser.iClass, iPermission: dbuser.iPermission};

    // 부본 리스트 목록
    let list = await db.sequelize.query(`
        SELECT u3.strID As strID3, u3.strNickname AS strNickname3, u4.strID AS strID4, u4.strNickname AS strNickname4, u.fBaccaratR AS fBaccaratR4, u.fUnderOverR AS fUnderOverR4, u.fSlotR AS fSlotR4, 
               u.strNickname, u.fBaccaratR, u.fUnderOverR, u.fSlotR, o.* 
           FROM RecordDailyOverviews o
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
               u.strNickname, u.fBaccaratR, u.fUnderOverR, u.fSlotR, o.* 
           FROM RecordDailyOverviews o
           LEFT JOIN Users u ON u.strID = o.strID
           LEFT JOIN Users u4 ON u4.id = u.iParentID
           LEFT JOIN Users u3 ON u3.id = u4.iParentID
           WHERE o.strGroupID LIKE '${dbuser.strGroupID}%' AND o.iClass = 5
    `);

    res.send({result: 'OK', list: list[0]});

});

router.post('/request_input', async (req, res) => {
    console.log('input_apply');
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


router.post('/rollback', async (req, res) => {
    console.log('rollback');
    console.log(req.body);
    // 유저 ID >= 86 이상부터 테스트임

    let jsonData = testData;

    // rhtps1 제외
    // for (let i in jsonData) {
    //     let obj = jsonData[i];
    //
    //     if (obj.iClass == 5) {
    //         let data = await db.RecordDailyOverviews.findOne({where: {
    //                 strID: `0${obj.strID}`,
    //                 strDate: '2024-05-01'
    //         }});
    //
    //         if (data != null) {
    //             // 부본사 데이터 업데이트
    //             await db.RecordDailyOverviews.update({
    //                 iAgentBetB: parseFloat(obj.iAgentBetB),
    //                 iAgentBetUO: parseFloat(obj.iAgentBetUO),
    //                 iAgentBetS: parseFloat(obj.iAgentBetS),
    //
    //                 iAgentWinB: parseFloat(obj.iAgentWinB),
    //                 iAgentWinUO: parseFloat(obj.iAgentWinUO),
    //                 iAgentWinS: parseFloat(obj.iAgentWinS),
    //
    //                 iAgentRollingB: parseFloat(obj.iAgentRollingB),
    //                 iAgentRollingUO: parseFloat(obj.iAgentRollingUO),
    //                 iAgentRollingS: parseFloat(obj.iAgentRollingS),
    //             }, {
    //                 where: {
    //                     strID: `0${obj.strID}`,
    //                     strDate: '2024-05-01'
    //                 }
    //             });
    //         } else {
    //             await db.RecordDailyOverviews.create({
    //                 iAgentBetB: parseFloat(obj.iAgentBetB ?? 0),
    //                 iAgentBetUO: parseFloat(obj.iAgentBetUO),
    //                 iAgentBetS: parseFloat(obj.iAgentBetS),
    //
    //                 iAgentWinB: parseFloat(obj.iAgentWinB),
    //                 iAgentWinUO: parseFloat(obj.iAgentWinUO),
    //                 iAgentWinS: parseFloat(obj.iAgentWinS),
    //
    //                 iAgentRollingB: parseFloat(obj.iAgentRollingB),
    //                 iAgentRollingUO: parseFloat(obj.iAgentRollingUO),
    //                 iAgentRollingS: parseFloat(obj.iAgentRollingS),
    //
    //                 iClass: parseInt(obj.iClass),
    //                 strGroupID: obj.strGroupID,
    //
    //                 strID: `0${obj.strID}`,
    //                 strDate: '2024-05-01'
    //             });
    //         }
    //     }
    // }


    // 대본사 만들기
    let users = await db.Users.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${req.body.strGroupID}%`
            },
            iClass:4
        }
    });
    for (let i in users) {
        let obj = users[i];

        let iAgentRollingB = 0;
        let iAgentRollingUO = 0;
        let iAgentRollingS = 0;

        let iAgentBetB = 0;
        let iAgentBetUO = 0;
        let iAgentBetS = 0;

        let iAgentWinB = 0;
        let iAgentWinUO = 0;
        let iAgentWinS = 0;

        // 대본사 하위 부본사 값 계산
        let subList = await db.RecordDailyOverviews.findAll({
            where: {
                strGroupID: {
                    [Op.like]:`${obj.strGroupID}%`
                },
                iClass: 5,
                strDate: '2024-05-01'
            }
        });

        for (let j in subList) {
            let u = await db.Users.findOne({where: { strID: subList[j].strID }});
            try {
                let fRollingB = ((obj.fBaccaratR ?? 0) - (u.fBaccaratR ?? 0)) * 0.01;
                let fRollingUO = ((obj.fUnderOverR ?? 0) - (u.fUnderOverR ?? 0)) * 0.01;
                let fRollingS = ((obj.fSlotR ?? 0) - (u.fSlotR ?? 0)) * 0.01;

                let o = subList[j];

                iAgentRollingB += o.iAgentBetB * fRollingB;
                iAgentRollingUO += o.iAgentBetUO * fRollingUO;
                iAgentRollingS += o.iAgentBetS * fRollingS;

                iAgentBetB += o.iAgentBetB;
                iAgentBetUO += o.iAgentBetUO;
                iAgentBetS += o.iAgentBetS;

                iAgentWinB += o.iAgentWinB;
                iAgentWinUO += o.iAgentWinUO;
                iAgentWinS += o.iAgentWinS;
            } catch (err) {
                console.log(err);
                console.log(subList[j].strID);
            }

        }

        let data = await db.RecordDailyOverviews.findOne({where: {
                strID: `${obj.strID}`,
                strDate: '2024-05-01'
            }});
        if (data != null) {
            await db.RecordDailyOverviews.update({
                iAgentBetB: iAgentBetB,
                iAgentBetUO: iAgentBetUO,
                iAgentBetS: iAgentBetS,

                iAgentWinB: iAgentWinB,
                iAgentWinUO: iAgentWinUO,
                iAgentWinS: iAgentWinS,

                iAgentRollingB: iAgentRollingB,
                iAgentRollingUO: iAgentRollingUO,
                iAgentRollingS: iAgentRollingS,
            }, {
                where: {
                    strID: `${obj.strID}`,
                    strDate: '2024-05-01'
                }
            });
        } else {
            await db.RecordDailyOverviews.create({
                iAgentBetB: iAgentBetB,
                iAgentBetUO: iAgentBetUO,
                iAgentBetS: iAgentBetS,

                iAgentWinB: iAgentWinB,
                iAgentWinUO: iAgentWinUO,
                iAgentWinS: iAgentWinS,

                iAgentRollingB: iAgentRollingB,
                iAgentRollingUO: iAgentRollingUO,
                iAgentRollingS: iAgentRollingS,

                iClass: parseInt(obj.iClass),
                strGroupID: obj.strGroupID,

                strID: `${obj.strID}`,
                strDate: '2024-05-01'
            });
        }
    }


    res.send({result: 'OK'});
});

module.exports = router;