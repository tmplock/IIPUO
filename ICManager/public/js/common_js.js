
/*function checkNumber()
{  
     var objEv = event.srcElement; 
     var numPattern = /([^a-z,0-9])/; 
     numPattern = objEv.value.match(numPattern); 
     if(numPattern != null){   
          alert("한글, 특수문자, 대문자 입력 불가입니다!");
          objEv.value="";   
          objEv.focus(); 
          return false; 
     } 
}*/

function checkNumber()
{  
     var objEv = event.srcElement; 
     var numPattern = /([^a-z,A-Z,0-9,!@#$%^&*()?_~])/; 
     numPattern = objEv.value.match(numPattern); 
     if(numPattern != null){   
          alert("한글과 공백은 입력하실 수 없습니다.");
          objEv.value="";   
          objEv.focus(); 
          return false; 
     } 
}

function goto(url, sel){
	location.href = url+"?subject="+sel.options[sel.selectedIndex].value;
}

// 다음 TAB으로 자동으로 넘어가는 함수
function nextTab(pre, next) {
	pre.value.length >= pre.maxLength ? document.frm.elements[next].focus() : null;
}

function switch_all(frm_name, attr){
	var el = document.forms[frm_name];
	for (i=0; i<el.elements.length; i++){
		var ele = el.elements[i];
		if(ele.type == "checkbox" && ele.getAttribute(attr)=="yes"){
			if(ele.checked){
				ele.checked = false;
			}else{
				ele.checked = true;
			}
		}
	}
}

function chkFrm(frm_name){
	var el = document.forms[frm_name];

	for (i=0; i<el.elements.length; i++){

		var ele = el.elements[i];
	
		if(ele.type=="radio" && ele.getAttribute("required")=="yes"){

			chked = false;
			elname = ele.name;
			for (j=0; j<el.elements[elname].length; j++ ) {
				if(el.elements[elname][j].type=="radio" && el.elements[elname][j].checked) {
					chked = true;
				}
			}
			if(!chked) {
				alert(el.elements[i].getAttribute("message")+" 를 선택하세요.");
				return false;
			}
		}

		if(ele.getAttribute("required")=="yes" && ele.type=="checkbox"){
			var checkbox_name = ele.getAttribute("name");
			var checked = false;
			for (j=0; j<el.elements.length; j++){
				var ele2 = el.elements[j];
				if(ele2.type=="checkbox" && ele2.getAttribute("name")==checkbox_name && ele2.checked){
					checked = true;
				}
			}
			if(!checked){
				alert(ele.getAttribute("message")+" 중 한개 이상을 선택하세요.");
				return false;
			}	
		}

		if(ele.getAttribute("required")=="yes" && ele.type.indexOf("select")>0){
			if(ele.options[ele.selectedIndex].value == ""){
				alert(ele.getAttribute("message")+" 중 하나를 선택하세요.");
			}
		}


		if(el.elements[i].value == "" && el.elements[i].getAttribute("required")=="yes"){
			alert(el.elements[i].getAttribute("message")+" 을(를) 입력하세요.");
			el.elements[i].focus();
			return false;
		}
		var byte_allowed = el.elements[i].getAttribute("byte_allowed");
		if(byte_allowed!=null && byte_allowed!=""){
			if(String(el.elements[i].value).strlen() > byte_allowed){
				alert(el.elements[i].getAttribute("message")+" 의 값이 정해진 길이("+byte_allowed+"byte)보다 깁니다.");
				el.elements[i].focus();
				return false;
			}
		}
		var is_digit = el.elements[i].getAttribute("is_digit");
		if(is_digit!=null && is_digit=="yes"){
			if(el.elements[i].value==''){
				continue;
			}
			if(el.elements[i].value != ''+parseFloat(el.elements[i].value)){
				alert(el.elements[i].getAttribute("message")+" 의 값은 숫자여야 합니다.");
				el.elements[i].focus();
				return false;
			}
		}

		var is_notkr = el.elements[i].getAttribute("is_notkr");
		if(is_notkr!=null && is_notkr=="yes"){
			if(el.elements[i].value==''){
				continue;
			}
			if(el.elements[i].value.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힝]/) != -1){
				alert(el.elements[i].getAttribute("message")+" 에는 한글이 들어가면 안됩니다.");
				el.elements[i].focus();
				return false;
			}
		}

		var is_noteng = el.elements[i].getAttribute("is_noteng");
		if(is_noteng!=null && is_noteng=="yes"){
			if(el.elements[i].value==''){
				continue;
			}
			if(el.elements[i].value.search(/[a-z|A-Z]/) != -1){
				alert(el.elements[i].getAttribute("message")+" 에는 영어가 들어가면 안됩니다.");
				el.elements[i].focus();
				return false;
			}
		}
		
		var is_engnum = el.elements[i].getAttribute("is_engnum");
		if(is_engnum!=null && is_engnum=="yes"){
			if(el.elements[i].value==''){
				continue;
			}
			if(el.elements[i].value.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힝]/) != -1){
				alert(el.elements[i].getAttribute("message")+" 에는 한글이 들어가면 안됩니다.");
				el.elements[i].focus();
				return false;
			}
			/*
			if(el.elements[i].value.substring(0,1) == '1' || el.elements[i].value.substring(0,1) == '2' || el.elements[i].value.substring(0,1) == '3' || el.elements[i].value.substring(0,1) == '4' || el.elements[i].value.substring(0,1) == '5' || el.elements[i].value.substring(0,1) == '6' || el.elements[i].value.substring(0,1) == '7' || el.elements[i].value.substring(0,1) == '8' || el.elements[i].value.substring(0,1) == '9' || el.elements[i].value.substring(0,1) == '0'){
				alert(el.elements[i].getAttribute("message")+" 의 첫글자는 영문이어야 합니다.");
				el.elements[i].focus();
				return false;
			}
			*/
		}

		var is_num = el.elements[i].getAttribute("is_num");
		if(is_num!=null && is_num=="yes"){
			if(el.elements[i].value==''){
				continue;
			}
			for(var j = 0; j < el.elements[i].value.length; j++) {
				var chr = el.elements[i].value.substr(j, 1);
				if(chr < '0' || chr > '9') {
					alert(el.elements[i].getAttribute("message")+" 의 값은 숫자여야 합니다.");
					el.elements[i].value = "";
					el.elements[i].focus();
					return false;
				}
			}
		}

		var is_email = el.elements[i].getAttribute("is_email");
		if(el.elements[i].value!='' && is_email=="yes"){
			if(!emailCheck(el.elements[i].value)){
				alert("입력하신 전자우편 주소가 올바르지 않습니다.");
				el.elements[i].value = "";
				el.elements[i].focus();
				return false;
			}
		}

		var is_tint = ele.getAttribute("is_tint");
		if(is_tint == "yes"){
			if(ele.value < 0 || ele.value > 255){
				alert(ele.getAttribute("message")+"의 범위를 다시 입력하세요.(0 ~ 255)");
				ele.focus();
				return false;
			}
		}

	}

	var is_cutstr10 = ele.getAttribute("is_cutstr10");
		if(is_cutstr10 == "yes"){
	if(el.elements[i].value.length > 10){
			funcCountTextLen();
			return false;
		}
	}
	return true;
}




