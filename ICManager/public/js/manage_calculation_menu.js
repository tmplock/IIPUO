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

$(document).on('click', '#calculation_settle_all2', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_calculation/settle_all2');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#calculation_settle_credits', ()=> {
    window.open('', 'popupChkCreditsSub', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    var $form = $('<form></form>');
    $form.attr('action', '/manage_calculation/settle_credits');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChkCreditsSub');
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});


$(document).on('click', '#popup_proadmin_settle', ()=> {
    window.open('', 'popupChkProadminSettle', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
    var $form = $('<form></form>');
    $form.attr('action', '/manage_calculation/popup_proadmin_settle');
    $form.attr('method', 'post');
    $form.attr('target', 'popupChkProadminSettle');
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#calculation_credits_history', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_calculation/credits_history');
    $form.attr('method', 'post');
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

let GetCalculationSectionClass = (iSection, iCurrent) => {
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

    // if ( cClass == EAgent.eViceHQ )
    // {
        subtag1 = 
        `
        <li class=${GetCalculationSectionClass(iSection, 0)}>
            <a href="#" style="color:${GetCalculationSectionColor(iSection, 0)};" id="calculation_calculation">${strBettingRecord}</a>
        </li>
        `;
        tag += subtag1;
    // }

    if ( cClass <= 5 )
    {
        if ( cClass <= 3 )
        {
            subtag1 =
                `
                <li class=${GetCalculationSectionClass(iSection, 110)}>
                    <a href="#" style="color:${GetCalculationSectionColor(iSection, 110)};" id="calculation_settle_all2">죽장 정산</a>
                </li>
            `;
            tag += subtag1;
        }
        else
        {
            subtag1 =
                `
                <li class=${GetCalculationSectionClass(iSection, 110)}>
                    <a href="#" style="color:${GetCalculationSectionColor(iSection, 110)};" id="calculation_settle_all2">죽장 정산</a>
                </li>
            `;
            tag += subtag1;
        }
    }

    if (cClass == 3) {
        subtag1 =
            `
        <li class=${GetCalculationSectionClass(iSection, 3)}>
            <a href="#" style="color:${GetCalculationSectionColor(iSection, 3)};" id="calculation_settle_credits">대본 가불</a>
        </li>
        `;
        tag += subtag1;
    }

    // 총본사는 가불 불필요(지분자로 대체)
    if ( cClass == 2 )
    {
        subtag1 = ``;
        // subtag1 =
        //     `
        // <li class=${GetCalculationSectionClass(iSection, 3)}>
        //    <a href="#" style="color:${GetCalculationSectionColor(iSection, 3)};" id="calculation_settle_credits">본사 가불</a>
        // </li>
        // `;
        subtag1 =
            `
                <li class=${GetCalculationSectionClass(iSection, 3)}>
                   <a href="#" style="color:${GetCalculationSectionColor(iSection, 3)};" id="popup_proadmin_settle">대본보관죽장 목록</a>
                </li>
            `;
        tag += subtag1;
    }

    if ( cClass == 4 )
    {
        subtag1 =
            `
        <li class=${GetCalculationSectionClass(iSection, 4)}>
            <a href="#" style="color:${GetCalculationSectionColor(iSection, 4)};" id="calculation_credits_history">가불 내역</a>
        </li>
        `;
        tag += subtag1;
    }


    $('#calculation_header').empty();
    $('#calculation_header').append(tag);
}


let GetParseInt = (num) => {
    let temp = parseInt(num); // 배당금
    if (temp > 0) {
        return Math.floor(temp);
    } else {
        return parseInt(temp);
    }
}