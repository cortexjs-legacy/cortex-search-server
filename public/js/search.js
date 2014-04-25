var app = angular.module('app', []);

app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

function Controller($scope, $http) {

	$scope.search = function() {
		var input = $scope.searchInput;
		if (input.indexOf(':') == -1) {
			searchByKeyWord(input);
		} else {
			searchByCriteria(input);
		}

	}

	function searchByKeyWord(input) {
		var queryString = toQueryString({
			q: input
		})
		$http.get('/rest/search?' + queryString)
			.success(function(data) {
				$scope.pkgs = data;
				if(data.length>0){
					$scope.viewDetail(data[0])
				}
			}).error(function(data) {
				alert('error')
			})

	}

	searchByKeyWord('cortex')

	function searchByCriteria(input) {
		var queryObject={}
		var field=input.split('\|');
		for (var i = field.length - 1; i >= 0; i--) {
			var query=field[i].split(':') //['keyword':'ajax']
			queryObject[query[0]]=query[1]
		};

		$http.get('/rest/search?' + toQueryString(queryObject))
			.success(function(data) {
				$scope.pkgs = data;
				if(data.length>0){
					$scope.viewDetail(data[0])
				}
			}).error(function(data) {
				alert('error')
			})
	}

	$scope.viewDetail = function(pkg) {
		$http.get('/rest/package/' + pkg.name)
			.success(function(data) {
				$scope.pkg = data;
			}).error(function(data) {
				alert('error')
			})
	}

	function toQueryString(obj) {
		var parts = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
			}
		}
		return parts.join("&");
	}
}