const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const db = require('../db');

let listOnlineUser = [];
let listLogout = [];

let RemoveUser = (list, objectData) => {

    console.log(`##### RemoveUser`);

    for ( let i in list )
    {
        if ( list[i].strID == objectData.strID && list[i].eType == objectData.eType )
        {
            list.splice(i, 1);
            return;            
        }
    }
}

let FindUser = (list, objectData) => {

    for ( let i in list )
    {
        if ( list[i].strID == objectData.strID && list[i].eType == objectData.eType )
        {
            return list[i];
        }
    }
    return null;
}

let AddOnlineUser = (strID, eType) => {

    const eTargetType = eType == 'USER' ? 'CMS' : 'WEB';

    const targetuser = FindUser(listOnlineUser, {eType:eTargetType, strID:strID});
    if ( null != targetuser )
    {
        listLogout.push(targetuser);
        RemoveUser(listOnlineUser, targetuser);
    }

    const sameuser = FindUser(listOnlineUser, {eType:eType, strID:strID});
    if ( null == sameuser )
    {
        listOnlineUser.push({eType:eType, strID:strID});
    }
}

let PrintUsers = (list, strDesc) => {

    console.log(`# ${strDesc} PrintUsers`);
    console.log(list);
}

router.post('/login', (req, res) => {

    console.log(`/account/login`);
    console.log(req.body);

    AddOnlineUser(req.body.strID, req.body.eType);
    console.log(`# AddOnlineUser`);
    PrintUsers(listOnlineUser, 'AddOnlineUser');

    res.send({result:'OK'});
});

router.post('/checklogout', (req, res) => {

    console.log(`/account/checklogout`);
    console.log(req.body);

    PrintUsers(listLogout, 'LogoutUser Enter')

    const user = FindUser(listLogout, req.body);
    if ( null != user )
    {
        RemoveUser(listLogout, user);
        res.send({result:'OK', iLogout:1});

        PrintUsers(listLogout, 'LogoutUser Complete')
    }
    else
    {
        req.send({result:'OK', iLogout:0});
    }
});

module.exports = router;