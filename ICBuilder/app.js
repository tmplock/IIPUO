'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);

const db = require('./db');
db.sequelize.sync();

const cron = require('./cron');

// let FindUnit = (number) => {

//     let str = parseInt(number).toString();

//     let array = str.split('');

//     for ( let i = 0; i < array.length; ++ i )
//     {
//         const c = parseInt(array[array.length-1-i]);        
//         console.log(c);
//         if ( c != 0 )
//             return i;
//     }
//     return 0;
// }

// //FindUnit(10020);

// let GetNumberUnit = (iOriginBet, fRate) => {

//     //const cBetting = Math.round(parseInt(array[i].iBetting2)/100)*100;

//     const n = parseInt(iOriginBet);
//     const cRealBet = parseInt(iOriginBet / fRate);

//     let iReturn = cRealBet;

//     const type = FindUnit(iOriginBet);
//     console.log(`type : ${type}`);

//     if ( type==2 )
//     {
//         iReturn = Math.round(parseInt(cRealBet)/10)*10;
//     }
//     else if ( type==3 )
//     {
//         iReturn = Math.round(parseInt(cRealBet)/100)*100;
//     }
//     else if ( type==4 )
//     {
//         iReturn = Math.round(parseInt(cRealBet)/1000)*1000;
//     }
//     else if (type == 5)
//     {
//         iReturn = Math.round(parseInt(cRealBet)/10000)*10000;
//     }
//     else if ( type >= 6 )
//     {
//         iReturn = Math.round(parseInt(cRealBet)/100000)*100000;
//     }

//     console.log(`##### ${iOriginBet} => ${cRealBet} : Return ${iReturn}`);
// }

// GetNumberUnit(3000, 1.2);

const cPort = 3003;
server.listen(cPort, () => {
    console.log(`ICBuilder Server is started At ${cPort}`);
});
