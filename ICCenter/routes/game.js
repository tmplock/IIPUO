const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const db = require('../db');

const IBettingManager = require('../helpers/IBettingManager');
const IUser = require('../helpers/IUser');

router.post('/authenticate', async (req, res) => {

    console.log('##################################################/game/authenticate');
    console.log(req.body);

    // if ( req.body.strToken != undefined )
    // {
    //     const user = await db.Users.findOne({where:{vivoToken:req.body.strToken}});

    //     if ( user != null )
    //     {
    //         //res.send({result:'OK', strID:user.strID, strNickname:user.strNickname, iCash:user.iCash, iSessionID:req.session.id, strIP: user.strIP});
    //     }
    //     else
    //     {
    //         res.send({result:'Error'});
    //     }
    // }
    // else if ( req.body.strID != undefined )
    if ( req.body.strID != undefined )
    {
        //const user = await db.Users.findOne({where:{strID:req.body.strID}});
        const user = await IUser.GetUser(req.body.strID);

        if ( user != null )
        {
            //res.send({result:'OK', strID:user.strID, strNickname:user.strNickname, iCash:user.iCash, iSessionID:req.session.id, strIP: user.strIP});
            res.send({result:'OK', strID:user.strID, strNickname:user.strNickname, iCash:user.iCash, iSessionID:'', strIP:''});
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

router.post('/bet', async (req, res) => {

    console.log('##################################################/game/bet');
    console.log(req.body);
    
    //const user = await db.Users.findOne({where: { strID: req.body.strID }});
    const user = await IUser.GetUser(req.body.strID);

    if ( user != null )
    {
        const cBetAmount = parseInt(req.body.strAmount);
        const iOriginCash = parseInt(user.iCash);
    
        if (iOriginCash >= cBetAmount) 
        {
            const iUpdatedCash = parseInt(iOriginCash) - cBetAmount;
    
            res.send({ result: 'OK', iCash: iUpdatedCash });
            
            await IBettingManager.ProcessBet(user.strID, user.strNickname, user.strGroupID, user.iClass, iOriginCash, req.body.iGameCode, req.body.strVender, req.body.strGameID, req.body.strTableID, req.body.strRoundID, req.body.strTransactionID, req.body.strDesc, '', 0, cBetAmount, '');
        }
        else 
        {
            res.send({result:'Error', iCash:iOriginCash, eCode:'NotEnoughBalance'});
        }
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.post('/win', async (req, res) => {

    console.log('##################################################/game/win');
    console.log(req.body);

    //const cURL = req.get('origin');

    // const user = await db.Users.findOne({
    //     where: { strID: req.body.strID },
    //     // raw: true // 캐싱 비활성화, 최신 데이터 조회
    // });

    const user = await IUser.GetUser(req.body.strID);

    if ( user != null )
    {
        const cWinAmount = parseInt(req.body.strAmount);
        const iCash = parseInt(user.iCash) + cWinAmount;
    
        res.send({result:'OK', iCash:iCash});
    
        // await IBettingManager.ProcessWin(user.strID, user.strNickname, user.strGroupID, user.iClass, user.iCash, req.body.iGameCode, req.body.strVender, req.body.strGameID,
        //     req.body.strTableID, req.body.strRoundID, req.body.strTransactionID, req.body.strDesc, '', 0, cWinAmount, cURL);
    
        await IBettingManager.ProcessWin(user.strID, user.strNickname, user.strGroupID, user.iClass, user.iCash, req.body.iGameCode, req.body.strVender, req.body.strGameID,
            req.body.strTableID, req.body.strRoundID, req.body.strTransactionID, req.body.strTarget, req.body.strDesc, 0, cWinAmount, 'cURL');
    
    }
    else
    {
        res.send({result:'Error', iCash:0, eCode:'NotFoundUser'});
    }

    //UpdateUserPageCash(req.body.strID, iCash);
});

router.post('/cancel', async (req, res) => {

    console.log('##################################################/game/cancel');
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

    //const user = await db.Users.findOne({where:{strID:req.body.strID}});
    const user = await IUser.GetUser(req.body.strID);
    if ( user != null )
    {
        res.send({result:'OK', iCash:user.iCash});

        await IBettingManager.ProcessCancel(req.body.strTransactionID);
    }
    else
    {
        res.send({result:'Error', iCash:0, eCode:'NotFoundUser'});
    }

    

    //UpdateUserPageCash(req.body.strID, user.iCash);

});

module.exports = router;