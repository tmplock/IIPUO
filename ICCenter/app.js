'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
var path = require('path');
const db = require('./db');
const {Op} = require('sequelize');

app.use('/account', require('./routes/account'));
app.use('/game', require('./routes/game'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const redis = require('./redis');

app.get('/', (req, res) => {
    res.render('list');
});

app.get('/clear', async (req, res) => {

    await redis.DeleteAllKeys();
    res.send({result:'OK'});

});


const cPort = 3070;
server.listen(cPort, async () => {
    console.log(`ICCenter Server is started At ${cPort}`);
});

