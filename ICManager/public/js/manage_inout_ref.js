
let RequestOverview = (bInput) => {

    const dateStart = $("#datepicker1").val();
    const dateEnd = $("#datepicker2").val();
    const strNickname = $("#strSearchNickname").val();
    const strAddress = '/manage_inout/request_inoutoverview';

    $.ajax({
        url:strAddress,
        type:"POST",
        data: {
            s_date:dateStart,
            e_date:dateEnd,
            strSearchNickname:strNickname,
            strGroupID:user.strGroupID,
            iClass: user.iClass
        },
        dataType: "json",
        success: function (obj) {

            let total = parseFloat(obj.input) - parseFloat(obj.output);
            let tag = 
            `
            <td style="background-color:#E7E6D2;height:60px;background-color:#E7E6D2;font-size:15px;">
            <font style="font-size:15px;color:black;">${obj.dateStart} ~ ${obj.dateEnd}</font></td>
            <td style="text-align:center;background-color:#E7E6D2;font-size:15px;color:blue;">${GetNumber(obj.input)}</td>
            <td style="text-align:center;background-color:#E7E6D2;font-size:15px;color:red;;">${GetNumber(obj.output)}</td>
            <td style="text-align:center;background-color:#E7E6D2;font-size:15px;color:${GetColor(total)}">${GetNumber(total)}</td>
            `;

            $('#inout_overview').empty();
            $('#inout_overview').append(tag);
        }
    });
}

let OnDocumentReady = (bInput) => {

    RequestOverview(bInput);
}

let OnCancel = (bInput, event) => {

    if ( confirm(strConfirmCancel) )
    {
        let tr = $(event.currentTarget).closest('tr');
        const id = tr.attr('name');
        let strAddress = '/manage_inout/request_outputstate';
        if ( bInput == true )
            strAddress = '/manage_inout/request_inputstate';
        $.ajax({
            url:strAddress,
            type:"POST",
            data: {
                type:2,
                id:id
            },
            dataType: "json",
            success: function (obj) {
                if ( obj.result == 'OK' )
                {
                    $(`#button_request_${id}`).remove();
                    $(`#button_standby_${id}`).remove();
                    $(`#button_cancel_${id}`).remove();
                    $(`#td_state_${id}`).append(`<font style="color:red;">${strCancel}</font>`);
                }
                else if ( obj.result == 'ERROR' )
                {
                    alert(strAlertErrorAlreadyComplete);
                    location.reload();
                }
            }
        });
    }
    location.reload();					
}


let OnRequest = (bInput, event) => {
    let tr = $(event.currentTarget).closest('tr');
    const id = tr.attr('name');
    let strAddress = '/manage_inout/request_outputstate';
    if ( bInput == true )
        strAddress = '/manage_inout/request_inputstate';
    
    $.ajax({
        url:strAddress,
        type:"POST",
        data: {
            type:0,
            id:id
        },
        dataType: "json",
        success: function (obj) {
    
            if ( obj.result == 'OK' )
            {
                $(`#button_request_${id}`).remove();
                $(`#td_state_${id}`).append(`<a href="#" class="btn_green standby" name="${id}" id="button_standby_${id}">${strStateStandby}</a>`);
            }
            else
            {
                alert(strAlertErrorAlreadyComplete);
                location.reload();
            }
        }
    });
    location.reload();					
}
    
let OnStandby = (bInput, event) => {
    let tr = $(event.currentTarget).closest('tr');
    const id = tr.attr('name');
    let strAddress = '/manage_inout/request_outputstate';
    if ( bInput == true )
        strAddress = '/manage_inout/request_inputstate';

    $.ajax({
        url:strAddress,
        type:"POST",
        data: {
            type:1,
            id:id
        },
        dataType: "json",
        success: function (obj) {
            if ( obj.result == 'OK' )
            {
                $(`#button_standby_${id}`).remove();
                $(`#button_cancel_${id}`).remove();
                $(`#td_state_${id}`).append(`<font style="color:blue;">${strStateComplete}</font>`);
                location.reload();
            }
            else if ( obj.result == 'FAIL1' )
            {
                alert(strAlertErrorNotEnoughMoney);
            }
            else if ( obj.result == 'FAIL2' )
            {
                alert(strAlertError);
            }
            else
            {
                alert(strAlertErrorAlreadyComplete);
                location.reload();
            }
        }
    });
}

