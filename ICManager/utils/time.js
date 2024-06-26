const moment = require('moment');

var leadingZeros = (n, digits) => {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

exports.getTimeStamp = (offset)=> {
    var now = new Date();

    var d = new Date(now.setDate(now.getDate()-offset));
    var s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2);

    return s;
}

exports.getMonthlyStart = ()=> {
    const date = new Date();
    const first =  new Date(date.getFullYear(), date.getMonth(), 1);
    const ret = new Date(date.setDate(first.getDate()));
    return moment(ret).format('YYYY-MM-DD');
}

exports.getMonthlyEnd = ()=> {

    const date = new Date();
    const end = new Date(date.getFullYear(), date.getMonth()+1, 0);
    const ret = new Date(date.setDate(end.getDate()));
    return moment(ret).format('YYYY-MM-DD');
}

exports.getTodayStart = ()=> {
    // const today_start = new Date().setHours(0,0,0,0);

    // return today_start;

    const date = new Date();
//    const yesterday = new Date(date.setDate(date.getDate()-1));

    return moment(date).format('YYYY-MM-DD');
    //return yesterday;

    // var s =
    //     leadingZeros(yesterday.getFullYear(), 4) + '-' +
    //     leadingZeros(yesterday.getMonth() + 1, 2) + '-' +
    //     leadingZeros(yesterday.getDay(), 2);
    
    // return s;
}

exports.getTodayEnd = ()=> {
    // const today_end = new Date().setHours(23,59,59,0);
    
    // return today_end;

    const date = new Date();
    //const tomorrow = new Date(date.setDate(date.getDate()+1));

    return moment(date).format('YYYY-MM-DD');
    //return tomorrow;


    // var s =
    //     leadingZeros(tomorrow.getFullYear(), 4) + '-' +
    //     leadingZeros(tomorrow.getMonth() + 1, 2) + '-' +
    //     leadingZeros(tomorrow.getDay(), 2);
    
    // return s;
}

exports.getDateEnd = (dateEnd) => {
    let now = new Date();
    let end = new Date(dateEnd);
    if (now < end) {
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    }
    return end;
}

exports.GetDay = (date, offset) => {

    const toDate = new Date(date);

    const theday = new Date(toDate.setDate(toDate.getDate()+offset));

    return moment(theday).format('YYYY-MM-DD');
}

exports.GetYesterday = ()=> {
    // const today_start = new Date().setHours(0,0,0,0);

    // return today_start;

    const date = new Date();
    const yesterday = new Date(date.setDate(date.getDate()-1));

    return moment(yesterday).format('YYYY-MM-DD');
    //return yesterday;

    // var s =
    //     leadingZeros(yesterday.getFullYear(), 4) + '-' +
    //     leadingZeros(yesterday.getMonth() + 1, 2) + '-' +
    //     leadingZeros(yesterday.getDay(), 2);
    
    // return s;
}

exports.GetTommorow = ()=> {
    // const today_end = new Date().setHours(23,59,59,0);
    
    // return today_end;

    const date = new Date();
    const tomorrow = new Date(date.setDate(date.getDate()+1));

    return moment(tomorrow).format('YYYY-MM-DD');
    //return tomorrow;


    // var s =
    //     leadingZeros(tomorrow.getFullYear(), 4) + '-' +
    //     leadingZeros(tomorrow.getMonth() + 1, 2) + '-' +
    //     leadingZeros(tomorrow.getDay(), 2);
    
    // return s;
}

exports.getCurrentDate = () =>{
    var current = new Date();

    return moment(current).format('YYYY-MM-DD');
}

exports.getCurrentDateBefore = (days) =>{
    var current = new Date();
    var day = days ?? 0;
    current = new Date(current.getFullYear(), current.getMonth(), current.getDate()-day);
    return moment(current).format('YYYY-MM-DD');
}

exports.getCurrentDateFull = () =>{
    var current = new Date();

    return moment(current).format('YYYY-MM-DD HH:mm:ss');
}


exports.get1QuaterStartDate = (month) => {
    var date = new Date();
    var res = new Date(date.getFullYear(), month, 1);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

exports.get1QuaterEndDate = (month) => {
    var date = new Date();

    let iEndDate = 15;
    // if ( date.getDate() < 15 )
    //     iEndDate = date.getDate();

    var res = new Date(date.getFullYear(), month, iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

exports.get2QuaterStartDate = (month) => {
    var date = new Date();

    let iDate = 16;

    var res = new Date(date.getFullYear(), month, iDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

exports.get2QuaterEndDate = (month) => {
    var date = new Date();

    let iEndDate = 0;
    //let iEndDate = 31;
    // if ( date.getDate() < 31 )
    //     iEndDate = date.getDate();

    var res = new Date(date.getFullYear(), month+1, iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}