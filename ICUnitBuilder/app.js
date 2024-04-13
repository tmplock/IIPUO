'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);

// const cron = require('./cron');
//const cron = require('./cron_overview');
//const cron = require('./cron_rolling');

const db = require('./db');

const {Op} = require('sequelize');

const cPort = 3003;
server.listen(cPort, () => {
    console.log(`IBetBuilder Server is started At ${cPort}`);
});







let Find = (list, strVender) => {

    for ( let i in list )
    {
        if ( list[i].strVender == strVender )
        {
            return list[i];
        }        
    }
    return null;
}

let BuildList = (listDB) => {

    let list = [];

    for ( let i in listDB )
    {
        let object = Find(list, listDB[i].strVender);
        if ( object == null )
        {
            object = {strVender:listDB[i].strVender, iBet:0, iWin:0, iCancel:0};
            list.push(object);
        }

        object.iBet += parseInt(listDB[i].iBet);
        object.iWin += parseInt(listDB[i].iWin);

        // if ( listDB[i].eType == 'BET' )
        //     object.iBet += parseInt(listDB[i].strAmount);
        // else if ( listDB[i].eType == 'WIN' )
        //     object.iWin += parseInt(listDB[i].strAmount);
        // else
        //     object.iCancel += parseInt(list[i].strAmount);            
    }
    return list;
}










let lProcess = -1;
setInterval( async () => {

    if ( lProcess != -1 )
        return;


    const dateStart = '2024-04-12';
    const dateEnd = '2024-04-12';
    const strID = 'rudwn01';

    let list = await db.RecordBets.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ dateStart, require('moment')(dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:strID,
        },
        order:[['createdAt','DESC']],
    });

    let listData = BuildList(list);

    console.log(listData);

    lProcess = 0;

}, 1000);

