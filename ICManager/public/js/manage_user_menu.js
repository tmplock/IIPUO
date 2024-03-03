$(document).on('click', '#user_userlist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user/userlist');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
});

$(document).on('click', '#user_realtimeuserlist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user/realtimeuserlist');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(user.iPermission)} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
});
// $(document).on('click', '#user_note', ()=> {

//     var $form = $('<form></form>');
//     $form.attr('action', '/manage_user/note');
//     $form.attr('method', 'post');
//     $form.appendTo('body');
    
//     var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
//     var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
//     var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);

//     $form.append(strNickname).append(strGroupID).append(iClass);
//     $form.submit();

// });

// $(document).on('click', '#user_notelist', ()=> {

//     var $form = $('<form></form>');
//     $form.attr('action', '/manage_user/notelist');
//     $form.attr('method', 'post');
//     $form.appendTo('body');
    
//     var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
//     var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
//     var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);

//     $form.append(strNickname).append(strGroupID).append(iClass);
//     $form.submit();

// });
