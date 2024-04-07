const Sequelize = require('sequelize');

// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
//     database: 'livecasino',
//     username: 'iiplive',
//     password: 'oLOHJkiQACPGuAgj',
//     dialect: 'mysql',
//     port:25060,
//     timezone:'Asia/Seoul'
// });
const sequelize = new Sequelize({
    host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
    //database: 'iipcor',
    database:'iipc',
    username: 'doadmin',
    password: 'AVNS_M3_YxbEdNmi41c9HbLu',
    dialect: 'mysql',
    port:25060,
    timezone:'Asia/Seoul'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);

module.exports = db;