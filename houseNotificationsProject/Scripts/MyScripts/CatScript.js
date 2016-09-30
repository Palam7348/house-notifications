$(function () {
    var count = 0;
    $('img').click(function () {
        $('h2').text(count++);
        $('img').animate({
            height: "+=200",
            width: '+=200'
            
        }, 500);
        $('img').animate({
            height: "-=200",
            width: '-=200'
        }, 500);
    });
});