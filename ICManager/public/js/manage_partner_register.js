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