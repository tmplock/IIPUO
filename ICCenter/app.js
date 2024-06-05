'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
var path = require('path');
const db = require('./db');
const {Op} = require('sequelize');

app.use('/account', require('./routes/account'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('list');
})

const cPort = 3070;
server.listen(cPort, () => {
    console.log(`ICCenter Server is started At ${cPort}`);
});

