// 단문 or 장문
function danmun(val){
	$("#spn_smsType").html(val);
}
// 문자발송
function btn_tran_click(){
	var check = chkFrm('theForm');
	if(check) {
		//alert("aa");
		document.theForm.submit();
	} else {
		return;
	}
}
// 특수문자 찍을 때
function cal_image(chr, dc){
	//$("#txt_msg").append(val);

	var fm = document.theForm;
	var ob = fm.txt_msg;

	if(document.selection){
		ob.focus();
		var sel = document.selection.createRange();
		sel.text = chr;
		sel.select();
	}else if(ob.selectionStart || ob.selectionStart == '0'){
		var st = ob.selectionStart;
		var ed = ob.selectionEnd;
		ob.value = ob.value.substring(0,st) + chr + ob.value.substring(ed, ob.value.length);
		ob.selectionStart = ob.selectionEnd = st + chr.length;
	}else{
		ob.value += chr;
	}

	input_cal_byte();
	ob.focus();
}
// 제한된 바이트 넘으면 자르기
function input_cal_byte(){
	//var max_byte=80;
	var max_byte = parseInt(document.getElementById('spn_smsType').innerHTML) ;
	var input_name_str, byte_count = 0, input_name_length = 0, one_str, ext_byte;
		
	input_name_str = theForm.txt_msg.value;
	input_name_length = input_name_str.length;

	theForm.txtbyte.value = 0;
	for(i=0; i<input_name_length; i++){
		one_str=input_name_str.charAt(i);
		
		if(escape(one_str).length > 4){
			byte_count += 2;
		}
		else if(one_str != '\r'){
			byte_count++;
		}
	}
	theForm.txtbyte.value = byte_count;
	if(byte_count > max_byte){
		ext_byte = byte_count - max_byte;
		alert(max_byte + ' 바이트 이상은 안됩니다.');
		input_cut_text();
	}
}
function input_cut_text(){
	var max_byte = 80;
	var input_name_str, byte_count=0, input_name_length=0, one_str;
		
	input_name_str = theForm.txt_msg.value;
	input_name_length = input_name_str.length;

	for (i=0; i<input_name_length; i++){
		if(byte_count < max_byte){
			one_str=input_name_str.charAt(i);
			
			if(escape(one_str).length > 4){
				byte_count+=2;
			}
			else if (one_str != '\r'){
				byte_count++;
			}
		}else{
			input_name_str = input_name_str.substring(0,i);
			break;
		}
	}
	if((max_byte % 2) == 1){
		input_name_length = (input_name_str.length-1);
		if(escape(input_name_str.charAt(input_name_length)).length > 4){
			input_name_str = input_name_str.substring(0,input_name_length);
		}
	}
		
	theForm.txt_msg.value = input_name_str;
	theForm.txtbyte.value = byte_count;
	return theForm.txt_msg.value;
}
// 제한된 바이트 넘으면 자르기 끝

// 저장된 문자 textarea로 옮기기
function ddl_msg_Click(){
	var ary_msg = theForm.ddl_msg.value;
	document.theForm.txt_msg.value = "";
	document.theForm.txt_msg.value = ary_msg;
	document.theForm.txt_msg.focus();
	document.theForm.txt_msg.str;
	input_cal_byte();
}
// 체크한 번호를 보내는 번호 입력란에 넣기
var num = 0;
function num_chk(val, nono){
	val_arr = val.split("/");

	val_arr[0] = val_arr[0].replace(" ", "");
	val_arr[0] = val_arr[0].replace(" ", "");
	
	var hp_chk = document.getElementsByName("chk1");
	var ek_arr = document.getElementById("txt_receiver").value.split(",");
	var ek_modify = "";
	for(var i=0; i<ek_arr.length; i++){
		if(ek_arr[i] == val_arr[0]){
			var ek_modify = ek_arr[i];
		}
	}
	if(ek_modify != ""){
		if(nono == ""){
			//document.getElementById("idx").value = document.getElementById("idx").value.replace(","+val_arr[1], "");
			document.getElementById("txt_receiver").value = document.getElementById("txt_receiver").value.replace(","+val_arr[0], "");
			if(ek_arr[0] == val_arr[0]){ 
				//document.getElementById("idx").value = document.getElementById("idx").value.replace(val_arr[1]+",", ""); 
				document.getElementById("txt_receiver").value = document.getElementById("txt_receiver").value.replace(val_arr[0]+",", ""); 
			}
			if(num == 1){
				//document.getElementById("idx").value = "";
				document.getElementById("txt_receiver").value = "";
			}
			if(num < 0){ num = 0; }else{ num = num - 1; }
			for(i=0; i<hp_chk.length; i++){
				if(hp_chk[i].value == val_arr[0]){
					hp_chk[i].checked = false;
				}
			}
		}
	}else{
		if(num == 0){
			//document.getElementById("idx").value = val_arr[1];
			document.getElementById("txt_receiver").value = val_arr[0];
			num = num + 1;
		}else{
			//document.getElementById("idx").value += ","+val_arr[1];
			document.getElementById("txt_receiver").value += ","+val_arr[0];
			num = num + 1;
		}
		for(i=0; i<hp_chk.length; i++){
			if(hp_chk[i].value == val_arr[0]){
				hp_chk[i].checked = true;
			}
		}
	}
}

var check  = 0;                                                                            //체크 여부 확인
function CheckAll(){                
	var boolchk;                                                                              //boolean형 변수 
	var chk = document.getElementsByName("chk1")                 //체크박스의 name값
		
		if(check){ check=0; boolchk = false; }else{ check=1; boolchk = true; }    //체크여부에 따른 true/false 설정
			
			for(i=0; i<chk.length;i++){                                                                    
				chk[i].checked = boolchk;                                                                //체크되어 있을경우 설정변경
				num_chk(chk[i].value, '');
			}

}

function get_data1(url, element_id){
	//$("#txt_receiver").val("");
	//num = 0;
	var params1 = $("#mpath_id").val();
	var params = "idx="+params1;
	url = url + "?" + encodeURI(params);

	$.ajax({
		type: "get",
		url: url,
		dataType: "html"
	}).done(function(data){
		$("#" + element_id).html(data);
	});
}

function go_portpolio_2(){
	//$("#s_gender").val($("#inr_s_gender").val());
	//$("#s_level").val($("#inr_s_level").val());
	$("#field").val($("#inr_field").val());
	$("#keyword").val($("#inr_keyword").val());
	 var formData = $("#portfrm_2").serialize();
		$.ajax({
		type : "POST",
		url : "member_select_mail.php",
		cache : false,
		data : formData,
		success : port_Success_2,
		error : port_Error_2
	});
}

function port_Success_2(json, status){
	$("#port_list_area2").html($.trim(json));
}

function port_Error_2(data, status){
	 alert("error");
}