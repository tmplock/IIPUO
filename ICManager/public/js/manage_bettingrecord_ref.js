let GetRoundDetail = (strVender, strRoundDetails) => {
    let details = strRoundDetails ?? '';
    if (details == '') {
        return false;
    }
    return true;
}

// iTarget : 0, 100, 200, 300
let GetTargets = (iTarget, strBets) => {
    let bets = strBets ?? '';
    if (bets != '') {
        let json = JSON.parse(bets);
        let list = [];
        for (let i in json) {
            list.push(`${json[i].T} (${json[i].B} | ${json[i].W})`);
        }
        console.log(list);
        return list;
    }
    return [iTarget];
}

let GetBets = (strBets) => {
    try {
        let json = JSON.parse(strBets);
        let list = [];
        for (let i in json) {
            list.push(json[i]);
        }
        return list;
    } catch (err) {

    }
    return [];
}

let GetBettingTargets = (bets, color) => {
    const colorBlue = '#52acff';
    const colorRed = '#da5656';
    const colorGreen = '#15ca2d';
    const colorOrange = '#e7af16';

    const fontSize = '15px';

    let tags = '';
    for (let i in bets)
    {
        let cBettingTarget = bets[i].T;
        let tag = '';
        switch ( parseInt(cBettingTarget) )
        {
            case 0:
                tag = `<font style="color:${colorGreen};">T</font>`;
                break;
            case 1:
                tag = `<font style="color:${colorBlue};">P</font>`;
                break;
            case 2: //  Banker
                tag = `<font style="color:${colorRed};">B</font>`;
                break;
            case 3:
                tag = `<font style="color:${colorBlue}">P-Pair</font>`;
                break;
            case 4:
                tag = `<font style="color:${colorRed}">B-</font><font style="color: ${colorBlue}">Pair</font>`;
                break;
            case 5: //  Either Pair
                tags = `<font style="color:${colorBlue};">E-Pair</font>`;
                break;
            case 6: //  Perfect Pair
                tag = `<font style="color:${colorRed};">Perfect Pair</font>`;
                break;
            case 7: //  Player Bonus
                tag = `<font style="color:${colorBlue};">P-Bonus</font>`;
                break;
            case 8: //  Banker Bonus
                tag = `<font style="color:${colorRed};">B-Bonus</font>`;
                break;
            case 100:
                tag = `<font style="color:${colorBlue};">P-</font><font style="color:${colorRed};">Under</font>`;
                break;
            case 101:
                tag = `<font style="color:${colorBlue}">P-</font><font style="color:${colorBlue}">Over</font>`;
                break;
            case 102:
                tag = `<font style="color:${colorRed}">B-</font><font style="color:${colorRed}">Under</font>`;
                break;
            case 103:
                tag = `<font style="color:${colorRed}">B-</font><font style="color:${colorBlue}">Over</font>`;
                break;
            case 400:
                tag = `<font style="color:${colorOrange};">Roulette</font>`;
                break;
            case 500:
                tag = `<font style="color:${colorOrange};">Blackjack</font>`;
                break;
            case 600:
                tag = `<font style="color:${colorOrange};">DragonTiger</font>`;
                break;
            case 700:
                tag = `<font style="color:${colorOrange};">Holdem</font>`;
                break;
            case 800:
                tag = `<font style="color:${colorOrange};">Teen Patti</font>`;
                break;
            default:
                tag = `${cBettingTarget}`;
        }

        tags = (tags == '') ? tag : `${tags}<br>${tag}`;
        console.log(tags);
    }

    return `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;">${tags}</td>`
}

let GetBettingTargetBettings = (bets, color) => {
    let tags = '';
    try {
        for (let i in bets)
        {
            let cBetting = bets[i].B;
            let tag = `<font style="color: black;">${GetNumber(cBetting)}</font>`;
            tags = (tags == '') ? tag : `${tags}<br style="padding: 10px;">${tag}`;
        }
    } catch (err) {}
    return `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;">${tags}</td>`
}

let GetBettingTargetWins = (bets, color) => {
    let tags = '';
    try {
        for (let i in bets)
        {
            let cBetting = bets[i].W;
            let tag = `<font style="color: black;">${GetNumber(cBetting)}</font>`;
            tags = (tags == '') ? tag : `${tags}<br>${tag}`;
        }
    } catch (err) {}
    return `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;">${tags}</td>`
}

