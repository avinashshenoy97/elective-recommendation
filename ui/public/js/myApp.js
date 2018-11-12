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

function LoginService($http) {
    var self = this;
    self.http = $http;

    self.authUrl = '/api/auth';

    self.error = false;
    self.errorMessage = '';

    self.login = function(user, pass, confirmPass) {
        self.error = false;
        self.errorMessage = '';

        var loginObj = {'user': user, 'pass': pass, 'isRegistration': !!confirmPass};
        
        self.http.post(self.authUrl, loginObj).then(
            function success(response) {
                if(response.data.invalid) {
                    self.error = true;
                    self.errorMessage = 'Invalid username or password!';
                }
                else {
                    $('form').fadeOut(500);
                    $('.wrapper').addClass('form-success');
                    window.location.pathname = '/home';
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

var myApp = angular.module('myApp', [])
    .service('LoginService', ['$http', LoginService])
    .controller('LoginController', ['LoginService', LoginController]);
