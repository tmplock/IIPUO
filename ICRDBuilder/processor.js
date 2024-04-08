const RDHLink = require('./vender/honorlink');
const RDCQ9 = require('./vender/cq9');
const RDEzugi = require('./vender/ezugi');

exports.ProcessHLink = async (listDB, listUpdateDB) => {

    console.log(`##### ProcessHLink`);
 
    if ( listDB.length <= 0 )
        return;

    let res = await RDHLink.GetRangeRD(listDB[0].createdAt, listDB[listDB.length-1].updatedAt);
    if (res == null) 
    {
        //  못 얻어올 경우 아무 업데이트 필요 없음
        return;
    }

    for (let i in listDB)
    {
        const cData = listDB[i];

        console.log(`listDB ${i}`);

        let listData = RDHLink.GetRD(res, cData.strUniqueID);
        if (listData != null)
        {
            listUpdateDB.push({id:cData.id, strDetail:listData.strBets, strResult:listData.strCards});
        }
    }
}

exports.ProcessCQ9 = async (listDB, listUpdateDB) => {

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
            listUpdateDB.push({id:cData.id, strDetail:listData.strBets, strResult:listData.strCards});
        }
    }
}


exports.ProcessEzugi = async (listDB, listUpdateDB) => {

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

        if (listData != null)
        {
            listUpdateDB.push({id:cData.id, strDetail:listData.strBets, strResult:listData.strCards});
        }
    }    
}
