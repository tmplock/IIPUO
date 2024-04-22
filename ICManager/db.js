const Sequelize = require('sequelize');
//const sequelize = new Sequelize('iiplive', 'sss', '11111', {host:'103.60.126.54', dialect:'mysql'});
//const sequelize = new Sequelize('iiplive', 'sss', 'Supersong37#', {host:'192.168.0.2', dialect:'mysql'});

//const sequelize = new Sequelize('iiplive', 'sss', '1111', {host:'103.60.124.87', dialect:'mysql'});

// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
//     database: 'livecasino',
//     username: 'doadmin',
//     password: '8qGHgv3sI6qfmVO1',
//     dialect: 'mysql',
//     port:25060,
//     timezone:'+09:00',
//     logging: false
// });
const sequelize = new Sequelize({
    host:process.env.MYSQL_HOST,
    database:process.env.MYSQL_DATABASE,
    username:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    port:process.env.MYSQL_PORT,
    timezone:'+09:00'

    // host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
    // //database: 'iipcor',
    // database:'iipc',
    // username: 'doadmin',
    // password: 'AVNS_M3_YxbEdNmi41c9HbLu',
    // dialect: 'mysql',
    // port:25060,
    // timezone:'Asia/Seoul'
});

const db = {};
// db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(sequelize, Sequelize);
db.BettingRecords = require('./models/betting_record')(sequelize, Sequelize);
db.Announcements = require('./models/announcement')(sequelize, Sequelize);
db.Faqs = require('./models/faq')(sequelize, Sequelize);
db.Inouts = require('./models/inout')(sequelize, Sequelize);
db.GTs = require('./models/gt')(sequelize, Sequelize);
db.Letters = require('./models/letter')(sequelize, Sequelize);
db.SettleRecords = require('./models/settle_record')(sequelize, Sequelize);
db.CreditRecords = require('./models/credit_record')(sequelize, Sequelize);
db.ChargeRequest = require('./models/charge_request')(sequelize, Sequelize);
db.ContactLetter = require('./models/contact_letter')(sequelize, Sequelize);
db.ShareUsers = require('./models/share_user')(sequelize, Sequelize);
db.ShareRecords = require('./models/share_record')(sequelize, Sequelize);
db.ShareCreditRecords = require('./models/share_credit_record')(sequelize, Sequelize);
db.DataLogs = require('./models/data_log')(sequelize, Sequelize);
db.BankRecords = require('./models/bank_record')(sequelize, Sequelize);
db.DailyBettingRecords = require('./models/daily_betting_record')(sequelize, Sequelize);
db.DailyRecords = require('./models/daily_record')(sequelize, Sequelize);
db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);
db.RecordDailyOverviews = require('./models/RecordDailyOverview')(sequelize, Sequelize);
db.Chips = require('./models/chip')(sequelize, Sequelize);
db.Permissions = require('./models/permission')(sequelize, Sequelize);
db.OverviewLogs = require('./models/OverviewLog')(sequelize, Sequelize);
db.BettingLogs = require('./models/betting_log')(sequelize, Sequelize);
module.exports = db;