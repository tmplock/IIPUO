let parentenablelist = [];

let bCheckID    = false;
let bCheckNickname = false;

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
                        // $('#fRollingSlot').val(data[i].fSlotR);
                        // $('#fRollingBaccarat').val(data[i].fBaccaratR);
                        // $('#fRollingUnderover').val(data[i].fUnderOverR);

                        // $('#fSettleSlot').val(data[i].fSettleSlot);
                        // $('#fSettleBaccarat').val(data[i].fSettleBaccarat);
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
                $('#fRollingSlot').val(parentenablelist[i].fSlotR);
                $('#fRollingBaccarat').val(parentenablelist[i].fBaccaratR);
                $('#fRollingUnderOver').val(parentenablelist[i].fUnderOverR);

                $('#fRollingPB').val(parentenablelist[i].fPBR);
                $('#fRollingPBSingle').val(parentenablelist[i].fPBSingleR);
                $('#fRollingPBDouble').val(parentenablelist[i].fPBDoubleR);
                $('#fRollingPBTriple').val(parentenablelist[i].fPBTripleR);

                $('#fSettleSlot').val(parentenablelist[i].fSettleSlot);
                $('#fSettleBaccarat').val(parentenablelist[i].fSettleBaccarat);

                $('#fSettlePBA').val(parentenablelist[i].fSettlePBA);
                $('#fSettlePBB').val(parentenablelist[i].fSettlePBB);
            }
            else if ( parentenablelist[i].iClass == EAgent.eShop )
            {
                // $('#fRollingSlot').val(0);
                // $('#fRollingBaccarat').val(0);
                // $('#fRollingUnderOver').val(0);
    
                // $('#fSettleSlot').val(0);
                // $('#fSettleBaccarat').val(0);
            }
            else
            {
                // $('#fRollingSlot').val(parentenablelist[i].fSlotR);
                // $('#fRollingBaccarat').val(parentenablelist[i].fBaccaratR);
                // $('#fRollingUnderOver').val(parentenablelist[i].fUnderOverR);

                // $('#fRollingPB').val(parentenablelist[i].fPBR);
                // $('#fRollingPBSingle').val(parentenablelist[i].fPBSingleR);
                // $('#fRollingPBDouble').val(parentenablelist[i].fPBDoubleR);
                // $('#fRollingPBTriple').val(parentenablelist[i].fPBTripleR);
    
                // $('#fSettleSlot').val(parentenablelist[i].fSettleSlot);
                // $('#fSettleBaccarat').val(parentenablelist[i].fSettleBaccarat);
                
                // $('#fSettlePBA').val(parentenablelist[i].fSettlePBA);
                // $('#fSettlePBB').val(parentenablelist[i].fSettlePBB);

                $('#fRollingSlot').val(0);
                $('#fRollingBaccarat').val(0);
                $('#fRollingUnderOver').val(0);

                $('#fRollingPB').val(0);
                $('#fRollingPBSingle').val(0);
                $('#fRollingPBDouble').val(0);
                $('#fRollingPBTriple').val(0);
    
                $('#fSettleSlot').val(0);
                $('#fSettleBaccarat').val(0);
                
                $('#fSettlePBA').val(0);
                $('#fSettlePBB').val(0);
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

    var input = document.getElementById('strID');
    var re = /^[a-zA-Z0-9]{5,12}$/;  // 정규 표현식: 5자 이상의 알파벳 대소문자와 숫자만 허용
    if (!re.test(input.value)) {  // 입력된 값이 정규 표현식에 맞지 않으면
        alert('아이디는 영문/숫자로 5~12 자리로 설정해주시고 특수문자는 사용할 수 없습니다.');
        input.value = '';
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
                    alert(strAlertEnableToUse);
                }
                else {
                    bCheckID = false;
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

    var input = document.getElementById('strNickname');
    var re = /^[A-Za-z0-9가-힣]{2,10}$/;  // 정규 표현식: 2자 이상~10자 이하 알파벳 대소문자,한글,숫자만 허용
    if (!re.test(input.value)) {  // 입력된 값이 정규 표현식에 맞지 않으면
        alert('닉네임은 영문/한글/숫자로 2~10자리수로 설정해주시고 특수문자는 사용할 수 없습니다.');
        input.value = '';
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
                    alert(strAlertEnableToUse);
                }
                else {
                    bCheckNickname  = false;
                    alert(strAlertDisableToUse);
                }
                
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}

let replaceCharacter = (str, index, char) => {

    let array = str.split('');
    array.splice(index, 1);
    array.splice(index, 0, char);

    let ret = array.toString();
    return ret.replace(/,/g, "");
}

let Submit = () => {

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

    const strParentNickname = $('#parentenable_list').val();
    const strParentGroupID = $('#strParentGroupID').val();
    const iParentClass = $('#iParentClass').val();
    const iParentPermission = $('#iParentPermission').val();
    const iParentID = $('#iParentID').val();

    const strPassword = $('#strPassword').val();
    const strPasswordConfirm = $('#strPasswordConfirm').val();
    const strID = $('#strID').val();
    const strNickname = $('#strNickname').val();
    const strBankName = $('#strBankName').val();
    const strAccountNumber = $('#strAccountNumber').val();
    const strAccountOwner = $('#strAccountOwner').val();
    const strMobileNo = $('#strMobileNo').val();
    //const strAccountPassword = $('#strAccountPassword').val();
    const strAccountPassword = '1111';

    let strPermissionInput = $('#using_input_permission').attr('checked');
    if ( strPermissionInput != undefined ) {
        strPermissionInput = 1;
    } else {
        strPermissionInput = 0;
    }

    let fSlotR = 0;
    let fBaccaratR = 0;
    let fUnderOverR = 0;
    let fPBR = 0;
    let fPBSingleR = 0;
    let fPBDoubleR = 0;
    let fPBTripleR = 0;
    let fSettleBaccarat = 0;
    let fSettleSlot = 0;
    let fSettlePBA = 0;
    let fSettlePBB = 0;

    let strPBOptionCode = '00000000';
    let strOptionCode = '11000000';

    let iPBLimit = $('#iPBLimit').val();
    let iPBSingleLimit = $('#iPBSingleLimit').val();
    let iPBDoubleLimit = $('#iPBDoubleLimit').val();
    let iPBTripleLimit = $('#iPBTripleLimit').val();

    let value = $("#strPowerballType").val();
    if ( value == 'A' )
        strPBOptionCode = replaceCharacter(strPBOptionCode, 0, '0');
    else
        strPBOptionCode = replaceCharacter(strPBOptionCode, 0, '1');

    let bSingle = $('#using_single').attr('checked');
    if ( bSingle != undefined )
        strPBOptionCode = replaceCharacter(strPBOptionCode, 1, '1');
    else
        strPBOptionCode = replaceCharacter(strPBOptionCode, 1, '0');

    let bDouble = $('#using_double').attr('checked');
    if ( bDouble != undefined )
        strPBOptionCode = replaceCharacter(strPBOptionCode, 2, '1');
    else
        strPBOptionCode = replaceCharacter(strPBOptionCode, 2, '0');

    let bTriple = $('#using_triple').attr('checked');
    if ( bTriple != undefined )
        strPBOptionCode = replaceCharacter(strPBOptionCode, 3, '1');
    else
        strPBOptionCode = replaceCharacter(strPBOptionCode, 3, '0');

    //
    let strUsingInput = $('#using_input').attr('checked');
    let strUsingOutput = $('#using_output').attr('checked');

    //let strOptionCode = agent.strOptionCode.toString();
    if ( strUsingInput != undefined ) {
        strOptionCode = replaceCharacter(strOptionCode, 0, '1');

        console.log(`1 ${strOptionCode}`);
    }
    else {
        strOptionCode = replaceCharacter(strOptionCode, 0, '0');

        console.log(`2 ${strOptionCode}`);
    }
    if ( strUsingOutput != undefined ) {
        strOptionCode = replaceCharacter(strOptionCode, 1, '1');

        console.log(`3 ${strOptionCode}`);
    }
    else {
        strOptionCode = replaceCharacter(strOptionCode, 1, '0');

        console.log(`4 ${strOptionCode}`);
    }

    // if ( iParentClass != EAgent.eShop )
    // {
        
        fSlotR = $('#fRollingSlot').val();
        fBaccaratR = $('#fRollingBaccarat').val();
        fUnderOverR = $('#fRollingUnderOver').val();
        fPBR = $('#fRollingPB').val();
        fPBSingleR = $('#fRollingPBSingle').val();
        fPBDoubleR = $('#fRollingPBDouble').val();
        fPBTripleR = $('#fRollingPBTriple').val();
        //fSettleBaccarat = $('#fSettleBaccarat').val();
        //fSettleSlot = $('#fSettleSlot').val();
        //fSettlePBA = $('#fSettlePBA').val();
        //fSettlePBB = $('#fSettlePBB').val();
        if(fSlotR == '' || fSlotR == undefined || fSlotR == null || fBaccaratR == '' || fBaccaratR == undefined || fBaccaratR == null || fUnderOverR == '' || fUnderOverR == undefined || fUnderOverR == null || fPBR == '' || fPBR == undefined || fPBR == null || fPBSingleR == '' || fPBSingleR == undefined || fPBSingleR == null || fPBDoubleR == '' || fPBDoubleR == undefined || fPBDoubleR == null || fPBTripleR == '' || fPBTripleR == undefined || fPBTripleR == null ) 
        {
            alert(strAlertErrorRollingValue);
            return;
        }
        if(iPBLimit == '' || iPBLimit == undefined || iPBLimit == null || iPBSingleLimit == '' || iPBSingleLimit == undefined || iPBSingleLimit == null || iPBDoubleLimit == '' || iPBDoubleLimit == undefined || iPBDoubleLimit == null || iPBTripleLimit == '' || iPBTripleLimit == undefined || iPBTripleLimit == null )
        {
            alert("베팅값을 입력해주세요.");
            return;
        }
    // }
    if( strPassword == '' || strPassword == undefined || strPassword == null || strPasswordConfirm == '' || strPasswordConfirm == undefined || strPasswordConfirm == null ){
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
                strAccountPassword:strAccountPassword,
                strMobileNo:strMobileNo,
                fSlotR:fSlotR,
                fBaccaratR:fBaccaratR,
                fUnderOverR:fUnderOverR,
                fPBR:fPBR,
                fPBSingleR:fPBSingleR,
                fPBDoubleR:fPBDoubleR,
                fPBTripleR:fPBTripleR,
                // fSettleBaccarat:fSettleBaccarat,
                // fSettleSlot:fSettleSlot,
                // fSettlePBA:fSettlePBA,
                // fSettlePBB:fSettlePBB,
                fSettleBaccarat:0,
                fSettleSlot:0,
                fSettlePBA:0,
                fSettlePBB:0,
                strOptionCode:strOptionCode,
                strPBOptionCode:strPBOptionCode,
                iPBLimit:iPBLimit,
                iPBSingleLimit:iPBSingleLimit,
                iPBDoubleLimit:iPBDoubleLimit,
                iPBTripleLimit:iPBTripleLimit,
                iPermission:strPermissionInput,
            },
    
            success:function(data) {

                //alert(data.string);
                if ( data.result == 'OK' )
                {
                    // self.close();
                    // opener.location.reload();
                    alert(strAlertComplete);

                    opener.location.reload();
                    window.close();
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
                }                
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}