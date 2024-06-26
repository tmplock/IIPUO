'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});
const layout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

var cors = require('cors');

let mysqlsession = require('express-mysql-session')(session);

// let session_option = {
//     host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
//     database: 'iipcor',
//     user: 'iiplive',
//     port:25060,
//     password: 'oLOHJkiQACPGuAgj',
//     clearExpired:true,
//     checkExpirationInterval:10000,
//     expiration:10000    
// }

let session_option = {
    host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
    database: 'iipc',
    user: 'doadmin',
    port:25060,
    password: 'AVNS_M3_YxbEdNmi41c9HbLu',
    clearExpired:true,
    checkExpirationInterval:10000,
    expiration:10000    
}
// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-78563-do-user-11246819-0.c.db.ondigitalocean.com',
//     //database: 'iipcor',
//     database:'iipc',
//     username: 'doadmin',
//     password: 'AVNS_M3_YxbEdNmi41c9HbLu',
//     dialect: 'mysql',
//     port:25060,
//     timezone:'Asia/Seoul'
// });

let sessionStore = new mysqlsession(session_option);

app.use(session({
    secret: 'administrator#',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: (4 * 60 * 60 * 1000) },
    passport: {}
}));
// app.use(session({
//     secret: process.env.secret,
//     resave: false,
//     saveUninitialized: true,
//     store: sessionStore
// }));

// app.use(session({
//     secret: 'administrator#',
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore
//     // cookie: { secure: false, httpOnly: true, maxAge: (4 * 60 * 60 * 1000) },
//     // passport: {}
// }));

const path = require('path');
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(layout);
app.set('layout', 'common/layout');
app.set('layout extractScripts', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const passportconfig = require('./passport-config');

const Enum = require('./constants/enum');

const i18n = require('./i18n');

const {Op}= require('sequelize');


app.use(i18n);

const util_object = require('./utils/object');

const IHelper = require('./helpers/IHelper');

global.io = io;

// global.strAdminAddress = 'http://165.22.102.70:3030';
// global.strAdminAddress = 'https://admintest.unover001.com';
global.strAdminAddress = 'http://188.166.231.104:3031';
global.strVenderAddress = 'http://174.138.23.187:3001';

const { default: axios2 } = require('axios');

let RequestAxios = async (strAddress, objectData) =>
{
    // console.log(`RequestAxios ${strAddress}`);
    // console.log(objectData);

    try {

        const customAxios = axios2.create({});
        const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json'}});
        //console.log(response.data);
        if ( response.data.eResult == 'OK' )
            return {result:'OK', data:response.data};
        else
            return {result:'error', error:response.data.error};    
    }
    catch (error) {
        console.log('axios error', error);
        return {result:'error', error:'axios'};
    }
}
// app.use(session({
//     secret: 'administrator#',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, httpOnly: true, maxAge: (4 * 60 * 60 * 1000) },
//     passport: {}
// }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportconfig();

const db = require('./db');
//const db = require('./models');
db.sequelize.sync();
// db.sequelize.sync({force: true});

app.use('/account', require('./routes/account'));
app.use('/desc', require('./routes/desc'));
// app.use('/powerball', require('./routes/powerball'));
// app.use('/mobile', require('./routes/mobile'));
app.use('/game', require('./routes/game'));
app.use('/letter', require('./routes/letter'));
app.use('/inout', require('./routes/inout'));
app.use('/board', require('./routes/board'));
app.use('/faq', require('./routes/faq'));
//app.use('/cron', require('./cron'));

//const cron = require('./cron');

const {isLoggedIn, isNotLoggedIn} = require('./routes/middleware');
const user = require('./models/user');
const { Letters } = require('./db');
const { create } = require('domain');

app.get('/ko', async (req, res) => {
    res.cookie('unover_lang', 'ko');

    // i18n.setLocale('ko');

    res.redirect('/');
})

app.get('/jp', async (req, res) => {
    res.cookie('unover_lang', 'jp');
-
    // i18n.setLocale('jp');

    res.redirect('/');
})

app.get('/en', async (req, res) => {
    res.cookie('unover_lang', 'en');

    // i18n.setLocale('en');

    res.redirect('/');
})

app.get('/locales_test', async (req, res) => {
    

    return res.send(res.__('hello'));
})



app.use(function (request,response,next){
    var ua = request.header('User-Agent');

    request.platform = (/lgtelecom/.test(ua) || /Android/.test(ua) || /blackberry/.test(ua) || /iphone/.test(ua) || /Iphone/.test(ua) || /iPhone/.test(ua) || /IPHONE/.test(ua)  || /ipad/.test(ua) || /samsung/.test(ua) || /symbian/.test(ua) || /sony/.test(ua) || /SCH-/.test(ua) || /SPH-/.test(ua)) ?
        'mobile' :
        'pc';

    next();
})

// app.post('/sm', async (req, res) => {

//     console.log('################################################## /sm');
//     console.log(req.body);

//     let objectData = {strID:req.user.strID};
//     let res_axios = await RequestAxios(`${global.strVenderAddress}/pp/request_listsm`, objectData);

//     console.log('SM_PP');
//     console.log(res_axios.data.data[0]);

//             // // await db.Users.update({vivoToken:res_axios.data.strToken}, {where:{strID:res_axios.data.strID}});
//             // res.send({url:'/sm', data:res_axios.data});
//             //console.log(res_axios.data[0]);

//     res.render('sm', {gameList:res_axios.data.data});
// })


app.get('/', async (req, res) => {

    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }

    const objectOutput = await IHelper.GetOutputRecords();

    const listAnnouncement =     await db.Announcements.findAll({
        where:{eType:'ANN', eState:'ENABLE'},
        order:[['createdAt','DESC']],
        limit:4,
    });

    let listFaq = [];
    try {
        listFaq= await db.Faqs.findAll({
            where:{eState:'ENABLE'},
            order:[['createdAt','DESC']],
            limit:4,
        });
    } catch (err) {

    }


    res.render('index', {iLayout:0, bLogin:bLogin, user:req.user, messages:req.flash('error')[0], listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, listAnnouncement:listAnnouncement, listFaq:listFaq});
});


