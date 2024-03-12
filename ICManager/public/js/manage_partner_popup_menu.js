$(document).on('click', '#popup_agentinfo', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/agentinfo');
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
});


$(document).on('click', '#popup_proadminlist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/proadminlist');
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
});

$(document).on('click', '#popup_viceadminlist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/viceadminlist');
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
});

$(document).on('click', '#popup_agentlist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/agentlist');
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
});

$(document).on('click', '#popup_shoplist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/shoplist');
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
});

$(document).on('click', '#popup_userlist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/userlist');
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
});

$(document).on('click', '#popup_charges', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/charges');
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
});

$(document).on('click', '#popup_exchanges', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/exchanges');
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
});

$(document).on('click', '#popup_points', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/points');
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
});

$(document).on('click', '#popup_games', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/games');
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
});

$(document).on('click', '#popup_memos', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/memos');
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
});

$(document).on('click', '#popup_bettingrecord', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/bettingrecord');
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
});

$(document).on('click', '#popup_credits', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/credits');
    $form.attr('method', 'post');
    //$form.attr('target', 'popupChk');
    $form.appendTo('body');

    var id = $(`<input type="hidden" value="${agent.strID}" name="strID">`);
    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(id).append(idx).append(page).append(category).append(iPermission);
    //$form.append(idx);
    $form.submit();
});

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
    let iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(id).append(idx).append(page).append(category).append(iPermission);
    $form.submit();
});

$(document).on('click', '#popup_proadmin_settle', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_calculation/popup_proadmin_settle');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
});

$(document).on('click', '#popup_share', ()=> {
    window.open('', 'popupChk_share', 'width=2200, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    let $form = $('<form></form>');
    $form.attr('action', '/manage_share/popup_shares');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChk_share');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    let iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
});

$(document).on('click', '#popup_share_history', ()=> {
    // window.open('', 'popupChk_share_history', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    let $form = $('<form></form>');
    $form.attr('action', '/manage_share/popup_shares_history');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChk_share');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);
    let iPermission = $(`<input type="hidden" value=${agent.iPermission} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
});

$(document).on('click', '#popup_changemoney', ()=> {
    window.open('', 'popupChk_changemoney', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    let $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/changemoney');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChk_changemoney');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${agent.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${agent.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${agent.iClass} name="iClass">`);

    $form.append(idx).append(page).append(category);
    $form.submit();
});