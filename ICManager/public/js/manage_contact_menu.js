
$(document).on('click', "#list_contact_receive", (event) => {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_contact/list_contact_receive');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})


$(document).on('click', "#list_contact_send", (event) => {

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
})


$(document).on('click', "#list_charge_request", (event) => {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_contact/list_charge_request');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})