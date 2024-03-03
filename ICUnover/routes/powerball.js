const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const db = require('../db');

const EOddEven = Object.freeze({"Odd":0, "Even":1});
const EUnderOver = Object.freeze({"Under":0, "Over":1});
const EBigSmall = Object.freeze({"Big":0, "Small":1});

const IBetting = require('../helpers/IBetting')

const ISocketList = require('../socketlist');
const user = require('../models/user');
const e = require('connect-flash');

const {Op}= require('sequelize');

let socket_list = new ISocketList();

let UpdateUserPageCash = (strID, iCash) => {
    for ( let i in global.socket_list )
    {
        if ( global.socket_list[i].strID == strID )
        {
            global.socket_list[i].emit('UpdateCash', parseInt(iCash));
        }
    }
}

// 배당 비율 : [0]: 1.93, [1]:1.95
const cPBGOdds = [
    [
        1.93,//파워볼 홀
        1.93,//파워볼 짝
        1.93,//파워볼 오버
        1.93,//파워볼 언더
        3.10,//파워볼 홀오버
        4.10,//파워볼 홀언더
        4.10,//파워볼 짝오버
        3.10,//파워볼 짝언더

        1.93, //일반볼 홀
        1.93,//일반볼 짝
        1.93,//일반볼 오버
        1.93,//일반볼 언더

        2.24,//일반볼 대
        2.23,//일반볼 중
        2.24,//일반볼 소

        3.72,//일반볼 홀오버
        3.72,//일반볼 홀언더
        3.72,//일반볼 짝오버
        3.72,//일반볼 짝언더
        
        4.40,//일반볼 홀대
        4.40,//일반볼 짝대

        4.20,//일반볼 홀중
        4.20,//일반볼 짝중

        4.40,//일반볼 홀소
        4.40,//일반볼 짝소

        7.10,//홀+언더+P홀
        7.10,//홀+언더+P짝
        7.10,//홀+오버+P홀
        7.10,//홀+오버+P짝
        7.10,//짝+언더+P홀
        7.10,//짝+언더+P짝
        7.10,//짝+오버+P홀
        7.10,//짝+오버+P짝
    ],
    [
        1.95,//파워볼 홀
        1.95,//파워볼 짝
        1.95,//파워볼 오버
        1.95,//파워볼 언더
        3.10,//파워볼 홀오버
        4.10,//파워볼 홀언더
        4.10,//파워볼 짝오버
        3.10,//파워볼 짝언더

        1.95, //일반볼 홀
        1.95,//일반볼 짝
        1.95,//일반볼 오버
        1.95,//일반볼 언더

        2.73,//일반볼 대
        2.43,//일반볼 중
        2.72,//일반볼 소

        3.72,//일반볼 홀오버
        3.72,//일반볼 홀언더
        3.72,//일반볼 짝오버
        3.72,//일반볼 짝언더
        
        4.40,//일반볼 홀대
        4.40,//일반볼 짝대

        4.20,//일반볼 홀중
        4.20,//일반볼 짝중

        4.40,//일반볼 홀소
        4.40,//일반볼 짝소

        7.10,//홀+언더+P홀
        7.10,//홀+언더+P짝
        7.10,//홀+오버+P홀
        7.10,//홀+오버+P짝
        7.10,//짝+언더+P홀
        7.10,//짝+언더+P짝
        7.10,//짝+오버+P홀
        7.10,//짝+오버+P짝
    ],
];

const GetOddEven = (string) => {
    if ( string == '홀' )
        return EOddEven.Odd;
    else
        return EOddEven.Even;
}

const GetUnderOver = (string) => {
    if ( string == '언더' )
        return EUnderOver.Under;
    else
        return EUnderOver.Over;
}

const GetBigSmall = (string) => {
    if ( string =='대' )
        return EBigSmall.Big;
    else
        return EBigSmall.Small;
}

