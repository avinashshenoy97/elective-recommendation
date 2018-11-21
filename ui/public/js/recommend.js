function RecommendationService($http) {
    var self = this;

    self.http = $http;

    self.getRecommendations = function() {
        return window.localStorage.getItem('results');
    }
}

function RecommendationController(recommendationService) {
    var self = this;

    self.recommendationService = recommendationService;

    self.recommendations = JSON.parse(self.recommendationService.getRecommendations());
    if(self.recommendations === null || self.recommendations.length == 0) {
        window.location.pathname = '/';
    }
    console.log(self.recommendations)

    self.getRecommendations = function() {
        return self.recommendations;
    };

    self.clear = function() {
        window.localStorage.removeItem('results');
        window.location.pathname = '/home';
    };
}

var app = angular.module('recommendationApp', [])
            .service('RecommendationService', ['$http', RecommendationService])
            .controller('RecommendationController', ['RecommendationService', RecommendationController]);
