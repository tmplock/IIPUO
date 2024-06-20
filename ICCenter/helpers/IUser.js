const db = require('../db');

const redis = require('../redis');

const REDISKEY_USER = 'USER_';

exports.FindUserFromDB = async (strID) => {

    try
    {
        const user = await db.Users.findOne({where:{strID:strID}});
        if ( user != null )
        {
            const data = {strID:strID, strNickname:user.strNickname, strGroupID:user.strGroupID, iClass:user.iClass, iCash:user.iCash};
            return data;
        }
    }
    catch
    {
        return null;
    }

    return null;
}

exports.AddUser = async (strID, strNickname, strGroupID, iClass, iCash) => {

    console.log(`##### IUser::AddUser`);
    await redis.GetAllContainedKeys(REDISKEY_USER);

    try 
    {
        const data = {strID:strID, strNickname:strNickname, strGroupID:strGroupID, iClass:iClass, iCash:iCash};
        await redis.SetCache(`USER_${strID}`, data);
        return data;
    }
    catch
    {
        return null;
    }
}

exports.GetUser = async (strID) => {

    console.log(`IUser::GetUser `);
    await redis.GetAllContainedKeys(REDISKEY_USER);

    const exist = await redis.GetCache(`${REDISKEY_USER}${strID}`);
    if ( exist != null )
    {
        return JSON.parse(exist);
    }
    else
    {
        const found = await this.FindUserFromDB(strID);
        if ( found != null )
        {
            await this.AddUser(strID, found.strNickname, found.strGroupID, found.iClass, found.iCash);
            return found;
        }        
    }

    return null;
}

exports.GetUserCash = async (strID) => {

    const user = await this.GetUser(strID);
    if ( user != null )
    {
        return user.iCash;
    }

    return null;
}

exports.UpdateUserCash = async (strID, iCash, eType) => {

    console.log(`IUser::UpdateUserCash ${strID}, ${iAmount}, ${eType}`);
    await redis.GetAllContainedKeys(REDISKEY_USER);

    let objectData = await this.GetUser(strID);

    if ( objectData != null )
    {
        objectData.iCash = iCash;

        await redis.SetCache(`${REDISKEY_USER}${strID}`, objectData);

        await db.Users.update({iCash:iCash}, {where:{strID:strID}});

        return objectData;
    }

    return null;
}

exports.IncrementUserCash = async (strID, iAmount, eType) => {
    
    console.log(`IUser::IncrementUserCash ${strID}, ${iAmount}, ${eType}`);
    await redis.GetAllContainedKeys(REDISKEY_USER);

    let objectData = await this.GetUser(strID);
    if ( objectData != null )
    {
        const cAmount = parseInt(iAmount);

        let iCash = objectData.iCash + cAmount;
        await this.UpdateUserCash(strID, iCash, eType);
    }
}

exports.DecrementUserCash = async (strID, iAmount, eType) => {

    console.log(`IUser::DecrementUserCash ${strID}, ${iAmount}, ${eType}`);
    await redis.GetAllContainedKeys(REDISKEY_USER);

    let objectData = await this.GetUser(strID);
    if ( objectData != null )
    {
        const cAmount = parseInt(iAmount);

        let iCash = objectData.iCash - cAmount;
        await this.UpdateUserCash(strID, iCash, eType);
    }
}