'use strict'

var app = angular.module("movieApp", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider
	.when("/home", {
        templateUrl : "assets/views/home.html",
        controller : "homeCtrl"
    })
    .otherwise({
        redirectTo : "/home"
    });
});