const db = require('../db');
const axios = require('axios');

const IBettingManager = require('../helpers/IBettingManager');
const crypto = require("crypto");
const moment = require('moment');

let IAccount =
    {
        cVender: 'EZUGI',
        cCurrency: 'KRW',

        cAPIURL : 'https://play.thefunfeed.com/auth/',
        cGameURL : 'https://play.thefunfeed.com/auth/',
        // cAPIURL : 'https://playint.tableslive.com/auth',
        // cGameURL : 'https://playint.tableslive.com/auth',
        cOperatorID : 10752001,
        cSecretCode : 'rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=',
        cLanguage: 'kr',
        cIP:'',
        SignatureHashKey: '281e37ce-a8a2-4e28-8854-57fc511e2f16',
        cAPIUSER : 'IIPUser',
        cAPIID : '10752001-a4e1e2c9',
        cAPIAccess : '28c65b947b57b4ca405d3aea2152fce02a5542679049646770d0f09ae774939b',
        cBOAddress : 'https://boint.tableslive.com/api/get/',
    };

const serverUrl = 'https://unover001.com';

let UpdateUserPageCash = (strID, iCash) => {

    console.log(`UpdateUserPageCash : ${strID}, iCash : ${iCash}`);

    for ( let i in global.socket_list )
    {
        console.log(`UpdateUserPageCash : ${global.socket_list[i].strID}, ${strID}`);
        if ( global.socket_list[i].strID == strID )
        {
            global.socket_list[i].emit('UpdateCash', parseInt(iCash));
        }
    }
}

exports.Bet = async (strID, strAmount, roundID, trID) => {
    console.log('##################################################/Bet');
    try {
        const iGameCode = 0;
        const strVender = 'EZUGI';
        const strGameID = '2';
        const strTableID = `TEST-EZUGI`;
        const strRoundID = roundID;
        // const strTransactionID = `TEST-${roundID}`; // strUniqueID
        const strTransactionID = trID; // strUniqueID
        const strDesc = ''; // strDetail

        const user = await db.Users.findOne({where: {strID: strID}});
        if (user.iCash >= parseFloat(strAmount)) {

            // const cURL = req.get('origin');
            const cURL = '';

            const iOriginCash = user.iCash;
            const iUpdatedCash = parseFloat(iOriginCash) - parseFloat(strAmount);
            if ( iUpdatedCash < 0 )
            {
                console.error('금액 부족');
                return {result: false, msg:'금액 부족'};
            }
            else
            {
                UpdateUserPageCash(strID, iUpdatedCash);

                await IBettingManager.ProcessBet(user.strID, user.strNickname, user.strGroupID, user.iClass, iOriginCash, iGameCode, strVender, strGameID, strTableID, strRoundID,
                    strTransactionID, strDesc, '', 0, strAmount, cURL);
            }
            return {result: true, msg:'정상처리'};
        }
        else {
            console.error('금액 부족');
            return {result: false, msg:'금액 부족'};
        }
    } catch (err) {
        console.error(err);
        return {result: false, msg:`에러 : ${err}`};
    }
}

exports.Win = async (strID, strAmount, roundID, trID) => {
    console.log('##################################################/Win');
    try {
        const iGameCode = 0;
        const strVender = 'EZUGI';
        const strGameID = '2';
        const strTableID = `TEST-EZUGI`;
        const strRoundID = roundID;
        // const strTransactionID = `TEST-${roundID}`; // strUniqueID
        const strTransactionID = trID; // strUniqueID
        const strDesc = ''; // strDetail

        // const cURL = req.get('origin');
        const cURL = '';

        const user = await db.Users.findOne({
            where: {strID: strID},
            raw: true // 캐싱 비활성화, 최신 데이터 조회
        });
        const iCash = parseFloat(user.iCash) + parseFloat(strAmount);
        await IBettingManager.ProcessWin(user.strID, user.strNickname, user.strGroupID, user.iClass, user.iCash, iGameCode, strVender, strGameID,
            strTableID, strRoundID, strTransactionID, strDesc, '', 0, strAmount, cURL);
        await db.Users.increment({iCash:parseFloat(strAmount)}, {where:{strID:user.strID}});
        UpdateUserPageCash(strID, iCash);
        return {result: true, msg: `정상처리`};
    } catch (err) {
        console.error(err);
        return {result: false, msg: `에러 : ${err}`};
    }
}

exports.Get = async () => {
    // let list = await db.RecordBets.findAll({
    //     where: {
    //         eState: 'STANDBY',
    //         strVender: 'EZUGI',
    //     },
    //     order: [['createdAt', 'ASC']]
    // });
    //

    const res = await GetRangeRD('2024-02-21 21:00:00', '2024-02-21 21:00:50');
    if (res == null) {
        console.log(`##### EZUGI SCHEDULE ERROR STOP NOT RES`);
        return;
    }


    // if (list.length > 0) {
    //     const res = await GetRangeRD('2024-02-21 21:00:00', '2024-02-21 21:00:50');
    //     // const res = await GetRangeRD(list[0].createdAt, list[list.length - 1].createdAt);
    //     if (res == null) {
    //         console.log(`##### EZUGI SCHEDULE ERROR STOP NOT RES`);
    //         return;
    //     }
     // for (let i in list) {
        //     if (list[i].eType == 'WIN') {
        //         let listData = RDEzugi.GetRD(res, list[i].strUniqueID);
        //     }
        // }
    // }
}