String.prototype.strlen =function() { 
    for(var i=0, relen=len=this.length; i<len; i++) if(this.charCodeAt(i) > 128) relen++; 
    return relen; 
} 

function getObject(objectId) { 
// checkW3C DOM, then MSIE 4, then NN 4. 
// 
	if(document.getElementById && document.getElementById(objectId)) { 
		return document.getElementById(objectId); 
	} 
	else if (document.all && document.all(objectId)) { 
		return document.all(objectId); 
	} 
	else if (document.layers && document.layers[objectId]) { 
		return document.layers[objectId]; 
	} else { 
		return false; 
	} 
} 


//checkBoxSwitch의 값에 따라 form의 checkbox 상태를 반전시킴.
function reveseCheckbox(frmName) {
	var frm = document.forms[frmName]; 
	var chk = frm.checkBoxSwitch.checked;
	var len = frm.elements.length;

	if (chk) {
		for (var i=0; i< len; i++) {
			if(frm.elements[i].getAttribute("type")=="checkbox"){
				frm.elements[i].checked = true;
			}
		}
	}else {
		for (var i=0; i< len; i++) {
			if(frm.elements[i].getAttribute("type")=="checkbox"){
				frm.elements[i].checked = false;
			}
		}
	}
}

function emailCheck (emailStr) {

/* The following variable tells the rest of the function whether or not
to verify that the address ends in a two-letter country or well-known
TLD.  1 means check it, 0 means don't. */

var checkTLD=1;

/* The following is the list of known TLDs that an e-mail address must end with. */

var knownDomsPat=/^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/;

/* The following pattern is used to check if the entered e-mail address
fits the user@domain format.  It also is used to separate the username
from the domain. */

var emailPat=/^(.+)@(.+)$/;

/* The following string represents the pattern for matching all special
characters.  We don't want to allow special characters in the address. 
These characters include ( ) < > @ , ; : \ " . [ ] */

var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]";

/* The following string represents the range of characters allowed in a 
username or domainname.  It really states which chars aren't allowed.*/

var validChars="\[^\\s" + specialChars + "\]";

