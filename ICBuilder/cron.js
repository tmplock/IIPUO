const cron = require('node-cron');
const db = require('./db');

const RDEzugi = require('./vender/ezugi');
const RDCQ9 = require('./vender/cq9');
const RDHLink = require('./vender/honorlink');
const RDVivo = require('./vender/vivo');

const ODDS = require('./helpers/odds');

const Processor = require('./processor');

const {Op}= require('sequelize');

const moment = require('moment');


let GetDBListFromVender = (listDB, strVender) => {

    console.log(`##### DBListFromVender listDB.length : ${listDB.length}`);
    let list = [];
    for ( let i in listDB )
    {
        if ( listDB[i].strVender == strVender && listDB[i].eType == 'RD' )
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
        // if ( listDB[i].eType == 'RD' || listDB[i].eType == 'BETRD' )
        //     continue;

        // if ( eType == 'WIN' && listDB[i].eType == 'WIN' && listDB[i].strOverview != '' )
        //     list.push(listDB[i]);
        // else if ( eType == 'BETWIN' && listDB[i].eType == 'WIN' && listDB[i].strOverview == '' && listDB[i].iGameCode != 200 )
        //     list.push(listDB[i]);
        // else if ( listDB[i].eType == eType )
        //     list.push(listDB[i]);

        if ( listDB[i].eType == eType )
            list.push(listDB[i]);
    }
    return list;
}

let lProcessID = -1;
let strCurrentStep = '';

//cron.schedule('*/5 * * * * * ', async ()=> {
cron.schedule('*/1 * * * * ', async ()=> {
//cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

    console.log(`##### CRON`);
    
    if (lProcessID != -1)
    {
        console.log(`##### CRON IS PROCESSING : ${strCurrentStep}`);
        return;
    }
    lProcessID = 1;
    strCurrentStep = '# : START';

    let listUpdateDB = [];
    let listOverview = [];

    let listBetDB = await db.RecordBets.findAll({
        where: {
            eState: 'ROLLING',
        },
    });
    console.log(`##### listBetDB.length = ${listBetDB.length}`);

    strCurrentStep = '# : GET DB COMPLETE';

    let listOdds = await ODDS.FullCalculteOdds(listBetDB);

    strCurrentStep = '# : START PROCESSING';

    Processor.ProcessOverview(listBetDB, listOverview, listOdds, listUpdateDB);

    //  ##### UPDATE BET
    console.log(`##### UPDATE RECORD BET : Length : ${listUpdateDB.length}`);
    for ( let i in listUpdateDB )
    {
        const cData = listUpdateDB[i];

        await db.RecordBets.update({eState:'COMPLETE', strOverview:cData.strOverview}, {where:{id:cData.id}});
    }

    strCurrentStep = '# : OVERVIEW UPDATE START';

    //  ##### OVERVIEW
    console.log(`##### UPDATE OVERVIEW : Length : ${listOverview.length}`);
    await ODDS.UpdateOverview(listOverview);
    
    lProcessID = -1;
    strCurrentStep = '';
    
    console.log(`##### END OF CRON`);
});