
var gameRunStatus = false;

function miniGame()
{
    var url = "/miniGame/roullete";
    window.open(url,"mini",'top=0,left=50,width=900,height=765,menubar=no,scrollbars=yes,status=no,toolbar=no,resizable=yes,location=no');
}

//異붽�
function goSP(){
	gameStart('SPCD', 'slot');
}

//SPCD 寃뚯엫 �ㅽ뻾
function goSPExec(gameType){
	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/sp_start",
		data:{"game_code":'SPCD'},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}



function goRT(){
	gameStart('RTCD', '');
}

//RTCD 寃뚯엫 �ㅽ뻾
function goRTExec(){
	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;
      $.ajax({
              type:"GET",
              url:"/game/rt_start",
              data:{"game_code":'RTCD'},
              dataType:"text",
              success:function(data, textStatus) {
				  gameRunStatus = false;
                      eval(data);
              },
              error:function(data, textStatus) {
                      alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
              }
      });
}

//�멸쾶�대컢
function goHgame(){gameStart('HCD','');}
//VIP
function goVipgame(){gameStart('VCD','');}
//�멸쾶�대컢
function goSuncity(){gameStart('SCD','');}
//留덉씠�щ줈 �쇱씠釉�
function goMicroLive(){gameStart('NMCD','live');}
//留덉씠�щ줈 �щ’
function goMicroSlot(){gameStart('NMSCD','slot');}
//留덉씠�щ줈 �꾨줈洹몃옒�쒕툕
function goMicroSlotPv(){gameStart('MPCD','slotpv');}
//W寃뚯엫

function goWawa(){
	if(MEM_TST_YN == 'Y'){ //泥댄뿕 �꾩씠�� �쇰븣
		gameStart('WCD','');
	}else{
		gameStart('WCD','');
		//goWawaNotice();
		//goWawaSelect();
	}
}

function goGgame(){gameStart('GCD','');}

function goSA(){
	gameStart('SAG', '');
}

function clientDown(){
	location.href="https://w-img.oss-ap-northeast-1.aliyuncs.com/download/wawa.exe";
	$('#wawa_select').hide();

}

function goEbet(){
    gameStart('EBCD');
}

function goEbetExec(gameType){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
        type:"GET",
        url:"/game/ebet_start",
        data:{"game_code":'EBCD'},
        dataType:"text",
        success:function(data, textStatus) {
			gameRunStatus = false;
            eval(data);
        },
        error:function(data, textStatus) {
            alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
        }
    });
}

function goN2CD(){
    gameStart('N2CD', '');
}

//n2cd 寃뚯엫 �ㅽ뻾
function goN2CDExec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

    $.ajax({
        type:"GET",
        url:"/game/n2live_start",
        data:{"game_code":'N2CD'},
        dataType:"text",
        success:function(data, textStatus) {
			gameRunStatus = false;
            eval(data);
        },
        error:function(data, textStatus) {
            alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
        }
    });
}


//異붽�
function goSASlot(){
    gameStart('SAG', 'slot');
}

//異붽� : SA Slot 寃뚯엫 �ㅽ뻾
function goSASlotExec(gameType, gameId){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

    $.ajax({
        type:"GET",
        url:"/game/sagame_start",
        data:{"game_code":'SAG',"gameType":gameType,"gameId":gameId},
        dataType:"text",
        success:function(data, textStatus) {
			gameRunStatus = false;
            eval(data);
        },
        error:function(data, textStatus) {
            alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
        }
    });
}






//�뚮옒�� 踰꾩쟾 泥댄겕
function flashVerCheck(){
	/*var chk = onLoad();
    chk = 28;
  	if(chk < 11){
  		if(confirm('寃뚯엫�� �ㅽ뻾�섍린 �꾪빐�쒕뒗 �뚯썝�섏쓽 PC�� Adobe Flash Player 11踰꾩쟾 �댁긽�� �ㅼ튂�섏뼱�덉뼱�� �⑸땲��.\n\n[�뺤씤]�� �꾨Ⅴ�쒕㈃ �ㅼ슫濡쒕뱶�섏씠吏�濡� �대룞�⑸땲��.')){
        	domain='http://get.adobe.com/kr/flashplayer/'; //�ㅼ튂�� �섏씠吏�
          	window.open(domain,'flashdown','');
      	}else{
      		alert('痍⑥냼�섏��듬땲��.');
      	}

      	return false;
  	}*/
  	return true;
}

var gamecount = 0;

