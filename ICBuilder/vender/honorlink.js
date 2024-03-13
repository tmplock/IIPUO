const axios = require('axios');
const Enum = require('../helpers/enum');

const moment = require('moment');

const IAccount = {
    cAPIToken:'Bearer AgOfVHFvGag3ItIoE2rbIfzoqGyjwy7EkBhq8eBm',
    cRDAddress:'https://api.honorlink.org/api/transactions',
}

let GetTimeRangeFromArg = (strTimeStart, strTimeEnd) => {
    console.log(`diff : ${1}`);
    const kDateStart = new Date(strTimeStart);
    const kDateEnd = new Date(strTimeEnd);

    let dateStart = new Date(kDateStart.getTime() - (9 * 60 * 60 * 1000));
    let dateEnd = new Date(kDateEnd.getTime() - (9 * 60 * 60 * 1000));
    dateStart.setSeconds(dateStart.getSeconds()-1);
    dateEnd.setSeconds(dateEnd.getSeconds()+1);

    console.log(`diff : ${2}`);

    let diff = (dateEnd.getTime()-dateStart.getTime()) / (1000 * 60);

    console.log(`diff : ${diff}`);

    if ( diff > 30 )
    {
        dateEnd = new Date(kDateStart.getTime() - (9 * 60 * 60 * 1000));
        dateEnd.setMinutes(dateEnd.getMinutes()+30);
    }

    const strStart = moment(dateStart).format('YYYY-MM-DD HH:mm:ss');
    const strEnd = moment(dateEnd).format('YYYY-MM-DD HH:mm:ss');

    return {start:strStart, end:strEnd};
}

exports.GetRangeRD = async (strStart, strEnd) => {

    console.log(`strStart : ${strStart}, strEnd : ${strEnd} ################################################ HONORLINK Object Time Range`);
    let objectTimeRange = GetTimeRangeFromArg(strStart, strEnd);
    
    console.log(objectTimeRange);

    const strAddress = `${IAccount.cRDAddress}?start=${objectTimeRange.start}&end=${objectTimeRange.end}&page=1&perPage=100&withDetails=1`;
    console.log(`############################################################################################################## HONORLINK`);
    console.log(strAddress);
    try {
        const response = await axios.get(strAddress,
            {
                headers: {
                    'Authorization':'Bearer AgOfVHFvGag3ItIoE2rbIfzoqGyjwy7EkBhq8eBm',
                    'Content-Type': 'application/json',
                    'Accept':'application/json'
                }
            }
        );
        

        console.log(response.data);
        console.log(response.data.data);

        // console.log(response.data.data[0].id);

        // console.log(`############################################################################################################## details`);
        // console.log(response.data.data[0].details);

        // console.log(`############################################################################################################## external`);
        // console.log(response.data.data[0].external);

        // console.log(`############################################################################################################## detail`);
        // console.log(response.data.data[0].external.detail);

        // console.log(`############################################################################################################## detail.data`);
        // console.log(response.data.data[0].external.detail.data);

        if ( response.data.data == null || response.data.data == undefined )
            return null;
        // if ( response.data.data.Data == null || response.data.data.Data == undefined )
        //     return null;

        let listFinal = [];

        console.log(response.data.data.length);
        for ( let i in response.data.data )
        {
            console.log(i);
            const current = response.data.data[i];

            //console.log(`strUniqueID = ${strUniqueID}, current : ${current.referer_id}`);

            //let object = {iCode:this.GetGameCode(listData[i].bettype), iTarget:this.GetTarget(listData[i].bettype), iBetAmount:cBetAmount, iWinAmount:cWinAmount, iBalanceBefore:iBefore, iBalanceAfter:iAfter};

            //const desc = `Player : ${current.external.detail.data.result.player.cards.join(',')}, Banker : ${current.external.detail.data.result.banker.cards.join(',')}`;

            let objectData = {strUniqueID:current.referer_id, list:[], strCards: '', strBets:''};

            if (current.external != null && current.external.detail != null && current.external.detail.data != null)
            {
                try {

                    for ( let bet in current.external.detail.data.participants[0].bets)
                    {
                        const cVender = current.details.game.vendor;
                        const cTable = current.external.detail.data.table.name;
                        const cBet = current.external.detail.data.participants[0].bets[bet];
                        const cBetTarget = this.GetTarget(cBet.code);

                        let object = {iGameCode:0, iTarget:cBetTarget, iBet:cBet.stake, iWin:cBet.payout, strVender:cVender, strTable:cTable};

                        objectData.list.push(object);
                    }

                    const bets = GetBets(objectData.list);
                    if (bets != null) {
                        objectData.strBets = JSON.stringify(bets);
                    }
                    const cards = GetCards(current?.external?.detail?.data?.result ?? '');
                    if (cards != null) {
                        objectData.strCards = JSON.stringify(cards);
                    }
                } catch (err) {
                    objectData.strUniqueID = null; // PENDING 처리용
                }
            }
            listFinal.push(objectData);
        }

        //console.log(listData);
        return listFinal;

    } 
    catch (error) {
        console.error(error);
        return null;
    }
}

