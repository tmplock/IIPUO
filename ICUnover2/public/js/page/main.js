
function show_leemocon(size){
	if(size == 1){
		type = "N";
	}else if(size == 2){
		type = "E";
	}else if(size == 3){
		type = "F";
	}
		
	$('#board_N').hide();
	$('#board_E').hide();
	$('#board_F').hide();
	
	$('#image_N').attr("src","/img/noticetab.png");
	$('#image_E').attr("src","/img/eventab.png");
	$('#image_F').attr("src","/img/faqtab.png");

	//�대떦�섎뒗嫄� 蹂댁뿬二쇨린
	$('#board_'+type).show();
	
	if(type == "N"){
		$('#image_N').attr("src","/img/noticetab_o.png");
	}else if(type == "E"){
		$('#image_E').attr("src","/img/eventab_o.png");
	}else if(type == "F"){
		$('#image_F').attr("src","/img/faqtab_o.png");
	}
	
	$('#board_href').attr("href","javascript:goBoardList('" + type + "');");
}

function show_Mleemocon(size){ 
	if(size == 1){
		type = "D";
	}else if(size == 2){
		type = "W";
	}

	$('#rank_D').hide();
	$('#rank_W').hide();
	
	$('#image_D').attr("src","/img/tab1.png");
	$('#image_W').attr("src","/img/tab2.png");
	
	//�대떦 而⑦뀗痢� 蹂댁뿬二쇨린
	$('#rank_'+type).show();
	
	if(type == "D"){
		$('#image_D').attr("src","/img/tab1_o.png");
	}else if(type == "W"){
		$('#image_W').attr("src","/img/tab2_o.png");
	}
}

var cnt=1;
show_leemocon(1);
function tabchg(){
 var cntnumber = 4;
    if(cnt<cntnumber){
        show_leemocon(cnt);
        cnt++;
    } else {
        cnt = 1;
    }
}

var Mcnt=1;
show_Mleemocon(1);
function Mtabchg(){
 var Mcntnumber = 3;
    if(Mcnt<Mcntnumber){
        show_Mleemocon(Mcnt);
        Mcnt++;
    } else {
    	Mcnt = 1;
    }
}

$(document).ready(function(){
	setInterval(tabchg,5000);
	setInterval(Mtabchg,5000);
});

//�꾩껜 ��뙚 湲덉븸
var totalJackpopVal = 0;

function totalJackpopPlus(plusCnt){
	totalJackpopVal = totalJackpopVal + plusCnt;
	jackpotValue = number_change_sosu(totalJackpopVal);
	
	if(!isNums(totalJackpopVal)){
		return;
	}
	
	$("#jackpot_number").html(jackpotValue);
}

$(document).ready(function () {
	/*$.ajax({
		dataType: "text"
		, url: "/game/jackpot/jackpot"
		, success: function(text) {
			jackpotTotalMoney = text.split('|');

			if(jackpotTotalMoney[0] == "" || !isNums(jackpotTotalMoney[0])){
				return;
			}

			totalJackpopVal = Number(jackpotTotalMoney[0]);
			jackpotValue = number_change_sosu(jackpotTotalMoney[0]);
			
			$("#jackpot_number").html(jackpotValue);

			jackpopTimer = window.setInterval("totalJackpopPlus("+jackpotTotalMoney[1]+")", 1000);
		}
		, error: function(xhr, status, error) { }
	});*/
});