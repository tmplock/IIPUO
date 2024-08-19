var socket = io();
var intervalAudio;
//if ( isLogin == 1 )
let RequestLogin = (user, strIP) =>
{
    socket.emit('request_login', user, strIP);

    //console.log(`request_login`);
}

socket.on('response_login', (data) => {
    //console.log(`########################## Response Login ${data}`);
});

socket.on('UserLogout', () => {
    alert('중복로그인으로 인한 로그아웃이 되었습니다');
    window.location.href='/account/logout';
})

socket.on('UpdateCash', (iCash) => {

    const cCash = parseInt(iCash);

    // $('#MainLayoutCash').text(iCash);
    // $('#MainLayoutCoin').text(iCash);

    $('#MainLayoutCoin').text(cCash.toLocaleString());
})

socket.on('AlertLetter', (strContents) => {
    
    //console.log(`AlertLetter`);

    intervalAudio = setInterval(function (){
        document.getElementById("audio3").play();
    }, 1000)
    setTimeout(() => {
        clearInterval(intervalAudio);
    }, 7000);

    let iNum = $('#MainLayoutNumLetters').text();
    //console.log(`AlertLetter iNum : ${iNum}`);
    if ( iNum == '' )
    {
        $('#MainLayoutNumLetters').text('1');
    }
    else
    {
        $('#MainLayoutNumLetters').text(parseInt(iNum)+1);
    }
    alert(strContents);
});

socket.on('AlertAdminLetter', (strContents) => {

    //console.log(`AlertAdminLetter`);

    intervalAudio = setInterval(function (){
        document.getElementById("audio3").play();
    }, 1000)
    setTimeout(() => {
        clearInterval(intervalAudio);
    }, 7000);

    let iNum = $('#MainLayoutNumLetters').text();
    //console.log(`AlertLetter iNum : ${iNum}`);
    if ( iNum == '' )
    {
        $('#MainLayoutNumLetters').text('1');
    }
    else
    {
        $('#MainLayoutNumLetters').text(parseInt(iNum)+1);
    }
    alert(strContents);
});