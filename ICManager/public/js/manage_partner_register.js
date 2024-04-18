$(document).on('click', '#register_agent', (event) => {

    let eAgentType = $(event.target).attr('iAgentClass');

    console.log(user);
    
    window.open('', 'popupRegister', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/registeragent');
    $form.attr('method', 'post');
    $form.attr('target', 'popupRegister');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
    let iAgentClass = $(`<input type="hidden" value=${eAgentType} name="iAgentClass">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission).append(iAgentClass);
    $form.submit();
})

$(document).on('click', '#register_agent_view', (event) => {

    let eAgentType = $(event.target).attr('iAgentClass');

    window.open('', 'popupChkListAdminView', 'width=1000, height=600, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    let $form = $('<form></form>');
    if (eAgentType == 2) {
        $form.attr('action', '/manage_partner_popup/popup_listvice_view');
    } else if (eAgentType == 3) {
        $form.attr('action', '/manage_partner_popup/popup_listadmin_view');
    }
    $form.attr('method', 'post');
    $form.attr('target', 'popupChkListAdminView');
    $form.appendTo('body');

    let id = $(`<input type="hidden" value="${user.strID}" name="strID">`);
    let idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);
    let iAgentClass = $(`<input type="hidden" value=${eAgentType} name="iAgentClass">`);

    $form.append(id).append(idx).append(page).append(category).append(iPermission).append(iAgentClass);
    $form.submit();
})


$(document).on('click', '#popup_overview_logs', (event) => {

    let $form = $('<form></form>');
    $form.attr('action', '/manage_logs/popup_overview_logs');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChkLogs');
    $form.appendTo('body');

    let id = $(`<input type="hidden" value="${user.strID}" name="strID">`);
    let idx = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(user.iClass)} name="iClass">`);

    $form.append(id).append(idx).append(page).append(category);
    $form.submit();
})

// $(document).on('click', '#partner_adjust', (event) => {

//     window.open('', 'popupAdjust', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

//     var $form = $('<form></form>');
//     $form.attr('action', '/manage_partner_popup/adjust');
//     $form.attr('method', 'post');
//     $form.attr('target', 'popupAdjust');
//     $form.appendTo('body');
    
//     // var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
//     // var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
//     // var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

//     // $form.append(idx).append(page).append(category);
//     $form.submit();
// });