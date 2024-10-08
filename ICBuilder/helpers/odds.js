const db = require('../db');
const Enum = require('../helpers/enum');

let FindUnit = (number) => {

    let str = parseInt(number).toString();

    let array = str.split('');

    for ( let i = 0; i < array.length; ++ i )
    {
        const c = parseInt(array[array.length-1-i]);        
        console.log(c);
        if ( c != 0 )
            return i;
    }
    return 0;
}

//FindUnit(10020);

let GetNumberUnit = (iOriginBet, fRate) => {

    //const cBetting = Math.round(parseInt(array[i].iBetting2)/100)*100;

    const n = parseInt(iOriginBet);
    const cRealBet = parseInt(iOriginBet / fRate);

    let iReturn = cRealBet;

    const type = FindUnit(iOriginBet);
    console.log(`type : ${type}`);

    if ( type==2 )
    {
        iReturn = Math.round(parseInt(cRealBet)/10)*10;
    }
    else if ( type==3 )
    {
        iReturn = Math.round(parseInt(cRealBet)/100)*100;
    }
    else if ( type==4 )
    {
        iReturn = Math.round(parseInt(cRealBet)/1000)*1000;
    }
    else if (type == 5)
    {
        iReturn = Math.round(parseInt(cRealBet)/10000)*10000;
    }
    else if ( type >= 6 )
    {
        iReturn = Math.round(parseInt(cRealBet)/100000)*100000;
    }
    else
    {
        iReturn = Math.round(parseInt(cRealBet)/10)*10;
    }

    console.log(`##### ${iOriginBet} => ${cRealBet} : Return ${iReturn}`);

    return iReturn;
}


exports.GetOverviewDB = (strID, listOverviewDB) => {

    for ( let i in listOverviewDB )
    {
        if(listOverviewDB[i].strID == 'unover0405' && strID == 'unover0405')
        {
            console.log(listOverviewDB[i]);
        }  
        if ( listOverviewDB[i].strID == strID )  
               
            return listOverviewDB[i];
    }

    return null;
}

exports.FindOdd = (strID, list) => {

    for ( let i in list )
    {
        if ( list[i].strID == strID )
        {
            return list[i];
        }
    }
    return null;
};