let GetBettingTime = () => {
    var now = new Date(); //현재시간을 구한다. 
    var end = new Date(now.getFullYear(),now.getMonth(),now.getDate(),24,0,0,0);

// //오늘날짜의 저녁 9시 - 종료시간기준
//     var open = new Date(now.getFullYear(),now.getMonth(),now.getDate(),09,00,00);

// //오늘날짜의 오전9시 - 오픈시간기준
  
     var nt = now.getTime(); // 현재의 시간만 가져온다
     //var ot = open.getTime(); // 오픈시간만 가져온다
     var et = end.getTime(); // 종료시간만 가져온다.
  
//    if(nt<ot){ //현재시간이 오픈시간보다 이르면 오픈시간까지의 남은 시간을 구한다. 
//      $(".time").fadeIn();
//      $("p.time-title").html("금일 오픈까지 남은 시간");

//      sec =parseInt(ot - nt) / 1000;
//      day  = parseInt(sec/60/60/24);
//      sec = (sec - (day * 60 * 60 * 24));
//      hour = parseInt(sec/60/60);
//      sec = (sec - (hour*60*60));
//      min = parseInt(sec/60);
//      sec = parseInt(sec-(min*60));
//      if(hour<10){hour="0"+hour;}
//      if(min<10){min="0"+min;}
//      if(sec<10){sec="0"+sec;}

//      return hour+min+sec;
//     //   $(".hours").html(hour);
//     //   $(".minutes").html(min);
//     //   $(".seconds").html(sec);
//    } else if(nt>et){ //현재시간이 종료시간보다 크면
//     // $("p.time-title").html("금일 마감");
//     // $(".time").fadeOut();
//    }else { //현재시간이 오픈시간보다 늦고 마감시간보다 이르면 마감시간까지 남은 시간을 구한다. 
//     //    $(".time").fadeIn();
//     //  $("p.time-title").html("금일 마감까지 남은 시간");
     let sec =parseInt(et - nt) / 1000;

     let temp = parseInt(sec % 300);

     return temp;

     let min = temp / 60;
     let sec2 = temp % 60;

    //  day  = parseInt(sec/60/60/24);
    //  sec = (sec - (day * 60 * 60 * 24));
    //  hour = parseInt(sec/60/60);
    //  sec = (sec - (hour*60*60));
    //  min = parseInt(sec/60);
    //  sec = parseInt(sec-(min*60));
    //  if(hour<10){hour="0"+hour;}
    //  if(min<10){min="0"+min;}
    //  if(sec<10){sec="0"+sec;}
    let value = `${sec2}`;
    return sec2;

     //return `${min} : ${sec}`;
    //   $(".hours").html(hour);
    //   $(".minutes").html(min);
    //   $(".seconds").html(sec);
   //}
}

//  every seconds
// cron.schedule('* * * * * *', async () => {

//     const response = await axios.get('http://ntry.com/data/json/games/powerball/result.json');
//     //console.log(response.data);

//     const cRound = response.data.date_round;
//     const cIndex = response.data.times;
//     const cBalls = response.data.ball;
//     const cNormalBallSection = response.data.def_ball_section;
//     const cNormalBallSum = response.data.def_ball_sum;
//     const cNormalBallOE = response.data.def_ball_oe;
//     const cNormalBallBS = response.data.def_ball_size;
//     const cNormalBallUO = response.data.def_ball_unover;
//     const cPowerBallOE = response.data.pow_ball_oe;
//     const cPowerBallUO = response.data.pow_ball_unover;

//     // console.log(`cRound:${cRound}(${cIndex}), cBalls : ${cBalls}, Normal : ${cNormalBallSection}, ${cNormalBallSum}, ${cNormalBallOE},
//     // ${cNormalBallBS}, ${cNormalBallUO}, Power : ${cPowerBallOE}, ${cPowerBallUO}`);

//     //console.log(cBalls);

//     // const crawling = await axios.get('http://ntry.com/scores/powerball/live.php');
//     // console.log(crawling);

//     // const $ = cheerio.load(crawling.data);
//     // //let string = $.find('span#countdown_clock').text();
//     // let string = $("#countdown_clock").text();
//     // console.log(string);

//     //let time = new Date();
//     let time = GetBettingTime();
//     console.log(time);
// });

class IRecord
{
    constructor ()
    {
        this.strDate = '';
        this.strTime = '';
        this.iRound = '';
        this.iDailyRound = '';
        this.strNormalOddEven    = '';
        this.strPowerOddEven = '';
        this.strNormalUnderOver = '';
        this.strPowerUnderOver = '';
        this.strPeriod = '';
        this.iPowerball = '';
        this.strNumbers = '';
        this.iSum = '';
        this.strSumPeriod = '';
        this.strPowerballSumPeriod = '';
    }
}

let gRecord = new IRecord();
let iRemainedTime = 0;
let iDelayTime = 0;
let bEnableBetting = false;