let GetRangeRD = async (dateStart, dateEnd) => {

    let strStartTime= GetTime(dateStart, -3);
    let strEndTime = GetTime(dateEnd, 3);

    //const strData = `${IAccount.cAPIAccess}DataSet=per_round_report&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&RoundID=${strRoundID}&StartTime=${strStartTime}&EndTime=${strEndTime}&TableID=${strTableID}&UID=${strUID}`;
    const strData = `${IAccount.cAPIAccess}DataSet=per_round_report&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&StartTime=${strStartTime}&EndTime=${strEndTime}`;
    const data = crypto.createHash('sha256').update(strData).digest('hex');
    console.log(`#####`);
    //const strParams = `DataSet=per_round_report&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&RoundID=${strRoundID}&StartTime=${strStartTime}&EndTime=${strEndTime}&TableID=${strTableID}&UID=${strUID}&RequestToken=${data}`;
    const strParams = `DataSet=per_round_report&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&StartTime=${strStartTime}&EndTime=${strEndTime}&RequestToken=${data}`;
    console.log(data);

    try {
        const response = await axios.post(IAccount.cBOAddress,
            strParams,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);

        console.log(response.data.data.length);

        const listData = [];

        for ( let i in response.data.data )
        {
            const current = response.data.data[i];
            if (current.GameString != '' )
            {
                const objectData = {strUniqueID:current.TransactionID, list:[], strCards: '', strBets: ''};

                const desc = JSON.parse(current.GameString);
                console.log(desc);
                const list = GetTarget(desc.BetsList, desc.WinningBets);
                console.log(list);
                if (list.length > 0) {
                    objectData.list = list;
                }

                const bets = GetBets(list);
                if (bets != null) {
                    objectData.strBets = JSON.stringify(bets);
                }

                const cards = GetCards(desc.BankerCards, desc.PlayerCards);
                if (cards != null) {
                    objectData.strCards = JSON.stringify(cards);
                }

                listData.push(objectData);
            }
        }
        return listData;

    } catch (error) {
        console.error('Error fetching from Ezugi API:', error);
        return null;
    }
}

let GetTime = (strTime, iSecondOffset) => {

    let time = new Date(strTime);
    time.setHours(time.getHours()-9);
    time.setSeconds(time.getSeconds()+iSecondOffset);

    const date = moment(time).format('YYYY-MM-DD HH:mm:ss');
    return date;
}

let lProcessEzugi = -1
let Process = async () => {
    console.log(`##### EZUGI SCHEDULE`);
    if (lProcessEzugi != -1) {
        console.log(`##### EZUGI SCHEDULE ING`);
        return;
    }
    lProcessEzugi = 1;
    let listOverview = [];
    let listOdds = [];

    let list = await db.RecordBets.findAll({
        where: {
            eState: 'STANDBY',
            strTableID: 'TEST-EZUGI',
            strVender: 'EZUGI',
        },
        order: [['createdAt', 'ASC']]
    });

    console.log(`list Length : ${list.length}`);

    if (list.length > 0) {
        const res = await GetRangeRD(list[0].updatedAt, list[list.length - 1].updatedAt);
        if (res == null) {
            lProcessEzugi = -1;
            console.log(`##### EZUGI SCHEDULE ERROR STOP NOT RES`);
            return;
        }

        for (let i in list) {
            let listData = RDEzugi.GetRD(res, list[i].strUniqueID);
            if (listData == null) {
                // list[i].strRound =
            }
            if (listData != null) {
                console.log(`##### listData`);

                let odds = await ODDS.GetOdds(list[i].strID, list[i].iClass, listOdds);
                console.log(odds);

                let strDate = list[i].createdAt.substr(0, 10);

                //let {listCurrentOverview, objectBetRolling} = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);

                let objectReturn = ODDS.ProcessRolling(odds, listData.list, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;

                console.log('###### listCurrentOverview');
                console.log(listCurrentOverview);
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

                const strOverview = ODDS.GetRollingString(objectBetRolling);

                await db.RecordBets.update({
                    eState: 'COMPLETE',
                    strDetail: listData.strBets,
                    strResult: listData.strCards,
                    strOverview: strOverview
                }, {where: {id: list[i].id}});
            } else {
                const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
                if (cElapsedSeconds > 60)
                    await db.RecordBets.update({eState: 'PENDING'}, {where: {id: list[i].id}});
            }
        }
        await ODDS.UpdateOverview(listOverview);
    }
    lProcessEzugi = -1;
    console.log(`##### EZUGI SCHEDULE STOP`);
}