exports.GetRD = (list, strUniqueID) => {

    console.log(`GetRD : ${list.length}, ${strUniqueID}`);

    for (let i in list)
    {
        console.log(list[i]);
        if ( list[i].strUniqueID == null )
            continue;

        console.log(`list[i].strUniqueID = ${list[i].strUniqueID}, betBuilder.strUniqueID : ${strUniqueID}`);
        if (list[i].strUniqueID == strUniqueID) {

            return list[i];
            // const desc = JSON.stringify(list[i].external.detail.data.result);
            // const strBets = JSON.stringify(list[i].external.detail.data.participants[0].bets);
            // const cVender = list[i].details.game.vendor;
            // const cTable = list[i].external.detail.data.table.name;
            // return {strVender: cVender, strTable:cTable, strDesc:desc, strBets:strBets};
        }
    }
    return null;
}

exports.GetTarget = (strBetType) =>
{
    switch ( strBetType )
    {
        case 'BAC_Player':
            return Enum.EBetType.Player;
        case 'BAC_Banker':
            return Enum.EBetType.Banker;
        case 'BAC_Tie':
            return Enum.EBetType.Tie;
        case 'BAC_PlayerPair':
            return Enum.EBetType.PlayerPair;
        case 'BAC_BankerPair':
            return Enum.EBetType.BankerPair;
        case 'BAC_PlayerBonus':
            return Enum.EBetType.PlayerBonus;
        case 'BAC_BankerBonus':
            return Enum.EBetType.BankerBonus;
        case 'BAC_PerfectPair':
            return Enum.EBetType.PerfectPair;
        }
    return Enum.EBetType.LiveCasino;
}

exports.GetGameCode = (strBetType) =>
{
    switch ( strBetType )
    {
        case 'BAC_Player':
        case 'BAC_Banker':
        case 'BAC_Tie':
            return Enum.EGameCode.Baccarat;
        case 'BAC_PlayerPair':
        case 'BAC_BankerPair':
        case 'BAC_PlayerBonus':
        case 'BAC_BankerBonus':
        case 'BAC_PerfectPair':
    }
    return Enum.EBetType.LiveCasino;
}

let GetCards = (cards) => {
    console.log(`GetCards list : ${cards}`);
    // {"banker":{"cards":["8S","9C"],"score":7},"player":{"cards":["6S","6D","TD"],"score":2},"outcome":"Banker"}
    // {'P':[{'C':'KC', 'N':'10'},{'C':'Ah','N':'11'},{'C':'9c','N':'9'}],'B':[{'C':'Qd','N':'10'},{'C':'6s','N':'6'}]} 형태로 만듬
    try {
        let blist = [];
        for (let i in cards.banker.cards) {
            let c = cards.banker.cards[i];
            blist.push({
                'C':`${c.substring(1)}`,
                'N':`${c.substring(0,1)}`
            });
        }

        let plist = [];
        for (let i in cards.player.cards) {
            let c = cards.player.cards[i];
            plist.push({
                'C':`${c.substring(1)}`,
                'N':`${c.substring(0,1)}`
            });
        }
        if (blist.length > 0 && plist.length > 0) {
            return {'B': blist, 'P': plist};
        }
    } catch (err) {
        console.log(`GetCards err : ${err}`);
    }
    return null;
}


let GetBets = (list) => {
    // [{"iGameCode":0,"iTarget":1,"iBet":1000,"iWin":0},{"iGameCode":0,"iTarget":3,"iBet":1000,"iWin":0},{"iGameCode":100,"iTarget":101,"iBet":1000,"iWin":0}]
    // [{'C':0, 'T':1, 'B':1000, 'W':0}, {'C':0, 'T':3, 'B':1000, 'W':0}, {'C':100, 'T':101, 'B':1000, 'W':0}] 형태로 만듬
    console.log(`GetBets list : ${list}`);
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
        console.log(`GetBets err : ${err}`);
    }
    return null;
}