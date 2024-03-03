const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');

const Enum = require('../helpers/enum');
// let IAccount =
// {
//     cVender: 'EZUGI',
//     cCurrency: 'KRW',
//     cAPIURL : 'https://play.livetables.io/auth/',
//     cGameURL : 'https://play.livetables.io/auth/',
//     cOperatorID : 10752001,
//     cSecretCode : 'rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=',
//     cLanguage: 'kr',
//     cIP:'',
//     SignatureHashKey: 'b328ca06-0d15-44d9-9fa7-be94c9b592ad',
//     cAPIUSER : 'IIPUser',
//     cAPIID : '10752001-a4e1e2c9',
//     cAPIAccess : '28c65b947b57b4ca405d3aea2152fce02a5542679049646770d0f09ae774939b',
//     cBOAddress : 'https://boint.tableslive.com/api/get/',
// };
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

let GetTime = (strTime, iSecondOffset) => {

    let time = new Date(strTime);
    time.setHours(time.getHours()-9);
    time.setSeconds(time.getSeconds()+iSecondOffset);

    const date = moment(time).format('YYYY-MM-DD HH:mm:ss');
    return date;
}

exports.GetRangeRD = async (dateStart, dateEnd) => {

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

exports.GetRD = (list, strUniqueID) =>
{
    for ( let i in list )
    {
        if ( strUniqueID == list[i].strUniqueID )
        {
            return list[i];
        }
    }

    return null;
}

let GetTarget = (objectBet, objectWin) => {

    let listBetKey = Object.keys(objectBet);
    let listBetValue = Object.values(objectBet);

    let listWinKey = Object.keys(objectWin);
    let listWinValue = Object.values(objectWin);

    let list = {}

    for ( let i in listBetKey )
    {
        switch ( listBetKey[i] )
        {
            case 'PlayerBet':
                list[listBetKey[i]] = {iGameCode:0, iTarget:Enum.EBetType.Player, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerBet':
                list[listBetKey[i]] = {iGameCode:0, iTarget:Enum.EBetType.Banker, iBet:listBetValue[i], iWin:0};
                break;
            case 'TieBet':
                list[listBetKey[i]] = {iGameCode:0, iTarget:Enum.EBetType.Tie, iBet:listBetValue[i], iWin:0};
                break;
            case 'PlayerPair':
                list[listBetKey[i]] = {iGameCode:0, iTarget:Enum.EBetType.PlayerPair, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerPair':
                list[listBetKey[i]] = {iGameCode:0, iTarget:Enum.EBetType.BankerPair, iBet:listBetValue[i], iWin:0};
                break;

            case 'PlayerOver':
                list[listBetKey[i]] = {iGameCode:100, iTarget:Enum.EBetType.PlayerOver, iBet:listBetValue[i], iWin:0};
                break;
            case 'PlayerUnder':
                list[listBetKey[i]] = {iGameCode:100, iTarget:Enum.EBetType.PlayerUnder, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerOver':
                list[listBetKey[i]] = {iGameCode:100, iTarget:Enum.EBetType.BankerOver, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerUnder':
                list[listBetKey[i]] = {iGameCode:100, iTarget:Enum.EBetType.BankerUnder, iBet:listBetValue[i], iWin:0};
                break;

            default:
                list[listBetKey[i]] = {iGameCode:0, iTarget:Enum.EBetType.LiveCasino, iBet:listBetValue[i], iWin:0};
        }
    }

    for ( let i in listWinKey )
    {
        list[listWinKey[i]].iWin = listWinValue[i];
    }

    let listFinal = [];

    for ( let i in list )
    {
        listFinal.push({iGameCode:list[i].iGameCode, iTarget:list[i].iTarget, iBet:list[i].iBet, iWin:list[i].iWin});
    }

    return listFinal;
}

let GetCards = (banker, player) => {
    // {'P':[{'C':'KC', 'N':'10'},{'C':'Ah','N':'11'},{'C':'9c','N':'9'}],'B':[{'C':'Qd','N':'10'},{'C':'6s','N':'6'}]} 형태로 만듬
    try {
        let blist = [];
        for (let i in banker) {
            blist.push({
                'C':`${banker[i].CardName}`,
                'N':`${banker[i].CardValue}`
            });
        }

        let plist = [];
        for (let i in player) {
            plist.push({
                'C':`${player[i].CardName}`,
                'N':`${player[i].CardValue}`
            });
        }
        if (blist.length > 0 && plist.length > 0) {
            return {'B': blist, 'P': plist};
        }
    } catch (err) {
    }
    return null;
}

let GetBets = (list) => {
    // [{"iGameCode":0,"iTarget":1,"iBet":1000,"iWin":0},{"iGameCode":0,"iTarget":3,"iBet":1000,"iWin":0},{"iGameCode":100,"iTarget":101,"iBet":1000,"iWin":0}]
    // [{'C':0, 'T':1, 'B':1000, 'W':0}, {'C':0, 'T':3, 'B':1000, 'W':0}, {'C':100, 'T':101, 'B':1000, 'W':0}] 형태로 만듬
    try {
        let blist = [];
        for (let i in list) {
            blist.push({
                'C':list[i].iGameCode,
                'T':list[i].iTarget,
                'B':list[i].iBet,
                'W':list[i].iWin
            })
        }
        if (blist.length > 0) {
            return blist;
        }
    } catch (err) {
    }
    return null;
}

exports.GetTestObj = (recordBet) => {
    let current = {
        "BetTypeID": "101",
        "ID": "164925820",
        "RoundID": "88491633",
        "StudioID": "100",
        "TableID": "100",
        "UID": `iip1-${recordBet.strID}`,
        "OperatorID": "10752001",
        "OperatorID2": "10752001",
        "SessionCurrency": "KRW",
        "SkinID": "0",
        "BetSequenceID": "0",
        "Bet": `${recordBet.iBet}`,
        "Win": `${recordBet.iWin}`,
        "GameString": `{"TableId":"100","PlayerId":"10752001|iip1-${recordBet.strID}|100","CardInShoe":192,"BetAmount":${recordBet.iBet},"SessionCurrency":"KRW","TotalWin":${recordBet.iWin},"PlayerCards":[{"CardName":"6h","CardValue":6},{"CardName":"9s","CardValue":9},{"CardName":"Th","CardValue":10}],"OperatorID":"10752001","BetsList":{"PlayerBet":${recordBet.iBet}},"WinningHand":{"isPlayerPair":false,"isPlayerNaturalHand":false,"BankerCards":[{"CardName":"3s","CardValue":3},{"CardName":"9s","CardValue":9},{"CardName":"3s","CardValue":3}],"isBankerNaturalHand":false,"isBankerPair":false,"isSuitedTie":false,"PlayerCards":[{"CardName":"6h","CardValue":6},{"CardName":"9s","CardValue":9},{"CardName":"Th","CardValue":10}],"playerHandValue":5,"bankerHandValue":5,"roundId":${recordBet.strRound},"WinningHand":"Tie","CardHandValue":5},"BankerCards":[{"CardName":"3s","CardValue":3},{"CardName":"9s","CardValue":9},{"CardName":"3s","CardValue":3}],"ServerId":102,"DealerId":"20","roundId":${recordBet.strRound},"WinningBets":{"PlayerBet":${recordBet.iBet}},"GameID":2}`,
        "Bankroll": "1499000.00",
        "SeatID": "",
        "BrandID": "0",
        "RoundDateTime": "2024-02-21 15:48:39",
        "ActionID": "2",
        "BetType": "Game Credit",
        "PlatformID": "0",
        "DateInserted": "2024-02-21 15:48:38",
        "GameTypeID": "2",
        "BFTransactionFound": null,
        "GameTypeName": "baccarat",
        "ErrorCode": "0",
        "originalErrorCode": "0",
        "TransactionID": `${recordBet.strUniqueID}`,
        "DebitTransactionID": "d4fb4653-1dc4-422a-8014-ea41864056f1",
        "ReturnReason": "0",
        "NickName": "??"
    };

    const objectData = {strUniqueID:recordBet.strUniqueID, list:[], strCards: '', strBets: ''};

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

    return objectData;
}