// // app.get('/input', async (req, res) => {

// //     res.render('inout_input', {iLayout:0});
// // });

// // app.get('/output', async (req, res) => {

// //     res.render('inout_output', {iLayout:0});
// // });

// app.get('/virtual', async (req, res) => {

//     res.render('inout_virtual', {iLayout:0});
// });

// app.get('/move', async (req, res) => {

//     res.render('inout_move', {iLayout:0});
// });

// app.get('/record', async (req, res) => {

//     res.render('inout_record', {iLayout:0});
// });

// app.get('/recordcoupon', async (req, res) => {

//     res.render('inout_recordcoupon', {iLayout:0});
// });

app.get('/desc', async (req, res) => {

    console.log('/desc');
    console.log(req.query);

    res.render('desc_game01', {iLayout:0, strFilename:`/img/${req.query.id}.jpg`});
});

app.post('/request_myrolling', async (req, res) => {

    console.log(req.body);

    let user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user != null )
    {
        res.send({result:'OK', iAmount:user.iRolling});
    }
    else
    {
        res.send({result:'Error'});
    }
});

app.post('/exchange_output', async (req, res) => {

    console.log(`exchange_output : ${1}`);
    console.log(req.body);
    console.log('출금신청이 왔습니다:'+req.body.strBankPassword);

    const userinfo = await db.Users.findOne({where:{
        // strBankOwner:req.body.strAccountOwner,
        // strPassword:req.body.strBankPassword
        strID:req.body.strID
    }});

    const [result] = await db.sequelize.query(
        `
        SELECT t1.strNickname AS lev1,
        t2.strNickname AS lev2,
        t3.strNickname AS lev3,
        t4.strNickname AS lev4,
        t5.strNickname AS lev5
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.iClass='8' AND t6.strGroupID LIKE CONCAT('${userinfo.strGroupID}', '%');
        `
        );

        console.log(userinfo);
    console.log(`user nickname : ${userinfo.strNickname}`);

    if(userinfo != undefined){

        //if ( userinfo.strOutputPassword == req.body.strPassword )
        //{
            const inputmoney = await db.Inouts.create({
                strID:userinfo.strNickname,
                strAdminNickname:result[0].lev1,
                strPAdminNickname:result[0].lev2,
                strVAdminNickname:result[0].lev3,
                strAgentNickname:result[0].lev4,
                strShopNickname:result[0].lev5,
                iClass:userinfo.iClass,
                strName:userinfo.strNickname,
                strGroupID:userinfo.strGroupID,
                strAccountOwner:userinfo.strBankOwner,
                strBankName:userinfo.strBankname,
                strAccountNumber:userinfo.strBankAccount,
                iPreviousCash:userinfo.iCash,
                iAmount:req.body.iAmount,
                eType:'OUTPUT',
                eState:'REQUEST',
                completedAt:null,
            });
    
            let objectAxios = {strNickname:userinfo.strNickname, strID:userinfo.strID, strContents:req.body.strContents, strGroupID:userinfo.strGroupID};
    
            const cAddress = `${global.strAdminAddress}/manage_inout/output_alert`;
            //axios.get('http://165.22.102.70:3030/manage_inout/output_alert')
            //axios.get(cAddress)
            axios.post(cAddress, objectAxios)
            .then((response)=> {
                console.log(`Axios Success to ${cAddress}`);
                console.log(response);
            })
            .catch((error)=> {
                console.log('axios Error');
                console.log(error);
            });
    
            res.send({result:'OK', reason:'OK'});
        //}
        // else
        // {
        //     res.send({result:'FAIL', ras})
        // }
    }
    
    else
    {
        res.send({result:'Error', reason:'Error'});
    }
    // let isLogin = 0;
    // if ( req.user != undefined )
    //     isLogin = 1;

    // res.render('index', {iPopup:Enum.eNone, isLogin:isLogin});
});

