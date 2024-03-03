let GetNumber = (number, defaultValue = '') => {

    const cNumber = parseInt(number);
    if ( cNumber == 0 )
        return defaultValue;
    else if ( cNumber == undefined || cNumber == null || isNaN(cNumber) )
        return defaultValue;
    else if ( cNumber < 0 )
    {
        let temp = -cNumber;
        return temp.toLocaleString();
    }
    else {
        return cNumber.toLocaleString();
    }
}

let GetNumberSign = (number, defaultValue = '') => {

    const cNumber = parseInt(number);
    if ( cNumber == 0 )
        return defaultValue;
    else if ( cNumber == undefined || cNumber == null || isNaN(cNumber) )
        return defaultValue;
    else if ( cNumber < 0 )
    {
        let temp = -cNumber;
        return `-${temp.toLocaleString()}`;
    }
    else {
        return cNumber.toLocaleString();
    }
}

let GetSettleNumber = (number, defaultValue = '') => {
    const cNumber = parseInt(number);
    if (cNumber == 0) {
        return defaultValue;
    } else if (cNumber == undefined || cNumber == null || isNaN(cNumber)) {
        return defaultValue;
    } else if (cNumber < 0) {
        let temp = -cNumber;
        return `${temp.toLocaleString()}`;
    }
    return cNumber.toLocaleString();
}

let GetClassColor = (number, iRootClass) => {
    if (iRootClass > 3) {
        return GetInversedColor(number);
    }
    return GetColor(number);
}

let GetClassSettleColor = (number, iRootClass) => {
    if (iRootClass > 3) {
        return '#1b74e9';
    }
    return 'red';
}

let GetColor = (number) => {

    const cNumber = parseInt(number);

    if ( cNumber == 0 )
        return '#011125a2';
    else if ( cNumber > 0 )
        return '#1b74e9';
    
    return '#e0350a';
}

let GetInversedColor = (number) => {

    const cNumber = parseInt(number);

    if ( cNumber == 0 )
        return '#011125a2';
    else if ( cNumber > 0 )
        return '#e0350a';
        
    return '#1b74e9';
}

let GetTotalBWR = (array) => {

    let iBetting = 0;
    let iWin = 0;
    let iRolling = 0;
    let iTotal = 0;

    for ( let i in array )
    {
        const cSubBetting = parseInt(array[i].iBetting ?? 0);
        const cSubWin = parseInt(array[i].iWin ?? 0);
        const cSubRolling = parseInt(array[i].iRolling ?? 0);

        iBetting = parseInt(iBetting ?? 0) + cSubBetting;
        iWin = parseInt(iWin ?? 0) + cSubWin;
        iRolling = parseInt(iRolling ?? 0) + cSubRolling;
        // console.log(`idx: ${i} / iBetting : ${iBetting} / iWin : ${iWin} / iRolling : ${iRolling}`);
    }

    iTotal = iBetting - iWin - iRolling;

    return {iTotal:iTotal, iBetting:iBetting, iWin:iWin, iRolling:iRolling};
}

let GetBettingGroup = (array) => {

    console.log(array);

    let list = [];

    for ( let i = 0; i < 4; ++ i )
    {
        list.push({iBetting:0, iWin:0, iRolling:0, iTotal:0});
    }

    for ( let i in array )
    {
        switch ( parseInt(array[i].iGameCode) )
        {
        case 0: // barcara
            list[0].iBetting += array[i].iBetting;
            list[0].iWin += array[i].iWin;
            list[0].iRolling += array[i].iRolling;
            list[0].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
            break;
        case 100: // unover
            list[1].iBetting += array[i].iBetting;
            list[1].iWin += array[i].iWin;
            list[1].iRolling += array[i].iRolling;
            list[1].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
            break;
        case 200: // slot
            list[2].iBetting += array[i].iBetting;
            list[2].iWin += array[i].iWin;
            list[2].iRolling += array[i].iRolling;
            list[2].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
            break;
        case 300: // powerball
            list[3].iBetting += array[i].iBetting;
            list[3].iWin += array[i].iWin;
            list[3].iRolling += array[i].iRolling;
            list[3].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
            break;
        }
    }

    return list;
}

let GetClassNickName = (iClass, strNickname) => {
    if ( iClass == 1 ) {
        return `[총총]${strNickname}`;
    } else if ( iClass == 2) {
        return `[총본]${strNickname}`;
    } else if ( iClass == 3) {
        return `[본]${strNickname}`;
    }else if ( iClass == 4) {
        return `[대]${strNickname}`;
    }else if ( iClass == 5) {
        return `[부]${strNickname}`;
    }else if ( iClass == 6) {
        return `[총]${strNickname}`;
    }else if ( iClass == 7) {
        return `[매]${strNickname}`;
    }else if ( iClass == 8) {
        return `[회]${strNickname}`;
    }
    return strNickname;
}