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

    console.log(`FindUser`);
    console.log(objectData);

    for ( let i in list )
    {
        if ( list[i].strID == objectData.strID )
        {
            return list[i];
        }
    }
    return null;
}

let AddOnlineUser = (strID, eType) => {

    const eTargetType = eType == 'USER' ? 'CMS' : 'USER';

    let user = FindUser(listOnlineUser, {strID:strID});
    if ( null != user )
    {
        listLogout.push({eType:eTargetType, strID:strID});
        user.eType = eType;
    }
    else
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

    PrintUsers(listLogout, 'LogoutUser Enter');

    let objectData = {strID:req.body.strID};

    const user = FindUser(listLogout, objectData);
    if ( null != user )
    {
        RemoveUser(listLogout, user);
        res.send({result:'OK', iLogout:1});

        PrintUsers(listLogout, 'LogoutUser Complete')
    }
    else
    {
        res.send({result:'OK', iLogout:0});
    }
});

module.exports = router;