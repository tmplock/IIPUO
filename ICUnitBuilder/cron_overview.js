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


let GetDBListFromVender = (listDB, strVender) => {

    console.log(`##### DBListFromVender listDB.length : ${listDB.length}`);
    let list = [];
    for ( let i in listDB )
    {
        if ( listDB[i].strVender == strVender )
        {
            list.push(listDB[i]);
        }
    }
    return list;
}

let GetDBListFromType = (listDB, eType) => {

    let list = [];
    for ( let i in listDB )
    {
        if ( eType == 'WIN' && listDB[i].strOverview != '' )
            list.push(listDB[i]);
        else if ( eType == 'BETWIN' && listDB[i].strOverview == '' )
            list.push(listDB[i]);
        else if ( listDB[i].eType == eType )
            list.push(listDB[i]);
    }
    return list;
}

let lProcessID = -1;


cron.schedule('*/5 * * * * * ', async ()=> {

    console.log(`##### CRON ROLLING`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING`);
        return;
    }
    lProcessID = 1;

    let listUpdateDB = [];
    let listOverview = [];



    let listID = [
        {strID:'qa123', iClass:7},
        {strID:'jojo05', iClass:8},
        {strID:'cjsgh1', iClass:7},
        {strID:'kkk123', iClass:8},
        {strID:'qwe01', iClass:8},
        {strID:'zxc01', iClass:8},
        {strID:'t1000', iClass:7},                
        {strID:'gkfn1', iClass:8},
        {strID:'gkfn2', iClass:8},
        {strID:'zlekfl5', iClass:8},
        {strID:'gkfn3', iClass:8},
        {strID:'sss1000', iClass:6},
        {strID:'tpdud123', iClass:8},
        {strID:'gkfn6', iClass:8},
    ];
    // let listID = [
    //     {strID:'qwe01', iClass:8},
    // ];

    let strDate = '2024-04-05';

    for ( let i in listID )
    {
        await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
    }

    for ( let i in listOverview )
    {
        if ( listOverview[i].strID == 'qwe01' )
        {
            console.log(listOverview[i]);
        }
    }

    //console.log(listOverview);

    // for ( let i in listOverview )
    // {
    //     await db.RecordDailyOverviews.update({
    //         iBetB:listOverview.iBetB,
    //         iBetUO:listOverview.iBetUO,
    //         iBetS:listOverview.iBetS,
    //         iBetPB:listOverview.iBetPB,
    //         iWinB:listOverview.iWinB,
    //         iWinUO:listOverview.iWinUO,
    //         iWinS:listOverview.iWinS,
    //         iWinPB:listOverview.iWinPB,
    //         iRollingB:listOverview.iRollingB,
    //         iRollingUO:listOverview.iAgentBetUO,
    //         iRollingS:listOverview.iRollingS,
    //         iRollingPBA:listOverview.iRollingPBA,
    //         iRollingPBB:listOverview.iRollingPBB,
    //         iAgentBetB:listOverview.iAgentBetB,
    //         iAgentBetUO:listOverview.iAgentBetUO,
    //         iAgentBetS:listOverview.iAgentWinS,
    //         iAgentBetPB:listOverview.iAgentWinPB,
    //         iAgentWinB:listOverview.iAgentWinB,
    //         iAgentWinUO:listOverview.iAgentWinUO,
    //         iAgentWinS:listOverview.iAgentWinS,
    //         iAgentWinPB:listOverview.iAgentWinPB,
    //         iAgentRollingB:listOverview.iAgentRollingB,
    //         iAgentRollingUO:listOverview.iAgentRollingUO,
    //         iAgentRollingS:listOverview.iAgentRollingS,
    //         iAgentRollingPBA:listOverview.iAgentRollingPBA,
    //         iAgentRollingPBB:listOverview.iAgentRollingPBB,
    //     },
    //     {
    //         where:{strID:listOverview[i].strID, strDate:listOverview[i].strDate}
    //     });
    // }

    // console.log(``);
    // console.log(`##### Result `);
    // console.log(listOverview);
    
    lProcessID = -1;
    
    console.log(`##### END OF CRON`);
});