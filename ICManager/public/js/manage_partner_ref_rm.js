function AddTable_RollingMinus(iHeader, iInput, iOutput, iCash, aObject, iRootClass, hidden, fBaccaratR, fUnderOverR, fSlotR)
{
	console.log(`AddTable : BR : ${fBaccaratR}, UOR : ${fUnderOverR}, fSlotR : ${fSlotR}`);
	console.log(aObject);

	let objectValue = GetTotalBWR(aObject.kBettingInfo);

	// let iTotalBetting = objectValue.iBetting;
	// let iTotalWin = objectValue.iWin;
	// let iTotalRolling = objectValue.iRolling;
	// let iTotal = objectValue.iTotal;

	let iTotalBetting = 0;
	let iTotalWin = 0;
	let iTotalRolling = 0;
	let iTotal = 0;

	let listGroup = GetBettingGroup(aObject.kBettingInfo);
	//
	for ( let i in listGroup )
	{
		AdjustBettingGroup(listGroup[i], i, fBaccaratR, fUnderOverR, fSlotR);

		iTotalBetting += listGroup[i].iBetting;
		iTotalWin += listGroup[i].iWin;
		iTotalRolling += listGroup[i].iRolling;

		iTotal += listGroup[i].iTotal;
	}
	//iTotal = iTotalBetting - iTotalWin - iTotalRolling;

	//

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

	//let listGroup = GetBettingGroup(aObject.kBettingInfo);

	//console.log(listGroup);

	for ( let i in listGroup )
	{
		// const iAdjustedRolling = parseInt(listGroup[i].iRolling/1.2);

		// let cTargetRolling = 1.2;
		// if (i == 1 )
		// 	cTargetRolling = 2.0;
		// else if ( i == 2 )
		// 	cTargetRolling = 3.8;

		// const iAdjustedBet = parseInt(iAdjustedRolling * (100/cTargetRolling));
		// const iAdjustedWin = parseInt(listGroup[i].iTotal) - parseInt(iAdjustedBet) + iAdjustedRolling;

		// listGroup[i].iBetting = iAdjustedBet;
		// listGroup[i].iWin = iAdjustedWin;
		// listGroup[i].iRolling = iAdjustedRolling;

		//AdjustBettingGroup(listGroup[i], i);

		tag += `<td style="text-align:right;">`;
		tag += `<a style="${fontWeight}">${GetNumber(listGroup[i].iBetting)}</a><br>`;
		//tag += `<a style="${fontWeight}">${GetNumber(iAdjustedBet)}</a><br>`;
		tag += `<a style="${fontWeight}"><font color="red">${GetNumber(listGroup[i].iWin)}</font></a><br>`;
		//tag += `<a style="${fontWeight}"><font color="red">${GetNumber(iAdjustedWin)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(listGroup[i].iRolling, iRootClass)}">${GetNumber(listGroup[i].iRolling)}</font></a><br>`;
		//tag += `<a style="${fontWeight}"><font color="${GetClassSettleColor(listGroup[i].iRolling, iRootClass)}">${GetNumber(iAdjustedRolling)}</font></a><br>`;
		tag += `<a style="${fontWeight}"><font color="${GetClassColor(listGroup[i].iTotal, iRootClass)}">${GetNumber(listGroup[i].iTotal)}</font></a><br>`;
		tag += `</td>`;
	}
	tag += `</tr>`;

	return tag;
}

let AdjustBettingGroup = (objectGroup, iGameCode, fBaccaratR, fUnderOverR, fSlotR) => {

	const fBaccaratRR = 1.2;
	const fSlotRR = 1.2;

	//let iAdjustedRolling = parseInt(objectGroup.iRolling/1.2);
	let iAdjustedRolling = 0;

	//let cTargetRolling = 1.2;
	let cTargetRolling = fBaccaratR;
	iAdjustedRolling = objectGroup.iRolling/fBaccaratRR;
	if (iGameCode == 1 )	// UNOVER
	{
		//cTargetRolling = 2.0;
		cTargetRolling = fUnderOverR;
		iAdjustedRolling = objectGroup.iRolling;
	}		
	else if ( iGameCode == 2 )	// SLOT
	{
		//cTargetRolling = 3.8;
		cTargetRolling = fSlotR;
		iAdjustedRolling = objectGroup.iRolling/fSlotRR;
	}
		
	const iAdjustedBet = parseInt(iAdjustedRolling * (100/cTargetRolling));
	const iAdjustedWin = parseInt(objectGroup.iTotal) - parseInt(iAdjustedBet) + iAdjustedRolling;

	objectGroup.iBetting = iAdjustedBet;
	objectGroup.iWin = iAdjustedWin;
	objectGroup.iRolling = iAdjustedRolling;
}


let AddOverviewTableHeader_RollingMinus = () => {

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

function SetOverview_RollingMinus(aObject, strParentTag, bClear, iRootClass, fBaccaratR, fUnderOverR, fSlotR)
{
	console.log(`SetOverview_RollingMinus : fBaccaratR (${fBaccaratR}), fUnderOverR (${fUnderOverR}), fSlotR (${fSlotR})`);

	if ( bClear == true )
		$(strParentTag).empty();

	let tag = AddOverviewTableHeader_RollingMinus();

	console.log(aObject);

	tag += AddTable_RollingMinus(aObject.strDate, 0, 0, 0, aObject, iRootClass, false, fBaccaratR, fUnderOverR, fSlotR);

	let listGroup = GetBettingGroup(aObject.kBettingInfo);

	for ( let i in listGroup )
		AdjustBettingGroup(listGroup[i], i, fBaccaratR, fUnderOverR, fSlotR);

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

let RequestOverview_RollingMinus = (iTargetClass, strGroupID, iClass, iPermission, strNickname, strID, fBaccaratR, fUnderOverR, fSlotR) => {

	const dateStart = $('#datepicker1').val();
	const dateEnd = $('#datepicker2').val();

	$.ajax({
		type:'post',
		url: "/manage_partner/request_overview",
		context: document.body,
		data:{iTargetClass:iTargetClass, strGroupID:strGroupID, iClass:iClass, dateStart:dateStart, dateEnd:dateEnd, iPermission:iPermission, strNickname:strNickname, strID:strID},

		success: (obj) => {

			SetOverview_RollingMinus(obj.overview, "#div_realtimebet_overview2", true, obj.iRootClass, fBaccaratR, fUnderOverR, fSlotR);
		},
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}

