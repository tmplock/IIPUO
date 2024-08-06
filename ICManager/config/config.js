// require('dotenv').config();
// require("dotenv").config({ path: "./../.env" });

const path = require('path')

//require('dotenv').config({ path: path.join(__dirname, '../.env.production') });

require('dotenv').config({path: path.join(__dirname, '../.env.local')});

// if(process.env.NODE_ENV === 'production') {
//   require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
//   console.log('production mode');
// } else {
//   // 로컬개발시
//   //require('dotenv').config({path: path.join(__dirname, '../.env.local')});
//   require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
//   // 서버개발시
//   // require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
//   console.log('development mode');
//   console.log(process.env.MYSQL_PASSWORD);
// }

const env = process.env;

const development = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:'+09:00',
  port:env.MYSQL_PORT,
  benchmark: true,
  logging: (query, time) => {
    if (time > 100) { // 100ms를 초과하는 쿼리만 로그로 기록
      console.log('\n[slowquery] ' + time + 'ms ' + query + '\n');
    } else {
      console.log(query);
    }
  },
  pool: {
    max: 5,  // 최대 연결 수
    min: 0,  // 최소 연결 수
    acquire: 60000,  // 연결을 시도하는 최대 시간
    idle: 10000,  // 유휴 상태로 있을 수 있는 최대 시간
    acquire: 30000,  // 연결을 시도하는 최대 시간 (30초)
    evict: 15000,  // 유휴 연결을 풀에서 제거하는 데 걸리는 시간 (15초)
  }
};
 
const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:'+09:00',
  port:env.MYSQL_PORT,
  logging: false,
  pool: {
    max: 16,  // 최대 연결 수. 부하와 서버 사양에 따라 조정
    min: 4,   // 최소 연결 수. 항상 유지할 최소한의 연결 수
    acquire: 30000,  // 연결을 시도하는 최대 시간 (30초)
    idle: 10000,  // 유휴 상태로 있을 수 있는 최대 시간 (10초)
    evict: 15000,  // 유휴 연결을 풀에서 제거하는 데 걸리는 시간 (15초)
  },
};
 
const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_TEST,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:'+09:00',
  port:env.MYSQL_PORT,
  logging: false
};
 
module.exports = { development, production, test };