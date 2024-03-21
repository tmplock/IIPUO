const db = require('../db');
const axios = require('axios');

// const EnumBettingTarget = Object.freeze(
//     {
//         "Tie":0, 
//         "Player":1, 
//         "Banker":2, 
//         "PlayerPair":3, 
//         "BankerPair":4, 
//         "EitherPair":5, 
//         "PerfectPair":6, 
//         "PlayerBonus":7,
//         "BankderBonus":8,

//         //
//         "PlayerUnder":100, 
//         "PlayerOver":101, 
//         "BankerUnder":102, 
//         "BankerOver":103, 

//         //
//         "Slot":200,
//         "PBG":300,
//         "Roulette":400,
//         "Blackjack":500,
//         "DragonTiger":600,
//     }
// );

let GetPBTargetType = (target) => {

    switch(parseInt(target))
    {
    case 0: //파워볼 홀
        return 0;
    case 1: //파워볼 짝
        return 0;
    case 2: //파워볼 오버
        return 0;
    case 3: //파워볼 언더
        return 0;
    case 4: //파워볼 홀오버
        return 1;
    case 5: //파워볼 홀언더
        return 1;
    case 6: //파워볼 짝오버
        return 1;
    case 7: //파워볼 짝언더
        return 1;
    case 8: //일반볼 홀
        return 0;
    case 9: //일반볼 짝
        return 0;
    case 10: //일반볼 오버
        return 0;
    case 11: //일반볼 언더
        return 0;
    case 12: //일반볼 대
        return 0;
    case 13: //일반볼 중
        return 0;
    case 14: //일반볼 소
        return 0;
    case 15: //일반볼 홀오버
        return 1;
    case 16: //일반볼 홀언더
        return 1;
    case 17: //일반볼 짝오버
        return 1;
    case 18: //일반볼 짝언더
        return 1;
    case 19: //일반볼 홀대
        return 1;
    case 20: //일반볼 짝대
        return 1;
    case 21: //일반볼 홀중
        return 1;
    case 22: //일반볼 짝중
        return 1;
    case 23: //일반볼 홀소
        return 1;
    case 24: //일반볼 짝소
        return 1;
    case 25://홀+언더+P홀
        return 2;
    case 26://홀+언더+P짝
        return 2;
    case 27://홀+오버+P홀
        return 2;
    case 28://홀+오버+P짝
        return 2;
    case 29://짝+언더+P홀
        return 2;
    case 30://짝+언더+P짝
        return 2;
    case 31://짝+오버+P홀
        return 2;
    case 32://짝+오버+P짝
        return 2;
    }
}

// exports.GetBettingTarget = (target) => {

//     let iTarget = 0;

//     if ( iTarget == 300 ) {
        
//     }
//     else if(iTarget == 1){//플레이어
//          iTarget = 1;
//     }
//     else if(iTarget == 2){ //뱅커
//         iTarget = 4;
//     }
//     else if(iTarget == 3){ //타이
//         iTarget = 0;
//     }
//     else if(iTarget == 4){//플레이어페어
//          iTarget = 7;
//     }
//     else if(iTarget == 5){//뱅커페어
//         iTarget = 8;
//     }
//     else if(iTarget == 6){//플레이어보너스
//         iTarget = 17;
//     }
//     else if(iTarget == 7){//뱅커보너스
//         iTarget = 17;
//     }
//     else if(iTarget == 8){//퍼펙트페어
//         iTarget = 10;
//     }
//     else if(iTarget == 9){//이더페어
//         iTarget = 9;
//     }
//     else if(iTarget == 12){//플레이어 오버
//         iTarget = 3;
//     }
//     else if(iTarget == 13){//뱅커 오버
//         iTarget = 6;
//     }
//     else if(iTarget == 14){//플레이어 언더
//         iTarget = 2;
//     }
//     else if(iTarget == 15){//뱅커 언더
//         iTarget = 5;
//     }
//     else if(iRoomNo == 1){//룰렛
//         iTarget = 13;
//     }
//     else if(iRoomNo == 4){//블랙 잭
//         iTarget = 12;
//     }
//     else if(iRoomNo == 18){//드래곤 타이거
//         iTarget = 18;
//     }
//     //pp-------------------------------------------------------------
//     else if(iTarget == "PP"){
//         iTarget = 1010;
//     }
//     else if(iTarget == "EP"){
//         iTarget = 1008;
//     }
//     else if(iTarget === "Bnkr"){
//         iTarget = 1004;
//     }
//     else if(iTarget == "Plyr"){
//         iTarget = 1001;
//     }
//     else if(iTarget == "Tie"){
//         iTarget = 1000;
//     }
//     else if(iTarget == "Plyr Pair"){
//         iTarget = 1007;
//     }
//     else if(iTarget == "Bnkr Bon"){
//         iTarget = 1014;
//     }
//     else if(iTarget == "Plyr Bon"){
//         iTarget = 1014;
//     }
//     else if(iTarget == "Bnkr Pair"){
//         iTarget = 1008;
//     }
//     else if(iRoomNo == "204"){//게임 아이디로 타켓값 컨버트할때
//         iTarget = 1014;
//     }
//     else if(iRoomNo == "201"){//게임 아이디로 타켓값 컨버트할때
//         iTarget = 1014;
//     }
//     else if(iTarget == "spin"){
//         iTarget = 1014;
//     }
//     else if(iTarget == "Evolution"){
//         iTarget = 1011;
//     }
// }


// exports.EBettingTarget = EnumBettingTarget;

//ProcessCreate('http://165.22.102.70:3333', newTransaction.gameid, 'Vivo', newTransaction.roundid,newTransaction.trndescription, bettingInfo.target, bettinginfo.chip, user.iCash, newTransaction.id, user.strNickname, user.strGroupID);

