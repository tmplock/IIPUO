const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// var seq = require('./db');
var db = require('./models');
const {where} = require("sequelize");
//var User = require('../models/user')(seq.sequelize, seq.Sequelize);
// var User = seq.Users;
var requestIp = require('request-ip');

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

                // TEST시에는 false로 설정
                let isCheckActive = true;
                if (isCheckActive == true) {
                    // 접근 권한 체크
                    let code = user.strLoginCode ?? '';

                    let permission = code == '' ? await db.Permissions.findOne({where: {iClass:user.iClass}}) : await db.Permissions.findOne({where: {iClass:user.iClass, strLoginCode:code}});
                    if (permission == null) {
                        console.log(`Access Not User`);
                        return done(null, false, { message: '접근 권한이 없는 아이디 입니다.' });
                    }
                    let strURL = permission.strURL;
                    // 보기 전용 계정
                    if (user.iPermission == 100) {
                        strURL = permission.strViewURL;
                    } else {
                        let strIPs = permission.strIPs ?? '';
                        if (strIPs != '') {
                            let ipList = strIPs.replaceAll(' ', '').split(',');
                            let ip = requestIp.getClientIp(req);
                            console.log(`IP : ${ip}`);
                            let hasIp = false;
                            for (let i in ipList) {
                                if (ip == ipList[i]) {
                                    hasIp = true;
                                    break;
                                }
                            }
                            if (hasIp == false) {
                                console.log(`Access Not IP`);
                                return done(null, false, { message: '접근 권한이 없는 IP 입니다.' });
                            }
                        }
                    }
                    // 모바일 http로 접속되는 경우가 있음
                    let host = `https://${req.headers.host}`;
                    if (!host.startsWith(strURL)) {
                        console.log(`Access Not User`);
                        return done(null, false, { message: '접근 권한이 없는 아이디 입니다.' });
                    }
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

                // 접속중인 소켓 카운트 체크하여 중복 로그인 처리하기
                try {
                    if (isCheckActive == true) {
                        let max = user.iLoginMax ?? 1;
                        let list = [];
                        for (let i in socket_list) {
                            if (socket_list[i].strNickname === user.strNickname) {
                                list.push(socket_list[i]);
                            }
                        }
                        list = list.reverse();
                        for (let i = 0; i <= list.length - max; i++) {
                            list[i].emit('UserLogout');
                        }
                    }
                } catch (err) {

                }
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

