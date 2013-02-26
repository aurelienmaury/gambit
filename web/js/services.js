gambitModule.factory('eventbus', function ($rootScope, chatHistory) {
    var eb = new vertx.EventBus(window.location.protocol + 
				'//' + 
				window.location.hostname + 
				':' + window.location.port + 
				'/eventbus');
    eb.handlersQueue = {};
    eb.messageQueue = [];

    eb.onopen = function () {
	var waitingHandlersSet = 0;
        angular.forEach(eb.handlersQueue, function (handler, key) {
	    eb.registerHandler(key, handler);
	    waitingHandlersSet++;
        });
	console.log(waitingHandlersSet + ' waiting handlers set');
	var waitingMessagesSent = 0;
        angular.forEach(eb.messageQueue, function (call) {
	    eb.send(call.channel, call.message, function(reply) {
		$rootScope.$apply(function() {
		    if(call.callback) { call.callback(reply); }
		});
	    });	    
	    waitingMessagesSent++;
        });
	console.log(waitingMessagesSent+ ' queued messages sent.');
	console.log('EventBus is fully open');
    };

    return {
        bus:eb,
        send:function (channel, message, callback) {
            var self = this;
            if (self.bus.readyState() == vertx.EventBus.OPEN) {
		console.log('sending');
                self.bus.send(channel, message, function(reply) {
		    $rootScope.$apply(function() {
			if(callback) { callback(reply);	}
		    });
		});
            } else {
		console.log('queuing message');
                self.bus.messageQueue.push({channel:channel, message:message, callback:callback});
            }
        },

        handle:function (channel, handler) {
            var self = this;
            if (self.bus.readyState() == vertx.EventBus.OPEN) {
		console.log('Registered handler for '+channel);
                self.bus.registerHandler(channel, function() {
		    $rootScope.$apply(handler);
		});
            } else {
                self.bus.handlersQueue[channel] = handler;
            }
        }
    };
});

gambitModule.factory('uploader', function ($rootScope) {
    return {
        sendFile:function (fileDescList, index, progressCallback) {
            if (index >= fileDescList.length) { return; }

            self = this;
            if (fileDescList[index].status == FileStatus.SELECTED) {
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var progress = Math.round((e.loaded * 100) / e.total);
                        $rootScope.$apply(function() {
			    progressCallback(index, progress, progressCallback);
			});
                    }
                }, false);

                fileDescList[index].progress = 0;
                fileDescList[index].status = FileStatus.UPLOADING;

                xhr.open('PUT', '/upload?filename=' + fileDescList[index].name);
                xhr.send(fileDescList[index].file);
            } else {
                self.sendFile(fileDescList, ++index, progressCallback);
            }
        }
    };
});