exports.CalculateOdds = async (strID, iClass) => {

    let objectOdds = {

        strHQID:'',
        strVHQID:'',
        strAdminID:'',
        strPAdminID:'',
        strVAdminID:'',
        strAgentID:'',
        strShopID:'',
        strUserID:'',

        strHQGroupID:'',
        strVHQGroupID:'',
        strAdminGroupID:'',
        strPAdminGroupID:'',
        strVAdminGroupID:'',
        strAgentGroupID:'',
        strShopGroupID:'',
        strUserGroupID:'',

        fPAdminBaccaratR:0,
        fPAdminSlotR:0,
        fPAdminUnderOverR:0,
        fPAdminPBR:0,
        fPAdminPBSingleR:0,
        fPAdminPBDoubleR:0,
        fPAdminPBTripleR:0,

        fVAdminBaccaratR:0,
        fVAdminSlotR:0,
        fVAdminUnderOverR:0,
        fVAdminPBR:0,
        fVAdminPBSingleR:0,
        fVAdminPBDoubleR:0,
        fVAdminPBTripleR:0,

        fAgentBaccaratR:0,
        fAgentSlotR:0,
        fAgentUnderOverR:0,
        fAgentPBR:0,
        fAgentPBSingleR:0,
        fAgentPBDoubleR:0,
        fAgentPBTripleR:0,

        fShopBaccaratR:0,
        fShopSlotR:0,
        fShopUnderOverR:0,
        fShopPBR:0,
        fShopPBSingleR:0,
        fShopPBDoubleR:0,
        fShopPBTripleR:0,

        fUserBaccaratR:0,
        fUserSlotR:0,
        fUserUnderOverR:0,
        fUserPBR:0,
        fUserPBSingleR:0,
        fUserPBDoubleR:0,
        fUserPBTripleR:0,

        fRRB:0,
        fRRUO:0,
        fRRS:0,
        iRRTurn:20,
    }

    let strQuery = ``;
    if ( iClass == 5 )
    {
        strQuery = `
        SELECT  
            t1.strID as strHQID,
            t1.strGroupID as strHQGroupID,
            
            t2.strID as strVHQID,
            t2.strGroupID as strVHQGroupID,

            t3.strID as strAdminID,
            t3.strGroupID as strAdminGroupID,

            t4.fBaccaratR AS fPAdminBaccaratR,
            t4.fSlotR as fPAdminSlotR,
            t4.fUnderOverR as fPAdminUnderOverR,
            t4.fPBR as fPAdminPBR,
            t4.fPBSingleR as fPAdminPBSingleR,
            t4.fPBDoubleR as fPAdminPBDoubleR,
            t4.fPBTripleR as fPAdminPBTripleR,
            t4.strID as strPAdminID,
            t4.strGroupID as strPAdminGroupID,

            t5.fBaccaratR AS fVAdminBaccaratR,
            t5.fSlotR as fVAdminSlotR,
            t5.fUnderOverR as fVAdminUnderOverR,
            t5.fPBR as fVAdminPBR,
            t5.fPBSingleR as fVAdminPBSingleR,
            t5.fPBDoubleR as fVAdminPBDoubleR,
            t5.fPBTripleR as fVAdminPBTripleR,
            t5.strID as strVAdminID,
            t5.strGroupID as strVAdminGroupID,
            t5.fRRB as fRRB,
            t5.fRRUO as fRRUO,
            t5.fRRS as fRRS,
            t5.iRRTurn as iRRTurn

        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        WHERE t5.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strHQID = result[0].strHQID,
            objectOdds.strHQGroupID = result[0].strHQGroupID,

            objectOdds.strVHQID = result[0].strVHQID,
            objectOdds.strVHQGroupID = result[0].strVHQGroupID,

            objectOdds.strAdminID = result[0].strAdminID,
            objectOdds.strAdminGroupID = result[0].strAdminGroupID,

            objectOdds.strPAdminGroupID = result[0].strPAdminGroupID;
            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strVAdminGroupID = result[0].strVAdminGroupID;
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strAgentID = '';
            objectOdds.strShopID = '';
            objectOdds.strUserID = '';

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fRRB = result[0].fRRB;
            objectOdds.fRRUO = result[0].fRRUO;
            objectOdds.fRRS = result[0].fRRS;
            objectOdds.iRRTurn = result[0].iRRTurn;
        }
        return objectOdds;
    }
    else if ( iClass == 6 )
    {
        strQuery = `
            SELECT  
            
            t1.strID as strHQID,
            t1.strGroupID as strHQGroupID,
            
            t2.strID as strVHQID,
            t2.strGroupID as strVHQGroupID,

            t3.strID as strAdminID,
            t3.strGroupID as strAdminGroupID,

            t4.fBaccaratR AS fPAdminBaccaratR,
            t4.fSlotR as fPAdminSlotR,
            t4.fUnderOverR as fPAdminUnderOverR,
            t4.fPBR as fPAdminPBR,
            t4.fPBSingleR as fPAdminPBSingleR,
            t4.fPBDoubleR as fPAdminPBDoubleR,
            t4.fPBTripleR as fPAdminPBTripleR,
            t4.strID as strPAdminID,
            t4.strGroupID as strPAdminGroupID,

            t5.fBaccaratR AS fVAdminBaccaratR,
            t5.fSlotR as fVAdminSlotR,
            t5.fUnderOverR as fVAdminUnderOverR,
            t5.fPBR as fVAdminPBR,
            t5.fPBSingleR as fVAdminPBSingleR,
            t5.fPBDoubleR as fVAdminPBDoubleR,
            t5.fPBTripleR as fVAdminPBTripleR,
            t5.strID as strVAdminID,
            t5.strGroupID as strVAdminGroupID,

            t6.fBaccaratR AS fAgentBaccaratR,
            t6.fSlotR as fAgentSlotR,
            t6.fUnderOverR as fAgentUnderOverR,
            t6.fPBR as fAgentPBR,
            t6.fPBSingleR as fAgentPBSingleR,
            t6.fPBDoubleR as fAgentPBDoubleR,
            t6.fPBTripleR as fAgentPBTripleR,
            t6.strID as strAgentID,
            t6.strGroupID as strAgentGroupID,

            t6.fRRB as fRRB,
            t6.fRRUO as fRRUO,
            t6.fRRS as fRRS,
            t6.iRRTurn as iRRTurn


        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strHQID = result[0].strHQID,
            objectOdds.strHQGroupID = result[0].strHQGroupID,

            objectOdds.strVHQID = result[0].strVHQID,
            objectOdds.strVHQGroupID = result[0].strVHQGroupID,

            objectOdds.strAdminID = result[0].strAdminID,
            objectOdds.strAdminGroupID = result[0].strAdminGroupID,


            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strPAdminGroupID = result[0].strPAdminGroupID,
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strVAdminGroupID = result[0].strVAdminGroupID,
            objectOdds.strAgentID = result[0].strAgentID;
            objectOdds.strAgentGroupID = result[0].strAgentGroupID;
            objectOdds.strShopID = '';
            objectOdds.strUserID = '';

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fAgentBaccaratR = result[0].fAgentBaccaratR;
            objectOdds.fAgentSlotR = result[0].fAgentSlotR;
            objectOdds.fAgentUnderOverR = result[0].fAgentUnderOverR;
            objectOdds.fAgentPBR = result[0].fAgentPBR;
            objectOdds.fAgentPBSingleR = result[0].fAgentPBSingleR;
            objectOdds.fAgentPBDoubleR = result[0].fAgentPBDoubleR;
            objectOdds.fAgentPBTripleR = result[0].fAgentPBTripleR;

            objectOdds.fRRB = result[0].fRRB;
            objectOdds.fRRUO = result[0].fRRUO;
            objectOdds.fRRS = result[0].fRRS;
            objectOdds.iRRTurn = result[0].iRRTurn;
        }
        return objectOdds;
    }
    else if ( iClass == 7 )
    {
        strQuery = `
        SELECT  
            t1.strID as strHQID,
            t1.strGroupID as strHQGroupID,
            
            t2.strID as strVHQID,
            t2.strGroupID as strVHQGroupID,

            t3.strID as strAdminID,
            t3.strGroupID as strAdminGroupID,

            t4.fBaccaratR AS fPAdminBaccaratR,
            t4.fSlotR as fPAdminSlotR,
            t4.fUnderOverR as fPAdminUnderOverR,
            t4.fPBR as fPAdminPBR,
            t4.fPBSingleR as fPAdminPBSingleR,
            t4.fPBDoubleR as fPAdminPBDoubleR,
            t4.fPBTripleR as fPAdminPBTripleR,
            t4.strID as strPAdminID,
            t4.strGroupID as strPAdminGroupID,

            t5.fBaccaratR AS fVAdminBaccaratR,
            t5.fSlotR as fVAdminSlotR,
            t5.fUnderOverR as fVAdminUnderOverR,
            t5.fPBR as fVAdminPBR,
            t5.fPBSingleR as fVAdminPBSingleR,
            t5.fPBDoubleR as fVAdminPBDoubleR,
            t5.fPBTripleR as fVAdminPBTripleR,
            t5.strID as strVAdminID,
            t5.strGroupID as strVAdminGroupID,

            t6.fBaccaratR AS fAgentBaccaratR,
            t6.fSlotR as fAgentSlotR,
            t6.fUnderOverR as fAgentUnderOverR,
            t6.fPBR as fAgentPBR,
            t6.fPBSingleR as fAgentPBSingleR,
            t6.fPBDoubleR as fAgentPBDoubleR,
            t6.fPBTripleR as fAgentPBTripleR,
            t6.strID as strAgentID,
            t6.strGroupID as strAgentGroupID,

            t7.fBaccaratR AS fShopBaccaratR,
            t7.fSlotR as fShopSlotR,
            t7.fUnderOverR as fShopUnderOverR,
            t7.fPBR as fShopPBR,
            t7.fPBSingleR as fShopPBSingleR,
            t7.fPBDoubleR as fShopPBDoubleR,
            t7.fPBTripleR as fShopPBTripleR,
            t7.strID as strShopID,
            t7.strGroupID as strShopGroupID,

            t7.fRRB as fRRB,
            t7.fRRUO as fRRUO,
            t7.fRRS as fRRS,
            t7.iRRTurn as iRRTurn


        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        LEFT JOIN Users AS t7 ON t7.iParentID = t6.id
        WHERE t7.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strHQID = result[0].strHQID,
            objectOdds.strHQGroupID = result[0].strHQGroupID,

            objectOdds.strVHQID = result[0].strVHQID,
            objectOdds.strVHQGroupID = result[0].strVHQGroupID,

            objectOdds.strAdminID = result[0].strAdminID,
            objectOdds.strAdminGroupID = result[0].strAdminGroupID,

            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strPAdminGroupID = result[0].strPAdminGroupID,
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strVAdminGroupID = result[0].strVAdminGroupID,
            objectOdds.strAgentID = result[0].strAgentID;
            objectOdds.strAgentGroupID = result[0].strAgentGroupID,
            objectOdds.strShopID = result[0].strShopID;
            objectOdds.strShopGroupID = result[0].strShopGroupID,
            objectOdds.strUserID = '';

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fAgentBaccaratR = result[0].fAgentBaccaratR;
            objectOdds.fAgentSlotR = result[0].fAgentSlotR;
            objectOdds.fAgentUnderOverR = result[0].fAgentUnderOverR;
            objectOdds.fAgentPBR = result[0].fAgentPBR;
            objectOdds.fAgentPBSingleR = result[0].fAgentPBSingleR;
            objectOdds.fAgentPBDoubleR = result[0].fAgentPBDoubleR;
            objectOdds.fAgentPBTripleR = result[0].fAgentPBTripleR;

            objectOdds.fShopBaccaratR = result[0].fShopBaccaratR;
            objectOdds.fShopSlotR = result[0].fShopSlotR;
            objectOdds.fShopUnderOverR = result[0].fShopUnderOverR;
            objectOdds.fShopPBR = result[0].fShopPBR;
            objectOdds.fShopPBSingleR = result[0].fShopPBSingleR;
            objectOdds.fShopPBDoubleR = result[0].fShopPBDoubleR;
            objectOdds.fShopPBTripleR = result[0].fShopPBTripleR;

            objectOdds.fRRB = result[0].fRRB;
            objectOdds.fRRUO = result[0].fRRUO;
            objectOdds.fRRS = result[0].fRRS;
            objectOdds.iRRTurn = result[0].iRRTurn;
        }
        return objectOdds;
    }
    else if ( iClass == 8 )
    {
        strQuery = `
        SELECT  

            t1.strID as strHQID,
            t1.strGroupID as strHQGroupID,
            
            t2.strID as strVHQID,
            t2.strGroupID as strVHQGroupID,

            t3.strID as strAdminID,
            t3.strGroupID as strAdminGroupID,

            t4.fBaccaratR AS fPAdminBaccaratR,
            t4.fSlotR as fPAdminSlotR,
            t4.fUnderOverR as fPAdminUnderOverR,
            t4.fPBR as fPAdminPBR,
            t4.fPBSingleR as fPAdminPBSingleR,
            t4.fPBDoubleR as fPAdminPBDoubleR,
            t4.fPBTripleR as fPAdminPBTripleR,
            t4.strID as strPAdminID,
            t4.strGroupID as strPAdminGroupID,

            t5.fBaccaratR AS fVAdminBaccaratR,
            t5.fSlotR as fVAdminSlotR,
            t5.fUnderOverR as fVAdminUnderOverR,
            t5.fPBR as fVAdminPBR,
            t5.fPBSingleR as fVAdminPBSingleR,
            t5.fPBDoubleR as fVAdminPBDoubleR,
            t5.fPBTripleR as fVAdminPBTripleR,
            t5.strID as strVAdminID,
            t5.strGroupID as strVAdminGroupID,

            t6.fBaccaratR AS fAgentBaccaratR,
            t6.fSlotR as fAgentSlotR,
            t6.fUnderOverR as fAgentUnderOverR,
            t6.fPBR as fAgentPBR,
            t6.fPBSingleR as fAgentPBSingleR,
            t6.fPBDoubleR as fAgentPBDoubleR,
            t6.fPBTripleR as fAgentPBTripleR,
            t6.strID as strAgentID,
            t6.strGroupID as strAgentGroupID,

            t7.fBaccaratR AS fShopBaccaratR,
            t7.fSlotR as fShopSlotR,
            t7.fUnderOverR as fShopUnderOverR,
            t7.fPBR as fShopPBR,
            t7.fPBSingleR as fShopPBSingleR,
            t7.fPBDoubleR as fShopPBDoubleR,
            t7.fPBTripleR as fShopPBTripleR,
            t7.strID as strShopID,
            t7.strGroupID as strShopGroupID,

            t8.fBaccaratR AS fUserBaccaratR,
            t8.fSlotR as fUserSlotR,
            t8.fUnderOverR as fUserUnderOverR,
            t8.fPBR as fUserPBR,
            t8.fPBSingleR as fUserPBSingleR,
            t8.fPBDoubleR as fUserPBDoubleR,
            t8.fPBTripleR as fUserPBTripleR,
            t8.strID as strUserID,
            t8.strGroupID as strUserGroupID,

            t8.fRRB as fRRB,
            t8.fRRUO as fRRUO,
            t8.fRRS as fRRS,
            t8.iRRTurn as iRRTurn


        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        LEFT JOIN Users AS t7 ON t7.iParentID = t6.id
        LEFT JOIN Users AS t8 ON t8.iParentID = t7.id
        WHERE t8.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strHQID = result[0].strHQID,
            objectOdds.strHQGroupID = result[0].strHQGroupID,

            objectOdds.strVHQID = result[0].strVHQID,
            objectOdds.strVHQGroupID = result[0].strVHQGroupID,

            objectOdds.strAdminID = result[0].strAdminID,
            objectOdds.strAdminGroupID = result[0].strAdminGroupID,

            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strAgentID = result[0].strAgentID;
            objectOdds.strShopID = result[0].strShopID;
            objectOdds.strUserID = result[0].strUserID;

            objectOdds.strPAdminGroupID = result[0].strPAdminGroupID;
            objectOdds.strVAdminGroupID = result[0].strVAdminGroupID;
            objectOdds.strAgentGroupID = result[0].strAgentGroupID;
            objectOdds.strShopGroupID = result[0].strShopGroupID;
            objectOdds.strUserGroupID = result[0].strUserGroupID;

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fAgentBaccaratR = result[0].fAgentBaccaratR;
            objectOdds.fAgentSlotR = result[0].fAgentSlotR;
            objectOdds.fAgentUnderOverR = result[0].fAgentUnderOverR;
            objectOdds.fAgentPBR = result[0].fAgentPBR;
            objectOdds.fAgentPBSingleR = result[0].fAgentPBSingleR;
            objectOdds.fAgentPBDoubleR = result[0].fAgentPBDoubleR;
            objectOdds.fAgentPBTripleR = result[0].fAgentPBTripleR;

            objectOdds.fShopBaccaratR = result[0].fShopBaccaratR;
            objectOdds.fShopSlotR = result[0].fShopSlotR;
            objectOdds.fShopUnderOverR = result[0].fShopUnderOverR;
            objectOdds.fShopPBR = result[0].fShopPBR;
            objectOdds.fShopPBSingleR = result[0].fShopPBSingleR;
            objectOdds.fShopPBDoubleR = result[0].fShopPBDoubleR;
            objectOdds.fShopPBTripleR = result[0].fShopPBTripleR;

            objectOdds.fUserBaccaratR = result[0].fUserBaccaratR;
            objectOdds.fUserSlotR = result[0].fUserSlotR;
            objectOdds.fUserUnderOverR = result[0].fUserUnderOverR;
            objectOdds.fUserPBR = result[0].fUserPBR;
            objectOdds.fUserPBSingleR = result[0].fUserPBSingleR;
            objectOdds.fUserPBDoubleR = result[0].fUserPBDoubleR;
            objectOdds.fUserPBTripleR = result[0].fUserPBTripleR;

            objectOdds.fRRB = result[0].fRRB;
            objectOdds.fRRUO = result[0].fRRUO;
            objectOdds.fRRS = result[0].fRRS;
            objectOdds.iRRTurn = result[0].iRRTurn;
        }
        return objectOdds;
    }
    return null;
    //console.log(objectOdds);

    //return objectOdds;
}

