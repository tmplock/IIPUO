
const path = require('path')

if(process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
  console.log('production mode');
} else {
  // 로컬개발시
  // require('dotenv').config({path: path.join(__dirname, '../.env')});
  // 서버개발시
  require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
  console.log('development mode');
  console.log(process.env.MYSQL_PASSWORD);
}

const env = process.env;

module.exports = { development, production, test };