let GetOdds = async (strID, iClass) => {

    let objectOdds = {

        strPAdminID:'',
        strVAdminID:'',
        strAgentID:'',
        strShopID:'',
        strUserID:'',

        fPAdminBaccaratR:0,
        fPAdminSlotR:0,
        fPAdminUnderOverR:0,
        fPAdminPBR:0,
        fPAdminPBSingleR:0,
        fPAdminPBDoubleR:0,
        fPAdminPBTripleR:0,

        fVAdminBaccaratR:0,
        fVAdminSlotR:0,
        fVAdminUnderOverR:0,
        fVAdminPBR:0,
        fVAdminPBSingleR:0,
        fVAdminPBDoubleR:0,
        fVAdminPBTripleR:0,

        fAgentBaccaratR:0,
        fAgentSlotR:0,
        fAgentUnderOverR:0,
        fAgentPBR:0,
        fAgentPBSingleR:0,
        fAgentPBDoubleR:0,
        fAgentPBTripleR:0,

        fShopBaccaratR:0,
        fShopSlotR:0,
        fShopUnderOverR:0,
        fShopPBR:0,
        fShopPBSingleR:0,
        fShopPBDoubleR:0,
        fShopPBTripleR:0,

        fUserBaccaratR:0,
        fUserSlotR:0,
        fUserUnderOverR:0,
        fUserPBR:0,
        fUserPBSingleR:0,
        fUserPBDoubleR:0,
        fUserPBTripleR:0
    }

    let strQuery = ``;
    if ( iClass == 5 )
    {
        strQuery = `
        SELECT  t2.fBaccaratR AS fPAdminBaccaratR,
            t2.fSlotR as fPAdminSlotR,
            t2.fUnderOverR as fPAdminUnderOverR,
            t2.fPBR as fPAdminPBR,
            t2.fPBSingleR as fPAdminPBSingleR,
            t2.fPBDoubleR as fPAdminPBDoubleR,
            t2.fPBTripleR as fPAdminPBTripleR,
            t2.strID as strPAdminID,

            t3.fBaccaratR AS fVAdminBaccaratR,
            t3.fSlotR as fVAdminSlotR,
            t3.fUnderOverR as fVAdminUnderOverR,
            t3.fPBR as fVAdminPBR,
            t3.fPBSingleR as fVAdminPBSingleR,
            t3.fPBDoubleR as fVAdminPBDoubleR,
            t3.fPBTripleR as fVAdminPBTripleR,
            t3.strID as strVAdminID

        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        WHERE t3.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strAgentID = '';
            objectOdds.strShopID = '';
            objectOdds.strUserID = '';

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;
        }
    }
    else if ( iClass == 6 )
    {
        strQuery = `
            SELECT  t2.fBaccaratR AS fPAdminBaccaratR,
            t2.fSlotR as fPAdminSlotR,
            t2.fUnderOverR as fPAdminUnderOverR,
            t2.fPBR as fPAdminPBR,
            t2.fPBSingleR as fPAdminPBSingleR,
            t2.fPBDoubleR as fPAdminPBDoubleR,
            t2.fPBTripleR as fPAdminPBTripleR,
            t2.strID as strPAdminID,

            t3.fBaccaratR AS fVAdminBaccaratR,
            t3.fSlotR as fVAdminSlotR,
            t3.fUnderOverR as fVAdminUnderOverR,
            t3.fPBR as fVAdminPBR,
            t3.fPBSingleR as fVAdminPBSingleR,
            t3.fPBDoubleR as fVAdminPBDoubleR,
            t3.fPBTripleR as fVAdminPBTripleR,
            t3.strID as strVAdminID,

            t4.fBaccaratR AS fAgentBaccaratR,
            t4.fSlotR as fAgentSlotR,
            t4.fUnderOverR as fAgentUnderOverR,
            t4.fPBR as fAgentPBR,
            t4.fPBSingleR as fAgentPBSingleR,
            t4.fPBDoubleR as fAgentPBDoubleR,
            t4.fPBTripleR as fAgentPBTripleR,
            t4.strID as strAgentID

        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        WHERE t4.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strAgentID = result[0].strAgentID;
            objectOdds.strShopID = '';
            objectOdds.strUserID = '';

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fAgentBaccaratR = result[0].fAgentBaccaratR;
            objectOdds.fAgentSlotR = result[0].fAgentSlotR;
            objectOdds.fAgentUnderOverR = result[0].fAgentUnderOverR;
            objectOdds.fAgentPBR = result[0].fAgentPBR;
            objectOdds.fAgentPBSingleR = result[0].fAgentPBSingleR;
            objectOdds.fAgentPBDoubleR = result[0].fAgentPBDoubleR;
            objectOdds.fAgentPBTripleR = result[0].fAgentPBTripleR;
        }
    }
    else if ( iClass == 7 )
    {
        strQuery = `
        SELECT  t2.fBaccaratR AS fPAdminBaccaratR,
            t2.fSlotR as fPAdminSlotR,
            t2.fUnderOverR as fPAdminUnderOverR,
            t2.fPBR as fPAdminPBR,
            t2.fPBSingleR as fPAdminPBSingleR,
            t2.fPBDoubleR as fPAdminPBDoubleR,
            t2.fPBTripleR as fPAdminPBTripleR,
            t2.strID as strPAdminID,

            t3.fBaccaratR AS fVAdminBaccaratR,
            t3.fSlotR as fVAdminSlotR,
            t3.fUnderOverR as fVAdminUnderOverR,
            t3.fPBR as fVAdminPBR,
            t3.fPBSingleR as fVAdminPBSingleR,
            t3.fPBDoubleR as fVAdminPBDoubleR,
            t3.fPBTripleR as fVAdminPBTripleR,
            t3.strID as strVAdminID,

            t4.fBaccaratR AS fAgentBaccaratR,
            t4.fSlotR as fAgentSlotR,
            t4.fUnderOverR as fAgentUnderOverR,
            t4.fPBR as fAgentPBR,
            t4.fPBSingleR as fAgentPBSingleR,
            t4.fPBDoubleR as fAgentPBDoubleR,
            t4.fPBTripleR as fAgentPBTripleR,
            t4.strID as strAgentID,

            t5.fBaccaratR AS fShopBaccaratR,
            t5.fSlotR as fShopSlotR,
            t5.fUnderOverR as fShopUnderOverR,
            t5.fPBR as fShopPBR,
            t5.fPBSingleR as fShopPBSingleR,
            t5.fPBDoubleR as fShopPBDoubleR,
            t5.fPBTripleR as fShopPBTripleR,
            t5.strID as strShopID

        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        WHERE t5.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strAgentID = result[0].strAgentID;
            objectOdds.strShopID = result[0].strShopID;
            objectOdds.strUserID = '';

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fAgentBaccaratR = result[0].fAgentBaccaratR;
            objectOdds.fAgentSlotR = result[0].fAgentSlotR;
            objectOdds.fAgentUnderOverR = result[0].fAgentUnderOverR;
            objectOdds.fAgentPBR = result[0].fAgentPBR;
            objectOdds.fAgentPBSingleR = result[0].fAgentPBSingleR;
            objectOdds.fAgentPBDoubleR = result[0].fAgentPBDoubleR;
            objectOdds.fAgentPBTripleR = result[0].fAgentPBTripleR;

            objectOdds.fShopBaccaratR = result[0].fShopBaccaratR;
            objectOdds.fShopSlotR = result[0].fShopSlotR;
            objectOdds.fShopUnderOverR = result[0].fShopUnderOverR;
            objectOdds.fShopPBR = result[0].fShopPBR;
            objectOdds.fShopPBSingleR = result[0].fShopPBSingleR;
            objectOdds.fShopPBDoubleR = result[0].fShopPBDoubleR;
            objectOdds.fShopPBTripleR = result[0].fShopPBTripleR;
        }
    }
    else if ( iClass == 8 )
    {
        strQuery = `
        SELECT  t2.fBaccaratR AS fPAdminBaccaratR,
            t2.fSlotR as fPAdminSlotR,
            t2.fUnderOverR as fPAdminUnderOverR,
            t2.fPBR as fPAdminPBR,
            t2.fPBSingleR as fPAdminPBSingleR,
            t2.fPBDoubleR as fPAdminPBDoubleR,
            t2.fPBTripleR as fPAdminPBTripleR,
            t2.strID as strPAdminID,

            t3.fBaccaratR AS fVAdminBaccaratR,
            t3.fSlotR as fVAdminSlotR,
            t3.fUnderOverR as fVAdminUnderOverR,
            t3.fPBR as fVAdminPBR,
            t3.fPBSingleR as fVAdminPBSingleR,
            t3.fPBDoubleR as fVAdminPBDoubleR,
            t3.fPBTripleR as fVAdminPBTripleR,
            t3.strID as strVAdminID,

            t4.fBaccaratR AS fAgentBaccaratR,
            t4.fSlotR as fAgentSlotR,
            t4.fUnderOverR as fAgentUnderOverR,
            t4.fPBR as fAgentPBR,
            t4.fPBSingleR as fAgentPBSingleR,
            t4.fPBDoubleR as fAgentPBDoubleR,
            t4.fPBTripleR as fAgentPBTripleR,
            t4.strID as strAgentID,

            t5.fBaccaratR AS fShopBaccaratR,
            t5.fSlotR as fShopSlotR,
            t5.fUnderOverR as fShopUnderOverR,
            t5.fPBR as fShopPBR,
            t5.fPBSingleR as fShopPBSingleR,
            t5.fPBDoubleR as fShopPBDoubleR,
            t5.fPBTripleR as fShopPBTripleR,
            t5.strID as strShopID,

            t6.fBaccaratR AS fUserBaccaratR,
            t6.fSlotR as fUserSlotR,
            t6.fUnderOverR as fUserUnderOverR,
            t6.fPBR as fUserPBR,
            t6.fPBSingleR as fUserPBSingleR,
            t6.fPBDoubleR as fUserPBDoubleR,
            t6.fPBTripleR as fUserPBTripleR,
            t6.strID as strUserID

        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.strID='${strID}';
        `;

        const [result] = await db.sequelize.query(strQuery);
        if ( result.length > 0 )
        {
            objectOdds.strPAdminID = result[0].strPAdminID;
            objectOdds.strVAdminID = result[0].strVAdminID;
            objectOdds.strAgentID = result[0].strAgentID;
            objectOdds.strShopID = result[0].strShopID;
            objectOdds.strUserID = result[0].strUserID;

            objectOdds.fPAdminBaccaratR = result[0].fPAdminBaccaratR;
            objectOdds.fPAdminSlotR = result[0].fPAdminSlotR;
            objectOdds.fPAdminUnderOverR = result[0].fPAdminUnderOverR;
            objectOdds.fPAdminPBR = result[0].fPAdminPBR;
            objectOdds.fPAdminPBSingleR = result[0].fPAdminPBSingleR;
            objectOdds.fPAdminPBDoubleR = result[0].fPAdminPBDoubleR;
            objectOdds.fPAdminPBTripleR = result[0].fPAdminPBTripleR;

            objectOdds.fVAdminBaccaratR = result[0].fVAdminBaccaratR;
            objectOdds.fVAdminSlotR = result[0].fVAdminSlotR;
            objectOdds.fVAdminUnderOverR = result[0].fVAdminUnderOverR;
            objectOdds.fVAdminPBR = result[0].fVAdminPBR;
            objectOdds.fVAdminPBSingleR = result[0].fVAdminPBSingleR;
            objectOdds.fVAdminPBDoubleR = result[0].fVAdminPBDoubleR;
            objectOdds.fVAdminPBTripleR = result[0].fVAdminPBTripleR;

            objectOdds.fAgentBaccaratR = result[0].fAgentBaccaratR;
            objectOdds.fAgentSlotR = result[0].fAgentSlotR;
            objectOdds.fAgentUnderOverR = result[0].fAgentUnderOverR;
            objectOdds.fAgentPBR = result[0].fAgentPBR;
            objectOdds.fAgentPBSingleR = result[0].fAgentPBSingleR;
            objectOdds.fAgentPBDoubleR = result[0].fAgentPBDoubleR;
            objectOdds.fAgentPBTripleR = result[0].fAgentPBTripleR;

            objectOdds.fShopBaccaratR = result[0].fShopBaccaratR;
            objectOdds.fShopSlotR = result[0].fShopSlotR;
            objectOdds.fShopUnderOverR = result[0].fShopUnderOverR;
            objectOdds.fShopPBR = result[0].fShopPBR;
            objectOdds.fShopPBSingleR = result[0].fShopPBSingleR;
            objectOdds.fShopPBDoubleR = result[0].fShopPBDoubleR;
            objectOdds.fShopPBTripleR = result[0].fShopPBTripleR;

            objectOdds.fUserBaccaratR = result[0].fUserBaccaratR;
            objectOdds.fUserSlotR = result[0].fUserSlotR;
            objectOdds.fUserUnderOverR = result[0].fUserUnderOverR;
            objectOdds.fUserPBR = result[0].fUserPBR;
            objectOdds.fUserPBSingleR = result[0].fUserPBSingleR;
            objectOdds.fUserPBDoubleR = result[0].fUserPBDoubleR;
            objectOdds.fUserPBTripleR = result[0].fUserPBTripleR;
        }
    }

    console.log("GetOdds2222222");
    console.log(objectOdds);

    return objectOdds;
}

exports.ProcessCreate = async (strAddress, iGameCode, strVender, strRound, strTableID, iTarget, iChips, iPreviousCash, iAfterCash, iTransactionID, strID, strGroupID, iClass, strNickname, iComplete) => {

    console.log("ProcessCreate!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(strID);
    console.log(iClass);
    let odds = await GetOdds(strID, iClass);
    
    let fRollingUser    = 0,
        fRollingShop    = 0,
        fRollingAgent   = 0,
        fRollingVAdmin  = 0,
        fRollingPAdmin = 0;

    let iRollingUser = 0;
    let iRollingShop = 0;
    let iRollingAgent = 0;
    let iRollingVAdmin = 0;
    let iRollingPAdmin = 0;

    switch (iGameCode)
    {
    case 0: //  Baccarat
        fRollingUser    = odds.fUserBaccaratR;
        fRollingShop    = odds.fShopBaccaratR - odds.fUserBaccaratR;
        fRollingAgent   = odds.fAgentBaccaratR - odds.fShopBaccaratR;
        fRollingVAdmin  = odds.fVAdminBaccaratR - odds.fAgentBaccaratR;
        fRollingPAdmin = odds.fPAdminBaccaratR - odds.fVAdminBaccaratR;
        break;
    case 100:   //  UnderOver
        fRollingUser    = odds.fUserUnderOverR;
        fRollingShop    = odds.fShopUnderOverR - odds.fUserUnderOverR;
        fRollingAgent   = odds.fAgentUnderOverR - odds.fShopUnderOverR; 
        fRollingVAdmin  = odds.fVAdminUnderOverR - odds.fAgentUnderOverR;
        fRollingPAdmin = odds.fPAdminUnderOverR - odds.fVAdminUnderOverR;
        break;
    case 200:   //  Slot
        fRollingUser    = odds.fUserSlotR;
        fRollingShop    = odds.fShopSlotR - odds.fUserSlotR;
        fRollingAgent   = odds.fAgentSlotR - odds.fShopSlotR; 
        fRollingVAdmin  = odds.fVAdminSlotR - odds.fAgentSlotR;
        fRollingPAdmin = odds.fPAdminSlotR - odds.fVAdminSlotR;
        break;
    case 300:   //  Powerball
        if ( strTableID ==  0) // AType
        {
            let cPole = GetPBTargetType(iTarget);

            console.log(`########## Pole Type ${cPole}`);

            fRollingUser    = odds.fUserPBR;
            fRollingShop    = odds.fShopPBR - odds.fUserPBR;
            fRollingAgent   = odds.fAgentPBR - odds.fShopPBR; 
            fRollingVAdmin  = odds.fVAdminPBR - odds.fAgentPBR;
            fRollingPAdmin = odds.fPAdminPBR - odds.fVAdminPBR;
        }
        else if ( strTableID == 1 ) // BType
        {
            let cPole = GetPBTargetType(iTarget);

            console.log(`########## Pole Type ${cPole}`);

            if ( cPole == 0 )
            {
                fRollingUser    = odds.fUserPBSingleR;
                fRollingShop    = odds.fShopPBSingleR - odds.fUserPBSingleR;
                fRollingAgent   = odds.fAgentPBSingleR - odds.fShopPBSingleR; 
                fRollingVAdmin  = odds.fVAdminPBSingleR - odds.fAgentPBSingleR;
                fRollingPAdmin = odds.fPAdminPBSingleR - odds.fVAdminPBSingleR;
            }
            else if ( cPole == 1 )
            {
                fRollingUser    = odds.fUserPBDoubleR;
                fRollingShop    = odds.fShopPBDoubleR - odds.fUserPBDoubleR;
                fRollingAgent   = odds.fAgentPBDoubleR - odds.fShopPBDoubleR; 
                fRollingVAdmin  = odds.fVAdminPBDoubleR - odds.fAgentPBDoubleR;
                fRollingPAdmin = odds.fPAdminPBDoubleR - odds.fVAdminPBDoubleR;
            }
            else if ( cPole == 2 )
            {
                fRollingUser    = odds.fUserPBTripleR;
                fRollingShop    = odds.fShopPBTripleR - odds.fUserPBTripleR;
                fRollingAgent   = odds.fAgentPBTripleR - odds.fShopPBTripleR; 
                fRollingVAdmin  = odds.fVAdminPBTripleR - odds.fAgentPBTripleR;
                fRollingPAdmin = odds.fPAdminPBTripleR - odds.fVAdminPBTripleR;
            }
            // fSettleUser = odds.fUserSettlePBA;
            // fSettleShop = odds.fShopSettlePBA - odds.fUserSettlePBA;
            // fSettleAgent = odds.fAgentSettlePBA - odds.fShopSettlePBA;
            // fSettleVAdmin = odds.fVAdminSettlePBA - odds.fAgentSettlePBA;
            // fSettlePAdmin = odds.fPAdminSettlePBA - odds.fVAdminSettlePBA;
        }
        break;
    }

    iRollingUser = parseFloat(iChips) * fRollingUser * 0.01;
    iRollingShop = parseFloat(iChips) * fRollingShop * 0.01;
    iRollingAgent = parseFloat(iChips) * fRollingAgent * 0.01;
    iRollingVAdmin = parseFloat(iChips) * fRollingVAdmin * 0.01;
    iRollingPAdmin = parseFloat(iChips) * fRollingPAdmin * 0.01;

    const cTotalOdds = fRollingVAdmin + fRollingAgent + fRollingShop + fRollingUser;

    let iRolling = parseFloat(iChips) * cTotalOdds * 0.01;

    console.log(`################################################## Bet Rolling ${fRollingUser}, ${fRollingShop}, ${fRollingAgent}, ${fRollingVAdmin}, ${fRollingPAdmin}, ${strID}, ${iClass}`);

    await db.BettingRecords.create(
    {
        iTransactionID:iTransactionID,
        strVender:strVender,
        strRound:strRound,
        strTableID:strTableID,
        iGameCode:iGameCode, 
        iBetting:iChips,
        strID:strID,
        strNickname:strNickname,
        iPreviousCash:iPreviousCash,
        iAfterCash:iAfterCash,
        iWin:0, 
        iRolling:iRolling, 
        iRollingUser:iRollingUser,
        iRollingShop:iRollingShop,
        iRollingAgent:iRollingAgent,
        iRollingVAdmin:iRollingVAdmin,
        iRollingPAdmin:iRollingPAdmin,
        iTarget:iTarget, 
        strGroupID:strGroupID, 
        iComplete:iComplete,
        fRollingUser:fRollingUser,
        fRollingShop:fRollingShop,
        fRollingAgent:fRollingAgent,
        fRollingVAdmin:fRollingVAdmin,
        fRollingPAdmin:fRollingPAdmin,
        iClass:iClass,
    } );

    //
    if ( iRollingUser > 0 && odds.strUserID != '' )
    {
        console.log(`##### Rolling USER (${odds.strUserID}) : ${iRollingUser}`);
        await db.Users.increment({iRolling:iRollingUser}, {where:{strID:odds.strUserID}});
    }
    if ( iRollingShop > 0 && odds.strShopID != '' )
    {
        console.log(`##### Rolling USER (${odds.strShopID}) : ${iRollingShop}`);
        await db.Users.increment({iRolling:iRollingShop}, {where:{strID:odds.strShopID}});
    }
    if ( iRollingAgent > 0 && odds.strAgentID != '' )
    {
        console.log(`##### Rolling USER (${odds.strAgentID}) : ${iRollingAgent}`);
        await db.Users.increment({iRolling:iRollingAgent}, {where:{strID:odds.strAgentID}});
    }
    if ( iRollingVAdmin > 0 && odds.strVAdminID != '' )
    {
        console.log(`##### Rolling USER (${odds.strVAdminID}) : ${iRollingVAdmin}`);
        await db.Users.increment({iRolling:iRollingVAdmin}, {where:{strID:odds.strVAdminID}});
    }
    if ( iRollingPAdmin > 0 && odds.strPAdminID != '' )
    {
        console.log(`##### Rolling USER (${odds.strPAdminID}) : ${iRollingPAdmin}`);
        await db.Users.increment({iRolling:iRollingPAdmin}, {where:{strID:odds.strPAdminID}});
    }
    console.log('6업데이트##################################################');
    await db.Users.decrement({iCash:parseFloat(iChips)}, {where:{strID:strID}});
}

