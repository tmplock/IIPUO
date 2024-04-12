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

    const res = await RDEzugi.GetRangeRD(listDB[0].createdAt, listDB[listDB.length-1].updatedAt);
    if (res == null)
    {
        // return;
    }

    for ( let i in listDB )
    {
        const cData = listDB[i];

        let listData = RDEzugi.GetRD(res, cData.strUniqueID);

        console.log(`##### ProcessEzugi listDB[${i}]`);
        console.log(listData);

        //  라운드 디테일 없을 경우
        if (listData != null)
        {
            const strDate = cData.createdAt.substr(0,10);

            const cOdd = ODDS.FindOdd(cData.strID, listOdds);
            if ( cOdd != null )
            {
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
               listUpdateDB.push({id:cData.id, eState:'STANDBY', eType:'BETWIN'});
            }
        }
        else
        {
            listUpdateDB.push({id:cData.id, eState:'STANDBY', eType:'BETWIN'});
            // const cElapsedSeconds = GetElapsedSeconds(cData.updatedAt);
            // if ( cElapsedSeconds > 60 )
            //     //await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
            //     listUpdateDB.push({id:cData.id, eState:'PENDING'});
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
            if ( cOdd != null )
            {
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
                listUpdateDB.push({id:cData.id, eState:'STANDBY', eType:'BETWIN'});
            }
        }
        else
        {
            listUpdateDB.push({id:cData.id, eState:'STANDBY', eType:'BETWIN'});
            // const cElapsedSeconds = GetElapsedSeconds(list[i].updatedAt);
            // if ( cElapsedSeconds > 60 )
            //     //await db.RecordBets.update({eState:'PENDING'}, {where:{id:list[i].id}});
            //     listUpdateDB.push({id:cData.id, eState:'PENDING'});
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

            //let objectReturn = ODDS.ProcessRolling(cOdd, listData.list, 0, 0, strDate);
            let objectReturn = ODDS.ProcessRollingHLink(cOdd, listData.list, 0, 0, strDate, listDB[i].iGameCode, listDB[i].iBet, listDB[i].iWin);
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

        console.log(`###### strOverview : ${strOverview}`);

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

        let objectReturn = ODDS.ProcessRollingWin(cOdd, cData.iGameCode, cData.iWin, strDate);
        let listCurrentOverview = objectReturn.listFinal;
        let objectBetRolling = objectReturn.objectBet;

        ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
        const strOverview = ODDS.GetRollingString(objectBetRolling);

        console.log(`###### strOverview : ${strOverview}`);

        //await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
        //listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:''});
        listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:strOverview});
    }
}

