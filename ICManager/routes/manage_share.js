const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));
router.use(express.static(path.join(__dirname, '../', 'objects')));

const db = require('../models');
//const db = require('../db');
const ITime = require('../utils/time');
const IInout = require('../implements/inout');
const {Op, where}= require('sequelize');

//const IObject = require('../objects/betting');

const IAgent = require('../implements/agent3');
const IRolling = require('../implements/rolling');
const ISettle = require('../implements/settle');
const ISocket = require('../implements/socket');

//////////////////////////////////////////////////////////////////////////////
//const cGameRoomName = ["VB No.1", "VB No.2", "VB No.3"];
const cNumGameRooms = 3;


//var kRealtimeObject = new IObject.IRealtimeBetting();

const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const {GetQuaterEndDate} = require("../implements/agent_settle3");

/**
 * 가불
 */
router.post('/request_credits', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const results = await db.CreditRecords.findAll({
        offset: 0, limit: 20, where: {
            createdAt: {
                [Op.between]: [req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID: req.body.strID,
        },
        order: [['createdAt', 'DESC']]
    });

    let data = results;

    const [totals] = await db.sequelize.query(
        `
            SELECT IFNULL(SUM(iIncrease), 0) AS iTotal
            FROM CreditRecords
            WHERE strID = '${req.body.strID}'
              AND createdAt BETWEEN '${req.body.dateStart} 00:00:00' AND '${require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD 00:00:00')}'
            ;
        `
    );

    let total = 0;
    if (totals.length > 0) {
        total = parseInt(totals[0].iTotal);
    }

    res.send({data: data, total: total});
});



// router.post('/request_credits_total', isLoggedIn, async (req, res) => {
//     console.log(req.body);
//     const [totals] = await db.sequelize.query(
//         `
//             SELECT IFNULL(SUM(iIncrease), 0) AS iTotal
//             FROM CreditRecords
//             WHERE strID = '${req.body.strID}'
//             ;
//         `
//     );
//
//     let total = 0;
//     if (totals.length > 0) {
//         total = parseInt(totals[0].iTotal);
//     }
//
//     res.send({total: total});
// });
// router.post('/request_credit_apply', isLoggedIn, async (req, res) => {
//     console.log(req.body);
//     await db.CreditRecords.create({
//         strID: req.body.strID,
//         strNickname: req.body.strNickname,
//         strGroupID: req.body.strGroupID,
//         iClass: req.body.iClass,
//         iIncrease: req.body.iIncrease,
//         writer: req.body.writer,
//         eType: req.body.eType,
//         strMemo: req.body.strMemo,
//         iBeforeCredit: req.body.iBeforeCredit
//     });
//     res.send({result:  'ok'});
// });

router.post('/request_credit_memo_apply', isLoggedIn, async (req, res) => {
    console.log(req.body);
    let credit = await db.CreditRecords.findByPk(req.body.id);

    if (credit != null) {
        await db.CreditRecords.update({strMemo:req.body.strMemo}, {where:{id: req.body.id}});
    }
    res.send({result:  'ok'});
});


/**
 * 지분자 입출금 내역
 */
router.post('/request_shares', isLoggedIn, async  (req, res) => {
    const results = await db.ShareRecords.findAll({
        offset: 0, limit: 20, where: {
            createdAt: {
                [Op.between]: [req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID: req.body.strID,
        },
        order: [['createdAt', 'DESC']]
    });

    let data = results;

    const [totals] = await db.sequelize.query(
        `
            SELECT IFNULL(SUM(iShareAcc), 0) AS iTotal
            FROM ShareRecords
            WHERE strID = '${req.body.strID}'
              AND createdAt BETWEEN '${req.body.dateStart} 00:00:00' AND '${require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD 00:00:00')}'
            ;
        `
    );

    let total = 0;
    if (totals.length > 0) {
        total = parseInt(totals[0].iTotal);
    }

    res.send({data: data, total: total});
});


// 지분비율 수정
router.post('/request_modify_share_group', isLoggedIn, async(req, res) => {

    var json = JSON.parse(req.body.data);

    let ret = {result:"OK"};
    let list = [];
    for ( var i = 0; i < json.length/2; ++i)
    {
        const cDefault = parseInt(i*2);
        var object = {};
        object.strNickname = json[cDefault+0];
        object.fShareR = json[cDefault+1];
        list.push(object);
    }
    ret.data = list;

    console.log(ret);
    if ( ret.result == "OK" )
    {
        for ( let i in ret.data )
        {
            let strNickname = ret.data[i].strNickname;
            let fShareR = ret.data[i].fShareR;

            let user = await db.ShareUsers.findOne({where:{strNickname:strNickname}});
            if ( user != null )
            {
                await db.ShareUsers.update(
                    {
                        fShareR:fShareR,
                    },
                    {where:{strNickname:strNickname}});
            }
        }
        res.send({result:'OK', msg: '적용되었습니다'});
    }
    else
    {
        res.send({result:'Error', msg:ret.name})
    }
});

// 지분 지급
router.post('/request_share_apply', isLoggedIn, async  (req, res) => {
    console.log(req.body);

    try {
        let strID = req.body.strID;
        let strGroupID = req.body.strGroupID;
        let strQuater = req.body.strQuater;
        let json = JSON.parse(req.body.data);

        if (strID == '' || strID == undefined || strQuater == '' || strQuater == undefined) {
            res.send({result:'Error', msg: '필수 항목 부족'});
            return;
        }

        let list = [];
        for ( let i = 0; i < json.length/9; ++i)
        {
            const cDefault = parseInt(i*9);
            var obj = {};
            obj.strNickname = json[cDefault+0];
            obj.iShareOrgin = json[cDefault+1]; // 순이익
            obj.iSlotCommission = json[cDefault+2]; // 슬롯알값
            obj.iShareReceive = json[cDefault+3];
            // obj.iPayback = json[cDefault+4];
            obj.iPayback = 0;
            obj.iSum = json[cDefault+5]; // 합계(순이익 - 슬롯알값)
            obj.fShareR = json[cDefault+6];  // 지분율
            let tempShare = parseInt(obj.iSum) * parseFloat(parseInt(obj.fShareR) * 0.01); // 배당금
            if (tempShare > 0) {
                obj.iShare = Math.floor(tempShare);
            } else {
                obj.iShare = parseInt(tempShare);
            }

            obj.iShareAccBefore = json[cDefault+8];  // 전월 이월 금액
            obj.iCreditBefore = parseInt(obj.iShare) + parseInt(obj.iShareAccBefore);
            list.push(obj);
        }

        for (let i in list) {
            let obj = list[i];
            let strNickname = obj.strNickname;
            let user = await db.ShareUsers.findOne({where:{strNickname:strNickname}});

            if ( user != null )
            {
                let share = await db.ShareRecords.findOne({
                    where: {
                        strNickname: obj.strNickname,
                        strQuater: strQuater,
                    }
                });

                if (share == null) {
                    await db.ShareRecords.create(
                        {
                            strNickname: obj.strNickname,
                            iShareOrgin: obj.iShareOrgin,
                            iSlotCommission: obj.iSlotCommission,
                            iShareReceive: obj.iShareReceive,
                            iPayback: obj.iPayback,
                            fShareR: obj.fShareR,
                            iShare: obj.iShare,
                            iShareAccBefore: obj.iShareAccBefore,
                            iCreditBefore: obj.iCreditBefore,
                            iCreditAfter: obj.iCreditBefore,
                            strID: user.strID,
                            strGroupID: user.strGroupID,
                            strQuater: strQuater,
                        });

                    await db.ShareUsers.update({
                            iShareAccBefore: obj.iShareAccBefore,
                            iCreditBefore: obj.iCreditBefore,
                            iCreditAfter: obj.iCreditBefore,
                        },
                        {where:{strNickname:strNickname}})
                }
            }
        }
        res.send({result:'OK', msg: '지급 되었습니다'});
    } catch (err) {
        res.send({result:'FAIL', msg: '지급 중 오류가 발생했습니다'});
    }
});

router.post('/request_share_credit_apply', isLoggedIn, async  (req, res) => {
    console.log(req.body);

    let strNickname = req.body.strNickname;
    let strID = req.body.strID;
    let strGroupID = req.body.strGroupID;
    let iIncrease = req.body.iIncrease;
    let writer = req.body.writer;
    let strMemo = req.body.strMemo;

    let user = await db.ShareUsers.findOne({where: {
            strNickname: strNickname
        }});

    if ( user == null )
    {
        res.send({result:'Error', msg: '해당 유저 없음'});
        return;
    }

    await db.ShareCreditRecords.create(
        {
            strNickname: strNickname,
            strID: strID,
            strGroupID: strGroupID,
            iIncrease: iIncrease,
            writer: writer,
            strMemo: strMemo,
            iCreditBefore:user.iCreditAfter,
        });

    let iCreditAfter = parseInt(user.iCreditAfter) + parseInt(iIncrease);

    await db.ShareUsers.update({
        strMemo: strMemo,
        iCreditAfter:iCreditAfter,
    }, {where: {
            strNickname: strNickname
        }});

    // 마지막 죽장의 입출후 금액을 갱신하기
    let share = await db.ShareRecords.findAll({
        where: {
            strNickname: user.strNickname,
        },
        order: [['id', 'DESC']],
        limit: 1
    });
    if (share.length > 0) {
        for (let i in share) {
            await db.ShareRecords.update({
                iCreditAfter:iCreditAfter,
            }, {where: {id: share[i].id}});
            // await share[i].update({
            //     iCreditAfter:iCreditAfter,
            // });
        }
    }

    res.send({result:'OK', msg: '저장되었습니다'});
});


/**
 * move
 */

/**
 * 지문자 목록 화면 이동
 */
router.post('/popup_shares', isLoggedIn, async (req, res) => {
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);

    const dbuser = await IAgent.GetUserInfo(req.body.strNickname);

    const user = {strNickname:req.body.strNickname, strGroupID:req.body.strGroupID, iClass:parseInt(req.body.iClass), iCash:dbuser.iCash, iRolling:dbuser.iRolling, iSettle:dbuser.iSettle, strID:dbuser.strID,
        iRootClass:req.user.iClass, iPermission:req.user.iPermission};

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    let list = await IAgent.GetPopupShareInfo(dbuser.strID, dbuser.strGroupID);

    res.render('manage_share/popup_shares', {iLayout:6, iHeaderFocus:0, user:user, agent:agent, list:list, strParent:strParent});
});

router.post('/popup_shares_history', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let parent = await IAgent.GetParentNickname();
    let strParent = await IAgent.GetParentNickname(req.body.strNickname);
    let strParentGroupID = await IAgent.GetParentGroupID(req.body.strNickname);

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    let strGroupID = user.strGroupID;

    const agent = await IAgent.GetPopupAgentInfo(req.body.strGroupID, parseInt(req.body.iClass), req.body.strNickname);

    const list = await db.sequelize.query(`
        SELECT u.strNickname AS parentNickname, DATE_FORMAT(sc.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, 
        sc.strID, sc.strNickname, sc.strGroupID, sc.iIncrease, sc.writer, sc.strMemo, sc.iCreditBefore, sc.eType
        FROM ShareCreditRecords sc
        LEFT JOIN ShareUsers su ON su.strNickname = sc.strNickname
        LEFT JOIN Users u ON u.strID = su.strID
        WHERE sc.strGroupID LIKE CONCAT('${strGroupID}', '%')
        ORDER BY sc.createdAt DESC
    `);

    res.render('manage_share/popup_shares_history', {iLayout:6, iHeaderFocus:1, user:user, agent:agent, list:list[0], strParent:strParent});
});

router.post('/request_share_history_list', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let strID = req.body.strID;
    let strGroupID = req.body.strGroupID;
    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd;
    let strNickname = req.body.strNickname;

    const list = await db.sequelize.query(`
        SELECT u.strNickname AS parentNickname, DATE_FORMAT(sc.createdAt,'%Y-%m-%d %H:%i:%S') AS createdAt, 
        sc.strID, sc.strNickname, sc.strGroupID, sc.iIncrease, sc.writer, sc.strMemo, sc.iCreditBefore, sc.eType
        FROM ShareCreditRecords sc
        LEFT JOIN ShareUsers su ON su.strNickname = sc.strNickname
        LEFT JOIN Users u ON u.strID = su.strID
        WHERE sc.strGroupID LIKE CONCAT('${strGroupID}', '%') 
        AND date(sc.createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'
        AND sc.strNickname LIKE '%${strNickname}%'
        ORDER BY sc.createdAt DESC
    `);

    res.send({result: 'OK', list: list[0]});
});

