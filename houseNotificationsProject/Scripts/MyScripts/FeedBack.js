$(function () {
    debugger;
   

    $(window).load(function () {
        FeedBack();
    });

 
});

function FeedBack() {
    $('#ButtonSendFeedBack').click(function () {
        $('#Message').text("");
        $('#Email').text("");

       
    });
}

