function SetRoom(aObject)
{
	var tag1 =
		`
	<td style="background-color:#ffffff;padding:2px 2px 2px 15px;text-align:center;" valign="top" id="result_con_3">

		<div style="text-align:center;">
			<p>${aObject.iRound}${strRound}</p>
			<table style="width:83%;margin-bottom:5px;border-top:2px solid #d5d5d5;border-right:2px solid #d5d5d5;border-bottom:2px solid #d5d5d5;border-left:2px solid #d5d5d5;cursor:pointer;" align="center" onclick="go_history_pop('239','2','','','2022-01-10');">
			<colgroup>
				<col style="width:26%">
				<col style="width:37%">
				<col style="width:37%">
			</colgroup>
				<tr>
					<th style="padding:5px 5px;font-size:11px;border-bottom:0px solid #d5d5d5;border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;">${strType}</th>
					<th style="border-right:0px solid #d5d5d5;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;">${strBetting}</th>
					<th style="border-right:0px solid #d5d5d5;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;">${strWin}</th>
				</tr>


				`;

	//const target = ['T', 'P', 'P언더', 'P오버', 'B', 'B언더', 'B오버', 'P페어', 'B페어', 'E페어', '퍼펙트페어'];
	const target = [strTie, strPlayer, strPlayerUnder, strPlayerOver, strBanker, strBankerUnder, strBankerOver, strPlayerPair, strBankerPair, strEitherPair, strPerfectPair];

	var tag2 = '';
	for ( var i = 0; i < 11; ++i )
	{
		tag2 +=
			`<tr>
					<th style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;padding:5px 5px;background-color:#EAEAEA;font-size:11px;border-bottom:0px solid #d5d5d5;">${target[i]}</th>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;background-color:#FFFFFF;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;">${aObject.kBettingInfo[i].iBetting.toLocaleString()}
																</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-left:0px solid #d5d5d5;background-color:#FFFFFF;padding:5px 5px;font-size:11px;">${aObject.kBettingInfo[i].iWin.toLocaleString()}
																</td>
					</tr>`;
	}


	var tag3 = `
			</table>
			<table style="width:98%;margin-bottom:0px;margin-top:5px;border-top:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-left:0px solid #d5d5d5;" align="center">
				<colgroup>
					<col style="width:22%">
					<col style="width:31%">
					<col style="width:47%">
				</colgroup>
				<tr style="height:30px;">
					<th style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;padding:5px 5px;font-size:11px;color:blue;background-color:#ffffff;">${strRolling}</th>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;text-align:right;background-color:#ffffff;padding:5px 5px;font-size:11px;color:red;">
						12,345
					</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-top:0px solid #d5d5d5;background-color:#ffffff;padding:5px 5px;font-size:11px;">&nbsp;
					</td>
				</tr>
			</table>
			<table style="width:98%;margin-bottom:10px;margin-top:0px;border-top:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-left:0px solid #d5d5d5;" align="center">
				<colgroup>
					<col style="width:22%">
					<col style="width:27%">
					<col style="width:27%">
					<col style="width:25%">
				</colgroup>
				<tr style="height:30px;">
					<th style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;padding:5px 5px;font-size:11px;color:red;background-color:#ffffff;">${strTotal}</th>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;text-align:right;background-color:#ffffff;padding:5px 5px;font-size:11px;">
																290,000
					</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-top:0px solid #d5d5d5;background-color:#ffffff;padding:5px 5px;font-size:11px;color:red;">
						680,000
					</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-top:0px solid #d5d5d5;background-color:#ffffff;padding:5px 5px;font-size:11px;">
						<font style="color:red;">402,345</font>
					</td>
				</tr>
			</table>
		</div>
	</td>
	`;
	$("#div_realtimebet").append(tag1+tag2);
}

function AddTable(iHeader, iInput, iOutput, iCash, aObject, iRootClass, hidden)
{
	console.log(`AddTable`);
	console.log(aObject);

	let objectValue = GetTotalBWR(aObject.kBettingInfo);

	let iTotalBetting = objectValue.iBetting;
	let iTotalWin = objectValue.iWin;
	let iTotalRolling = objectValue.iRolling;
	let iTotal = objectValue.iTotal;

	// +/- 모두 나와야함
	if (hidden != undefined && hidden == true) {
		const total = parseFloat(iTotalBetting ?? 0);
		const input = parseFloat(aObject.iInput ?? 0);
		const exchange = parseFloat(aObject.iExchange ?? 0);
		const output = parseFloat(aObject.iOutput ?? 0);

		if (total == 0 && input == 0 && exchange == 0 && output == 0) {
			return '';
		}
	}

	var tag = `<tr>`;
	let fontWeight = 'font-weight:normal;';

	//	합계
	if ( iHeader == 0 )
	{
		tag = `<tr style="font-weight: bold;">`;
		fontWeight = 'font-weight: bold;';
		tag += `<td>${strTotal}</td>`;
	}
	else
	{
		tag += `<td><a style="font-size:17px;">${iHeader}</a></td>`
	}

	tag += `<td><a style="${fontWeight}">${GetNumber(aObject.iInput)}</a></td>`;
	tag += `<td><a style="${fontWeight}">${GetNumber(aObject.iOutput)}</a></td>`;
	const input = parseFloat(aObject.iInput ?? 0);
	const output = parseFloat(aObject.iOutput ?? 0);
	const cal = input - output;
	tag += `<td><a style="${fontWeight}">${GetNumberSign(cal)}</a></td>`;
	tag += `<td><a style="${fontWeight}">${GetNumber(aObject.iTotalCash)}</a></td>`;

	tag += `<td style="text-align:right;">`;
	tag += `<a style="${fontWeight}">${GetNumber(iTotalBetting)}</a><br>`;
	tag += `<a style="${fontWeight}"><font color="red">${GetNumber(iTotalWin)}</font></a><br>`;
	tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(iTotalRolling, iRootClass)}">${GetNumber(iTotalRolling)}</font></a><br>`;
	tag += `<a style="${fontWeight}"><font color="${GetClassColor(iTotal, iRootClass)}">${GetNumber(iTotal)}</font></a><br>`;
	tag += `</td>`;

	tag += `<td style="color:red; ${fontWeight}"><a>${strBetting}<br>${strWin}<br>${strRolling}<br>${strTotal}<br></a></td>`;

	let listGroup = GetBettingGroup(aObject.kBettingInfo);

	console.log(listGroup);

	for ( let i in listGroup )
	{
		tag += `<td style="text-align:right;">`;
		tag += `<a style="${fontWeight}">${GetNumber(listGroup[i].iBetting)}</a><br>`;
		tag += `<a style="${fontWeight}"><font color="red">${GetNumber(listGroup[i].iWin)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(listGroup[i].iRolling, iRootClass)}">${GetNumber(listGroup[i].iRolling)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassColor(listGroup[i].iTotal, iRootClass)}">${GetNumber(listGroup[i].iTotal)}</font></a><br>`;
		tag += `</td>`;
	}
	tag += `</tr>`;

	return tag;
}

function AddTableOwner(iHeader, iInput, iOutput, iCash, aObject, iRootClass)
{
	console.log(`AddTableOwner`);
	console.log(aObject);

	let objectValue = GetTotalBWR(aObject.kBettingInfo);

	let iTotalBetting = objectValue.iBetting;
	let iTotalWin = objectValue.iWin;
	let iTotalRolling = objectValue.iRolling;
	let iTotal = objectValue.iTotal;

	var tag = `<tr>`;
	let fontWeight = 'font-weight:100;';

	//	합계
	if ( iHeader == 0 )
	{
		tag = `<tr style="font-weight: bold;">`;
		fontWeight = 'font-weight: bold;';
		tag += `<td>${strTotal}</td>`;
	}
	else
	{
		tag += `<td><a style="font-size:17px;">${iHeader}</a></td>`
	}

	tag += `<td><a style="${fontWeight}">${GetNumber(aObject.iInput)}</a></td>`;
	tag += `<td><a style="${fontWeight}">${GetNumber(aObject.iOutput)}</a></td>`;
	tag += `<td><a style="${fontWeight}">${GetNumberSign(parseFloat(aObject.iInput) - parseFloat(aObject.iOutput))}</a></td>`;
	tag += `<td><a style="${fontWeight}">${GetNumber(aObject.iTotalCash)}</a></td>`;

	tag += `<td style="text-align:right;">`;
	tag += `<a style="${fontWeight}">${GetNumber(iTotalBetting)}</a><br>`;
	if (iTotalBetting > 0) {
		tag += `<a style="${fontWeight}"><font color="red">${GetNumber(iTotalWin)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(iTotalRolling, iRootClass)}">${GetNumber(iTotalRolling)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassColor(iTotal, iRootClass)}">${GetNumber(iTotal)}</font></a><br>`;
	} else {
		tag += `<a style="${fontWeight}"><font color="red">${GetNumber(0)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(0, iRootClass)}">${GetNumber(0)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassColor(0, iRootClass)}">${GetNumber(0)}</font></a><br>`;
	}

	tag += `</td>`;

	tag += `<td style="color:red; ${fontWeight}"><a>${strBetting}<br>${strWin}<br>${strRolling}<br>${strTotal}<br></a></td>`;

	let listGroup = GetBettingGroup(aObject.kBettingInfo);

	console.log(listGroup);

	for ( let i in listGroup )
	{
		if (iTotalBetting > 0) {
			tag += `<td style="text-align:right;">`;
			tag += `<a style="${fontWeight}">${GetNumber(listGroup[i].iBetting)}</a><br>`;
			tag += `<a style="${fontWeight}"><font color="red">${GetNumber(listGroup[i].iWin)}</font></a><br>`;
			tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(listGroup[i].iRolling, iRootClass)}">${GetNumber(listGroup[i].iRolling)}</font></a><br>`;
			tag += `<a style="${fontWeight}"><font color="${GetClassColor(listGroup[i].iTotal, iRootClass)}">${GetNumber(listGroup[i].iTotal)}</font></a><br>`;
			tag += `</td>`;
		} else {
			tag += `<td style="text-align:right;">`;
			tag += `<a style="${fontWeight}">${GetNumber(0)}</a><br>`;
			tag += `<a style="${fontWeight}"><font color="red">${GetNumber(0)}</font></a><br>`;
			tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(0, iRootClass)}">${GetNumber(0)}</font></a><br>`;
			tag += `<a style="${fontWeight}"><font color="${GetClassColor(0, iRootClass)}">${GetNumber(0)}</font></a><br>`;
			tag += `</td>`;
		}

	}
	tag += `</tr>`;

	return tag;
}

