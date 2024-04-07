const moment = require('moment');
const ODDS = require('./odds');

const db = require('../db');
const {Op} = require('sequelize');


let CalculateRollingAmount = (strID, cAmount, fMine, fChild) => {

    if ( strID == '' )
        return 0;

    const fOdds = parseFloat(Number(fMine - fChild).toFixed(1));
    console.log(`CalculateRollingAmount : ${fOdds}, fMine : ${fMine}, fChild : ${fChild}`);

    if ( fOdds > 0 )
    {
        const c = parseInt(cAmount) * fOdds * 0.01;
        return c;
    }
    return 0;
}

let CalculateOverviewUnit = (o, strID, iBetB, iBetUO, iBetS, iWinB, iWinUO, iWinS) => {

    let objectData = {
        strID:strID,

        iPAdminRB:0,
        iVAdminRB:0,
        iAgentRB:0,
        iShopRB:0,
        iUserRB:0,

        iPAdminRUO:0,
        iVAdminRUO:0,
        iAgentRUO:0,
        iShopRUO:0,
        iUserRUO:0,

        iPAdminRS:0,
        iVAdminRS:0,
        iAgentRS:0,
        iShopRS:0,
        iUserRS:0,

        iPAdminRPBA:0,
        iVAdminRPBA:0,
        iAgentRPBA:0,
        iShopRPBA:0,
        iUserRPBA:0,

        iPAdminRPBB:0,
        iVAdminRPBB:0,
        iAgentRPBB:0,
        iShopRPBB:0,
        iUserRPBB:0,

        iBetB:0,
        iBetUO:0,
        iBetS:0,
        iBetPB:0,

        iWinB:0,
        iWinUO:0,
        iWinS:0,
        iWinPB:0,

        iWinLoseB:0,
        iWinLoseUO:0,
        iWinLoseS:0,
        iWinLosePB:0,
    }

    objectData.iPAdminRUO += CalculateRollingAmount(o.strPAdminID, iBetUO, o.fPAdminUnderOverR, o.fVAdminUnderOverR);
    objectData.iVAdminRUO += CalculateRollingAmount(o.strVAdminID, iBetUO, o.fVAdminUnderOverR, o.fAgentUnderOverR);
    objectData.iAgentRUO += CalculateRollingAmount(o.strAgentID, iBetUO, o.fAgentUnderOverR, o.fShopUnderOverR);
    objectData.iShopRUO += CalculateRollingAmount(o.strShopID, iBetUO, o.fShopUnderOverR, o.fUserUnderOverR);
    objectData.iUserRUO += CalculateRollingAmount(o.strUserID, iBetUO, o.fUserUnderOverR, 0);

    objectData.iBetUO += iBetUO;

    objectData.iPAdminRS += CalculateRollingAmount(o.strPAdminID, iBetS, o.fPAdminSlotR, o.fVAdminSlotR);
    objectData.iVAdminRS += CalculateRollingAmount(o.strVAdminID, iBetS, o.fVAdminSlotR, o.fAgentSlotR);
    objectData.iAgentRS += CalculateRollingAmount(o.strAgentID, iBetS, o.fAgentSlotR, o.fShopSlotR);
    objectData.iShopRS += CalculateRollingAmount(o.strShopID, iBetS, o.fShopSlotR, o.fUserSlotR);
    objectData.iUserRS += CalculateRollingAmount(o.strUserID, iBetS, o.fUserSlotR, 0);

    objectData.iBetS += iBetS;

    objectData.iPAdminRB += CalculateRollingAmount(o.strPAdminID, iBetB, o.fPAdminBaccaratR, o.fVAdminBaccaratR);
    objectData.iVAdminRB += CalculateRollingAmount(o.strVAdminID, iBetB, o.fVAdminBaccaratR, o.fAgentBaccaratR);
    objectData.iAgentRB += CalculateRollingAmount(o.strAgentID, iBetB, o.fAgentBaccaratR, o.fShopBaccaratR);
    objectData.iShopRB += CalculateRollingAmount(o.strShopID, iBetB, o.fShopBaccaratR, o.fUserBaccaratR);
    objectData.iUserRB += CalculateRollingAmount(o.strUserID, iBetB, o.fUserBaccaratR, 0);

    objectData.iBetB += iBetB;


    objectData.iWinB += iWinB;
    objectData.iWinUO += iWinUO;
    objectData.iWinS += iWinS;

    return objectData;
}

let GetData = (listBetDB) => {

    let object = {iBetB:0, iBetUO:0, iBetS:0, iWinUO:0, iWinB:0, iWinS:0};

    for ( let i in listBetDB )
    {
        //console.log(`listBetDB[i].id = ${listBetDB[i].id}`);
        //if ( listBetDB[i].strDetail != '' )
        //if ( listBetDB[i].strResult != '' )
        if ( listBetDB[i].eType == 'RD' && listBetDB[i].strDetail.length > 10 )
        {
            const test = JSON.parse(listBetDB[i].strDetail);
            //console.log(test);                    
            for ( let j in test )
            {
                if ( test[j].C == 100 )
                {
                    object.iBetUO += test[j].B;
                    object.iWinUO += test[j].W;
                }
                else
                {
                    object.iBetB += test[j].B;
                    object.iWinB += test[j].W;
                }
            }
        }
        else
        {
            if ( listBetDB[i].iGameCode == 200 )
            {
                object.iBetS += listBetDB[i].iBet;
                object.iWinS += listBetDB[i].iWin;
            }                        
            else
            {
                object.iBetB += listBetDB[i].iBet;
                object.iWinB += listBetDB[i].iWin;
            }
                
        }
    }
    return object;
}

exports.CalculateOverview = async (strID, iClass, strDate, listOverview) => {

    let objectOdds = await ODDS.CalculateOdds(strID, iClass);
    console.log(objectOdds);

    const dateStart = moment(strDate).format('YYYY-MM-DD');
    const dateEnd = moment(strDate).add(1, 'days').format('YYYY-MM-DD');

    console.log(`${strID}, ${dateStart}, ${dateEnd}`);

    let listBetDB = await db.RecordBets.findAll({
        where: {
            createdAt:{
                [Op.between]:[ dateStart, dateEnd],
            },
            eType:{[Op.or]:['BET', 'WIN', 'RD', 'BETWIN']},
            eState:'COMPLETE',
            strID:strID,
        },

    });
    console.log(`##### listBetDB.length = ${listBetDB.length}`);

    const object = GetData(listBetDB);

    console.log(object);

    let object2 = CalculateOverviewUnit(objectOdds, strID, object.iBetB, object.iBetUO, object.iBetS, object.iWinB, object.iWinUO, object.iWinS);
    console.log(object2);

    console.log(`##### object2`);

    const listFinal = ODDS.ProcessGroupDailyOverview(objectOdds, object2, strDate);

    console.log(`##### listFinal`);

    ODDS.JoinGroupDailyOverview(listOverview, listFinal);
    //console.log(listOverview);

    // for ( let i in listOverview )
    // {
    //     if ( listOverview[i].strID == 'jojo05' )
    //     {
    //         console.log(listOverview[i]);
    //     }
    // }
}