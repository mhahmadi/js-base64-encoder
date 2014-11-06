var app = angular.module('base64Encoder', []);

app.controller('EncoderCtrl', ['$scope', function($scope) {
	$scope.fileApiSupported = window.File && window.FileReader; // Check for File API support.
	$scope.base64 = "";
	$scope.multimedia = false;

	$("[data-toggle=tooltip]").tooltip({trigger: 'manual'});

	$scope.processFile = function(file) {
		$scope.base64 = btoa(file.binary);
		var src = "data:" + file.type + ";base64," + $scope.base64;

		var videoPlayer = $('<video></video>').get(0);
	var audioPlayer = $('<audio></audio>').get(0);
		var imageTypes = /image\/(gif|jpeg|png|bmp)$/i;

		$scope.multimedia = true;

		if (videoPlayer.canPlayType(file.type) !== '') {
			$('#media-container').html(" <video src='" + src + "' controls></video>");
		} else if (audioPlayer.canPlayType(file.type) !== '') {
			$('#media-container').html(" <audio src='" + src + "' controls></audio>");
		} else if (imageTypes.test(file.type)) {
			$('#media-container').html(" <img src='" + src + "'>");
		} else {
			$('#media-container').html(" ");
			$scope.multimedia = false;
		}
	}
}]);

app.directive('dropZone', function() {
	return {
		restrict: 'E',
		templateUrl: 'drop-zone.html',
		scope: {
			callback: '&'
		},
		link: function(scope, element, attrs, ctrl) {
			scope.clear = function() {
				scope.progress = 0;
				scope.file = {};
			}
			scope.clear();

			element.on('dragover', function(e) {
				e.stopPropagation();
				e.preventDefault();

				e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy
				if(!scope.file.name) element.addClass('drag-over');
			});

			element.on('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();

				element.removeClass('drag-over');
			});

			element.on('drop', function(e) {
				e.stopPropagation();
				e.preventDefault();

				scope.clear();

				var file = e.originalEvent.dataTransfer.files[0];
				scope.file.name = file.name;
				scope.file.type = file.type;

				element.removeClass('drag-over');

				reader.readAsBinaryString(file);
			});

			var reader = new FileReader();
			reader.onloadstart = function (e) {
				scope.progress = 0;
			};
			reader.onprogress = function (e) {
			scope.progress = Math.round((e.loaded / e.total) * 100);
			};
			reader.onload = function (e) {
				scope.progress = 100;
				scope.file.binary = reader.result;
			scope.callback({file: scope.file});
			scope.$apply();
			};
		}
	};
});

app.directive('clipboardCopy', function() {
	return {
		link: function(scope, element) {
			var client = new ZeroClipboard(element);

			client.on("ready", function(readyEvent) {

				client.on("aftercopy", function(event) {

					$("#clipboard-copy-alert").toggleClass("faded");
					window.setTimeout(function() {
						$("#clipboard-copy-alert").toggleClass("faded");
					}, 1000);
				});

			});

			element.on("mouseover", function(event) {
				element.tooltip('show');
			});

			element.on("mouseleave", function(event) {
				element.tooltip('hide');
			});
		}
	};
});