let AddOverviewTableHeader = () => {

	return `
	<table class="search_list" style="margin-bottom:20px;">
		<thead>
			<tr>
				<th width="5%" rowspan="2">${strDate}</th>
				<th width="10%" rowspan="2">${strInput}</th>
				<th width="10%" rowspan="2">${strOutput}</th>
				<th width="10%" rowspan="2">차액</th>
				<th width="10%" rowspan="2">${strMyCash}</th>
				<th width="10%" rowspan="2">${strTotal}</th>
				<th width="5%" rowspan="2"></th>
				<th width="10%" rowspan="11">${strBaccarat}</th>
				<th width="10%" rowspan="2">${strUnderOver}</th>
				<th width="10%" rowspan="2">${strSlot}</th>
				<th width="10%" rowspan="2">${strPowerBall}</th>
			</tr>
		</thead>
		<tbody>`;

}

function SetOverviewUser(aObject, strParentTag, bClear, iRootClass)
{
	if ( bClear == true )
		$(strParentTag).empty();

	let tag = AddOverviewTableHeader();

	console.log(aObject);

	tag += AddTableOwner(aObject.strDate, 0, 0, 0, aObject, iRootClass);

	let listGroup = GetBettingGroup(aObject.kBettingInfo);

	let iBetting = listGroup[0].iBetting + listGroup[1].iBetting;
	let iSlotBetting = listGroup[2].iBetting;
	let iPBBetting = listGroup[3].iBetting;
	let totalBet = iBetting + iSlotBetting + iPBBetting;

	let iWin = listGroup[0].iWin + listGroup[1].iWin;
	let iSlotWin = listGroup[2].iWin;
	let iPBWin = listGroup[3].iWin;

	let iTotal = listGroup[0].iTotal + listGroup[1].iTotal;
	let iSlotTotal = listGroup[2].iTotal;
	let iPBTotal = listGroup[3].iTotal;
	let iWinLose = listGroup[0].iTotal + listGroup[0].iRolling + listGroup[1].iTotal + listGroup[1].iRolling;
	let iSlotWinLose = listGroup[2].iTotal + listGroup[2].iRolling;
	let iPBWinLose = listGroup[3].iTotal + listGroup[3].iRolling;

	let iRolling = listGroup[0].iRolling + listGroup[1].iRolling;;
	let iSlotRolling = listGroup[2].iRolling;
	let iPBRolling = listGroup[3].iRolling;
	let iMyRollingMoney = iRolling + iSlotRolling + iPBRolling;
	// 정산관리 > 배팅내역의 Overview > 롤링값은 대본사 이하는 본인의 롤링만 표시(본사 이상은 전체 토탈로 표시)
	if (aObject.iClass >= 4) {
		iMyRollingMoney = aObject.iMyRollingMoney ?? 0;
	}

	if (totalBet == 0) {
		iTotal = 0;
		iRolling = 0;
		iSlotRolling = 0;
		iPBRolling = 0;
		iMyRollingMoney = 0;
	}

	tag +=
		`
				<thead>
				<tr>
					<th width="5%"></th>
					<th width="10%" style="text-align:center;">${strBetting}</th>
					<th width="10%" style="text-align:center;">${strWin}</th>
					<th width="10%" style="text-align:center;">${strWinLose}</th>
					<th width="10%" style="text-align:center;">${strCommission}</th>
					<th width="10%" style="text-align:center;">${strTotal}</th>
					<th width="5%"></th>
					<th width="10%" style="text-align:center;">롤링</th>
					<th width="10%" style="text-align:center;">미전환롤링</th>
					<th width="10%" style="text-align:center;">죽장합</th>
					<th width="10%" style="text-align:center;"></th>

				</tr>
				</thead>
				<tbody>
					<tr>
						<td style="text-align:center;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD; font-weight: bold;vertical-align: top;">
							B<br>
							S<br>
							P
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:black;">${GetNumber(iBetting)}</font>
							<br>
							<font style="color:black;">${GetNumber(iSlotBetting)}</font>
							<br>
							<font style="color:black;">${GetNumber(iPBBetting)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:red;">${GetNumber(iWin)}</font>
							<br>
							<font style="color:red;">${GetNumber(iSlotWin)}</font>
							<br>
							<font style="color:red;">${GetNumber(iPBWin)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:${GetClassColor(iWinLose, iRootClass)};">${GetNumber(iWinLose)}</font>
							<br>
							<font style="color:${GetClassColor(iSlotWinLose, iRootClass)};">${GetNumber(iSlotWinLose)}</font>
							<br>
							<font style="color:${GetClassColor(iPBWinLose, iRootClass)};">${GetNumber(iPBWinLose)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:${GetClassSettleColor(iRolling, iRootClass)};">${GetNumber(iRolling)}</font>
							<br>
							<font style="color:${GetClassSettleColor(iSlotRolling, iRootClass)};">${GetNumber(iSlotRolling)}</font>
							<br>
							<font style="color:${GetClassSettleColor(iPBRolling, iRootClass)};">${GetNumber(iPBRolling)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:${GetClassColor(iTotal, iRootClass)};">${GetNumber(iTotal)}</font>
							<br>
							<font style="color:${GetClassColor(iSlotTotal, iRootClass)};">${GetNumber(iSlotTotal)}</font>
							<br>
							<font style="color:${GetClassColor(iPBTotal, iRootClass)};">${GetNumber(iPBTotal)}</font>
						</td>
						<td>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;">
							<font style="color:${GetClassSettleColor(iMyRollingMoney, iRootClass)};">${GetNumber(iMyRollingMoney, '0')}</font>
						</td>
						<td style="text-align:right;padding-right:5px;background-color:#FFFACD;">
							<font style="color:${GetClassSettleColor(aObject.iRolling, iRootClass)};">${GetNumber(aObject.iRolling)}</font>
						</td>
						<td style="text-align:right;padding-right:5px;background-color:#FFFACD;">
							<font style="color:${GetClassSettleColor(aObject.iSettle, iRootClass)};">${GetNumber(aObject.iSettle)}</font>
						</td>
						<td style="text-align:right;padding-right:5px;background-color:#FFFACD;">
							<font style="color:black;"></font>
						</td>
					</tr>
				</tbody>
	`;

	tag += `
		</tbody>
	</table>
	`;

	$(strParentTag).append(tag);
}
function SetOverview(aObject, strParentTag, bClear, iRootClass)
{
	if ( bClear == true )
		$(strParentTag).empty();

	let tag = AddOverviewTableHeader();

	console.log(aObject);

	tag += AddTable(aObject.strDate, 0, 0, 0, aObject, iRootClass);

	let listGroup = GetBettingGroup(aObject.kBettingInfo);

	let iBetting = listGroup[0].iBetting + listGroup[1].iBetting;
	let iSlotBetting = listGroup[2].iBetting;
	let iPBBetting = listGroup[3].iBetting;
	let iWin = listGroup[0].iWin + listGroup[1].iWin;
	let iSlotWin = listGroup[2].iWin;
	let iPBWin = listGroup[3].iWin;
	let iRolling = listGroup[0].iRolling + listGroup[1].iRolling;
	let iSlotRolling = listGroup[2].iRolling;
	let iPBRolling = listGroup[3].iRolling;
	let iTotal = listGroup[0].iTotal + listGroup[1].iTotal;
	let iSlotTotal = listGroup[2].iTotal;
	let iPBTotal = listGroup[3].iTotal;
	let iWinLose = listGroup[0].iTotal + listGroup[0].iRolling + listGroup[1].iTotal + listGroup[1].iRolling;
	let iSlotWinLose = listGroup[2].iTotal + listGroup[2].iRolling;
	let iPBWinLose = listGroup[3].iTotal + listGroup[3].iRolling;

	let iMyRollingMoney = iRolling + iSlotRolling + iPBRolling;
	// 정산관리 > 배팅내역의 Overview > 롤링값은 대본사 이하는 본인의 롤링만 표시(본사 이상은 전체 토탈로 표시)
	if (aObject.iClass >= 4) {
		iMyRollingMoney = aObject.iMyRollingMoney ?? 0;
	}

	tag +=
		`
				<thead>
				<tr>
					<th width="5%"></th>
					<th width="10%" style="text-align:center;">${strBetting}</th>
					<th width="10%" style="text-align:center;">${strWin}</th>
					<th width="10%" style="text-align:center;">${strWinLose}</th>
					<th width="10%" style="text-align:center;">${strCommission}</th>
					<th width="10%" style="text-align:center;">${strTotal}</th>
					<th width="5%"></th>
					<th width="10%" style="text-align:center;">롤링</th>
					<th width="10%" style="text-align:center;">미전환롤링</th>
					<th width="10%" style="text-align:center;">죽장합</th>
					<th width="10%" style="text-align:center;"></th>

				</tr>
				</thead>
				<tbody>
					<tr>
						<td style="text-align:center;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD; font-weight: bold;vertical-align: top;">
							B<br>
							S<br>
							P
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:black;">${GetNumber(iBetting)}</font>
							<br>
							<font style="color:black;">${GetNumber(iSlotBetting)}</font>
							<br>
							<font style="color:black;">${GetNumber(iPBBetting)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:red;">${GetNumber(iWin)}</font>
							<br>
							<font style="color:red;">${GetNumber(iSlotWin)}</font>
							<br>
							<font style="color:red;">${GetNumber(iPBWin)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:${GetClassColor(iWinLose, iRootClass)};">${GetNumber(iWinLose)}</font>
							<br>
							<font style="color:${GetClassColor(iSlotWinLose, iRootClass)};">${GetNumber(iSlotWinLose)}</font>
							<br>
							<font style="color:${GetClassColor(iPBWinLose, iRootClass)};">${GetNumber(iPBWinLose)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:${GetClassSettleColor(iRolling, iRootClass)};">${GetNumber(iRolling)}</font>
							<br>
							<font style="color:${GetClassSettleColor(iSlotRolling, iRootClass)};">${GetNumber(iSlotRolling)}</font>
							<br>
							<font style="color:${GetClassSettleColor(iPBRolling, iRootClass)};">${GetNumber(iPBRolling)}</font>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;vertical-align: top;">
							<font style="color:${GetClassColor(iTotal, iRootClass)};">${GetNumber(iTotal)}</font>
							<br>
							<font style="color:${GetClassColor(iSlotTotal, iRootClass)};">${GetNumber(iSlotTotal)}</font>
							<br>
							<font style="color:${GetClassColor(iPBTotal, iRootClass)};">${GetNumber(iPBTotal)}</font>
						</td>
						<td>
						</td>
						<td style="text-align:right;padding-top: 5px; padding-bottom: 5px;padding-right:5px;background-color:#FFFACD;">
							<font style="color:${GetClassSettleColor(iMyRollingMoney, iRootClass)};">${GetNumber(iMyRollingMoney, '0')}</font>
						</td>
						<td style="text-align:right;padding-right:5px;background-color:#FFFACD;">
							<font style="color:${GetClassSettleColor(aObject.iRolling, iRootClass)};">${GetNumber(aObject.iRolling)}</font>
						</td>
						<td style="text-align:right;padding-right:5px;background-color:#FFFACD;">
							<font style="color:${GetClassSettleColor(aObject.iSettle, iRootClass)};">${GetNumber(aObject.iSettle)}</font>
						</td>
						<td style="text-align:right;padding-right:5px;background-color:#FFFACD;">
							<font style="color:black;"></font>
						</td>
					</tr>
				</tbody>
	`;

	tag += `
		</tbody>
	</table>
	`;

	$(strParentTag).append(tag);
}

