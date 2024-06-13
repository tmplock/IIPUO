var socket = io();
var input = 0;
var output = 0;
var letter = 0;
var charge = 0;
var contact = 0;
var letterreply = 0;
var contactreply = 0;

var intervalInput, intervalOutput, intervalLetter, intervalCharge, intervalContact, intervalLetterReply, intervalContactReply;
var alertContactReply = 1;

var intervalInputSoundOn = 1;
var intervalOutputSoundOn = 1;
var intervalLetterSoundOn = 1;
var intervalChargeSoundOn = 1;
var intervalContactSoundOn = 1;
var intervalLetterReplySoundOn = 1;
var intervalContactReplySoundOn = 1;

let AlertInput = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn ) {
		$('#input_process').empty();
		$('#input_process').append(`<li><a href="#" class="btn_thingreen" style="width: 70px;" onclick="OnClickInputProcess();">${strRequestInput}</a></li>`);
		if (intervalInputSoundOn == 1)
			Alertinterval('alert_input');
	} else {
		clearInterval(intervalInput);
		$('#input_process').empty();
	}
}

let AlertOutput = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn) {
		$('#output_process').empty();
		$('#output_process').append(`<li><a href="#" class="btn_thinblue" style="width: 70px;" onclick="OnClickOutputProcess();">${strRequestOutput}</a></li>`);
		if (intervalOutputSoundOn == 1)
			Alertinterval('alert_output');
	} else {
		clearInterval(intervalOutput);
		$('#output_process').empty();
	}
}

let AlertLetter = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn) {
		$('#letter_process').empty();
		$('#letter_process').append(`<li><a href="#" class="btn_thinyellow" style="width: 70px;" onclick="OnClickLetterProcess();">${strText}</a></li>`);
		if (intervalLetterSoundOn == 1)
			Alertinterval('alert_letter');
	} else {
		clearInterval(intervalLetter);
		$('#letter_process').empty();
	}
}

let AlertLetterReply = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn) {
		$('#letterreply_process').empty();
		$('#letterreply_process').append(`<li><a href="#" class="btn_thinyellow" style="width: 70px;" onclick="OnClickLetterReply();">${strText}</a></li>`);
		if (intervalLetterReplySoundOn == 1)
			Alertinterval('alert_letter_reply');
	} else if (user.iPermission == 100 && user.iClass == 3 && bOn) {
		$('#letterreply_process').empty();
		$('#letterreply_process').append(`<li><a href="#" class="btn_thinyellow" style="width: 70px;" onclick="OnClickLetterReply();">${strText}</a></li>`);
		if (intervalLetterReplySoundOn == 1)
			Alertinterval('alert_letter_reply');
	} else {
		clearInterval(intervalLetterReply);
		$('#letterreply_process').empty();
	}
}

let AlertCharge = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn ) {
		$('#charge_process').empty();
		$('#charge_process').append(`<li><a href="#" class="btn_thingreen" style="width: 70px;" onclick="OnClickChargeProcess();">충전요청</a></li>`);
		if (intervalChargeSoundOn == 1)
			Alertinterval('alert_charge');
	} else {
		clearInterval(intervalCharge);
		$('#charge_process').empty();
	}
}

let AlertContact = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn ) {
		$('#contact_process').empty();
		$('#contact_process').append(`<li><a href="#" class="btn_thinyellow" style="width: 70px;" onclick="OnClickContactProcess();">${strText}</a></li>`);
		if (intervalContactSoundOn == 1)
			Alertinterval('alert_contact');
	} else {
		clearInterval(intervalContact);
		$('#contact_process').empty();
	}
}

let AlertContactReply = (strText, bOn) => {
	if ( user.iPermission != 100 && bOn ) {
		$('#contactreply_process').empty();
		$('#contactreply_process').append(`<li><a href="#" class="btn_thinyellow" style="width: 70px;" onclick="OnClickContactSendReply();">${strText}</a></li>`);
		if (intervalContactReplySoundOn == 1)
			Alertinterval('alert_contact_reply');
	} else if ( user.iPermission == 100 && user.iClass == 3 && bOn ) {
		$('#contactreply_process').empty();
		$('#contactreply_process').append(`<li><a href="#" class="btn_thinyellow" style="width: 70px;" onclick="OnClickContactSendReply();">${strText}</a></li>`);
		if (intervalContactReplySoundOn == 1)
			Alertinterval('alert_contact_reply');
		if (alertContactReply == 0) {
			setTimeout(() => {
				alertContactReply = 1;
				SaveLocalStorage();
			}, 30000);
		} else if (alertContactReply == 1) {
			alert('관리자 문의 답변이 왔습니다. 답변을 확인해주세요');
			alertContactReply = 0;
			SaveLocalStorage();
			{
				var $form = $('<form></form>');
				$form.attr('action', '/manage_contact/list_contact_send');
				$form.attr('method', 'post');
				$form.appendTo('body');

				var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
				var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
				var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
				var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

				$form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
				$form.submit();
			}
		}
	} else {
		clearInterval(intervalContactReply);
		$('#contactreply_process').empty();
	}
}

