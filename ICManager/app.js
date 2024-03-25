'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});
const layout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const session = require('express-session');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const flash = require('connect-flash');

const path = require('path');
//const engine = require('ejs-locals');

const util_time = require('./utils/time');
const util_object = require('./utils/object');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(layout);
app.set('layout', 'common/layout');
app.set('layout extractScripts', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const db = require('./db');
db.sequelize.sync();

const IAgent3 = require('./implements/agent3');
const cron = require('node-cron');


const passportconfig = require('./passport-config');

var connection = mysql.createConnection({
    host: process.env.SESSIONSDB_HOST,
    port: process.env.SESSIONSDB_PORT,
    user: process.env.SESSIONSDB_USER,
    password: process.env.SESSIONSDB_PASS,
    database: process.env.SESSIONSDB_DB
});

var sessionStore = new MySQLStore({
    clearExpired: true,
    // checkExpirationInterval: parseInt(process.env.SESSIONSDB_CHECK_EXP_INTERVAL, 10),
    // expiration: parseInt(process.env.SESSIONSDB_EXPIRATION, 10)
    checkExpirationInterval: 1000*60,
    expiration: 1000*60
}, connection);

//var expireDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
var expireDate = new Date(Date.now() + 60 * 60 * 1000 * 48) // 1 hour
/* Create a cookie that expires in 1 day */
// var expireDate = new Date();
// expireDate.setDate(expireDate.getDate() + 1);
// expireDate.setDate(1000*60);
// expireDate.setHours(expireDate.getHours()+1);

// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: process.env.SESSIONSDB_SECRET,
//   store: sessionStore,
//   cookie: {
//         expires: expireDate,
//         httpOnly: true,
//         secure: false
//     }
// }));

app.use(session({
    secret: 'administrator#',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: (4 * 60 * 60 * 1000) },
    passport: {}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportconfig();


var i18na = require('./i18n');
const { suppressDeprecationWarnings } = require('moment');
const {DATETIME} = require("mysql/lib/protocol/constants/types");
const {Op} = require("sequelize");
const moment = require("moment");
app.use(i18na);


app.use('/account', require('./routes/account'));
app.use('/manage_partner', require('./routes/manage_partner'));
app.use('/manage_partner_popup', require('./routes/manage_partner_popup'));
app.use('/manage_inout', require('./routes/manage_inout'));
app.use('/manage_inout_popup', require('./routes/manage_inout_popup'));
app.use('/manage_user', require('./routes/manage_user'));
app.use('/manage_user_popup', require('./routes/manage_user_popup'));
app.use('/manage_contact', require('./routes/manage_contact'));
app.use('/manage_bettingrecord', require('./routes/manage_bettingrecord'));
app.use('/manage_setting', require('./routes/manage_setting'));
app.use('/manage_setting_popup', require('./routes/manage_setting_popup'));
app.use('/manage_calculation', require('./routes/manage_calculation'));
app.use('/manage_share', require('./routes/manage_share'));
app.use('/manage_chip', require('./routes/manage_chip'));
app.use('/test', require('./routes/test'));

app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.get('/ko', async (req, res) => {
    res.cookie('lang', 'ko');

    // i18n.setLocale('ko');

    //res.redirect('locales_test');
    res.redirect('/');
})

app.get('/jp', async (req, res) => {
    res.cookie('lang', 'jp');

    // i18n.setLocale('jp');

    //res.redirect('locales_test');
    res.redirect('/');
})

app.get('/en', async (req, res) => {
    res.cookie('lang', 'en');

    // i18n.setLocale('en');

    //res.redirect('locales_test');
    res.redirect('/');
})

app.get('/locales_test', async (req, res) => {
    

    return res.send(res.__('Default'));
})



global.io = io;
//global.strUserPageAddress = `http://localhost:3333`;
//global.strUserPageAddress = `https://unover000.com`;
// global.strUserPageAddress = `http://165.22.102.70:3010`; // Unover001
// global.strUserPageAddress = `http://165.22.102.70:3011`; // Unover000
global.strUserPageAddress = `https://unover100.com`; // Unover000

app.get('/', (req, res) => {
    //res.redirect('account/login');

    //res.redirect('/manage_partner/betting_realtime');

    if ( req.user != null )
    {
        if ( parseInt(req.user.iClass) >= 7 )
            res.redirect('/manage_user/userlist');
        else
            res.redirect('/manage_partner/default');
    }
    else
        res.redirect('/account/login');
});




// app.post('/announcement_write',async (req, res) => {
//     const subject = req.body.subject;
//     const content = req.body.content;
//     console.log("subject"+subject)
//     const admin = req.body.strID;

//    const notice = await db.Announcements.create({subject:subject,content:content});
     
//     res.send({string:'OK'});
// })


// app.use((req,res,next)=>{
//     const err = new Error('not Found');
//     err.status = 404;
//     next(err);
// });

// app.use((err,req,res)=>{
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err:{};
//     res.status(err.status||500);
// });

const cPort = 3031;
server.listen(cPort, () => {
    console.log(`Unover CMS Server Started At ${cPort}`);
});

var dateCurrent = util_time.getCurrentDate();
console.log("****************************************************************************************************");
console.log(dateCurrent);

/**
 * 배팅 정보 스케줄 작업
 **/
// IAgent3.CreateOrUpdateDailyRecord(daily);
var daily = null;
cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', async () => {
    let date = moment(Date.now()).format('YYYY-MM-dd HH:mm:ss');
    console.log(`정산 스케줄 :  ${date}`);
    // daily =  await IAgent3.CreateOrUpdateDailyRecord(daily);
});

// 처음 시작시에 한번 기동되도록 수정
// daily =  await IAgent3.CreateOrUpdateDailyRecord(daily);


var socket_list = {};

global.socket_list = socket_list;

// Object.size = (obj) => {
//     var size = 0,
//     key;

//     for ( key in obj )
//     {
//         if ( obj.hasOwnProperty(key))
//             size++;
//     }
//     return size;
// }

io.on('connection', (socket) => {

    socket.id = Math.random();
    socket_list[socket.id] = socket;

    console.log(`connected ${socket.id}, length ${util_object.getObjectLength(socket_list)}`);

    socket.on('request_login', (user) => {

        console.log(`############################################################################`);
        
        console.log(`socket packet request_login ${user.strNickname}, ${user.strGroupID}, ${user.iClass}, ${user.iPermission}`);

        console.log(`############################################################################`);

        socket.strGroupID = user.strGroupID;
        socket.iClass = user.iClass;
        socket.strNickname = user.strNickname;
        socket.iPermission = user.iPermission;

    });

    // socket.on('group', (group) => {
    //     console.log(`group : ${group}`);

    //     socket.group = group;
    // })

    socket.on('disconnect', () => {
        delete socket_list[socket.id];

        console.log(`disconnected ${socket.id}, length ${util_object.getObjectLength(socket_list)}`);
    });
});

// Uncaught SequelizeDatabaseError 발생해도 중지되지 않도록 옵션 추가
process.on("uncaughtException", function (err) {
    console.error("uncaughtException (Node is alive)", err);
});

app.post('/AlertLetter', (req, res) => {

    console.log(`AlertLetter`);

    console.log(req.body);

    for ( let i in socket_list )
    {
        if ( socket_list[i].strNickname == req.body.strTo )
        {
            let objectData = {strTo:req.body.strTo, strFrom:req.body.strFrom, strContents:req.body.strContents};

            socket_list[i].emit('AlertLetter', objectData);
            //socket_list[i].emit('AlertLetter', req.body.strContents);

            console.log(`########### AlertLetter ${req.body.strContents}`);
        }
    }

    res.send('OK');
});