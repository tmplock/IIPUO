const db = require('../models');

let IsSameGroup = (strGroupID1, strGroupID2) => {

    if ( strGroupID1 != undefined && strGroupID2 != undefined )
    {
        let strBaseGroupID = '';
        let strTargetGroupID = '';

        if ( strGroupID1.length > strGroupID2.length )
        {
            strBaseGroupID = strGroupID2;
            strTargetGroupID = strGroupID1;
        }
        else
        {
            strBaseGroupID = strGroupID1;
            strTargetGroupID = strGroupID2;
        }

        strTargetGroupID = strTargetGroupID.substring(0, strBaseGroupID.length);

        console.log(`IsSameGroup ${strBaseGroupID}, ${strTargetGroupID}`);

        if ( strTargetGroupID == strBaseGroupID )
            return true;
        
        // for ( let i in strBaseGroupID )
        // {
        //     if ( strBaseGroupID[i] != strTargetGroupID[i])
        //     {
        //         return false;
        //     }
        //     return true;
        // }
    }
    return false;
}

let inline_AlertUpdateByGroupID = (strGroupID, iocount) => {
    for ( let i in global.socket_list )
    {
        if ( true == IsSameGroup(strGroupID, global.socket_list[i].strGroupID) ) {
            if (global.socket_list[i].iClass == 2 || global.socket_list[i].iClass == 3) {
                global.socket_list[i].emit('alert_update', iocount);
            }
        }
    }
}
exports.AlertUpdateByGroupID = inline_AlertUpdateByGroupID;

let inline_AlertUpdateByNickname = (strNickname, iocount) => {
    for ( let i in global.socket_list )
    {
        if ( strNickname == global.socket_list[i].strNickname ) {
            global.socket_list[i].emit('alert_update', iocount);
        }
    }
}
exports.AlertUpdateByNickname = inline_AlertUpdateByNickname;
let inline_AlertByGroupID = (strGroupID, eAlertType) => {

    for ( let i in global.socket_list )
    {
        if ( true == IsSameGroup(strGroupID, global.socket_list[i].strGroupID) )
        {
            global.socket_list[i].emit(eAlertType);
        }
    }
}
exports.AlertByGroupID = inline_AlertByGroupID;

let inline_AlertByGroupIDExclusionOwner = (strGroupID, eAlertType, strNickname) => {

    for ( let i in global.socket_list )
    {
        if ( true == IsSameGroup(strGroupID, global.socket_list[i].strGroupID) && strNickname != global.socket_list[i].strNickname )
        {
            global.socket_list[i].emit(eAlertType);
        }
    }
}
exports.AlertByGroupIDExclusionOwner = inline_AlertByGroupIDExclusionOwner;
let inline_AlertByNickname = async (strNickname, eAlertType) => {
    let bSending = false;
    for (let i in global.socket_list) {
        let socket = global.socket_list[i];
        if (socket.strNickname == strNickname) {
            bSending = true;
            if (socket.iClass == 3 && socket.iPermission != 100) {
                inline_AlertByViewGroupID(socket.strNickname, socket.strGroupID, socket.iClass, eAlertType);
            }
            console.log(`SOCKET : ${strNickname}`);
            global.socket_list[i].emit(eAlertType);
        }
    }

    if (bSending == false) {
        if (eAlertType == 'alert_letter' || eAlertType == 'alert_letter_reply' || eAlertType == 'alert_contact_reply') {
            let user = await db.Users.findOne({where:{strNickname: strNickname}});
            if (user != null && user.iClass == 3) {
                inline_AlertByViewGroupID(user.strNickname, user.strGroupID, user.iClass, eAlertType);
            }
        }
    }
}
exports.AlertByNickname = inline_AlertByNickname;

let inline_AlertByViewGroupID = (strNickname, strGroupID, iClass, eAlertType) => {
    for ( let i in global.socket_list )
    {
        let socket = global.socket_list[i];
        if ( socket.iPermission == 100 && socket.strNickname != strNickname && socket.strGroupID == strGroupID && socket.iClass == iClass )
        {
            console.log(`SOCKET : ${global.socket_list[i].strNickname}`);
            global.socket_list[i].emit(eAlertType);
        }
    }
}

let inline_AlertCashByNickname = (strNickname, iAmount) => {

    console.log(`##### inline_AlertCashByNickname : `);

    for ( let i in global.socket_list )
    {
        console.log(`##### AlertCashByNickname : ${strNickname}, Amount : ${iAmount}, socket_name : ${global.socket_list[i].strNickname}`);

        if ( global.socket_list[i].strNickname == strNickname )
        {
            global.socket_list[i].emit('alert_cash', iAmount);
        }
    }
}
exports.AlertCashByNickname = inline_AlertCashByNickname;

let inline_RealtimeBetting = (iRoomNo, iChips, iTarget, strUserGroupID) => {

    for ( let i in global.socket_list )
    {
        const strSocketGroupID = global.socket_list[i].strGroupID;

        console.log(`RealtimeBetting ${strSocketGroupID}, ${strUserGroupID}`);
        if ( true == IsSameGroup(strSocketGroupID, strUserGroupID) )
        {
            console.log(`RealtimeBet Sending Packet`);

            let objectBetting = {roomno:iRoomNo, chips:iChips, target:iTarget};
            console.log(objectBetting.roomno);
            console.log(objectBetting.chips);
            global.socket_list[i].emit("realtime_bet", objectBetting);
        }
    }    
}
exports.RealtimeBetting = inline_RealtimeBetting;

let inline_RealtimeBettingWin = (iRoomNo, iResult, iTarget, strUserGroupID) => {

    for ( let i in global.socket_list )
    {
        const strSocketGroupID = global.socket_list[i].strGroupID;

        console.log(`RealtimeBetting ${strSocketGroupID}, ${strUserGroupID}`);
        if ( true == IsSameGroup(strSocketGroupID, strUserGroupID) )
        {
            console.log(`RealtimeBet Sending Packet`);


            let objectWin = {roomno:iRoomNo, result:iResult, target:iTarget};
            console.log(objectWin.roomno)
            console.log(objectWin.result)
            console.log(objectWin.result)

            global.socket_list[i].emit("realtime_betwin", objectWin);
        }
    }
}
exports.RealtimeBettingWin = inline_RealtimeBettingWin;

let inline_RealtimeBettingEnd = (iRoomNo) => {

    let objectEnd = {roomno:iRoomNo};

    global.io.emit("realtime_betend", objectEnd);

}
exports.RealtimeBettingEnd = inline_RealtimeBettingEnd;

let inline_RealtimeBettingRound = (iRoomNo, iRound) => {

    var objectRound = {roomno:iRoomNo, round:iRound};
    
    global.io.emit("realtime_gameround", objectRound);
}
exports.RealtimeBettingRound = inline_RealtimeBettingRound;

let inline_GetNicknameClass = (strGroupID, iClass) => {
    for ( let i in global.socket_list )
    {
        console.log(`strGroupID : ${strGroupID}, socket.strGroupID : ${global.socket_list[i].strGroupID}`);

        if ( true == IsSameGroup(strGroupID, global.socket_list[i].strGroupID) && global.socket_list[i].iClass == iClass) {
            return global.socket_list[i].strNickname;
        }
    }
    return '';
}
exports.GetNicknameClass = inline_GetNicknameClass;