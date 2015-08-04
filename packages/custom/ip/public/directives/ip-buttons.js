
var Intengopear = angular.module('mean.intengopear').directive('ipButtons', function(Ip){
	//Directive Definition Object
	var DDO = {
		scope: true,
		restrict: 'EA',
		templateUrl: function(tElem, tAttrs){
			debugger;
			return 'ip/views/partials/ip-buttons.html';
		}
	};
	
	
	return DDO;
});