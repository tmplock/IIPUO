let parentenablelist = [];

let bCheckID    = false;
let bCheckNickname = false;

let strCheckID    = '';
let strCheckNickname = '';

let strAutoID = '';
let strAutoNickname = '';

let bCheckAutoRegister = false;
let bCheckIDOrNicknameAutoRegister    = false;
let bUsingPC = false;
let bCheckPassNewUser = true;

let RequestParentEnableList = (strNickname, strGroupID, iClass, iRegisterClass, iPermission) => {
    $.ajax(
        {
            type:'post',
            url: "/manage_partner_popup/request_parentenablelist",
            context: document.body,
            data:{strNickname:strNickname, strGroupID:strGroupID, iClass:iClass, iRegisterClass:iRegisterClass, iPermission:iPermission},
    
            success:function(data) {

                parentenablelist = [];
                console.log(data);

                $('#parentenable_list').empty();
                for ( let i in data ) {

                    parentenablelist.push(data[i]);

                    let tag = `<option value="${data[i].strNickname}">${data[i].strNickname}</option>`;

                    if ( i == 0 ) {
                        SetParentValues(data[i].strNickname);
                    }

                    $('#parentenable_list').append(tag);
                }
                
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}

let SetParentValues = (strNickname) => {

    for ( let i in parentenablelist ) {
        if ( parentenablelist[i].strNickname == strNickname ) {

            if ( EAgent.eProAdmin == parentenablelist[i].iClass )
            {
                $('#fRollingSlot').val(0);
                $('#fRollingBaccarat').val(0);
                $('#fRollingUnderOver').val(0);
            }
            else if ( parentenablelist[i].iClass == EAgent.eShop )
            {
                $('#fRollingSlot').val(0);
                $('#fRollingBaccarat').val(0);
                $('#fRollingUnderOver').val(0);
            }
            else
            {
                $('#fRollingSlot').val(0);
                $('#fRollingBaccarat').val(0);
                $('#fRollingUnderOver').val(0);

                $('#fSettleBaccarat').val(0);
                $('#fSettleResetBaccarat').val(0);
            }

            $('#strParentGroupID').val(parentenablelist[i].strGroupID);
            $('#iParentClass').val(parentenablelist[i].iClass);
            $('#iParentPermission').val(parentenablelist[i].iPermission);
            $('#iParentID').val(parentenablelist[i].id);
        }
    }
}

let OnChangeParent = () => {
    const parent = $('#parentenable_list').val();

    SetParentValues(parent);
    //console.log(parent);
}

$(document).on('click', '#check_id', (event) => {

    const strID = $('#strID').val();
    console.log(strID);

    RequestConfirmAgentID(strID);
})

let RequestConfirmAgentID = (strID) => {
    if (!isValidationOnlyEngOrNumber(strID)) {
        alert('아이디는 영문, 숫자만 가능합니다');
        return;
    }

    $.ajax(
        {
            type:'post',
            url: "/manage_partner_popup/request_confirmagentid",
            context: document.body,
            data:{strID:strID},
    
            success:function(data) {

                console.log(data);
                if ( data == 'OK' ) {
                    bCheckID = true;
                    strCheckID = strID;
                    alert(strAlertEnableToUse);
                }
                else {
                    bCheckID = false;
                    strCheckID = '';
                    alert(strAlertDisableToUse);

                }
                
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}

$(document).on('click', '#check_nickname', (event) => {

    const strNickname = $('#strNickname').val();
    console.log(strNickname);

    RequestConfirmAgentNickname(strNickname);
})

let RequestConfirmAgentNickname = (strNickname) => {
    if (!isValidationOnlyEngOrKrOrNumber(strNickname)) {
        alert('닉네임은 한글, 영문, 숫자만 가능합니다');
        return;
    }

    $.ajax(
        {
            type:'post',
            url: "/manage_partner_popup/request_confirmagentnickname",
            context: document.body,
            data:{strNickname:strNickname},
    
            success:function(data) {

                console.log(data);
                if ( data == 'OK' ) {
                    bCheckNickname  = true;
                    strCheckNickname = strNickname;
                    alert(strAlertEnableToUse);
                }
                else {
                    bCheckNickname  = false;
                    strCheckNickname = '';
                    alert(strAlertDisableToUse);
                }
                
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}

let RequestConfirmAutoRegisterValue = () => {
    let id = $('#strID').val();
    let nickname = $('#strNickname').val();

    if (nickname == null || nickname == '' || nickname == undefined) {
        alert('닉네임을 먼저 입력해주세요');
        return;
    }
    if (id == null || id == '' || id == undefined) {
        alert('아이디를 먼저 입력해주세요');
        return;
    }
    let number = $('#auto_register_number').val();
    try {
        number = parseInt(number);
        if (number < 2) {
            alert('자동생성 값은 1보다 커야 합니다');
            return;
        }
    } catch (err) {
        alert('자동생성 값을 확인해주세요');
        return;
    }

    let idList = GetIDList(id, number);
    let nicknameList = GetNicknameList(nickname, number);

    let msg = '';
    for (let i = 0; i<idList.length; i++) {
        if (msg == '') {
            msg = `${idList[i]}(${nicknameList[i]})`;
        } else {
            msg = `${msg}, ${idList[i]}(${nicknameList[i]})`;
        }
    }

    let ok = confirm(`생성될 아이디(닉네임)을 확인해주세요\n${msg}\n중복확인을 위해서 확인을 눌러주세요`);
    if (ok == null || ok == false) {
        return;
    }

    $.ajax(
        {
            type:'post',
            url: "/manage_partner_popup/request_confirm_auto_register_value",
            context: document.body,
            data:{strNickname:nickname, strID:id, number:number},
            success:function(data) {
                if ( data.result == 'OK' ) {
                    strAutoID = id;
                    strAutoNickname = nickname;

                    bCheckIDOrNicknameAutoRegister = true;
                    alert(strAlertEnableToUse);
                }
                else {
                    bCheckIDOrNicknameAutoRegister = false;
                    alert(data.msg);
                }

            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}


let GetIDList = (id, number) => {
    let numberId = "";
    for (let i = id.length - 1; i >= 0; i--) {
        if (Number.isNaN(parseInt(id[i]))) {
            if (numberId == '') {
                numberId = '1';
            }
            break;
        } else {
            numberId = `${id[i]}${numberId}`;
        }
    }
    let strID = id.replace(numberId, '');
    numberId = parseInt(numberId);

    // 체크 항목 리스트 만들기
    let idList = [];
    for (let i = 0; i<number; i++) {
        idList.push(`${strID}${numberId+i}`);
    }
    return idList;
}
let GetNicknameList = (nickname, number) => {
    let numberNickname = '';
    for (let i = nickname.length - 1; i >= 0; i--) {
        if (Number.isNaN(parseInt(nickname[i]))) {
            if (numberNickname == '') {
                numberNickname = '1';
            }
            break;
        } else {
            numberNickname = `${nickname[i]}${numberNickname}`;
        }
    }
    let strNickname = nickname.replace(numberNickname, '');
    numberNickname = parseInt(numberNickname);

    // 체크 항목 리스트 만들기
    let nicknameList = [];
    for (let i = 0; i<number; i++) {
        nicknameList.push(`${strNickname}${numberNickname+i}`);
    }
    return nicknameList;
}


let replaceCharacter = (str, index, char) => {

    let array = str.split('');
    array.splice(index, 1);
    array.splice(index, 0, char);

    let ret = array.toString();
    return ret.replace(/,/g, "");
}

let Submit = (bClose) => {

    if ( false == bCheckID )
    {
        alert(strAlertNeedToDuplicationCheckID);
        return;
    }

    if ( false == bCheckNickname )
    {
        alert(strAlertNeedToDuplicationCheckNickname);
        return;
    }

    let iAutoRegisterNumber = 0;
    if (bCheckAutoRegister == true) {
        try {
            iAutoRegisterNumber = $('#auto_register_number').val();
            iAutoRegisterNumber = parseInt(iAutoRegisterNumber);
            iAutoRegisterNumber = Number.isNaN(iAutoRegisterNumber) ? 0 : iAutoRegisterNumber;
            if (iAutoRegisterNumber <= 1) {
                alert('자동생성 숫자는 1보다 커야합니다');
                return;
            }
        } catch (err) {
            alert('자동생성 입력값을 확인해주세요');
            return;
        }
    }

    if (bCheckAutoRegister == true && bCheckIDOrNicknameAutoRegister == false) {
        alert('자동 생성 중복 체크가 필요 합니다.');
        return;
    }

    const strParentNickname = $('#parentenable_list').val();
    const strParentGroupID = $('#strParentGroupID').val();
    const iParentClass = $('#iParentClass').val();
    const iParentPermission = $('#iParentPermission').val();
    const iParentID = $('#iParentID').val();

    const strPassword = $('#strPassword').val();
    const strPasswordConfirm = $('#strPasswordConfirm').val();
    const strID = $('#strID').val();

    if ( bCheckID == true && strCheckID != strID ) {
        bCheckID == false;
        bCheckIDOrNicknameAutoRegister = false;
        alert('중복체크한 아이디가 틀립니다. 다시 중복체크를 해주세요');
        return;
    }

    const strNickname = $('#strNickname').val();
    if ( bCheckNickname == true && strCheckNickname != strNickname ) {
        bCheckNickname == false;
        bCheckIDOrNicknameAutoRegister = false;
        alert('중복체크한 닉네임이 틀립니다. 다시 중복체크를 해주세요');
        return;
    }

    const strBankName = $('#strBankName').val();
    const strAccountNumber = $('#strAccountNumber').val();
    const strAccountOwner = $('#strAccountOwner').val();
    const strMobileNo = $('#strMobileNo').val();

    let fSlotR = 0;
    let fBaccaratR = 0;
    let fUnderOverR = 0;
    let fSettleBaccarat = 0;
    let fSettleResetBaccarat = 0;

    let strPermissionInput = $('#using_input_permission').attr('checked');
    if ( strPermissionInput != undefined ) {
        strPermissionInput = 1;
    } else {
        strPermissionInput = 0;
    }
    let strPBOptionCode = '00000000';
    let strOptionCode = '11000000';

    if (iParentClass > 1) {
        fSlotR = parseFloat($('#fRollingSlot').val());
        fSlotR = Number.isNaN(fSlotR) ? 0 : fSlotR;
        fBaccaratR = parseFloat($('#fRollingBaccarat').val());
        fBaccaratR = Number.isNaN(fBaccaratR) ? 0 : fBaccaratR;
        fUnderOverR = parseFloat($('#fRollingUnderOver').val());
        fUnderOverR = Number.isNaN(fUnderOverR) ? 0 : fUnderOverR;
        fSettleBaccarat = parseFloat($('#fSettleBaccarat').val());
        fSettleBaccarat = Number.isNaN(fSettleBaccarat) ? 0 : fSettleBaccarat;
        fSettleResetBaccarat = parseFloat($('#fSettleResetBaccarat').val());
        fSettleResetBaccarat = Number.isNaN(fSettleResetBaccarat) ? 0 : fSettleResetBaccarat;

        let strUsingInput = $('#using_input').attr('checked');
        let strUsingOutput = $('#using_output').attr('checked');
        let strUsingPC = $('#using_pc').attr('checked');

        if ( strUsingPC != undefined ) {
            strOptionCode = '00100000';
        } else {
            if ( strUsingInput != undefined ) {
                strOptionCode = replaceCharacter(strOptionCode, 0, '1');
            } else {
                strOptionCode = replaceCharacter(strOptionCode, 0, '0');
            }
            if ( strUsingOutput != undefined ) {
                strOptionCode = replaceCharacter(strOptionCode, 1, '1');
            } else {
                strOptionCode = replaceCharacter(strOptionCode, 1, '0');
            }
        }

        if(fSlotR == undefined || fSlotR == null || fBaccaratR == undefined || fBaccaratR == null || fUnderOverR == undefined || fUnderOverR == null)
        {
            alert(strAlertErrorRollingValue);
            return;
        }

        if (iParentClass <= 5) {
            if(fSettleBaccarat == undefined || fSettleResetBaccarat == null)
            {
                alert(strAlertErrorSettleValue);
                return;
            }
        }
    }
    if( strPassword == undefined || strPassword == null || strPasswordConfirm == undefined || strPasswordConfirm == null ){
        alert(strAlertDifferentPasswordAndConfirm);
        return;
    }
    else
    {
        if ( strPassword != strPasswordConfirm )
        {
            alert(strAlertDifferentPasswordAndConfirm);
            return;
        }
    }
    console.log(`${strParentGroupID}, ${iParentClass}`);
    $.ajax(
        {
            type:'post',
            url: "/manage_partner_popup/request_register",
            context: document.body,
            data:{
                strParentNickname:strParentNickname,
                strParentGroupID:strParentGroupID,
                iParentClass:iParentClass,
                iParentPermission:iParentPermission,
                iParentID:iParentID,
                strID:strID,
                strPassword:strPassword,
                strNickname:strNickname,
                strBankName:strBankName,
                strAccountNumber:strAccountNumber,
                strAccountOwner:strAccountOwner,
                strMobileNo:strMobileNo,
                fSlotR:fSlotR,
                fBaccaratR:fBaccaratR,
                fUnderOverR:fUnderOverR,
                fSettleBaccarat:fSettleBaccarat,
                fSettleResetBaccarat:fSettleResetBaccarat,
                strOptionCode:strOptionCode,
                iPermission:strPermissionInput,
                iCheckAutoRegister:bCheckAutoRegister ? 1 : 0,
                iAutoRegisterNumber:iAutoRegisterNumber,
                iPassCheckNewUser:bCheckPassNewUser ? 1 : 0
            },
    
            success:function(data) {

                //alert(data.string);
                if ( data.result == 'OK' )
                {
                    alert(strAlertComplete);
                    opener.location.reload();
                    if (bClose == true) {
                        self.close();
                    } else {
                        OnClickRemoveInput(true);
                    }
                }
                else
                {
                    if ( data.error == 'Rolling')
                    {
                        alert(strAlertErrorRollingValue);
                    }                        
                    else if ( data.error == 'Settle' )
                    {
                        alert(strAlertErrorSettleValue);
                    }
                    else if ( data.error == 'PB' )
                    {
                        alert(data.string);
                    }
                    else
                    {
                        alert(data.string);
                    }
                }                
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}

let OnClickAutoRegister = () => {
    if (bCheckAutoRegister == true) {
        bCheckAutoRegister = false;
        bCheckIDOrNicknameAutoRegister = false;
        SetAutoRegister(false);
    } else {
        bCheckAutoRegister = true;
        SetAutoRegister(true);
    }
}

let SetAutoRegister = (bEnable) => {
    if (bEnable) {
        $('#auto_register_number').show();
        $('#auto_register_msg').show();
        $('#check_auto_register').show();
    } else {
        $('#auto_register_number').hide();
        $('#auto_register_msg').hide();
        $('#check_auto_register').hide();

        $('#auto_register_number').val('');
        $('#auto_register_msg').val('');
        $('#check_auto_register').val('');
        $('#checkbox_auto_register').attr('checked', false);
    }
}

let SetUsingPC = (iClass) => {
    if (iClass == 8) {
        $('#using_pc').attr('checked', false);
        $('#using_pc').click((e) => {
            var checked = $('#using_pc').is(':checked');

            if (checked) {
                bUsingPC = true;
                ['#strAccountOwner', '#strBankName', '#strAccountNumber'].forEach(item => {
                    $(item).get(0).disabled = true;
                });
                $('#strAccountOwner').val('PC방');
                $('#strBankName').val('PC방');
                $('#strAccountNumber').val('0000');
            } else {
                bUsingPC = false;
                ['#strAccountOwner', '#strBankName', '#strAccountNumber'].forEach(item => {
                    $(item).get(0).disabled = false;
                });
                $('#strAccountOwner').val('');
                $('#strBankName').val('');
                $('#strAccountNumber').val('');
            }
        });
    }
}

let SetUsingPassNewUser = (iClass) => {
    if (iClass == 8 || iClass == 7) {
        try {
            $('#using_pass_new_user').attr('checked', true);
            $('#using_pass_new_user').click((e) => {
                var checked = $('#using_pass_new_user').is(':checked');
                if (checked) {
                    bCheckPassNewUser = true;
                } else {
                    bCheckPassNewUser = false;
                }
            });
        } catch (err) {
            $('#using_pass_new_user').attr('checked', true);
            bCheckPassNewUser = true;
        }
    } else {
        $('#using_pass_new_user').attr('checked', true);
        bCheckPassNewUser = true;
    }
}

let iSettleDays = -1;
let SetRadioSettleDays = (days) => {
    iSettleDays = days;
    $('input[name="radio_settle_days"]').removeAttr('checked');
    $('input[name="radio_settle_days"]').filter(`[value=${iSettleDays}]`).prop("checked", true);
    $('input[name="radio_settle_days"]').click((e) => {
        iSettleDays = e.val();
    });
}
let OnClickSettleDays = (days) => {
    iSettleDays = days;
}

let iSettleType = -1;
let SetRadioSettleType = (type) => {
    iSettleType = type;
    $('input[name="radio_settle_type"]').removeAttr('checked');
    $('input[name="radio_settle_type"]').filter(`[value=${iSettleType}]`).prop("checked", true);
    $('input[name="radio_settle_type"]').click((e) => {
        iSettleType = e.val();
    });
}
let OnClickSettleType = (type) => {
    iSettleType = type;
}
