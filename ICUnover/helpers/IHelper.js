const db = require('../db');


const { default: axios2 } = require('axios');

exports.RequestAxios = async (strAddress, objectData) =>
{
    console.log(`RequestAxios ${strAddress}`);
    console.log(objectData);

    try {

        const customAxios = axios2.create({});
        const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json'}});
        //console.log(response.data);
        if ( response.data.eResult == 'OK' )
            return {result:'OK', data:response.data};
        else
            return {result:'error', error:response.data.error};    
    }
    catch (error) {
        console.log('axios error', error);
        return {result:'error', error:'axios'};
    }
}

exports.RequestAxios2 = async (strAddress, objectData) =>
    {
        console.log(`RequestAxios ${strAddress}`);
        console.log(objectData);
    
        try {
    
            const customAxios = axios2.create({});
            const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json'}});

            return response.data;

            //console.log(response.data);
            // if ( response.data.result == 'OK' )
            //     //return {result:'OK', data:response.data};

            // else
            //     return {result:'error', error:response.data.error};    
        }
        catch (error) {
            console.log('axios error', error);
            return {result:'error', error:'axios'};
        }
    }

    
exports.GetParentList = async (strGroupID, iClass) => {

    console.log(`GetParentList : ${strGroupID}, ${iClass}`);

    let objectData = {strAdmin:'', strPAdmin:'', strVAdmin:'', strAgent:'', strShop:''};

    if ( iClass == 8 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3,
            t4.strNickname AS lev4,
            t5.strNickname AS lev5
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
            WHERE t6.iClass='8' AND t6.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:result[0].lev5};
            
        //return result[0].lev1;
    }
    else if ( iClass == 7 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3,
            t4.strNickname AS lev4
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            WHERE t5.iClass='7' AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:result[0].lev4, strShop:''};
    }
    else if ( iClass == 6 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2,
            t3.strNickname AS lev3
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            WHERE t4.iClass='6' AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:result[0].lev3, strAgent:'', strShop:''};
    }
    else if ( iClass == 5 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            t2.strNickname AS lev2
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            WHERE t3.iClass='5' AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:'', strAgent:'', strShop:''};
    }
    else if ( iClass == 4 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strNickname AS lev1,
            t1.strID AS lev1ID,
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.iClass='4' AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strAdmin:result[0].lev1, strAdminID:result[0].lev1ID, strPAdmin:result[0].lev2, strVAdmin:'', strAgent:'', strShop:''};
    }
    else if ( iClass == 3 )
    {

    }
    return objectData;
}

exports.GetOutputRecords = async () => {
    return {listOutputRecent:[], listOutputRank:[]};

    const listOutputRecent = await db.Inouts.findAll({
        limit:5,
        where:{
            eType:'OUTPUT',
            eState:'COMPLETE',
        },
        //order:[['iAmount','DESC']]
        order:[['createdAt','DESC']]
    });

    const listOutputRank = await db.Inouts.findAll({
        limit:5,
        where:{
            eType:'OUTPUT',
            eState:'COMPLETE',
        },
        order:[['iAmount','DESC']]
        //order:[['createdAt','DESC']]
    });

    const objectRet = {listOutputRecent:listOutputRecent, listOutputRank:listOutputRank};

    return objectRet;
}
