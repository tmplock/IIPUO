const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
    database: 'livecasino',
    username: 'iiplive',
    password: 'oLOHJkiQACPGuAgj',
    dialect: 'mysql',
    port:25060,
    timezone:'Asia/Seoul'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(sequelize, Sequelize);
db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);
db.RecordDailyOverviews = require('./models/RecordDailyOverview')(sequelize, Sequelize);

module.exports = db;