function SetOverviewRecordList(aObject, strParentTag, bClear, iRootClass)
{
	if ( bClear == true )
		$(strParentTag).empty();

	let tag = `
	<div id="table_record_list" class="day_tot_list_area" style="margin-top:20px;">`;
	tag += AddOverviewTableHeader();

	console.log(`SetOverviewRecordList Length : ${aObject.length}`);

	let object = aObject[aObject.length-1];
	console.log(`asdfasdfasdfasdfasdfasdfasdf`);
	console.log(object);

	//	For Total
	let listTotal = [];
	for ( let i = 0; i < 4; ++ i )
	{
		listTotal.push({iBetting:0, iWin:0, iRolling:0, iTotal:0});
	}

	for ( var root = 0; root < aObject.length-1; ++root)
	{
		var tObject = aObject[root];
		console.log(tObject);
		let row = AddTable(aObject[root].strDate, 0, 0, 0, tObject, iRootClass, false);
		if (row != '') {
			tag += row;
		}

		console.log(`## AddTable`);
		console.log(tObject);

		for ( let i in tObject.kBettingInfo ) {
			object.kBettingInfo.push(tObject.kBettingInfo[i]);
		}

		object.iExchange += parseFloat(tObject.iExchange);
		object.iInput += parseFloat(tObject.iInput);
		object.iOutput += parseFloat(tObject.iOutput);
	}
	//	For Total
	tag += AddTable('', 0, 0, 0, object, iRootClass);

	tag += `
			</tbody>
		</table>
	</div>
	`;

	$(strParentTag).append(tag);
}

function ConvertRoomData(aObject)
{
	var list = [];
	for ( var i = 0; i < 16; ++i)
	{
		list.push({iBetting:0, iWin:0, iRolling:0});
	}
	for (var i in aObject)
	{
		list[aObject[i].iTarget].iBetting += aObject[i].iBetting;
		list[aObject[i].iTarget].iWin += aObject[i].iWin;
		list[aObject[i].iTarget].iRolling += aObject[i].iRolling;
	}

	return list;
}

function SetRoomRecord(aObject)
{
	var tObject = ConvertRoomData(aObject);

	$("#div_room_record").empty();

	var tag1 =
		`
	<td style="background-color:#ffffff;padding:2px 2px 2px 15px;text-align:center;" valign="top" id="result_con_3">

		<div style="text-align:center;">
			<p>${aObject[0].iGameCode+1}</p>
			<table style="width:83%;margin-bottom:5px;border-top:2px solid #d5d5d5;border-right:2px solid #d5d5d5;border-bottom:2px solid #d5d5d5;border-left:2px solid #d5d5d5;cursor:pointer;" align="center" onclick="go_history_pop('239','2','','','2022-01-10');">
			<colgroup>
				<col style="width:26%">
				<col style="width:37%">
				<col style="width:37%">
				<col style="width:37%">
			</colgroup>
				<tr>
					<th style="padding:5px 5px;font-size:11px;border-bottom:0px solid #d5d5d5;border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;">종류</th>
					<th style="border-right:0px solid #d5d5d5;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;">배팅머니</th>
					<th style="border-right:0px solid #d5d5d5;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;">승리머니</th>
					<th style="border-right:0px solid #d5d5d5;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;">롤링머니</th>
				</tr>
				`;

	const target = ['T', 'P', 'P언더', 'P오버', 'B', 'B언더', 'B오버', 'P페어', 'B페어', 'E페어', '퍼펙트페어'];

	var tag2 = '';
	for ( var i = 0; i < 11; ++i )
	{
		tag2 +=
			`<tr>
					<th style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;padding:5px 5px;background-color:#EAEAEA;font-size:11px;border-bottom:0px solid #d5d5d5;">${target[i]}</th>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;background-color:#FFFFFF;padding:5px 5px;font-size:11px;border-left:0px solid #d5d5d5;">${tObject[i].iBetting.toLocaleString()}
																</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-left:0px solid #d5d5d5;background-color:#FFFFFF;padding:5px 5px;font-size:11px;">${tObject[i].iWin.toLocaleString()}
																</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-left:0px solid #d5d5d5;background-color:#FFFFFF;padding:5px 5px;font-size:11px;">${tObject[i].iRolling.toLocaleString()}
					</td>
																</tr>`;
	}

	var tag3 = `
			</table>
			<table style="width:98%;margin-bottom:0px;margin-top:5px;border-top:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-left:0px solid #d5d5d5;" align="center">
				<colgroup>
					<col style="width:22%">
					<col style="width:31%">
					<col style="width:47%">
				</colgroup>
				<tr style="height:30px;">
					<th style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;padding:5px 5px;font-size:11px;color:blue;background-color:#ffffff;">${strTotal}</th>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;text-align:right;background-color:#ffffff;padding:5px 5px;font-size:11px;color:red;">
						12,345
					</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-top:0px solid #d5d5d5;background-color:#ffffff;padding:5px 5px;font-size:11px;">&nbsp;
					</td>
				</tr>
			</table>
			<table style="width:98%;margin-bottom:10px;margin-top:0px;border-top:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-left:0px solid #d5d5d5;" align="center">
				<colgroup>
					<col style="width:22%">
					<col style="width:27%">
					<col style="width:27%">
					<col style="width:25%">
				</colgroup>
				<tr style="height:30px;">
					<th style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;padding:5px 5px;font-size:11px;color:red;background-color:#ffffff;">${strTotal}</th>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;border-top:0px solid #d5d5d5;text-align:right;background-color:#ffffff;padding:5px 5px;font-size:11px;">
																290,000
					</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-top:0px solid #d5d5d5;background-color:#ffffff;padding:5px 5px;font-size:11px;color:red;">
						680,000
					</td>
					<td style="border-left:0px solid #d5d5d5;border-right:0px solid #d5d5d5;border-bottom:0px solid #d5d5d5;text-align:right;border-top:0px solid #d5d5d5;background-color:#ffffff;padding:5px 5px;font-size:11px;">
						<font style="color:red;">402,345</font>
					</td>
				</tr>
			</table>
		</div>
	</td>
	`;
	$("#div_room_record").append(tag1+tag2);


}

