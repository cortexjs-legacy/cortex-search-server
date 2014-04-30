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

function Controller($scope, $http, $timeout) {

	var isHistory = false;

	$scope.clearInput = function() {
		$scope.searchInput = '';
	}

	$scope.search = function() {
		var input = $scope.searchInput;
		if (input.indexOf(':') == -1) {
			$scope.searchByWords(input);
		} else {
			$scope.searchByCriteria(input);
		}

	}

	$scope.searchByWords = function(input) {
		$scope.searchInput = input;
		var queryString = toQueryString({
			q: input
		});
		$http.get('/-/search?' + queryString)
			.success(function(data) {
				$scope.pkgs = data;
				if (data.length > 0) {
					$scope.viewDetail(data[0])
				} else {
					$scope.pkg = null;
					showMsg('No package found');
				}
			}).error(function(data) {
				showMsg('Opps, unknown error');
			})

	}

	$scope.searchByCriteria = function(input) {
		$scope.searchInput = input;
		var queryObject = {};
		var field = input.split('\|');
		for (var i = field.length - 1; i >= 0; i--) {
			var query = field[i].split(':'); //['keyword':'ajax']
			queryObject[query[0]] = query[1];
		};

		$http.get('/-/search?' + toQueryString(queryObject))
			.success(function(data) {
				$scope.pkgs = data;
				if (data.length > 0) {
					$scope.viewDetail(data[0]);
				} else {
					$scope.pkg = null;
					showMsg('No package found');
				}
			}).error(function(data) {
				showMsg('Opps, unknown error');
			})
	}

	$scope.searchByKeyword = function(keyword) {
		$scope.searchByCriteria('keyword:' + keyword);
	}

	$scope.searchByName = function(name) {
		$scope.searchByCriteria('name:' + name);
	}

	$scope.marked = function(rawText) {
		var result;
		try {
			result = marked(rawText);
			return result;
		} catch (e) {
			return result;
		}
	}

	$scope.viewDetail = function(pkg,version) {
		$http.get('/-/package/' + pkg.name + (version?'/'+version:''))
			.success(function(data) {
				$scope.pkg = data;
				$scope.currentVersion=data.version;
				if (!isHistory) {
					history.pushState(null, pkg.name, '/package/' + pkg.name)
				}
			}).error(function(data) {
				showMsg('Opps, unknown error');
			})
	}

	$scope.viewVersion=function(version){
		$scope.viewDetail($scope.pkg,version);
	}

	window.onpopstate = function(event) {
		isHistory = true;
		init();
	}

	function init() {
		var result = /.+\/package\/(.+)/.exec(location.href);
		var packageName = result && result.length > 1 && result[1];
		if(packageName){
			$scope.searchByName(packageName);
		}else{
			$scope.searchByWords('app');
		}
	}

	init();

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
