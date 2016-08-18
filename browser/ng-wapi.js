var apiClient = require('./api-client');
var defaults = require('lodash/defaults');

var _ = {
	defaults:defaults
}

if(!window.angular){
  throw 'Angular is not present.\nInclude <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script> before ng-wapi 😬';
};

angular.module('ngWapi',[])

.directive('wForm',function(){
  return {
        restrict: 'AE',
        replace: true,
        controller: ['$scope','$attrs',function ($scope,$attrs) {
            var formName = $attrs.wForm;
            $scope.submit = function(){
              apiClient.submitForm({
                name:formName,
                body:$scope.data
              }).then(function(){
                $scope.submitted = true;
                $scope.$digest();
              }).catch(function(e){
                $scope.fail = true;
                $scope.$digest();
              })
            }
        }]
    };
})