exports.ProcessBetWin = (listDB, listOverview, listOdds, listUpdateDB) => {

    for (let i in listDB)
    {
        const cData = listDB[i];

        const strDate = cData.createdAt.substr(0,10);

        const cOdd = ODDS.FindOdd(cData.strID, listOdds);
        if ( cOdd == null )
            continue;

        let objectReturn = ODDS.ProcessRollingBetWin(cOdd, cData.iGameCode, cData.iBet, cData.iWin, strDate);
        let listCurrentOverview = objectReturn.listFinal;
        let objectBetRolling = objectReturn.objectBet;

        ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
        const strOverview = ODDS.GetRollingString(objectBetRolling);

        console.log(`###### strOverview : ${strOverview}`);

        //await db.RecordBets.update({eState:'COMPLETE'}, {where:{id:list[i].id}});
        listUpdateDB.push({id:cData.id, eState:'COMPLETE', strDetail:'', strResult:'', strOverview:strOverview});
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

exports.ProcessBetRD = (listDB, listUpdateDB) => {

    for (let i in listDB)
    {
        const cData = listDB[i];
        
        listUpdateDB.push({id:cData.id, eState:'STANDBY', eType:'BET'});
    }

}

/*
*/
exports.ProcessOverview = async (listDB, listOverview, listOdds, listUpdateDB) => {

    if ( listDB.length <= 0 )
        return;

    for ( let i in listDB )
    {
        const cData = listDB[i];
        const strDate = cData.createdAt.substr(0,10);
        const cOdd = ODDS.FindOdd(cData.strID, listOdds);
        if ( cOdd == null )
            continue;

        let strDetail = ToJsonDetail(cData.strDetail ?? '');

        if ( strDetail.length > 0 && cData.strVender == 'EZUGI' && cData.iGameCode == 0 && cData.eType == 'BETWIN' && (cData.strTableID == '101' || cData.strTableID == '100' || cData.strTableID == '102') )
        {
            try {
                let objectReturn = ODDS.ProcessRolling(cOdd, strDetail, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
                const strOverview = ODDS.GetRollingString(objectBetRolling);
                listUpdateDB.push({id:cData.id, strOverview:strOverview});
            }
            catch {

                let objectReturn = ODDS.ProcessRollingBetWin(cOdd, cData.iGameCode, cData.iBet, cData.iWin, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
                const strOverview = ODDS.GetRollingString(objectBetRolling);
                listUpdateDB.push({id:cData.id, strOverview:strOverview});
            }
        }
        else if ( strDetail.length > 0 && cData.strVender =='CQ9' && cData.eType == 'BETWIN' )
        {
            try
            {
                let objectReturn = ODDS.ProcessRolling(cOdd, strDetail, 0, 0, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
                const strOverview = ODDS.GetRollingString(objectBetRolling);
                listUpdateDB.push({id:cData.id, strOverview:strOverview});
            }
            catch
            {
                let objectReturn = ODDS.ProcessRollingBetWin(cOdd, cData.iGameCode, cData.iBet, cData.iWin, strDate);
                let listCurrentOverview = objectReturn.listFinal;
                let objectBetRolling = objectReturn.objectBet;
                ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
                const strOverview = ODDS.GetRollingString(objectBetRolling);
                listUpdateDB.push({id:cData.id, strOverview:strOverview});
            }
        }
        else if ( cData.eType == 'BET' )
        {
            let objectReturn = ODDS.ProcessRollingBet(cOdd, cData.iGameCode, cData.iBet, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;

            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
            const strOverview = ODDS.GetRollingString(objectBetRolling);
            listUpdateDB.push({id:cData.id, strOverview:strOverview});            
        }
        else if ( cData.eType == 'WIN' )
        {
            let objectReturn = ODDS.ProcessRollingWin(cOdd, cData.iGameCode, cData.iWin, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
            const strOverview = ODDS.GetRollingString(objectBetRolling);
            listUpdateDB.push({id:cData.id, strOverview:strOverview});
        }
        else if ( cData.eType == 'BETWIN' )
        {
            let objectReturn = ODDS.ProcessRollingBetWin(cOdd, cData.iGameCode, cData.iBet, cData.iWin, strDate);
            let listCurrentOverview = objectReturn.listFinal;
            let objectBetRolling = objectReturn.objectBet;
            ODDS.JoinGroupDailyOverview(listOverview, listCurrentOverview);
            const strOverview = ODDS.GetRollingString(objectBetRolling);
            listUpdateDB.push({id:cData.id, strOverview:strOverview});
        }
    }    
}

let ToJsonDetail = (str) => {
    try {
        let json = JSON.parse(str);

        //  우리가 써야 하는 형태 [{"iGameCode":0,"iTarget":1,"iBet":1000,"iWin":0},{"iGameCode":0,"iTarget":3,"iBet":1000,"iWin":0},{"iGameCode":100,"iTarget":101,"iBet":1000,"iWin":0}]
        //  DB 에 들어가 있는 형태 [{'C':0, 'T':1, 'B':1000, 'W':0}, {'C':0, 'T':3, 'B':1000, 'W':0}, {'C':100, 'T':101, 'B':1000, 'W':0}] 형태로 만듬

        let list = [];

        try
        {
            for ( let i in json )
            {
                list.push({iGameCode:json[i].C, iTarget:json[i].T, iBet:parseFloat(json[i].B ?? 0), iWin:parseFloat(json[i].W ?? 0)});
            }
            return list;
        }
        catch
        {
            return [];
        }

        //return json;
    } catch (e) {
        return [];
    }
}