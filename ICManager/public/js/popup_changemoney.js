
let SetModal = (strModalTag, iRender) => {
    /* iRender 
        0:지급,
        1:차감
    */
    
    $(strModalTag).empty();
    let tag = '';
    if(iRender == 0)
    {
        tag = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>지급하기</h2>
            <div style="text-align: center; font-size:16px">
                <label for="balance">보유머니 : <span id="withdrawable">0</span> </label>
            </div>
            <div class="input-group">
                <label for="iClass">등급</label>
                <input type="text" id="iClass" value="등급" readonly>
            </div>
            <div class="input-group"> 
                <label for="nickname">아이디</label>
                <input type="text" id="strID" value="사용자아이디" readonly>
            </div>
            <div class="input-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="strNickname" value="사용자닉네임" readonly>
            </div>
            <div class="input-group">
                <label for="exchangeAmount">지급금액</label>
                <input type="text" id="exchangeAmount" placeholder="지급금액을 입력하세요">
            </div>
            <div class="button-group">
                    <button type="button" onclick="setAmount(500000)">50만</button>
                    <button type="button" onclick="setAmount(100000)">10만</button>
                    <button type="button" onclick="setAmount(50000)">5만</button>
                    <button type="button" onclick="setAmount(10000)">1만</button>
                    <button type="button" onclick="setAmount('RESET')" style="background-color: #20B2AA; color: white;">정정</button>
            <div class="submit-button-container">
                <button class="submit-button" onclick="OnClickProcess('GIVE')">지급하기</button>
            </div>
        </div>
        `;
    }
    else {
        tag = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>회수하기</h2>
            <div style="text-align: center; font-size:16px">
                <label for="balance">보유머니 : <span id="withdrawable">0</span> </label>
            </div>
            <div class="input-group">
                <label for="iClass">등급</label>
                <input type="text" id="iClass" value="등급" readonly>
            </div>
            <div class="input-group">
                <label for="nickname">아이디</label>
                <input type="text" id="strID" value="사용자아이디" readonly>
            </div>
            <div class="input-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="strNickname" value="사용자닉네임" readonly>
            </div>
            <div class="input-group">
                <label for="exchangeAmount">회수금액</label>
                <input type="text" id="exchangeAmount" placeholder="회수금액을 입력하세요">
            </div>
            <div class="button-group">
                    <button type="button" onclick="setAmount(500000)">50만</button>
                    <button type="button" onclick="setAmount(100000)">10만</button>
                    <button type="button" onclick="setAmount(50000)">5만</button>
                    <button type="button" onclick="setAmount(10000)">1만</button>
                    <button type="button" onclick="setAmount('RESET')" style="background-color: #20B2AA; color: white;">정정</button>
            </div>
            <div class="submit-button-container">
                <button class="submit-button" onclick="OnClickProcess('TAKE')">회수하기</button>
            </div>
        </div>
        `;
    }
       
    $(strModalTag).append(tag);
}

$(document).on('click', '.pay-btn, .deduct-btn', function(event) {
    event.preventDefault();
    let strID = $(this).attr('strID');
    let strNickname = $(this).attr('strnickname');
    let iClass = $(this).attr('iClass');
    const iCash = $(this).attr('iCash');
    let iRender = $(this).hasClass('pay-btn') ? 0 : 1;
    
    // Set the modal content
    SetModal('#myModal', iRender);

    // Set the modal fields
    $('#strID').val(strID);
    $('#strNickname').val(strNickname);
    if(iClass == 4)
    {
        $('#iClass').val('대본사');
    }
    else if(iClass == 5)
    {
        $('#iClass').val('부본사');
    }
    else if(iClass == 6)
    {
        $('#iClass').val('총판');
    }
    else if(iClass == 7)
    {
        $('#iClass').val('매장');
    }
    else if(iClass == 8)
    {
        $('#iClass').val('회원');
    }
    else
    {
        $('#iClass').val('본사');
    }
    $('#withdrawable').text(parseInt(iCash).toLocaleString()); // Adjust this value based on your data

    // Display the modal
    $('#myModal').show();
});

$(document).on('click', '.close', function() {
    $('#myModal').hide();
});

$(window).on('click', function(event) {
    if (event.target == document.getElementById('myModal')) {
        $('#myModal').hide();
    }
});

function openDetail(strNickname) {
    var scLeft = window.screenLeft + 50;
    var scTop = window.screenTop + 50;
    window.open('', 'popupDetail', `width=1280, height=720, top=${scTop}, left=${scLeft}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`);

    var $form = $('<form></form>');
    $form.attr('action', '/manage_user_popup/changemoneydetail');
    $form.attr('method', 'post');
    $form.attr('target', 'popupDetail');
    $form.appendTo('body');

    var idx = $(`<input type="hidden" value="${strNickname}" name="strNickname">`);

    $form.append(idx);
    $form.submit();
}