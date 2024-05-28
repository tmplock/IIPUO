const Redis = require('ioredis');


//  Staging
const redis = new Redis({
    host:'db-redis-sgp1-27745-do-user-11246819-0.c.db.ondigitalocean.com',  //Public
    port:25061,
    password:'AVNS_28fOYW-_4faUljQ7PjH',
    username:'default',
    tls:{rejectUnauthorized: false}
});

//  Production
// const redis = new Redis({
//     host:'db-redis-sgp1-27745-do-user-11246819-0.c.db.ondigitalocean.com',  //Public
//     port:25061,
//     password:'AVNS_28fOYW-_4faUljQ7PjH',
//     username:'default',
//     tls:{rejectUnauthorized: false}
// });


exports.GetCache = async (key) => {

    console.log(`GetCache : ${key}`);

    try 
    {
        // redis.get(key, (error, data) => {

        //     if ( error )
        //     {
        //         console.log(`error`);
        //         console.log(error);
        //         return null;
        //     }

        //     console.log(`get`);
        //     console.log(data);

        //     const json = JSON.parse(data);
        //     return json;
        // });
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

        // redis.set(key, JSON.stringify(data), (error, data) => 
        // {
        //     if ( error )
        //     {
        //         console.log(error);
        //     }
        //     //redis.expire(key, 10);
        // })
    }
    catch 
    {

    }
}


// exports.SetCache = (key, data) => {

//     try 
//     {
//         console.log(`SetCache : ${key}`);

//         redis.set(key, JSON.stringify(data), (error, data) => 
//         {
//             if ( error )
//             {
//                 console.log(error);
//             }
//             //redis.expire(key, 10);
//         })
//     }
//     catch 
//     {

//     }
// }

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

    const keys = await redis.keys('*');
    //const values = await redis.collection.mget(keys);

    console.log(`################################################## REDIS GET ALL KEYS`);
    console.log(keys);
    //console.log(values);
}


// const Sequelize = require('sequelize');

// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-62759-do-user-11246819-0.c.db.ondigitalocean.com',
//     database: 'iip',
//     username: 'doadmin',
//     password: 'AVNS_FYsbSxfV0ADzDF4IiRJ',
//     dialect: 'mysql',
//     port:25060,
//     timezone:"+09:00"
// });

// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.Users = require('./models/user')(sequelize, Sequelize);
// db.transactions = require('./models/transaction')(sequelize, Sequelize, 'transactions');
// db.Tokens = require('./models/token')(sequelize, Sequelize);

// module.exports = db;