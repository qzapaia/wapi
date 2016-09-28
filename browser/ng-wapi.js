var apiClient = require('./api-client');
var Dropzone = require('dropzone');
var querystring = require("querystring");

var _ = {
	defaults:require('lodash/defaults'),
	forIn:require('lodash/forIn')
}

if(!window.angular){
  throw 'Angular is not present.\nInclude <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script> before ng-wapi 😬';
};

try {
	if(angular.module('ngWapi')){
		throw 'exists';
	};
}catch(err){
	if(err == 'exists'){
		throw 'ngWapi is already present. Avoiding initialization ...';
	}
}

angular.module('ngWapi',[])
.config(['$sceDelegateProvider',function($sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
}])
.directive('wForm',function(){
  return {
    restrict: 'AE',
		scope:true,
		link:function(scope,el,attrs){
			scope._dz = {};
			var fileEls = el[0].querySelectorAll('[file]');

			fileEls.forEach(function(el){
				var name = el.getAttribute('name');
				if(!name){ throw ('name attribute is required in '+el) };

				scope._dz[name] = new Dropzone(el,{
					url: '/',
					autoProcessQueue:false,
					init: function() {
						this.on('addedfile', function(file) {
					    if (this.files.length > 1) {
					      this.removeFile(this.files[0]);
					    }
					  });
					}
				});

			});

		},
    controller: ['$scope','$attrs',function ($scope,$attrs) {
				window.s = $scope;
        var formName = $attrs.wForm;

        $scope.submit = function(){
					var files = {};

					_.forIn($scope._dz, function(dz, name) {
						if(dz.files){
							files[name] = dz.files[0];
						}
					});

					$scope.sending = true;

          apiClient.submitForm({
            name:formName,
            body:$scope.data,
            files:files
          }).then(function(response){
						// 'submitted' means ok post
						$scope.sending = false;
						$scope.submitted = true;

            $scope.response = response;

						if($attrs.onResponseRedirect){
							var redirectTo = $scope.$eval($attrs.onResponseRedirect);
							location.href=redirectTo;
						}

						$scope.$digest();

          }).catch(function(e){
						$scope.sending = false;
            $scope.fail = true;
            $scope.$digest();
          })
        }
    }]
  };
})
.directive('wUrl',function(){
	return {
    restrict: 'AE',
		scope:false,
    controller: ['$scope','$attrs','$location',function ($scope,$attrs,$location){
			$scope.url = {
				path:location.pathname.split('/'),
				query:querystring.parse(location.search.slice(1))
			}
    }]
  };
})
.directive('wGet',function(){
  return {
    restrict: 'AE',
		scope: true,
    controller: ['$scope', '$attrs', function($scope,$attrs){
			$scope.resourcePath = $scope.$eval($attrs.wGet);

			apiClient.getResource({
				resourcePath:$scope.resourcePath
			}).then(function(response){
				$scope.data = response;
				$scope.$digest();
			});
    }]
  };
})
