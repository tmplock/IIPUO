'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);

// const cron = require('./cron');
const cron = require('./cron_overview');
//const cron = require('./cron_rolling');

const cPort = 3003;
server.listen(cPort, () => {
    console.log(`IBetBuilder Server is started At ${cPort}`);
});