exports.ProcessCreatePBWin = async (strAddress, iGameCode, strVender, strRound, strTableID, iTarget, iWin, iPreviousCash, iAfterCash, iTransactionID, strID, strGroupID, iClass, strNickname) => {

    let betting = await db.BettingRecords.findOne({where:{iGameCode:iGameCode, strRound:strRound, strID:strID, iTarget:iTarget}});

    if ( betting != null )
    {
        await db.BettingRecords.update({iWin:iWin}, {where:{iGameCode:iGameCode, strRound:strRound, strID:strID, iTarget:iTarget}});
    }
    else
    {
        await db.BettingRecords.create(
            {
                iTransactionID:iTransactionID,
                strVender:strVender,
                strRound:strRound,
                strTableID:strTableID,
                iGameCode:iGameCode, 
                iBetting:0,
                strID:strID,
                strNickname:strNickname,
                iPreviousCash:iPreviousCash,
                iAfterCash:iAfterCash,
                iWin:iWin, 
                iRolling:0, 
                iRollingUser:0,
                iRollingShop:0,
                iRollingAgent:0,
                iRollingVAdmin:0,
                iRollingPAdmin:0,
                iTarget:iTarget, 
                strGroupID:strGroupID, 
                iComplete:1,
                fRollingUser:0,
                fRollingShop:0,
                fRollingAgent:0,
                fRollingVAdmin:0,
                fRollingPAdmin:0,
                iClass:iClass,
            } 
        );
    }
    console.log('1업데이트##################################################');
    console.log(`${iWin}`);
    await db.Users.increment({iCash:parseFloat(iWin)}, {where:{strID:strID}});
}

