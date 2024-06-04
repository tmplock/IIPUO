const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const db = require('../db');

const IHelperUser = require('../helpers/user');

let listOnlineUser = [];
let listLogout = [];

let PrintUsers = (list, strDesc) => {

    console.log(`# ${strDesc} PrintUsers`);
    console.log(list);
}

router.get('/onlineuser', (req, res) => {

    res.send(listOnlineUser);
});

router.get('/logoutuser', (req, res) => {

    res.send(listLogout);
})


router.post('/login', (req, res) => {

    console.log(`/account/login`);
    console.log(req.body);

    IHelperUser.AddOnlineUser(req.body.strID, req.body.eType);
    console.log(`# AddOnlineUser`);
    PrintUsers(listOnlineUser, 'AddOnlineUser');

    res.send({eResult:'OK'});
});

router.post('/checklogout', (req, res) => {

    console.log(`/account/checklogout`);
    console.log(req.body);

    PrintUsers(listLogout, 'LogoutUser');

    let objectData = {strID:req.body.strID};

    const user = IHelperUser.FindUser(listLogout, objectData);
    if ( null != user )
    {
        res.send({eResult:'OK', iLogout:1});
    }
    else
    {
        res.send({eResult:'OK', iLogout:0});
    }
});

router.post('/logoutcomplete', (req, res) => {

    console.log(`/account/checklogout`);
    console.log(req.body);

    let objectData = {strID:req.body.strID, eType:req.body.eType};

    const user = IHelperUser.FindUser(listLogout, objectData);
    if ( null != user )
    {
        IHelperUser.RemoveUser(listLogout, user);
        PrintUsers(listLogout, 'LogoutUser')
    }
    else
    {
        res.send({eResult:'OK', iLogout:0});
    }

});

module.exports = router;