exports.FullCalculteOdds = async (listDB) => {

    let listOdds = [];

    for ( let i in listDB )
    {
        await this.GetOdds(listDB[i].strID, listDB[i].iClass, listOdds);
    }

    return listOdds;
}

exports.GetOdds = async (strID, iClass, list) => {
    
    let obj = this.FindOdd(strID, list);
    if ( obj != null )
    {
        console.log(`########## FindOdd`);
        return obj;
    }
    
    obj = await this.CalculateOdds(strID, iClass);
    if ( obj != null )
    {
        let ret = {strID:strID, objectData:obj};
        list.push(ret);
        console.log(`########## CalculateOdds`);
        return ret;
    }
    return null;
}

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

let GetDefaultData = (strID) => {

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

        iNumPlayB:0,
        iNumPlayUO:0,
        iNumPlayS:0,

        iBetB2:0,
        iBetUO2:0,
        iBetS2:0,
        iBetPB2:0,
    }

    return objectData;
}

let ProcessOverviewUnit = (strDate, strID, strGroupID, iClass, 
    iBetB, iBetUO, iBetS, iBetPB, 
    iWinB, iWinUO, iWinS, iWinPB,
    iRollingB, iRollingUO, iRollingS, iRollingPBA, iRollingPBB, 
    iAgentBetB, iAgentBetUO, iAgentBetS, iAgentBetPB,
    iAgentWinB, iAgentWinUO, iAgentWinS, iAgentWinPB,
    iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, iNumPlayB, iNumPlayUO, iNumPlayS, iAgentBetB2, iAgentBetUO2, iAgentBetS2, iAgentBetPB2) => {

    let oData = {
        strDate:strDate,
        strID:strID,
        strGroupID:strGroupID,
        iClass:iClass,
        iInput:0,
        iOutput:0,
        iExchange:0,
        iBetB:iBetB,
        iBetUO:iBetUO,
        iBetS:iBetS,
        iBetPB:iBetPB,
        iWinB:iWinB,
        iWinUO:iWinUO,
        iWinS:iWinS,
        iWinPB:iWinPB,
        iRollingB:iRollingB,
        iRollingUO:iRollingUO,
        iRollingS:iRollingS,
        iRollingPBA:iRollingPBA,
        iRollingPBB:iRollingPBB,
        iAgentBetB:iAgentBetB,
        iAgentBetUO:iAgentBetUO,
        iAgentBetS:iAgentBetS,
        iAgentBetPB:iAgentBetPB,
        iAgentWinB:iAgentWinB,
        iAgentWinUO:iAgentWinUO,
        iAgentWinS:iAgentWinS,
        iAgentWinPB:iAgentWinPB,
        iAgentRollingB:iAgentRollingB,
        iAgentRollingUO:iAgentRollingUO,
        iAgentRollingS:iAgentRollingS,
        iAgentRollingPBA:iAgentRollingPBA,
        iAgentRollingPBB:iAgentRollingPBB,
        iNumPlayB:iNumPlayB,
        iNumPlayUO:iNumPlayUO,
        iNumPlayS:iNumPlayS,
        iAgentBetB2:iAgentBetB2,
        iAgentBetUO2:iAgentBetUO2,
        iAgentBetS2:iAgentBetS2,
        iAgentBetPB2:iAgentBetPB2,

    }

    return oData;
}

