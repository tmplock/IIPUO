'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/', (req, res) => {
    res.render('index');
})

const cPort = 3010;
server.listen(cPort, () => {
    console.log(`IMTS Server is started At ${cPort}`);
});