exports.ProcessWinFromTransactionID = async (strAddress, iGameCode, strVender, strRound, strTableID, iTarget, iWin, iPreviousCash, iAfterCash, iTransactionID, strID, strGroupID, iClass, strNickname) => {

    //let betting = await db.BettingRecords.findAll({where:{strID:strID, iTransactionID:iTransactionID}});

        await db.BettingRecords.create(
            {
                iTransactionID:iTransactionID,
                strVender:strVender,
                strRound:strRound,
                strTableID:strTableID,
                iGameCode:iGameCode, 
                iBetting:0,
                strID:strID,
                strNickname:strNickname,
                iPreviousCash:iPreviousCash,
                iAfterCash:iAfterCash,
                iWin:iWin, 
                iRolling:0, 
                iRollingUser:0,
                iRollingShop:0,
                iRollingAgent:0,
                iRollingVAdmin:0,
                iRollingPAdmin:0,
                iTarget:iTarget, 
                strGroupID:strGroupID, 
                iComplete:1,
                fRollingUser:0,
                fRollingShop:0,
                fRollingAgent:0,
                fRollingVAdmin:0,
                fRollingPAdmin:0,
                iClass:iClass,
            } 
        );
    console.log('2업데이트##################################################');
    console.log(`${iWin}`);
    await db.Users.increment({iCash:parseFloat(iWin)}, {where:{strID:strID}});
}