let FindOverviewUnit = (list, strDate, strID) => {

    for ( let i in list )
    {
        const data = list[i];

        if ( data.strDate == strDate && data.strID == strID )
            return list[i];
    }
    return null;
}

exports.JoinGroupDailyOverview = (list, listAdd) =>
{
    for ( let i in listAdd )
    {
        let found = FindOverviewUnit(list, listAdd[i].strDate, listAdd[i].strID);
        if ( found )
        {
            const add = listAdd[i];

            found.iBetB = found.iBetB + add.iBetB;
            found.iBetUO = found.iBetUO + add.iBetUO;
            found.iBetS = found.iBetS + add.iBetS;
            found.iBetPB = found.iBetPB + add.iBetPB;
            found.iWinB = found.iWinB + add.iWinB;
            found.iWinUO = found.iWinUO + add.iWinUO;
            found.iWinS = found.iWinS + add.iWinS;
            found.iWinPB = found.iWinPB + add.iWinPB;
            found.iRollingB = found.iRollingB + add.iRollingB;
            found.iRollingUO = found.iRollingUO + add.iRollingUO;
            found.iRollingS = found.iRollingS + add.iRollingS;
            found.iRollingPBA = found.iRollingPBA + add.iRollingPBA;
            found.iRollingPBB = found.iRollingPBB + add.iRollingPBB;
            found.iAgentBetB = found.iAgentBetB + add.iAgentBetB;
            found.iAgentBetUO = found.iAgentBetUO + add.iAgentBetUO;
            found.iAgentBetS = found.iAgentBetS + add.iAgentBetS;
            found.iAgentBetPB = found.iAgentBetPB + add.iAgentBetPB;
            found.iAgentWinB = found.iAgentWinB + add.iAgentWinB;
            found.iAgentWinUO = found.iAgentWinUO + add.iAgentWinUO;
            found.iAgentWinS = found.iAgentWinS + add.iAgentWinS;
            found.iAgentWinPB = found.iAgentWinPB + add.iAgentWinPB;
            found.iAgentRollingB = found.iAgentRollingB + add.iAgentRollingB;
            found.iAgentRollingUO = found.iAgentRollingUO + add.iAgentRollingUO;
            found.iAgentRollingS = found.iAgentRollingS + add.iAgentRollingS;
            found.iAgentRollingPBA = found.iAgentRollingPBA + add.iAgentRollingPBA;
            found.iAgentRollingPBB = found.iAgentRollingPBB + add.iAgentRollingPBB;

            found.iNumPlayB = found.iNumPlayB + add.iNumPlayB;
            found.iNumPlayUO = found.iNumPlayUO + add.iNumPlayUO;
            found.iNumPlayS = found.iNumPlayS + add.iNumPlayS;

            found.iAgentBetB2 = found.iAgentBetB2 + add.iAgentBetB2;
            found.iAgentBetUO2 = found.iAgentBetUO2 + add.iAgentBetUO2;
            found.iAgentBetS2 = found.iAgentBetS2 + add.iAgentBetS2;
            found.iAgentBetPB2 = found.iAgentBetPB2 + add.iAgentBetPB2;
        }
        else
        {
            list.push(listAdd[i]);
        }
    }    
}

let GetPlayingCount = (objectArg) => {

    let objectRet = {iNumPlayB:0, iNumPlayUO:0, iNumPlayS:0};

    if ( objectArg.iBetB > 0 )
        objectRet.iNumPlayB = 1;
    if ( objectArg.iBetUO > 0 )
        objectRet.iNumPlayUO = 1;
    if ( objectArg.iBetS > 0 )
        objectRet.iNumPlayS = 1;

    return objectRet;
}