router.post('/popup_registershare', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    console.log(`######################################################################## popup_registershare`);
    console.log(user);
    let agent = {strNickname:user.strNickname, strID:user.strID, strGroupID:user.strGroupID};
    res.render('manage_share/popup_registershare', {iLayout:1, iHeaderFocus:0, agent:agent});
});

// 지분자 등록
router.post('/reqister_share', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.ShareUsers.findOne({where:{strNickname:req.body.strNickname}});
    if ( dbuser != null ) {
        res.send({result:'FAIL', msg: '이미 있는 닉네임입니다'});
    }

    await db.ShareUsers.create({
        strID: req.body.strID,
        strNickname: req.body.strNickname,
        fShareR:req.body.fShareR,
        strGroupID: req.body.strGroupID,
    });
    res.send({result: 'OK', msg: '저장되었습니다'});
});

router.post('/popup_view_share_user', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = await db.ShareUsers.findOne({where:{strNickname:req.body.strNickname}});
    console.log(user);
    let agent = {strNickname:user.strNickname, strID:user.strID};
    res.render('manage_share/popup_viewshare', {iLayout:1, iHeaderFocus:0, agent:agent, user:user});
});

router.post('/update_share_user', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const user = await db.ShareUsers.findOne({where:{strNickname:req.body.strNickname}});
    if (user == null)
    {
        res.send({result: 'FAIL', msg: '대상자가 없습니다'});
        return;
    }
    await db.ShareUsers.update({
        fShareR: req.body.fShareR
    }, {where:{strNickname:req.body.strNickname}});
    res.send({result: 'OK', msg: '저장 되었습니다'});
});