let Alertinterval = (eAlertType) =>{
	if(eAlertType == 'alert_input'){
		clearInterval(intervalInput);
		if (intervalInputSoundOn == 1) {
			intervalInput = setInterval(function() {
				document.getElementById("audio_inputalert").play();
			}, 1000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalInputSoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalInput);
				}, 7000);
			}
		}
	}
	else if(eAlertType == 'alert_output'){
		clearInterval(intervalOutput);
		if (intervalOutputSoundOn == 1) {
			intervalOutput = setInterval(function() {
				document.getElementById("audio_outputalert").play();
			}, 2000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalOutputSoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalOutput);
				}, 7000);
			}
		}
	}
	else if(eAlertType == 'alert_letter'){
		clearInterval(intervalLetter);
		if (intervalLetterSoundOn == 1) {
			intervalLetter = setInterval(function() {
				document.getElementById("audio_letteralert").play();
			}, 2000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalLetterSoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalLetter);
				}, 7000);
			}
		}
	}
	else if (eAlertType == 'alert_letter_reply') {
		clearInterval(intervalLetterReply);
		if (intervalLetterReplySoundOn == 1) {
			intervalLetterReply = setInterval(function() {
				document.getElementById("audio_letter_reply_alert").play();
			}, 2000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalLetterReplySoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalLetterReply);
				}, 7000);
			}
		}
	}
	else if(eAlertType == 'alert_charge'){ // 충전요청
		clearInterval(intervalCharge);
		if (intervalChargeSoundOn == 1) {
			intervalCharge = setInterval(function() {
				document.getElementById("audio_chargealert").play();
			}, 1000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalChargeSoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalCharge);
				}, 7000);
			}
		}
	}
	else if(eAlertType == 'alert_contact'){ // 관리자 문의
		clearInterval(intervalContact);
		if (intervalContactSoundOn == 1) {
			intervalContact = setInterval(function() {
				document.getElementById("audio_contactalert").play();
			}, 2000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalContactSoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalContact);
				}, 7000);
			}
		}
	}
	else if(eAlertType == 'alert_contact_reply'){ // 관리자 문의
		clearInterval(intervalContactReply);
		if (intervalContactReplySoundOn == 1) {
			intervalContactReply = setInterval(function() {
				document.getElementById("audio_contact_reply_alert").play();
			}, 2000);

			if (user.iClass > 3) {
				setTimeout(() => {
					intervalContactReplySoundOn = 0;
					SaveLocalStorage();
					clearInterval(intervalContactReply);
				}, 7000);
			}
		}
	}
}

let AlertintervalSoundOff = (eAlertType) =>{
	if(eAlertType == 'alert_input'){
		clearInterval(intervalInput);
		intervalInputSoundOn = 0;
		localStorage.setItem('intervalInputSoundOn', intervalInputSoundOn);
	}
	else if(eAlertType == 'alert_output'){
		clearInterval(intervalOutput);
		intervalOutputSoundOn = 0;
		localStorage.setItem('intervalInputSoundOn', intervalOutputSoundOn);
	}
	else if(eAlertType == 'alert_letter'){
		clearInterval(intervalLetter);
		intervalLetterSoundOn = 0;
		localStorage.setItem('intervalLetterSoundOn', intervalLetterSoundOn);
	}
	else if(eAlertType == 'alert_letter_reply'){
		clearInterval(intervalLetterReply);
		intervalLetterReplySoundOn = 0;
		localStorage.setItem('intervalLetterReplySoundOn', intervalLetterReplySoundOn);
	}
	else if(eAlertType == 'alert_charge'){ // 충전요청
		clearInterval(intervalCharge);
		intervalChargeSoundOn = 0;
		localStorage.setItem('intervalChargeSoundOn', intervalChargeSoundOn);
	}
	else if(eAlertType == 'alert_contact'){ // 관리자 문의
		clearInterval(intervalContact);
		intervalContactSoundOn = 0;
		localStorage.setItem('intervalContactSoundOn', intervalContactSoundOn);
	}
	else if(eAlertType == 'alert_contact_reply') {
		clearInterval(intervalContactReply);
		intervalContactReplySoundOn = 0;
		localStorage.setItem('intervalContactReplySoundOn', intervalContactReplySoundOn);
	}
}

