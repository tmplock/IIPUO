const db = require('../db');

const IUser = require('./IUser');

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
    //await UpdateUserCash(strID, -parseInt(iBet), `BET:${strVender},${strGameID},${strTableID}`);
    await IUser.DecrementUserCash(strID, iBet);

    await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, 0, 'STANDBY', 'BET', strURL);
}

exports.ProcessWin = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iWin, strURL) => {

    if ( parseInt(iWin) <= 0 )
        return;

    await IUser.IncrementUserCash(strID, iWin);

    await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, 'STANDBY', 'WIN', strURL);
    //await UpdateUserCash(strID, iWin, `WIN:${strVender},${strGameID},${strTableID}`);


    // switch ( iGameCode )
    // {
    // case 0: //  바카라일 경우만
    //     {
    //         //  베팅한 상태에서 완료가 안된 상태만 조회
    //         let bet = await db.RecordBets.findOne({where:{strID:strID, strRound:strRound, strVender:strVender, eState:'STANDBY'}});
    //         if ( bet != null )
    //         {
    //             if ( bet.iBet == iWin )
    //             {
    //                 //  TIE WIN
    //                 //await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'STANDBY'}, {where:{id:bet.id}});
    //                 //  계산을 할 필요가 없어서 바로 COMPLETE 로 설정
    //                 await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
    //             }
    //             else
    //             {
    //                 if ( bet.strVender == 'EZUGI' )
    //                 {
    //                     await db.RecordBets.update({iWin:iWin, eType:'BETWIN', eState:'STANDBY', strUniqueID:strUniqueID, strDetail:strDetail, strResult:strResult}, {where:{id:bet.id}});
    //                 }
    //                 else
    //                 {
    //                     await db.RecordBets.update({iWin:iWin, eType:'BETWIN', eState:'STANDBY', strUniqueID:strUniqueID}, {where:{id:bet.id}});
    //                 }
    //             }
    //             //await UpdateUserCash(strID, iWin, `WIN:${strVender},${strGameID},${strTableID}`);
    //             await IUser.IncrementUserCash(strID, iWin);
    //         }
    //         else
    //         {
    //             let eState = 'STANDBY';
    //             await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);
    //             //await UpdateUserCash(strID, iWin, `WIN:${strVender},${strGameID},${strTableID}`);
    //             await IUser.IncrementUserCash(strID, iWin);
    //         }
    //     }
    //     break;
    // default:
    //     {
    //         let eState = 'STANDBY';
    //         await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);

    //         //await UpdateUserCash(strID, iWin, `WIN:${strVender},${strGameID},${strTableID}`);
    //         await IUser.IncrementUserCash(strID, iWin);
    //     }
    //     break;
    // }
}

exports.ProcessCancel = async (strUniqueID) => {

    let bet = null;
    if ( strUniqueID != '' && strUniqueID != null )
    {
        bet = await db.RecordBets.findOne({where:{strUniqueID:strUniqueID}});
    }

    if ( bet != null )
    {
        switch ( bet.eType )
        {
            case 'BET':
                if ( bet.eState == 'COMPLETE' )
                    await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL_BET'}, {where:{id:bet.id}});
                else
                    await db.RecordBets.update({eState:'COMPLETE', eType:'CANCEL_BET'}, {where:{id:bet.id}});

                //await UpdateUserCash(bet.strID, bet.iBet, `CANCEL:${bet.strVender},${bet.strGameID},${bet.strTableID}`);
                await IUser.IncrementUserCash(strID, bet.iBet);
                break;
            case 'WIN':
                if ( bet.eState == 'COMPLETE' )
                    await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL_WIN'}, {where:{id:bet.id}});
                else
                    await db.RecordBets.update({eState:'COMPLETE', eType:'CANCEL_WIN'}, {where:{id:bet.id}});

                //await UpdateUserCash(bet.strID, -parseInt(bet.iWin), `CANCEL:${bet.strVender},${bet.strGameID},${bet.strTableID}`);
                await IUser.DecrementUserCash(strID, bet.iWin);
                break;
            // case 'BETWIN':
            //     {
            //         if ( bet.eState == 'COMPLETE' )
            //         {
            //             await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL'}, {where:{id:bet.id}});
            //         }
            //         else
            //         {
            //             await db.RecordBets.update({eState:'COMPLETE', eType:'CANCEL'}, {where:{id:bet.id}});                        
            //         }
            //         const cDiff = parseInt(bet.iBet)-parseInt(bet.iWin);
            //         await UpdateUserCash(bet.strID, cDiff, `CANCEL:${bet.strVender},${bet.strGameID},${bet.strTableID}`);
            //     }
            //     break;
        }
    }
}