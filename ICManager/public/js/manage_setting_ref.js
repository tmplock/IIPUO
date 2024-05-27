//	##### js/common_menu.js 로 이동
// let PopupReadWriteLetter = (strTo, strContents) => {
// 	window.open('', 'WriteLetter', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

// 	var $form = $('<form></form>');
// 	$form.attr('action', '/manage_setting_popup/readwriteletter');
// 	$form.attr('method', 'post');
// 	$form.attr('target', 'WriteLetter');
// 	$form.appendTo('body');

// 	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
// 	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
// 	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
// 	var strTo = $(`<input type="hidden" value='${strTo}' name="strTo">`);
// 	var strContents = $(`<input type="hidden" value='${strContents}' name="strContents">`);

// 	$form.append(idx).append(page).append(category).append(strTo).append(strContents);
// 	$form.submit();
// }

let OnClickWritingLetter = (strTo) => {
	window.open('', 'WriteLetter', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_setting_popup/writeletter');
	$form.attr('method', 'post');
	$form.attr('target', 'WriteLetter');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	var strTo = $(`<input type="hidden" value='${strTo}' name="strTo">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(strTo);
	$form.submit();
}


let OnClickGroupWritingLetter = () => {
	window.open('', 'GroupWriteLetter', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_setting_popup/group_writeletter');
	$form.attr('method', 'post');
	$form.attr('target', 'GroupWriteLetter');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	var strTo = $(`<input type="hidden" value='${strTo}' name="strTo">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(strTo);
	$form.submit();
}

let ReadLetter = (id, target, type) => {

	console.log(`ReadLetter : ${id}, ${target}`);

	window.open('', 'ReadLetter', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_setting_popup/readletter');
	$form.attr('method', 'post');
	$form.attr('target', 'ReadLetter');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value='${parseInt(user.iClass)}' name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	let dbid = $(`<input type="hidden" value='${parseInt(id)}' name="id">`);
	let to = $(`<input type="hidden" value='${target}' name="target">`);
	let letterType = $(`<input type="hidden" value='${type}' name="letterType">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(dbid).append(to).append(letterType);
	$form.submit();
}

let ReadAnnouncement = (id) => {

	console.log(`ReadAnnouncement : ${id}`);

	window.open('', 'ReadAnnouncement', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_setting_popup/readannouncement');
	$form.attr('method', 'post');
	$form.attr('target', 'ReadAnnouncement');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value='${parseInt(user.iClass)}' name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	let dbid = $(`<input type="hidden" value='${parseInt(id)}' name="id">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(dbid);
	$form.submit();
}

let RemoveAnnouncement = (id, strSubject) => {

	if ( confirm(`${strSubject} ${strConfirmRemove}`))
	{
		$.ajax({
			url:"/manage_setting_popup/request_removeannouncement",
			type:"POST",
			context: document.body,
			data: {
				id:id
			},
			success: function (obj) {
	
				if( obj.result == 'OK' )
				{
					alert(strAlertComplete);
					location.reload();
					return true;
				}
				else
					return false;
			}
		});

	}
}

let WriteAnnouncement = (eType) => {

	let strSubject = $('#strSubject').val();
	let strContents = $('#strContents').val();

	$.ajax({
		url:"/manage_setting_popup/request_writeannouncement",
		type:"POST",
		context: document.body,
		data: {
			strSubject:strSubject,
			strContents:strContents,
			eType:eType
		},
		success: function (obj) {

			console.log(obj);

			if( obj.result == 'OK' )
			{
				alert('작성이 완료 되었습니다.');
				opener.location.reload();
				window.close();
			}
		}
	});
}


let OnClickWriteAnnouncement = (eType) => {
	window.open('', 'WriteAnnouncement', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_setting_popup/writeannouncement');
	$form.attr('method', 'post');
	$form.attr('target', 'WriteAnnouncement');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	var eType = $(`<input type="hidden" value='${eType}' name="eType">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(eType);
	$form.submit();
}

let OnAnnChangeState = (id) => {

	//alert($(`#ann_state${id}`).val());

	let eState = $(`#ann_state${id}`).val();

	let objectData = {id:id, eState:eState};

	console.log(objectData);

	$.ajax({
		url:"/manage_setting_popup/request_annchangestate",
		type:"POST",
		context: document.body,
		data: objectData,
		success: function (obj) {

			if( obj.result == 'OK' )
			{
				alert(strAlertComplete);
				// opener.location.reload();
				// window.close();
			}
			else
			{
				alert(strAlertError);
			}
		}
	});
}

let OnClickNickname = (strNickname, menu) => {
	$.ajax({
		type:'post',
		url: "/manage_setting/request_agentinfo",
		context: document.body,
		data:{strNickname:strNickname},
		success:function(data) {
			if ( data.result == 'OK' )
			{
				OnClickUser(data.data.strNickname, data.data.strGroupID, data.data.iClass, menu);
			}
			else if (data.result == 'FAIL')
			{
				alert(data.msg);
			}
		}
	});
}

let OnClickUser = (strNickname, strGroupID, iClass, menu) => {

	if ( iClass == 8 )
	{
		//  User Popup
		let target = `popupAgent${strNickname}`;
		let strAddress = '/manage_user_popup/';
		let url = menu ?? 'userinfo';
		strAddress = `${strAddress}${url}`;
		window.open('', target, 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

		var $form = $('<form></form>');
		$form.attr('action', strAddress);
		$form.attr('method', 'post');
		$form.attr('target', target);
		$form.appendTo('body');

		var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
		var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
		var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

		$form.append(idx).append(page).append(category);
		$form.submit();
	}
	else
	{
		//  Agent Popup
		let target = `popupAgent${strNickname}`;
		let strAddress = '/manage_partner_popup/';
		let url = menu ?? 'agentinfo';
		strAddress = `${strAddress}${url}`;
		window.open('', target, 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

		var $form = $('<form></form>');
		$form.attr('action', strAddress);
		$form.attr('method', 'post');
		$form.attr('target', target);
		$form.appendTo('body');

		var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
		var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
		var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

		$form.append(idx).append(page).append(category);
		$form.submit();
	}
}

