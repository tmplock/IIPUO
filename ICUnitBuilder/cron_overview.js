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



    //  2024-04-05
    // let listID = [
    //     {strID:'qa123', iClass:7},
    //     {strID:'jojo05', iClass:8},
    //     {strID:'cjsgh1', iClass:7},
    //     {strID:'kkk123', iClass:8},
    //     {strID:'qwe01', iClass:8},
    //     {strID:'zxc01', iClass:8},
    //     {strID:'t1000', iClass:7},                
    //     {strID:'gkfn1', iClass:8},
    //     {strID:'gkfn2', iClass:8},
    //     {strID:'zlekfl5', iClass:8},
    //     {strID:'gkfn3', iClass:8},
    //     {strID:'sss1000', iClass:6},
    //     {strID:'tpdud123', iClass:8},
    //     {strID:'gkfn6', iClass:8},
    // ];

    //  2024-04-06
    // let listID = [
    //     {strID:'gkfn6', iClass:8},
    //     {strID:'gkfn2', iClass:8},
    //     {strID:'sss1000', iClass:6},
    //     {strID:'jojo01', iClass:8},
    //     {strID:'gkfn3', iClass:8},
    //     {strID:'rudwn01', iClass:6},
    //     {strID:'gkfn1', iClass:8},                
    //     {strID:'gkfn5', iClass:8},
    //     {strID:'tpdud123', iClass:8},
    //     {strID:'ehqhd22', iClass:8},
    //     {strID:'ehqhd55', iClass:8},
    //     {strID:'gkfn01', iClass:8},
    //     {strID:'kkk123', iClass:8},
    // ];

    //  2024-04-07
    let listID = [
        {strID:'zlekfl5', iClass:8},
        {strID:'cjsgh1', iClass:7},
        {strID:'kkk123', iClass:8},
        {strID:'jojo05', iClass:8},
        {strID:'rudwn01', iClass:6},
        {strID:'jnh720', iClass:8},
        {strID:'MARBRORED', iClass:8},                
        {strID:'gkfn02', iClass:8},
        {strID:'gkfn04', iClass:8},
        {strID:'rkskek', iClass:7},
        {strID:'sss1000', iClass:6},
        {strID:'gkfn08', iClass:8},
        {strID:'zlekfl6', iClass:8},
        {strID:'rhtks9', iClass:8},
    ];

    // let listID = [
    //     {strID:'qwe01', iClass:8},
    // ];

    let strDate = '2024-04-07';

    for ( let i in listID )
    {
        await Overview.CalculateOverview(listID[i].strID, listID[i].iClass, strDate, listOverview);
    }

    for ( let i in listOverview )
    {
        if ( listOverview[i].strID == 'aktjr01' )
        {
            console.log(listOverview[i]);
        }
    }

    //console.log(listOverview);

    // for ( let i in listOverview )
    // {
    //     console.log(`${i}`);

    //     await db.RecordDailyOverviews.update({
    //         iBetB:listOverview[i].iBetB,
    //         iBetUO:listOverview[i].iBetUO,
    //         iBetS:listOverview[i].iBetS,
    //         iBetPB:listOverview[i].iBetPB,
    //         iWinB:listOverview[i].iWinB,
    //         iWinUO:listOverview[i].iWinUO,
    //         iWinS:listOverview[i].iWinS,
    //         iWinPB:listOverview[i].iWinPB,
    //         iRollingB:listOverview[i].iRollingB,
    //         iRollingUO:listOverview[i].iRollingUO,
    //         iRollingS:listOverview[i].iRollingS,
    //         iRollingPBA:listOverview[i].iRollingPBA,
    //         iRollingPBB:listOverview[i].iRollingPBB,
    //         iAgentBetB:listOverview[i].iAgentBetB,
    //         iAgentBetUO:listOverview[i].iAgentBetUO,
    //         iAgentBetS:listOverview[i].iAgentBetS,
    //         iAgentBetPB:listOverview[i].iAgentBetPB,
    //         iAgentWinB:listOverview[i].iAgentWinB,
    //         iAgentWinUO:listOverview[i].iAgentWinUO,
    //         iAgentWinS:listOverview[i].iAgentWinS,
    //         iAgentWinPB:listOverview[i].iAgentWinPB,
    //         iAgentRollingB:listOverview[i].iAgentRollingB,
    //         iAgentRollingUO:listOverview[i].iAgentRollingUO,
    //         iAgentRollingS:listOverview[i].iAgentRollingS,
    //         iAgentRollingPBA:listOverview[i].iAgentRollingPBA,
    //         iAgentRollingPBB:listOverview[i].iAgentRollingPBB,
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