// 지분자 등록
router.post('/delete_share_user', isLoggedIn, async(req, res) => {

    console.log(req.body);
    const dbuser = await db.ShareUsers.findOne({where:{strNickname:req.body.strNickname}});
    if (dbuser == null)
    {
        res.send({result: 'FAIL', msg: '삭제 대상자가 없습니다'});
        return;
    }

    let credit = parseInt(dbuser.iCreditAfter ?? 0);
    if (credit == 0) {
        await db.ShareUsers.destroy({where:{strNickname:req.body.strNickname}});
        res.send({result: 'OK', msg: '삭제되었습니다'});
    } else {
        res.send({result: 'FAIL', msg: '지분이 남아 있어 삭제할 수 없습니다'});
    }
});

// 지분자 분기별 목록 조회
router.post('/request_share_list', isLoggedIn, async(req, res) => {

    console.log(req.body);

    let strID = req.body.strID;

    // 해당 분기 죽장 완료 체크
    let strQuater = req.body.strQuater;
    let strGroupID = req.body.strGroupID;
    if (strQuater == '' || strQuater == undefined || strGroupID == '' || strGroupID == undefined) {
        res.send({result: 'FAIL', msg: '필수 입력값 없음'});
        return;
    }

    let exist = await db.SettleRecords.findAll({where:{
            strQuater:req.body.strQuater,
            iClass: {
                [Op.in]:[4,5]
            },
            strGroupID:{[Op.like]:req.body.strGroupID+'%'},
        }, order: [['createdAt', 'DESC']]
    });

    const targetUserCount = await getSettleTargetUserCount(req.body.strQuater, req.body.strGroupID);
    // 이용자는 추후에 삭제가 가능함
    if ( targetUserCount > exist.length ) {
        res.send({result:'FAIL', msg: '죽장 완료 후 조회 가능합니다'});
        return;
    }

    // 완료여부
    let lastDate = GetQuaterEndDate(strQuater);
    let shares = await db.ShareUsers.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            },
            createdAt: {[Op.lt]: lastDate}
        }
    });

    let shareExist = await db.ShareRecords.findAll({
        where: {
            strQuater: strQuater,
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });
    // 지분자는 추후에 삭제가 가능함
    if (shares.length <= shareExist.length) {
        let list = await IAgent.GetPopupGetShareInfo(strID, strGroupID, strQuater);
        res.send({result: 'OK', list: list, enable: false});
        return;
    }

    let strQuater2 = '';
    let quaterList = strQuater.split('-');
    if (quaterList[1] == '2') {
        strQuater2 = `${quaterList[0]}-1`;
    } else {
        strQuater2 = `${parseInt(quaterList[0])-1}-2`;
    }

    let list = await db.sequelize.query(`
            SELECT u.strNickname AS parentNickname, su.strNickname AS strNickname, su.fShareR AS fShareR, su.strID AS strID, su.iShareAccBefore AS iShareAccBefore,
                IFNULL((SELECT SUM(iTotalViceAdmin) FROM SettleSubRecords WHERE strGroupID LIKE CONCAT(su.strGroupID,'%') AND strQuater = '${strQuater}'),0) as iShareOrgin,
                IFNULL((SELECT sum(iSettle) FROM SettleRecords WHERE strGroupID LIKE CONCAT(su.strGroupID,'%') AND strQuater = '${strQuater}' AND iClass = 4 AND iSettle < 0),0) as iShareReceive,
                IFNULL((SELECT sum(iPayback) FROM SettleRecords WHERE strGroupID LIKE CONCAT(su.strGroupID,'%') AND strQuater = '${strQuater}' AND iClass IN (4, 5)),0) as iPayback,
                IFNULL((SELECT sum(iSWinlose) FROM SettleRecords WHERE strGroupID LIKE CONCAT(su.strGroupID,'%') AND strQuater = '${strQuater}' AND iClass = 4 AND fSettleSlot = 0),0) as iSWinlose,
                0 AS iShare,
                su.iCreditAfter AS iShareAccBefore,
                0 AS iCreditBefore,
                0 AS iCreditAfter,
                IFNULL(sr.id, 0) AS id
            FROM ShareUsers su
            LEFT JOIN Users u ON u.strID = su.strID
            LEFT JOIN ( SELECT * 
                        FROM ShareRecords
                        WHERE strQuater = '${strQuater2}'
                ) sr ON su.strNickname = sr.strNickname
            WHERE su.strGroupID LIKE CONCAT('${strGroupID}', '%')
            ORDER BY parentNickname ASC, strNickname ASC
        `);
    // 완료여부
    let complete = true;

    res.send({result: 'OK', list: list[0], enable: true});
});

let getSettleTargetUserCount = async (strQuater, strGroupID) => {
    let lastDate = GetQuaterEndDate(strQuater);

    if (lastDate != '') {
        let count = await db.Users.count({
            where: {
                iClass: {
                    [Op.in]:[4,5]
                },
                iPermission: {
                    [Op.notIn]: [100]
                },
                strGroupID: {[Op.like]: strGroupID + '%'},
                createdAt: {[Op.lt]: lastDate}
            }
        });
        return count;
    } else {
        let count = await db.Users.count({
            where: {
                iClass: {
                    [Op.in]:[4,5]
                },
                iPermission: {
                    [Op.notIn]: [100]
                },
                strGroupID: {[Op.like]: strGroupID + '%'}
            }
        });
        return count;
    }
    return 0;
}

module.exports = router;