function Init(strParentTag)
{
	$(strParentTag).empty();
}

var response_list = [];

function AddPartner(iRootClass, aObject, bDisableRolling, iPermission)
{
	var color = '#ffffff';
	let bInputDisable = false;
	switch(aObject.iClass)
	{
		case EAgent.eProAdmin:
			headtag = `<td>┗</td><td>─</td><td>─</td><td>─</td>`;
			// bInputDisable = true;
			break;
		case EAgent.eViceAdmin:
			headtag = `<td></td><td>┗</td><td>─</td><td>─</td>`;
			// bInputDisable = true;
			if ( iRootClass != EAgent.eViceAdmin )
				// color = 'rgb(255, 223, 188)';
				color = '#c9c9c4';
			break;
		case EAgent.eAgent:
			headtag = `<td></td><td></td><td>┗</td><td>─</td>`;
			if ( iRootClass != EAgent.eAgent )
				color = '#ece7ab';
			break;
		case EAgent.eShop:
			headtag = `<td></td><td></td><td></td><td>┗</td>`;
			if ( iRootClass != EAgent.eShop )
				color = '#f3e9d9';
			break;
		case EAgent.eUser:
			if ( iRootClass != EAgent.eUser )
				color = 'rgb(190, 255, 212)';
			break;
	}

	var tagoption = 'disabled="disabled"';
	if ( bDisableRolling == false )
		tagoption = '';

	if ( bInputDisable == true )
		tagoption = tagoption == '' ? 'disabled="disabled"' : '';

	var subtag = `

	<tr id=${aObject.strNickname} class='Agent'>

	
		<input type='hidden' id='iClass${aObject.strNickname}' value='${aObject.iClass}' >`

	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumViceAdmins)}</td>`;

	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumAgents)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumShops)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumUsers)}</td>`;

	if (iRootClass <= 3 && iPermission != 100 ) {
		subtag += `
		
			<td style="background-color:${color};"  class="parent_row_31">
			
			<a href="javascript:RequestPartnerInfo('${aObject.strNickname}', '${aObject.strGroupID}', '${aObject.iClass}');"  style="color:blue;">${aObject.strID}</a>
			
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
			
			<a id="request_partneragents" href="javascript:RequestPartnerAgent('${aObject.strNickname}', '${aObject.strGroupID}', '${aObject.iClass}', ${bDisableRolling});"  style="color:blue;">${aObject.strNickname}</a>
			
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:40%;" name="slot_slot_31" id="fSlot${aObject.strNickname}" required="no" message="슬롯 로링비" value=${aObject.fSlotR} ${tagoption}>
				%
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_bakara_31" id="fBaccarat${aObject.strNickname}" required="no" message="바카라 로링비" value=${aObject.fBaccaratR} ${tagoption}>
				%
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_over_31" id="fUnderOver${aObject.strNickname}" required="no" message="언오버 로링비" value=${aObject.fUnderOverR} ${tagoption}>
				%
			</td>
			`;
		subtag += `
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_over_31" id="fSettleBaccarat${aObject.strNickname}" required="no" message="바카라 죽장" value=${aObject.fSettleBaccarat ?? 0} ${tagoption}>%
			</td>
		
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_over_31" id="fSettleSlot${aObject.strNickname}" required="no" message="슬롯 죽장" value=${aObject.fSettleSlot ?? 0} ${tagoption}>%
			</td>
		`;
	} else {
		subtag += `
		
			<td style="background-color:${color};"  class="parent_row_31">
			
			<a href="javascript:RequestPartnerInfo('${aObject.strNickname}', '${aObject.strGroupID}', '${aObject.iClass}');"  style="color:blue;">${aObject.strID}</a>
			
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
			
			<a id="request_partneragents" href="javascript:RequestPartnerAgent('${aObject.strNickname}', '${aObject.strGroupID}', '${aObject.iClass}', ${bDisableRolling});"  style="color:blue;">${aObject.strNickname}</a>
			
			</td>

			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:40%;" name="slot_slot_31" id="fSlot${aObject.strNickname}" required="no" message="슬롯 로링비" value=${aObject.fSlotR} ${tagoption} disabled>
				%
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_bakara_31" id="fBaccarat${aObject.strNickname}" required="no" message="바카라 로링비" value=${aObject.fBaccaratR} ${tagoption} disabled>
				%
			</td>
	
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_over_31" id="fUnderOver${aObject.strNickname}" required="no" message="언오버 로링비" value=${aObject.fUnderOverR} ${tagoption} disabled>
				%
			</td>`;

		subtag += `
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_over_31" id="fSettleBaccarat${aObject.strNickname}" required="no" message="바카라 죽장" value=${aObject.fSettleBaccarat ?? 0} ${tagoption} disabled>%
			</td>
		
			<td style="background-color:${color};"  class="parent_row_31">
				<input type="number" step="0.01" style="width:50%;" name="bakara_over_31" id="fSettleSlot${aObject.strNickname}" required="no" message="슬롯 죽장" value=${aObject.fSettleSlot ?? 0} ${tagoption} disabled>%
			</td>
		`;
	}

	if ( aObject.iInput != 0)
		subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iInput)}</td>`;
	else
		subtag += `<td style="background-color:${color};"  class="parent_row_31"></td>`;

	if ( aObject.iOutput != 0 )
		subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iOutput)}</td>`;
	else
		subtag += `<td style="background-color:${color};"  class="parent_row_31"></td>`;

	if ( aObject.iTotalMoney != 0 )
		subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iTotalMoney)}</td>`;
	else
		subtag += `<td style="background-color:${color};"  class="parent_row_31"></td>`;

	if ( iRootClass <= 3 ) {
		let iWinLose = ((parseFloat(aObject.iBaccaratTotal) + parseFloat(aObject.iUnderOverTotal) + parseFloat(aObject.iSlotTotal)) - (parseFloat(aObject.iBaccaratRollingMoney) + parseFloat(aObject.iUnderOverRollingMoney) + parseFloat(aObject.iSlotRollingMoney)));
		iWinLose = iWinLose + (parseFloat(aObject.iPBTotal) - parseFloat(aObject.iPBRollingMoney));
		subtag += `<td style="background-color:${color};"  class="parent_row_31"><font color="${GetClassColor(iWinLose, iRootClass)}">${GetNumber((iWinLose))}</font></td>`;
	}

	let iRolling = parseFloat(aObject.iRollingMoney);
	//let iTotal = parseFloat(aObject.iBaccaratTotal) + parseFloat(aObject.iUnderOverTotal) + parseFloat(aObject.iSlotTotal) + parseFloat(aObject.iPBTotal);
	let iTotal = aObject.iTotal;
	subtag += `<td style="background-color:${color}; class="parent_row_31"><font color="${GetClassSettleColor(iRolling, iRootClass)}">${GetNumber(iRolling)}</font></td>`;

	subtag += `<td style="background-color:${color};"  class="parent_row_31"><a><font color="${GetClassColor(iTotal, iRootClass)}">${GetNumber(iTotal)}</font></a></td>`;
	let iCurrentMyRolling = parseFloat(aObject.iMyRollingMoney);

	if ( iCurrentMyRolling != 0)
		subtag += `<td style="background-color:${color};"  class="parent_row_31"><font color="${GetClassSettleColor(iCurrentMyRolling, iRootClass)}">${GetNumber(iCurrentMyRolling)}</font></td>`;
	else
		subtag += `<td style="background-color:${color};"  class="parent_row_31"></td>`;

	if ( aObject.iClass == '4' )
		subtag += `<td style="background-color:${color};"  class="parent_row_31"><font color="${GetClassSettleColor(aObject.iCurrentRollingTotal, iRootClass)}">${GetNumber(aObject.iCurrentRollingTotal)}</font></td>`;
	else
		subtag += `<td style="background-color:${color};"  class="parent_row_31"><font color="${GetClassSettleColor(aObject.iCurrentRolling, iRootClass)}">${GetNumber(aObject.iCurrentRolling)}</font></td>`;

	//	미전환죽장(전월이월이 있을 경우 전월이월 표시)
	let iCurrentSettle = parseFloat(aObject.iCurrentSettle ?? 0);
	let iCurrentSettleAcc = parseFloat(aObject.iCurrentSettleAcc ?? 0);
	iCurrentSettle += iCurrentSettleAcc;
	if (iCurrentSettle < 0) {
		subtag += `<td style="background-color:${color};"  class="parent_row_31"><font color="black">${GetNumberSign(iCurrentSettle)}</font></td>`;
	} else {
		subtag += `<td style="background-color:${color};"  class="parent_row_31"><font color="${GetClassSettleColor(iCurrentSettle, iRootClass)}">${GetSettleNumber(iCurrentSettle)}</font></td>`;
	}

	if ( iRootClass <= 3 && iPermission != 100 )
	{
		subtag += `<td style="background-color:${color};"  class="parent_row_31">
                <a style="border: 1px solid green;display:inline-block;font-weight:bold;border-radius:4px;background-color:blue;width:30px;color:white;" href="#" id="partner_adjustinput" style="color:white;" strNickname=${aObject.strNickname} strGroupID=${aObject.strGroupID} iClass=${aObject.iClass}>${strInput}</a>
                <a style="border: 1px solid green;display:inline-block;font-weight:bold;border-radius:4px;background-color:red;width:30px;color:white;" href="#" id="partner_adjustoutput" style="color:white;" strNickname=${aObject.strNickname} strGroupID=${aObject.strGroupID} iClass=${aObject.iClass}>${strOutput}</a>
                </td>`;
	}

	if ( aObject.iMyMoney != 0 )
		subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iMyMoney)}</td>`;
	else
		subtag += `<td style="background-color:${color};"  class="parent_row_31"></td>`;

	let strColor = 'rgb(0, 126, 199)';

	if ( aObject.eState == 'BLOCK' )
	{
		strColor = 'rgb(207, 61, 4)';
	}
	else if ( aObject.eState == 'NOTICE' )
	{
		strColor = 'rgb(207, 100, 4)';
	}

	let tagState = '';
	if (iRootClass <= 3 && iPermission != 100)
	{
		tagState = `
			<td style="background-color:${color};" class="parent_row_31">
				<select style="vertical-align:middle;width:100%;background-color:${strColor}; color:white;" id="partner_agentstatus_${aObject.strNickname}" data-original-value="${aObject.eState}" onchange="OnChangeStatus('${aObject.strNickname}');">
					<option value="NORMAL" ${aObject.eState == 'NORMAL' ? 'selected' : ''}>${strNormal}</option>
					<option value="NOTICE" ${aObject.eState == 'NOTICE' ? 'selected' : ''}>${strNotice}</option>
					<option value="BLOCK" ${aObject.eState == 'BLOCK' ? 'selected' : ''}>${strBlock}</option>
				</select>
			</td>
		`;
	}
	else
	{
		if ( aObject.eState == 'NORMAL' )
		{
			subtag += `<td style="background-color:skyblue;">${strNormal}</td>`;
		}
		else if ( aObject.eState == 'NOTICE' )
		{
			subtag += `<td style="background-color:orange;">${strNotice}</td>`;
		}
		else
		{
			subtag += `<td style="background-color:red;color:white;">${strBlock}</td>`;
		}
	}
	subtag += tagState;

	if ( iRootClass <= 3 && iPermission != 100 )
	{
		subtag += `
			<td class="parent_row_31"> 
				<a href="#" class="list_menu move btn_blue" strNickname=${aObject.strNickname} strGroupID=${aObject.strGroupID} iClass=${aObject.iClass}>${strMove}</a>
			</td>
			<td class="parent_row_31"> 
				<a href="#" class="list_menu removeagent btn_red" strNickname=${aObject.strNickname} strGroupID=${aObject.strGroupID} iClass=${aObject.iClass}>${strRemove}</a>
			</td>`;
	}

	subtag += `</tr>`;

	return subtag;
}

// let OnChangeStatus = (strNickname) => {
// 	console.log(strNickname);
// 	$('#statusChangeModal').show();
// 	let item = $(`#partner_agentstatus_${strNickname}`);
// 	console.log(item.val());


