let OnClickWritingContact = (strTo) => {
	window.open('', 'WriteContact', 'width=1024, height=472, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_contact/popup_write_contact');
	$form.attr('method', 'post');
	$form.attr('target', 'WriteContact');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	var strTo = $(`<input type="hidden" value='${strTo}' name="strTo">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(strTo);
	$form.submit();
}

let OnClickReadContact = (id) => {
	window.open('', 'ReadContact', 'width=1024, height=672, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_contact/popup_read_contact');
	$form.attr('method', 'post');
	$form.attr('target', 'ReadContact');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
	var id = $(`<input type="hidden" value="${id}" name="id">`);

	$form.append(idx).append(page).append(category).append(iPermission).append(id);
	$form.submit();
}


let OnClickAnswerContact = () => {
	window.open('', 'AnswerContact', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_contact/popup_answer_contact');
	$form.attr('method', 'post');
	$form.attr('target', 'AnswerContact');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);

	$form.append(idx).append(page).append(category).append(iPermission);
	$form.submit();
}

let OnClickChargeRequest = () => {
	window.open('', 'ChargeRequest', 'width=1024, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

	var $form = $('<form></form>');
	$form.attr('action', '/manage_contact/popup_charge_request');
	$form.attr('method', 'post');
	$form.attr('target', 'ChargeRequest');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);

	$form.append(idx).append(page).append(category).append(iPermission);
	$form.submit();
}

let OnClickNickname = (strNickname) => {
	$.ajax({
		type:'post',
		url: "/manage_setting/request_agentinfo",
		context: document.body,
		data:{strNickname:strNickname},
		success:function(data) {
			if ( data.result == 'OK' )
			{
				OnClickUser(data.data.strNickname, data.data.strGroupID, data.data.iClass);
			}
			else if (data.result == 'FAIL')
			{
				alert(data.msg);
			}
		}
	});
}

let OnClickUser = (strNickname, strGroupID, iClass) => {

	if ( iClass == 8 )
	{
		//  User Popup

		console.log(strNickname);
		console.log(strGroupID);
		console.log(iClass);

		let strAddress = '/manage_user_popup/output';
		window.open('', 'popupInoutAgent', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

		var $form = $('<form></form>');
		$form.attr('action', strAddress);
		$form.attr('method', 'post');
		$form.attr('target', 'popupInoutAgent');
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
		window.open('', 'popupInoutAgent', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
		// $("#Input1_"+strNickname).val(strNickname);
		// $("#Form_"+strNickname).submit();
		// console.log($("#Input1_"+strNickname).val());

		var $form = $('<form></form>');
		//$form.attr('action', '/manage_partner_popup/userlist');
		$form.attr('action', '/manage_partner_popup/agentinfo');
		$form.attr('method', 'post');
		$form.attr('target', 'popupInoutAgent');
		$form.appendTo('body');

		var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
		var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
		var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

		$form.append(idx).append(page).append(category);
		$form.submit();
	}
}
