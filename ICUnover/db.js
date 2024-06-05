const Sequelize = require('sequelize');

// const sequelize = new Sequelize({
//     // host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
//     // //database: 'iipcor',
//     // database:'iipc',
//     // username: 'doadmin',
//     // password: 'AVNS_M3_YxbEdNmi41c9HbLu',
//     // dialect: 'mysql',
//     // port:25060,
//     // timezone:'Asia/Seoul'

//     // // host:process.env.MYSQL_HOST,
//     // // database:process.env.MYSQL_DATABASE,
//     // // username:process.env.MYSQL_USERNAME,
//     // // password:process.env.MYSQL_PASSWORD,
//     // // dialect: 'mysql',
//     // // port:process.env.MYSQL_PORT,
//     // // timezone:'+09:00'

//     host:'db-mysql-sgp1-62759-do-user-11246819-0.c.db.ondigitalocean.com',
//     database:'iipc',
//     username:'doadmin',
//     password:'AVNS_CHqkvP_p_JM6uWuOb73',
//     dialect: 'mysql',
//     port:25060,
//     timezone:'+09:00'
// });

const sequelize = new Sequelize({
    // host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
    // //database: 'iipcor',
    // database:'iipc',
    // username: 'doadmin',
    // password: 'AVNS_M3_YxbEdNmi41c9HbLu',
    // dialect: 'mysql',
    // port:25060,
    // timezone:'Asia/Seoul'

    // // host:process.env.MYSQL_HOST,
    // // database:process.env.MYSQL_DATABASE,
    // // username:process.env.MYSQL_USERNAME,
    // // password:process.env.MYSQL_PASSWORD,
    // // dialect: 'mysql',
    // // port:process.env.MYSQL_PORT,
    // // timezone:'+09:00'

    host:process.env.MYSQL_HOST,
    database:process.env.MYSQL_DATABASE,
    username:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    port:process.env.MYSQL_PORT,
    timezone:'+09:00'
});

console.log(`-----------------------------------------------`)
console.log(process.env.MYSQL_HOST);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(sequelize, Sequelize);
db.Inouts = require('./models/inout')(sequelize, Sequelize);
db.GTs = require('./models/gt')(sequelize, Sequelize);
db.Letters = require('./models/letter')(sequelize, Sequelize);
db.Announcements = require('./models/announcement')(sequelize, Sequelize);
db.Faqs = require('./models/faq')(sequelize, Sequelize);
db.BankRecords = require('./models/bank_record')(sequelize, Sequelize);
db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);
db.RecordDailyOverviews = require('./models/RecordDailyOverview')(sequelize, Sequelize);
db.RecordErrorCashes = require('./models/recorderrorcash')(sequelize, Sequelize);
db.SettingRecords = require('./models/setting_record')(sequelize, Sequelize);

module.exports = db;