// 	// if (confirm(strConfirmChangeState))
// 	// {
// 	// 	$.ajax({
// 	// 		type:'post',
// 	// 		url: "/manage_partner/request_agentstate",
// 	// 		context: document.body,
// 	// 		data:{strNickname:strNickname, eState:item.val()},

// 	// 		success:function(data) {

// 	// 			location.reload();

// 	// 		}
// 	// 	});

// 	// }
// }

let SetAdminList = (iRootClass, strParentTag, aObject, iPermission) => {

	var tag = "";

	response_list = [];

	let iInput = 0,
		iOutput = 0,
		iTotalMoney = 0,
		iRollingMoney = 0,
		iTotal = 0,
		iMyRollingMoney = 0,
		iLoan = 0,
		iMyMoney = 0,
		iRollingTranslate = 0,
		iSettle = 0,
		iSettleTranslate = 0,
		iWinLose = 0,
		iPBWinLose = 0,
		iCurrentRollingTotal = 0,
		iCurrentSettleTotal = 0
	;

	for ( let i in aObject)
	{
		let subtag = AddAdmin(iRootClass, aObject[i], iPermission);

		response_list.push({me:aObject[i].strNickname, childs:[], visible:true});

		iInput += parseFloat(aObject[i].iInput ?? 0);
		iOutput += parseFloat(aObject[i].iOutput ?? 0);
		iTotalMoney += parseFloat(aObject[i].iTotalMoney);
		iRollingMoney += parseFloat(aObject[i].iRollingMoney);
		iTotal += parseFloat(aObject[i].iTotal);

		iMyRollingMoney += parseFloat(aObject[i].iRollingMoney)-parseFloat(aObject[i].iRollingTranslate);

		iLoan += parseFloat(aObject[i].iLoan);
		iMyMoney += parseFloat(aObject[i].iMyMoney);
		iRollingTranslate += parseFloat(aObject[i].iRollingTranslate);
		iSettle += parseFloat(aObject[i].iSettle);
		iSettleTranslate += parseFloat(aObject[i].iSettleTranslate);

		iWinLose += (parseFloat(aObject[i].iBaccaratTotal) + parseFloat(aObject[i].iUnderOverTotal) + parseFloat(aObject[i].iSlotTotal) + parseFloat(aObject[i].iBaccaratRollingMoney) + parseFloat(aObject[i].iUnderOverRollingMoney) + parseFloat(aObject[i].iSlotRollingMoney));
		iPBWinLose += (parseFloat(aObject[i].iPBTotal) + parseFloat(aObject[i].iPBRollingMoney));
		iWinLose += iPBWinLose;

		iCurrentRollingTotal += parseFloat(aObject[i].iCurrentRollingTotal);
		iCurrentSettleTotal += parseFloat(aObject[i].iCurrentSettleTotal ?? 0);
		tag += subtag;
	}
	$(strParentTag).append(tag);
	for (let i in aObject) {
		checkBlockNum(`#`)
	}

	let colspan = 7;
	if ( iRootClass == EAgent.eViceHQ )
		colspan = 8;
	let color = 'red';
	if ( iTotal > 0 )
		color = 'blue';
	let stateTag = '';
	if (iPermission != 100) {
		stateTag = `<td></td><td></td>`;
	}
	let total_tag = `
		<tr style="font-weight: bold;">
		<td colspan="${colspan}">${strTotal}</td>
		<td>${GetNumber(iInput)}</td>
		<td>${GetNumber(iOutput)}</td>
		<td>${GetNumber(iTotalMoney)}</td>
		<td style="color:${GetColor(iWinLose)}">${GetNumber(iWinLose)}</td>
		<td style="color:red"><font color:red'>${GetNumber(iRollingMoney)}</td>
		<td style="color:${GetColor(iTotal)}">${GetNumber(iTotal)}</td>
		
		<td><font color='red'>${GetNumber(iCurrentRollingTotal)}</font></td>
		<td style="color:${GetInversedColor(iSettle)};color:${GetInversedColor(iCurrentSettleTotal)};">${GetSettleNumber(iCurrentSettleTotal)}</font></td>
	
		<td>${GetNumber(iMyMoney)}</td>
		<td></td>
		${stateTag}
	</tr>
	`;
	$(strParentTag).append(total_tag);
}

