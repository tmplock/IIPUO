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

    // switch ( strVender )
    // {
    //     case 'VIVO':
    //         if ( strGameID == 2 )
    //             eType = 'BETRD';
    //         break;
    //     case 'EZUGI':
    //         if ( strTableID == 100 || strTableID == 101 || strTableID == 102 || strTableID == 105 || strTableID == 106 || strTableID == 32100 || strTableID == 32101 || strTableID == 32102 || strTableID == 32103 || strTableID == 170 || strTableID == 171 )
    //             eType = 'BETRD';
    //         break;
    //     case 'CQ9':
    //         eType = 'BETRD';
    //         break;
    //     case 'HONORLINK':
    //         // //if ( iGameCode == 0 )
    //         // if ( strGameID == 'evolution' && iGameCode == 0 )
    //         //     eType = 'BETRD';
    //         break;
    // }

    await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, 0, eState, eType, strURL);
}

// exports.ProcessWin = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iWin, strURL) => {

//     //  슬롯일 경우 무조건 새로 생성
//     if ( iGameCode == 200 ) // When win event occured from slot
//     {
//         if (iWin > 0)
//         {
//             let eState = 'STANDBY';
//             await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);

//         }
//         return;
//     }

//     //  베팅한 상태에서 완료가 안된 상태만 조회
//     let bet = await db.RecordBets.findOne({where:{strID:strID, strRound:strRound, strVender:strVender, eState:'STANDBY'}});
//     if ( bet != null )
//     {
//         if ( bet.iBet == iWin )
//         {
//             //  TIE WIN
//             //await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'STANDBY'}, {where:{id:bet.id}});
//             //  계산을 할 필요가 없어서 바로 COMPLETE 로 설정
//             await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
//         }
//         else
//         {
//             const cWin = parseFloat(bet.iWin) + iWin;
//             await db.RecordBets.update({iWin:cWin, eType:'BETWIN', eState:'STANDBY', strUniqueID:strUniqueID}, {where:{id:bet.id}});
//         }
//     }
//     else
//     {
//         let eState = 'STANDBY';
//         await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);
//     }
// }

exports.ProcessWin = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iWin, strURL) => {

    if ( iWin <= 0 )
        return;

    //  슬롯일 경우 무조건 새로 생성
    switch ( iGameCode )
    {
    case 0:
        {
            //  베팅한 상태에서 완료가 안된 상태만 조회
            let bet = await db.RecordBets.findOne({where:{strID:strID, strRound:strRound, strVender:strVender, eState:'STANDBY'}});
            if ( bet != null )
            {
                if ( bet.iBet == iWin )
                {
                    //  TIE WIN
                    //await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'STANDBY'}, {where:{id:bet.id}});
                    //  계산을 할 필요가 없어서 바로 COMPLETE 로 설정
                    await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
                }
                else
                {
                    const cWin = parseFloat(bet.iWin) + iWin;
                    await db.RecordBets.update({iWin:cWin, eType:'BETWIN', eState:'STANDBY', strUniqueID:strUniqueID}, {where:{id:bet.id}});
                }
            }
            else
            {
                let eState = 'STANDBY';
                await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);
            }
        }
        break;
    default:
        {
            let eState = 'STANDBY';
            await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);
        }
        break;
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

    //if ( bet != null )
    //  COMPLETE 가 된 상태에서만 처리한다. 다른건 할 필요가 없음.
    if ( bet != null && bet.eState == 'COMPLETE' )
    {
        //await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL'}, {where:{id:bet.id}});

        //  
        switch ( eType )
        {
            case 'BET':
                await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL_BET'}, {where:{id:bet.id}});
                break;
            case 'WIN':
                await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL_WIN'}, {where:{id:bet.id}});
                break;
            // case 'BETWIN':  // 이건 사실 오진 않는다.
            //     await db.RecordBets.update({eState:'STANDBY', eType:'CANCEL'}, {where:{id:bet.id}});
            //     break;
        }
    }

}
// exports.ProcessBet = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, strURL) => {

//     console.log(`##### exports.ProcessBet : ${strID}`);
//     await db.Users.decrement({iCash:parseFloat(iBet)}, {where:{strID:strID}});

//     let eType = 'BET';
//     let eState = 'STANDBY';

