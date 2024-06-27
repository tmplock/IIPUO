
let OnClickChangeMoney = (strNickname, strGroupID, iClass) => {

    console.log(`OnClickChangeMoney : ${strNickname}`);

    // window.open('', 'popupChk', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user/changemoney');
    $form.attr('method', 'post');
    // $form.attr('target', 'popupChk');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

    $form.append(idx).append(page).append(category);
    $form.submit();
}