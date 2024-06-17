'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);

const db = require('./db');
db.sequelize.sync();

const cron = require('./cron');

const cPort = 3003;
server.listen(cPort, () => {
    console.log(`ICBuilder Server is started At ${cPort}`);
});
