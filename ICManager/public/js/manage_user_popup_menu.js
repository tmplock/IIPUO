$(document).on('click', '#popup_userinfo', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/userinfo');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();	
});

	
$(document).on('click', '#popup_input', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/input');
    $form.attr('method', 'post');
    //$form.attr('target', 'popupChk');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
})	


$(document).on('click', '#popup_output', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/output');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
})	

$(document).on('click', '#popup_pointrecord', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/pointrecord');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
})

$(document).on('click', '#popup_bettingrecorduser', ()=> {

	var $form = $('<form></form>');
	$form.attr('action', '/manage_user_popup/bettingrecord');
	$form.attr('method', 'post');
	//$form.attr('target', 'popupChk');
	$form.appendTo('body');

    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

	$form.append(idx).append(page).append(category).append(iPermission);
	//$form.append(idx);
	$form.submit();	
})

$(document).on('click', '#popup_logs', ()=> {
    window.open('', 'popupChk_logs', 'width=1080, height=620, top=90, left=90, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    let $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/logs');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChk_logs');
    $form.appendTo('body');

    let id = $(`<input type="hidden" value="${agent.strID}" name="strID">`);
    let idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);

    $form.append(id).append(idx).append(page).append(category);
    $form.submit();
});