let LoadLocalStorage = () => {
	input = localStorage.getItem('input') ?? 0;
	output = localStorage.getItem('output') ?? 0;
	letter = localStorage.getItem('letter') ?? 0;
	charge = localStorage.getItem('charge') ?? 0;
	contact = localStorage.getItem('contact') ?? 0;
	letterreply = localStorage.getItem('letterreply') ?? 0;
	contactreply = localStorage.getItem('contactreply') ?? 0;

	intervalInputSoundOn = localStorage.getItem('intervalInputSoundOn') ?? 1;
	intervalOutputSoundOn = localStorage.getItem('intervalOutputSoundOn') ?? 1;
	intervalLetterSoundOn = localStorage.getItem('intervalLetterSoundOn') ?? 1;
	intervalLetterReplySoundOn = localStorage.getItem('intervalLetterReplySoundOn') ?? 1;
	intervalChargeSoundOn = localStorage.getItem('intervalChargeSoundOn') ?? 1;
	intervalContactSoundOn = localStorage.getItem('intervalContactSoundOn') ?? 1;
	intervalContactReplySoundOn = localStorage.getItem('intervalContactReplySoundOn') ?? 1;

	alertContactReply = localStorage.getItem('alertContactReply') ?? 1;
}

let SaveLocalStorage = () => {
	localStorage.setItem('input', input);
	localStorage.setItem('output', output);
	localStorage.setItem('letter', letter);
	localStorage.setItem('charge', charge);
	localStorage.setItem('contact', contact);
	localStorage.setItem('letterreply', letterreply);
	localStorage.setItem('contactreply', contactreply);

	localStorage.setItem('intervalInputSoundOn', intervalInputSoundOn);
	localStorage.setItem('intervalOutputSoundOn', intervalOutputSoundOn);
	localStorage.setItem('intervalLetterSoundOn', intervalLetterSoundOn);
	localStorage.setItem('intervalLetterReplySoundOn', intervalLetterReplySoundOn);
	localStorage.setItem('intervalChargeSoundOn', intervalChargeSoundOn);
	localStorage.setItem('intervalContactSoundOn', intervalContactSoundOn);
	localStorage.setItem('intervalContactReplySoundOn', intervalContactReplySoundOn);

	localStorage.setItem('alertContactReply', alertContactReply);
}

let Alert = (iocount, strInput, strOutput, strLetter, strCharge, strContact) => {
	if ( user.iPermission != 100 || (user.iPermission == 100 && user.iClass == 3) ) {
		var right = 40;
		var space = 3;
		$(`#process`).empty();

		let inputtemp = parseInt(iocount.input) ?? 0;
		let outputtemp = parseInt(iocount.output) ?? 0;
		let lettertemp = parseInt(iocount.letter) ?? 0;
		let chargetemp = parseInt(iocount.charge) ?? 0;
		let contacttemp = parseInt(iocount.contact) ?? 0;
		let letterreplytemp = parseInt(iocount.letterreply) ?? 0;
		let contactreplytemp = parseInt(iocount.contactreply) ?? 0;

		LoadLocalStorage();

		if (inputtemp > input) {
			intervalInputSoundOn = 1;
			input = inputtemp;
		}
		if (outputtemp > output) {
			intervalOutputSoundOn = 1;
			output = outputtemp;
		}
		if (lettertemp > letter) {
			intervalLetterSoundOn = 1;
			letter = lettertemp;
		}
		if (letterreplytemp > letterreply) {
			intervalLetterReplySoundOn = 1;
			letterreply = letterreplytemp;
		}
		if (chargetemp > charge) {
			intervalChargeSoundOn = 1;
			charge = chargetemp;
		}
		if (contacttemp > contact) {
			intervalContactSoundOn = 1;
			contact = contacttemp;
		}
		if (contactreplytemp > contactreply) {
			intervalContactReplySoundOn = 1;
			contactreply = contactreplytemp;
		}
		SaveLocalStorage();
		if (user.iClass <= 3) {
			AlertInput('입금신청', parseInt(iocount.input) > 0);
			AlertOutput('출금신청', parseInt(iocount.output) > 0);
		}
		AlertLetter('받은쪽지', parseInt(iocount.letter) > 0);
		AlertLetterReply('문의답변', parseInt(iocount.letterreply) > 0);
		AlertCharge('충전요청', parseInt(iocount.charge) > 0 );
		AlertContact('관리자문의', parseInt(iocount.contact) > 0);
		AlertContactReply('문의답변', parseInt(iocount.contactreply) > 0);
	} else {
		Alertinterval('');
	}
}

let AlertCash = (iCash) => {
	$('#MainLayoutMyCash').text(iCash.toLocaleString());

}

