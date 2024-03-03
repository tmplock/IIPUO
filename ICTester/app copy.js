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
app.use('/router', require('./router'));

const VIVO = require('./helpers/vivo');

VIVO.Bet();

app.get('/', (req, res) => {
    res.redirect('/router');
    // res.render('index');
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

    if ( req.body.strAction == 'on' )
    {
        bEnableAction = true;
    }
    else 
        bEnableAction = false;

        iNumUser = req.body.iNumUser;

    res.send({result:'OK'});
});


setInterval(async () => {

    if ( bEnableAction == true )
    {
        for ( let i = 0; i < parseInt(iNumUser); ++ i )
        {
            if ( Balance() != 0 )
            {
                Bet();
                if ( Math.floor(Math.random()*2) == 0 )
                    Win();
    
            }
        }

    }
}, 3000);

//app.use('/router', require('./router'));

const crypto = require('crypto');

// const strData = `9a9c6f059926f54199624b2ad2e4ab3b54e51ab1c6d43509a745206104af9133DataSet=user_round_details&APIID=13000200-39facc4c&APIUser=BOtest&RoundID=7818559&OperatorID=13000200&UID=53485&TransactionID=848493ed-9631-4055-aa7f-ad615e41f8f4&language=en`;
// const data = crypto.createHash('sha256').update(strData).digest('hex');
// console.log(`#####`);
// console.log(data);

let IAccount =
{
    cVender: 'EZUGI',
    cCurrency: 'KRW',
    cAPIURL : 'https://play.livetables.io/auth/',
    cGameURL : 'https://play.livetables.io/auth/',
    cOperatorID : 10752001,
    cSecretCode : 'rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=',
    cLanguage: 'kr',
    cIP:'',
    SignatureHashKey: 'b328ca06-0d15-44d9-9fa7-be94c9b592ad',
    cAPIUSER : 'IIPUser',
    cAPIID : '10752001-a4e1e2c9',
    cAPIAccess : '28c65b947b57b4ca405d3aea2152fce02a5542679049646770d0f09ae774939b',
    cBOAddress : 'https://boint.tableslive.com/api/get/',
};


let strRoundID = '85161570';
//let strRoundID = '85174157';
let strUID = 'iip1-ezugi1';
//let strUID = 'iip1-user1';
let strTransactionID = 'caa2c54c-259f-46ea-9f9e-cc45aca0152f';
let strStartTime= '2024-01-05 19:58:54';
let strEndTime = '2024-01-08 19:59:09';
let strTableID = '100';

// const strData = `${IAccount.cAPIAccess}DataSet=user_round_details&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&RoundID=${strRoundID}&TransactionID=${strTransactionID}&UID=${strUID}`;
// const data = crypto.createHash('sha256').update(strData).digest('hex');
// console.log(`#####`);
// const strParams = `DataSet=user_round_details&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&RoundID=${strRoundID}&TransactionID=${strTransactionID}&UID=${strUID}&RequestToken=${data}`;
// console.log(data);

