(function(angular) {
"use strict";

angular.module('bm-share-app', ['firebase'])


.controller('AppCtrl', function($scope, $firebaseArray, LocalDataService) {

	$scope.form = {
		name: LocalDataService.getName(),
		address: LocalDataService.getAddress()
	};

	var
		address = LocalDataService.getAddress(),
		firebaseUrl = 'https://bm-share.firebaseio.com/bm-share/' + address,
		firebaseRef = $firebaseArray(new Firebase(firebaseUrl));

	firebaseRef.$loaded(function(snapshot) {
		firebaseRef = firebaseRef.reverse();
	});

	$scope.data = firebaseRef;

	$scope.openUrl = function(url) {
		chrome.tabs.create({
			url: url,
			active: true
		});
	};

	$scope.delItem = function(itemId) {
		console.log(itemId);
		$scope.data.$remove(itemId).then(function(ref) { ref.key() === item.$id; });
	};

	$scope.saveSettings = function () {
		LocalDataService.setData($scope.form.name, $scope.form.address)
	}
})




.service('LocalDataService', function(){
	this.setData = function (name, address) {
		if(typeof(localStorage) !== "undefined") {
			localStorage.setItem("bm-user", name);
			localStorage.setItem("bm-address", address);
		} else {
			console.log('no local storage');
		}
	}

	this.getName = function () {
		return localStorage.getItem("bm-user") === "undefined" ? "Default" : localStorage.getItem("bm-user");
	}

	this.getAddress = function () {
		return localStorage.getItem("bm-address") === "undefined" ? "office" : localStorage.getItem("bm-address");
	}
})






.service('ChromeDataService', function(){
	this.getName = function () {
		var redata = "";
		chrome.storage.local.get('bm-user', function (data) {
			if (data['bm-user'] == undefined) {
				redata = 'Default';
			} else {
				console.log(data['bm-user']);
				redata = data['bm-user'];
			}
			return redata;
		});
	}

	this.getAddress = function () {
		var redata = "";
		chrome.storage.local.get('bm-address', function (data) {
			if (data['bm-address'] == undefined) {
				redata = 'office';
			} else {
				console.log(typeof data['bm-address']);
				redata = data['bm-address'];
			}
			return redataa;
		});
	}

	this.setData = function (name, address) {
		chrome.storage.local.set(
			{
				'bm-user': name,
				'bm-address': address
			}, function() {
			console.log('saved');
		});
	}
})

})(angular);