let AlertTodayUser = (todayUser) => {
	$('#MainTodayUser').text(`승인요청(${todayUser})`);
}

//let socket = io();

socket.on('connect', ()=> {
	console.log("접속완료");
	if (user != null) {
		socket.emit('request_login', user);
	}
});

socket.on("alert_input", ()=> {
	if ( user.iPermission != 100 && user.iClass <= 3 ) {
		intervalInputSoundOn = 1;
		input = parseInt(input)+1;
		SaveLocalStorage();
		AlertInput(strRequestInput, true);
	}
	//}
})

socket.on("alert_output", ()=> {
	if ( user.iPermission != 100 && user.iClass <= 3 ) {
		intervalOutputSoundOn = 1;
		output = parseInt(output)+1;
		SaveLocalStorage();
		AlertOutput(strRequestOutput, true);
	}
})

socket.on("alert_letter", ()=> {
	if ( user.iPermission != 100 || (user.iPermission == 100 && user.iClass == 3) ) {
		intervalLetterSoundOn = 1;
		letter = parseInt(letter)+1;
		SaveLocalStorage();
		AlertLetter("받은쪽지", true);
	}
});

socket.on("alert_charge", ()=> {
	if ( user.iPermission != 100 ) {
		intervalChargeSoundOn = 1;
		charge = parseInt(charge)+1;
		SaveLocalStorage();
		AlertCharge("충전요청", true);
	}
});

socket.on("alert_contact", ()=> {
	if ( user.iPermission != 100 ) {
		intervalContactSoundOn = 1;
		contact = parseInt(contact)+1;
		SaveLocalStorage();
		AlertContact("관리자문의", true);
	}
});

socket.on('alert_cash', (iAmount) => {
	if ( user.iPermission != 100 ) {
		AlertCash(iAmount);
	}
});

socket.on('alert_today_user', (todayUsers) => {
	if ( user.iPermission != 100 ) {
		AlertTodayUser(todayUsers);
	}
});


socket.on('realtime_user', (numUser) => {
	if (user.iClass <= 3) {
		$('#partner_listrealtimeuser').text(`${strRealtimeOnlineUserList} (${numUser})`);
		$('#span_onlineusers').text(`${strRealtimeOnlineUserList} (${numUser})`);
	}
});

socket.on('register_user', (num) => {
	if (user.iClass == 2) {
		$('#today_regist_list').text(`당일등록현황 (${num})`);
	}
});

socket.on('letter_reply', () => {
	intervalLetterSoundOn = 1;
	AlertLetterReply("문의답변", true)
});

socket.on('alert_letter_reply', () => {
	intervalLetterReplySoundOn = 1;
	AlertLetterReply("문의답변", true);
});

socket.on('alert_contact_reply', () => {
	intervalContactReplySoundOn = 1;
	AlertContactReply('관리자문의답변', true);
});

socket.on('alert_update', (iocount) => {
	Alert(iocount);
});

socket.on("num_rooms", (iNumRooms) => {
});

socket.on("realtime_bet", (betting) => {

	console.log(`realtime_bet `);
	console.log(betting);

	const chips = parseInt(betting.chips);
	const target = parseInt(betting.target);

	
	console.log('Target:'+ target);
	console.log('iChip:'+ chips);
	console.log(objectRealtime[0]);
	
	if ( objectRealtime != undefined )
		objectRealtime[0].kBettingInfo[target].iBetting += chips;
		
	if ( objectOverview != undefined )
		objectOverview.kBettingInfo[target].iBetting += parseInt(chips);

	UpdateRoom();
	SetOverview(objectOverview, "#div_realtimebet_overview", true);
});

socket.on("realtime_betwin", (betting) => {

	console.log(betting);

	const target = parseInt(betting.target);
	const win = parseInt(betting.result);
	
	console.log(`betwin:${objectRealtime[0]}`);
	if ( objectRealtime != undefined )
		objectRealtime[0].kBettingInfo[target].iWin += win;
	if ( objectOverview != undefined )
		objectOverview.kBettingInfo[target].iWin += win;

	UpdateRoom();
	SetOverview(objectOverview, "#div_realtimebet_overview", true); 
});

socket.on("realtime_betend", (betting) => {

	console.log("betting end");
	console.log(betting);

	if ( objectRealtime != undefined )
		InitRoom(betting.roomno);
});

socket.on("realtime_gameround", (game) => {

	console.log("round change");

	if ( objectRealtime != undefined )
	{
		objectRealtime[0].iRound = game.round;
		UpdateRoom();
	}
});

socket.on('UserLogout', () => {
	alert('중복로그인으로 인한 로그아웃이 되었습니다');
	window.location.href='/account/logout';
})