$(document).on('click', '#user_changemoney', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user/changemoney');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();	
});

	
$(document).on('click', '#user_changemoneylist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/changemoneylist');
    $form.attr('method', 'post');
    //$form.attr('target', 'popupChk');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
})	
