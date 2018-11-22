function HomeService($http) {
    var self = this;
    self.http = $http;

    self.autoCompleteUrl = '/home/electives?semester=';
    self.submitUrl = '/home/predict';

    self.autoCompleteList = [];

    self.getAutoCompleteList = function(semester) {
        return self.http.get(self.autoCompleteUrl + encodeURIComponent(semester));
    };

    self.submitter = function(courses) {
        self.http.post(self.submitUrl, courses.map(course => course[0])).then(
            function success(response) {
                console.log(response.data);
                window.localStorage.setItem('results', JSON.stringify(response.data));
                window.location.pathname = '/home/recommend';
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

    self.semester = 1;

    self.input = '';
    self.descriptionDisplay = false;
    self.description = '';
    self.dispAutoCompleteList = [];
    self.autoCompleteList = [];
    self.fullAutoCompleteList = [0, 0, 0, 0];

    self.selectedCourses = [];
    self.maxSelectableCourses = [2, 4];

    self.changeSemester = function(dir) {
        switch(dir) {
            case 'dec':
                if(self.semester > 1) {
                    self.semester -= 1;
                }
                break;

            case 'inc':
                if(self.semester < self.maxSelectableCourses[self.maxSelectableCourses.length-1]) {
                    self.semester += 1;
                }
                break;
        }
    }

    self.getAutoCompleteList = function() {
        if(self.semester > self.maxSelectableCourses[self.maxSelectableCourses.length-1]) {
            return;
        }
        
        if(self.fullAutoCompleteList[window.parseInt(self.semester)-1] != 0) {
            self.autoCompleteList = self.fullAutoCompleteList[window.parseInt(self.semester)-1];
            self.dispAutoCompleteList = self.autoCompleteList;
            return;
        }

        self.homeService.getAutoCompleteList(self.semester).then(
            function success(response) {
                self.autoCompleteList = [];
                response.data.list.forEach(element => {
                    self.autoCompleteList.push([element[0], false, element[1], false]);
                });
                if(response.data.semester && self.fullAutoCompleteList[window.parseInt(response.data.semester)-1] == 0) {
                    self.fullAutoCompleteList[window.parseInt(response.data.semester)-1] = self.autoCompleteList;
                }
                self.dispAutoCompleteList = self.autoCompleteList;
            },
            function error(response) {
                //  ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu'].forEach(element => { //test
                //      self.autoCompleteList.push([element, false]);
                //  });
                console.log('Error fetching autocomplete list');
                console.log(response);
            }
        );
    };

    self.autoCompleter = function() {
        self.dispAutoCompleteList = [];

        // if(self.input.length == 0) {
        //     return;
        // }

        self.autoCompleteList.forEach(element => {
            if(element[0].toLocaleLowerCase().match(self.input.toLocaleLowerCase())) {
                self.dispAutoCompleteList.push(element);
            }
        });
    };

    self.selectCourse = function($event, item) {
        if(self.selectedCourses.length < self.maxSelectableCourses[self.maxSelectableCourses.length-1]) {
            item[1] = true;
            self.selectedCourses.push(item);
            self.changeSemester('inc');
            self.getAutoCompleteList();
        }

        self.input = '';
        $('input')[0].focus();
        self.autoCompleter();
        // self.toggleDescription(item);
        // $('input')[0].selectionStart = 0;
        // $('input')[0].selectionEnd = self.input.length;
    };

    self.unselectCourse = function($event, item) {
        item[1] = false;
        self.changeSemester('dec');
        self.getAutoCompleteList();
        self.autoCompleter();
        // self.toggleDescription(item);
        self.selectedCourses = self.selectedCourses.filter(function(e) {
            if(item[0] != e[0]) {
                return true;
            }
        });
    };

    self.enableDescription = function(item) {
        self.descriptionDisplay = true;
        self.description = item[2];
    };

    self.disableDescription = function() {
        self.descriptionDisplay = false;
    }

    self.submitter = function() {
        if(self.maxSelectableCourses.includes(self.selectedCourses.length)) {
            self.homeService.submitter(self.selectedCourses);
        }
        else {
            console.log('Error! Trying to submit too few courses!');
        }
    };

    self.submitable = function() {
        return self.maxSelectableCourses.includes(self.selectedCourses.length);
    };

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