const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// var seq = require('./db');
var db = require('./models');
const {where} = require("sequelize");
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
            usernameField: 'strNickname',
            passwordField: 'strPassword',
            session: true,
            passReqToCallback: true,
        },
        async function (req, username, password, done) {

            try {
                let user = await db.Users.findOne({ where: { strID: username } });

                if ( user == undefined )
                {
                    console.log(`Invalid User`);
                    return done(null, false, { message: '없는 사용자 아이디 입니다.' });
                }

                if ( user.eState != 'NORMAL' )
                {
                    return done(null, false, { message: '접속이 제한된 계정입니다. 관리자에 문의 하세요.'});
                }

                if (user.strPassword != password) {
                    console.timeLog(`Invalid Password`);

                    let iNumLoginFailed = user.iNumLoginFailed ?? 0;
                    await db.Users.update({iNumLoginFailed: iNumLoginFailed+1}, {where:{strID:username}});

                    if ( iNumLoginFailed >= 19 )
                    {
                        await db.Users.update({eState:'BLOCK'}, {where:{strID:username}});
                        return done(null, false, { message: '비밀번호 20회 오류로 접속이 제한됩니다.'} );
                    }

                    return done(null, false, { message: `비밀번호가 틀렸습니다.(${iNumLoginFailed+1}/20)` });
                }

                if ( user.iClass >= 8 )
                {
                    return done(null, false, { message: '접근 권한이 없는 아이디 입니다.'});
                }

                console.log(`Parameter : ${username}, ${password}, DB User : ${user.strNickname}`);

                await db.Users.update({loginedAt : db.sequelize.literal('CURRENT_TIMESTAMP'), iNumLoginFailed:0}, { where: { strID: username } });

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

