const Redis = require('ioredis');

// Production
// const redis = new Redis({
//     host:'db-redis-sgp1-23437-do-user-11246819-0.c.db.ondigitalocean.com',  //Public
//     port:25061,
//     password:'AVNS_EiombYO7FduLLYq_eYD',
//     username:'default',
//     tls:{rejectUnauthorized: false}
// });

//  Staging
const redis = new Redis({
    host:'db-redis-sgp1-80793-devvender-do-user-11246819-0.c.db.ondigitalocean.com',  //Public
    port:25061,
    password:'AVNS__ZTzrIsYFBtk75YBqd_',
    username:'default',
    tls:{rejectUnauthorized: false}
});

exports.GetCache = async (key) => {

    console.log(`GetCache : ${key}`);

    try 
    {
        const data = await redis.get(key);
        return data;
    }
    catch {

        console.log(`GetCache : Catch`);

        return null;
    }
}

exports.SetCache = async (key, data) => {

    try 
    {
        console.log(`SetCache : ${key}`);

        await redis.set(key, JSON.stringify(data));
        redis.expire(key, 300);
    }
    catch 
    {
    }
}

exports.RemoveCache = (key) => {

    try {
        redis.del(key);
    }
    catch 
    {
        return null;
    }
}

exports.GetAllKeys = async () => {

    let list = [];

    const keys = await redis.keys('*');
    //console.log(keys);

    if ( keys.length > 0 )
    {
        const values = await redis.mget(keys);

        // console.log(`################################################## REDIS GET ALL KEYS`);
        // console.log(values);
    
        for ( let i in values )
        {
            list.push(JSON.parse(values[i]))
        }
    }

    console.log(list);
    //console.log(values);
    return list;
}

exports.GetAllContainedKeys = async (strToken) => {

    let list = [];

    const keys = await redis.keys(`${strToken}*`);

    if ( keys.length > 0 )
    {
        const values = await redis.mget(keys);

        for ( let i in values )
        {
            list.push(JSON.parse(values[i]))
        }
    }

    console.log(list);
    return list;
}

exports.DeleteAllKeys = async () => {

    // const keys = await redis.keys('PATTERN:*');
    // //const keys = await redis.keys('*');

    // await redis.del(keys);

    const keys = await redis.keys('*');

    if ( keys.length > 0 )
    {
        for ( let i in keys )
        {
            await redis.del(keys[i]);
        }
        // const values = await redis.mget(keys);

        // for ( let i in values )
        // {
        //     list.push(JSON.parse(values[i]))
        // }
    }
}