let GetPBTargetType = (target) => {

    switch(parseInt(target))
    {
    case 0: //파워볼 홀
        return 0;
    case 1: //파워볼 짝
        return 0;
    case 2: //파워볼 오버
        return 0;
    case 3: //파워볼 언더
        return 0;
    case 4: //파워볼 홀오버
        return 1;
    case 5: //파워볼 홀언더
        return 1;
    case 6: //파워볼 짝오버
        return 1;
    case 7: //파워볼 짝언더
        return 1;
    case 8: //일반볼 홀
        return 0;
    case 9: //일반볼 짝
        return 0;
    case 10: //일반볼 오버
        return 0;
    case 11: //일반볼 언더
        return 0;
    case 12: //일반볼 대
        return 0;
    case 13: //일반볼 중
        return 0;
    case 14: //일반볼 소
        return 0;
    case 15: //일반볼 홀오버
        return 1;
    case 16: //일반볼 홀언더
        return 1;
    case 17: //일반볼 짝오버
        return 1;
    case 18: //일반볼 짝언더
        return 1;
    case 19: //일반볼 홀대
        return 1;
    case 20: //일반볼 짝대
        return 1;
    case 21: //일반볼 홀중
        return 1;
    case 22: //일반볼 짝중
        return 1;
    case 23: //일반볼 홀소
        return 1;
    case 24: //일반볼 짝소
        return 1;
    case 25://홀+언더+P홀
        return 2;
    case 26://홀+언더+P짝
        return 2;
    case 27://홀+오버+P홀
        return 2;
    case 28://홀+오버+P짝
        return 2;
    case 29://짝+언더+P홀
        return 2;
    case 30://짝+언더+P짝
        return 2;
    case 31://짝+오버+P홀
        return 2;
    case 32://짝+오버+P짝
        return 2;
    }
}

let GetPBGResult = async () => {

    const response = await axios.get('https://www.powerballgame.co.kr/json/powerball.json');
    //console.log(response.data);

    let object = new IRecord();
    object.strDate = response.data.date;
    object.strTime = response.data.time;
    object.iRound = response.data.round;
    object.iDailyRound = response.data.todayRound;
    object.strNormalOddEven    = response.data.oddEven_number;
    object.strPowerOddEven = response.data.oddEven_powerball;
    object.strNormalUnderOver = response.data.underOver_number;
    object.strPowerUnderOver = response.data.underOver_powerball;
    object.strPeriod = response.data.period;
    object.iPowerball = response.data.powerball;
    object.strNumbers = response.data.number;
    object.iSum = response.data.numberSum;
    object.strSumPeriod = response.data.numberSumPeriod;
    object.strPowerballSumPeriod = response.data.powerballPeriod;

    const str = "123123123"

    console.log(object.strNumbers.match(/.{1,2}/g));

    return object;
}

