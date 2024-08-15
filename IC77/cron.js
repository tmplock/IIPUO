const cron = require('node-cron');
const db = require('./db');

const {Op}= require('sequelize');

let GetElapsedSeconds = (strBaseDate) => {

    let dateCreated = new Date(strBaseDate);
    let dateCurrent = new Date();

    let iDiffSeconds = (dateCurrent.getTime() - dateCreated.getTime()) / 1000;

    return iDiffSeconds;
}

cron.schedule('0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * ', async ()=> {
   

});
