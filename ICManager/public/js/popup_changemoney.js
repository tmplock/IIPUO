
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
            <div class="input-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="strNickname" value="사용자닉네임" readonly>
            </div>
            <div class="input-group">
                <label for="withdrawable">지급 가능 금액</label>
                <input type="text" id="withdrawable" value="0" readonly>
            </div>
            <div class="input-group">
                <label for="exchangeAmount">지급금액</label>
                <input type="text" id="exchangeAmount" placeholder="지급금액을 입력하세요">
            </div>
            <div class="button-group">
                <button type="button" onclick="setAmount(1000000)">100만원</button>
                <button type="button" onclick="setAmount(500000)">50만원</button>
                <button type="button" onclick="setAmount(100000)">10만원</button>
                <button type="button" onclick="setAmount(50000)">5만원</button>
                <button type="button" onclick="setAmount(10000)">1만원</button>
                <button type="button" onclick="setAmount('RESET')" style="background-color: #20B2AA; color: white;">정정</button>
                <button type="button" onclick="setAmount('ALL')" style="background-color: #4682B4; color: white;">전체</button>
            </div>
            <div class="input-group">
                <label for="memo">메모</label>
                <textarea id="memo" placeholder="메모를 입력하세요"></textarea>
            </div>
            <div class="input-group">
                <label for="password">지급 비밀번호</label>
                <input type="password" id="changemoneypw" placeholder="지급 비밀번호를 입력하세요">
            </div>
            <div class="submit-button-container">
                <button class="submit-button" onclick="submitExchange()">지급하기</button>
            </div>
        </div>
        `;
    }
    else {
        tag = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>회수하기</h2>
            <div class="input-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="strNickname" value="사용자닉네임" readonly>
            </div>
            <div class="input-group">
                <label for="withdrawable">회수 가능 금액</label>
                <input type="text" id="withdrawable" value="0" readonly>
            </div>
            <div class="input-group">
                <label for="exchangeAmount">회수금액</label>
                <input type="text" id="exchangeAmount" placeholder="회수금액을 입력하세요">
            </div>
            <div class="button-group">
                <button type="button" onclick="setAmount(1000000)">100만원</button>
                <button type="button" onclick="setAmount(500000)">50만원</button>
                <button type="button" onclick="setAmount(100000)">10만원</button>
                <button type="button" onclick="setAmount(50000)">5만원</button>
                <button type="button" onclick="setAmount(10000)">1만원</button>
                <button type="button" onclick="setAmount('RESET')" style="background-color: #20B2AA; color: white;">정정</button>
                <button type="button" onclick="setAmount('ALL')" style="background-color: #4682B4; color: white;">전체</button>
            </div>
            <div class="input-group">
                <label for="memo">메모</label>
                <textarea id="memo" placeholder="메모를 입력하세요"></textarea>
            </div>
            <div class="input-group">
                <label for="password">회수 비밀번호</label>
                <input type="password" id="changemoneypw" placeholder="회수 비밀번호를 입력하세요">
            </div>
            <div class="submit-button-container">
                <button class="submit-button" onclick="submitExchange()">회수하기</button>
            </div>
        </div>
        `;
    }
       
    $(strModalTag).append(tag);
}

$(document).on('click', '.pay-btn, .deduct-btn', function(event) {
    event.preventDefault();
    
    let strNickname = $(this).attr('strnickname');
    const iCash = $(this).attr('iCash');
    let iRender = $(this).hasClass('pay-btn') ? 0 : 1;
    
    // Set the modal content
    SetModal('#myModal', iRender);

    // Set the modal fields
    $('#strNickname').val(strNickname);
    $('#withdrawable').val(parseInt(iCash).toLocaleString()); // Adjust this value based on your data

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