// app.post('/request_output', async (req, res) => {

//     console.log(`request_output : ${1}`);
//     console.log(req.body);

//     const userinfo = await db.Users.findOne({where:{
//         // strBankOwner:req.body.strAccountOwner,
//         // strPassword:req.body.strBankPassword
//         strID:req.body.strID
//     }});

//     const [result] = await db.sequelize.query(
//         `
//         SELECT t1.strNickname AS lev1,
//         t2.strNickname AS lev2,
//         t3.strNickname AS lev3,
//         t4.strNickname AS lev4,
//         t5.strNickname AS lev5
//         FROM Users AS t1
//         LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
//         LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
//         LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
//         LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
//         LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
//         WHERE t6.iClass='8' AND t6.strGroupID LIKE CONCAT('${userinfo.strGroupID}', '%');
//         `
//         );

//     if(userinfo != undefined){

//         if ( userinfo.iCash >= req.body.iAmount )
//         {
//             console.log(`Password Checking : ${req.body.strPassword}, ${userinfo.strOutputPassword}`);

//             //if ( userinfo.strOutputPassword == req.body.strPassword )
//             //{
//                 const inputmoney = await db.Inouts.create({
//                     strID:userinfo.strNickname,
//                     strAdminNickname:result[0].lev1,
//                     strPAdminNickname:result[0].lev2,
//                     strVAdminNickname:result[0].lev3,
//                     strAgentNickname:result[0].lev4,
//                     strShopNickname:result[0].lev5,
//                     iClass:userinfo.iClass,
//                     strName:userinfo.strNickname,
//                     strGroupID:userinfo.strGroupID,
//                     strAccountOwner:userinfo.strBankOwner,
//                     strBankName:userinfo.strBankname,
//                     strAccountNumber:userinfo.strBankAccount,
//                     iPreviousCash:userinfo.iCash,
//                     iAmount:req.body.iAmount,
//                     eType:'OUTPUT',
//                     eState:'REQUEST',
//                     completedAt:null,
//                 });
    
//                 let objectAxios = {strNickname:userinfo.strNickname, strID:userinfo.strID, strContents:req.body.strContents, strGroupID:userinfo.strGroupID};

//                 const cAddress = `${global.strAdminAddress}/manage_inout/output_alert`;
//                 //axios.get('http://165.22.102.70:3030/manage_inout/output_alert')
//                 //axios.get(cAddress)
//                 axios.post(cAddress, objectAxios)
//                 .then((response)=> {
//                     //console.log('axios success');
//                     console.log(`Axios Success Output_Alert`);
//                     console.log(response);
//                 })
//                 .catch((error)=> {
//                     console.log('axios Error');
//                     console.log(error);
//                 });
        
//                 let resultCash = userinfo.iCash - parseInt(req.body.iAmount);
    
//                 await userinfo.update({iCash:resultCash});

//                 res.send({result:'OK', reason:'OK', iAmount:resultCash});
//             // }
//             // else
//             // {
//             //     res.send({result:"FAIL", reason:"INCORRECTPASSWORD"});    
//             // }
//         }
//         else
//         {
//             res.send({result:"FAIL", reason:"NOTENOUGH"});
//         }
//     }
//     else
//     {
//         res.send({result:'Error', reason:'Error'});
//     }
    
//     // let isLogin = 0;
//     // if ( req.user != undefined )
//     //     isLogin = 1;

//     // res.render('index', {iPopup:Enum.eNone, isLogin:isLogin});
// });

