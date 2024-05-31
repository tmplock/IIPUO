const db = require('./db');

const {Op}= require('sequelize');

const moment = require('moment');

let ChangeGroupID = (strGroupID, strTargetGroupID) => {

    let arrayGroupID = strGroupID.split('');
    let arrayTargetGroupID = strTargetGroupID.split('');

    for ( let i in arrayTargetGroupID )
    {
        arrayGroupID[i] = arrayTargetGroupID[i];
    }

    let strResult = arrayGroupID.join('');

    return strResult;
}

const TransferAgents = async (strGroupID, strTargetGroupID, bDBUpdate) => {

    let listUsers = await db.Users.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });
    console.log(`listUser length : ${listUsers.length}`);

    for ( let i in listUsers )
    {
        let strNewGroupID = ChangeGroupID(listUsers[i].strGroupID, strTargetGroupID);

        console.log(`${i} strID : ${listUsers[i].strNickname} : strGroupID : ${listUsers[i].strGroupID}, strNew : ${strNewGroupID}`);
        if ( bDBUpdate == true )
        {
            await db.Users.update({strGroupID:strNewGroupID}, {where:{id:listUsers[i].id}});
        }
    }
}

const TransferOverview = async (strGroupID, strTargetGroupID, bDBUpdate) => {

    let listOverview = await db.RecordDailyOverviews.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });
    console.log(`listOverview length : ${listOverview.length}`);

    for ( let i in listOverview )
    {
        let strNewGroupID = ChangeGroupID(listOverview[i].strGroupID, strTargetGroupID);

        console.log(`${i} strID : ${listOverview[i].strID} : strGroupID : ${listOverview[i].strGroupID}, strNew : ${strNewGroupID}`);
        if ( bDBUpdate == true )
        {
            await db.RecordDailyOverviews.update({strGroupID:strNewGroupID}, {where:{id:listOverview[i].id}});
        }
    }
}

const TransferInout = async (strGroupID, strTargetGroupID, bDBUpdate) => {

    let listInouts = await db.Inouts.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });
    console.log(`listInouts length : ${listInouts.length}`);

    for ( let i in listInouts )
    {
        let strNewGroupID = ChangeGroupID(listInouts[i].strGroupID, strTargetGroupID);

        console.log(`${i} strID : ${listInouts[i].strID} : strGroupID : ${listInouts[i].strGroupID}, strNew : ${strNewGroupID}`);
        if ( bDBUpdate == true )
        {
            await db.Inouts.update({strGroupID:strNewGroupID}, {where:{id:listInouts[i].id}});
        }
    }
}

const TransferGTs = async (strGroupID, strTargetGroupID, bDBUpdate) => {

    let listGTs = await db.GTs.findAll({
        where: {
            strGroupID: {
                [Op.like]:`${strGroupID}%`
            }
        }
    });
    console.log(`listGTs length : ${listGTs.length}`);

    for ( let i in listGTs )
    {
        let strNewGroupID = ChangeGroupID(listGTs[i].strGroupID, strTargetGroupID);

        console.log(`${i} strID : ${listGTs[i].strTo} : strGroupID : ${listGTs[i].strGroupID}, strNew : ${strNewGroupID}`);
        if ( bDBUpdate == true )
        {
            await db.GTs.update({strGroupID:strNewGroupID}, {where:{id:listGTs[i].id}});
        }
    }
}



const TransferAdmin = async (strNickname, strTargetGroupID, bDBUpdate) => {

    const admin = await db.Users.findOne({where:{strNickname:strNickname, iClass:3}});

    if ( admin != null )
    {
        const cSourceGroupID = admin.strGroupID;

        //  # USER
        await TransferAgents(cSourceGroupID, strTargetGroupID, bDBUpdate);
        //  # OVERVIEW
        await TransferOverview(cSourceGroupID, strTargetGroupID, bDBUpdate);
        //  # INOUT
        await TransferInout(cSourceGroupID, strTargetGroupID, bDBUpdate);
        //  # GTs
        await TransferGTs(cSourceGroupID, strTargetGroupID, bDBUpdate);
    }
}


const Transfer = async () => {

    let listAdminNickname = ['키다리', '호용01테'];
    let strTargetGroupID = '003';
    let bDBUpdate = false;

    for ( let i in listAdminNickname )
    {
        await TransferAdmin(listAdminNickname[i], strTargetGroupID, bDBUpdate);
    }
}

setTimeout(Transfer, 1000);