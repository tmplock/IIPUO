const Sequelize = require('sequelize');

const sequelize = new Sequelize({

    host:process.env.MYSQL_HOST,
    database:process.env.MYSQL_DATABASE,
    username:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    port:process.env.MYSQL_PORT,
    timezone:'+09:00'
});

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
db.RecordInoutAccounts = require('./models/recordinoutaccount')(sequelize, Sequelize);

module.exports = db;