let AddAdmin = (iRootClass, aObject, iPermission) => {
	let color = '#ffffff';

	let subtag = `

	<tr id=${aObject.strNickname} class='Agent'>

		<input type='hidden' id='iClass${aObject.strNickname}' value='${aObject.iClass}' >`;

	console.log(iRootClass);
	console.log(EAgent.eViceHQ);

	if ( iRootClass == EAgent.eViceHQ )
		subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumAdmins)}</td>`;


	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumProAdmins)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumViceAdmins)}</td>`;

	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumAgents)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumShops)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iNumUsers)}</td>`;
	subtag += `
		
		<td style="background-color:${color};"  class="parent_row_31">
		
		<a href="#" onclick="RequestPartnerInfo('${aObject.strNickname}', '${aObject.strGroupID}', '${aObject.iClass}'); return false;"  style="color:blue;">${aObject.strID}</a>
		
		</td>
		`;

	if (iPermission != 100) {
		subtag += `
			<td style="background-color:${color};"  class="parent_row_31">
				<a href="#" onclick="OnClickMove('${aObject.strNickname}', '${aObject.strGroupID}', '${aObject.iClass}'); return false;" style="color: blue" class="list_menu">${aObject.strNickname}</a>
			</td>
		`;
	} else {
		subtag += `
			<td style="background-color:${color};"  class="parent_row_31">
				<a href="#" style="color:blue;"></a>
			</td>
		`;
	}



	let iWinLose = (parseFloat(aObject.iBaccaratTotal) + parseFloat(aObject.iUnderOverTotal) + parseFloat(aObject.iSlotTotal)) + (parseFloat(aObject.iBaccaratRollingMoney) + parseFloat(aObject.iUnderOverRollingMoney) + parseFloat(aObject.iSlotRollingMoney));
	let iPBWinLose = parseFloat(aObject.iPBRollingMoney) + parseFloat(aObject.iPBTotal);
	iWinLose += iPBWinLose;
	let iRolling = (aObject.iRollingMoney);
	let iTotal = (aObject.iTotal);

	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iInput)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iOutput)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iTotalMoney)}</td>`;
	subtag += `<td style="background-color:${color};color:${GetColor(iWinLose)}"  class="parent_row_31">${GetNumber(iWinLose)}</td>`;
	subtag += `<td style="background-color:${color};color:red;"  class="parent_row_31">${GetNumber(iRolling)}</td>`;
	subtag += `<td style="background-color:${color};color:${GetColor(iTotal)}"  class="parent_row_31">${GetNumber(iTotal)}</td>`;

	let iRollingCalc = parseFloat(aObject.iRollingMoney) - parseFloat(aObject.iRollingTranslate);

	subtag += `<td style="background-color:${color};color:red;"  class="parent_row_31">${GetNumber(aObject.iCurrentRollingTotal)}</td>`;
	subtag += `<td style="background-color:${color};color:${GetInversedColor(aObject.iCurrentSettleTotal)};"  class="parent_row_31">${GetSettleNumber(aObject.iCurrentSettleTotal)}</td>`;
	subtag += `<td style="background-color:${color};"  class="parent_row_31">${GetNumber(aObject.iMyMoney)}</td>`;

	let strColor = 'rgb(0, 126, 199)';
	let bgcolor = 'white';

	if (aObject.eState == 'BLOCK') {
		strColor = 'rgb(207, 61, 4)';
		bgcolor = '#fcd7e6';
	}
	else if (aObject.eState == 'NOTICE') {
		strColor = 'rgb(207, 100, 4)';
		bgcolor = '#faecd9';
	}

	if (iPermission != 100) {
		subtag += `
			<td style="background-color:${bgcolor};" class="parent_row_31">
				<select style="vertical-align:middle;width:100%;background-color:${strColor}; color:white;" id="partner_agentstatus_${aObject.strNickname}" data-original-value="${aObject.eState}" onchange="OnChangeStatus('${aObject.strNickname}');">
					<option value="NORMAL" ${aObject.eState == 'NORMAL' ? 'selected' : ''}>${strNormal}</option>
					<option value="NOTICE" ${aObject.eState == 'NOTICE' ? 'selected' : ''}>${strNotice}</option>
					<option value="BLOCK" ${aObject.eState == 'BLOCK' ? 'selected' : ''}>${strBlock}</option>
				</select>
			</td>
		`;

		subtag += `
					<td style="background-color:${color};"class="parent_row_31"> 
						<a href="#" class="list_menu btn_blue move" strNickname=${aObject.strNickname} strGroupID=${aObject.strGroupID} iClass=${aObject.iClass}>${strMove}</a>
					</td>
					<td style="background-color:${color};"class="parent_row_31"> 
						<a href="#" class="list_menu btn_red removeagent" strNickname=${aObject.strNickname} strGroupID=${aObject.strGroupID} iClass=${aObject.iClass}>${strRemove}</a>
					</td>
					</tr>
				`;
	} else {
		if ( aObject.eState == 'NORMAL' ) {
			subtag += `<td style="background-color:${color};"class="parent_row_31">${strNormal}</td>`;
		}
		else if( aObject.eState == 'NOTICE') 
		{
			subtag += `<td style="background-color:${color};"class="parent_row_31">${strNotice}</td>`;
		}
		else {
			subtag += `<td style="background-color:${color};"class="parent_row_31">${strBlock}</td>`;
		}
	}
	return subtag;
}

function AddPartnerList(iRootClass, strBeforeTag, aObject, bDisableRolling, iPermission)
{
	var tag = "";

	for ( var i in aObject)
	{
		var subtag = AddPartner(iRootClass, aObject[i], bDisableRolling, iPermission);

		tag += subtag;
	}
	$(strBeforeTag).after(tag);
}

function SetPartnerList(iRootClass, strParentTag, aObject, bDisableRolling, iPermission, aTotalObject)
{
	console.log(iRootClass);

	var tag = "";

	response_list = [];

	let iInput = 0,
		iOutput = 0,
		iTotalMoney = 0,
		iRollingMoney = 0,
		iTotal = 0,
		iMyRollingMoney = 0,
		iLoan = 0,
		iMyMoney = 0,
		iRollingTranslate = 0,
		iSettle = 0,
		iSettleTranslate = 0,
		iWinLose = 0,
		iWinLose2 = 0,
		iCurrentRolling = 0,
		iCurrentSettle = 0
	;

	for ( var i in aObject)
	{
		var subtag = AddPartner(iRootClass, aObject[i], bDisableRolling, iPermission);

		response_list.push({me:aObject[i].strNickname, childs:[], visible:true});

		iInput += parseFloat(aObject[i].iInput);
		iOutput += parseFloat(aObject[i].iOutput);
		iTotalMoney += parseFloat(aObject[i].iTotalMoney);
		iRollingMoney += (parseFloat(aObject[i].iRollingMoney));
		iTotal += parseFloat(aObject[i].iTotal);
		iMyRollingMoney += (parseFloat(aObject[i].iMyRollingMoney)-parseFloat(aObject[i].iRollingTranslate));
		iLoan += parseFloat(aObject[i].iLoan);
		iMyMoney += parseFloat(aObject[i].iMyMoney);
		iRollingTranslate += parseFloat(aObject[i].iRollingTranslate);
		iSettle += parseFloat(aObject[i].iSettle);
		iSettleTranslate += parseFloat(aObject[i].iSettleTranslate);
		iWinLose += (parseFloat(aObject[i].iBaccaratTotal) + parseFloat(aObject[i].iUnderOverTotal) + parseFloat(aObject[i].iSlotTotal) + parseFloat(aObject[i].iBaccaratRollingMoney) + parseFloat(aObject[i].iUnderOverRollingMoney) + parseFloat(aObject[i].iSlotRollingMoney));
		iWinLose2 += (parseFloat(aObject[i].iPBTotal) + parseFloat(aObject[i].iPBRollingMoney));
		iWinLose += iWinLose2;

		iCurrentRolling += parseFloat(aObject[i].iCurrentRolling);
		iCurrentSettle += parseFloat(aObject[i].iCurrentSettle);

		tag += subtag;
	}
	$(strParentTag).append(tag);

	for ( let i in aObject)
	{
		checkBlockNum(`#fSettleBaccarat${aObject[i].strNickname}`);
		checkBlockNum(`#fSettleSlot${aObject[i].strNickname}`);
		// checkBlockNum(`#fSettlePBA${aObject[i].strNickname}`);
		// checkBlockNum(`#fSettlePBB${aObject[i].strNickname}`);
		checkBlockNum(`#input_${aObject[i].strNickname}`);
		checkBlockCharSpecial2(`#memoinput_${aObject[i].strNickname}`);
	}

	let tagEndSub = ``;

	if ( iRootClass <= 3 && iPermission != 100 )
	{
		tagEndSub = `<td></td><td></td><td></td>`;
	}

	let color = 'red';
	if ( iTotal > 0 )
		color = 'blue';

	if (aTotalObject != null && aTotalObject.length > 0)
	{
		iInput = 0,
			iOutput = 0,
			iTotalMoney = 0,
			iRollingMoney = 0,
			iTotal = 0,
			iMyRollingMoney = 0,
			iLoan = 0,
			iMyMoney = 0,
			iRollingTranslate = 0,
			iSettle = 0,
			iSettleTranslate = 0,
			iWinLose = 0,
			iWinLose2 = 0,
			iCurrentRolling = 0,
			iCurrentSettle = 0
		;
	}

	for ( let i in aTotalObject)
	{
		iInput += parseFloat(aTotalObject[i].iInput);
		iOutput += parseFloat(aTotalObject[i].iOutput);
		iTotalMoney += parseFloat(aTotalObject[i].iTotalMoney);
		iRollingMoney += (parseFloat(aTotalObject[i].iRollingMoney));
		iTotal += parseFloat(aTotalObject[i].iTotal);
		iMyRollingMoney += (parseFloat(aTotalObject[i].iMyRollingMoney)-parseFloat(aTotalObject[i].iRollingTranslate));
		iLoan += parseFloat(aTotalObject[i].iLoan);
		iMyMoney += parseFloat(aTotalObject[i].iMyMoney);
		iRollingTranslate += parseFloat(aTotalObject[i].iRollingTranslate);
		iSettle += parseFloat(aTotalObject[i].iSettle);
		iSettleTranslate += parseFloat(aTotalObject[i].iSettleTranslate);
		iWinLose += ((parseFloat(aTotalObject[i].iBaccaratTotal) + parseFloat(aTotalObject[i].iUnderOverTotal) + parseFloat(aTotalObject[i].iSlotTotal)) - (parseFloat(aTotalObject[i].iBaccaratRollingMoney) + parseFloat(aTotalObject[i].iUnderOverRollingMoney) + parseFloat(aTotalObject[i].iSlotRollingMoney)));
		iWinLose2 += ((aTotalObject[i].iPBTotal) - (aTotalObject[i].iPBRollingMoney));
		iWinLose += iWinLose2;
		iCurrentRolling += parseFloat(iCurrentRolling);
		iCurrentSettle += parseFloat(iCurrentSettle);
	}

	let winloseTag = ``;
	if (iRootClass <= 3) {
		winloseTag = `
			<td><font color="${GetClassColor(iWinLose, iRootClass)}">${GetNumber(iWinLose)}</font></td>
		`;
	}

	let total_tag = `
		<tr style="font-weight: bold">
		<td colspan="11">${strTotal}</td>
		<td>${GetNumber(iInput)}</td>
		<td>${GetNumber(iOutput)}</td>
		<td>${GetNumber(iTotalMoney)}</td>
		${winloseTag}
		<td><font color="${GetClassSettleColor(iRollingMoney, iRootClass)}">${GetNumber(iRollingMoney)}</font></td>
		<td><font color="${GetClassColor(iTotal, iRootClass)}">${GetNumber(iTotal)}</font></td>
		<td><font color='red'></font></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		${tagEndSub}
		</tr>
	`;

	$(strParentTag).append(total_tag);
}