let IsWinPBG = (target, result) => {

    console.log(`IsWinPBG : ${target}`);
    console.log(result);

    switch(target)
    {
    case 0: //파워볼 홀
        console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'odd')
            return true;
        break;
    case 1: //파워볼 짝
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'even')
            return true;
        break;
    case 2: //파워볼 오버
    console.log(`target : ${target}, ${result.strPowerUnderOver}`);
        if ( result.strPowerUnderOver == 'over')
            return true;
        break;
    case 3: //파워볼 언더
    console.log(`target : ${target}, ${result.strPowerUnderOver}`);
        if ( result.strPowerUnderOver == 'under')
            return true;
        break;
    case 4: //파워볼 홀오버
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'odd' && result.strPowerUnderOver == 'over' )
            return true;
        break;
    case 5: //파워볼 홀언더
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'odd' && result.strPowerUnderOver == 'under' )
            return true;
        break;
    case 6: //파워볼 짝오버
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'even' && result.strPowerUnderOver == 'over' )
            return true;
        break;
    case 7: //파워볼 짝언더
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPowerOddEven == 'even' && result.strPowerUnderOver == 'under' )
            return true;
        break;

    case 8: //일반볼 홀
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalOddEven == 'odd')
            return true;
        break;
    case 9: //일반볼 짝
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalOddEven == 'even')
            return true;
        break;
    case 10: //일반볼 오버
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalUnderOver == 'over')
            return true;    
        break;
    case 11: //일반볼 언더
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strNormalUnderOver == 'under')
            return true;    
        break;
    case 12: //일반볼 대
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPeriod == 'big')
            return true;
        break;
    case 13: //일반볼 중
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPeriod != 'big' && result.strPeriod != 'small' )
            return true;
        break;
    case 14: //일반볼 소
    console.log(`target : ${target}, ${result.strPowerOddEven}`);
        if ( result.strPeriod == 'small')
            return true;
        break;

    case 15: //일반볼 홀오버
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'over')
            return true;
        break;
    case 16: //일반볼 홀언더
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'under')
            return true;
        break;
    case 17: //일반볼 짝오버
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'over')
            return true;
        break;
    case 18: //일반볼 짝언더
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'under')
            return true;
        break;

    case 19: //일반볼 홀대
        if ( result.strNormalOddEven == 'odd' && result.strPeriod == 'big')
            return true;
        break;
    case 20: //일반볼 짝대
        if ( result.strNormalOddEven == 'even' && result.strPeriod == 'big')
            return true;
        break;
    case 21: //일반볼 홀중
        if ( result.strNormalOddEven == 'odd' && result.strPeriod != 'big' && result.strPeriod != 'small')
            return true;
        break;
    case 22: //일반볼 짝중
        if ( result.strNormalOddEven == 'even' && result.strPeriod != 'big' && result.strPeriod != 'small')
            return true;
        break;
    case 23: //일반볼 홀소
        if ( result.strNormalOddEven == 'odd' && result.strPeriod == 'small')
            return true;
        break;
    case 24: //일반볼 짝소
        if ( result.strNormalOddEven == 'even' && result.strPeriod == 'small')
            return true;
        break;
    case 25: //홀+언더+P홀
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'odd')
            return true;
        break;

    case 26: //홀+언더+P짝
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'even')
            return true;
        break;
    case 27: //홀+오버+P홀
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'odd')
            return true;
        break;
    case 28: //홀+오버+P짝
        if ( result.strNormalOddEven == 'odd' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'even')
            return true;
        break;
    case 29: //짝+언더+P홀
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'odd')
            return true;
        break;
    case 30: //짝+언더+P짝
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'under' && result.strPowerOddEven == 'even')
            return true;
        break;
    case 31: //짝+오버+P홀
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'odd')
            return true;
        break;
    case 32: //짝+오버+P짝
        if ( result.strNormalOddEven == 'even' && result.strNormalUnderOver == 'over' && result.strPowerOddEven == 'even')
            return true;
        break;
    }
    return false;
}

let FindListUser = (user, list) => {

    for ( let i in list )
    {
        if ( list[i].strID == strID )
        {

        }
    }
}

