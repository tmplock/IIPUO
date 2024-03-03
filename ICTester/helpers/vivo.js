const axios = require('axios');
const md5 = require('md5');
var convert = require('xml-js');
//var xml = require('fs').readFileSync('./testscenario.xml', 'utf8');


let IAccount = 
{
    cVender: 'VIVO',
    cCurrency: 'KRW',
    cGameURL : 'http://games.vivogaming.com',
    cServerID : 6401748,
    cOperatorID : 3004307,
    cPassKey : "7f1c5d",
    cApplication : "lobby",
    cLanguage : "KR",
    cGameType : 'LIVE'
};


exports.CalculateMD5Hash = (value) => {

    return md5(value);
}


exports.Balance = () =>
{
    const cDate = new Date().toString();
    let cAddress = `https://iipgame.com/vivo/authenticate`;
    // let objectAxios = {
    //     account:'iip1-user2',
    //     eventTime:new Date(),
    //     gamehall:'motivation-t',
    //     gamecode:'cq9',
    //     roundid:9999999,
    //     amount:1000,
    //     mtcode:cDate
    // };

    let objectAxios = {
        token:'01754014e51b17fd9e9ede83fc67bfa5',
        hash:'',
    };
    objectAxios.hash = this.CalculateMD5Hash(objectAxios.token + IAccount.cPassKey);
    cAddress += `?token=${objectAxios.token}&hash=${objectAxios.hash}`;

    console.log(cAddress);

    axios.get(cAddress)
    .then((response)=> {
        //res.send({result:'OK', reason:'OK'});

        console.log(`######`);
        console.log(response.data);

        var result = convert.xml2json(response.data, {compact: true, spaces: 4});
        let test = JSON.parse(result);
        // console.log(result);
        // console.log(test);
        // console.log(test.VGSSYSTEM.RESPONSE.BALANCE._text);


        return test.VGSSYSTEM.RESPONSE.BALANCE._text;
    })
    .catch((error)=> {
        //res.send({result:'Error', reason:'OK'});

        console.log('error');
        //console.log(error);

        return 0;
    });

}

exports.Bet = (amount, userId, roundId, bWin) =>
{
    const cDate = (new Date()).getTime();
    let cAddress = `https://iipgame.com/vivo/changebalance`;
    let price = parseInt(amount)*2;
    let objectAxios = {
        userId:`iip1-${userId}`,
        Amount: amount,
        TransactionID:`${roundId}_${cDate}`,
        TrnType:'BET',
        TrnDescription:'2',
        roundId:`testround${roundId}`,
        gameId:'2',
        History:bWin ? `BACCARAT:WINS;1-${amount}:CARDS=P:10$4,B:12$4,P:6$4,B:10$3,P:0$0,B:14$1>PLAYER` : `1-${amount}`,
        isRoundFinished:'false',
        hash:'',
    };
    //BACCARAT:WINS;1-600000,18-75000:CARDS=P:4$2,B:4$2,P:3$2,B:2$1,P:0$0,B:0$0>PLAYER

    objectAxios.hash = this.CalculateMD5Hash(objectAxios.userId+objectAxios.Amount+objectAxios.TrnType+objectAxios.TrnDescription+objectAxios.roundId+objectAxios.gameId+objectAxios.History + IAccount.cPassKey);

    cAddress += `?userId=${objectAxios.userId}&Amount=${objectAxios.Amount}&TransactionID=${objectAxios.TransactionID}&TrnType=${objectAxios.TrnType}&TrnDescription=${objectAxios.TrnDescription}&roundId=${objectAxios.roundId}&gameId=${objectAxios.gameId}&History=${objectAxios.History}&isRoundFinished=${objectAxios.isRoundFinished}&hash=${objectAxios.hash}`;


    axios.get(cAddress)
    .then((response)=> {
        //res.send({result:'OK', reason:'OK'});

        console.log(response.data);
    })
    .catch((error)=> {
        //res.send({result:'Error', reason:'OK'});

        console.log('error');
    });

}

exports.Win = (amount, userId, roundId) => {
    const cDate = (new Date()).getTime();
    let cAddress = `https://iipgame.com/vivo/changebalance`;
    let price = parseInt(amount)*2;
    let objectAxios = {
        userId:`iip1-${userId}`,
        Amount: price,
        TransactionID:`${roundId}_${cDate}`,
        TrnType:'WIN',
        TrnDescription:'2',
        roundId:`testround${roundId}`,
        gameId:'2',
        History:`BACCARAT:WINS;1-${price}:CARDS=P:10$4,B:12$4,P:6$4,B:10$3,P:0$0,B:14$1>PLAYER`,
        isRoundFinished:'false',
        hash:'',
    };
    //BACCARAT:WINS;1-600000,18-75000:CARDS=P:4$2,B:4$2,P:3$2,B:2$1,P:0$0,B:0$0>PLAYER

    objectAxios.hash = this.CalculateMD5Hash(objectAxios.userId+objectAxios.Amount+objectAxios.TrnType+objectAxios.TrnDescription+objectAxios.roundId+objectAxios.gameId+objectAxios.History + IAccount.cPassKey);

    cAddress += `?userId=${objectAxios.userId}&Amount=${objectAxios.Amount}&TransactionID=${objectAxios.TransactionID}&TrnType=${objectAxios.TrnType}&TrnDescription=${objectAxios.TrnDescription}&roundId=${objectAxios.roundId}&gameId=${objectAxios.gameId}&History=${objectAxios.History}&isRoundFinished=${objectAxios.isRoundFinished}&hash=${objectAxios.hash}`;


    axios.get(cAddress)
    .then((response)=> {
        //res.send({result:'OK', reason:'OK'});

        console.log(response.data);
    })
    .catch((error)=> {
        //res.send({result:'Error', reason:'OK'});

        console.log('error');
    });
}