let OnSave = (event) => {

    let tr = $(event.currentTarget).closest('tr');
    const id = tr.attr('name');
    const strID = tr.attr('nickname');
    const strMemo = $(`#memo_${id}`).val();

    $(`#memo_tx_${id}`).css({display: ""});
    $(`#memo_${id}`).css({width:"90%", display: "none"});
    $(`#button_memo_save_${id}`).css({display: "none"});

    $(`#memo_tx_${id}`).text(`${strMemo}`);
    $(`#memo_${id}`).text(`${strMemo}`);

    $.ajax({
        url:"/manage_inout/request_savememo",
        type:"POST",
        data: {
            type:1,
            id:id,
            strMemo:strMemo
        },
        dataType: "json",
        success: function (obj) {
            if (obj.result == 'OK') {
            } else {
                alert('저장 오류');
            }
        }
    });
}

let OnClickRequestCharge = (strNickname, strGroupID, iClass) => {
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
}

let OnClickRequestExchange = (strNickname, strGroupID, iClass, iForced) => {
    window.open('', 'popupExchange', 'width=768, height=512, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    let $form = $('<form></form>');
    $form.attr('action', '/manage_inout_popup/requestexchange');
    $form.attr('method', 'post');
    $form.attr('target', 'popupExchange');
    $form.appendTo('body');

    let idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
    let page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
    let category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);
    let forced = $(`<input type="hidden" value=${parseInt(iForced)} name="iForced">`);

    $form.append(idx).append(page).append(category).append(forced);
    $form.submit();
}

