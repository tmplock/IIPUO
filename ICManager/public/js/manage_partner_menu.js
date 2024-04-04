$(document).on('click', '#partner_realtime', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/realtime');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_record', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/record');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listvicehq', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listvicehq');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listadmin', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listadmin');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listproadmin', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listproadmin');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listviceadmin', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listviceadmin');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listagent', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listagent');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listshop', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listshop');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '#partner_listrealtimeuser', ()=> {

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listrealtimeuser');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
});


$(document).on('click', '#today_regist_list', ()=> {

    let $form = $('<form></form>');
    $form.attr('action', '/manage_partner/listtodayregist');
    $form.attr('method', 'post');
    $form.appendTo('body');

    let strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    let strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    let iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    let iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();
});

// $(document).on('click', '#partner_listletter', ()=> {

//     var $form = $('<form></form>');
//     $form.attr('action', '/manage_partner/listletter');
//     $form.attr('method', 'post');
//     $form.appendTo('body');
    
//     var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
//     var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
//     var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);

//     $form.append(strNickname).append(strGroupID).append(iClass);
//     $form.submit();

// });

// $(document).on('click', '#partner_letterrecord', ()=> {

//     var $form = $('<form></form>');
//     $form.attr('action', '/manage_partner/letterrecord');
//     $form.attr('method', 'post');
//     $form.appendTo('body');
    
//     var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
//     var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
//     var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);

//     $form.append(strNickname).append(strGroupID).append(iClass);
//     $form.submit();

// });

