function RecommendationService($http, $cookies) {
    var self = this;

    self.http = $http;
    self.cookieService = $cookies;

    self.getRecommendations = function() {
        return self.cookieService.get('results');
    }
}

function RecommendationController(recommendationService) {
    var self = this;

    self.recommendationService = recommendationService;

    self.recommendations = JSON.parse(self.recommendationService.getRecommendations());
    console.log(self.recommendations)

    self.getRecommendations = function() {
        return self.recommendations;
    }
}

var app = angular.module('recommendationApp', ['ngCookies'])
            .service('RecommendationService', ['$http', '$cookies', RecommendationService])
            .controller('RecommendationController', ['RecommendationService', RecommendationController]);