//     switch ( strVender )
//     {
//         case 'VIVO':
//             if ( strGameID == 2 )
//                 eType = 'BETRD';
//             break;
//         case 'EZUGI':
//             if ( strTableID == 100 || strTableID == 101 || strTableID == 102 || strTableID == 105 || strTableID == 106 || strTableID == 32100 || strTableID == 32101 || strTableID == 32102 || strTableID == 32103 || strTableID == 170 || strTableID == 171 )
//                 eType = 'BETRD';
//             break;
//         case 'CQ9':
//             eType = 'BETRD';
//             break;
//         case 'HONORLINK':
//             // //if ( iGameCode == 0 )
//             // if ( strGameID == 'evolution' && iGameCode == 0 )
//             //     eType = 'BETRD';
//             break;
//     }

//     await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iBet, 0, eState, eType, strURL);
// }

// exports.ProcessWin = async (strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, iWin, strURL) => {

//     //  슬롯일 경우 무조건 새로 생성
//     if ( iGameCode == 200 ) // When win event occured from slot
//     {
//         if (iWin > 0)
//         {
//             let eState = 'STANDBY';
//             await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);

//         }
//         return;
//     }

//     //  베팅한 상태에서 완료가 안된 상태만 조회
//     let bet = await db.RecordBets.findOne({where:{strID:strID, strRound:strRound, strVender:strVender, eState:'STANDBY'}});
//     if ( bet != null )
//     {
//         //const cResultWin = parseInt(bet.iWin) + parseInt(iWin);

//         switch ( strVender )
//         {
//             case 'VIVO':
//                 {
//                     let listBet = vVivo.ParseBetDetails(strGameID, bet.strDetail, bet.iBet, bet.iBalance);
//                     console.log(listBet);
            
//                     let listWin = vVivo.ParseWinDetails(strGameID, strDetail, iWin, iBalance);
//                     console.log(listWin);
        
//                     let listFinal = vVivo.GetDetails(listBet, listWin);
//                     console.log(listFinal);
        
//                     let listCards = vVivo.GetCards(strDetail);
        
//                     if ( bet.iBet == iWin )
//                     {
//                         await db.RecordBets.update({iWin:iWin, strDetail:JSON.stringify(listFinal), strResult:JSON.stringify(listCards), eType:'CANCEL_BET', eState:'COMPLETE'}, {where:{id:bet.id}});
//                     }
//                     else
//                     {
//                         await db.RecordBets.update({iWin:iWin, strDetail:JSON.stringify(listFinal), strResult:JSON.stringify(listCards), eType:'RD', eState:'STANDBY'}, {where:{id:bet.id}});
//                     }
//                 }
//                 break;
//             case 'EZUGI':
//             case 'CQ9':
//             case 'HONORLINK':
//                 {
//                     if ( bet.iBet == iWin )
//                     {
//                         await db.RecordBets.update({iWin:iWin, strUniqueID:strUniqueID, eType:'CANCEL_BET', eState:'STANDBY'}, {where:{id:bet.id}});
//                     }
//                     else
//                     {
//                         if ( bet.eType == 'BETRD' )
//                         {
//                             await db.RecordBets.update({iWin:iWin, strUniqueID:strUniqueID, eType:'RD', eState:'STANDBY'}, {where:{id:bet.id}});
//                         }
//                         else if ( bet.eType == 'BET' )
//                         {
//                             await db.RecordBets.update({iWin:iWin, strUniqueID:strUniqueID, eType:'BETWIN', eState:'STANDBY'}, {where:{id:bet.id}});
//                         }
//                         else
//                         {
//                             const cWin = parseFloat(bet.iWin) + iWin;
    
//                             //await db.RecordBets.update({iWin:iWin, eType:'WIN', eState:'STANDBY'}, {where:{id:bet.id}});
//                             await db.RecordBets.update({iWin:cWin, eType:'BETWIN', eState:'STANDBY'}, {where:{id:bet.id}});
//                         }
//                     }
//                 }
//                 break;
//             default:
//                 {
//                     if ( bet.iBet == iWin )
//                     {
//                         //  TIE WIN
//                         await db.RecordBets.update({iWin:iWin, eType:'CANCEL_BET', eState:'STANDBY'}, {where:{id:bet.id}});
//                     }
//                     else
//                     {
//                         const cWin = parseFloat(bet.iWin) + iWin;

//                         //await db.RecordBets.update({iWin:iWin, eType:'WIN', eState:'STANDBY'}, {where:{id:bet.id}});
//                         await db.RecordBets.update({iWin:cWin, eType:'BETWIN', eState:'STANDBY'}, {where:{id:bet.id}});
//                     }
//                 }
//                 break;
//         }
//     }
//     else
//     {
//         let eState = 'STANDBY';
//         await CreateBet(strID, strNickname, strGroupID, iClass, iBalance, iGameCode, strVender, strGameID, strTableID, strRound, strUniqueID, strDetail, strResult, iTarget, 0, iWin, eState, 'WIN', strURL);
//     }
// }