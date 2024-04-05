const Enum = require('../helpers/enum');

exports.ParseBetDetails = (strGameID, strDetails, iAmount) => {

    let listData = [];

    if ( strGameID == 2 )
    {
        let temp = strDetails.split(',');
        
        for (let i in temp)
        {
            let temp2 = temp[i].split('-');

            const cAmount = parseInt(temp2[1]);

    
            let object = {iGameCode:this.GetGameCode(strGameID, parseInt(temp2[0])), iTarget:this.GetTarget(parseInt(temp2[0])), iBet:cAmount, iWin:0};

            listData.push(object);
        }
    }
    else
    {
        listData.push({iGameCode:Enum.EGameCode.Baccarat, iTarget:Enum.EBetType.LiveCasino, iBet:iAmount, iWin:0});
    }
    return listData;
}

exports.ParseWinDetails = (strGameID, strDetails, iAmount) => {

    let listData = [];

    if ( strGameID == 2 )
    {
        let first = strDetails.indexOf('WINS;');
        let end = strDetails.indexOf(':CARDS');
    
        console.log(`GetBettingTargetFromWin : ${first}, ${end}`);
    
        let test = strDetails.substr(first+5, end-first-5);
        if ( test != '' )
        {
            let temp = test.split(',');

            for (let i in temp)
            {
                let temp2 = temp[i].split('-');

                const cAmount = parseInt(temp2[1]);

                let object = {iGameCode:this.GetGameCode(strGameID, parseInt(temp2[0])), iTarget:this.GetTarget(parseInt(temp2[0])), iBet:0, iWin:cAmount};

                listData.push(object);
            }
        }
    }
    else
    {
        listData.push({iGameCode:Enum.EGameCode.Baccarat, iTarget:Enum.EBetType.LiveCasino, iBet:0, iWin:iAmount});
    }

    return listData;
}

exports.GetObjectFromTarget = (list, iTarget) => {

    for ( let i in list )
    {
        if ( list[i].iTarget == iTarget )
            return list[i];
    }
    return null;
}

exports.GetDetails = (listBet, listWin) =>
{
    let list = [];
    for ( let i in listBet )
    {
        let objectTarget = this.GetObjectFromTarget(listWin, listBet[i].iTarget);
        let iWin = 0;
        if ( objectTarget != null )
        {
            iWin = objectTarget.iWin;
        }

        let objectData = {C:listBet[i].iGameCode, T:listBet[i].iTarget, B:listBet[i].iBet, W:iWin};
        //let objectData = {iGameCode:listBet[i].iGameCode, iTarget:listBet[i].iTarget, iBet:listBet[i].iBet, iWin:iWin};
        list.push(objectData);
    }
    return list;
}

exports.MakeBettingObject = (strDetail) => {

    console.log(`MakeBettingObject ${strDetail}`);
    let listBet = JSON.parse(strDetail);

    let list = [];
    for ( let i in listBet )
    {
        let objectData = {iGameCode:listBet[i].C, iTarget:listBet[i].T, iBet:listBet[i].B, iWin:listBet[i].W};
        list.push(objectData);
    }
    return list;
}

exports.GetTarget = (iTarget) =>
{
    // if(iGameID == 1){//룰렛
    //     return 400;
    // }
    // else if(iGameID == 4){//블랙 잭
    //     return 500;
    // }
    // else if(iGameID == 18){//드래곤 타이거
    //     return 600;
    // }
    // else if ( iGameID == 202 ) {//  Casino Holdem
    //     return 700;
    // }
    // else if ( iGameID == 218 ) {    //  Teen Patti
    //     return 800;
    // }

    if(iTarget == 1){//플레이어
         return Enum.EBetType.Player;
    }
    else if(iTarget == 2){ //뱅커
        return Enum.EBetType.Banker;
    }
    else if(iTarget == 3){ //타이
        return Enum.EBetType.Tie;
    }
    else if(iTarget == 4){//플레이어페어
         return Enum.EBetType.PlayerPair;
    }
    else if(iTarget == 5){//뱅커페어
        return Enum.EBetType.BankerPair;
    }
    else if(iTarget == 6){//플레이어보너스
        return Enum.EBetType.PlayerBonus;
    }
    else if(iTarget == 7){//뱅커보너스
        return Enum.EBetType.BankerBonus;
    }
    else if(iTarget == 8){//퍼펙트페어
        return Enum.EBetType.PerfectPair;
    }
    else if(iTarget == 9){//이더페어
        return Enum.EBetType.EitherPair;
    }

    else if(iTarget == 19){//플레이어 언더
        return Enum.EBetType.PlayerUnder;
    }
    else if(iTarget == 18){//플레이어 오버
        return Enum.EBetType.PlayerOver;
    }
    else if(iTarget == 16){//뱅커 언더
        return Enum.EBetType.BankerUnder;
    }
    else if(iTarget == 17){//뱅커 오버
        return Enum.EBetType.BankerOver;
    }
    
    return Enum.EBetType.LiveCasino;
}

exports.GetGameCode = (strTableID, iTarget) =>
{
    if ( strTableID == 2 )
    {
        switch ( iTarget )
        {
            case 18:
            case 19:
            case 16:
            case 17:
                return Enum.EGameCode.UnderOver;
        }
    }

    return Enum.EGameCode.Baccarat;
}


exports.GetCards = (strDetails) => {
    // BACCARAT:WINS;1-20000:CARDS= P:6$1, B:10$4, P:12$2, B:3$2, P:0$0, B:2$1 >PLAYER // 앞숫자, 뒤 카드 종류
    // BACCARAT:WINS;1-20000:CARDS= P:6$1, B:10$4, P:12$2, B:3$2, P:0$0, B:2$1 >PLAYER => 앞에 숫자, 뒤에 카드 종류
    // {'P':[{'C':'KC', 'N':'10'},{'C':'Ah','N':'11'},{'C':'9c','N':'9'}],'B':[{'C':'Qd','N':'10'},{'C':'6s','N':'6'}]} 형태로 만듬
    try {
        let blist = [];
        let plist = [];

        const details = strDetails.replace(' ', '');

        const cardsMatch = details.split('CARDS=');
        const cardsString = cardsMatch[1].replace('>BANKER','').replace('>PLAYER', '');

        const cards = cardsString.split(',');
        {
            for (let i in cards) {
                let card = cards[i].split(':');
                let pb = card[0];
                let value = card[1].split('$');
                let c = '';
                if (value[1] == '0') {
                    c = 'C'
                } else if (value[1] == '1') {
                    c = 'S'
                } else if (value[1] == '2') {
                    c = 'H'
                } else if (value[1] == '3') {
                    c = 'D'
                }

                if (pb == 'P') {
                    plist.push({
                        'C':`${c}`,
                        'N':`${value[0]}`
                    });
                } else if (pb == 'B') {
                    blist.push({
                        'C':`${c}`,
                        'N':`${value[0]}`
                    });
                }
            }
        }
        if (blist.length > 0 && plist.length > 0) {
            return {'B': blist, 'P': plist};
        }
    } catch (err) {
    }
    return null;
}

exports.GetBets = (list) => {
    // BACCARAT:WINS;1-20000:CARDS= P:6$1, B:10$4, P:12$2, B:3$2, P:0$0, B:2$1 >PLAYER => 앞에 숫자, 뒤에 카드 종류
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