let ProcessGroupDailyOverview = (objectRolling, objectArg, strDate) => {

    console.log(`##### ProcessGroupDailyOverview`);
    // console.log(objectRolling);
    // console.log(objectArg);

    const o = objectRolling;
    const oa = objectArg;
    
    let listFinal = [];
    
    let iAgentRollingB = oa.iPAdminRB + oa.iVAdminRB + oa.iAgentRB + oa.iShopRB + oa.iUserRB;
    let iAgentRollingUO = oa.iPAdminRUO + oa.iVAdminRUO + oa.iAgentRUO + oa.iShopRUO + oa.iUserRUO;
    let iAgentRollingS = oa.iPAdminRS + oa.iVAdminRS + oa.iAgentRS + oa.iShopRS + oa.iUserRS;
    let iAgentRollingPBA = oa.iPAdminRPBA + oa.iVAdminRPBA + oa.iAgentRPBA + oa.iShopRPBA + oa.iUserRPBA;
    let iAgentRollingPBB = oa.iPAdminRPBB + oa.iVAdminRPBB + oa.iAgentRPBB + oa.iShopRPBB + oa.iUserRPBB;

    let iNumPlayB = 0;

    //  HQ
    let oData = ProcessOverviewUnit(strDate, o.strHQID, o.strHQGroupID, 1, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 
        oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
        iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
    listFinal.push(oData);

    //  V-HQ
    oData = ProcessOverviewUnit(strDate, o.strVHQID, o.strVHQGroupID, 2, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 
        oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
        iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
    listFinal.push(oData);

    //  ADMIN
    oData = ProcessOverviewUnit(strDate, o.strAdminID, o.strAdminGroupID, 3, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 
        oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
        iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
    listFinal.push(oData);

    //  PADMIN
    oData = ProcessOverviewUnit(strDate, o.strPAdminID, o.strPAdminGroupID, 4, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        oa.iPAdminRB, oa.iPAdminRUO, oa.iPAdminRS, oa.iPAdminRPBA, oa.iPAdminRPBB, 
        oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
        iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
    listFinal.push(oData);

    //  VADMIN
    iAgentRollingB = oa.iVAdminRB + oa.iAgentRB + oa.iShopRB + oa.iUserRB;
    iAgentRollingUO = oa.iVAdminRUO + oa.iAgentRUO + oa.iShopRUO + oa.iUserRUO;
    iAgentRollingS = oa.iVAdminRS + oa.iAgentRS + oa.iShopRS + oa.iUserRS;
    iAgentRollingPBA = oa.iVAdminRPBA + oa.iAgentRPBA + oa.iShopRPBA + oa.iUserRPBA;
    iAgentRollingPBB = oa.iVAdminRPBB + oa.iAgentRPBB + oa.iShopRPBB + oa.iUserRPBB;

    oData = ProcessOverviewUnit(strDate, o.strVAdminID, o.strVAdminGroupID, 5, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        oa.iVAdminRB, oa.iVAdminRUO, oa.iVAdminRS, oa.iVAdminRPBA, oa.iVAdminRPBB, 
        oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
        iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
    listFinal.push(oData);

    //const cCount = GetPlayingCount(oa);

    if ( o.strUserID != '' )
    {
        //  AGENT
        iAgentRollingB = oa.iAgentRB + oa.iShopRB + oa.iUserRB;
        iAgentRollingUO = oa.iAgentRUO + oa.iShopRUO + oa.iUserRUO;
        iAgentRollingS = oa.iAgentRS + oa.iShopRS + oa.iUserRS;
        iAgentRollingPBA = oa.iAgentRPBA + oa.iShopRPBA + oa.iUserRPBA;
        iAgentRollingPBB = oa.iAgentRPBB + oa.iShopRPBB + oa.iUserRPBB;


        oData = ProcessOverviewUnit(strDate, o.strAgentID, o.strAgentGroupID, 6, 
            0, 0, 0, 0, 0, 0, 0, 0, 
            oa.iAgentRB, oa.iAgentRUO, oa.iAgentRS, oa.iAgentRPBA, oa.iAgentRPBB, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
            iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
        listFinal.push(oData);

        //  SHOP
        iAgentRollingB = oa.iShopRB + oa.iUserRB;
        iAgentRollingUO = oa.iShopRUO + oa.iUserRUO;
        iAgentRollingS = oa.iShopRS + oa.iUserRS;
        iAgentRollingPBA = oa.iShopRPBA + oa.iUserRPBA;
        iAgentRollingPBB = oa.iShopRPBB + oa.iUserRPBB;

        oData = ProcessOverviewUnit(strDate, o.strShopID, o.strShopGroupID, 7, 
            0, 0, 0, 0, 0, 0, 0, 0, 
            oa.iShopRB, oa.iShopRUO, oa.iShopRS, oa.iShopRPBA, oa.iShopRPBB, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
            iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
        listFinal.push(oData);

        //  USER
        iAgentRollingB = oa.iUserRB;
        iAgentRollingUO = oa.iUserRUO;
        iAgentRollingS = oa.iUserRS;
        iAgentRollingPBA = oa.iUserRPBA;
        iAgentRollingPBB = oa.iUserRPBB;

        oData = ProcessOverviewUnit(strDate, o.strUserID, o.strUserGroupID, 8,
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB, 
            oa.iUserRB, oa.iUserRUO, oa.iUserRS, oa.iUserRPBA, oa.iUserRPBB, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
            iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, oa.iNumPlayB, oa.iNumPlayUO, oa.iNumPlayS, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
        listFinal.push(oData);
    }
    else if ( o.strShopID != '' )
    {
        //  AGENT
        iAgentRollingB = oa.iAgentRB + oa.iShopRB + oa.iUserRB;
        iAgentRollingUO = oa.iAgentRUO + oa.iShopRUO + oa.iUserRUO;
        iAgentRollingS = oa.iAgentRS + oa.iShopRS + oa.iUserRS;
        iAgentRollingPBA = oa.iAgentRPBA + oa.iShopRPBA + oa.iUserRPBA;
        iAgentRollingPBB = oa.iAgentRPBB + oa.iShopRPBB + oa.iUserRPBB;

        oData = ProcessOverviewUnit(strDate, o.strAgentID, o.strAgentGroupID, 6, 
            0, 0, 0, 0, 0, 0, 0, 0, 
            oa.iAgentRB, oa.iAgentRUO, oa.iAgentRS, oa.iAgentRPBA, oa.iAgentRPBB, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
            iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, 0, 0, 0, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
        listFinal.push(oData);

        //  SHOP
        iAgentRollingB = oa.iShopRB + oa.iUserRB;
        iAgentRollingUO = oa.iShopRUO + oa.iUserRUO;
        iAgentRollingS = oa.iShopRS + oa.iUserRS;
        iAgentRollingPBA = oa.iShopRPBA + oa.iUserRPBA;
        iAgentRollingPBB = oa.iShopRPBB + oa.iUserRPBB;

        oData = ProcessOverviewUnit(strDate, o.strShopID, o.strShopGroupID, 7, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB, 
            oa.iShopRB, oa.iShopRUO, oa.iShopRS, oa.iShopRPBA, oa.iShopRPBB, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
            iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, oa.iNumPlayB, oa.iNumPlayUO, oa.iNumPlayS, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
        listFinal.push(oData);
    }
    else if ( o.strAgentID != '' )
    {
        //  AGENT
        iAgentRollingB = oa.iAgentRB + oa.iShopRB + oa.iUserRB;
        iAgentRollingUO = oa.iAgentRUO + oa.iShopRUO + oa.iUserRUO;
        iAgentRollingS = oa.iAgentRS + oa.iShopRS + oa.iUserRS;
        iAgentRollingPBA = oa.iAgentRPBA + oa.iShopRPBA + oa.iUserRPBA;
        iAgentRollingPBB = oa.iAgentRPBB + oa.iShopRPBB + oa.iUserRPBB;

        oData = ProcessOverviewUnit(strDate, o.strAgentID, o.strAgentGroupID, 6, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB, 
            oa.iAgentRB, oa.iAgentRUO, oa.iAgentRS, oa.iAgentRPBA, oa.iAgentRPBB, 
            oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
            iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB, oa.iNumPlayB, oa.iNumPlayUO, oa.iNumPlayS, oa.iBetB2, oa.iBetUO2, oa.iBetS2, oa.iBetPB2);
        listFinal.push(oData);
    }

    // if ( o.strAgentID != '' )
    // {
    //     //  AGENT
    //     iAgentRollingB = oa.iAgentRB + oa.iShopRB + oa.iUserRB;
    //     iAgentRollingUO = oa.iAgentRUO + oa.iShopRUO + oa.iUserRUO;
    //     iAgentRollingS = oa.iAgentRS + oa.iShopRS + oa.iUserRS;
    //     iAgentRollingPBA = oa.iAgentRPBA + oa.iShopRPBA + oa.iUserRPBA;
    //     iAgentRollingPBB = oa.iAgentRPBB + oa.iShopRPBB + oa.iUserRPBB;

    //     oData = ProcessOverviewUnit(strDate, o.strAgentID, o.strAgentGroupID, 6, 
    //         0, 0, 0, 0, 0, 0, 0, 0, 
    //         oa.iAgentRB, oa.iAgentRUO, oa.iAgentRS, oa.iAgentRPBA, oa.iAgentRPBB, 
    //         oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
    //         iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB);
    //     listFinal.push(oData);
    // }    

    // if ( o.strShopID != '' )
    // {
    //     //  SHOP
    //     iAgentRollingB = oa.iShopRB + oa.iUserRB;
    //     iAgentRollingUO = oa.iShopRUO + oa.iUserRUO;
    //     iAgentRollingS = oa.iShopRS + oa.iUserRS;
    //     iAgentRollingPBA = oa.iShopRPBA + oa.iUserRPBA;
    //     iAgentRollingPBB = oa.iShopRPBB + oa.iUserRPBB;

    //     oData = ProcessOverviewUnit(strDate, o.strShopID, o.strShopGroupID, 7, 
    //         0, 0, 0, 0, 0, 0, 0, 0, 
    //         oa.iShopRB, oa.iShopRUO, oa.iShopRS, oa.iShopRPBA, oa.iShopRPBB, 
    //         oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
    //         iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB);
    //     listFinal.push(oData);
    // }

    // if ( o.strUserID != '' )
    // {
    //     //  USER
    //     iAgentRollingB = oa.iUserRB;
    //     iAgentRollingUO = oa.iUserRUO;
    //     iAgentRollingS = oa.iUserRS;
    //     iAgentRollingPBA = oa.iUserRPBA;
    //     iAgentRollingPBB = oa.iUserRPBB;

    //     oData = ProcessOverviewUnit(strDate, o.strUserID, o.strUserGroupID, 8,
    //         oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB, 
    //         oa.iUserRB, oa.iUserRUO, oa.iUserRS, oa.iUserRPBA, oa.iUserRPBB, 
    //         oa.iBetB, oa.iBetUO, oa.iBetS, oa.iBetPB, oa.iWinB, oa.iWinUO, oa.iWinS, oa.iWinPB,
    //         iAgentRollingB, iAgentRollingUO, iAgentRollingS, iAgentRollingPBA, iAgentRollingPBB);
    //     listFinal.push(oData);
    // }
    
    return listFinal;    
}

exports.UpdateOverview = async (list, listOverviewDB) => {

    // console.log(`UpdateOverview~!~~~~!!!!!!!!!!!!!`);
    // for ( let i in listOverviewDB )
    // {
    //     if(listOverviewDB[i].strID == 'unover0405')
    //         console.log(listOverviewDB[i]);
    // }
    
    if ( list.length > 0 )
    {
        console.log(`################################################################################## listOverview : Length ${list.length}`);
        console.log(list);
        for ( let index in list )
        {
            const t = list[index];
            console.log(`###################################### t ${t.strID}, ${t.strDate}`);
            // console.log(t);

            // if ( t.iClass == 1 )
            //     continue;
            
            //const dbdata = await db.RecordDailyOverviews.findOne({where:{strID:t.strID, strDate:t.strDate}});
            const dbdata = this.GetOverviewDB(t.strID, listOverviewDB);
            // console.log('db');
            // console.log(dbdata);

            // 소수점 정리
            // const cRolling = parseInt(t.iRollingB) + parseInt(t.iRollingUO) + parseInt(t.iRollingS) + parseInt(t.iRollingPBA) + parseInt(t.iRollingPBB);
            const cRolling = t.iRollingB + t.iRollingUO + t.iRollingS + t.iRollingPBA + t.iRollingPBB; // 요게 맞음
            
            //const cRolling = t.iRollingB/fBaccaratRR+ t.iRollingUO + t.iRollingS/fSlotRR + t.iRollingPBA + t.iRollingPBB; // 요게 맞음

            //continue;
            console.log(`##### cRolling : ${cRolling}, strID : ${t.strID}`);

            await db.Users.increment({iRolling:cRolling}, {where:{strID:t.strID}});

            if ( dbdata == null )
            {
                console.log('null');
                await db.RecordDailyOverviews.create({
                    strDate:t.strDate,
                    strID:t.strID,
                    strGroupID:t.strGroupID,
                    iClass:t.iClass,
                    iInput:0,
                    iOutput:0,
                    iExchange:0,
                    iBetB:t.iBetB,
                    iBetUO:t.iBetUO,
                    iBetS:t.iBetS,
                    iBetPB:t.iBetPB,
                    iWinB:t.iWinB,
                    iWinUO:t.iWinUO,
                    iWinS:t.iWinS,
                    iWinPB:t.iWinPB,
                    iRollingB:t.iRollingB,
                    iRollingUO:t.iRollingUO,
                    iRollingS:t.iRollingS,
                    iRollingPBA:t.iRollingPBA,
                    iRollingPBB:t.iRollingPBB,
                    iAgentBetB:t.iAgentBetB,
                    iAgentBetUO:t.iAgentBetUO,
                    iAgentBetS:t.iAgentBetS,
                    iAgentBetPB:t.iAgentBetPB,
                    iAgentWinB:t.iAgentWinB,
                    iAgentWinUO:t.iAgentWinUO,
                    iAgentWinS:t.iAgentWinS,
                    iAgentWinPB:t.iAgentWinPB,
                    iAgentRollingB:t.iAgentRollingB,
                    iAgentRollingUO:t.iAgentRollingUO,
                    iAgentRollingS:t.iAgentRollingS,
                    iAgentRollingPBA:t.iAgentRollingPBA,
                    iAgentRollingPBB:t.iAgentRollingPBB,
                    iNumPlayB:t.iNumPlayB,
                    iNumPlayUO:t.iNumPlayUO,
                    iNumPlayS:t.iNumPlayS,
                    iAgentBetB2:t.iAgentBetB2,
                    iAgentBetUO2:t.iAgentBetUO2,
                    iAgentBetS2:t.iAgentBetS2,
                    iAgentBetPB2:t.iAgentBetPB2,
                });
            }
            else
            {
                const iNumPlayB = dbdata.iNumPlayB != null ? dbdata.iNumPlayB+t.iNumPlayB : t.iNumPlayB;
                const iNumPlayUO = dbdata.iNumPlayUO != null ? dbdata.iNumPlayUO+t.iNumPlayUO : t.iNumPlayUO; 
                const iNumPlayS = dbdata.iNumPlayS != null ? dbdata.iNumPlayS+t.iNumPlayS : t.iNumPlayS;

                console.log('##### NOT NULL');
                console.log(t);
                await db.RecordDailyOverviews.update(
                    {
                        iBetB:dbdata.iBetB+t.iBetB,
                        iBetUO:dbdata.iBetUO+t.iBetUO,
                        iBetS:dbdata.iBetS+t.iBetS,
                        iBetPB:dbdata.iBetPB+t.iBetPB,
                        iWinB:dbdata.iWinB+t.iWinB,
                        iWinUO:dbdata.iWinUO+t.iWinUO,
                        iWinS:dbdata.iWinS+t.iWinS,
                        iWinPB:dbdata.iWinPB+t.iWinPB,
                        iRollingB:dbdata.iRollingB+t.iRollingB,
                        iRollingUO:dbdata.iRollingUO+t.iRollingUO,
                        iRollingS:dbdata.iRollingS+t.iRollingS,
                        iRollingPBA:dbdata.iRollingPBA+t.iRollingPBA,
                        iRollingPBB:dbdata.iRollingPBB+t.iRollingPBB,
                        iAgentBetB:dbdata.iAgentBetB+t.iAgentBetB,
                        iAgentBetUO:dbdata.iAgentBetUO+t.iAgentBetUO,
                        iAgentBetS:dbdata.iAgentBetS+t.iAgentBetS,
                        iAgentBetPB:dbdata.iAgentBetPB+t.iAgentBetPB,
                        iAgentWinB:dbdata.iAgentWinB+t.iAgentWinB,
                        iAgentWinUO:dbdata.iAgentWinUO+t.iAgentWinUO,
                        iAgentWinS:dbdata.iAgentWinS+t.iAgentWinS,
                        iAgentWinPB:dbdata.iAgentWinPB+t.iAgentWinPB,
                        iAgentRollingB:dbdata.iAgentRollingB+t.iAgentRollingB,
                        iAgentRollingUO:dbdata.iAgentRollingUO+t.iAgentRollingUO,
                        iAgentRollingS:dbdata.iAgentRollingS+t.iAgentRollingS,
                        iAgentRollingPBA:dbdata.iAgentRollingPBA+t.iAgentRollingPBA,
                        iAgentRollingPBB:dbdata.iAgentRollingPBB+t.iAgentRollingPBB,
                        iNumPlayB:iNumPlayB,
                        iNumPlayUO:iNumPlayUO,
                        iNumPlayS:iNumPlayS,
                        iAgentBetB2:dbdata.iAgentBetB2 + t.iAgentBetB2,
                        iAgentBetUO2:dbdata.iAgentBetUO2 + t.iAgentBetUO2,
                        iAgentBetS2:dbdata.iAgentBetS2 + t.iAgentBetS2,
                        iAgentBetPB2:dbdata.iAgentBetPB2 + t.iAgentBetPB2,
                    },
                    {where:{strID:t.strID, strDate:t.strDate}});
            }
        }
    }
}

exports.GetRollingString = (objectData) => {
    
    const str = `${objectData.iPAdminRB},${objectData.iVAdminRB},${objectData.iAgentRB},${objectData.iShopRB},${objectData.iUserRB},${objectData.iPAdminRUO},${objectData.iVAdminRUO},${objectData.iAgentRUO},${objectData.iShopRUO},${objectData.iUserRUO},${objectData.iPAdminRS},${objectData.iVAdminRS},${objectData.iAgentRS},${objectData.iShopRS},${objectData.iUserRS},${objectData.iPAdminRPBA},${objectData.iVAdminRPBA},${objectData.iAgentRPBA},${objectData.iShopRPBA},${objectData.iUserRPBA},${objectData.iPAdminRPBB},${objectData.iVAdminRPBB},${objectData.iAgentRPBB},${objectData.iShopRPBB},${objectData.iUserRPBB},${objectData.iBetB},${objectData.iBetUO},${objectData.iBetS},${objectData.iBetPB},${objectData.iWinB},${objectData.iWinUO},${objectData.iWinS},${objectData.iWinPB},`

    return str;
//    return `${iPAdminR}:${iVAdminR}:${iAgentR}:${iShopR}:${iUserR}`;
}

let GetCancelValue = (value, eType) => {

    let cValue = parseInt(value);
    if ( cValue == 0 )
        return 0;

    return -cValue;
}

exports.ProcessRollingCancel = (oRO, strOverview, strDate, eType) => {

    console.log('##### Process Rolling Cancel')
    console.log(oRO);

    let array = strOverview.split(',');
    //0,4,4,6,6,0,8,16,36,20,
    //0,0,0,0,0,0,0,0,0,0,
    //0,0,0,0,0,2000,4000,0,0,2000,
    //2600,0,0,

    console.log(`##### ProcessRollingCancel`);
    console.log(array);

    let objectData = {
        strID:oRO.strID,

        iPAdminRB:GetCancelValue(array[0]),
        iVAdminRB:GetCancelValue(array[1]),
        iAgentRB:GetCancelValue(array[2]),
        iShopRB:GetCancelValue(array[3]),
        iUserRB:GetCancelValue(array[4]),

        iPAdminRUO:GetCancelValue(array[5]),
        iVAdminRUO:GetCancelValue(array[6]),
        iAgentRUO:GetCancelValue(array[7]),
        iShopRUO:GetCancelValue(array[8]),
        iUserRUO:GetCancelValue(array[9]),

        iPAdminRS:GetCancelValue(array[10]),
        iVAdminRS:GetCancelValue(array[11]),
        iAgentRS:GetCancelValue(array[12]),
        iShopRS:GetCancelValue(array[13]),
        iUserRS:GetCancelValue(array[14]),

        iPAdminRPBA:GetCancelValue(array[15]),
        iVAdminRPBA:GetCancelValue(array[16]),
        iAgentRPBA:GetCancelValue(array[17]),
        iShopRPBA:GetCancelValue(array[18]),
        iUserRPBA:GetCancelValue(array[19]),

        iPAdminRPBB:GetCancelValue(array[20]),
        iVAdminRPBB:GetCancelValue(array[21]),
        iAgentRPBB:GetCancelValue(array[22]),
        iShopRPBB:GetCancelValue(array[23]),
        iUserRPBB:GetCancelValue(array[24]),

        iBetB:GetCancelValue(array[25]),
        iBetUO:GetCancelValue(array[26]),
        iBetS:GetCancelValue(array[27]),
        iBetPB:GetCancelValue(array[28]),

        iWinB:GetCancelValue(array[29]),
        iWinUO:GetCancelValue(array[30]),
        iWinS:GetCancelValue(array[31]),
        iWinPB:GetCancelValue(array[32]),

        iWinLoseB:0,
        iWinLoseUO:0,
        iWinLoseS:0,
        iWinLosePB:0,
    }

    if ( eType == 'BET' )
    {
        objectData.iWinB = 0;
        objectData.iWinUO = 0;
        objectData.iWinS = 0;
        objectData.iWinPB = 0;
    }
    else if ( eType == 'WIN' )
    {
        objectData.iPAdminRB = 0;
        objectData.iVAdminRB = 0;
        objectData.iAgentRB = 0;
        objectData.iShopRB = 0;
        objectData.iUserRB = 0;

        objectData.iPAdminRUO = 0;
        objectData.iVAdminRUO = 0;
        objectData.iAgentRUO = 0;
        objectData.iShopRUO = 0;
        objectData.iUserRUO = 0;

        objectData.iPAdminRS = 0;
        objectData.iVAdminRS = 0;
        objectData.iAgentRS = 0;
        objectData.iShopRS = 0;
        objectData.iUserRS = 0;

        objectData.iPAdminRPBA = 0;
        objectData.iVAdminRPBA = 0;
        objectData.iAgentRPBA = 0;
        objectData.iShopRPBA = 0;
        objectData.iUserRPBA = 0;

        objectData.iPAdminRPBB = 0;
        objectData.iVAdminRPBB = 0;
        objectData.iAgentRPBB = 0;
        objectData.iShopRPBB = 0;
        objectData.iUserRPBB = 0;

        objectData.iBetB = 0;
        objectData.iBetUO = 0;
        objectData.iBetS = 0;
        objectData.iBetPB = 0;
    }

    const o = oRO.objectData;
    console.log(o);

    let listFinal = ProcessGroupDailyOverview(o, objectData, strDate);

    return listFinal;
    //return objectData;
}


exports.ProcessRolling = (oRO, listBet, cPBType, cPBTarget, strDate, listOverviewDB) => {

    console.log('##### Process Rolling')
    console.log(oRO);
    console.log(listBet);

    let objectData = GetDefaultData(oRO.strID);

    const o = oRO.objectData;
    console.log(o);

    const oOverview = this.GetOverviewDB(oRO.strID, listOverviewDB);


    for ( let i in listBet )
    {
        const cBet = listBet[i];
        const cBetAmount = parseInt(cBet.iBet);
        const cWinAmount = parseInt(cBet.iWin);

        let cBetAmount2 = cBetAmount;

        console.log(`cBet : ${cBet}, cBetAmount : ${cBetAmount}`);
        switch ( cBet.iGameCode )
        {
            case Enum.EGameCode.UnderOver:
                console.log(`##### 100`);

                objectData.iBetUO += cBetAmount;
                objectData.iWinUO += cWinAmount;
                objectData.iWinLoseUO += (cBetAmount-cWinAmount);

                // if ( oOverview != null && oOverview.iNumPlayUO > 20 )
                // {
                //     cBetAmount2 = parseInt(cBetAmount2/o.fRRUO);
                // }
                objectData.iPAdminRUO += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminUnderOverR, o.fVAdminUnderOverR);
                objectData.iVAdminRUO += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminUnderOverR, o.fAgentUnderOverR);
                objectData.iAgentRUO += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentUnderOverR, o.fShopUnderOverR);
                objectData.iShopRUO += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopUnderOverR, o.fUserUnderOverR);
                objectData.iUserRUO += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserUnderOverR, 0);
           
                objectData.iBetUO2 += cBetAmount2;

                objectData.iNumPlayUO += 1;
                break;
            case Enum.EGameCode.Slot:
                console.log(`##### 200`);

                objectData.iBetS += cBetAmount;
                objectData.iWinS += cWinAmount;
                objectData.iWinLoseS += (cBetAmount-cWinAmount);

                if ( oOverview != null && oOverview.iNumPlayS > o.iRRTurn )
                {
                    cBetAmount2 = GetNumberUnit(cBetAmount, o.fRRS);
                }
                objectData.iPAdminRS += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminSlotR, o.fVAdminSlotR);
                objectData.iVAdminRS += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminSlotR, o.fAgentSlotR);
                objectData.iAgentRS += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentSlotR, o.fShopSlotR);
                objectData.iShopRS += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopSlotR, o.fUserSlotR);
                objectData.iUserRS += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserSlotR, 0);

                objectData.iBetS2 += cBetAmount2;
                objectData.iNumPlayS += 1;
                break;
            default:
                console.log(`##### 0`);

                objectData.iBetB += cBetAmount;
                objectData.iWinB += cWinAmount;
                objectData.iWinLoseB += (cBetAmount-cWinAmount);

                if ( oOverview != null && oOverview.iNumPlayB > o.iRRTurn )
                {
                    cBetAmount2 = GetNumberUnit(cBetAmount, o.fRRB);
                }
                objectData.iPAdminRB += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminBaccaratR, o.fVAdminBaccaratR);
                objectData.iVAdminRB += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminBaccaratR, o.fAgentBaccaratR);
                objectData.iAgentRB += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentBaccaratR, o.fShopBaccaratR);
                objectData.iShopRB += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopBaccaratR, o.fUserBaccaratR);
                objectData.iUserRB += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserBaccaratR, 0);

                objectData.iBetB2 += cBetAmount2;
                objectData.iNumPlayB += 1;
                break;
    
        }
    }

    let listFinal = ProcessGroupDailyOverview(o, objectData, strDate);

    return {listFinal:listFinal, objectBet:objectData};
    //return objectData;
}

