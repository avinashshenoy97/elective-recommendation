function HomeService($http) {
    var self = this;
    self.http = $http;

    self.autoCompleteUrl = '/idk';

    self.autoCompleteList = [];

    self.getAutoCompleteList = function() {
        self.http.get(self.autoCompleteUrl).then(
            function success(response) {
                self.autoCompleteList = response.data;
            },
            function error(response) {
                // self.autoCompleteList = ['abc', 'def', 'ghi']; //to test
                console.log('Error fetching autocomplete list');
                console.log(response);
            }
        )
    };
}

function HomeController(loginService, homeService) {
    var self = this;
    self.homeService = homeService;
    self.loginService = loginService;

    self.homeService.getAutoCompleteList();
    self.input = '';
    self.autoCompleteList = [];

    self.autoCompleter = function() {
        self.autoCompleteList = [];

        if(self.input.length == 0) {
            return;
        }

        self.homeService.autoCompleteList.forEach(element => {
            if(element.match(self.input)) {
                self.autoCompleteList.push(element);
            }
        });
    };

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