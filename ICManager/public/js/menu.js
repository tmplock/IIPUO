$(document).on('click', "#manage_partner", (event) => {
    
//    alert(user.iClass);

    let address = '/manage_partner/listshop';
    if ( user.iClass == 1 )
        address = '/manage_partner/listvicehq';
    else if ( user.iClass == 2 )
        //address = '/manage_partner/listadmin';
        address = '/manage_partner/listrealtimeuser';
    else if ( user.iClass == 3 )
        //address = '/manage_partner/listproadmin';
        address = '/manage_partner/listrealtimeuser';
    else if ( user.iClass == 4 )
        address = '/manage_partner/listviceadmin';
    else if ( user.iClass == 5 )
        address = '/manage_partner/listagent';

    //address = '/manage_partner/listrealtimeuser';

    var $form = $('<form></form>');
    //$form.attr('action', '/manage_partner/realtime');
    //$form.attr('action', '/manage_partner/listshop');
    $form.attr('action', address);
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#manage_user", (event) => {
    
    var $form = $('<form></form>');
    $form.attr('action', '/manage_user/userlist');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#manage_inouts", (event) => {
    
    var $form = $('<form></form>');
    $form.attr('action', '/manage_inout/charge');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#announcement", (event) => {
    
    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/announcement');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})



$(document).on('click', "#manage_bettingrecord", (event) => {
    
    let $form = $('<form></form>');
    $form.attr('action', '/manage_bettingrecord/casino');
    $form.attr('method', 'post');
    $form.appendTo('body');

    let strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    let strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    let iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    let iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#manage_setting", (event) => {
    
    var $form = $('<form></form>');
    $form.attr('action', '/manage_setting/letterlistreceive');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#manage_calculation", (event) => {
    
    var $form = $('<form></form>');
    $form.attr('action', '/manage_calculation/calculation');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#manage_timesbettingtest", (event) => {
    
    var $form = $('<form></form>');
    $form.attr('action', '/manage_timesbettingtest/');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
})

$(document).on('click', "#manage_contact", (event) => {

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

$(document).on('click', "#manage_share", (event) => {
    window.open('', 'popupChk_share', 'width=2200, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    let $form = $('<form></form>');
    $form.attr('action', '/manage_share/popup_shares');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChk_share');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);

    $form.append(idx).append(page).append(category);
    $form.submit();
})

$(document).on('click', "#manage_chip", (event) => {
    window.open('', 'popupChk_chip', 'width=1600, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    let $form = $('<form></form>');
    $form.attr('action', '/manage_chip/popup_chip');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChk_chip');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);

    $form.append(idx).append(page).append(category);
    $form.submit();
})