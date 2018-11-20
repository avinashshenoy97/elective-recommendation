function RecommendationService($http) {
    self.http = $http;
}

function RecommendationController(recommendationService) {
    self.recommendationService = recommendationService;
}

var app = angular.module('recommendationApp', [])
            .service('RecommendationService', ['$http', RecommendationService])
            .controller('RecommendationController', ['RecommendationService', RecommendationController]);