let SetInputList = (list, iRootClass) => {

    $('#input_list').empty();

    let iTotal = 0;

    for ( let i in list ) {

        let bgColor = '#FFFFFF';
        if ((list[i].iNewUser ?? 0) == 1) {
            bgColor = '#E7AD6C';
        }

        let strParent = list[i].strAdminNickname;

        if ( parseInt(user.iClass) == 3 )
            strParent = list[i].strPAdminNickname;
        else if ( parseInt(user.iClass) == 4 )
            strParent = list[i].strVAdminNickname;
        else if ( parseInt(user.iClass) == 5 )
            strParent = list[i].strAgentNickname;
        else if ( parseInt(user.iClass) == 6 )
            strParent = list[i].strShopNickname;

        let tagAccountOwner = '';
        if (iRootClass <= 3) {
            tagAccountOwner = `<td>${list[i].strAccountOwner}</td>`;
        }

        // 신규 가입 여부
        let tagNewUser = '';
        if ((list[i].iNewUser ?? 0) == 1) {
            tagNewUser = `<font style="color:red;font-size:15px;"> ❊ </font>`;
        }

        let tag = `
            <tr style="background-color:${bgColor};" name="${list[i].id}" nickname="${list[i].strID}">
            <td>${list[i].id}</td>
            <td>${strParent}</td>
            <td><a href="javascript:OnClickNickname('${list[i].strID}');"><font style="color:blue;">${GetClassNickName(list[i].iClass, list[i].strID)}</font></a>${tagNewUser}</td>
            ${tagAccountOwner}
            <td><font style="color:blue;">${list[i].iAmount.toLocaleString()}</font></td>`;
        
        if ( parseInt(user.iRootClass) <= 3 && user.iPermission != 100 ) {
            if ( list[i].eState == 'REQUEST' ) {
                tag += `<td><a href="#" class="btn_green request" name="${list[i].id}" id="button_request_${list[i].id}">입금신청</a></td>`;
            }
            else
                tag += '<td></td>';
        }
        else
            tag += '<td></td>';

        if ( parseInt(user.iRootClass) <= 3 && user.iPermission != 100 ) {
            if ( list[i].eState == 'STANDBY') {
                tag += `<td id="td_state_${list[i].id}"><a href="#" class="btn_green standby" name="${list[i].id}" id="button_standby_${list[i].id}">${strStateStandby}</a></td>`;
            }
            else if ( list[i].eState == 'COMPLETE' ) {
                const iP = list[i].strProcessNickname ?? '';
                const iR = list[i].strRequestNickname ?? '';
                const iOn = ((iP != '') && (iP == iR));
                const strChar = (iOn) ? `<font style="color:red;font-size:15px;"> ❊ </font>` : '';
                const strSChar = (iOn) ? `<font style="color:transparent;font-size:15px;"> ❊ </font>` : '';
                tag += `<td id="td_state_${list[i].id}">${strSChar}<font style="color:blue;">${strStateComplete}</font>${strChar}</td>`;
                iTotal += parseFloat(list[i].iAmount);
            } 
            else if ( list[i].eState == 'CANCEL' ) {
                tag += `<td id="td_state_${list[i].id}"><font style="color:red;">${strCancel}</font></td>`;
            }
            else
                tag += `<td id="td_state_${list[i].id}"></td>`;
        }
        else
        {
            if ( list[i].eState == 'COMPLETE' ) {
                const iP = list[i].strProcessNickname ?? '';
                const iR = list[i].strRequestNickname ?? '';
                const iOn = ((iP != '') && (iP == iR));
                const strChar = (iOn) ? `<font style="color:red;font-size:15px;"> ❊ </font>` : '';
                const strSChar = (iOn) ? `<font style="color:transparent;font-size:15px;"> ❊ </font>` : '';
                tag += `<td id="td_state_${list[i].id}">${strSChar}<font style="color:blue;">${strStateComplete}</font>${strChar}</td>`;
                iTotal += parseFloat(list[i].iAmount);
            } 
            else if ( list[i].eState == 'CANCEL' ) {
                tag += `<td id="td_state_${list[i].id}"><font style="color:red;">${strCancel}</font></td>`;
            }
            else
                tag += `<td id="td_state_${list[i].id}"></td>`;
        }

        let cdate = list[i].completedAt ?? '';
        if ( cdate == 'Invalid date' )
            cdate = '';

        tag += `
                <td>${list[i].createdAt ?? ''}</td>
                <td>${cdate}</td>`;

        if ( parseInt(user.iRootClass) <= 3 && user.iPermission != 100 ) {
            if ( list[i].eState == 'REQUEST' || list[i].eState == 'STANDBY' ) {
                tag += `<td><a href="#" class="btn_red cancel" name="${list[i].id}" id="button_cancel_${list[i].id}">${strCancel}</a></td>`;
            } else {
                tag += `<td></td>`;
            }
        }
        else {
            tag += `<td></td>`;
        }

        if ( parseInt(user.iRootClass) <= 4 ) {
            let memo = list[i].strMemo;
            if ( memo == null )
                list[i].strMemo = '';
            if ( parseInt(user.iRootClass) <= 3 && user.iPermission != 100 ) {
                tag += `<td id="input_memo" listid="${list[i].id}">
                <p id="memo_tx_${list[i].id}" style="color: black;"> ${list[i].strMemo} </p>
                <input type="text" style="width:90%; display:none" id="memo_${list[i].id}" value="${list[i].strMemo}" />
                <a href="#" style="display:none" class="btn_red save" id="button_memo_save_${list[i].id}">${strSave}</a>
                </td>`;
            } else {
                tag += `<td id="input_memo" listid="${list[i].id}">
                <p id="memo_tx_${list[i].id}" style="color: black;"> ${list[i].strMemo} </p>
                </td>`;
            }  
        }

        if (parseInt(user.iRootClass) <= 3) {
            tag += `<td id="bank_info"">
                <p style="color: black;">${list[i].strBankName}(${list[i].strUserAccountOwner})</p>
                </td>`;
        }

        tag += '</tr>';
        $('#input_list').append(tag);
        checkBlockCharSpecial2(`#memo_${list[i].id}`);
    }
    //  calculate total
    let colspan = (iRootClass <= 3) ? 4 : 3;
    let subtag = '';
    if (parseInt(user.iRootClass) <= 4 ) {
        subtag = `<td></td>`;
        if (parseInt(user.iRootClass) <= 3) {
            subtag = `<td></td><td></td>`;
        }
    }


    tag = `
        <tr style="font-weight: bold;">
        <td colspan="${colspan}">${strTotal}</td>
        <td><font style="color:blue;">${iTotal.toLocaleString()}</font></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        ${subtag}
        </tr>
        `;
    $('#input_list').append(tag);
}


