
let SetSeachButtons = (strSearchTag, iRender, i18nTexts, objectData, iTargetClass) => {
    /* iRender 
        0:betting_listadmin
        1:betting_listproadmin, betting_listproadmin, betting_listshop, betting_listviceadmin
        2:popup_proadminlist, calculation, popup_games, popup_shoplist, popup_viceadminlist
        3:manager_user/list
        4:popup_userlist
        5:betting_listvicehq, popup_agentlist
        6:popup_bettingrecord
        7:realtimeuserlist
    */
    $(strSearchTag).empty();
    let tag = '';
    if(iRender == 1)
    {
        tag = `
        <div style="background-color:#ffffff;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strSearchNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearchNickname();">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                </div>
            </div>
        </div>
        `;
    }
    else if (iRender == 2) {
        tag = `
        <div style="background-color:#ffffff;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                    &nbsp;
                    <button class="btn_blue search_btn" search_btn-index="3" id="button_toggle_record" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(136, 136, 248);color:white" onclick="OnClickRecord();">${i18nTexts.Open}</button>
                </div>
            </div>
        </div>
        `;
    }
    else if(iRender == 3)
    {
        tag = `
        <div style="background-color:#ffffff;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    ${i18nTexts.ProAdmin} ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strAgentNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearchAgentNickname();">${i18nTexts.Search}</button>
                    <input style="margin-left:20px; width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strSearchNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearchNickname();">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                </div>
            </div>
        </div>
        `;
    }
    else if(iRender == 4) {
        tag = `
        <div style="background-color:#e7af16;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass}, ${objectData.iPermission});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strSearchNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearchNickname();">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu1" data-menu="0" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickYesterdayRecord();">어제</button>
                    &nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                    &nbsp;
                    <button class="btn_blue search_btn" search_btn-index="3" id="button_toggle_record" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(136, 136, 248);color:white" onclick="OnClickRecord();">${i18nTexts.Open}</button>
                </div>
            </div>
        </div>
        `;
    }
    else if(iRender == 5){
        tag = `
        <div style="background-color:#ffffff;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass}, ${objectData.iPermission});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strSearchNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="testclick();">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                    &nbsp;
                    <button class="btn_blue search_btn" search_btn-index="3" id="button_toggle_record" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(136, 136, 248);color:white" onclick="OnClickRecord();">${i18nTexts.Open}</button>
                </div>
            </div>
        </div>
        `;
    }
    else if (iRender == 6) {
        tag = `
        <div style="background-color:#ffffff;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                    &nbsp;
                    <button class="btn_blue search_btn" search_btn-index="3" id="button_toggle_record" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(136, 136, 248);color:white" onclick="OnClickRecord();">${i18nTexts.Open}</button>
                    <select id="select_limit" style="width:80px; display: none;" >
                        <option value="30">30개씩</option>
                        <option value="50">50개씩</option>
                        <option value="100">100개씩</option>
                    </select>
                </div>
            </div>
        </div>
        `;
    }
    else if(iRender == 7) {
        tag = `
        <div style="background-color:#e7af16;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strSearchNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearchNickname();">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="btn_blue" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="btn_blue" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                </div>
            </div>
        </div>
        `;
    }
    else {
        tag = `
        <div style="background-color:#ffffff;padding-right:5px;padding-top:0px;padding-bottom:0px;" colspan="19">
            <div style="float: left;">
                <button class="menu1" data-menu="10" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(1);">1분기</button>
                &nbsp;
                <button class="menu1" data-menu="11" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(6);">2분기</button>
                &nbsp;
                <button class="menu1" data-menu="12" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(11);">3분기</button>
                &nbsp;
                <button class="menu1" data-menu="13" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(16);">4분기</button>
                &nbsp;
                <button class="menu1" data-menu="14" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(21);">5분기</button>
                &nbsp;
                <button class="menu1" data-menu="15" style="border:1px solid rgb(95, 93, 93);width:50px;height:25px;text-align:center;color:white" onclick="OnClickDayPeriod(26);">6분기</button>
            </div>
            <div style="overflow: hidden;">
                <div style="float: right; text-align: right;">
                    <input style="width:100px;" type="text" id="datepicker1" class="datepicker"/>~
                    <input style="width:100px;" type="text" id="datepicker2" class="datepicker"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearch(${iTargetClass}, ${objectData.strGroupID}, ${objectData.iClass}, ${objectData.iPermission});">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${i18nTexts.Search}
                    <select id="select_roomno" style="width:80px;">
                        <option>${i18nTexts.Nickname}</option>
                    </select>
                    <input style="margin-left:0px;width:100px;" id="strSearchNickname" type="text"/>
                    <button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickSearchNickname();">${i18nTexts.Search}</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="menu1" data-menu="0" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickYesterdayRecord();">어제</button>
                    &nbsp;
                    <button class="menu5" data-menu="1" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickTodayRecord();">${i18nTexts.Today}</button>
                    &nbsp;
                    <button class="menu1" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly1stRecord();">${i18nTexts.Half1}</button>
                    &nbsp;
                    <button class="menu1" data-menu="3" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;color:white" onclick="OnClickMonthly2ndRecord();">${i18nTexts.Half2}</button>
                    &nbsp;
                    <button class="btn_blue search_btn" search_btn-index="3" id="button_toggle_record" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(136, 136, 248);color:white" onclick="OnClickRecord();">${i18nTexts.Open}</button>
                </div>
            </div>
        </div>
        `;
    }
       
    $(strSearchTag).append(tag);
}