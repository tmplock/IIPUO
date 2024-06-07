var modal = $('#statusChangeModal');
var close_btn = $('.modal-close');
var cancelButton = $('#cancelButton');
var blockAllButton = $('#blockAllButton');
var blockSelfButton = $('#blockSelfButton');

let currentNickname;

let OnChangeStatus = (strNickname) => {
	console.log(strNickname);
	modal.show();
    currentNickname = strNickname;
}

blockAllButton.on('click', function() {
    // Add your logic for 전체변경 here
    modal.hide();
    let item = $(`#partner_agentstatus_${currentNickname}`);
    $.ajax({
        type: 'post',
        url: "/manage_partner/request_agentstate",
        context: document.body,
        data: { strNickname: currentNickname, eState: item.val(), iType:1 },

        success: function (data) {

            location.reload();

        }
    });
});

blockSelfButton.on('click', function () {
    // Add your logic for 본인변경 here
    modal.hide();
    let item = $(`#partner_agentstatus_${currentNickname}`);
    $.ajax({
        type: 'post',
        url: "/manage_partner/request_agentstate",
        context: document.body,
        data: { strNickname: currentNickname, eState: item.val(), iType:2 },

        success: function (data) {

            location.reload();

        }
    });
});

close_btn.on('click', function () {
    modal.hide();
    revertSelectOptions()
});

cancelButton.on('click', function () {
    modal.hide();
    revertSelectOptions()
});

$(window).on('click', function (event) {
    if ($(event.target).is(modal)) {
        modal.hide();
        revertSelectOptions()
    }
});

function revertSelectOptions() {
    console.log(currentNickname);
    let selectElement = $(`#partner_agentstatus_${currentNickname}`);
    let originalValue = selectElement.data('original-value');
    selectElement.val(originalValue);
}