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

    let id = req.body.id;

    let iAgentBetB = req.body.iAgentBetB ?? 0;
    let iAgentBetUO = req.body.iAgentBetUO ?? 0;
    let iAgentBetS = req.body.iAgentBetS ?? 0;

    let iAgentWinB = req.body.iAgentWinB ?? 0;
    let iAgentWinUO = req.body.iAgentWinUO ?? 0;
    let iAgentWinS = req.body.iAgentWinS ?? 0;

    let iAgentRollingB = 0;
    let iAgentRollingUO = 0;
    let iAgentRollingS = 0;

    let obj = await db.RecordDailyOverviews.findOne({where: {id: id}});
    if (obj == null) {
        res.send({result: 'FAIL', msg:'처리오류'});
        return;
    }

    let user = await db.Users.findOne({where: {strID: obj.strID}});
    // 부본 롤링 계산해서 넣기
    {
        iAgentRollingB = iAgentBetB * user.fBaccaratR * 0.01;
        iAgentRollingUO = iAgentBetUO * user.fUnderOverR * 0.01;
        iAgentRollingS = iAgentBetS * user.fSlotR * 0.01;

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
                id: obj.id
            }
        });
    }

    // 대본에 대해서는 부본의 모든 데이터를 가져와서 계산해서 넣기
    {
        let user4 = await db.Users.findOne({
            where: {
                id:user.iParentID
            }
        });

        // 대본사 하위 부본사 값 계산
        let subList = await db.RecordDailyOverviews.findAll({
            where: {
                strGroupID: {
                    [Op.like]:`${user4.strGroupID}%`
                },
                iClass: 5,
                strDate: '2024-05-01'
            }
        });

        let result = await GetCalChildData(user4, subList);
        await CreateOrUpdate(user4, result);
    }

    res.send({result: 'OK'});
});


