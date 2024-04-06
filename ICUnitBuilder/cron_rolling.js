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
        let object = {strID:strID, iRolling:cRolling};
        list.push(object);
    }
    else
        found.iRolling += cRolling;
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

    console.log(listRolling);


    lProcessID = -1;
    
    console.log(`##### END OF CRON ROLLING`);
});