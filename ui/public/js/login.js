function LoginController(loginService) {
    var self = this;

    self.loginService = loginService;

    self.signUpToggle = false;
    self.user = '';
    self.pass = '';
    self.confirmPass = '';

    self.submitter = function() {
        self.loginService.login(self.user, self.pass, self.confirmPass);
    };
}

function LoginService($http, $cookies) {
    var self = this;
    self.http = $http;
    self.cookieService = $cookies;

    self.authUrl = '/api/auth';

    self.isAuthenticated = false;

    self.error = false;
    self.errorMessage = '';

    self.login = function(user, pass, confirmPass) {
        self.error = false;
        self.errorMessage = '';

        var loginObj = {'user': user, 'pass': pass, isRegistration: !!confirmPass};
        
        self.http.post(self.authUrl, loginObj).then(
            function success(response) {
                if(response.data.invalid) {
                    self.error = true;
                    self.errorMessage = 'Invalid username or password!';
                }
                else {
                    $('form').fadeOut(500);
                    $('.wrapper').addClass('form-success');
                    setTimeout(function() {
                        window.location.pathname = '/home';
                    }, 600);
                }
            },
            function error(response) {
                self.error = true;
                self.errorMessage = 'An error occurred!';
                console.log(response);
            }
        )
    };
}

var app = angular.module('loginApp', []);
app.service('LoginService', ['$http', LoginService]);
app.controller('LoginController', ['LoginService', LoginController]);