$(document).on('click', '#calculation_calculation', ()=> {

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

});

let GetBankAccountSectionClass = (iSection, iCurrent) => {
    const cSection = parseInt(iSection);
    const cCurrent = parseInt(iCurrent);

    if ( cSection == cCurrent )
        return 'on';

    return '';
}

let GetCalculationSectionColor = (iSection, iCurrent) => {
    const cSection = parseInt(iSection);
    const cCurrent = parseInt(iCurrent);

    if ( cSection == cCurrent )
        return '#ffffff';

    return '#000000';

}

let SetCalculationHeader = (iSection, iClass) => {

    const cClass = parseInt(iClass);

    let tag = '';

    subtag1 = 
    `
    <li class=${GetBankAccountSectionClass(iSection, 0)}>
        <a href="#" style="color:${GetCalculationSectionColor(iSection, 0)};" id="submenu_bankaccount_account">계과 관리</a>
    </li>
    `;
    tag += subtag1;


    $('#bankaccount_header').empty();
    $('#bankaccount_header').append(tag);
}


let GetParseInt = (num) => {
    let temp = parseInt(num); // 배당금
    if (temp > 0) {
        return Math.floor(temp);
    } else {
        return parseInt(temp);
    }
}