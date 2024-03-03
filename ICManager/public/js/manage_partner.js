// var socket = io();

// socket.on("connect", ()=> {

// 	//console.log("connect");
// 	socket.emit('group', user.strGroupID);
// });

// socket.on("num_rooms", (iNumRooms) => {

// 	console.log(num_rooms);

// });

// socket.on("realtime_bet", (betting) => {

// 	const chips = parseInt(betting.chips);
// 	const target = parseInt(betting.target);


// 	//betting_object[betting.roomno][betting.target]	+= parseInt(betting.chips);
// 	objectRealtime[betting.roomno].kBettingInfo[target].iBetting += chips;

// 	objectOverview.kBettingInfo[target].iBetting += parseInt(chips);

// 	//bet_totals[betting.target] += parseInt(betting.chips);
// 	UpdateRoom();
// 	//SetOverview(objectOverview);
// 	SetOverview(objectOverview, "#div_realtimebet_overview", true);
// 	//console.log(betting);
// });

// socket.on("realtime_betwin", (betting) => {

// 	console.log(betting);

// 	const target = parseInt(betting.target);
// 	const win = parseInt(betting.result);

// 	//betting_object[betting.roomno][parseInt(betting.target)+11]	+= parseInt(betting.result);
// 	objectRealtime[betting.roomno].kBettingInfo[target].iWin += win;

// 	objectOverview.kBettingInfo[target].iWin += win;

// 	//win_totals[betting.target] += parseInt(betting.result);

// 	//console.log(betting_object[betting.roomno]);
// 	UpdateRoom();
// 	//SetOverview(objectOverview);
// 	SetOverview(objectOverview, "#div_realtimebet_overview", true);
// 	//console.log(betting);
// });

// socket.on("realtime_betend", (betting) => {

// 	console.log("betting end");
// 	console.log(betting);

// 	InitRoom(betting.roomno);

// 	// betting_object[0][parseInt(betting.target)+11]	+= parseInt(betting.wins);

// 	// console.log(betting_object[0]);
// 	// UpdateRoom();
// 	// //console.log(betting);
// });

// socket.on("realtime_gameround", (game) => {

// 	console.log("round change");

// 	objectRealtime[game.roomno].iRound = game.round;
// 	UpdateRoom();

// });