$(document).on('click', '#partner_settingodds', ()=> {
    let input = prompt('암호입력');
    if (input == null) {
        return;
    } else if (input.length == 0) {
        alert(`암호 미입력`);
        return;
    }

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner/settingodds');
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);
    var pass = $(`<input type="hidden" value=${input} name="pass">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission).append(pass);
    $form.submit();

});

$(document).on('click', '#partner_adjustinput', (event) => {

    const strNickname = $(event.target).attr('strNickname');
    const iClass = $(event.target).attr('iClass');
    const strGroupID = $(event.target).attr('strGroupID');

    window.open('', 'popupCharge', 'width=768, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    let $form = $('<form></form>');
    $form.attr('action', '/manage_inout_popup/requestcharge');
    $form.attr('method', 'post');
    $form.attr('target', 'popupCharge');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

    $form.append(idx).append(page).append(category);
    $form.submit();
})

$(document).on('click', '#partner_adjustoutput', (event) => {

    const strNickname = $(event.target).attr('strNickname');
    const iClass = $(event.target).attr('iClass');
    const strGroupID = $(event.target).attr('strGroupID');

    window.open('', 'popupExchange', 'width=768, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    let $form = $('<form></form>');
    $form.attr('action', '/manage_inout_popup/requestexchange');
    $form.attr('method', 'post');
    $form.attr('target', 'popupExchange');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);
    let forced = $(`<input type="hidden" value=${parseInt(1)} name="iForced">`);

    $form.append(idx).append(page).append(category).append(forced);
    $form.submit();
})

let iValue = 0;
//  TableMenu : Move
$(document).on('click', '.move', (event) => {

    let astrNickname = $(event.target).attr('strNickname');
    let astrGroupID = $(event.target).attr('strGroupID');
    let aiClass = $(event.target).attr('iClass');
    let aiPermission = $(event.target).attr('iPermission');

    console.log(`${astrGroupID}, ${astrNickname}, ${aiClass}`);

    let strWindowName = 'popupVAdmin';
    let strAddress = '/manage_partner/listshop';
    
    // iValue ++;
    // if ( iValue == 0 )
    // {
    //     strWindowName = 'popupVAdmin';
    // }
    // else{
    //     strWindowName = 'popupAgent';
    // }
    // iValue %= 2;

    if ( aiClass == 2 )
    {
        strWindowName = 'popupViceHQ';
        strAddress = '/manage_partner/listadmin';
    }
    else if ( aiClass == 3 )
    {
        strWindowName = 'popupAdmin';
        strAddress = '/manage_partner/listproadmin';
    }
    else if ( aiClass == 4 )
    {
        strWindowName = 'popupPAdmin';
        strAddress = '/manage_partner/listviceadmin';
    }
    else if ( aiClass == 5 )
    {
        strWindowName = 'popupVAdmin';
        strAddress = '/manage_partner/listagent';
        
    }
    else if ( aiClass == 6 )
    {
        strWindowName = 'popupAgent';
        strAddress = '/manage_partner/listshop';
        
    }
    else if ( aiClass == 7 )
    {
        strWindowName = 'popupShop';
        strAddress = '/manage_user/userlist';
    }


//    alert(strWindowName);

    var scLeft = window.screenLeft + 50;
    var scTop = window.screenTop + 50;
    window.open('', strWindowName, `width=1380, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

    var $form = $('<form></form>');
    $form.attr('action', strAddress);
    $form.attr('method', 'post');
    $form.attr('target', strWindowName);
    $form.appendTo('body');

    var strNickname = $(`<input type="hidden" value=${astrNickname} name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value=${astrGroupID} name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${parseInt(aiClass)} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(aiPermission)} name="iPermission">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission);
    $form.submit();

});

$(document).on('click', '.removeagent', (event) => {

    let astrNickname = $(event.target).attr('strNickname');
    let astrGroupID = $(event.target).attr('strGroupID');
    let aiClass = $(event.target).attr('iClass');
    let aiPermission = $(event.target).attr('iPermission');

    console.log(`${astrGroupID}, ${astrNickname}, ${aiClass} ${aiPermission}`);

    $.ajax({
        url:'/manage_partner/request_removeagent',
        type:"POST",
        data: {
            strNickname:astrNickname,
            strGroupID:astrGroupID,
        },
        dataType: "json",
        success: function (data) {

            if ( data.result == 'OK' )
            {
                alert(strAlertComplete);
                location.reload();
            }
            else
            {
                alert(strAlertCantRemove);
            }
            console.log(data);
        }
    });
});

let GetPartnerSectionClass = (iSection, iCurrent) => {
    const cSection = parseInt(iSection);
    const cCurrent = parseInt(iCurrent);

    if ( cSection == cCurrent )
        return 'on';

    return '';
}

let GetPartnerSectionColor = (iSection, iCurrent) => {
    const cSection = parseInt(iSection);
    const cCurrent = parseInt(iCurrent);

    if ( cSection == cCurrent )
        return '#ffffff';

    return '#000000';

}

let SetPartnerHeader = (iSection, iClass) => {

    const cClass = parseInt(iClass);

    let tag = '';


    // if ( cClass <= EAgent.eAdmin )
    // {
    //     let subtag1 = 
    //     `
    //     <li class=${GetPartnerSectionClass(iSection, 0)}>
    //         <a href="#" style="color:${GetPartnerSectionColor(iSection, 0)};" id="partner_realtime">${strSubMenuRealtime}</a>
    //     </li>
    //     `;
    //     let subtag2 = `
    //     <li class=${GetPartnerSectionClass(iSection, 1)}>
    //         <a href="#" style="color:${GetPartnerSectionColor(iSection, 1)};" id="partner_record">${strSubMenuBettingResult}</a>
    //     </li>
    //     `;

    //     tag += subtag1 + subtag2;
    // }

    if ( cClass == EAgent.eHQ )
    {
        let subtag1 = 
        `
        <li class=${GetPartnerSectionClass(iSection, 2)}>
            <a href="#" style="color:${GetPartnerSectionColor(iSection, 2)};" id="partner_listvicehq">${strSubMenuViceHQList}</a>
        </li>
        `;

        tag += subtag1;
    }
    else if ( cClass == EAgent.eViceHQ )
    {
        let subtag1 = 
        `
        <li class=${GetPartnerSectionClass(iSection, 3)}>
            <a href="#" style="color:${GetPartnerSectionColor(iSection, 3)};" id="partner_listadmin">${strSubMenuAdminList}</a>
        </li>
        `;

        tag += subtag1;
    }
    else 
    {
        if ( cClass <= EAgent.eAdmin && cClass != EAgent.eViceHQ )
        {
            let subtag1 = 
            `
            <li class=${GetPartnerSectionClass(iSection, 4)}>
                <a href="#" style="color:${GetPartnerSectionColor(iSection, 4)};" id="partner_listproadmin">${strSubMenuProAdminList}</a>
            </li>
            `;
    
            tag += subtag1;
        }
        if ( cClass <= EAgent.eProAdmin && cClass != EAgent.eViceHQ )
        {
            let subtag1 = 
            `
            <li class=${GetPartnerSectionClass(iSection, 5)}>
                <a href="#" style="color:${GetPartnerSectionColor(iSection, 5)};" id="partner_listviceadmin">${strSubMenuViceAdminList}</a>
            </li>
            `;
            tag += subtag1;
        }
        if ( cClass <= EAgent.eViceAdmin && cClass != EAgent.eViceHQ )
        {
            let subtag1 = 
            `
            <li class=${GetPartnerSectionClass(iSection, 6)}>
                <a href="#" style="color:${GetPartnerSectionColor(iSection, 6)};" id="partner_listagent">${strSubMenuAgentList}</a>
            </li>
            `;
            tag += subtag1;
        }
        if ( cClass <= EAgent.eAgent && cClass != EAgent.eViceHQ )
        {
            let subtag1 = 
            `
            <li class=${GetPartnerSectionClass(iSection, 7)}>
                <a href="#" style="color:${GetPartnerSectionColor(iSection, 7)};" id="partner_listshop">${strSubMenuShopList}</a>
            </li>
            `;
            tag += subtag1;
        }

        if ( cClass <= EAgent.eAdmin )
        {
            let subtag1 = 
            `
            <li class=${GetPartnerSectionClass(iSection, 8)}>
                <a href="#" style="color:${GetPartnerSectionColor(iSection, 8)};" id="partner_listrealtimeuser">${strRealtimeOnlineUserList}</a>
            </li>
            `;
            tag += subtag1;
        }
    }

    if ( cClass == EAgent.eViceHQ )
    {
        let subtag1 = ``;
        subtag1 = 
        `
        <li class=${GetPartnerSectionClass(iSection, 8)}>
            <a href="#" style="color:${GetPartnerSectionColor(iSection, 8)};" id="partner_listrealtimeuser">${strRealtimeOnlineUserList}</a>
        </li>
        `;
        tag += subtag1;
    }

    if ( cClass > EAgent.eAdmin )
    {
        let subtag1 = ``;
        subtag1 =
            `
        <li class=${GetPartnerSectionClass(iSection, 8)}>
            <a href="#" style="color:${GetPartnerSectionColor(iSection, 8)};" id="partner_listrealtimeuser">접속자 현황</a>
        </li>
        `;
        tag += subtag1;
    }

    if ( cClass == EAgent.eAdmin || cClass == EAgent.eViceHQ )
    {
        let subtag1 = ``;
        subtag1 =
            `
            <li class=${GetPartnerSectionClass(iSection, 10)}>
                <a href="#" style="color:${GetPartnerSectionColor(iSection, 10)};" id="today_regist_list">당일등록현황</a>
            </li>
        `;
        tag += subtag1;
    }

    $('#partner_header').empty();
    $('#partner_header').append(tag);
}

$(document).on('click', '#setting_odds', ()=> {
    let input = prompt('암호입력');
    if (input == null) {
        return;
    } else if (input.length == 0) {
        alert(`암호 미입력`);
        return;
    }

    window.open('', 'popupSettingOdds', 'width=768, height=390, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/settingodds');
    $form.attr('method', 'post');
    $form.attr('target', 'popupSettingOdds');
    $form.appendTo('body');
    
    var strNickname = $(`<input type="hidden" value="${user.strNickname}" name="strNickname">`);
    var strGroupID = $(`<input type="hidden" value="${user.strGroupID}" name="strGroupID">`);
    var iClass = $(`<input type="hidden" value=${user.iClass} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${user.iPermission} name="iPermission">`);
    var pass = $(`<input type="hidden" value=${input} name="pass">`);

    $form.append(strNickname).append(strGroupID).append(iClass).append(iPermission).append(pass);
    $form.submit();

});