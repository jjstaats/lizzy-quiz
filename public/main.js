$(document).ready(function () {
    $.ajaxSetup({cache: false});
    update();
    window.setInterval(update, 2000);
});

var state1 = $('#state-1');
var state2 = $('#state-2');
var state3 = $('#state-3');
var state4 = $('#state-4');

var currentState = 1;

function update() {
    $.getJSON("http://quizzzy.herokuapp.com/state")
        .done(function (data) {
            console.log(data.state);
            if (1 == data.state) {
                setState1(data.data);
            }
            if (2 == data.state) {
                setState2(data.data);
            }
            if (3 == data.state) {
                setState3(data.data);
            }
            if (4 == data.state) {
                if ( 4 !== currentState ) {
                    setState4(data.data);
                }
            }
        })
        .fail(function (data) {
            console.log("error");
        })
        .always(function (data) {
            console.log("complete");
        });
}

function setState1(data) {
    console.log('state1');
    console.log(data);
    state1.show();
    state2.hide();
    state3.hide();
    state4.hide();

    currentState = 1;
}

function setState2(data) {
    console.log('state2');
    console.log(data);
    $('.player-1').html(data.player1.name);
    $('.player-2').html(data.player2.name);
    $('.player-3').html(data.player3.name);
    state1.hide();
    state2.show();
    state3.hide();
    state4.hide();

    currentState = 2;
}

function setState3(data) {
    console.log('state3');
    console.log(data);
    $('.player-current').html(data.current.name);
    $('.assignment').html(data.assignment);
    state1.hide();
    state2.hide();
    state3.show();
    state4.hide();

    currentState = 3;
}

function setState4(data) {
    console.log('state4');
    console.log(data);
    $('.score').hide();
    $('.long').hide();
    $('.loading').show();
    $('.player-winner').html(data.winner.name);
    state1.hide();
    state2.hide();
    state3.hide();
    state4.show();
    setTimeout(loadingDone,6500);

    function loadingDone() {
        $('.long').show();
        $('.loading').hide();
        setTimeout(loadingWinner, 6500);
    }

    function loadingWinner(){
        $('.score').show();
        $('.long').hide();
    }

    currentState = 4;
}