let SetOutputList = (list, iRootClass) => {

    $('#output_list').empty();

    let iTotal = 0;

    for ( var i in list ) {

        let strParent = list[i].strAdminNickname;

        if ( user.iClass == 3 )
            strParent = list[i].strPAdminNickname;
        else if ( user.iClass == 4 )
            strParent = list[i].strVAdminNickname;
        else if ( user.iClass == 5 )
            strParent = list[i].strAgentNickname;
        else if ( user.iClass == 6 )
            strParent = list[i].strShopNickname;

        let tagbank = '';
        if (parseInt(iRootClass) <= 3) {
            tagbank = `
                <td>${list[i].strBankName}</td>
                <td>${list[i].strAccountNumber}</td>
                <td>${list[i].strAccountOwner}</td>
            `;
        }

        let tag = `

            <tr name="${list[i].id}" nickname="${list[i].strID}">
            <td>${list[i].id}</td>
            <td>${strParent}</td>
            <td><a href="javascript:OnClickNickname('${list[i].strID}');"><font style="color:blue;">${GetClassNickName(list[i].iClass, list[i].strID)}</font></a></td>
            ${tagbank}
            <td><font style="color:red;">${list[i].iAmount.toLocaleString()}</font></td>`;

            if ( user.iRootClass <= 3 && user.iPermission != 100 ) {
                if ( list[i].eState == 'REQUEST' ) {
                    tag += `<td><a href="#" class="btn_green request" name="${list[i].id}" id="button_request_${list[i].id}">출금신청</a></td>`;
                } else
                tag += '<td></td>';
            }
            else
                tag += '<td></td>';

            if ( user.iRootClass <= 3 && user.iPermission != 100 ) {
                if ( list[i].eState == 'STANDBY' ) {
                    tag += `<td id="td_state_${list[i].id}"><a href="#" class="btn_green standby" name="${list[i].id}" id="button_standby_${list[i].id}">${strStateStandby}</a></td>`;
                }
                else if ( list[i].eState == 'COMPLETE' ) {
                    const iP = list[i].strProcessNickname ?? '';
                    const iR = list[i].strRequestNickname ?? '';
                    const iOn = ((iP != '') && (iP == iR));
                    const strChar = (iOn) ? `<font style="color:red;font-size:15px;"> ❊ </font>` : '';
                    const strSChar = (iOn) ? `<font style="color:transparent;font-size:15px;"> ❊ </font>` : '';
                    tag += `<td id="td_state_${list[i].id}">${strSChar}<font style="color:blue;">${strStateComplete}</font>${strChar}</td>`;
                    iTotal += parseFloat(list[i].iAmount);
                } 
                else if ( list[i].eState == 'CANCEL' )
                    tag += `<td id="td_state_${list[i].id}"><font style="color:red;">${strCancel}</font></td>`;
                else
                    tag += `<td id="td_state_${list[i].id}"></td>`;
            }
            else{
                if ( list[i].eState == 'COMPLETE' ) {
                    const iP = list[i].strProcessNickname ?? '';
                    const iR = list[i].strRequestNickname ?? '';
                    const iOn = ((iP != '') && (iP == iR));
                    const strChar = (iOn) ? `<font style="color:red;font-size:15px;"> ❊ </font>` : '';
                    const strSChar = (iOn) ? `<font style="color:transparent;font-size:15px;"> ❊ </font>` : '';
                    tag += `<td id="td_state_${list[i].id}">${strSChar}<font style="color:blue;">${strStateComplete}</font>${strChar}</td>`;
    
                    iTotal += parseFloat(list[i].iAmount);
                } 
                else if ( list[i].eState == 'CANCEL' ) {
                    tag += `<td id="td_state_${list[i].id}"><font style="color:red;">${strCancel}</font></td>`;
                }
                else
                    tag += `<td id="td_state_${list[i].id}"></td>`;
            }

            let cdate = list[i].completedAt ?? '';
            if ( cdate == 'Invalid date' )
                cdate = '';

            tag += `
                    <td>${list[i].createdAt ?? ''}</td>
                    <td>${cdate}</td>`;

            if ( user.iRootClass <= 3 && user.iPermission != 100 ) {
                if ( list[i].eState == 'REQUEST' || list[i].eState == 'STANDBY' ) {
                    tag += `<td><a href="#" class="btn_red cancel" name="${list[i].id}" id="button_cancel_${list[i].id}">${strCancel}</a></td>`;
                }
                else {
                    tag += `<td></td>`;
                }
            }
            else {
                tag += `<td></td>`;
            }

            if ( user.iRootClass <= 4 )
            {
                let memo = list[i].strMemo;
                if ( memo == null )
                list[i].strMemo = '';
                if ( user.iRootClass <= 3 && user.iPermission != 100 ) {
                    tag += `<td id="output_memo" listid="${list[i].id}">
                    <p id="memo_tx_${list[i].id}" style="color: black;"> ${list[i].strMemo} </p>
                    <input type="text" style="width:90%; display:none" id="memo_${list[i].id}" value="${list[i].strMemo}" />
                    <a href="#" style="display:none" class="btn_red save" name="${list[i].id}" id="button_memo_save_${list[i].id}">${strSave}</a>
                    </td>`;
                } else {
                    tag += `<td id="output_memo" listid="${list[i].id}">
                    <p id="memo_tx_${list[i].id}" style="color: black;"> ${list[i].strMemo} </p>
                    </td>`;
                }
            }

            tag += '</tr>';

            $('#output_list').append(tag);
        checkBlockCharSpecial2(`#memo_${list[i].id}`);
        }

        //  calculate total
        let colspan = (iRootClass <= 3) ? 6 : 3;
        let subtag = '';
        if (parseInt(user.iRootClass) <= 4 ) {
            subtag = `<td></td>`;
        }
        tag = `
            <tr>
            <tr style="font-weight: bold;">
            <td colspan="${colspan}">${strTotal}</td>
            <td><font style="color:red;">${GetNumber(iTotal)}</font></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            ${subtag}
            </tr>
        `;
        $('#output_list').append(tag);
    }