// let ProcessUpdateWin = async (strAddress, iTransactionID, iWin, iGameCode, iTarget, strID) => {

//     console.log(`ProcessWin : ${iTarget}`);

//     console.log(`ProcessWin : iTransactionID(${iTransactionID}), iWin(${iWin}), iGameCode(${iGameCode}), iTarget(${iTarget}), strID(${strID})`);

//     var aBetting = await db.BettingRecords.findOne({where:{iTransactionID:iTransactionID, iTarget:iTarget, iGameCode:iGameCode, strID:strID}});
//     console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ProcessWin : ${iWin}, ${aBetting.strID}`);

//     if ( aBetting ) {
//         await db.BettingRecords.update({iWin:iWin}, {where:{iTransactionID:iTransactionID, iTarget:iTarget, iGameCode:iGameCode, strID:strID}});
//         return true;
//     }
//     return false;        
// }

// exports.ProcessWin = async (strAddress, iGameCode, strVender, strRound, strTableID, iTarget, iWin, iPreviousCash, iAfterCash, iTransactionID, strNickname, strGroupID, iClass) => {

//     const bUpdate = await ProcessUpdateWin(strAddress, iTransactionID, iWin, iGameCode, iTarget, strNickname);
//     if ( bUpdate == false )
//     {
//         await this.ProcessCreateWin(strAddress, iGameCode, strVender, strRound, strTableID, iTarget, iWin, iPreviousCash, iAfterCash, iTransactionID, strNickname, strGroupID, iClass);
//     }
// }


exports.ProcessCancel = async (strAddress, iTransactionID, iGameCode, strID) => {

    let listBets = await db.BettingRecords.findAll({where:{iTransactionID:iTransactionID}});
    for ( let i in listBets )
    {
        if ( listBets[i].iWin > 0 )
        {
            //user.iCash -= parseInt(listBets[i].iWin);
            console.log('5업데이트##################################################');
            await db.Users.decrement({iCash:parseFloat(listBets[i].iWin)}, {where:{strID:listBets[i].strID}});
        }
        else
        {
            //user.iCash += parseInt(listBets[i].iBetting);
            console.log('3업데이트##################################################');
            console.log(`${listBets[i].iBetting}`);
            await db.Users.increment({iCash:parseFloat(listBets[i].iBetting)}, {where:{strID:listBets[i].strID}});
            await RollbackRolling(listBets[i], listBets[i].strID, listBets[i].iClass);
        }
    }
    await db.BettingRecords.update({iComplete:2}, {where:{iTransactionID:iTransactionID}});
}

