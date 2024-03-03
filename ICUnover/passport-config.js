const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var requestIp = require('request-ip');


// var seq = require('./db');
var db = require('./models');
//var User = require('../models/user')(seq.sequelize, seq.Sequelize);
// var User = seq.Users;

module.exports = () => {

    console.log('passport is passed');

    function SessionConstructor(userID, userGroup, details)
    {
        this.userID = userID;
        this.userGroup = userGroup;
        this.details = details;        
    }

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (user_id, done) => {

        const user = await db.Users.findOne({ where: { id: user_id } });
        done(null, user);
    });


    passport.use('local', new LocalStrategy(
        {
            usernameField: 'strID',
            passwordField: 'strPassword',
            session: true,
            passReqToCallback: true,
        },
        async function (req, username, password, done) {

            try {
                var user = await db.Users.findOne({ where: { strID: username } });

                if ( user == undefined ) {
                    console.log(`Invalid User`);
                    return done(null, false, { message: '없는 사용자 아이디 입니다.' });
                }

                if ( user.eState != 'NORMAL' )
                {
                    return done(null, false, { message: '접속이 제한된 계정입니다. 관리자에 문의 하세요.' });
                }

                if (user.strPassword != password) {
                    console.timeLog(`Invalid Password`);
                    let iNumLoginFailed = user.iNumLoginFailed ?? 0;
                    await db.Users.update({iNumLoginFailed:iNumLoginFailed+1}, {where:{strID:username}});

                    if ( user.iNumLoginFailed >= 19 )
                    {
                        await db.Users.update({eState:'BLOCK'}, {where:{strID:username}});
                        return done(null, false, { message: '비밀번호 20회 오류로 접속이 제한됩니다.' });
                    }
                    else
                    {
                        return done(null, false, { message: '비밀번호가 틀렸습니다.' });
                    }
                }

                if (parseInt(user.iClass) < 6) {
                    console.timeLog(`Invalid Password`);
                    return done(null, false, { message: '접속할수 없는 계정입니다.' });
                }

                // console.log(`##### protocol`);
                // console.log(req.url);
                // console.log(req.originalUrl);
                // console.log(req.protocol);
                // console.log(req.header('Referer'));
                // console.log(req.get('host'));
                // console.log(req.get('origin'));

                let session = await db.Sessions.findOne({where:{strID:username}});

                // if ( null != session )
                // {
                //     //console.timeLog(`Already Logined User`);
                //     //await db.Sessions.destroy({where:{strID:username}, truncate:true});
                //     return done(null, false, { message: '이미 접속 중입니다.' });
                // }

                await db.Sessions.create({strID:username});
                req.session.uid = username;

                // if (user.iClass != 8) {
                //     console.timeLog(`Invalid Password`);
                //     return done(null, false, { message: '관리자용 아이디 입니다.' });
                // }
                let ip = requestIp.getClientIp(req);
                console.log(`Parameter : ${username}, ${password}, DB User : ${user.strNickname}, ip : ${ip}`);
                
                await db.Users.update({loginedAt : db.sequelize.literal('CURRENT_TIMESTAMP'), iNumLoginFailed:0, strIP:ip, strURL:req.get('origin')}, { where: { strID: username } });

                return done(null, user);
            } 
            catch ( e ) 
            {
                console.log(e);
                return done(e);
            }
        }
    ));
}

