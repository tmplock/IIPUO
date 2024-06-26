const Sequelize = require('sequelize');

// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-62759-do-user-11246819-0.c.db.ondigitalocean.com',
//     database: 'iipc',
//     username: 'doadmin',
//     password: 'AVNS_FYsbSxfV0ADzDF4IiRJ',
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
db.RecordBets = require('./models/recordbet')(sequelize, Sequelize);
db.RecordDailyOverviews = require('./models/RecordDailyOverview')(sequelize, Sequelize);
db.Inouts = require('./models/inout')(sequelize, Sequelize);
db.GTs = require('./models/gt')(sequelize, Sequelize);
db.OverviewLogs = require('./models/OverviewLog')(sequelize, Sequelize);

module.exports = db;