let RollbackRolling = async (bet, strID, iClass) => {
    let odds = await GetOdds(strID, iClass);

    let iRollingUser = bet.iRollingUser ?? 0;
    let iRollingShop = bet.iRollingShop ?? 0;
    let iRollingAgent = bet.iRollingAgent ?? 0;
    let iRollingVAdmin = bet.iRollingVAdmin ?? 0;
    let iRollingPAdmin = bet.iRollingPAdmin ?? 0;

    if ( iRollingUser > 0 && odds.strUserID != '' )
    {
        console.log(`##### Rolling Rollback USER (${odds.strUserID}) : ${iRollingUser}`);
        await db.Users.decrement({iRolling:iRollingUser}, {where:{strID:odds.strUserID}});
    }
    if ( iRollingShop > 0 && odds.strShopID != '' )
    {
        console.log(`##### Rolling Rollback USER (${odds.strShopID}) : ${iRollingShop}`);
        await db.Users.decrement({iRolling:iRollingShop}, {where:{strID:odds.strShopID}});
    }
    if ( iRollingAgent > 0 && odds.strAgentID != '' )
    {
        console.log(`##### Rolling Rollback USER (${odds.strAgentID}) : ${iRollingAgent}`);
        await db.Users.decrement({iRolling:iRollingAgent}, {where:{strID:odds.strAgentID}});
    }
    if ( iRollingVAdmin > 0 && odds.strVAdminID != '' )
    {
        console.log(`##### Rolling Rollback USER (${odds.strVAdminID}) : ${iRollingVAdmin}`);
        await db.Users.decrement({iRolling:iRollingVAdmin}, {where:{strID:odds.strVAdminID}});
    }
    if ( iRollingPAdmin > 0 && odds.strPAdminID != '' )
    {
        console.log(`##### Rolling Rollback USER (${odds.strPAdminID}) : ${iRollingPAdmin}`);
        await db.Users.decrement({iRolling:iRollingPAdmin}, {where:{strID:odds.strPAdminID}});
    }
}

var GetParentIDList = async (strGroupID, iClass) => {

    console.log(`GetParentList : ${strGroupID}, ${iClass}`);

    let objectData = {strPAdmin:'', strVAdmin:'', strAgent:'', strShop:''};

    if ( iClass == 8 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT 
            t1.strID AS lev1,
            t2.strID AS lev2,
            t3.strID AS lev3,
            t4.strID AS lev4
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
            WHERE t5.iClass='8' AND t5.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strPAdmin:result[0].lev1, strVAdmin:result[0].lev2, strAgent:result[0].lev3, strShop:result[0].lev4};
            
        //return result[0].lev1;
    }
    else if ( iClass == 7 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT 
            t1.strID AS lev1,
            t2.strID AS lev2,
            t3.strID AS lev3
            t4.strID AS 
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
            WHERE t4.iClass='7' AND t4.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strPAdmin:result[0].lev1, strVAdmin:result[0].lev2, strAgent:result[0].lev3, strShop:''};
    }
    else if ( iClass == 6 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT 
            t1.strID AS lev1,
            t2.strID AS lev2
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
            WHERE t3.iClass='6' AND t3.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strPAdmin:result[0].lev1, strVAdmin:result[0].lev2, strAgent:'', strShop:''};
    }
    else if ( iClass == 5 )
    {
        const [result] = await db.sequelize.query(
            `
            SELECT t1.strID AS lev1
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.iClass='5' AND t2.strGroupID LIKE CONCAT('${strGroupID}', '%');
            `
            );

        if ( result.length > 0 )
            objectData = {strPAdmin:result[0].lev1, strVAdmin:'', strAgent:'', strShop:''};
    }
    return objectData;
}

// let UpdateRolling = async (strNickname, iClass, objectRolling) => {

//     console.log(`=========================================================================================================================================================`);
//     console.log(`UpdateRolling strNickname : ${strNickname}, iClass : ${iClass}, VA : ${objectRolling.iVAdmin}`);
//     console.log(`=========================================================================================================================================================`);

//     let objectAcc = {};

//     if ( iClass == 5 )
//     {
//         let aViceAdmin = await db.Users.findOne({where:{strNickname:strNickname}});
//         if ( aViceAdmin != null )
//         {
//             const cViceAdminRolling = objectRolling.iVAdmin;
//             await aViceAdmin.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling});

//             console.log(`########################################################################################################################################################################################################`);
//             console.log(`#################################################################################################### UpdateRolling VA (VAStep) : ${cViceAdminRolling} Current : ${aViceAdmin.iRolling}`);

//             let aProAdmin = await db.Users.findOne({where:{id:aViceAdmin.iParentID}});
//             if ( aProAdmin != null )
//             {
//                 const cProAdminRolling = objectRolling.iPAdmin;
//                 await aProAdmin.update({iRolling:aProAdmin.iRolling+cProAdminRolling});
//             }
//         }
//     }
//     else if ( iClass == 6 )
//     {
//         let aAgent = await db.Users.findOne({where:{strNickname:strNickname}});
//         if ( aAgent != null )
//         {
//             const cAgentRolling = objectRolling.iAgent;
//             await aAgent.update({iRolling:aAgent.iRolling+cAgentRolling});

//             let aViceAdmin = await db.Users.findOne({where:{id:aAgent.iParentID}});
//             if ( aViceAdmin != null )
//             {
//                 const cViceAdminRolling = objectRolling.iVAdmin;
//                 await aViceAdmin.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling});

//                 let aProAdmin = await db.Users.findOne({where:{id:aViceAdmin.iParentID}});
//                 if ( aProAdmin != null )
//                 {
//                     const cProAdminRolling = objectRolling.iPAdmin;
//                     await aProAdmin.update({iRolling:aProAdmin.iRolling+cProAdminRolling});
//                 }
//             }
//         }
//     }
//     else if ( iClass == 7 )
//     {
//         let aShop = await db.Users.findOne({where:{strNickname:strNickname}});
//         if ( aShop != null )
//         {
//             const cShopRolling = objectRolling.iShop;
//             await aShop.update({iRolling:aShop.iRolling+cShopRolling});

//             let aAgent = await db.Users.findOne({where:{id:aShop.iParentID}});
//             if ( aAgent != null )
//             {
//                 const cAgentRolling = objectRolling.iAgent;
//                 await aAgent.update({iRolling:aAgent.iRolling+cAgentRolling});

//                 let aViceAdmin = await db.Users.findOne({where:{id:aAgent.iParentID}});
//                 if ( aViceAdmin != null )
//                 {
//                     const cViceAdminRolling = objectRolling.iVAdmin;
//                     await aViceAdmin.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling});

