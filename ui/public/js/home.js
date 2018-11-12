function HomeService($http) {
    var self = this;
    self.http = $http;

}

function HomeController(loginService, homeService) {
    var self = this;
    self.homeService = homeService;
    self.loginService = loginService;

}

var app = angular.module('homeApp', []);
app.service('LoginService', ['$http', LoginService]);
app.service('HomeService', ['$http', HomeService]);
app.controller('HomeController', ['LoginService', 'HomeService', HomeController]);

$(document).ready(function(){
    $('.nice-textbox').blur(function() {
        if($(this).val().length === 0){
            $('.nice-label').removeClass("focus");
        }
        else { return; }
    })
    .focus(function() {
        $('.nice-label').addClass("focus")
    });
});