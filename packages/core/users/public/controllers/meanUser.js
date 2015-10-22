'use strict';

var usersModule = angular.module('mean.users');
  
usersModule.controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global', 'loggedin', AuthRoutes])
usersModule.controller('LoginCtrl', ['$rootScope', 'MeanUser', LoginRoutes])
usersModule.controller('RegisterCtrl', ['$rootScope', 'MeanUser', RegisterRoutes])
usersModule.controller('ForgotPasswordCtrl', ['MeanUser', ForgotPasswordRoutes])
usersModule.controller('ResetPasswordCtrl', ['MeanUser', ResetPasswordRoutes]);

function AuthRoutes($scope, $rootScope, $http, $state, Global, loggedin) {
    if(loggedin == '0'){
      window.tmp = {
        loggedin: loggedin
      }
      
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
          //console.log('to state: ', toState.name, 'loggedin: ', window.tmp.loggedin);

          if(toState.name == 'home' && window.tmp.loggedin == '0'){
              event.preventDefault();
              console.log('state change prevented');
          }
          
          delete window.tmp;
          return;
      });
    }

    // This object will contain list of available social buttons to authorize
    $scope.socialButtonsCounter = 0;
    $scope.global = Global;
    $scope.$state = $state;

    $http.get('/api/get-config')
      .success(function(config) {
        $scope.socialButtons = config;
      });
}

function LoginRoutes($rootScope, MeanUser) {
    var vm = this;

    // This object will be filled by the form
    vm.user = {};
    
    vm.input = {
      type: 'password',
      placeholder: 'Password',
      confirmPlaceholder: 'Repeat Password',
      iconClass: '',
      tooltipText: 'Show password'
    };

    vm.togglePasswordVisible = function() {
      vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
      vm.input.placeholder = vm.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
      vm.input.iconClass = vm.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
      vm.input.tooltipText = vm.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
    };

    $rootScope.$on('loginfail', function(){
      vm.loginError = MeanUser.loginError;
    });

    //When you submit the login form
    //Wrapper for the meanUser service login method.
    vm.login = function() {
      MeanUser.login(this.user);
    };
}

function RegisterRoutes($rootScope, MeanUser) {
    var vm = this;

    vm.user = {};
    
    vm.registerForm = MeanUser.registerForm = true;

    vm.input = {
      type: 'password',
      placeholder: 'Password',
      placeholderConfirmPass: 'Repeat Password',
      iconClassConfirmPass: '',
      tooltipText: 'Show password',
      tooltipTextConfirmPass: 'Show password'
    };

    vm.togglePasswordVisible = function() {
      vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
      vm.input.placeholder = vm.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
      vm.input.iconClass = vm.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
      vm.input.tooltipText = vm.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
    };
    vm.togglePasswordConfirmVisible = function() {
      vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
      vm.input.placeholderConfirmPass = vm.input.placeholderConfirmPass === 'Repeat Password' ? 'Visible Password' : 'Repeat Password';
      vm.input.iconClassConfirmPass = vm.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
      vm.input.tooltipTextConfirmPass = vm.input.tooltipTextConfirmPass === 'Show password' ? 'Hide password' : 'Show password';
    };

    // Register the register() function
    vm.register = function() {
      MeanUser.register(this.user);
    };
}

function ForgotPasswordRoutes(MeanUser) {
  var vm = this;
  vm.user = {};      
  vm.registerForm = MeanUser.registerForm = false;
  vm.forgotpassword = function() {
    MeanUser.forgotpassword(this.user);
  };
}

function ResetPasswordRoutes(MeanUser) {
  var vm = this;
  vm.user = {};      
  vm.registerForm = MeanUser.registerForm = false;
  vm.resetpassword = function() {
    MeanUser.resetpassword(this.user);
  };
}