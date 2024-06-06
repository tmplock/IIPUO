$(document).on('click', '#setting_letterlistreceive', ()=> {

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

});

$(document).on('click', '#setting_letterlistsend', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_setting/letterlistsend');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#setting_announcement', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_setting/announcement');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#setting_popup', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_setting/popup');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#setting_banklist', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_setting/letter_banklist');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

let GetSettingSectionClass = (iSection, iCurrent) => {
    const cSection = parseInt(iSection);
    const cCurrent = parseInt(iCurrent);

    if ( cSection == cCurrent )
        return 'on';

    return '';
}

let GetSettingSectionColor = (iSection, iCurrent) => {
    const cSection = parseInt(iSection);
    const cCurrent = parseInt(iCurrent);

    if ( cSection == cCurrent )
        return '#ffffff';

    return '#000000';

}

let SetSettingHeader = (iSection, iClass) => {

    const cClass = parseInt(iClass);

    let tag = '';

    let subtag = 
    `
        <li class=${GetSettingSectionClass(iSection, 0)}>
            <a href="#" style="color:${GetSettingSectionColor(iSection, 0)};" id="setting_letterlistreceive">${strLetterListReceived}</a>
        </li>
    `;
    tag += subtag;

    subtag = 
    `
        <li class=${GetSettingSectionClass(iSection, 1)}>
            <a href="#" style="color:${GetSettingSectionColor(iSection, 1)};" id="setting_letterlistsend">${strLetterListSended}</a>
        </li>
    `;
    tag += subtag;
    
    if ( user.iClass <= 3 )
    {
        let subtag1 = 
        `
        <li class=${GetSettingSectionClass(iSection, 2)}>
            <a href="#" style="color:${GetSettingSectionColor(iSection, 2)};" id="setting_announcement">${strAnnouncement}</a>
        </li>
        `;
        tag += subtag1;
    }

    if ( user.iClass <= 3 )
    {
        let subtag1 = 
        `
        <li class=${GetSettingSectionClass(iSection, 3)}>
            <a href="#" style="color:${GetSettingSectionColor(iSection, 3)};" id="setting_popup">${strPopup}</a>
        </li>
        `;
        tag += subtag1;
    }

    if ( user.iClass == 2 )
    {
        let subtag1 = 
        `
        <li class=${GetSettingSectionClass(iSection, 4)}>
            <a href="#" style="color:${GetSettingSectionColor(iSection, 4)};" id="setting_banklist">계좌 문의</a>
        </li>
        `;
        tag += subtag1;
    }

    $('#setting_header').empty();
    $('#setting_header').append(tag);
}