exports.ProcessRollingBet = (oRO, iGameCode, iBet, strDate, listOverviewDB) => {

    console.log('##### Process Rolling Bet')
    console.log(oRO);

    let objectData = GetDefaultData(oRO.strID);

    const o = oRO.objectData;
    console.log(o);

    const oOverview = this.GetOverviewDB(oRO.strID, listOverviewDB);

    const cBetAmount = parseInt(iBet);
    let cBetAmount2 = cBetAmount;

    console.log(`cBetAmount : ${cBetAmount}, iGameCode : ${iGameCode}`);
    switch ( iGameCode )
    {
        case Enum.EGameCode.UnderOver:
            console.log(`##### 100`);
            objectData.iBetUO += cBetAmount;
            // if ( oOverview != null )
            // {
            //     cBetAmount2 = parseInt(cBetAmount2/o.fRRUO);
            // }
            objectData.iPAdminRUO += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminUnderOverR, o.fVAdminUnderOverR);
            objectData.iVAdminRUO += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminUnderOverR, o.fAgentUnderOverR);
            objectData.iAgentRUO += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentUnderOverR, o.fShopUnderOverR);
            objectData.iShopRUO += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopUnderOverR, o.fUserUnderOverR);
            objectData.iUserRUO += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserUnderOverR, 0);

            objectData.iBetUO2 += cBetAmount2;

            objectData.iNumPlayUO += 1;
            break;
        case Enum.EGameCode.Slot:
            console.log(`##### 200`);
            objectData.iBetS += cBetAmount;
            if ( oOverview != null && oOverview.iNumPlayS > o.iRRTurn )
            {
                cBetAmount2 = GetNumberUnit(cBetAmount, o.fRRS);
            }
            objectData.iPAdminRS += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminSlotR, o.fVAdminSlotR);
            objectData.iVAdminRS += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminSlotR, o.fAgentSlotR);
            objectData.iAgentRS += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentSlotR, o.fShopSlotR);
            objectData.iShopRS += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopSlotR, o.fUserSlotR);
            objectData.iUserRS += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserSlotR, 0);

            objectData.iBetS2 += cBetAmount2;

            objectData.iNumPlayS += 1;
            break;
        default:
            console.log(`##### 0`);

            objectData.iBetB += cBetAmount;
            if ( oOverview != null && oOverview.iNumPlayB > o.iRRTurn )
            {
                cBetAmount2 = GetNumberUnit(cBetAmount, o.fRRB);
            }
            objectData.iPAdminRB += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminBaccaratR, o.fVAdminBaccaratR);
            objectData.iVAdminRB += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminBaccaratR, o.fAgentBaccaratR);
            objectData.iAgentRB += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentBaccaratR, o.fShopBaccaratR);
            objectData.iShopRB += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopBaccaratR, o.fUserBaccaratR);
            objectData.iUserRB += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserBaccaratR, 0);
    
            objectData.iBetB2 += cBetAmount2;

            objectData.iNumPlayB += 1;

        break;
    }
    let listFinal = ProcessGroupDailyOverview(o, objectData, strDate);

    return {listFinal:listFinal, objectBet:objectData};
    //return objectData;
}

