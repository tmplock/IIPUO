
const path = require('path')

//require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
require('dotenv').config({ path: path.join(__dirname, '../.env.production') });

const env = process.env;