/* The following pattern applies if the "user" is a quoted string (in
which case, there are no rules about which characters are allowed
and which aren't; anything goes).  E.g. "jiminy cricket"@disney.com
is a legal e-mail address. */

var quotedUser="(\"[^\"]*\")";

/* The following pattern applies for domains that are IP addresses,
rather than symbolic names.  E.g. joe@[123.124.233.4] is a legal
e-mail address. NOTE: The square brackets are required. */

var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;

/* The following string represents an atom (basically a series of non-special characters.) */

var atom=validChars + '+';

/* The following string represents one word in the typical username.
For example, in john.doe@somewhere.com, john and doe are words.
Basically, a word is either an atom or quoted string. */

var word="(" + atom + "|" + quotedUser + ")";

// The following pattern describes the structure of the user

var userPat=new RegExp("^" + word + "(\\." + word + ")*$");

/* The following pattern describes the structure of a normal symbolic
domain, as opposed to ipDomainPat, shown above. */

var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");

/* Finally, let's start trying to figure out if the supplied address is valid. */

/* Begin with the coarse pattern to simply break up user@domain into
different pieces that are easy to analyze. */

var matchArray=emailStr.match(emailPat);

if (matchArray==null) {

/* Too many/few @'s or something; basically, this address doesn't
even fit the general mould of a valid e-mail address. */

//alert("Email address seems incorrect (check @ and .'s)");
return false;
}
var user=matchArray[1];
var domain=matchArray[2];

// Start by checking that only basic ASCII characters are in the strings (0-127).

for (i=0; i<user.length; i++) {
if (user.charCodeAt(i)>127) {
//alert("Ths username contains invalid characters.");
return false;
   }
}
for (i=0; i<domain.length; i++) {
if (domain.charCodeAt(i)>127) {
//alert("Ths domain name contains invalid characters.");
return false;
   }
}

// See if "user" is valid 

if (user.match(userPat)==null) {

// user is not valid

//alert("The username doesn't seem to be valid.");
return false;
}

/* if the e-mail address is at an IP address (as opposed to a symbolic
host name) make sure the IP address is valid. */

var IPArray=domain.match(ipDomainPat);
if (IPArray!=null) {

// this is an IP address

for (var i=1;i<=4;i++) {
if (IPArray[i]>255) {
//alert("Destination IP address is invalid!");
return false;
   }
}
return true;
}

// Domain is symbolic name.  Check if it's valid.
 
var atomPat=new RegExp("^" + atom + "$");
var domArr=domain.split(".");
var len=domArr.length;
for (i=0;i<len;i++) {
if (domArr[i].search(atomPat)==-1) {
//alert("The domain name does not seem to be valid.");
return false;
   }
}

/* domain name seems valid, but now make sure that it ends in a
known top-level domain (like com, edu, gov) or a two-letter word,
representing country (uk, nl), and that there's a hostname preceding 
the domain or country. */

if (checkTLD && domArr[domArr.length-1].length!=2 && 
domArr[domArr.length-1].search(knownDomsPat)==-1) {
//alert("The address must end in a well-known domain or two letter " + "country.");
return false;
}

// Make sure there's a host name preceding the domain.

if (len<2) {
//alert("This address is missing a hostname!");
return false;
}

// If we've gotten this far, everything's valid!
return true;
}

function change_file1(){
	document.frm.file1.value = document.frm.fileName1.value;
}

function change_file2(){
	document.frm.file2.value = document.frm.fileName2.value;
}
 
 function Keycode(e){
        var code = (window.event) ? event.keyCode : e.which; //IE : FF - Chrome both
        if (code > 32 && code < 48) nAllow(e);
        if (code > 57 && code < 65) nAllow(e);
        if (code > 90 && code < 97) nAllow(e);
        if (code > 122 && code < 127) nAllow(e);
    }
    function nAllow(e){
        alert('특수문자는 사용할수 없습니다.');
        if(navigator.appName!="Netscape"){ //for not returning keycode value

            event.returnValue = false;  //IE ,  - Chrome both
        }else{
            e.preventDefault(); //FF ,  - Chrome both
        }        
    }

function set_cookie(name, value, expirehours, domain){ // 쿠키 생성 
    var today = new Date();
    today.setTime(today.getTime() + (60*60*1000*expirehours));
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";";
    if (domain) {
        document.cookie += "domain=" + domain + ";";
    }
}

function get_cookie(name){ // 쿠키 가져오기
    var find_sw = false;
    var start, end;
    var i = 0;

    for (i=0; i<= document.cookie.length; i++)
    {
        start = i;
        end = start + name.length;

        if(document.cookie.substring(start, end) == name)
        {
            find_sw = true
            break
        }
    }

    if (find_sw == true)
    {
        start = end + 1;
        end = document.cookie.indexOf(";", start);

        if(end < start)
            end = document.cookie.length;

        return document.cookie.substring(start, end);
    }
    return "";
}

