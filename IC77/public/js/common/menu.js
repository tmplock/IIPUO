
function goHome(){location.href = "/";} //��

//荑좏룿�ъ슜
function goCoupon(){TINY.box.show({iframe :'/exchange/coupon',width:1060,height:650});}
//�낃툑�좎껌
function goDeposit(){TINY.box.show({iframe :'/exchange/deposit',width:1060,height:720});}
//異쒓툑�좎껌
function goWithdraw(){TINY.box.show({iframe :'/exchange/withdraw',width:1060,height:720});}
//泥댄뿕癒몃땲�좎껌
function goVirtual(){TINY.box.show({iframe :'/exchange/virtual',width:1060,height:430});}
//�대깽�몄떊泥�
function goEventReg(){TINY.box.show({iframe :'/exchange/event',width:1060,height:500});}
//寃뚯엫癒몃땲 �대룞�좎껌
function goMoneyMove(){TINY.box.show({iframe :'/exchange/move',width:1060,height:520});}
//�낃툑怨꾩쥖 �ъ쟾��
function goAcctSend(){TINY.box.show({iframe :'/exchange/send',width:1060,height:330});}
//�낆텧湲덈궡��
function goHistory(){TINY.box.show({iframe :'/exchange/history',width:1060,height:650});}

//�뚯썝媛���
//function goJoin(){TINY.box.show({iframe :'/user/join',width:1060,height:650});}
function goJoin(){location.href='/user/join';}
//留덉씠�섏씠吏�
function goMypage(){TINY.box.show({iframe :'/user/mypage.html',width:1060,height:720});}
//移쒓뎄 異붿쿇
function goRecommend(){TINY.box.show({iframe :'/user/recommend',width:1060,height:720});}
//�꾩씠��, �⑥뒪�뚮뱶 李얘린
function goIdSearch(){alert('怨좉컼�쇳꽣濡� 臾몄쓽�섏꽭��.');}
//濡쒓렇�꾩썐
function goLogin(){location.href="/user/logoin";}

function goLogout(){location.href="/user/logout";}

//�ㅼ떆媛� 異쒓툑 �꾪솴
function goRank(){TINY.box.show({iframe :'/etc/rank',width:1060,height:600});}
//1�� 蹂댁븞怨꾩쥖
function goAcct(){TINY.box.show({iframe :'/etc/acct',width:1060,height:600});}
//�뚰듃�덉젣��
function goPartner(){TINY.box.show({iframe :'/etc/partner',width:1060,height:600});}
//1:1�먭꺽吏���
function goRemote(){TINY.box.show({iframe :'/etc/remote',width:1060,height:450});}
//怨좉컼�쇳꽣
function goCustomer(){TINY.box.show({iframe :'/etc/customer',width:1060,height:550});}
//寃뚯엫洹쒖튃
function goRule(type){TINY.box.show({iframe :'/etc/rule/'+type,width:1060,height:600});}
//寃뚯엫 媛��대뱶
function goGuide(type){TINY.box.show({iframe :'/etc/game_guide/'+type,width:1060,height:650});}

//寃뚯떆�� 由ъ뒪��
function goBoardList(type){TINY.box.show({iframe :'/board/blist/'+type,width:1060,height:650});}
//寃뚯떆�� 蹂닿린
function goBoardView(type, num){TINY.box.show({iframe :'/board/bview/'+type+'?num='+num,width:1060,height:650});}