let leadingZeros = (n, digits) => {
    let zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (let i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

let getTimeStamp = (offset)=> {
    let now = new Date();

    let d = new Date(now.setDate(now.getDate()-offset));
    let s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2);

    return s;
}

let getMonthlyStart = ()=> {
    var now = new Date();

    var s =
        leadingZeros(now.getFullYear(), 4) + '-' +
        leadingZeros(now.getMonth() + 1, 2) + '-' +
        leadingZeros(1, 2);

        console.log(s);

    return s;
}

let GetCurrentDateBefore = (days) => {
    let date = new Date();
    let day = days ?? 0;
    let res = new Date(date.getFullYear(), date.getMonth(), date.getDate()-day);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetCurrentDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetDateStart = (dt, day) => {
    let date = new Date(dt);
    let res = new Date(date.getFullYear(), date.getMonth(), day);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetDateEnd = (dt, day) => {
    let date = new Date(dt);
    let res = day == 26 ? new Date(date.getFullYear(), date.getMonth() + 1, 0) : new Date(date.getFullYear(), date.getMonth(), day);
    // let res = new Date(date.getFullYear(), month + 1, 0);
    // if (eday < res.getDate()) {
    //       res = new Date(date.getFullYear(), month + 1, eday);
    // }
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetCurrentDateStart = (day) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), day);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetCurrentDateEnd = (day) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), day);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetMonthlyStartDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), 1);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetMonthlyEndDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetMonthly1stStartDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), 1);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthly1stEndDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), 15);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetMonthly2ndStartDate = (isSettle) => {
    let date = new Date();
    let isSe = isSettle ?? false;
    if (isSe == true) {
        // 2분기는 16일 이전에는 전분기로 조회
        if (date.getDate() > 15) {
            let res = new Date(date.getFullYear(), date.getMonth(), 16);
            res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
            return res;
        } else {
            let res = new Date(date.getFullYear(), date.getMonth()-1, 16);
            res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
            return res;
        }
    } else {
        let res = new Date(date.getFullYear(), date.getMonth(), 16);
        res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
        return res;
    }
}

let ValidationSettleHalf1 = (month) => {
    return true;

    let date = new Date();
    let res = new Date(date.getFullYear(), month, 15); // 선택한 날짜
    if ( date < res )
    {
        return false;
    }
    return true;
}

let ValidationSettleHalf2 = (month) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), month+1, 0); // 선택일자(해당 분기의 마지막날)
    if ( date < res )
    {
        return false;
    }
    return true;
}

let ValidationMonthly2StartDate = () => {
    let date = new Date();
    if ( date.getDate() < 16 )
    {
        alert('현재 해당 분기는 조회할 수 없습니다');
        return false;
    }
    return true;
}

let GetMonthly2ndEndDate = (isSettle) => {
    let date = new Date();
    let isSe = isSettle ?? false;
    if (isSe == true) {
        if (date.getDate() > 15) {
            let res = new Date(date.getFullYear(), date.getMonth()+1, 0);
            res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
            return res;
        } else {
            let res = new Date(date.getFullYear(), date.getMonth(), 0);
            res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
            return res;
        }
    } else {
        let res = new Date(date.getFullYear(), date.getMonth()+1, 0);
        res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
        return res;
    }
}

let GetYearlyStartDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear(), date.getMonth(), 1);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetYearlyEndDate = () => {
    var date = new Date(); 

    let iEndDate = 31;
    if ( date.getDate() < 31 )
        iEndDate = date.getDate();
    let iMonth = 11;
    if ( date.getMonth() < iMonth )
        iMonth = date.getMonth();

    var res = new Date(date.getFullYear(), date.getMonth(), iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let DatePicker = () =>
{
	$(".datepicker").datepicker({
		showMonthAfterYear: true,
		changeYear: true,
		changeMonth: true,
		dateFormat: "yy-mm-dd",
		dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
		dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
		monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		MonthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
	});
}

let MonthPicker = () =>
{
    $(".monthpicker").datepicker({
        format: 'yyyy-mm',
        language: 'kr',
        minViewMode: "months",
        startView: "months",
        autoclose : true
	});
}

//

let Get1QuaterStartDate = (month) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), month, 1);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let Get1QuaterEndDate = (month) => {
    let date = new Date();
    let iEndDate = 15;
    let res = new Date(date.getFullYear(), month, iEndDate);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let Get2QuaterStartDate = (month) => {
    let date = new Date();
    let iDate = 16;
    let res = new Date(date.getFullYear(), month, iDate);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let Get2QuaterEndDate = (month) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), month+1, 0);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetQuaterStartDate = (month, sday) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), month, sday);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetQuaterEndDate = (month, eday) => {
    let date = new Date();
    let res = new Date(date.getFullYear(), month + 1, 0);
    if (eday < res.getDate()) {
          res = new Date(date.getFullYear(), month + 1, eday);
    }
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

// let Get2QuaterEndDate = (month) => {
//     var date = new Date(); 

//     let iEndDate = 0;
//     //let iEndDate = 31;
//     // if ( date.getDate() < 31 )
//     //     iEndDate = date.getDate();

//     var res = new Date(date.getFullYear(), month, iEndDate);

//     res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

//     return res;
// }

let GetQuaterDate = (month, day) => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), month, day);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetHalfYearStartDate = () => {
    let date = new Date();
    let month = date.getMonth();
    if (month < 6) {
        month = 0;
    } else {
        month = 6;
    }

    let res = new Date(date.getFullYear(), month, 1);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}

let GetYearStartDate = () => {
    let date = new Date();
    let res = new Date(date.getFullYear() - 1, date.getMonth(), 1);
    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];
    return res;
}