let GetNumber = (number, defaultValue = '') => {

    //const cNumber = Math.round(parseInt(number)/100)*100;
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

let GetNumberRounds = (number, defaultValue = '') => {

    const cNumber = Math.round(parseInt(number)/100)*100;
    //const cNumber = parseInt(number);
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

// let GetTotalBWR = (array) => {

//     let iBetting = 0;
//     let iWin = 0;
//     let iRolling = 0;
//     let iTotal = 0;

//     for ( let i in array )
//     {
//         const cSubBetting = parseFloat(array[i].iBetting ?? 0);
//         const cSubWin = parseFloat(array[i].iWin ?? 0);
//         const cSubRolling = parseFloat(array[i].iRolling ?? 0);

//         iBetting = parseFloat(iBetting ?? 0) + cSubBetting;
//         iWin = parseFloat(iWin ?? 0) + cSubWin;
//         iRolling = parseFloat(iRolling ?? 0) + cSubRolling;
//         // console.log(`idx: ${i} / iBetting : ${iBetting} / iWin : ${iWin} / iRolling : ${iRolling}`);
//     }

//     iTotal = iBetting - iWin - iRolling;

//     return {iTotal:iTotal, iBetting:iBetting, iWin:iWin, iRolling:iRolling};
// }

let GetTotalBWR = (array) => {

    let iBetting = 0;
    let iWin = 0;
    let iRolling = 0;
    let iTotal = 0;
    let iBetting2 = 0;

    for ( let i in array )
    {
        const cSubBetting = parseFloat(array[i].iBetting ?? 0);
        const cSubWin = parseFloat(array[i].iWin ?? 0);
        const cSubRolling = parseFloat(array[i].iRolling ?? 0);
        const cSubBetting2 = parseFloat(array[i].iBetting2 ?? 0);

        iBetting2 = parseFloat(iBetting2 ?? 0) + cSubBetting2;
        iBetting = parseFloat(iBetting ?? 0) + cSubBetting;
        iWin = parseFloat(iWin ?? 0) + cSubWin;
        iRolling = parseFloat(iRolling ?? 0) + cSubRolling;
        // console.log(`idx: ${i} / iBetting : ${iBetting} / iWin : ${iWin} / iRolling : ${iRolling}`);
    }

    //iTotal = iBetting - iWin - iRolling;
    iTotal = iBetting2 - iWin - iRolling;
    iWin = iTotal - iBetting + iRolling;

    return {iTotal:iTotal, iBetting:iBetting, iWin:iWin, iRolling:iRolling};
}


let GetBettingGroup2 = (array) => {

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
// let GetBettingGroup = (array) => {

//     console.log(array);

//     let list = [];

//     for ( let i = 0; i < 4; ++ i )
//     {
//         list.push({iBetting:0, iWin:0, iRolling:0, iTotal:0});
//     }

//     for ( let i in array )
//     {
//         switch ( parseInt(array[i].iGameCode) )
//         {
//         case 0: // barcara
//             list[0].iBetting += array[i].iBetting;
//             list[0].iWin += array[i].iWin;
//             list[0].iRolling += array[i].iRolling;
//             list[0].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
//             break;
//         case 100: // unover
//             list[1].iBetting += array[i].iBetting;
//             list[1].iWin += array[i].iWin;
//             list[1].iRolling += array[i].iRolling;
//             list[1].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
//             break;
//         case 200: // slot
//             list[2].iBetting += array[i].iBetting;
//             list[2].iWin += array[i].iWin;
//             list[2].iRolling += array[i].iRolling;
//             list[2].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
//             break;
//         case 300: // powerball
//             list[3].iBetting += array[i].iBetting;
//             list[3].iWin += array[i].iWin;
//             list[3].iRolling += array[i].iRolling;
//             list[3].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);
//             break;
//         }
//     }

//     return list;
// }

// let GetBettingGroup2 = (array) => {

//     console.log(array);

//     let list = [];

//     for ( let i = 0; i < 4; ++ i )
//     {
//         list.push({iBetting:0, iWin:0, iRolling:0, iTotal:0});
//     }

//     for ( let i in array )
//     {
//         switch ( parseInt(array[i].iGameCode) )
//         {
//         case 0: // barcara
//             list[0].iBetting += array[i].iBetting2;
            
//             list[0].iRolling += array[i].iRolling;
//             list[0].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);

//             list[0].iWin = list[0].iTotal - array[i].iBetting2 + array[i].iRolling;
//             break;
//         case 100: // unover
//             list[1].iBetting += array[i].iBetting2;
//             //list[1].iWin += array[i].iWin;
//             list[1].iRolling += array[i].iRolling;
//             list[1].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);

//             list[1].iWin = list[1].iTotal - array[i].iBetting2 + array[i].iRolling;
//             break;
//         case 200: // slot
//             list[2].iBetting += array[i].iBetting2;
//             list[2].iWin += array[i].iWin;
//             list[2].iRolling += array[i].iRolling;
//             list[2].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);

//             list[2].iWin = list[2].iTotal - array[i].iBetting2 + array[i].iRolling;
//             break;
//         case 300: // powerball
//             list[3].iBetting += array[i].iBetting2;
//             list[3].iWin += array[i].iWin;
//             list[3].iRolling += array[i].iRolling;
//             list[3].iTotal += (array[i].iBetting-array[i].iWin-array[i].iRolling);

//             list[3].iWin = list[3].iTotal - array[i].iBetting2 + array[i].iRolling;
//             break;
//         }
//     }

//     return list;
// }


let GetBettingGroup = (array) => {

    console.log(array);

    let list = [];

    for ( let i = 0; i < 4; ++ i )
    {
        list.push({iBetting:BigInt(0), iWin:BigInt(0), iRolling:BigInt(0), iTotal:BigInt(0)});
    }

    for ( let i in array )
    {
        switch ( parseInt(array[i].iGameCode) )
        {
        case 0: // barcara
            list[0].iBetting += BigInt(array[i].iBetting);
            list[1].iWin += array[i].iWin;
            list[0].iRolling += BigInt(array[i].iRolling);
            list[0].iTotal += BigInt(array[i].iBetting2) - BigInt(array[i].iWin) - BigInt(array[i].iRolling);

            // list[0].iWin = list[0].iTotal - BigInt(array[i].iBetting) + BigInt(array[i].iRolling);
            break;
        case 100: // unover
            list[1].iBetting += BigInt(array[i].iBetting);
            list[1].iWin += array[i].iWin;
            list[1].iRolling += BigInt(array[i].iRolling);
            list[1].iTotal += BigInt(array[i].iBetting2) - BigInt(array[i].iWin) - BigInt(array[i].iRolling);

            // list[1].iWin = list[1].iTotal - BigInt(array[i].iBetting) + BigInt(array[i].iRolling);
            break;
        case 200: // slot
            list[2].iBetting += BigInt(array[i].iBetting);
            list[2].iWin += BigInt(array[i].iWin);
            list[2].iRolling += BigInt(array[i].iRolling);
            list[2].iTotal += BigInt(array[i].iBetting2) - BigInt(array[i].iWin) - BigInt(array[i].iRolling);

            // list[2].iWin = list[2].iTotal - BigInt(array[i].iBetting) + BigInt(array[i].iRolling);
            break;
        case 300: // powerball
            list[3].iBetting += BigInt(array[i].iBetting);
            list[3].iWin += BigInt(array[i].iWin);
            list[3].iRolling += BigInt(array[i].iRolling);
            list[3].iTotal += BigInt(array[i].iBetting2) - BigInt(array[i].iWin) - BigInt(array[i].iRolling);

            // list[3].iWin = list[3].iTotal - BigInt(array[i].iBetting) + BigInt(array[i].iRolling);
            break;
        }
    }
    console.log(`GetBettingGroup!!!`);
    console.log(list);
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