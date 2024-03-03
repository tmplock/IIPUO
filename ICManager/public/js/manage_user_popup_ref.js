function OnClickUser(strNickname, strGroupID, iClass, iPermission)
{
    var scLeft = window.screenLeft + 50;
    var scTop = window.screenTop + 50;
    window.open('', 'popupUser', `width=1280, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/bettingrecord');
    $form.attr('method', 'post');
    $form.attr('target', 'popupUser');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(iPermission)} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
}