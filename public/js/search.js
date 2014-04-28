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

function Controller($scope, $http, $timeout, $location, $anchorScroll) {

	$scope.clearInput = function() {
		$scope.searchInput = '';
	}

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
				if (data.length > 0) {
					$scope.viewDetail(data[0])
				} else {
					$scope.pkg=null;
					showMsg('No package found');
				}
			}).error(function(data) {
				showMsg('Opps, unknown error');
			})

	}

	searchByKeyWord('app')

	function searchByCriteria(input) {
		var queryObject = {}
		var field = input.split('\|');
		for (var i = field.length - 1; i >= 0; i--) {
			var query = field[i].split(':') //['keyword':'ajax']
			queryObject[query[0]] = query[1]
		};

		$http.get('/rest/search?' + toQueryString(queryObject))
			.success(function(data) {
				$scope.pkgs = data;
				if (data.length > 0) {
					$scope.viewDetail(data[0])
				}else {
					$scope.pkg=null;
					showMsg('No package found');
				}
			}).error(function(data) {
				showMsg('Opps, unknown error');
			})
	}

	$scope.marked = function(rawText) {
		var result;
		try{
			result= marked(rawText);
			return result;
		}catch(e){
			return result;
		}
	}

	$scope.viewDetail = function(pkg) {
		$http.get('/rest/package/' + pkg.name)
			.success(function(data) {
				$scope.pkg = data;
				goToTop();
			}).error(function(data) {
				showMsg('Opps, unknown error');
			})
	}

	function goToTop() {
		$location.hash('top');
		$anchorScroll();
	}

	function showMsg(msg) {
		$scope.msg = msg;
		$timeout(function() {
			$scope.msg = '';
		}, 3000)
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