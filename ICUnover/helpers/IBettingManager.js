const Enum = require('./enum');
const db = require('../db');
const axios = require('axios');

const vVivo = require('../vender/vivo');

let CreateBet = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, iWin, eState, eType, strURL) => {

    await db.RecordBets.create({
        strID:strID,
        strNickname:strNickname,
        strGroupID:strGroupID,
        iClass:iClass,
        iBalance:iBalance,
        iGameCode:iGameCode,
        strVender:strVender,
        strGameID:strGameID,
        strRound:strRound,
        strTableID:strTableID,
        strUniqueID:strUniqueID,
        strDetail:strDetail,
        strResult:strResult,
        strOverview:'',
        iTarget:iTarget,
        iBet:iBet,
        iWin:iWin,
        eState:eState,
        eType:eType,
        strURL:strURL,
    });
}

exports.ProcessBet = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, strURL) => {

    console.log(`##### exports.ProcessBet : ${strID}`);
    await db.Users.decrement({iCash:parseFloat(iBet)}, {where:{strID:strID}});

    let eType = 'BET';
    let eState = 'STANDBY';

    switch ( strVender )
    {
        case 'VIVO':
            if ( strGameID == 2 )
                eType = 'BETRD';
            break;
        case 'EZUGI':
            eType = 'BETRD';
            break;
        case 'CQ9':
            eType = 'BETRD';
            break;
        case 'HONORLINK':
            //if ( iGameCode == 0 )
            if ( strGameID == 'evolution' && iGameCode == 0 )
                eType = 'BETRD';
            break;
    }

    await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, 0, eState, eType, strURL);
}

exports.ProcessWin = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iWin, strURL) => {

    let bet = await db.RecordBets.findOne({where:{strID:strID, strRound:strRound, strVender:strVender}});
    if ( bet != null )
    {
        switch ( strVender )
        {
            case 'VIVO':
                {
                    let listBet = vVivo.ParseBetDetails(strGameID, bet.strDetail, bet.iBet, bet.iBalance);
                    console.log(listBet);
            
                    let listWin = vVivo.ParseWinDetails(strGameID, strDetail, iWin, iBalance);
                    console.log(listWin);
        
                    let listFinal = vVivo.GetDetails(listBet, listWin);
                    console.log(listFinal);
        
                    let listCards = vVivo.GetCards(strDetail);
        
                    if ( bet.iBet == iWin )
                    {
                        await db.RecordBets.update({iWin:iWin, strDetail:JSON.stringify(listFinal), strResult:JSON.stringify(listCards), eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
                    }
                    else
                    {
                        await db.RecordBets.update({iWin:iWin, strDetail:JSON.stringify(listFinal), strResult:JSON.stringify(listCards), eType:'RD', eState:'STANDBY'}, {where:{id:bet.id}});
                    }
                }
                break;
            case 'EZUGI':
            case 'CQ9':
            case 'HONORLINK':
                {
                    if ( bet.eType == 'BETRD' )
                    {
                        if ( bet.iBet == iWin )
                        {
                            await db.RecordBets.update({iWin:iWin, strUniqueID:strUniqueID, eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
                        }
                        else
                            await db.RecordBets.update({iWin:iWin, strUniqueID:strUniqueID, eType:'RD', eState:'STANDBY'}, {where:{id:bet.id}});
                    }
                    else
                    {
                        await db.RecordBets.update({iWin:iWin, eType:'WIN', eState:'STANDBY'}, {where:{id:bet.id}});
                    }
                }
                break;
            default:
                {
                    if ( bet.iBet == iWin )
                    {
                        //  TIE WIN
                        await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
                    }
                    else
                        await db.RecordBets.update({iWin:iWin, eType:'WIN', eState:'STANDBY'}, {where:{id:bet.id}});
                }
                break;
        }
    }
    else
    {
        let eState = 'STANDBY';
        await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, 'WIN', eState, strURL);
    }
}

exports.ProcessCancel = async (strUniqueID, strGameID, strRound, eType) => {

    let bet = null;
    if ( strUniqueID != '' && strUniqueID != null )
    {
        bet = await db.RecordBets.findOne({where:{strUniqueID:strUniqueID}});
    }
    if ( bet == null && strGameID != '' && strRound != '' )
    {
        bet = await db.RecordBets.findOne({where:{strGameID:strGameID, strRound:strRound}});
    }

    if ( bet != null )
    {
        switch ( eType )
        {
            case 'BET':
                await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL_BET'}, {where:{id:bet.id}});
                break;
            case 'WIN':
                await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL_WIN'}, {where:{id:bet.id}});
                break;
        }
    }

}