const Sequelize = require('sequelize');
//const sequelize = new Sequelize('iiplive', 'sss', '11111', {host:'103.60.126.54', dialect:'mysql'});
//const sequelize = new Sequelize('iiplive', 'sss', 'Supersong37#', {host:'192.168.0.2', dialect:'mysql'});

//const sequelize = new Sequelize('iiplive', 'sss', '1111', {host:'103.60.124.87', dialect:'mysql'});

// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
//     //database: 'iipcor',
//     database:'livecasino',
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

db.Users = require('./models/user')(sequelize, Sequelize);
db.BettingRecords = require('./models/betting_record')(sequelize, Sequelize);
db.Inouts = require('./models/inout')(sequelize, Sequelize);
db.GTs = require('./models/gt')(sequelize, Sequelize);
db.Letters = require('./models/letter')(sequelize, Sequelize);
db.SettleRecords = require('./models/settle_record')(sequelize, Sequelize);
db.Accounts = require('./models/account')(sequelize, Sequelize);
db.Announcements = require('./models/announcement')(sequelize, Sequelize);
db.Faqs = require('./models/faq')(sequelize, Sequelize);
db.BankRecords = require('./models/bank_record')(sequelize, Sequelize);
db.BuildBets = require('./models/buildbet')(sequelize, Sequelize);

db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);
db.RecordDailyOverviews = require('./models/RecordDailyOverview')(sequelize, Sequelize);

db.RecordErrorCashes = require('./models/recorderrorcash')(sequelize, Sequelize);

module.exports = db;