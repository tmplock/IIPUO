const express = require('express');
const router = express.Router();

//const db = require('../models');
const db = require('../db');

const IBettingManager = require('../helpers/IBettingManager');
const IBetting = require('../helpers/IBetting');
const { default: axios } = require('axios');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

let IAccount = {
    strAgentCode:'iip',
    strSecretCode:'iip_unover_secret',
};

let UpdateUserPageCash = (strID, iCash) => {

    console.log(`UpdateUserPageCash : ${strID}, iCash : ${iCash}`);

    for ( let i in global.socket_list )
    {
        console.log(`UpdateUserPageCash : ${global.socket_list[i].strID}, ${strID}`);
        if ( global.socket_list[i].strID == strID )
        {
            global.socket_list[i].emit('UpdateCash', parseInt(iCash));
        }
    }
}


let RequestAxios = async (strAddress, objectData) =>
{
    console.log(`RequestAxios ${strAddress}`);
    console.log(objectData);

    try {
        const customAxios = axios.create({});
        const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json'}});
        console.log(response.data);
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

router.post('/sm', async (req, res) => {

    console.log('################################################## /game/sm');
    console.log(req.body);

    let objectData = {strVender:req.body.strGame, strGameKey:req.body.strGameKey, strID:req.user.strID};
    let res_axios = await RequestAxios(`${global.strVenderAddress}/game/slotlist`, objectData);

    console.log(`QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ`);
    console.log(res_axios.data);
    let listGames = res_axios.data.data;
    let newListGames = [];
    for (let i in listGames) {
        if (listGames[i].type == 'slot') {
            newListGames.push(listGames[i]);
        }
    }
    let count = parseInt(newListGames.length);
    res.render('sm', {iLayout:1, strVender:req.body.strGame, listGames:newListGames, data: res_axios.data, count:count, ePublishing:global.ePublishing});
})

router.post('/', async (req, res) => {

    console.log('##################################################/game');
    console.log(req.body);

    if ( req.user == null )
    {
        console.log('req.user is null');
    }
    else
    {
        //let objectData = {strID:req.user.strID, strAgentCode:IAccount.strAgentCode, strSecretCode:IAccount.strSecretCode, strGameKey:req.body.strGameKey};
        let objectData = {strID:req.user.strID, strAgentCode:IAccount.strAgentCode, strSecretCode:IAccount.strSecretCode, strVender:req.body.strGame, strGameKey:req.body.strGameKey, strReturnURL:req.get('origin')+'/game'};

        let res_axios = await RequestAxios(`${global.strVenderAddress}/game`, objectData);

        console.log(`########## res return data`);
        console.log(res_axios);
        //console.log(res_axios.data);

        //if ( res_axios.data.eResult == 'OK' )
        if ( res_axios.result == 'OK')
        {
            await db.Users.update({vivoToken:res_axios.data.strToken}, {where:{strID:res_axios.data.strID}});
            return res.send(res_axios.data.strURL);
        }
        else
        {
            return res.send('');
        }
    }
});

router.post('/ezugitoken', async (req, res) => {

    console.log('##################################################/ezugitoken');
    console.log(req.body);

    console.log(req.body.ezugiToken);
    console.log(req.body.strID);

    if ( req.body.strID != undefined )
    {
        const user = await db.Users.findOne({where:{strID:req.body.strID}});

        if ( user != null )
        {
            await db.Users.update({ezugiToken:req.body.ezugiToken}, {where:{strID:req.body.strID}});
            res.send({result:'OK'});
        }
        else
        {
            res.send({result:'Error'});
        }
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.post('/authenticate', async (req, res) => {

    console.log('##################################################/authenticate');
    console.log(req.body);

    console.log(req.body.strToken);
    console.log(req.body.strID);

    if ( req.body.strToken != undefined )
    {
        console.log("req.body.strToken!!!!!!");
        const user = await db.Users.findOne({where:{vivoToken:req.body.strToken}});

        if ( user != null )
        {
            res.send({result:'OK', strID:user.strID, strNickname:user.strNickname, iCash:user.iCash, iSessionID:req.session.id, strIP: user.strIP});
        }
        else
        {
            res.send({result:'Error'});
        }
    }
    else if ( req.body.strID != undefined )
    {
        console.log("req.body.strID!!!!!!");
        const user = await db.Users.findOne({where:{strID:req.body.strID}});

        if ( user != null )
        {
            res.send({result:'OK', strID:user.strID, strNickname:user.strNickname, iCash:user.iCash, iSessionID:req.session.id, strIP: user.strIP});
        }
        else
        {
            res.send({result:'Error'});
        }
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.post('/balance', async (req, res) => {

});

// router.post('/bet', async (req, res) => {

//     console.log('##################################################/bet');
//     console.log(req.body);
    
//     console.log(`${req.get('origin')}`);
//     console.log(`${req.get('host')}`);

//     const user = await db.Users.findOne({where: { strID: req.body.strID }});
//     //console.log(user.iCash, parseInt(req.body.strAmount));
//     if (user.iCash >= parseFloat(req.body.strAmount)) {

//         let cURL = req.get('origin');
//         if ( cURL == undefined )
//             cURL = req.get('host');

//         const iOriginCash = user.iCash;
//         const iUpdatedCash = parseFloat(iOriginCash) - parseFloat(req.body.strAmount);
//         if ( iUpdatedCash < 0 )
//         {
//             res.send({result:'Error', iCash:iOriginCash});
//         }
//         else
//         {
//             UpdateUserPageCash(req.body.strID, iUpdatedCash);
//             res.send({ result: 'OK', iCash: iUpdatedCash });
           
//             await IBettingManager.ProcessBet(user.strID, user.strNickname, user.strGroupID, user.iClass, iOriginCash, req.body.iGameCode, req.body.strVender, req.body.strGameID, req.body.strTableID, req.body.strRoundID,
//                 req.body.strTransactionID, req.body.strDesc, '', 0, req.body.strAmount, cURL);
//         }
//     }
//     else {
//         res.send({ result: 'Error' });
//         }
//     }
// );
router.post('/bet', async (req, res) => {

    console.log('##################################################/bet');
    console.log(req.body);
    
    console.log(`${req.get('origin')}`);
    console.log(`${req.get('host')}`);

    const user = await db.Users.findOne({where: { strID: req.body.strID }});

    const cBetAmount = parseInt(req.body.strAmount);
    const iOriginCash = parseInt(user.iCash);

    //console.log(user.iCash, cBetAmount);
    if (iOriginCash >= cBetAmount) 
    {
        const iUpdatedCash = parseInt(iOriginCash) - cBetAmount;

        let cURL = req.get('origin');
        if ( cURL == undefined )
            cURL = req.get('host');

        UpdateUserPageCash(req.body.strID, iUpdatedCash);
        res.send({ result: 'OK', iCash: iUpdatedCash });
        
        await IBettingManager.ProcessBet(user.strID, user.strNickname, user.strGroupID, user.iClass, iOriginCash, req.body.iGameCode, req.body.strVender, req.body.strGameID, req.body.strTableID, req.body.strRoundID, req.body.strTransactionID, req.body.strDesc, '', 0, cBetAmount, cURL);
    }
    else 
    {
        res.send({result:'Error', iCash:iOriginCash});
    }
});

// router.post('/win', async (req, res) => {

//     console.log('##################################################/win');
//     console.log(req.body);

//     const cURL = req.get('origin');

//     const user = await db.Users.findOne({
//         where: { strID: req.body.strID },
//         raw: true // 캐싱 비활성화, 최신 데이터 조회
//     });

//     const iCash = parseFloat(user.iCash) + parseFloat(req.body.strAmount);
//     res.send({result:'OK', iCash:iCash});

//     await IBettingManager.ProcessWin(user.strID, user.strNickname, user.strGroupID, user.iClass, user.iCash, req.body.iGameCode, req.body.strVender, req.body.strGameID,
//         req.body.strTableID, req.body.strRoundID, req.body.strTransactionID, req.body.strDesc, '', 0, req.body.strAmount, cURL);

//     await db.Users.increment({iCash:parseFloat(req.body.strAmount)}, {where:{strID:user.strID}});

//     UpdateUserPageCash(req.body.strID, iCash);
// });

router.post('/win', async (req, res) => {

    console.log('##################################################/win');
    console.log(req.body);

    const cURL = req.get('origin');

    const user = await db.Users.findOne({
        where: { strID: req.body.strID },
        // raw: true // 캐싱 비활성화, 최신 데이터 조회
    });

    const cWinAmount = parseInt(req.body.strAmount);
    const iCash = parseInt(user.iCash) + cWinAmount;
    res.send({result:'OK', iCash:iCash});

    await IBettingManager.ProcessWin(user.strID, user.strNickname, user.strGroupID, user.iClass, user.iCash, req.body.iGameCode, req.body.strVender, req.body.strGameID,
        req.body.strTableID, req.body.strRoundID, req.body.strTransactionID, req.body.strDesc, '', 0, cWinAmount, cURL);

    UpdateUserPageCash(req.body.strID, iCash);
});

// router.post('/cancel', async (req, res) => {

//     console.log('##################################################/cancel');
//     console.log(req.body);
//     /*
//         strVender:strVender, 
//         strID:strID,
//         strTransactionID:strTransactionID,
//         strGameID:strGameID,
//         strRound:strRound,
//         eType:eType
//     */

//     //await IBetting.ProcessCancel('', req.body.strTransactionID, 0, req.body.strID);

//     await IBettingManager.ProcessCancel(req.body.strTransactionID, req.body.strGameID, req.body.strRound, req.body.eType);
//     const user = await db.Users.findOne({where:{strID:req.body.strID}});

//     UpdateUserPageCash(req.body.strID, user.iCash);

//     res.send({result:'OK', iCash:user.iCash});
// });
router.post('/cancel', async (req, res) => {

    console.log('##################################################/cancel');
    console.log(req.body);
    /*
        strVender:strVender, 
        strID:strID,
        strTransactionID:strTransactionID,
        strGameID:strGameID,
        strRound:strRound,
        eType:eType
    */

    //await IBettingManager.ProcessCancel(req.body.strTransactionID, req.body.strGameID, req.body.strRound, req.body.eType);
    await IBettingManager.ProcessCancel(req.body.strTransactionID);
    const user = await db.Users.findOne({where:{strID:req.body.strID}});

    UpdateUserPageCash(req.body.strID, user.iCash);

    res.send({result:'OK', iCash:user.iCash});
});

module.exports = router;