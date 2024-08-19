const Sequelize = require('sequelize');

//  Staging
// const sequelize = new Sequelize({
//     host:'db-mysql-sgp1-62759-do-user-11246819-0.c.db.ondigitalocean.com',
//     database:'iipc',
//     username:'doadmin',
//     password:'AVNS_CHqkvP_p_JM6uWuOb73',
//     dialect: 'mysql',
//     port:'25060',
//     timezone:'+09:00'
// });
// Production
const sequelize = new Sequelize({
    host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
    database:'iipc',
    username: 'doadmin',
    password: 'AVNS_M3_YxbEdNmi41c9HbLu',
    dialect: 'mysql',
    port:25060,
    timezone:'+09:00'
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);

module.exports = db;