function PartnerToggleVisible(strNickname, visible, object)
{
	for ( var j in object.childs)
	{
		object.childs[j].visible = visible;

		if ( object.childs[j].visible == true )
			$(`#${object.childs[j].me}`).show();
		else
			$(`#${object.childs[j].me}`).hide();

		PartnerToggleVisible(strNickname, visible, object.childs[j]);
	}
//	}
}

function FindPartner(strNickname, arg_list)
{
	for ( var i = 0; i < arg_list.length; i++)
	{
		if ( arg_list[i].me == strNickname)
		{
			return arg_list[i];
		}

		for ( var j in arg_list[i].childs)
		{
			var value = FindPartner(strNickname, arg_list[i].childs);
			if ( value != null )
				return value;
		}
	}
	return null;
}

function RequestPartnerAgent(strNickname, strGroupID, iClass, bDisableRolling, iPermission)
{
	if ( iClass == EAgent.eShop )
	{
		RequestPartnerUserList(strNickname, strGroupID, iClass, iPermission);
	}
	else
	{
		console.log(`RequestPartnerAgent : ${strNickname}, ${strGroupID}, ${iClass}, ${bDisableRolling} ${iPermission}`);

		let dateStart = $('#datepicker1').val();
		let dateEnd = $('#datepicker2').val();

		console.log(response_list);

		var partner = FindPartner(strNickname, response_list);
		if ( partner!= null && partner.childs.length == 0 )
		{
			console.log(`Find Partner`);

			$.ajax({
				type:'post',
				url: "/manage_partner/request_agents",
				context: document.body,
				async: false,
				data:{strNickname:strNickname, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, iPermission:iPermission},

				success:function(data) {
					let list = data.list;
					for ( let j in list )
					{
						partner.childs.push({me:list[j].strNickname, childs:[], visible:true});
					}
					AddPartnerList(data.iRootClass,`#${strNickname}`, list, bDisableRolling, user.iPermission);
				}
			});
		}
		else if ( partner != null )
		{
			var visible = !partner.childs[0].visible;
			PartnerToggleVisible(strNickname, visible, partner);
		}
	}
}


function RequestPartnerInfo(strNickname, strGroupID, iClass, iPermission)
{
	var scLeft = window.screenLeft + 50;
	var scTop = window.screenTop + 50;
	window.open('', 'popupChkSub', `width=1280, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

	var $form = $('<form></form>');
	$form.attr('action', '/manage_partner_popup/games');
	$form.attr('method', 'post');
	$form.attr('target', 'popupChkSub');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(iPermission)} name="iPermission">`);

	$form.append(idx).append(page).append(category).append(iPermission);
	$form.submit();
}

