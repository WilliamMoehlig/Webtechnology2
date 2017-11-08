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

app.controller("homeCtrl", function($scope, searchSrv, addSrv){
	$('#searchButton').on('click', function(e){
		var actor = $("#actorText").val().toLowerCase();
		
		console.log(actor);
		
		searchSrv.SearchLocal(actor).then(function(data){
			$scope.movies = data;
		}, function(error){
			searchSrv.SearchImdb(actor).then(function(data){
				var html = "";
				
				var doc = {};
				doc.actor = actor;
				
				var movies = {};
				
				for(var currentMovie=0; currentMovie < data.data[0].filmography.actor.length; currentMovie++){
					html += data.data[0].filmography.actor[currentMovie].title + "  ";
					movies[currentMovie] = data.data[0].filmography.actor[currentMovie].title;
				}
				
				doc.movies = movies;
				
				addSrv.AddActor(actor, doc).then(function(data){
					$scope.movies = html;
				}, function(error){
					alert("onverwachte fout bij toevoegen aan DB");
				});
				
			}, function(error){
				alert("acteur niet gevonden" + error);
			}); 
		});
		
		
	});
});

app.service("searchSrv", function($http, $q){
	
	this.SearchLocal = function(actor){
		var q = $q.defer();
		$http.get("http://127.0.0.1:5984/movie/" + encodeURIComponent(actor)).then(function(response){
			q.resolve(response);
		},
		function(error){
			q.reject(error)
		});
		
		return q.promise;
	};
	
	this.SearchImdb = function(actor)
	{
		var q = $q.defer();
		$http.get("http://theimdbapi.org/api/find/person?name=" + encodeURIComponent(actor)).then(function(response){
			q.resolve(response);
		},
		function(error)
		{
			q.reject(error);
		});
		
		return q.promise;
	}
});

app.service("addSrv",function($http, $q){
	this.AddActor = function(actor, value){
		var q = $q.defer();
		
		$http.put("http://127.0.0.1:5984/movie/" + encodeURIComponent(actor), JSON.stringify(value)).then(function(response){
			q.resolve(response);
		}, function(error){
			q.reject(error);
		});
		
		return q.promise;
	};
});