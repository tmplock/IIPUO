'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const VIVO = require('./helpers/vivo');
const EZUGI = require('./helpers/ezugi');
const moment = require("moment");
const db = require("./db");
const {Op}= require('sequelize');

//VIVO.Balance();

app.get('/', (req, res) => {
    // res.redirect('/router');
    res.render('index4');
})
app.get('/index2', (req, res) => {
    // res.redirect('/router');
    res.render('index2');
})
app.get('/index3', (req, res) => {
    // res.redirect('/router');
    res.render('index3');
})
app.get('/index4', (req, res) => {
    // res.redirect('/router');
    res.render('index4');
})

app.get('/bet', (req, res) => {

    Bet();

    res.send('Welcome');
});

app.get('/win', (req, res) => {

    
    Win();

    res.send('Welcome');
})

const cPort = 3002;
server.listen(cPort, () => {
    console.log(`IIPTest Server is started At ${cPort}`);
});

let bEnableAction = false;
let iNumUser = 1;

app.post('/request_action', (req, res) => {

    console.log('/request_action');
    console.log(req.body);

    for ( let i = 0; i < parseInt(iNumUser); ++ i )
    {
        // if ( VIVO.Balance() != 0 )
        // {
        //     VIVO.Bet();
        //     if ( Math.floor(Math.random()*2) == 0 )
        //         VIVO.Win();
        //
        // }
    }

    // if ( req.body.strAction == 'on' )
    // {
    //     bEnableAction = true;
    // }
    // else
    //     bEnableAction = false;
    //
    //     iNumUser = req.body.iNumUser;

    res.send({result:'OK', msg: `${iNumUser}번 호출 완료`});
});

app.post('/request_action_once', async (req, res) => {

    console.log(`/request_action_once ${Date.now()}`);
    console.log(req.body);
    let gameType = req.body.gameType ?? '';
    let count = parseInt(req.body.count) ?? 0;
    let win = parseInt(req.body.win) ?? 0;
    let type = req.body.type ?? '';
    let strIds = req.body.strIds ?? '';
    let amount = 1000;
    if (count == 0 || type == '') {
        res.send({result: false, msg: '필수값이 없음'});
        return;
    }

    if (strIds == '') {
        strIds = 'test';
    }

    let userIds = strIds.replaceAll(' ', '').split(',');

    let winSet = makeWinNumberSet(parseInt(win), count);
    console.log(`winSet : ${winSet}`);

    let errMsg = '';
    let success = 0;
    let winCount = 0;

    for (let i = 0; i < parseInt(count); i++) {
        console.log(`${i} 쏘기`);
        if (gameType == 'VIVO') {
            if (VIVO.Balance() != 0) {
                for (let j in userIds) {
                    let userId = userIds[j];
                    if (type == 'random') {
                        amount = getRandomAmount(1000, 100000);
                    }
                    let user = await db.Users.findOne({
                        where: {
                            strID: userId
                        }
                    });
                    // 보유 캐시보다 많을 경우에만 실행
                    let roundId = (new Date()).getTime();
                    if (user != null && parseInt(user.iCash) >= amount) {
                        const bWin = winSet.has(i);
                        console.log(`${i} 배팅 콜`);
                        VIVO.Bet(amount, userId, roundId, bWin);
                        console.log(`${i} 배팅 완료`);
                        if (bWin) {
                            console.log(`${i} 승리 콜`);
                            VIVO.Win(amount, userId, roundId);
                            console.log(`${i} 승리 완료`);
                            winCount++;
                        }
                    }
                }
            }
        } else if (gameType == 'EZUGI') {
            for (let j in userIds) {
                let userId = userIds[j];
                if (type == 'random') {
                    amount = getRandomAmount(1000, 100000);
                }

                let user = await db.Users.findOne({
                    where: {
                        strID: userId,
                        iCash: {
                            [Op.gt]:parseInt(amount)
                        }
                    },
                });

                // 보유 캐시보다 많을 경우에만 실행
                let roundId = `${(new Date()).getTime()}`;
                if (user != null && parseInt(user.iCash) >= amount) {
                    const bWin = winSet.has(i);
                    console.log(`${i} 배팅 콜`);
                    let result = await EZUGI.Bet(userId, amount, roundId, `${roundId}-${i}`);
                    if (result.result == false) {
                        console.log(`${i} 보유캐시 부족`);
                        errMsg = '보유캐시 부족';
                        break;
                    }
                    console.log(`${i} 배팅 완료`);
                    success++;
                    if (bWin) {
                        console.log(`${i} 승리 콜`);
                        let winAmount = parseInt(amount) * 2;
                        await EZUGI.Win(userId, winAmount, roundId, `${roundId}-${i}`);
                        console.log(`${i} 승리 완료`);
                        winCount++;
                    } else {
                        console.log(`${i} 패 콜`);
                        await EZUGI.Win(userId, 0, roundId, `${roundId}-${i}`);
                        console.log(`${i} 승리 완료`);
                    }
                } else {
                    console.log(`${i} 보유캐시 부족`);
                    errMsg = '보유캐시 부족';
                    break;
                }
            }
            if (errMsg != '') {
                break;
            }
        }
    }

    let date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    res.send({result: true, msg: `${success}번 배팅 완료`, date: `${date}`, gameType: gameType, errMsg:errMsg, success: success, winCount: winCount});
});

function makeWinNumberSet(number, max) {
    const numbers = new Set();

    while (numbers.size < number) {
        const randomNumber = Math.floor(Math.random() * (max-1)); // 0에서 100 사이의 난수 생성
        if (!numbers.has(randomNumber)) {
            numbers.add(randomNumber);
        }
    }
    return numbers;
}

function makeRandomAmount(min, max) {
    const numbers = new Set();

    while (numbers.size < number) {
        const randomNumber = Math.floor(Math.random() * max); // 0에서 100 사이의 난수 생성
        numbers.add(randomNumber);
    }
    return number;
}

function getRandomAmount(amount1, amount2) {
    const lowerAmount = Math.min(amount1, amount2);
    const higherAmount = Math.max(amount1, amount2);

    const range = (higherAmount - lowerAmount) / 1000;
    const randomOffset = Math.floor(Math.random() * (range + 1)) * 1000;
    const randomAmount = lowerAmount + randomOffset;

    return randomAmount;
}

// setTimeout(() => {
//     EZUGI.Get().then(r => console.log('????'));
// }, 5000);