let OnClickMemo = (id) => {
    for (let i=0; i < list.length; i++) {
        let memo_id = `memo_${list[i].id}`;
        let memo_tx_id = `memo_tx_${list[i].id}`;
        let button_memo_save = `button_memo_save_${list[i].id}`;
        if (list[i].id==id) {
            document.getElementById(memo_id).style = "width:80%";
            document.getElementById(memo_tx_id).style = 'display:none';
            document.getElementById(button_memo_save).style = "height:80%;";
        } else {
            document.getElementById(memo_id).style = 'width:80%; display:none';
            document.getElementById(memo_tx_id).style = '';
            document.getElementById(button_memo_save).style = "display:none";
        }
    }
}

let OnClickNickname = (strNickname) => {
    $.ajax({
        type:'post',
        url: "/manage_setting/request_agentinfo",
        context: document.body,
        data:{strNickname:strNickname},
        success:function(data) {
            if ( data.result == 'OK' )
            {
                OnClickUser(data.data.strNickname, data.data.strGroupID, data.data.iClass);
            }
            else if (data.result == 'FAIL')
            {
                alert(data.msg);
            }
        }
    });
}


let OnClickUser = (strNickname, strGroupID, iClass) => {

    if ( iClass == 8 )
    {
        //  User Popup

        console.log(strNickname);
        console.log(strGroupID);
        console.log(iClass);

        let strAddress = '/manage_user_popup/output';
        window.open('', 'popupInoutAgent', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

        var $form = $('<form></form>');
        $form.attr('action', strAddress);
        $form.attr('method', 'post');
        $form.attr('target', 'popupInoutAgent');
        $form.appendTo('body');

        var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
        var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
        var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

        $form.append(idx).append(page).append(category);
        $form.submit();
    }
    else
    {
        //  Agent Popup
        window.open('', 'popupInoutAgent', 'width=1280, height=720, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
        // $("#Input1_"+strNickname).val(strNickname);
        // $("#Form_"+strNickname).submit();
        // console.log($("#Input1_"+strNickname).val());

        var $form = $('<form></form>');
        //$form.attr('action', '/manage_partner_popup/userlist');
        $form.attr('action', '/manage_partner_popup/agentinfo');
        $form.attr('method', 'post');
        $form.attr('target', 'popupInoutAgent');
        $form.appendTo('body');

        var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
        var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
        var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

        $form.append(idx).append(page).append(category);
        $form.submit();
    }
}