setInterval(async () => {
    if ( gRecord.iRound == '' )
    {
        gRecord = await GetPBGResult();        

        iRemainedTime = GetBettingTime();
        console.log('first');
    }
    else // 당첨 처리
    {
        if ( iRemainedTime > 0 )
        {
            -- iRemainedTime;
        }

        if ( iDelayTime > 0 )
        {
            -- iDelayTime;
        }

        if ( iRemainedTime <= 0 )
        {
            let recent = await GetPBGResult();
            if ( recent.iRound != gRecord.iRound )
            {
                console.log(`############################################################# round changed to ${recent.iRound}, current is ${gRecord.iRound}`);

                iRemainedTime = GetBettingTime();
                iDelayTime = 10;

                for ( let i = 0; i < socket_list.GetLength(); ++ i)
                {
                    socket_list.GetSocket(i).emit('Time', iRemainedTime, iDelayTime, gRecord.iRound);
                }

                gRecord = recent;
                //console.log('change');
                console.log(`RoundChange ${recent.iRound}`);

                //if ()
                let listBetting = await db.BettingRecords.findAll({
                    where:
                    {
                        strRound:recent.iRound,
                        strVender:'PBGPowerball',
                        iComplete:0,
                    }
                });
                console.log(`Betting length : ${listBetting.length}`);

                console.log(recent.iRound);

                let listUser = [];

                for ( let i in listBetting )
                {
                    console.log(`@@@@@@@@@@@ => bettinglist : ${listBetting[i].iComplete}`);
                    // if ( listBetting[i].iComplete != 0 )
                    //     continue;

                    const bWin = IsWinPBG(parseInt(listBetting[i].iTarget), recent);
                    if ( true == bWin )
                    {

                        console.log(`################################################################################################# WIN`);
                        const cTarget = parseInt(listBetting[i].iTarget);
                        const cPowerballCode = 300;
                        const cWin = parseInt(listBetting[i].iBetting) * cPBGOdds[parseInt(listBetting[i].strTableID)][cTarget];
                        console.log(`배팅금액 : ${listBetting[i].iBetting}`);
                        console.log(`파워볼 배당 설정 : [0]: 1.93, [1]:1.95 : ${listBetting[i].strTableID}`);
                        console.log(`파워볼 배당 확률 인덱스 : ${cTarget}`);
                        console.log(`파워볼 배당 비율 : ${cPBGOdds[parseInt(listBetting[i].strTableID)][cTarget]}`);
                        console.log(`당첨금 : ${cWin}`);
                        // //await IBetting.ProcessWin('http://165.22.102.70:3030', listBetting[i].iTransactionID, cWin, 0, cPowerballCode, listBetting[i].strGroupID);
                        // await IBetting.ProcessWin('', listBetting[i].iTransactionID, cWin, cPowerballCode, cTarget, listBetting[i].strID);

                        await IBetting.ProcessCreatePBWin('', 300, 'PBGPowerball',
                                                            listBetting[i].strRound, 
                                                            listBetting[i].strTableID, 
                                                            listBetting[i].iTarget, 
                                                            cWin, 
                                                            listBetting[i].iPreviousCash, 
                                                            listBetting[i].iAfterCash, 
                                                            listBetting[i].iTransactionID, 
                                                            listBetting[i].strID, 
                                                            listBetting[i].strGroupID,8,
                                                            listBetting[i].strNickname);

                        let dbuser = await db.Users.findOne({where:{strID:listBetting[i].strID}});
                        if ( dbuser != null )
                        {
                            console.log(`############################ Update DB for Win Cash ${cWin}, UserCash : ${dbuser.iCash}`);

                            //await dbuser.update({iCash:dbuser.iCash+cWin});
                            UpdateUserPageCash(listBetting[i].strID, dbuser.iCash);
                        }

                    }
                    //await IBetting.ProcessEnd('http://165.22.102.70:3030', listBetting[i].iTransactionID, 0, listBetting[i].strID);
                    await IBetting.ProcessEnd(listBetting[i].iTransactionID);

                }

            }
            else if ( iRemainedTime == 0 )
            {
                iRemainedTime = GetBettingTime();

                for ( let i = 0; i < socket_list.GetLength(); ++ i)
                {
                    socket_list.GetSocket(i).emit('Time', iRemainedTime, iDelayTime, gRecord.iRound);
                }
            }
        }
    }
}, 1000);

router.get('/', async (req, res) => {

    let isLogin = 0;
    if ( req.user != undefined )
        isLogin = 1;
    
    if ( isLogin == 0 )
        res.redirect('/');
    else
    {
        const cType = req.user.strPBOptionCode[0];

        res.render('powerball', {iLayout:1, user:req.user, odds:cPBGOdds[cType]});
    }
});

router.post('/request_bettingrecord', async (req, res) => {

    let listBetting = await db.BettingRecords.findAll({
        limit:50,
        where:
        {
            strID:req.user.strID,
            strVender:'PBGPowerball',
        },
        order:[['createdAt','DESC']]})

    res.send({result:'OK', data:listBetting});

});

router.post('/request_roundbettingrecord', async (req, res) => {

    console.log(`##### /request_roundbettingrecord`);
    console.log(req.body);

    console.log(`request round first ${gRecord.iRound}`);
    const cRoundInProgress = parseInt(gRecord.iRound)+1;
    let listBettingCurrent = await db.BettingRecords.findAll({
        where:
        {
            strID:req.user.strID,
            strVender:'PBGPowerball',
            strRound:cRoundInProgress,
            // iComplete:{[Op.or]:[0,1]},
        },
        order:[['createdAt','DESC']]})

    if ( listBettingCurrent.length > 0 )
    {
        res.send({result:'OK', current:true, data:listBettingCurrent});
        return;
    }

    let aRound = req.body.iRound;
    if ( req.body.iRound == -1 )
    {
        aRound = cRoundInProgress-1;
    }
    console.log(`request round ${aRound}`);

    let listBetting = await db.BettingRecords.findAll({
        where:
        {
            strID:req.user.strID,
            strVender:'PBGPowerball',
            strRound:aRound,
            // iComplete:{[Op.or]:[0,1]},
        },
        order:[['createdAt','DESC']]})

    res.send({result:'OK', current:false, data:listBetting});

});

router.post('/request_bettingcancel', async (req, res) => {

    console.log(`/request_bettingcancel`);
    console.log(req.body);

    await IBetting.ProcessCancel('', req.body.iTransactionID, 300, req.user.strID);
    let dbuser = await db.Users.findOne({where:{strNickname:req.user.strNickname}});
    console.log(`############################ Update DB for Betting Cancel UserCash : ${dbuser.iCash}`);

    res.send({result:'OK', cash:dbuser.iCash});
});

