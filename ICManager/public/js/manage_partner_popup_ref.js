let RequestAgentListOnPopup = (iTargetClass, strGroupID, iClass, iPermission, strID) => {

    const dateStart = $('#datepicker1').val();
    const dateEnd = $('#datepicker2').val();

    $.ajax({
        type:'post',
        url: "/manage_partner_popup/request_agentlist",
        context: document.body,
        data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, iPermission:iPermission, strID: strID},

        success: (obj) => {

            console.log(obj);

            let list = obj.list;
            let iRootClass = obj.iRootClass;

            $('#agent_list').empty();

            let iInput = 0,
                iOutput = 0,
                iTotalMoney = 0,
                iRollingMoney = 0,
                iTotal = 0,
                iMyRollingMoney = 0;

            for ( let i in list )
            {
                let obj = list[i];
                iInput += parseInt(obj.iInput);
                iOutput += parseInt(obj.iOutput);
                iTotalMoney += parseInt(obj.iTotalMoney);
                iRollingMoney += parseInt(obj.iRollingMoney);
                iTotal += parseInt(obj.iTotal);
                iMyRollingMoney += parseInt(obj.iMyRollingMoney);

                //<td>${obj.strID}</td>
                let tag = 
                `
                <tr>
                    <td>${parseInt(i)+1}</td>
                    <td>${obj.iNumUsers}</td>
                    <td><a href="javascript:RequestPartnerInfo('${obj.strNickname}', '${obj.strGroupID}', '${obj.iClass}', 'popupChk_${obj.strNickname}');">${obj.strNickname}</a></td>
                    <td>${obj.fSlotR} %</td>
                    <td>${obj.fBaccaratR} %</td>
                    <td>${obj.fUnderOverR} %</td>
                    <td>${GetNumber(obj.iInput)}</td>
                    <td>${GetNumber(obj.iOutput)}</td>
                    <td>${GetNumber(obj.iTotalMoney)}</td>
                    <td><font style='color:${GetClassSettleColor(obj.iRollingMoney, iRootClass)};'>${GetNumber(obj.iRollingMoney)}</font></td>
                    <td><font style='color:${GetClassColor(obj.iTotal, iRootClass)};'>${GetNumber(obj.iTotal)}</font></td>
                    <td><font style='color:blue;'>${strNormal}</font></td>
                    <td><font style='color:${GetClassSettleColor(obj.iMyRollingMoney, iRootClass)};'>${GetNumber(obj.iMyRollingMoney)}</font></td>
                </tr>
                `;

                $('#agent_list').append(tag);
            }

            let total_tag = 
            `
            <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>${GetNumber(iInput)}</td>
            <td>${GetNumber(iOutput)}</td>
            <td>${GetNumber(iTotalMoney)}</td>
            <td><font color="${GetClassSettleColor(iRollingMoney, iRootClass)}">${GetNumber(iRollingMoney)}</font></td>
            <td><font color=${GetClassColor(iTotal, iRootClass)}>${GetNumber(iTotal)}</font></td>
            <td></td>
            <td><font color="${GetClassSettleColor(iMyRollingMoney, iRootClass)}">${GetNumber(iMyRollingMoney)}</font></td>
            </tr>
            `;
            $('#agent_list').append(total_tag);
        
        },
        error:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

function RequestPartnerInfo(strNickname, strGroupID, iClass, iPermission, targetName)
{
    var scLeft = window.screenLeft + 50;
    var scTop = window.screenTop + 50;
    window.open('', `${targetName}`, `width=1280, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

    var $form = $('<form></form>');
    $form.attr('action', '/manage_partner_popup/games');
    $form.attr('method', 'post');
    $form.attr('target', `${targetName}`);
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
    var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
    var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);
    var iPermission = $(`<input type="hidden" value=${parseInt(iPermission)} name="iPermission">`);

    $form.append(idx).append(page).append(category).append(iPermission);
    $form.submit();
}

let RequestUserListOnPopup = (iTargetClass, strGroupID, iClass, iPermission, strID) => {

    const dateStart = $('#datepicker1').val();
    const dateEnd = $('#datepicker2').val();
    const strNickname = $('#strSearchNickname').val();

    $.ajax({
        type:'post',
        url: "/manage_partner_popup/request_agentlist",
        context: document.body,
        data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, strSearchNickname:strNickname, iPermission:iPermission, strID:strID},

        success: (obj) => {

            console.log(obj);

            let list = obj.list;
            let iRootClass = obj.iRootClass;
            let iPermission = obj.iPermission;

            $('#agent_list').empty();

            let iInput = 0,
                iOutput = 0,
                iTotalMoney = 0,
                iTotal = 0,
                iMyRollingMoney = 0,
                iTotalRolling = 0;


            for ( let i in list )
            {
                let obj = list[i];
                iInput += parseInt(obj.iInput);
                iOutput += parseInt(obj.iOutput);
                iTotalMoney += parseInt(obj.iMyMoney);
                iMyRollingMoney += parseInt(obj.iMyRollingMoney);
                iTotal += parseInt(obj.iTotal);
                iTotalRolling += parseInt(obj.iCurrentRolling);

                let strLoginedAt = '';
                if ( obj.loginedAt != null && obj.loginedAt != undefined )
                    strLoginedAt = obj.loginedAt.replace(/T/, ' ').replace(/\..+/, '');
                let strCreatedAt = obj.createdAt.replace(/T/, ' ').replace(/\..+/, '');

                let strColor = 'rgb(0, 126, 199)';
                let bgcolor = 'white';
                
                if ( obj.eState == 'BLOCK' )
                {
                    strColor = 'rgb(207, 61, 4)';
                    bgcolor = '#fcd7e6';
                }
                else if ( obj.eState == 'NOTICE')
                {
                    strColor = 'rgb(207, 100, 4)';
                    bgcolor = '#faecd9';            
                }

                let tagState = '';

                if (parseInt(iRootClass) <= 3 && iPermission != 100) {
                    tagState = `<td class="parent_row_31" style='background-color:${bgcolor};'>
                        <select style="vertical-align:middle;width:100%; background-color:${strColor}; color:white;" id="partner_agentstatus_${obj.strNickname}" onchange="OnChangeStatus('${obj.strNickname}');">
                        <option value="NOTICE">${strNotice}</option>
                        <option value="NORMAL" selected>${strNormal}</option>
                        <option value="BLOCK">${strBlock}</option>
                        </select>
                        </td>`;

                    if ( obj.eState == 'BLOCK') {

                        console.log('BLOCK');
                        tagState = `<td class="parent_row_31" style='background-color:${bgcolor};'>
                        <select style="vertical-align:middle;width:100%; background-color:${strColor}; color:white;" id="partner_agentstatus_${obj.strNickname}" onchange="OnChangeStatus('${obj.strNickname}');">
                        <option value="NORMAL">${strNormal}</option>
                        <option value="NOTICE">${strNotice}</option>
                        <option value="BLOCK" selected>${strBlock}</option>
                        </select>
                        </td>`
                    }
                    else if ( obj.eState == 'NOTICE' )
                    {
                        console.log('NOTICE');
                        tagState = `<td class="parent_row_31" style='background-color:${bgcolor};'>
                        <select style="vertical-align:middle;width:100%; background-color:${strColor}; color:white;" id="partner_agentstatus_${obj.strNickname}" onchange="OnChangeStatus('${obj.strNickname}');">
                        <option value="NORMAL">${strNormal}</option>
                        <option value="NOTICE" selected>${strNotice}</option>
                        <option value="BLOCK">${strBlock}</option>
                        </select>
                        </td>`
                    }
                } else {
                    tagState = `<td class="parent_row_31" style='background-color:${bgcolor};'>${strNormal}</td>`;
                    if (obj.escape == 'BLOCK') {
                        tagState = `<td class="parent_row_31" style='background-color:${bgcolor};'>${strNormal}</td>`;
                    } else if (obj.eState == 'NOTICE') {
                        tagState = `<td class="parent_row_31" style='background-color:${bgcolor};'>${strNormal}</td>`;
                    }
                }

                let letter = ``;
                if (parseInt(iRootClass) <= 3 && iPermission != 100) {
                    letter = `<td style='background-color:${bgcolor};'><a href="javascript:OnClickWritingLetter('${obj.strNickname}');" class="btn_green">${strLetter}</a></td>`;
                }

                let tag = `
                    <tr>
                        <td style='background-color:${bgcolor}; color: blue;'>${obj.strID}</td>
                        <td style='background-color:${bgcolor};'><a href="javascript:OnClickNickname('${obj.strNickname}');" style="color:blue;">${obj.strNickname}</a></td>
                        <td style='background-color:${bgcolor};'>${GetNumber(obj.iInput)}</td>
                        <td style='background-color:${bgcolor};'>${GetNumber(obj.iOutput)}</td>
                        <td style='background-color:${bgcolor};'>${GetNumber(obj.iMyMoney)}</td>
                        <td style='background-color:${bgcolor};'><font color="${GetClassSettleColor(obj.iMyRollingMoney, iRootClass)}">${GetNumber(obj.iMyRollingMoney)}</font></td>
                        <td style='background-color:${bgcolor};'><font color="${GetClassColor(obj.iTotal, iRootClass)}">${GetNumber(obj.iTotal)}</font></td>
                        <td style='background-color:${bgcolor};'><font color="${GetClassSettleColor(obj.iCurrentRolling, iRootClass)}">${GetNumber(obj.iCurrentRolling)}</font></td>
                        <td style='background-color:${bgcolor};'>${strCreatedAt}</td>
                        <td style='background-color:${bgcolor};'>${strLoginedAt}</td>
                        <td style='background-color:${bgcolor};'>${obj.strIP}</td>
                        ${letter} 
                        ${tagState}
                    </tr>`;

                $('#agent_list').append(tag);
            }

            let letter = ``;
            if (parseInt(iRootClass) <= 3 && iPermission != 100) {
                letter = '<td></td>>';
            }

            let tagState = '<td></td>>';

            let total_tag = `
                <tr style="font-weight: bold">
                    <td colspan="2">${strTotal}</td>
                    <td>${GetNumber(iInput)}</td>
                    <td>${GetNumber(iOutput)}</td>
                    <td>${GetNumber(iTotalMoney)}</td>
                    <td style="color: ${GetClassSettleColor(iMyRollingMoney, iRootClass)}">${GetNumber(iMyRollingMoney)}</td>
                    <td style="color: ${GetClassColor(iTotal, iRootClass)}">${GetNumber(iTotal)}</td>
                    <td style="color: ${GetClassSettleColor(iTotalRolling, iRootClass)}">${GetNumber(iTotalRolling)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    ${letter} 
                    ${tagState}
                </tr>`;

            $('#agent_list').append(total_tag);
        
        },
        error:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

let RequestBettingListOnPopup = (iTargetClass, strGroupID, iClass, iPermission, iLimit, iCurrentPage, strID, bettingType) => {

    const dateStart = $('#datepicker1').val();
    const dateEnd = $('#datepicker2').val();

    let url = "/manage_partner_popup/request_bettinglist";
    let type = bettingType ?? '';
    if (type == 'S') {
        url = "/manage_partner_popup/request_bettinglist_slot";
    }

    $.ajax({
        type:'post',
        url: url,
        context: document.body,
        data:{
            iTargetClass:iTargetClass,
            strGroupID:strGroupID,
            iClass:iClass,
            dateStart:dateStart,
            dateEnd:dateEnd,
            strID:strID,
            iPermission: iPermission,
            iLimit:iLimit,
            iPage:iCurrentPage,
        },

        success: (obj) => {
            const total = obj.totalCount ?? 0;
            if (type == 'S') {
                SetSlotBettingList(obj.list, getNo(iLimit, total, iCurrentPage, 0));
            } else {
                SetBettingList(obj.list, getNo(iLimit, total, iCurrentPage, 0));
            }

            $('#pagination').empty();
            $('#pagination').append(getPagination(iLimit, obj.totalCount, iCurrentPage));
        },
        error:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

let SetUserBettingPage = (iCurrentPage, cMaxPage) => {
    $("#page").empty();

    let cStartPage = iCurrentPage-7;
    if ( cStartPage < 0 )
        cStartPage = 0;
    let cEndPage = iCurrentPage + 8;
    if ( cEndPage > cMaxPage )
        cEndPage = cMaxPage;

    console.log(`Current : ${iCurrentPage}, cStart : ${cStartPage}, cEnd : ${cEndPage}`);

    let cShiftLeftPage = iCurrentPage-10;
    if ( cShiftLeftPage < 0 )
        cShiftLeftPage = 0;
    
    let cShiftRightPage = iCurrentPage+10;
    if ( cShiftRightPage > cMaxPage )
        cShiftRightPage = cMaxPage;

    let headtag = `<a href="#" onclick='OnClickUserBettingPage(${cShiftLeftPage});'><</a>&nbsp;`;
    $("#page").append(headtag);

    //for ( let i = 0; i < cMaxPage; ++i )
    for ( let i = cStartPage; i < cEndPage; ++i )
    {
        let strOn = '';
        if ( i == iCurrentPage )
            strOn = 'on';

        let tag = `<a href="#" onclick='OnClickUserBettingPage(${i});' class=${strOn}>${i+1}</a>`;
        $("#page").append(tag);
    }

    
    let tailtag = `&nbsp;<a href="#" onclick='OnClickUserBettingPage(${cShiftRightPage});'>></a>`;
    $("#page").append(tailtag);
}

let OnClickUserBettingPage = (iPage) => {

    const dateStart = $('#datepicker1').val();
    const dateEnd = $('#datepicker2').val();

    $.ajax(
        {
            type:'post',
            url: "/manage_partner_popup/request_bettinglist_page",
            context: document.body,
            data:{iTargetClass:agent.iClass, strNickname:agent.strNickname, strGroupID:agent.strGroupID, iClass:agent.iClass, dateStart:dateStart, dateEnd:dateEnd, iPage:iPage},
    
            success:function(data) {
                
                const cNumPage = data.page;
                
                SetUserBettingPage(iPage, cNumPage);

                SetUserBettingList(data.list);
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        }
    );
}