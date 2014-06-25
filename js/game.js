// Game State
var GAME_RUNNING = false;
var i = 0,
    timeStart;

// Preventing Map On Show ContextMenu On RightClick
$("#map").on({
    "contextmenu": function (e) {
        console.log("ctx menu button:", e.which);

        // Stop the context menu
        e.preventDefault();
    }
});

// Defining MapData for Reset Button
var mapData;


// Building map based on the "basic", "medium" and "hard" defficulties
$('.settings a').click(function (e) {
    if ($(this).hasClass("active")) return;

    var row = $(this).data('row');
    var cell = $(this).data('cell');
    var mine = $(this).data('mine');

    mapData = mineMap("#map", cell, row, mine);

    $('.settings a').removeClass('active');
    $(this).addClass('active');

    e.preventDefault();

});

// Building a custom map
$('.buildmap').click(function (e) {
    var row = $('input.rows').val();
    var cell = $('input.cell').val();
    var mine = $('input.mine').val();
    if ( row < 1 && cell < 1 && mine < 1 ) {
      alert("Mine Or Cell Or Mines should be positive and greater than 1!");
      e.preventDefault();
      return
    }
    if (mine > row * cell) {
        alert('Mine should be less than ' + row * cell + '!');
        e.preventDefault();
        return;
    }
    $('.settings a').removeClass('active');
    mapData = mineMap("#map", cell, row, mine);

    e.preventDefault();
});

// Reseting the map.
$('.reset').click(function (e) {
    mineMap("#map", mapData.X, mapData.Y, mapData.mineNumber);
});

var timerInit = function () {

    GAME_RUNNING ? $('.timer').text(timeFormatter(++i)) : "";

    timeStart = setTimeout('timerInit()', 1000);

}

var timerPause = function () {
    clearTimeout(timeStart);
}

var timerReset = function () {
    timerPause();
    i = 0;
    $('.timer').html(' 0 : 0 ');
    timerInit();
}

var timeFormatter = function (count) {

    var second = count % 60,
        minute = Math.floor(count / 60);

    return minute + " : " + second;
}

// Aligning the map vertical middle.
var verticalAlign = function (rows) {
    var spanHeight = $('#map li').outerHeight(),
        mapHeight = rows * spanHeight + 5;
        $('#map').height(mapHeight);
}

// Building the default map
mapData = mineMap("#map", 10, 10, 20);