function delete_cookie(name){ // 쿠키 지움
    var today = new Date();

    today.setTime(today.getTime() - 1);
    var value = get_cookie(name);
    if(value != "")
        document.cookie = name + "=" + value + "; path=/; expires=" + today.toGMTString();
}

function getCookie(Name){

	var search = Name + "="
	if (document.cookie.length > 0)
	{
		var offset = document.cookie.indexOf(search)
		if (offset != -1)
		{
			offset += search.length
			var end = document.cookie.indexOf(";", offset)
	if (end == -1)
		end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		}
	}
	return "";
}

function get_data(url, element_id, params){
	if(params != ""){
		url = url + "?" + encodeURI(params);
	}
	//document.write (url);
	$.ajax({
		type: "get",
		url: url,
		dataType: "html"
	}).done(function(data){
		$("#" + element_id).html(data);
	});
}

function newPopup(url) {
	popupWindow = window.open(
	url,'popUpWindow','height=700,width=800,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no')
}	

function newPopup_s(url,w,h) {
	popupWindow = window.open(
	url,'popUpWindow','height='+h+',width='+w+',left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no')
}
	
function curTime() {
		var now = new Date();
		var year  = now.getFullYear();
		var month  = (now.getMonth()+1);
		var day  = now.getDate();
		if (month<10) { month="0"+month }
		if (day<10) { day="0"+day }
		var hrs = now.getHours();
		var min = now.getMinutes();
		var sec = now.getSeconds();
		var don = "오전";
		if (hrs>=12){ don="오후" }
		if (hrs>12) { hrs-=12 }
		if (hrs==0) { hrs=12 }
		if (hrs<10) { hrs="0"+hrs }
		if (min<10) { min="0"+min }
		if (sec<10) { sec="0"+sec }
		clock.innerHTML= year+"."+month+"."+day+" "+don+" "+hrs+":"+min+":"+sec;
		setTimeout("curTime()",1000)
}

function get_data_val(url, element_id, params){
	if(params != ""){
		url = url + "?" + encodeURI(params);
	}
	//document.write (url);
	$.ajax({
		type: "get",
		url: url,
		dataType: "html"
	}).done(function(data){
		//alert(data);
		$("#" + element_id).val(data);
		document.order_excel_frm.submit();
	});
}

function checkBlocChar2(obj){
	// 허용하고 싶은 특수문자가 있다면 여기서 삭제하면 됨
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
	if( regExp.test(obj.value) ){
		alert("특수문자는 입력하실수 없습니다.");
		obj.value = obj.value.substring( 0 , obj.value.length - 1 ); // 입력한 특수문자 한자리 지움
	}
}

function checkBlockChar(id) {
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
	$(id).on("focusout", function() {
		var x = $(this).val();
		if (x.length > 0) {
			if (x.match(regExp)) {
				x = x.replace(regExp, "");
			}
			$(this).val(x);
		}
	}).on("keyup", function() {
		$(this).val($(this).val().replace(regExp, ""));
	});
}

function checkBlockCharSpecial(id) {
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
	$(id).on("focusout", function() {
		var x = $(this).val();
		if (x.length > 0) {
			if (x.match(regExp)) {
				x = x.replace(regExp, "");
			}
			$(this).val(x);
		}
	}).on("keyup", function() {
		$(this).val($(this).val().replace(regExp, ""));
	});
}

function checkBlockCharSpecial2(id) {
	var regExp = /[|`┼<>'"\\]/gi;
	$(id).on("focusout", function() {
		var x = $(this).val();
		if (x.length > 0) {
			if (x.match(regExp)) {
				x = x.replace(regExp, "");
			}
			$(this).val(x);
		}
	}).on("keyup", function() {
		$(this).val($(this).val().replace(regExp, ""));
	});
}

function checkBlockCharNickname(id) {
	var regExp = /[ \{\}\[\]\/?.,;:|\)`\-┼<>\#%&\'\"\\\(\=]/gi;
	$(id).on("focusout", function() {
		var x = $(this).val();
		if (x.length > 0) {
			if (x.match(regExp)) {
				x = x.replace(regExp, "");
			}
			$(this).val(x);
		}
	}).on("keyup", function() {
		$(this).val($(this).val().replace(regExp, ""));
	});
}

function checkBlockNum(id) {
	var regExp = /[^0-9.]/g;
	$(id).on("focusout", function() {
		var x = $(this).val();
		if (x.length > 0) {
			if (x.match(regExp)) {
				x = x.replace(regExp, "");
			}
			$(this).val(x);
		}
	}).on("keyup", function() {
		$(this).val($(this).val().replace(regExp, ""));
	});
}