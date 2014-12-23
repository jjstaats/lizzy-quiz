// app.js

// create the module and name it quizApp
var quizApp = angular.module('quizApp', ['ngRoute']);
var quizApi = "http://quizzzy.herokuapp.com/state";
var quizData = {};

var opdrachten = [
    "Noem 5 surprise van vorig jaar.",
    "Sta stil en doe een dansje.",
    "Wat is het stomste wat je het afgelopen jaar hebt gedaan?",
    "Koop een jurylid om met complimenten.",
    "Doe een pauw na. (Lizzy en Anne weten hoe!)",
    "Bedreig de quizmaster, je krijgt punten voor stijl.",
    "Aai Michiel over zijn bol!",
    "Zing een stuk van een Disney nummer.",
    "Wissel je trui met iemand. (kersttrui is 2x de jurypunten)",
    "Geeft de mooiste geklede persoon een compliment. (hint: misschien een jury lid :p)",
    "Scheld Jeroen uit! Je krijgt punten voor stijl!",
    "Scheld in latijn.",
    "Haal voor de juryleden drinken.",
    "Verzin zelf een opdracht voor maximaal punten! Jury punten 2x!",
    "Doe het Gangnam style dansje"
];

quizApp.run(['$http', '$q', function ($http, $q) {
    $http.post(quizApi, {
        "state": 1,
        "data": {}
    });
}]);


// configure our routes
quizApp.config(function ($routeProvider) {
    $routeProvider

        // route for the setup/home page
        .when('/', {
            templateUrl: 'pages/setup.html',
            controller: 'mainController'
        })

        // route for the start page quiz
        .when('/start', {
            templateUrl: 'pages/start.html',
            controller: 'startController'
        })


        // route for the opdracht page
        .when('/opdracht/:num', {
            templateUrl: 'pages/opdracht.html',
            controller: 'opdrachtController'
        })

        // route for the uitslag page
        .when('/uitslag', {
            templateUrl: 'pages/uitslag.html',
            controller: 'uitslagController'
        });
});


// create the controler and inject Angular's $scope
quizApp.controller('mainController', function ($scope, $http, $location) {
    // create a message to display in our view
    $scope.message = 'Start';

    // process the form
    $scope.formData = {};

    $scope.processForm = function () {

        var stateData = {
            state: 2,
            data: {
                player1: {
                    name: $scope.formData.persoon1,
                    score: 0
                },
                player2: {
                    name: $scope.formData.persoon2,
                    score: 0
                },
                player3: {
                    name: $scope.formData.persoon3,
                    score: 0
                },
                jury1: {
                    name: $scope.formData.jury1,
                    score: 0
                },
                jury2: {
                    name: $scope.formData.jury2,
                    score: 0
                },
                jury3: {
                    name: $scope.formData.jury3,
                    score: 0
                }
            }
        };

        $http.post('http://quizzzy.herokuapp.com/state', stateData)
            .success(function (data) {
                quizData = data;
                $location.path('/start')
            })
            .error(function (data) {
                console.log(data);
            });
    }
});

quizApp.controller('startController', function ($scope, $location) {
    $scope.message = 'Vragen en score.';
    console.log(quizData);
    $scope.formData = quizData;

    $scope.go = function (path) {
        $location.path(path+"/0");
    };

});

quizApp.controller('opdrachtController', function ($scope, $http, $location, $routeParams) {
    $scope.message = 'opdrachten binnenhalen';
    $scope.formData = quizData;

    if (!quizData.currentOp) {
        quizData.currentOp = 0;
    }


    $scope.currentOp = opdrachten[quizData.currentOp];

    $scope.knoptekst = (quizData.currentOp == opdrachten.length-1) ? "Bereken resultaten":"Volgende opdracht";

    quizData.state = 3;
    quizData.data.current = quizData.data["player" + (1 + quizData.currentOp % 3)];
    quizData.data.assignment = opdrachten[quizData.currentOp];




    $http.post('http://quizzzy.herokuapp.com/state', quizData)
        .success(function (data) {
            quizData = data;
        })
        .error(function (data) {
            console.log(data);
        });


    $scope.go = function (path) {
        quizData.currentOp++;
        if(quizData.currentOp == opdrachten.length){
            $location.path('uitslag');
        } else {

            $location.path(path+"/"+quizData.currentOp);
        }
        $scope.go = function(path) {};
    };
});

quizApp.controller('uitslagController', function ($scope, $http, $location) {
    $scope.message = '';


    quizData.state = 4;
    quizData.data.winner = {"name":"Lizzy","score":"10"};

    $http.post('http://quizzzy.herokuapp.com/state', quizData)
        .success(function (data) {
            quizData = data;
        })
        .error(function (data) {
            console.log(data);
        });
});

