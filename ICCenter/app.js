'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);

const db = require('./db');
const {Op} = require('sequelize');

app.use('/account', require('./routes/account'));

const cPort = 3050;
server.listen(cPort, () => {
    console.log(`ICCenter Server is started At ${cPort}`);
});