let OnClickRoundDetail = (id) => {
    let strAddress = '/manage_bettingrecord/popup_round_detail';
    window.open('', 'popupRoundDetail', 'width=880, height=800, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    var $form = $('<form></form>');
    $form.attr('action', strAddress);
    $form.attr('method', 'post');
    $form.attr('target', 'popupRoundDetail');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${id}" name="id">`);
    $form.append(idx);
    $form.submit();
}

let SetBettingList = (records, startIndex) => {
    $('#betting_list').empty();

    let iTotalBet = 0;
    let iTotalWin = 0;

    for ( let i in records )
    {
        console.log('records[i]');
        console.log(records[i]);
        let eType = records[i].eType ?? '';

        let color = '#FFFFFF';
        if ( records[i].iWin > 0 ) {
            // color = '#d6f3c9';
            color = '#E8FCDE';
            // color = '#C8F5B4';
        }
        if ( records[i].iComplete == 2 )
        {
            color = `rgb(255, 150, 125);`;
        }

        if (eType == 'CANCEL_BET' || eType == 'CANCEL' || eType == 'CANCEL_WIN') {
            color = `#E7AD6C`;
        }

        let iBalance = parseInt(records[i].iBalance);
        let iPreviousCash = iBalance;
        let iBet = parseInt(records[i].iBet);
        let iAfterCash = 0;
        let iWin = parseInt(records[i].iWin);
        let iResultCash = 0;
        let iCancelBet = 0;
        let iCancelWin = 0;

        let tagWin = `<td style="background-color:${color};"></td>`;
        let tagWinResult = `<td style="background-color:${color};"></td>`;

        if ( iWin > 0 ) {
            iAfterCash = iBalance - iBet;
            iResultCash = iAfterCash + iWin;
            tagWinResult = `<td style="background-color:${color};color:black;">${GetNumber(iResultCash)}</td>`;
            tagWin = `<td style="background-color:${color};color:red;">${GetNumber(iWin)}</td>`;
        } else {
            iAfterCash = iBalance - iBet;
        }

        if (eType == 'CANCEL_BET' || eType == 'CANCEL' || eType == 'CANCEL_WIN') {
            if (iBet > 0) {
                iCancelBet = iBet;
                tagWin = `<td style="background-color:${color};color:red;">${GetNumber(iBet)}</td>`;
            }
            if (iWin > 0) {
                iCancelWin = iWin;
                tagWin = `<td style="background-color:${color};color:red;">${GetNumber(iWin)}</td>`;
            }
        }

        let bets = GetBets(records[i].strDetail);
        let tagTarget = GetBettingTargets(bets, color);
        let tagTargetBet = GetBettingTargetBettings(bets, color);
        let tagTargetWin = GetBettingTargetWins(bets, color);

        let tagDetail = '';
        let iGameCode = parseInt(records[i].iGameCode);
        let eState = records[i].eState;
        let updatedAt = '';

        if (eType == 'CANCEL_BET' || eType == 'CANCEL' || eType == 'CANCEL_WIN') {
            tagTargetBet = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iBet)}</font></td>`;
            tagTargetWin = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iWin)}</font></td>`
        } else {
            if (eState == 'COMPLETE') {
                if (eType == 'RD' || eType == 'BETWIN') {
                    if (records[i].iWin > 0) {
                        tagDetail = `<a style="color:red;" onclick="OnClickRoundDetail('${records[i].id}')" href="#">당첨 결과</a>`;
                    } else {
                        tagDetail = `<a style="color:blue;" onclick="OnClickRoundDetail('${records[i].id}')" href="#">당첨 결과</a>`;
                    }
                } else {
                    tagTargetBet = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iBet)}</font></td>`;
                    tagTargetWin = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iWin)}</font></td>`
                }
                updatedAt = records[i].updatedAt;
            } else if (eState == 'PENDING') {
                tagTargetBet = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iBet)}</font></td>`;
                tagTargetWin = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iWin)}</font></td>`
                tagDetail =  `<a style="color:#e7af16;" href="#">당첨 조회 실패</a>`;
            } else if (eState == 'ERROR') {
                tagTargetBet = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iBet)}</font></td>`;
                tagTargetWin = `<td style="font-size: 12px; background-color:${color}; padding: 10px; line-height: 1.5;"><font style="color: black;">${GetNumber(records[i].iWin)}</font></td>`
                tagDetail =  `<a style="color:#e7af16;" href="#">당첨 조회 오류</a>`;
            }
        }

        let tag =
            `
        <tr>
            <td style="background-color:${color};">${parseInt(startIndex)-i}</td>
            <td style="background-color:${color};">${records[i].strVender}</td>
            <td style="background-color:${color};">${records[i].strTableID}</td>
            <td style="background-color:${color};">${records[i].strRound}</td>
            <td style="background-color:${color};"><a style="color:blue;" onclick="OnClickNickname('${records[i].strNickname}')" href="#">${GetClassNickName(records[i].iClass, records[i].strNickname)}</a></td>
            <td style="background-color:${color};">${GetNumber(iPreviousCash)}</td>
            ${tagTarget}
            ${tagTargetBet}
            ${tagTargetWin}
            <td style="background-color:${color};">${GetNumber(iAfterCash)}</td>
            ${tagWin}
            ${tagWinResult}
            <td style="background-color:${color};">${records[i].createdAt}</td>
            <td style="background-color:${color};">${updatedAt}</td>
            <td style="background-color:${color};">${tagDetail}</td>
        </tr>											
        `;
        $('#betting_list').append(tag);

        iTotalBet += iBet;
        iTotalWin += iWin;

        // cancel 처리
        iTotalBet -= iCancelBet;
        iTotalWin -= iCancelWin;
    }

    let tagEnd = `
    <tr style="font-weight: bold;">
        <td colspan="7" style="font-weight: bold;">${strTotal}</td>
        <td style="color:blue;">${GetNumber(iTotalBet)}</td>
        <td style="color:red;">${GetNumber(iTotalWin)}</td>
        <td style="color:blue;"></td>
        <td style="color:red;">${GetNumber(iTotalWin)}</td>
        <td></td>
        <td></td>
        <td></td>
        <td style="color:${GetColor(iTotalBet-iTotalWin)};">${strTotal} : ${GetNumber(iTotalBet-iTotalWin)}</td>
    </tr>											
    `;
    $('#betting_list').append(tagEnd);

}


let SetSlotBettingList = (records, startIndex) => {
    $('#betting_list').empty();

    let iTotalBet = 0;
    let iTotalWin = 0;

    for ( let i in records )
    {
        console.log('records[i]');
        console.log(records[i]);
        let color = '#FFFFFF';
        if ( records[i].iWin > 0 ) {
            // color = '#d6f3c9';
            color = '#E8FCDE';
            // color = '#C8F5B4';
        }
        if ( records[i].iComplete == 2 )
        {
            color = `rgb(255, 150, 125);`;
        }

        let iBalance = parseInt(records[i].iBalance);
        let iPreviousCash = iBalance;
        let iBet = parseInt(records[i].iBet);
        let iAfterCash = 0;
        let iWin = parseInt(records[i].iWin);
        let iResultCash = 0;

        if ( iWin > 0 ) {
            iAfterCash = iBalance - iBet;
            iResultCash = iAfterCash + iWin;
        } else {
            iAfterCash = iBalance - iBet;
        }

        let tagDetail = '';
        let iGameCode = parseInt(records[i].iGameCode);
        let eState = records[i].eState;
        let updatedAt = '';

        if (eState == 'COMPLETE') {
            updatedAt = records[i].updatedAt;
        }

        let tag =
            `
                <tr>
                    <td style="background-color:${color};">${parseInt(startIndex)-i}</td>
                    <td style="background-color:${color};">${records[i].strVender}</td>
                    <td style="background-color:${color};">${records[i].strTableID}</td>
                    <td style="background-color:${color};">${records[i].strRound}</td>
                    <td style="background-color:${color};"><a style="color:blue;" onclick="OnClickNickname('${records[i].strNickname}')" href="#">${GetClassNickName(records[i].iClass, records[i].strNickname)}</a></td>
                    <td style="background-color:${color};">${GetNumber(iPreviousCash)}</td>
                    <td style="background-color:${color};">${GetNumber(iBet)}</td>
                    <td style="background-color:${color};">${GetNumber(iAfterCash)}</td>
                    <td style="background-color:${color};color:red;">${GetNumber(iWin)}</td>
                    <td style="background-color:${color};color:black;">${GetNumber(iResultCash)}</td>
                    <td style="background-color:${color};">${records[i].createdAt}</td>
                    <td style="background-color:${color};">${updatedAt}</td>
                    <td style="background-color:${color};">${tagDetail}</td>
                </tr>											
            `;
        $('#betting_list').append(tag);

        iTotalBet += iBet;
        iTotalWin += iWin;
    }

    let tagEnd = `
        <tr style="font-weight: bold;">
            <td colspan="5" style="font-weight: bold;">${strTotal}</td>
            <td style="color:blue;"></td>            
            <td style="color:blue;">${GetNumber(iTotalBet)}</td>
            <td></td>
            <td style="color:red;">${GetNumber(iTotalWin)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td style="color:${GetColor(iTotalBet-iTotalWin)};">${strTotal} : ${GetNumber(iTotalBet-iTotalWin)}</td>
        </tr>											
    `;
    $('#betting_list').append(tagEnd);

}


let GetBettingTarget = (iGameCode, iTarget, color) => {

    const colorBlue = '#52acff';
    const colorRed = '#da5656';
    const colorGreen = '#15ca2d';
    const colorOrange = '#e7af16';

    const fontSize = '15px';

    let tagTarget = `<td style="background-color:${color};font-size:${fontSize};"></td>`;
    if ( iGameCode == 300 )
    {
        switch ( parseInt(iTarget) )
        {
            case 0: //파워볼 홀
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">파워볼 홀</td>`;
                break;
            case 1: //파워볼 짝
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">파워볼 짝</td>`;
                break;
            case 2: //파워볼 오버
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">파워볼 오버</td>`;
                break;
            case 3: //파워볼 언더
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">파워볼 언더</td>`;
                break;
            case 4: //파워볼 홀오버
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">파워볼 홀오버</td>`;
                break;
            case 5: //파워볼 홀언더
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">파워볼 홀언더</td>`;
                break;
            case 6: //파워볼 짝오버
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">파워볼 짝오버</td>`;
                break;
            case 7: //파워볼 짝언더
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">파워볼 짝언더</td>`;
                break;
            case 8: //일반볼 홀
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">일반볼 홀</td>`;
                break;
            case 9: //일반볼 짝
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">일반볼 짝</td>`;
                break;
            case 10: //일반볼 오버
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">일반볼 오버</td>`;
                break;
            case 11: //일반볼 언더
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">일반볼 언더</td>`;
                break;
            case 12: //일반볼 대
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 대</td>`;
                break;
            case 13: //일반볼 중
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 중</td>`;
                break;
            case 14: //일반볼 소
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 소</td>`;
                break;
            case 15: //일반볼 홀오버
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">일반볼 홀오버</td>`;
                break;
            case 16: //일반볼 홀언더
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">일반볼 홀언더</td>`;
                break;
            case 17: //일반볼 짝오버
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">일반볼 짝오버</td>`;
                break;
            case 18: //일반볼 짝언더
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">일반볼 짝언더</td>`;
                break;
            case 19: //일반볼 홀대
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 홀대</td>`;
                break;
            case 20: //일반볼 짝대
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 짝대</td>`;
                break;
            case 21: //일반볼 홀중
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 홀중</td>`;
                break;
            case 22: //일반볼 짝중
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 짝중</td>`;
                break;
            case 23: //일반볼 홀소
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 홀소</td>`;
                break;
            case 24: //일반볼 짝소
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">일반볼 짝소</td>`;
                break;
            case 25://홀+언더+P홀
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">홀+언더+P홀</td>`;
                break;
            case 26://홀+언더+P짝
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">홀+언더+P짝</td>`;
                break;
            case 27://홀+오버+P홀
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">홀+오버+P홀</td>`;
                break;
            case 28://홀+오버+P짝
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">홀+오버+P짝</td>`;
                break;
            case 29://짝+언더+P홀
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">짝+언더+P홀</td>`;
                break;
            case 30://짝+언더+P짝
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">짝+언더+P짝</td>`;
                break;
            case 31://짝+오버+P홀
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">짝+오버+P홀</td>`;
                break;
            case 32://짝+오버+P짝
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">짝+오버+P짝</td>`;
                break;
        }
    }
    else
    {
        switch ( parseInt(iTarget) )
        {
            case 0:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorGreen};">T</td>`;
                break;
            case 1:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">P</td>`;
                break;
            case 2: //  Banker
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">B</td>`;
                break;
            case 3:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};"><font style="color:${colorBlue}">P</font>-Pair</td>`;
                break;
            case 4:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};"><font style="color:${colorRed}">B</font>-Pair</td>`;
                break;
            case 5: //  Either Pair
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">E-Pair</td>`;
                break;
            case 6: //  Perfect Pair
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">Perfect Pair</td>`;
                break;
            case 7: //  Player Bonus
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorBlue};">P-Bonus</td>`;
                break;
            case 8: //  Banker Bonus
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorRed};">B-Bonus</td>`;
                break;


            case 100:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};"><font style="color:${colorBlue}">P</font>-<font style="color:${colorRed}">Under</font></td>`;
                break;
            case 101:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};"><font style="color:${colorBlue}">P</font>-<font style="color:${colorBlue}">Over</font></td>`;
                break;
            case 102:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};"><font style="color:${colorRed}">B</font>-<font style="color:${colorRed}">Under</font></td>`;
                break;
            case 103:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};"><font style="color:${colorRed}">B</font>-<font style="color:${colorBlue}">Over</font></td>`;
                break;

            case 200:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorOrange};">Slot</td>`;
                break;


            case 400:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorOrange};">Roulette</td>`;
                break;
            case 500:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorOrange};">Blackjack</td>`;
                break;
            case 600:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorOrange};">DragonTiger</td>`;
                break;
            case 700:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorOrange};">Holdem</td>`;
                break;
            case 800:
                tagTarget = `<td style="background-color:${color};font-size:${fontSize};color:${colorOrange};">Teen Patti</td>`;
                break;
        }
    }
    return tagTarget;
}
