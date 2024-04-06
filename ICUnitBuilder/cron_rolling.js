const cron = require('node-cron');
const db = require('./db');

const RDEzugi = require('./vender/ezugi');
const RDCQ9 = require('./vender/cq9');
const RDHLink = require('./vender/honorlink');
const RDVivo = require('./vender/vivo');

const ODDS = require('./helpers/odds');

const Overview = require('./helpers/overview');

const Processor = require('./processor');

const {Op}= require('sequelize');

const moment = require('moment');

let lProcessID = -1;

let Find = (strID, list) => {

    for ( let i in list )
    {
        if ( list[i].strID == strID )
            return list[i];
    }

    return null;
}

let AddRolling = (strID, object, list) => {

    let found = Find(strID, list);

    const cRolling = object.iRollingB+object.iRollingUO+object.iRollingS;

    if ( found == null )
    {
        let object = {strID:strID, iRolling:cRolling, iSubtract:0};
        list.push(object);
    }
    else
        found.iRolling += cRolling;
}

let SubtractRolling = (strID, list, iAmount) => {

    let found = Find(strID, list);

    if ( found )
        found.iSubtract += iAmount;
}

cron.schedule('*/5 * * * * * ', async ()=> {

    console.log(`##### CRON ROLLING`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let overviews = await db.RecordDailyOverviews.findAll();
    console.log(`overview length is ${overviews.length}`);

    let listRolling = [];

    for ( let i in overviews )
    {
        AddRolling(overviews[i].strID, overviews[i], listRolling);
    }

    console.log('test1');
    let listR2 = [];
    let rolling = await db.GTs.findAll({where:{eType:'ROLLING'}});
    for ( let i in rolling )
    {
        console.log(`${rolling[i].strTo}`);
        const user = await db.Users.findOne({where:{strNickname:rolling[i].strTo}});
        console.log(`${user.strID}`);
        listR2.push({strID:user.strID, iRolling:rolling[i].iAmount});
    }
    console.log('test1');

    for ( let i in listR2 )
    {
        SubtractRolling(listR2[i].strID, listRolling, listR2[i].iRolling);
    }

    console.log(listRolling);

    // for ( let i in listRolling )
    // {
    //     console.log(i);
    //     await db.Users.update({iRolling:listRolling[i].iRolling-listRolling[i].iSubtract}, {where:{strID:listRolling[i].strID}});
    // }

    lProcessID = -1;
    
    console.log(`##### END OF CRON ROLLING`);
});