/**
 * 초기화
 */
let TestTagInit = (id) => {
    $(`#${id}`).empty();
    $(`#${id}`).append(`<a class="btn_thinred" style="position:absolute;top:35px; right:5%;" href="#" onclick="onclick="OnClickInit();">초기화</a>`);
}

let OnClickInit = () => {
    if (user.iClass == 1 || user.iClass == 2) {
        var dialog = window.confirm('초기화 하시겠습니까?(유저 정보를 제외한 모든 데이터가 초기화됩니다)');
        if (dialog) {
            $.ajax({
                url:"/test/init",
                type:"POST",
                dataType: "json",
                success: function (obj) {

                    alert(obj.string);

                    location.reload();

                }
            });
        }
        return;
    }
    alert('권한이 없습니다');
}




/**
 * 전체 죽장
 */
let TestTagSettle = (id) => {
    $(`#${id}`).empty();
    let month = 11;
    $(`#${id}`).append(`
        <button id="button_quater" class="btn_blue" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:150px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="RequestTestInitSettle();">죽장 전체 초기화(T)</button>
    `);
}
let RequestTestInitSettle = () => {
    if (confirm('전체 죽장 초기화합니다')) {
        $.ajax({
            type:'post',
            url: "/test/testinit",
            context: document.body,

            success: (obj) => {
                if ( obj.result == 'OK' )
                {
                    alert('완료');
                    location.reload();
                }
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }
}

let TestTagSettle2 = (id) => {
    $(`#${id}`).empty();
    let month = 11;
    $(`#${id}`).append(
        `
						<input type="checkbox" style="width:20px;height:20px;" name="checkTestSettle" id="checkTestSettle" required="no" message="">
						일자별 죽장테스트 :
						<select id="quater_test" style="width:100px;">
							<option value="2">3</option>
							<option value="3">4</option>
							<option value="4">5</option>
							<option value="5">6</option>
							<option value="6">7</option>
							<option value="7">8</option>
							<option value="8">9</option>
							<option value="9">10</option>
							<option value="10">11</option>
							<option value="11">12</option>
							<option value="12">13</option>
							<option value="13">14</option>
							<option value="14">15</option>
							<option value="15">16</option>
							<option value="16">17</option>
							<option value="17">18</option>
							<option value="18">19</option>
							<option value="19">20</option>
							<option value="20">21</option>
							<option value="21">22</option>
							<option value="22">23</option>
							<option value="23">24</option>
							<option value="24">25</option>
							<option value="25">26</option>
							<option value="26">27</option>
							<option value="27">28</option>
							<option value="28">29</option>
							<option value="29">30</option>
							<option value="30" selected>31</option>
						</select>일
						<button class="btn_blue" style="border:1px solid rgb(95, 93, 93);width:70px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="OnClickTestSettle();">조회</button>
						<button id="button_quater" class="btn_blue" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:100px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="RequestTestCurrentSettle();">죽장 초기화(T)</button>
						<button id="button_quater" class="btn_blue" data-menu="2" style="border:1px solid rgb(95, 93, 93);width:150px;height:25px;text-align:center;background-color: rgb(74, 141, 68);color:white" onclick="RequestTestInitSettle();">죽장 전체 초기화(T)</button>
				`
    );
}

let OnClickTestSettle = () => {
    console.log(`죽장테스트 조회 클릭`);

    let isCheck = $(`#checkTestSettle`).attr('checked');
    if ( isCheck == undefined ) {
        alert('죽장테스트 앞 체크박스에 체크를 해주세요');
        return;
    }

    let month = parseInt($('#quater_month').val())+1;
    let day = parseInt($('#quater_test').val())+1;
    console.log(day);
    dateQuaterStart = `2023-${month}-${day}`;
    dateQuaterEnd = `2023-${month}-${day}`;
    strQuater = `${month}-${day}`;
    console.log(`strQuater : ${strQuater}`);
    console.log(`dateQuaterStart : ${dateQuaterStart}`);
    console.log(`dateQuaterEnd : ${dateQuaterEnd}`);

    strCurrentAdminNickname = '';
    // let currentProAdmin = FindProAdmin(strCurrentAdminNickname);
    // if ( currentProAdmin == null ) {
    // 	alert('파트너를 선택해주세요');
    // 	return;
    // }
    // RequestList(currentProAdmin.strGroupID, currentProAdmin.iClass, dateQuaterStart, dateQuaterEnd);

    // let iMonth = parseInt($('#quater_month').val());
    // dateQuaterStart = Get1QuaterStartDate(iMonth);
    // dateQuaterEnd = Get1QuaterEndDate(iMonth);
    // strQuater = `${parseInt(iMonth)+1}-1`;
    // selectQuater = 1;

    RequestOverview(user.strGroupID, user.iClass, strQuater, dateQuaterStart, dateQuaterEnd, user.strID);

    if ( strCurrentAdminNickname != null && strCurrentAdminNickname.length > 0 && strCurrentAdminGroupId != null && strCurrentAdminGroupId.length > 0 ) {
        // 해당 대본사에 대한 정산 완료 여부 체크
        SelectAdmin(strCurrentAdminNickname, strCurrentAdminGroupId);
    } else if (user.iClass == 2) {
        RequestAdminList(user.strNickname, user.strGroupID);
    } else if (user.iClass == 1) {
        RequestViceHQList(user.strNickname, user.strGroupID);
    }

    if (parseInt(user.iClass) <= 3)
    {
        $(`#list_tit`).empty();
        $('#list_agents').empty();
    }
}

let RequestTestCurrentSettle = () => {
    if (strQuater == '') {
        alert('먼저 조회를 해주세요');
        return;
    }
    if (confirm('현재 조회된 죽장을 초기화합니다')) {
        $.ajax({
            type:'post',
            url: "/test/testinitcurrent",
            data: {
                strQuater:strQuater,
            },
            dataType: "json",
            success: (obj) => {
                if ( obj.result == 'OK' )
                {
                    alert('완료');
                    location.reload();
                }
            },
            error:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }
}