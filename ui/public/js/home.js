function HomeService($http) {
    var self = this;
    self.http = $http;

    self.autoCompleteUrl = '/home/electives';
    self.submitUrl = '/home/predict';

    self.autoCompleteList = [];

    self.getAutoCompleteList = function() {
        self.http.get(self.autoCompleteUrl).then(
            function success(response) {
                response.data.forEach(element => {
                    self.autoCompleteList.push([element, false]);
                });
            },
            function error(response) {
                 ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu'].forEach(element => { //test
                     self.autoCompleteList.push([element, false]);
                 });
                console.log('Error fetching autocomplete list');
                console.log(response);
            }
        )
    };

    self.submitter = function(courses) {
        self.http.post(self.submitUrl, courses.map(course => course[0])).then(
            function success(response) {
                console.log(response.data);
            },
            function error(response) {
                console.log(response);
            });
    };
}

function HomeController(loginService, homeService) {
    var self = this;
    self.homeService = homeService;
    self.loginService = loginService;

    self.homeService.getAutoCompleteList();
    self.input = '';
    self.autoCompleteList = [];

    self.selectedCourses = [];
    self.maxSelectableCourses = 3;

    self.autoCompleter = function() {
        self.autoCompleteList = [];

        // if(self.input.length == 0) {
        //     return;
        // }

        self.homeService.autoCompleteList.forEach(element => {
            if(element[0].match(self.input)) {
                self.autoCompleteList.push(element);
            }
        });
    };

    self.selectCourse = function($event, item) {
        if(self.selectedCourses.length < self.maxSelectableCourses) {
            item[1] = true;
            self.selectedCourses.push(item);
        }
    };

    self.unselectCourse = function($event, item) {
        item[1] = false;
        self.selectedCourses = self.selectedCourses.filter(function(e) {
            if(item[0] != e[0]) {
                return true;
            }
        });
    }

    self.submitter = function() {
        if(self.selectedCourses.length == self.maxSelectableCourses) {
            self.homeService.submitter(self.selectedCourses);
        }
    }

    self.logout = function(){ 
        window.location.pathname = '/logout'; 
    }

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