//                     let aProAdmin = await db.Users.findOne({where:{id:aViceAdmin.iParentID}});
//                     if ( aProAdmin != null )
//                     {
//                         const cProAdminRolling = objectRolling.iPAdmin;
//                         await aProAdmin.update({iRolling:aProAdmin.iRolling+cProAdminRolling});
//                     }
//                 }
//             }
//         }
//     }
//     else if ( iClass == 8 )
//     {
//         let aUser = await db.Users.findOne({where:{strNickname:strNickname}});
//         if ( aUser != null )
//         {
//             const cRolling = objectRolling.iUser;
//             await aUser.update({iRolling:aUser.iRolling+cRolling});
    
//             let aShop = await db.Users.findOne({where:{id:aUser.iParentID}});
//             if ( aShop != null )
//             {
//                 const cShopRolling = objectRolling.iShop;
//                 await aShop.update({iRolling:aShop.iRolling+cShopRolling});
    
//                 let aAgent = await db.Users.findOne({where:{id:aShop.iParentID}});
//                 if ( aAgent != null )
//                 {
//                     const cAgentRolling = objectRolling.iAgent;
//                     await aAgent.update({iRolling:aAgent.iRolling+cAgentRolling});
    
//                     let aViceAdmin = await db.Users.findOne({where:{id:aAgent.iParentID}});
//                     if ( aViceAdmin != null )
//                     {
//                         const cViceAdminRolling = objectRolling.iVAdmin;
//                         await aViceAdmin.update({iRolling:aViceAdmin.iRolling+cViceAdminRolling});

//                         console.log(`########################################################################################################################################################################################################`);
//                         console.log(`#################################################################################################### UpdateRolling VA (UStep) : ${cViceAdminRolling} Current : ${aViceAdmin.iRolling}`);
            
    
//                         let aProAdmin = await db.Users.findOne({where:{id:aViceAdmin.iParentID}});
//                         if ( aProAdmin != null )
//                         {
//                             const cProAdminRolling = objectRolling.iPAdmin;
//                             await aProAdmin.update({iRolling:aProAdmin.iRolling+cProAdminRolling});
    
//                             // let aAdmin = await db.Users.findOne({where:{id:aProAdmin.iParentID}});
//                             // if ( aAdmin != null )
//                             // {
//                             //     const cAdminRolling = 0;
//                             //     const cAdminSettle = 0;
//                             //     await aAdmin.update({iRolling:0});
//                             // }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

let UpdateRolling = async (listHierarchy) => {

    for ( let i in listHierarchy )
    {
        if ( parseInt(listHierarchy[i].iAmount) == 0 )
            continue;

        //await db.Users.update({iRolling:db.sequelize.literal('iRolling + list')})
        await db.Users.increment({iRolling:parseInt(listHierarchy[i].iAmount)}, {where:{strID:listHierarchy[i].strID}});

        // let user = await db.Users.findOne({where:{strNickname:listHierarchy[i].strNickname}});
        // if ( user != null )
        // {
        //     const cRolling = parseInt(user.iRolling) + parseInt(listHierarchy[i].iAmount);
        //     await user.update({iRolling:cRolling});

        //     console.log(`Update Rolling to ${listHierarchy[i].strNickname} iAmount ${listHierarchy[i].iAmount}`);
        // }
    }
}

let FindHierarchy = (listHierarchy, strID) => {

    for ( let i in listHierarchy )
    {
        if ( listHierarchy[i].strID == strID )        
        {
            return listHierarchy[i];
        }
    }
    return null;
}

let AddAmount = (listHierarchy, strID, iAmount) => {

    let object = FindHierarchy(listHierarchy, strID);
    if ( object == null )
    {
        listHierarchy.push({strID:strID, iAmount:iAmount});
    }
    else
    {
        object.iAmount = parseInt(object.iAmount)+parseInt(iAmount);
    }
}

let CalculateHierarchy = async (listHierarchy, objectRolling, iClass, strGroupID, strID) => {

    let objectParents = await GetParentIDList(strGroupID, iClass);

    if ( objectParents.strPAdmin != '' )
    {
        AddAmount(listHierarchy, objectParents.strPAdmin, objectRolling.iPAdmin);
    }
    if ( objectParents.strVAdmin != '' )
    {
        AddAmount(listHierarchy, objectParents.strVAdmin, objectRolling.iVAdmin);
    }
    if ( objectParents.strAgent != '' )
    {
        AddAmount(listHierarchy, objectParents.strAgent, objectRolling.iAgent);
    }
    if ( objectParents.strShop != '' )
    {
        AddAmount(listHierarchy, objectParents.strShop, objectRolling.iShop);
    }


    if ( iClass == 8 )
    {
        AddAmount(listHierarchy, strID, objectRolling.iUser);
    }
    else if ( iClass == 7 )
    {
        AddAmount(listHierarchy, strID, objectRolling.iShop);
    }
    else if ( iClass == 6 )
    {
        AddAmount(listHierarchy, strID, objectRolling.iAgent);
    }
    else if ( iClass == 5 )
    {
        AddAmount(listHierarchy, strID, objectRolling.iVAdmin);
    }
}

let objectHierarchy = {};

exports.ProcessEnd = async (iTransactionID) => {

    var aBetting = await db.BettingRecords.findAll({where:{iTransactionID:iTransactionID}});

    for ( let i in aBetting )
    {
        await db.BettingRecords.update(
            {
                iComplete:1
            },
            {where:{id:aBetting[i].id}}
        );
    
    }

    return;

    var aBetting = await db.BettingRecords.findAll({where:{iTransactionID:iTransactionID}});

    const key = `${iGameCode}_${iTransactionID}_${strGroupID}`;
    let listHierarchy = [];
    objectHierarchy[key]   = listHierarchy;

    for ( let i in aBetting )
    {
        //  iBetting 의 값이 0인 경우는 Tie 가 나와 베팅 값을 0으로 만들어준 경우 이므로 롤링을 계산하면 안된다.
        if ( aBetting[i].iBetting == 0 )
            continue;

        const cTotalOdds = aBetting[i].fRollingVAdmin + aBetting[i].fRollingAgent + aBetting[i].fRollingShop + aBetting[i].fRollingUser;

        const objectRolling = {

            iUser:aBetting[i].iBetting * aBetting[i].fRollingUser * 0.01,
            iShop:aBetting[i].iBetting * aBetting[i].fRollingShop * 0.01,
            iAgent:aBetting[i].iBetting * aBetting[i].fRollingAgent * 0.01,
            iVAdmin:aBetting[i].iBetting * aBetting[i].fRollingVAdmin * 0.01,
            iPAdmin:aBetting[i].iBetting * aBetting[i].fRollingPAdmin * 0.01,
        };

        // await aBetting[i].update(
        //     {
        //         iRolling:aBetting[i].iBetting * cTotalOdds * 0.01,
        //         iRollingUser:objectRolling.iUser,
        //         iRollingShop:objectRolling.iShop,
        //         iRollingAgent:objectRolling.iAgent,
        //         iRollingVAdmin:objectRolling.iVAdmin,
        //         iRollingPAdmin:objectRolling.iPAdmin,
        //         iComplete:1
        //     }
        // );
        await db.BettingRecords.update(
            {
                iRolling:aBetting[i].iBetting * cTotalOdds * 0.01,
                iRollingUser:objectRolling.iUser,
                iRollingShop:objectRolling.iShop,
                iRollingAgent:objectRolling.iAgent,
                iRollingVAdmin:objectRolling.iVAdmin,
                iRollingPAdmin:objectRolling.iPAdmin,
                iComplete:1
            },
            {where:{id:aBetting[i].id}}
        );


        await CalculateHierarchy(objectHierarchy[key], objectRolling, iClass, strGroupID, strID);
        //await UpdateRolling(strNickname, parseInt(iClass), objectRolling);
    }
    
    await UpdateRolling(objectHierarchy[key]);

    console.log(`===================================================================================================================`);
    console.log(objectHierarchy[key]);

    delete objectHierarchy[key];
}

