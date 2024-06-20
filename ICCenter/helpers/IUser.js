const db = require('../db');

const redis = require('../redis');

const REDISKEY_USER = 'USER_';

exports.FindUserFromDB = async (strID) => {

    const user = await db.Users.findOne({where:{strID:strID}});
    if ( user != null )
    {
        const data = {strID:strID, strNickname:user.strNickname, strGroupID:user.strGroupID, iClass:user.iClass, iCash:user.iCash};
        return data;
    }

    return null;
}

exports.AddUser = async (strID, strNickname, strGroupID, iClass, iCash) => {

    console.log(`##### IUser::AddUser`);
    await redis.GetAllKeys();

    const exist = await redis.GetCache(`${REDISKEY_USER}${strID}`);
    if ( exist == null )
    {
        const data = {strID:strID, strNickname:strNickname, strGroupID:strGroupID, iClass:iClass, iCash:iCash};
        await redis.SetCache(`USER_${strID}`, data);
    }
    else
    {
        this.UpdateUserCash(iCash);
    }
}

exports.GetUser = async (strID) => {

    console.log(`IUser::GetUser `);
    await redis.GetAllKeys();

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

exports.UpdateUserCash = async (strID, iCash) => {

    console.log(`IUser::UpdateUserCash `);
    await redis.GetAllKeys();

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

exports.IncrementUserCash = async (strID, iAmount) => {
    
    console.log(`IUser::IncrementUserCash `);
    await redis.GetAllKeys();

    let objectData = await this.GetUser(strID);
    if ( objectData != null )
    {
        const cAmount = parseInt(iAmount);

        let iCash = objectData.iCash + cAmount;        
        await this.UpdateUserCash(strID, iCash);
    }
}

exports.DecrementUserCash = async (strID, iAmount) => {

    console.log(`IUser::DecrementUserCash `);
    await redis.GetAllKeys();

    let objectData = await this.GetUser(strID);
    if ( objectData != null )
    {
        const cAmount = parseInt(iAmount);

        let iCash = objectData.iCash - cAmount;
        await this.UpdateUserCash(strID, iCash);
    }
}