function RequestPartnerUserList(strNickname, strGroupID, iClass, iPermission)
{
	var scLeft = window.screenLeft + 50;
	var scTop = window.screenTop + 50;
	window.open('', 'popupChk', `width=1280, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

	var $form = $('<form></form>');
	$form.attr('action', '/manage_partner_popup/userlist');
	//$form.attr('action', '/manage_partner_popup/agentinfo');
	$form.attr('method', 'post');
	$form.attr('target', 'popupChk');
	$form.appendTo('body');

	var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);
	var page = $(`<input type="hidden" value="${strGroupID}" name="strGroupID">`);
	var category = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);
	var iPermission = $(`<input type="hidden" value=${parseInt(iPermission)} name="iPermission">`);

	$form.append(idx).append(page).append(category).append(iPermission);
	$form.submit();
}

function RequestMenu(strNickname)
{

}

function RequestRollingOdds(strNickname, iClass)
{
	var fSlot = $(`#fSlot${strNickname}`).val();
	var fBaccarat = $(`#fBaccarat${strNickname}`).val();
	var fUnderOver = $(`#fUnderOver${strNickname}`).val();
	//var fBlackjack = $(`#fBlackjack${strNickname}`).val();

	console.log(`RequestRollingOdds : ${strNickname}, fSlot : ${fSlot}, fBaccarat : ${fBaccarat}, fUnderOver : ${fUnderOver}, fBlackjcak : ${fBlackjack}, iClass : ${iClass}`);

	$.ajax({
		type:'post',
		url: "/manage_partner/request_modifyrollingodds",
		context: document.body,
		//data:{strNickname:strNickname, fSlot:fSlot, fBaccarat:fBaccarat, fUnderOver:fUnderOver, fBlackjack:fBlackjack, iClass:iClass},
		data:{strNickname:strNickname, fSlot:fSlot, fBaccarat:fBaccarat, fUnderOver:fUnderOver, iClass:iClass},

		success:function(data) {

			console.log(data);

		}
	});
}

function OnClickMove(strNickname, strGroupID, iClass) {

	let strWindowName = 'popupVAdmin';
	let strAddress = '/manage_partner/listshop';

	if ( iClass == 2 )
	{
		strWindowName = 'popupViceHQ';
		strAddress = '/manage_partner/listadmin';
	}
	else if ( iClass == 3 )
	{
		strWindowName = 'popupAdmin';
		strAddress = '/manage_partner/listproadmin';
	}
	else if ( iClass == 4 )
	{
		strWindowName = 'popupPAdmin';
		strAddress = '/manage_partner/listviceadmin';
	}
	else if ( iClass == 5 )
	{
		strWindowName = 'popupVAdmin';
		strAddress = '/manage_partner/listagent';

	}
	else if ( iClass == 6 )
	{
		strWindowName = 'popupAgent';
		strAddress = '/manage_partner/listshop';

	}
	else if ( iClass == 7 )
	{
		strWindowName = 'popupShop';
		strAddress = '/manage_user/userlist';
	}

	var scLeft = window.screenLeft + 50;
	var scTop = window.screenTop + 50;
	window.open('', strWindowName, `width=1380, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

	var $form = $('<form></form>');
	$form.attr('action', strAddress);
	$form.attr('method', 'post');
	$form.attr('target', strWindowName);
	$form.appendTo('body');

	var strNicknameV = $(`<input type="hidden" value=${strNickname} name="strNickname">`);
	var strGroupIDV = $(`<input type="hidden" value=${strGroupID} name="strGroupID">`);
	var iClassV = $(`<input type="hidden" value=${parseInt(iClass)} name="iClass">`);

	$form.append(strNicknameV).append(strGroupIDV).append(iClassV);
	$form.submit();
}

function DoApplyRolling(user)
{
	var agents = document.querySelectorAll("tr[class=Agent]");
	console.log(`Agent Length : ${agents.length}`);

	var list = [];

	let fSlotParent = user.fSlotR;
	let fBaccaratParent = user.fBaccaratR;
	let fUnderOverParent = user.fUnderOverR;
	let fPBParent = user.fPBR;
	let fPBSingleParent = user.fPBSingleR;
	let fPBDoubleParent = user.fPBDoubleR;
	let fPBTripleParent = user.fPBTripleR;

	let fSettleBaccaratParent = user.fSettleBaccarat;
	let fSettleSlotParent = user.fSettleSlot;

	for ( var i = 0; i < agents.length; ++i)
	{
		const element = agents[i];

		var fSlot = parseFloat($(`#fSlot${element.id}`).val());
		var fBaccarat = parseFloat($(`#fBaccarat${element.id}`).val());
		var fUnderOver = parseFloat($(`#fUnderOver${element.id}`).val());
		var fPB = 0.0;
		var fPBSingle = 0.0;
		var fPBDouble = 0.0;
		var fPBTriple = 0.0;
		var fSettleBaccarat = parseFloat($(`#fSettleBaccarat${element.id}`).val());
		var fSettleSlot = parseFloat($(`#fSettleSlot${element.id}`).val());

		var iClass = parseInt($(`#iClass${element.id}`).val());
		//
		// if (fSlotParent < fSlot) {
		// 	alert(`[${element.id}] 슬롯 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		// if (fBaccaratParent < fBaccarat) {
		// 	alert(`[${element.id}] 바카라 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		// if (fUnderOverParent < fUnderOver) {
		// 	alert(`[${element.id}] 언더오버 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		// if (fPBParent < fPB) {
		// 	alert(`[${element.id}] 파워A 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		// if (fPBSingleParent < fPBSingle) {
		// 	alert(`[${element.id}] 파워B 단폴 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		// if (fPBDoubleParent < fPBDouble) {
		// 	alert(`[${element.id}] 파워B 투폴 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		// if (fPBTripleParent < fPBTriple) {
		// 	alert(`[${element.id}] 파워B 쓰리폴 롤링값은 상위보다 높을 수 없습니다`);
		// 	return;
		// }
		//
		// fSlotParent = fSlot;
		// fBaccaratParent = fBaccarat;
		// fUnderOverParent = fUnderOver;
		// fPBParent = fPB;
		// fPBSingleParent = fPBSingle;
		// fPBDoubleParent = fPBDouble;
		// fPBTripleParent = fPBTriple;

		if ( element != null )
		{
			list.push(element.id);
			list.push(iClass);
			list.push(fSlot);
			list.push(fBaccarat);
			list.push(fUnderOver);
			list.push(fPB);
			list.push(fPBSingle);
			list.push(fPBDouble);
			list.push(fPBTriple);
			list.push(fSettleBaccarat);
			list.push(fSettleSlot);
		}
	}

	$.ajax({
		type:'post',
		url: "/manage_partner/request_modify_rollingodds_group",
		context: document.body,
		data:{data:JSON.stringify(list)},

		success: (obj) => {
			//alert(obj);
			if ( obj.result == 'OK' )
			{
				alert(strAlertComplete);
			}
			else
			{
				alert(`${strAlertError}\r\n${obj.data}`);
			}
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}



	});
}

function DoApplySettle()
{
	var agents = document.querySelectorAll("tr[class=Agent]");

	var list = [];
	let fParentSettleBaccarat = 100;
	let fParentSettleSlot = 100;
	let fParentSettlePBA = 100;
	let fParentSettlePBB = 100;

	console.log(`Agent Length : ${agents.length}`);

	for ( var i = 0; i < agents.length; ++i)
	{
		const element = agents[i];

		var fSettleBaccarat = parseFloat($(`#fSettleBaccarat${element.id}`).val());
		var fSettleSlot = parseFloat($(`#fSettleSlot${element.id}`).val());
		var fSettlePBA = 0;
		var fSettlePBB = 0;

		var iClass = parseInt($(`#iClass${element.id}`).val());

		if ( element != null )
		{
			list.push(element.id);
			list.push(iClass);
			list.push(fSettleBaccarat);
			list.push(fSettleSlot);
			list.push(fSettlePBA);
			list.push(fSettlePBB);

			fParentSettleBaccarat = fSettleBaccarat;
			fParentSettleSlot = fSettleSlot;
			fParentSettlePBA = fSettlePBA;
			fParentSettlePBB = fSettlePBB;
		}
	}

	console.log(list);

	$.ajax({
		type:'post',
		url: "/manage_partner/request_modify_settle_group",
		context: document.body,
		data:{data:JSON.stringify(list)},

		success: (obj) => {
			//alert(obj);
			if ( obj.result == 'OK' )
			{
				alert(strAlertComplete);
			}
			else
			{
				alert(`${strAlertError}\r\n${obj.data}`);
			}
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}



	});
}

let RequestAdminList = (iTargetClass, strGroupID, iClass, iPermission) => {

	console.log(`FindFromDate strGroupID : ${strGroupID}, iClass : ${iClass}`);

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();
	const strNickname = $('#strSearchNickname').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_agentlist",
		context: document.body,
		data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, strSearchNickname:strNickname},

		success: (obj) => {

			Init("#vadmin_list");
			SetAdminList(iTargetClass, "#vadmin_list", obj.list, obj.iPermission);
		},
		error:function(request,status,error)
		{
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

let RequestAgentList = (iTargetClass, strGroupID, iClass) => {

	console.log(`FindFromDate strGroupID : ${strGroupID}, iClass : ${iClass}`);

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();
	const strNickname = $('#strSearchNickname').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_agentlist",
		context: document.body,
		data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, strSearchNickname:strNickname},

		success: (obj) => {

			Init("#vadmin_list");
			if ( iTargetClass == 4 )
				SetPartnerList(obj.iRootClass, "#vadmin_list", obj.list, false, obj.iPermission, obj.overview);
			else
				SetPartnerList(obj.iRootClass, "#vadmin_list", obj.list, false, obj.iPermission, obj.overview);

			let list = obj.list;
			for ( let i in list)
			{
				checkBlockFloat(`#fSlot${list[i].strNickname}`);
				checkBlockFloat(`#fBaccarat${list[i].strNickname}`);
				checkBlockFloat(`#fUnderOver${list[i].strNickname}`);
				checkBlockFloat(`#fSettleBaccarat${list[i].strNickname}`);
				checkBlockFloat(`#fSettleSlot${list[i].strNickname}`);
			}
		},
		error:function(request,status,error)
		{
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

let RequestBettingRecord = (iTargetClass, strGroupID, iClass, strID) => {

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_bettingrecord",
		context: document.body,
		data:{iTargetClass:iClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, strID:strID},

		success: (obj) => {
			SetOverviewRecordList(obj.record, "#div_realtimebet_overview_record", true, obj.iRootClass);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

let RequestBettingRecordMe = (iTargetClass, strGroupID, iClass, strID) => {

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_bettingrecord_me",
		context: document.body,
		data:{iTargetClass:iClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, strID:strID},

		success: (obj) => {
			SetOverviewRecordList(obj.record, "#div_realtimebet_overview_record", true, obj.iRootClass);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

/**
 * 일자별 토탈
 */
let RequestBettingRecordUser = (iTargetClass, strGroupID, iClass, strNickname) => {

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_bettingrecord_user",
		context: document.body,
		data:{iTargetClass:iClass, strGroupID:strGroupID, iClass:iClass, strNickname:strNickname, dateStart:dateStart, dateEnd:dateEnd},

		success: (obj) => {
			SetOverviewRecordList(obj.record, "#div_realtimebet_overview_record", true, obj.iRootClass);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

let RequestOverview = (iTargetClass, strGroupID, iClass, iPermission, strNickname, strID) => {

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_overview",
		context: document.body,
		data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, iPermission:iPermission, strNickname:strNickname, strID:strID},

		success: (obj) => {

			SetOverview(obj.overview, "#div_realtimebet_overview", true, obj.iRootClass);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

let RequestOverviewUser = (iTargetClass, strGroupID, iClass, strNickname) => {

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_overview_user",
		context: document.body,
		data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, strNickname:strNickname, dateStart:dateStart, dateEnd:dateEnd},

		success: (obj) => {
			SetOverviewUser(obj.overview, "#div_realtimebet_overview", true, obj.iRootClass);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

let RequestOverviewToday = (iTargetClass, strGroupID, iClass, strNickname, strID) => {

	const dateStart = GetCurrentDate();
	const dateEnd = GetCurrentDate();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_overview",
		context: document.body,
		data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, strNickname:strNickname, strID:strID},
		success: (obj) => {
			SetOverview(obj.overview, "#div_realtimebet_overview_today", true, obj.iRootClass);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}