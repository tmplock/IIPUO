const ODDS = require('./helpers/odds');

const RDVivo = require('./vender/vivo');
const RDEzugi = require('./vender/ezugi');
const RDCQ9 = require('./vender/cq9');
const RDHLink = require('./vender/honorlink');


let GetElapsedSeconds = (strBaseDate) => {

    let dateCreated = new Date(strBaseDate);
    let dateCurrent = new Date();

    let iDiffSeconds = (dateCurrent.getTime() - dateCreated.getTime()) / 1000;

    return iDiffSeconds;
}

exports.ProcessVivo = (listDB, listOverview, listOdds, listUpdateDB) => {

    for ( let i in listDB )
    {
        const cData = listDB[i];

        let listData = RDVivo.MakeBettingObject(cData.strDetail);
        if ( listData.length > 0 )
        {
            const strDate = cData.createdAt.substr(0,10);

            const cOdd = ODDS.FindOdd(cData.strID, listOdds);
            if ( cOdd == null )
                continue;
            let objectReturn = ODDS.ProcessRolling(cOdd, listData, 0, 0, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;

            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

            const strOverview = ODDS.GetRollingString(objectBetRolling);

            listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:strOverview});

            //await db.RecordBets.update({eState:'COMPLETE', strDetail:'', strResult:'', strOverview:strOverview}, {where:{id:list[i].id}});
        }
        else
        {
            const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
            if ( cElapsedSeconds > 60 )
                //await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
                listUpdateDB.push({id:cData.id, eState:'PENDING'});
        }
        
    }
}

exports.ProcessEzugi = async (listDB, listOverview, listOdds, listUpdateDB) => {

    if ( listDB.length <= 0 )
        return;

    const res = await RDEzugi.GetRangeRD(listDB[0].updatedAt, listDB[listDB.length-1].updatedAt);
    if (res == null)
    {
        // return;
    }

    for ( let i in listDB )
    {
        const cData = listDB[i];

        let listData = RDEzugi.GetRD(res, cData.strUniqueID);
        //TODO: TEST CODE 삭제 필요
        if (listData == null) {
            if (listDB[i].strTableID.indexOf('TEST') != -1) {
                // listData = CreateRoundDetailObj('EZUGI', list[i]);
                listData = RDEzugi.GetTestObj(listDB[i]);
            }
        }

        if (listData != null)
        {
            const strDate = cData.createdAt.substr(0,10);

            const cOdd = ODDS.FindOdd(cData.strID, listOdds);
            if ( cOdd == null )
                continue;
    
            let objectReturn = ODDS.ProcessRolling(cOdd, listData.list, 0, 0, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;
    
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
    
            const strOverview = ODDS.GetRollingString(objectBetRolling);
    
            //await db.RecordBets.update({eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview}, {where:{id:list[i].id}});
            listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview});
        }
        else
        {
            const cElapsedSeconds = GetElapsedSeconds(cData.updatedAt);
            if ( cElapsedSeconds > 60 )
                //await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
                listUpdateDB.push({id:cData.id, eState:'PENDING'});
        }
    }    
}


exports.ProcessCQ9 = async (listDB, listOverview, listOdds, listUpdateDB) => {

    if ( listDB.length <= 0 )
        return;

    const res = await RDCQ9.GetRangeRD(listDB[0].createdAt, listDB[listDB.length - 1].updatedAt);
    console.log(res);

    if (res == null) {
        return;
    }

    for ( let i in listDB )
    {
        const cData = listDB[i];

        const listData = RDCQ9.GetRD(res, cData.strRound, cData.strID);

        if ( listData != null )
        {
            const strDate = cData.createdAt.substr(0,10);

            const cOdd = ODDS.FindOdd(cData.strID, listOdds);
            if ( cOdd == null )
                continue;

            let objectReturn = ODDS.ProcessRolling(cOdd, listData.list, 0, 0, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;

            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

            const strOverview = ODDS.GetRollingString(objectBetRolling);

            //await db.RecordBets.update({eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview}, {where:{id:list[i].id}});
            listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview});
        }
        else
        {
            const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
            if ( cElapsedSeconds > 60 )
                //await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
                listUpdateDB.push({id:cData.id, eState:'PENDING'});
        }
    }
}

exports.ProcessHLink = async (listDB, listOverview, listOdds, listUpdateDB) => {

    console.log(`ProcessHLink`);
    console.log(listDB);
    console.log(listOdds);

    if ( listDB.length <= 0 )
        return;

    let res = await RDHLink.GetRangeRD(listDB[0].createdAt, listDB[listDB.length-1].updatedAt);
    if (res == null) {
        //console.log(`Couldn't get RD`);
        for (let i in listDB)
        {
            const cData = listDB[i];
            //listUpdateDB.push({id:cData.id, eState:'PENDING'});
            listUpdateDB.push({id:cData.id, eType:'BET', eState:'PENDING'});
        }
        return;
    }

    for (let i in listDB)
    {
        const cData = listDB[i];

        console.log(`listDB ${i}`);
        console.log(cData);

        let listData = RDHLink.GetRD(res, cData.strUniqueID);
        if (listData != null)
        {
            const strDate = cData.createdAt.substr(0,10);

            const cOdd = ODDS.FindOdd(cData.strID, listOdds);
            if ( cOdd == null )
                continue;

            let objectReturn = ODDS.ProcessRolling(cOdd, listData.list, 0, 0, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;

            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

            const strOverview = ODDS.GetRollingString(objectBetRolling);

            listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:listData.strBets, strResult:listData.strCards, strOverview:strOverview});
        }
        else
        {
            listUpdateDB.push({id:cData.id, eState:'PENDING'});
        }
    }
}


exports.ProcessBet = (listDB, listOverview, listOdds, listUpdateDB) => {

    for (let i in listDB)
    {
        const cData = listDB[i];

        const strDate = cData.createdAt.substr(0,10);

        const cOdd = ODDS.FindOdd(cData.strID, listOdds);
        if ( cOdd == null )
            continue;

        let objectReturn = ODDS.ProcessRollingBet(cOdd, cData.iGameCode, cData.iBet, strDate);
        let listCurrentOverview = objectReturn.listFinal;
        let objectBetRolling = objectReturn.objectBet;

        ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

        const strOverview = ODDS.GetRollingString(objectBetRolling);

        //await db.RecordBets.update({eState:'COMPLETE', strOverview:strOverview}, {where:{id:list[i].id}});
        listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:strOverview});
    }
}

exports.ProcessWin = (listDB, listOverview, listOdds, listUpdateDB) => {

    for (let i in listDB)
    {
        const cData = listDB[i];

        const strDate = cData.createdAt.substr(0,10);

        const cOdd = ODDS.FindOdd(cData.strID, listOdds);
        if ( cOdd == null )
            continue;

        let objectReturn = ODDS.ProcessRollingWin(odds, cData.iGameCode, cData.iWin, strDate);
        let listCurrentOverview = objectReturn.listFinal;
        //let objectBetRolling = objectReturn.objectBet;

        ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);

        //await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
        listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:''});
    }
}

exports.ProcessCancel = (eType, listDB, listOverview, listOdds, listUpdateDB) => {

    for (let i in listDB)
    {
        const cData = listDB[i];

        const strDate = cData.createdAt.substr(0,10);

        const cOdd = ODDS.FindOdd(cData.strID, listOdds);
        if ( cOdd == null )
            continue;

        if ( listDB[i].strOverview != '' )
        {
            let listCurrentOverview = ODDS.ProcessRollingCancel(cOdd, cData.strOverview, strDate, eType);
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
        }

        //await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
        listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:''});
    }

}