router.post('/rollback', async (req, res) => {
    console.log('rollback');
    console.log(req.body);
    // 유저 ID >= 86 이상부터 테스트임

    let jsonData = testData;

    for (let i in jsonData) {
        let obj = jsonData[i];

        if (obj.iClass == 5) {
            let data = await db.RecordDailyOverviews.findOne({where: {
                    strID: `0${obj.strID}`,
                    strDate: '2024-05-01'
            }});

            if (data != null) {
                // 부본사 데이터 업데이트
                await db.RecordDailyOverviews.update({
                    iAgentBetB: parseFloat(obj.iAgentBetB),
                    iAgentBetUO: parseFloat(obj.iAgentBetUO),
                    iAgentBetS: parseFloat(obj.iAgentBetS),

                    iAgentWinB: parseFloat(obj.iAgentWinB),
                    iAgentWinUO: parseFloat(obj.iAgentWinUO),
                    iAgentWinS: parseFloat(obj.iAgentWinS),

                    iAgentRollingB: parseFloat(obj.iAgentRollingB),
                    iAgentRollingUO: parseFloat(obj.iAgentRollingUO),
                    iAgentRollingS: parseFloat(obj.iAgentRollingS),
                }, {
                    where: {
                        strID: `0${obj.strID}`,
                        strDate: '2024-05-01'
                    }
                });
            } else {
                await db.RecordDailyOverviews.create({
                    iAgentBetB: parseFloat(obj.iAgentBetB ?? 0),
                    iAgentBetUO: parseFloat(obj.iAgentBetUO),
                    iAgentBetS: parseFloat(obj.iAgentBetS),

                    iAgentWinB: parseFloat(obj.iAgentWinB),
                    iAgentWinUO: parseFloat(obj.iAgentWinUO),
                    iAgentWinS: parseFloat(obj.iAgentWinS),

                    iAgentRollingB: parseFloat(obj.iAgentRollingB),
                    iAgentRollingUO: parseFloat(obj.iAgentRollingUO),
                    iAgentRollingS: parseFloat(obj.iAgentRollingS),

                    iClass: parseInt(obj.iClass),
                    strGroupID: obj.strGroupID,

                    strID: `0${obj.strID}`,
                    strDate: '2024-05-01'
                });
            }
        }
    }


    // 대본사 만들기
    let users = await db.Users.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${req.body.strGroupID}%`
            },
            iClass:4,
            id:{
                [Op.gt]:85
            }
        }
    });
    for (let i in users) {
        let obj = users[i];

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

        let result = await GetCalChildData(obj, subList);
        await CreateOrUpdate(obj, result);

        // for (let j in subList) {
        //     let u = await db.Users.findOne({where: { strID: subList[j].strID }});
        //     try {
        //         let fRollingB = ((obj.fBaccaratR ?? 0) - (u.fBaccaratR ?? 0)) * 0.01;
        //         let fRollingUO = ((obj.fUnderOverR ?? 0) - (u.fUnderOverR ?? 0)) * 0.01;
        //         let fRollingS = ((obj.fSlotR ?? 0) - (u.fSlotR ?? 0)) * 0.01;
        //
        //         let o = subList[j];
        //         // 대본에서 먹을 롤링비 계산 + 하부 전체 롤링값을 더해서 누적
        //         iAgentRollingB += (o.iAgentBetB * fRollingB + subList[j].iAgentRollingB);
        //         iAgentRollingUO += (o.iAgentBetUO * fRollingUO + subList[j].iAgentRollingUO);
        //         iAgentRollingS += (o.iAgentBetS * fRollingS + subList[j].iAgentRollingS);
        //
        //         iAgentBetB += o.iAgentBetB;
        //         iAgentBetUO += o.iAgentBetUO;
        //         iAgentBetS += o.iAgentBetS;
        //
        //         iAgentWinB += o.iAgentWinB;
        //         iAgentWinUO += o.iAgentWinUO;
        //         iAgentWinS += o.iAgentWinS;
        //     } catch (err) {
        //         console.log(err);
        //         console.log(subList[j].strID);
        //     }
        //
        // }

        // let data = await db.RecordDailyOverviews.findOne({where: {
        //         strID: `${obj.strID}`,
        //         strDate: '2024-05-01'
        //     }});
        // if (data != null) {
        //     await db.RecordDailyOverviews.update({
        //         iAgentBetB: result.iAgentBetB,
        //         iAgentBetUO: result.iAgentBetUO,
        //         iAgentBetS: result.iAgentBetS,
        //
        //         iAgentWinB: result.iAgentWinB,
        //         iAgentWinUO: result.iAgentWinUO,
        //         iAgentWinS: result.iAgentWinS,
        //
        //         iAgentRollingB: result.iAgentRollingB,
        //         iAgentRollingUO: result.iAgentRollingUO,
        //         iAgentRollingS: result.iAgentRollingS,
        //     }, {
        //         where: {
        //             strID: `${obj.strID}`,
        //             strDate: '2024-05-01'
        //         }
        //     });
        // } else {
        //     await db.RecordDailyOverviews.create({
        //         iAgentBetB: result.iAgentBetB,
        //         iAgentBetUO: result.iAgentBetUO,
        //         iAgentBetS: result.iAgentBetS,
        //
        //         iAgentWinB: result.iAgentWinB,
        //         iAgentWinUO: result.iAgentWinUO,
        //         iAgentWinS: result.iAgentWinS,
        //
        //         iAgentRollingB: result.iAgentRollingB,
        //         iAgentRollingUO: result.iAgentRollingUO,
        //         iAgentRollingS: result.iAgentRollingS,
        //
        //         iClass: parseInt(obj.iClass),
        //         strGroupID: obj.strGroupID,
        //
        //         strID: `${obj.strID}`,
        //         strDate: '2024-05-01'
        //     });
        // }
    }


    res.send({result: 'OK'});
});

let CreateOrUpdate = async (obj, result) => {
    let data = await db.RecordDailyOverviews.findOne({
        where: {
            strID: `${obj.strID}`,
            strDate: '2024-05-01'
        }
    });
    if (data != null) {
        await db.RecordDailyOverviews.update({
            iAgentBetB: result.iAgentBetB,
            iAgentBetUO: result.iAgentBetUO,
            iAgentBetS: result.iAgentBetS,

            iAgentWinB: result.iAgentWinB,
            iAgentWinUO: result.iAgentWinUO,
            iAgentWinS: result.iAgentWinS,

            iAgentRollingB: result.iAgentRollingB,
            iAgentRollingUO: result.iAgentRollingUO,
            iAgentRollingS: result.iAgentRollingS,
        }, {
            where: {
                strID: `${obj.strID}`,
                strDate: '2024-05-01'
            }
        });
    } else {
        await db.RecordDailyOverviews.create({
            iAgentBetB: result.iAgentBetB,
            iAgentBetUO: result.iAgentBetUO,
            iAgentBetS: result.iAgentBetS,

            iAgentWinB: result.iAgentWinB,
            iAgentWinUO: result.iAgentWinUO,
            iAgentWinS: result.iAgentWinS,

            iAgentRollingB: result.iAgentRollingB,
            iAgentRollingUO: result.iAgentRollingUO,
            iAgentRollingS: result.iAgentRollingS,

            iClass: parseInt(obj.iClass),
            strGroupID: obj.strGroupID,

            strID: `${obj.strID}`,
            strDate: '2024-05-01'
        });
    }
}

let GetCalChildData = async (parent, child) => {
    let data = {
        iAgentRollingB: 0, iAgentRollingUO: 0, iAgentRollingS: 0,
        iAgentBetB: 0, iAgentBetUO: 0, iAgentBetS: 0,
        iAgentWinB: 0, iAgentWinUO: 0, iAgentWinS: 0
    };
    for (let j in child) {
        let o = child[j];

        let u = await db.Users.findOne({where: {strID: o.strID}});
        try {
            let fRollingB = ((parent.fBaccaratR ?? 0) - (u.fBaccaratR ?? 0)) * 0.01;
            let fRollingUO = ((parent.fUnderOverR ?? 0) - (u.fUnderOverR ?? 0)) * 0.01;
            let fRollingS = ((parent.fSlotR ?? 0) - (u.fSlotR ?? 0)) * 0.01;

            // 대본에서 먹을 롤링비 계산 + 하부 전체 롤링값을 더해서 누적
            data.iAgentRollingB += (o.iAgentBetB * fRollingB + o.iAgentRollingB);
            data.iAgentRollingUO += (o.iAgentBetUO * fRollingUO + o.iAgentRollingUO);
            data.iAgentRollingS += (o.iAgentBetS * fRollingS + o.iAgentRollingS);

            data.iAgentBetB += o.iAgentBetB;
            data.iAgentBetUO += o.iAgentBetUO;
            data.iAgentBetS += o.iAgentBetS;

            data.iAgentWinB += o.iAgentWinB;
            data.iAgentWinUO += o.iAgentWinUO;
            data.iAgentWinS += o.iAgentWinS;
        } catch (err) {
            console.log(err);
            console.log(child[j].strID);
        }
    }
    return data;
}


// 죽장 전체 초기화
router.post('/testinit', async (req, res) => {

    let users = await db.Users.findAll();
    for ( let i in users )
    {
        await users[i].update({
            iSettle:0,
            iSettleAcc:0,
            iSettleAccBefore:0,
        });
    }

    // let shares = await db.ShareUsers.findAll();
    // for ( let i in shares )
    // {
    //     await shares[i].update({
    //         iShare: 0,
    //         iShareAccBefore: 0,
    //         iCreditBefore:0,
    //         iCreditAfter:0
    //     });
    // }

    // await db.GTs.destroy({where:{}, truncate:true});
    // await db.CreditRecords.destroy({where:{}, truncate:true});
    // await db.ShareRecords.destroy({where:{}, truncate:true});
    // await db.ShareCreditRecords.destroy({where:{}, truncate:true});
    // await db.ChargeRequest.destroy({where: {}, truncate:true});
    await db.SettleRecords.destroy({where: {}, truncate: true});
    await db.SettleSubRecords.destroy({where: {}, truncate:true});

    res.send({result:'OK'});
});


module.exports = router;