//     try {
//         axios.post(IAccount.cBOAddress,
//             strParams,
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         ).then( (response) => {
//             console.log(response);
//         });
//       //return response.data;

//     } catch (error) {
//       console.error('Error fetching from Ezugi API:', error);
//       //return null;
//     }

/*
    EZUGI Round Details
*/
// const strData = `${IAccount.cAPIAccess}DataSet=per_round_report&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&RoundID=${strRoundID}$StartTime=${strStartTime}&EndTime=${strEndTime}&TableID=${strTableID}&UID=${strUID}`;
// const data = crypto.createHash('sha256').update(strData).digest('hex');
// console.log(`#####`);
// const strParams = `DataSet=per_round_report&APIID=${IAccount.cAPIID}&APIUser=${IAccount.cAPIUSER}&OperatorID=${IAccount.cOperatorID}&RoundID=${strRoundID}$StartTime=${strStartTime}&EndTime=${strEndTime}&TableID=${strTableID}&UID=${strUID}&RequestToken=${data}`;
// console.log(data);

//     try {
//         axios.post(IAccount.cBOAddress,
//             strParams,
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         ).then( (response) => {
//             //console.log(response);
//             console.log(response.data.data);
//             // console.log(response.data.data[0].GameString);
//             // console.log(JSON.parse(response.data.data[0].GameString));
//             // console.log(JSON.parse(response.data.data[1].GameString));

//             // console.log(response.data.data.length);
//         });
//       //return response.data;

//     } catch (error) {
//       console.error('Error fetching from Ezugi API:', error);
//       //return null;
//     }
/*
    END OF EZUGI
*/


// let date = new Date();
// console.log(moment(date).format('YYYY-MM-DD'));

// let date = new Date();
// console.log(moment(date).format('YYYYMMDD'));

// let icash = 10000;
// console.log(icash.toFixed(2));

// var newYorkOffset = 4
// var hourInMilliSeconds = 60 * 60 * 1000
// var minuteInMilliSeconds = 60 * 1000
// var currentTimezoneOffset = new Date().getTimezoneOffset() * minuteInMilliSeconds // -32400000

// var newYorkTimeInUnix = new Date('2024-01-16 11:05:30').getTime() - currentTimezoneOffset + (newYorkOffset * hourInMilliSeconds)
// var koreaTime = new Date(newYorkTimeInUnix);
// console.log(`!@#!@#!@#!@#!@#!@#!@#`);
// console.log(koreaTime);
// let dateTime = new Date('2024-01-16 11:05:30');
// dateTime.setHours(dateTime.getHours()-5);
// // let dateStart = dateTime.setHours(dateTime.getHours()+5);
// // let dateEnd = dateTime.
// const value = dateTime;
// console.log(value);
// console.log(dateTime.toISOString());

// const cheerio = require('cheerio');
// const request = require('request');

// //const strCQ9 = `https://booi.cqgame.cc/gameboy/order/detail/v2?roundid=GINKGO240115220000011&account=iip1-user1`;
// const strCQ9 = `https://apii.cqgame.cc/gameboy/order/detail/v2?roundid=GINKGO240115220000011&account=iip1-user1`;

//     try {
//         axios.get(strCQ9,
//             {
//                 headers: {
//                     'Authorization':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NTUxZmY4YTZlOTFjYTdkZTgxMWQwYWYiLCJhY2NvdW50IjoiaWlwZ2FtZSIsIm93bmVyIjoiNjU1MWZmOGE2ZTkxY2E3ZGU4MTFkMGFmIiwicGFyZW50Ijoic2VsZiIsImN1cnJlbmN5IjoiS1JXIiwiYnJhbmQiOiJtb3RpdmF0aW9uIiwianRpIjoiNjgyMTU5ODcxIiwiaWF0IjoxNjk5ODcyNjUwLCJpc3MiOiJDeXByZXNzIiwic3ViIjoiU1NUb2tlbiJ9.SI3LXRK74d3p2DNOK024mzIeVQBNZ0tgwMAPRO-_hIM',
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         ).then( (response) => {
//             //console.log(response);

//             console.log(`##### CQ9`);
//             console.log(response.data);

//             console.log(response.data.data);

//             request(response.data.data, async (error, res, html) => {

//                 console.log(res.statusCode);
//                 if ( res.statusCode == 200 )
//                 {
//                     console.log(html);

//                     const $ = cheerio.load(html);

//                     const bodyList = $("div.BetDetail_grid__3AZzK").map(function (i, element) {
                        
//                         console.log(i);
//                   });

//                 }

//             })

            
//             // console.log(response.data.data[0].GameString);
//             // console.log(JSON.parse(response.data.data[0].GameString));
//             // console.log(JSON.parse(response.data.data[1].GameString));

//             // console.log(response.data.data.length);
//         });
//       //return response.data;

//     } catch (error) {
//       console.error('Error fetching from Ezugi API:', error);
//       //return null;
//     }

// let start = new Date('2024-01-16T10:38:41.486975139');
// start.setSeconds(start.getSeconds()-1);
// start = start.toISOString();
// start = start.substr(0, start.length-1);
// start ='2024-01-16T10:38:41.486';
// let end = new Date('2024-01-16T10:38:41.486975139');
// end.setSeconds(end.getSeconds()+10);
// end = end.toISOString();
// end = end.substr(0, end.length-1);
// end = `2024-01-16T01:38:41.487`;
// console.log(end);

let GetDate = (str, iOffset) => {

    //2024-01-16T10:38:41.486975139-04:00
    let date = str.substr(0, 20);

    console.log(date);

    let date2 = str.substr(20, 3);
    console.log(date2);
    let i = parseInt(date2)+parseInt(iOffset);

    console.log(i);

    let ret = date+`${i}`+'-04:00';

    return ret;
}

//let strTime = '2024-01-16T10:38:41.486975139-04:00';
//let strTime = '2024-01-16T11:29:15.818566882-04:00';
//let strTime = '2024-01-16T11:30:47.100056183-04:00';
let strTime = '2024-01-16T10:35:50.503751599-04:00';

// const kDate = new Date(strTime);

// const kUTC4 = new Date(kDate.getTime() - (4 * 60 * 60 * 1000));
// let kUTC4End = new Date(kDate.getTime() - (4 * 60 * 60 * 1000));
// kUTC4End.setSeconds(kUTC4End.getSeconds()+1);

// console.log(`strTime : ${strTime}, kDate : ${kDate.toISOString()}`);

// let strStart = kUTC4.toISOString();
// let strEnd = kUTC4End.toISOString();

// strStart = strStart.replace('Z','-04:00');
// strEnd = strEnd.replace('Z','-04:00');
// console.log(strStart);
// console.log(strEnd);

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

let objResult = GetTimeRange(strTime);

const strCQ92 = `https://apii.cqgame.cc/gameboy/order/view?account=iip1-user1&page=1&starttime=${objResult.start}&endtime=${objResult.end}`;
console.log(strCQ92);
    try {
        axios.get(strCQ92,
            {
                headers: {
                    'Authorization':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NTUxZmY4YTZlOTFjYTdkZTgxMWQwYWYiLCJhY2NvdW50IjoiaWlwZ2FtZSIsIm93bmVyIjoiNjU1MWZmOGE2ZTkxY2E3ZGU4MTFkMGFmIiwicGFyZW50Ijoic2VsZiIsImN1cnJlbmN5IjoiS1JXIiwiYnJhbmQiOiJtb3RpdmF0aW9uIiwianRpIjoiNjgyMTU5ODcxIiwiaWF0IjoxNjk5ODcyNjUwLCJpc3MiOiJDeXByZXNzIiwic3ViIjoiU1NUb2tlbiJ9.SI3LXRK74d3p2DNOK024mzIeVQBNZ0tgwMAPRO-_hIM',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then( (response) => {
            //console.log(response);

            console.log(`##### CQ9`);
            console.log(response.data);
            console.log(response.data.data);

            const listData = response.data.data.Data[0].livebetdetail;
            console.log(`BetData Length : ${listData.length}`);
            for ( let i in listData )
            {
                console.log(`bettype : ${listData[i].bettype}, bet : ${listData[i].bet}, win : ${listData[i].win}`);
            }
            //console.log(response.data.data.Data[0].livebetdetail);
            

        });

    } catch (error) {
      console.error('Error fetching from Ezugi API:', error);
    }


// let current = require('moment')('2024-01-16T11:30:47.100056183');

// console.log(`123123123123123 ${current.toISOString()}`);

// console.log(`123123123123123123`);
// console.log(GetDate(strTime, 0));
// console.log(GetDate(strTime, 1));

// const strStart = GetDate(strTime, 0);
// const strEnd = GetDate(strTime, 1);
// //const strCQ92 = `https://apii.cqgame.cc/gameboy/order/view?account=iip1-user1&page=1&starttime=${start}-04:00&endtime=${end}-04:00`;
// //const strCQ92 = `https://apii.cqgame.cc/gameboy/order/view?account=iip1-user1&page=1&starttime=2024-01-16T10:38:41.486-04:00&endtime=2024-01-16T10:38:41.487-04:00`;
// const strCQ92 = `https://apii.cqgame.cc/gameboy/order/view?account=iip1-user1&page=1&starttime=${strStart}&endtime=${strEnd}`;
// console.log(strCQ92);
//     try {
//         axios.get(strCQ92,
//             {
//                 headers: {
//                     'Authorization':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NTUxZmY4YTZlOTFjYTdkZTgxMWQwYWYiLCJhY2NvdW50IjoiaWlwZ2FtZSIsIm93bmVyIjoiNjU1MWZmOGE2ZTkxY2E3ZGU4MTFkMGFmIiwicGFyZW50Ijoic2VsZiIsImN1cnJlbmN5IjoiS1JXIiwiYnJhbmQiOiJtb3RpdmF0aW9uIiwianRpIjoiNjgyMTU5ODcxIiwiaWF0IjoxNjk5ODcyNjUwLCJpc3MiOiJDeXByZXNzIiwic3ViIjoiU1NUb2tlbiJ9.SI3LXRK74d3p2DNOK024mzIeVQBNZ0tgwMAPRO-_hIM',
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         ).then( (response) => {
//             //console.log(response);

//             console.log(`##### CQ9`);
//             console.log(response.data);

//             console.log(response.data.data);

//             console.log(response.data.data.Data[0].livebetdetail);

//                         // console.log(response.data.data[0].GameString);
//             // console.log(JSON.parse(response.data.data[0].GameString));
//             // console.log(JSON.parse(response.data.data[1].GameString));

//             // console.log(response.data.data.length);
//         });
//       //return response.data;

//     } catch (error) {
//       console.error('Error fetching from Ezugi API:', error);
//       //return null;
//     }