app.post('/request_Anncouncement', async (req, res) => {
    const data = req.body;
    console.log("asasa"+data.num);
    const list = await db.Announcements.findOne({
        where:{
            id: data.num,
        },
    });

    res.send(list);
})

app.post('/request_listannouncement', async (req, res) => {

    const list = await db.Announcements.findAll({
        where:{eType:'ANN', eState:'ENABLE'},
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

app.post('/request_listannouncementpopup', async (req, res) => {

    const list = await db.Announcements.findAll({
        where:{eType:'POPUP', eState:'ENABLE'},
        order:[['createdAt','DESC']]
    });

    res.send(list);
});

app.post('/UpdateCoin', async(req, res) => {
    
    console.log(`##############################################################updatecoin socket_list.length = ${Object.keys(socket_list).length}`);
    console.log(req.body);

    for ( let i in socket_list )
    {
        console.log(`/UpdateCoin socket_list[i].strNickname (${socket_list[i].strNickname}), req.body.strNickname (${socket_list[i].strNickname})`);
        if ( socket_list[i].strNickname == req.body.strNickname )
        {
            socket_list[i].emit('UpdateCash', parseInt(req.body.iAmount));
        }
    }

    res.send('OK');
});

app.post('/AlertLetter', async(req, res) => {

    console.log("##############################################################AlertLetter");
    console.log(req.body);

    for ( let i in socket_list )
    {
        if ( socket_list[i].strNickname == req.body.strNickname )
        {
            socket_list[i].emit('AlertLetter', req.body.strContents);
        }
    }

    res.send('OK');
});

const cPort = process.env.EXPRESS_PORT || 3010;
server.listen(cPort, () => {
    console.log(`Casino Unover Server Server Started At ${cPort}`);
});

setInterval(async () => {
}, 1000);

var socket_list = {};

global.socket_list = socket_list;

io.on('connection', (socket) => {

    socket.id = Math.random();
    socket_list[socket.id] = socket;

    console.log(`connected ${socket.id}, length ${util_object.getObjectLength(socket_list)}`);

    socket.on('request_login', (user) => {

        console.log(`############################################# socket packet request_login ${user.strNickname}, ${user.strGroupID}, ${user.iClass}`);

        socket.strGroupID = user.strGroupID;
        socket.iClass = user.iClass;
        socket.strNickname = user.strNickname;
        socket.strID = user.strID;

        socket.emit('response_login', "responsedata");
    });

    // socket.on('group', (group) => {
    //     console.log(`group : ${group}`);

    //     socket.group = group;
    // })

    socket.on('disconnect', async () => {
        
        console.log(`socket.on disconnect ${socket.strID}`);
        
        if ( socket.strID != undefined )
        {
            await db.Sessions.destroy({where:{strID:socket.strID}, truncate:true});
        }

        delete socket_list[socket.id];

        console.log(`disconnected ${socket.id}, length ${util_object.getObjectLength(socket_list)}`);
    });
});

app.post('/realtime_user', (req, res) => {

    let listData = [];
    // listData.push('회원18');
    // listData.push('회원19');

    for ( let i in socket_list )
    {
        if ( socket_list[i].strNickname != undefined )
        {
            //listData.push(socket_list[i].strNickname);
            listData.push({strNickname:socket_list[i].strNickname, strGroupID:socket_list[i].strGroupID, iClass:socket_list[i].iClass});
        }
    }

    axios.post(`${global.strAdminAddress}/manage_user/realtime_user`, listData)
        .then((response)=> {
                //console.log('axios success');
            })
        .catch((error)=> {
            //console.log('axios Error');
            //console.log(error);
        });
});

app.post('/realtime_user_logout', (req, res) => {
    console.log(`/realtime_user_logout`);
    console.log(req.body);
    console.log(socket_list);
    for ( let i in socket_list )
    {
        console.log('1#####################');
        console.log(socket_list[i]);
        console.log('2#####################');
        console.log(`${socket_list[i].strID} / ${req.body.strID}`);
        if ( socket_list[i].strID == req.body.strID )
        {
            console.log(`일치 : ${socket_list[i].strID} / ${req.body.strID}`);
            socket_list[i].emit('UserLogout');
        }
    }
});

app.post('/request_changepassword', async (req, res) => {

    console.log(`/request_changepassword`);
    console.log(req.body);

    await db.Users.update({strPassword:req.body.strPassword}, {where:{strID:req.body.strID}});

    res.send({result:'OK'});
});

