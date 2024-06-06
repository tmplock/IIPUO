const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const db = require('../db');

const IHelperUser = require('../helpers/user');

let listOnlineUser = [];
let listLogout = [];

// listOnlineUser.push({eType:'USER', strID:'rrr'});
// listOnlineUser.push({eType:'CMS', strID:'rrr'});

let PrintUsers = (list, strDesc) => {

    console.log(`# ${strDesc} PrintUsers`);
    console.log(list);
}

router.post('/listonline', (req, res) => {

    res.send({result:'OK', data:listOnlineUser});
});

router.post('/listlogout', (req, res) => {

    res.send({result:'OK', data:listLogout});
})


router.post('/login', (req, res) => {

    console.log(`/account/login`);
    console.log(req.body);

    const objectData = {strID:req.body.strID, eType:req.body.eType, strGroupID:req.body.strGroupID, iClass:req.body.iClass, strNickname:req.body.strNickname, strIP:req.body.strIP};

    IHelperUser.AddOnlineUser(listOnlineUser, listLogout, objectData);
    console.log(`# AddOnlineUser`);
    //PrintUsers(listOnlineUser, 'AddOnlineUser');

    res.send({result:'OK'});
});

router.post('/checklogout', (req, res) => {

    console.log(`/account/checklogout`);
    console.log(req.body);

    //PrintUsers(listLogout, 'LogoutUser');

    let objectData = {strID:req.body.strID, eType:req.body.eType};

    const user = IHelperUser.FindUser(listLogout, objectData);
    if ( null != user )
    {
        res.send({result:'OK', iLogout:1});
    }
    else
    {
        res.send({result:'OK', iLogout:0});
    }
});

router.post('/logoutcomplete', (req, res) => {

    console.log(`/account/checklogout`);
    console.log(req.body);

    let objectData = {strID:req.body.strID, eType:req.body.eType};

    const online = IHelperUser.FindUser(listOnlineUser, objectData);
    if ( online != null )
    {
        IHelperUser.RemoveUser(FindUser, online);
    }

    const user = IHelperUser.FindUser(listLogout, objectData);
    if ( null != user )
    {
        IHelperUser.RemoveUser(listLogout, user);
        //PrintUsers(listLogout, 'LogoutUser')
    }
    else
    {
        res.send({result:'OK', iLogout:0});
    }


});

router.post('/insertlogout', (req, res) => {

    console.log(`/account/insertlogout`);
    console.log(req.body);

    if ( req.body.eType != undefined && req.body.strID != undefined )
    {
        const o = {eType:req.body.eType, strID:req.body.strID};

        IHelperUser.AddUser(listLogout, o);    

        res.send({result:'OK', data:listLogout});
    }
    else
    {
        res.send({result:'Error', data:listLogout});
    }
});

router.post('/removelogout', (req, res) => {

    console.log(`/account/removelogout`);
    console.log(req.body);

    if ( req.body.eType != undefined && req.body.strID != undefined )
    {
        const o = {eType:req.body.eType, strID:req.body.strID};
        IHelperUser.RemoveUser(listLogout, o);
        
        res.send({result:'OK', data:listLogout});
    }
    else
    {
        res.send({result:'Error', data:listLogout});
    }
});

router.post('/removeonline', (req, res) => {

    console.log(`/account/removeonline`);
    console.log(req.body);

    if ( req.body.eType != undefined && req.body.strID != undefined )
    {
        const o = {eType:req.body.eType, strID:req.body.strID};
        IHelperUser.RemoveUser(listOnlineUser, o);
        
        res.send({result:'OK', data:listOnlineUser});
    }
    else
    {
        res.send({result:'Error', data:listOnlineUser});
    }
});

module.exports = router;