//  #####
exports.ProcessRollingWin = (oRO, iGameCode, iWin, strDate) => {

    console.log('##### Process Rolling Win')
    console.log(oRO);

    let objectData = GetDefaultData(oRO.strID);

    const o = oRO.objectData;
    console.log(o);

    const cWinAmount = parseInt(iWin);

    console.log(`cWinAmount : ${cWinAmount}`);
    switch ( iGameCode )
    {
        case Enum.EGameCode.Baccarat:
            objectData.iWinB += cWinAmount;
            break;
        case Enum.EGameCode.UnderOver:
            objectData.iWinUO += cWinAmount;
            break;
        case Enum.EGameCode.Slot:
            objectData.iWinS += cWinAmount;
            break;
        case Enum.EGameCode.PowerBall:
            objectData.iWinPB += cWinAmount;
            break;
        default:
            objectData.iWinB += cWinAmount;
            break;
    }
    let listFinal = ProcessGroupDailyOverview(o, objectData, strDate);

    return {listFinal:listFinal, objectBet:objectData};
    //return objectData;
}

//  #####
exports.ProcessRollingBetWin = (oRO, iGameCode, iBet, iWin, strDate, listOverviewDB) => {

    console.log('##### Process Rolling Win')
    console.log(oRO);

    let objectData = GetDefaultData(oRO.strID);

    const o = oRO.objectData;
    console.log(o);

    const oOverview = this.GetOverviewDB(oRO.strID, listOverviewDB);

    const cBetAmount = parseInt(iBet);
    let cBetAmount2 = cBetAmount;

    console.log(`cBetAmount : ${cBetAmount}, iGameCode : ${iGameCode}`);
    switch ( iGameCode )
    {
        case Enum.EGameCode.UnderOver:
            console.log(`##### 100`);

            objectData.iBetUO += cBetAmount;
            // if ( oOverview != null )
            // {
            //     cBetAmount2 = parseInt(cBetAmount2/o.fRRUO);
            // }
            objectData.iPAdminRUO += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminUnderOverR, o.fVAdminUnderOverR);
            objectData.iVAdminRUO += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminUnderOverR, o.fAgentUnderOverR);
            objectData.iAgentRUO += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentUnderOverR, o.fShopUnderOverR);
            objectData.iShopRUO += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopUnderOverR, o.fUserUnderOverR);
            objectData.iUserRUO += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserUnderOverR, 0);
            
            objectData.iBetUO2 += cBetAmount2;
            
            objectData.iNumPlayUO += 1;
            break;
        case Enum.EGameCode.Slot:
            console.log(`##### 200`);

            objectData.iBetS += cBetAmount;
            if ( oOverview != null && oOverview.iNumPlayS > o.iRRTurn )
            {
                cBetAmount2 = GetNumberUnit(cBetAmount, o.fRRS);
            }
            objectData.iPAdminRS += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminSlotR, o.fVAdminSlotR);
            objectData.iVAdminRS += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminSlotR, o.fAgentSlotR);
            objectData.iAgentRS += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentSlotR, o.fShopSlotR);
            objectData.iShopRS += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopSlotR, o.fUserSlotR);
            objectData.iUserRS += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserSlotR, 0);

            objectData.iBetS2 += cBetAmount2;

            objectData.iNumPlayS += 1;
            break;
        default:
            console.log(`##### 0`);

            objectData.iBetB += cBetAmount;
            if ( oOverview != null && oOverview.iNumPlayB > o.iRRTurn )
            {
                cBetAmount2 = GetNumberUnit(cBetAmount, o.fRRB);
            }
            objectData.iPAdminRB += CalculateRollingAmount(o.strPAdminID, cBetAmount2, o.fPAdminBaccaratR, o.fVAdminBaccaratR);
            objectData.iVAdminRB += CalculateRollingAmount(o.strVAdminID, cBetAmount2, o.fVAdminBaccaratR, o.fAgentBaccaratR);
            objectData.iAgentRB += CalculateRollingAmount(o.strAgentID, cBetAmount2, o.fAgentBaccaratR, o.fShopBaccaratR);
            objectData.iShopRB += CalculateRollingAmount(o.strShopID, cBetAmount2, o.fShopBaccaratR, o.fUserBaccaratR);
            objectData.iUserRB += CalculateRollingAmount(o.strUserID, cBetAmount2, o.fUserBaccaratR, 0);
    
            objectData.iBetB2 += cBetAmount2;

            objectData.iNumPlayB += 1;

        break;
    }

    const cWinAmount = parseInt(iWin);

    console.log(`cWinAmount : ${cWinAmount}`);
    switch ( iGameCode )
    {
        case Enum.EGameCode.Baccarat:
            objectData.iWinB += cWinAmount;
            break;
        case Enum.EGameCode.UnderOver:
            objectData.iWinUO += cWinAmount;
            break;
        case Enum.EGameCode.Slot:
            objectData.iWinS += cWinAmount;
            break;
        case Enum.EGameCode.PowerBall:
            objectData.iWinPB += cWinAmount;
            break;
        default:
            objectData.iWinB += cWinAmount;
            break;
    }
    let listFinal = ProcessGroupDailyOverview(o, objectData, strDate);

    return {listFinal:listFinal, objectBet:objectData};
    //return objectData;
}