global.io.on('connection', (socket) => {

    socket.id = Math.random();
    console.log('socket connection');

    socket.on('RequestLogin', (strID) => {

        console.log(`RequestLogin, ${strID}`);

        socket.emit('Time', iRemainedTime, iDelayTime, gRecord.iRound);

        socket_list.Add(socket);

    });

    socket.on('disconnect', () => {

        socket_list.Remove(socket);

        console.log(`OnDisconnected Socket Length : ${socket_list.GetLength()}`);
    })

});

router.post('/bettinggroup', async (req, res) => {

    console.log(`/bettingroup`);
    console.log(req.body);

    let list = req.body.listTarget.split(',');
    console.log(list);

    let iTotalRequestBet = parseInt(req.body.iChip) * list.length;

    if ( req.user == null || req.user == undefined )
    {
        res.redirect('/account/login');
        return;
    }

    let dbuser = await db.Users.findOne({where:{strNickname:req.user.strNickname}});
    if ( dbuser == null )
    {
        res.send({result:'Error'});
        return;
    }

    let listRoundBetting = await db.BettingRecords.findAll({where:{
        strID:req.user.strID,
        strRound:req.body.iRound,
        iComplete:0,
    }});
    let iTotalRoundBet = 0;
    for ( let i in listRoundBetting )
    {
        iTotalRoundBet += parseInt(listRoundBetting[i].iBetting);
    }

    const cLimit = [req.user.iPBSingleLimit, req.user.iPBDoubleLimit, req.user.iPBTripleLimit];
    for ( let i in list )
    {
        const cPoleType = GetPBTargetType(list[i]);

        let iAmount = GetBetAmount(list[i], listRoundBetting);

        if ( iAmount + parseInt(req.body.iChip) > cLimit[cPoleType] )
        {
            let iLimit = cLimit[cPoleType] - iAmount;

            res.send({result:'Error', code:'OverBetAccount', amount:iLimit});
            return;
        }

        // if ( cPoleType == 0 && req.user.iPBSingleLimit < parseInt(req.body.iChip))
        // {
        //     res.send({result:'Error', code:'OverBetAccount', amount:req.user.iPBSingleLimit});
        //     return;
        // }
        // else if ( cPoleType == 1 && req.user.iPBDoubleLimit < parseInt(req.body.iChip))
        // {
        //     res.send({result:'Error', code:'OverBetAccount', amount:req.user.iPBDoubleLimit});
        //     return;
        // }
        // else if ( cPoleType == 2 && req.user.iPBTripleLimit < parseInt(req.body.iChip))
        // {
        //     res.send({result:'Error', code:'OverBetAccount', amount:req.user.iPBTripleLimit});
        //     return;
        // }
        
        const iTotalAmount = iTotalRoundBet + iTotalRequestBet;
        if ( dbuser.iPBLimit < iTotalAmount )
        {
            res.send({result:'Error', code:'OverBet'});
            return;
        }
    }

    if ( dbuser.iCash < iTotalRequestBet )
    {
        res.send({result:'Error', code:'NotEnough'});
        return;
    }

    const cBettingAmount = parseInt(req.body.iChip);

    //await dbuser.update({iCash:dbuser.iCash-iTotalRequestBet});

    console.log(`############################ Update DB for Betting Cash ${iTotalRequestBet}, UserCash : ${dbuser.iCash}`);

    let iCurrentCash = dbuser.iCash;

    for ( let i in list )
    {
        const iTransactionID = Math.floor(Math.random()*100000000);

        await IBetting.ProcessCreate('', 300, 'PBGPowerball', req.body.iRound, req.body.cType, list[i], cBettingAmount, iCurrentCash, iCurrentCash-cBettingAmount, iTransactionID, req.user.strID, req.user.strGroupID, req.user.iClass, req.user.strNickname, 0);

        UpdateUserPageCash(req.user.strID,iCurrentCash-cBettingAmount);

        iCurrentCash -= cBettingAmount;
    }

    res.send({result:'OK', cash:dbuser.iCash-iTotalRequestBet});
});

let GetBetAmount = (target, list) => {

    let iAccountAmount = 0;

    for ( let i in list )
    {
        if ( list[i].iTarget == target )
            iAccountAmount += parseInt(list[i].iBetting);
    }
    return iAccountAmount;
}

module.exports = router;