const axios = require('axios');
const Enum = require('../helpers/enum');

const IAccount = {
    cAPIToken:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NTUxZmY4YTZlOTFjYTdkZTgxMWQwYWYiLCJhY2NvdW50IjoiaWlwZ2FtZSIsIm93bmVyIjoiNjU1MWZmOGE2ZTkxY2E3ZGU4MTFkMGFmIiwicGFyZW50Ijoic2VsZiIsImN1cnJlbmN5IjoiS1JXIiwiYnJhbmQiOiJtb3RpdmF0aW9uIiwianRpIjoiNjgyMTU5ODcxIiwiaWF0IjoxNjk5ODcyNjUwLCJpc3MiOiJDeXByZXNzIiwic3ViIjoiU1NUb2tlbiJ9.SI3LXRK74d3p2DNOK024mzIeVQBNZ0tgwMAPRO-_hIM',
    cRDAddress:'https://apii.cqgame.cc/gameboy/order/view',
}

let GetTime = (strUTC4, iOffset) => {
    const kDate = new Date(strUTC4);
    let date = new Date(kDate.getTime() - (4 * 60 * 60 * 1000));
    date.setSeconds(date.getSeconds()+iOffset);
    let strDate = date.toISOString();
    strDate = strDate.replace('Z','-04:00');

    return strDate;
}

let GetTimeRange = (strUTC4) => {

    const kDate = new Date(strUTC4);

    let dateStart = new Date(kDate.getTime() - (4 * 60 * 60 * 1000));
    let dateEnd = new Date(kDate.getTime() - (4 * 60 * 60 * 1000));
    dateEnd.setSeconds(dateEnd.getSeconds()+1);

    let strStart = dateStart.toISOString();
    let strEnd = dateEnd.toISOString();
    strStart = strStart.replace('Z','-04:00');
    strEnd = strEnd.replace('Z','-04:00');
    
    return {start:strStart, end:strEnd};
}

exports.GetRangeRD = async (strStartTime, strEndTime) => {

    console.log(`CQ9::GetRangeRD Params : strStartTime:${strStartTime}, strEndTime:${strEndTime}`);

    let startTime = GetTime(strStartTime, -3);
    let endTime = GetTime(strEndTime, 1);

    const strCQ92 = `${IAccount.cRDAddress}?&page=1&starttime=${startTime}&endtime=${endTime}`;
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
    console.log(strCQ92);
    try {
        const response = await axios.get(strCQ92,
            {
                headers: {
                    'Authorization':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NTUxZmY4YTZlOTFjYTdkZTgxMWQwYWYiLCJhY2NvdW50IjoiaWlwZ2FtZSIsIm93bmVyIjoiNjU1MWZmOGE2ZTkxY2E3ZGU4MTFkMGFmIiwicGFyZW50Ijoic2VsZiIsImN1cnJlbmN5IjoiS1JXIiwiYnJhbmQiOiJtb3RpdmF0aW9uIiwianRpIjoiNjgyMTU5ODcxIiwiaWF0IjoxNjk5ODcyNjUwLCJpc3MiOiJDeXByZXNzIiwic3ViIjoiU1NUb2tlbiJ9.SI3LXRK74d3p2DNOK024mzIeVQBNZ0tgwMAPRO-_hIM',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log(response.data);
        console.log(response.data.data);

        if ( response.data.data == null || response.data.data == undefined )
            return null;
        if ( response.data.data.Data == null || response.data.data.Data == undefined )
            return null;

        const listRoot = response.data.data.Data;

        let listData = [];
        for ( let i in listRoot )
        {
            console.log(listRoot[i]);
            console.log(listRoot[i].livebetdetail);

            const arrayTemp = listRoot[i].account.split('-');
            const strID = arrayTemp.length>1 ? arrayTemp[1] : listRoot[i].account;

            let objectData = {strID:strID, strRound:listRoot[i].round, list:[], strCards:'', strBets:'' };

            const listBets = listRoot[i].livebetdetail;
            for ( let i in listBets)
            {
                let object = {iGameCode:this.GetGameCode(listBets[i].bettype), iTarget:this.GetTarget(listBets[i].bettype), iBet:parseInt(listBets[i].bet), iWin:parseInt(listBets[i].win)};
                objectData.list.push(object);
            }

            const cards = GetCards(listRoot[i].gameresult?.cards ?? []);
            if (cards != null) {
                objectData.strCards = JSON.stringify(cards);
            }

            const bets = GetBets(objectData.list);
            if (bets != null) {
                objectData.strBets = JSON.stringify(bets);
            }

            listData.push(objectData);
        }
        return listData;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

exports.GetRD = (list, strRound, strID) =>
{
    console.log(`CQ9::GetRD strRound : ${strRound}, strID : ${strID}`);

    for ( let i in list )
    {
        if ( strRound == list[i].strRound && strID == list[i].strID )
        {
            return list[i];
        }
    }

    return null;
}

exports.GetTarget = (strBetType) =>
{
    switch ( strBetType )
    {
        case '2':
            return Enum.EBetType.Player;
        case '1':
            return Enum.EBetType.Banker;
        case '3':
            return Enum.EBetType.Tie;
        case '5':
            return Enum.EBetType.PlayerPair;
        case '4':
            return Enum.EBetType.BankerPair;
        case '18':
            return Enum.EBetType.PlayerOver;
        case '19':
            return Enum.EBetType.PlayerUnder;
        case '16':
            return Enum.EBetType.BankerOver;
        case '17':
            return Enum.EBetType.BankerUnder;
        case '20':
            return Enum.EBetType.TieOver;
        case '21':
            return Enum.EBetType.TieUnder;
    }
    return Enum.EBetType.LiveCasino;
}

exports.GetGameCode = (strBetType) =>
{
    switch ( strBetType )
    {
        case '18':
        case '19':
        case '16':
        case '17':
        case '20':
        case '21':
            return Enum.EGameCode.UnderOver;
    }
    return Enum.EGameCode.Baccarat;
}

let GetCards = (cards) => {
    // "cards": [{"poker": "C3", "tag": 2}, {"poker": "C2", "tag": 1}, {"poker": "H3", "tag": 2}, {"poker": "H8", "tag": 1}, {"poker": "S12", "tag": 1}]},
    // {'P':[{'C':'KC', 'N':'10'},{'C':'Ah','N':'11'},{'C':'9c','N':'9'}],'B':[{'C':'Qd','N':'10'},{'C':'6s','N':'6'}]} 형태로 만듬
    try {
        let blist = [];
        let plist = [];
        for (let i in cards) {
            let c = cards[i];
            if (parseInt(c.tag) == 1) {
                blist.push({
                    'C':`${c.poker.substring(0,1)}`,
                    'N':`${c.poker.substring(1)}`
                });
            } else if (parseInt(c.tag) == 2) {
                plist.push({
                    'C':`${c.poker.substring(0,1)}`,
                    'N':`${c.poker.substring(1)}`
                });
            }
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
        return null;
    }
}