//寃뚯엫 �ㅽ뻾�섍린
function gameStart(game_code, type){
    if(loginYN == "N"){
    	if(gamecount == 0){
    		gamecount += 1;
	    	if(!alert("濡쒓렇�� �� �댁슜�댁＜�몄슂."))
	    	{
	    		gamecount += -1;
	    	}
    	}
    }else{
		$.ajax({
			type:"GET",
			url:"/game/game_check",
			data:{"game_code":game_code},
			dataType:"text",
			success:function(data, textStatus) {
	            var retdata = data;
	            var array_data = retdata.split("|");
	            if(array_data[0] == 'Y'){
	            	alert(array_data[1]);
	            }else if(array_data[0] == 'L'){
	            	alert('濡쒓렇�� �� �댁슜�댁＜�몄슂.');
	            	location.href = "/";
	            } else {
	                if(game_code == 'HCD'){
	                	goHgameExec();
	                } else if(game_code == 'SCD'){
	                	goSuncityExec();
	                } else if (game_code == 'NMCD'){
	                	if(type == "live"){
	                		goMicroExec(type, '');
	                	}else if(type == "slot"){
	                		goMicroExec(type, '');
	                	}
	                } else if (game_code == 'NMSCD'){
	                		goMicroExec(type, '');

	                } else if (game_code == 'MPCD'){
	                	goMicroExec(type, '');
	                } else if (game_code == 'VCD'){
	                	goVipgameExec();
	                } else if(game_code == 'WCD'){
	                	goWawaExec();
	                } else if(game_code == 'GCD'){
	                	goGoldExec();
                    }else if(game_code == 'EBCD'){
                        goEbetExec();
                    }else if(game_code == 'N2CD'){
                        goN2CDExec();
                    }else if(game_code == 'SAG'){
                        if(type == "slot"){
                            goSASlotExec(type);
                        }else{
                            goSAExec();
                        }
                    }else if(game_code == 'RTCD'){
	                	goRTExec();
					}else if(game_code == 'SPCD'){
						goSPExec('slot');
					}else if(game_code == 'DMCD'){
						goMicroExec3(type, '');

					}else if(game_code == 'EAS2CD'){
						goEas2Exec();

					}else if(game_code == 'QMCD'){
						goQmExec(type);

					}else if(game_code == 'VES'){
						goVESExec();

                    } else{
	                	alert('寃뚯엫肄붾뱶媛� �щ컮瑜댁� �딆뒿�덈떎.');
	                }
	            }
			},
			error:function(data, textStatus) {
				alert('접근할수없습니다..[GAMESTART]');
			}
		});
    }
}

//G �ㅽ뻾
function goGoldExec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/gold_game_start",
		data:{"game_code":'GCD'},
		dataType:"text",
		success:function(data, textStatus) {

			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}

//SA 寃뚯엫 �ㅽ뻾
function goSAExec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/sagame_start",
		data:{"game_code":'SAG'},
		dataType:"text",
		success:function(data, textStatus) {

			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}


//�멸쾶�대컢 �ㅽ뻾
function goHgameExec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;


	$.ajax({
		type:"GET",
		url:"/game/hgame_start",
		data:{"game_code":'HCD'},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}

//VIP 寃뚯엫 �ㅽ뻾
function goVipgameExec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/hgame_start",
		data:{"game_code":'VCD'},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}

google.load("swfobject", "2.1");
google.setOnLoadCallback(onLoad);

function onLoad(){
	var flashVersion = swfobject.getFlashPlayerVersion();
    return flashVersion.major;
}

//�좎떆�� 寃뚯엫 �ㅽ뻾
function goSuncityExec(){
	if(loginYN == "N"){
    	alert("濡쒓렇�� �� �댁슜�섏꽭��.");
        return ;
	}else{
		if(flashVerCheck() == false){
			return;
		}


		if(gameRunStatus == true) {
			alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
			return;
		}
		gameRunStatus = true;

    	$.ajax({
    		type:"GET",
    		url:"/game/suncity_start",
    		data:"",
    		dataType:"text",
    		success:function(data, textStatus) {
				gameRunStatus = false;
    			eval(data);
    		},
    		error:function(data, textStatus) {
    			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
    		}
    	});
	}
}

//留덉씠�щ줈 寃뚯엫 �ㅽ뻾
function goMicroExec(gameType, gameId){
	if(flashVerCheck() == false){
		return;
	}

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/micro_start",
		data:{"gameType":gameType,"gameId":gameId},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}

//���� 寃뚯엫 怨듭�
function goWawaNotice(){
	if(loginYN == "N"){
    	alert("濡쒓렇�� �� �댁슜�섏꽭��.");
        return ;
	}else{
		if(flashVerCheck() == false){
			return;
		}

		centerWidthPopup_new("wawa_notice",10);
		$("#wawa_notice").show();
	}
}

//���� 寃뚯엫 �좏깮
function goWawaSelect(){
	if(loginYN == "N"){
    	alert("濡쒓렇�� �� �댁슜�섏꽭��.");
        return ;
	}else{
		if(flashVerCheck() == false){
			return;
		}

		centerWidthPopup_new("wawa_select",10);
		$("#wawa_select").show();
	}
}


//���� 寃뚯엫 �ㅽ뻾
function goWawaExec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/wawa_start",
		data:"",
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}


//異붽�
function goMicroLive3(type){
	gameStart('DMCD', type);
}

//異붽�
function goMicroSlot3(type, gameId){
	goMicroExec3(type, gameId);
}

//異붽�
function goMicroExec3(gameType, gameId){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/micro_start3",
		data:{"gameType":gameType, "gameId":gameId},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}


//異붽�
function goEas2(){
	gameStart('EAS2CD', '');
}

//EAS2CD 寃뚯엫 �ㅽ뻾
function goEas2Exec(){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/eas2_start",
		data:{"game_code":'EAS2CD'},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}

function goQm(version){
	gameStart('QMCD', version);
}

//QMCD 寃뚯엫 �ㅽ뻾
function goQmExec(version){

	if(gameRunStatus == true) {
		alert('寃뚯엫�� �ㅽ뻾以묒엯�덈떎. �좎떆留� 湲곕떎�� 二쇱떆湲� 諛붾엻�덈떎.');
		return;
	}
	gameRunStatus = true;

	$.ajax({
		type:"GET",
		url:"/game/qm_start",
		data:{"game_code":'QMCD', "version": version},
		dataType:"text",
		success:function(data, textStatus) {
			gameRunStatus = false;
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}

function goVES(){
	gameStart('VES', '');
}

//VES 寃뚯엫 �ㅽ뻾
function goVESExec(){
	$.ajax({
		type:"GET",
		url:"/game/ves_start",
		data:{"game_code":'VES'},
		dataType:"text",
		success:function(data, textStatus) {
			eval(data);
		},
		error:function(data, textStatus) {
			alert('寃뚯엫�묒냽�� �먰븷�섏� �딆뒿�덈떎.');
		}
	});
}