// let objectHierarchy = {};

// exports.ProcessEnd = async (strAddress, iTransactionID, iGameCode, strID, iClass, strGroupID) => {

//     return;

//     var aBetting = await db.BettingRecords.findAll({where:{iTransactionID:iTransactionID}});

//     const key = `${iGameCode}_${iTransactionID}_${strGroupID}`;
//     let listHierarchy = [];
//     objectHierarchy[key]   = listHierarchy;

//     for ( let i in aBetting )
//     {
//         //  iBetting 의 값이 0인 경우는 Tie 가 나와 베팅 값을 0으로 만들어준 경우 이므로 롤링을 계산하면 안된다.
//         if ( aBetting[i].iBetting == 0 )
//             continue;

//         const cTotalOdds = aBetting[i].fRollingVAdmin + aBetting[i].fRollingAgent + aBetting[i].fRollingShop + aBetting[i].fRollingUser;

//         const objectRolling = {

//             iUser:aBetting[i].iBetting * aBetting[i].fRollingUser * 0.01,
//             iShop:aBetting[i].iBetting * aBetting[i].fRollingShop * 0.01,
//             iAgent:aBetting[i].iBetting * aBetting[i].fRollingAgent * 0.01,
//             iVAdmin:aBetting[i].iBetting * aBetting[i].fRollingVAdmin * 0.01,
//             iPAdmin:aBetting[i].iBetting * aBetting[i].fRollingPAdmin * 0.01,
//         };

//         // await aBetting[i].update(
//         //     {
//         //         iRolling:aBetting[i].iBetting * cTotalOdds * 0.01,
//         //         iRollingUser:objectRolling.iUser,
//         //         iRollingShop:objectRolling.iShop,
//         //         iRollingAgent:objectRolling.iAgent,
//         //         iRollingVAdmin:objectRolling.iVAdmin,
//         //         iRollingPAdmin:objectRolling.iPAdmin,
//         //         iComplete:1
//         //     }
//         // );
//         await db.BettingRecords.update(
//             {
//                 iRolling:aBetting[i].iBetting * cTotalOdds * 0.01,
//                 iRollingUser:objectRolling.iUser,
//                 iRollingShop:objectRolling.iShop,
//                 iRollingAgent:objectRolling.iAgent,
//                 iRollingVAdmin:objectRolling.iVAdmin,
//                 iRollingPAdmin:objectRolling.iPAdmin,
//                 iComplete:1
//             },
//             {where:{id:aBetting[i].id}}
//         );


//         await CalculateHierarchy(objectHierarchy[key], objectRolling, iClass, strGroupID, strID);
//         //await UpdateRolling(strNickname, parseInt(iClass), objectRolling);
//     }
    
//     await UpdateRolling(objectHierarchy[key]);

//     console.log(`===================================================================================================================`);
//     console.log(objectHierarchy[key]);

//     delete objectHierarchy[key];
// }



exports.ProcessCreateWin = async (buildBet) => {
    // 관련 ID 체크(정렬용)
    let obj = await GetRBetBuilder(buildBet);

    await db.BettingRecords.create(
        {
            iTransactionID:buildBet.strUniqueID,
            strVender:buildBet.strVender,
            strRound:buildBet.strRound,
            strTableID:buildBet.strTableID,
            iGameCode: buildBet.iGameCode,
            iBetting:0,
            iWin:buildBet.iAmount,
            strID:buildBet.strID,
            strNickname:buildBet.strNickname,
            iPreviousCash:parseInt(buildBet.iCash),
            iAfterCash:parseInt(buildBet.iCash) + parseInt(buildBet.iAmount),
            iTarget:buildBet.iGameCode,
            strGroupID:buildBet.strGroupID,
            iComplete:buildBet.iComplete,
            iClass:buildBet.iClass,
            strDetails: '',
            createdAt:obj.createdAt, // 베팅시간으로 처리
            updatedAt:buildBet.createdAt, // 빌드벳의 처리시간
            strBets:'',
            eState:'STANDBY',
            eType:'WIN',
            bId:buildBet.id,
            bRId:obj.id,
        } );
}

exports.ProcessCreateBet = async (buildBet) => {
    await db.BettingRecords.create(
        {
            iTransactionID:buildBet.strUniqueID,
            strVender:buildBet.strVender,
            strRound:buildBet.strRound,
            strTableID:buildBet.strTableID,
            iGameCode:buildBet.iGameCode,
            iBetting:buildBet.iAmount,
            strGameID:buildBet.strGameID,
            iWin:0,
            strID:buildBet.strID,
            strNickname:buildBet.strNickname,
            iPreviousCash:parseInt(buildBet.iCash),
            iAfterCash:parseInt(buildBet.iCash) - parseInt(buildBet.iAmount),
            iTarget:buildBet.iGameCode,
            strGroupID:buildBet.strGroupID,
            iComplete:buildBet.iComplete,
            iClass:buildBet.iClass,
            strDetails: buildBet.strDetails,
            createdAt:buildBet.createdAt,
            updatedAt:Date.now(),
            strBets:'',
            eState:'STANDBY',
            eType:'BET',
            bId:buildBet.id,
            bRId:buildBet.id,
        });
}

let GetRBetBuilder = async (buildBet) => {
    let obj = await db.BuildBets.findAll({
        where: {
            strID: buildBet.strID,
            strVender: buildBet.strVender,
            iGameCode: buildBet.iGameCode,
            strGameID: buildBet.strGameID,
            strRound: buildBet.strRound
        },
        limit:1,
        order: [['id', 'DESC']]
    });
    return obj[0];
}