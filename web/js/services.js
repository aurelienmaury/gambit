gambitModule.value('channelsInit', {});

gambitModule.factory('eventbus', function (channelsInit) {
    var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

    eb.onopen = function () {
        angular.forEach(channelsInit, function (handler, key) {
            eb.registerHandler(key, handler);
        });
    };

    return {
        bus:eb,
        uuid:'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a, b) {
            return b = Math.random() * 16, (a == 'y' ? b & 3 | 8 : b | 0).toString(16)
        }),
        nick:null,
        sendChat:function (chatMessage) {
            if (chatMessage.length > 0) {
                var self = this;
                if (!self.nick) {
                    self.bus.send('nicks.get', {uuid:this.uuid}, function (reply) {
                        self.nick = reply.nick;
                        self.bus.publish('gambit.chat', {message:chatMessage, nick:self.nick});
                    });
                } else {
                    self.bus.publish('gambit.chat', {message:chatMessage, nick:self.nick});
                }
            }
        },
        handle:function (channel, handler) {
            var self = this;
            if (self.bus.readyState == vertx.EventBus.OPEN) {
                self.bus.registerHandler(channel, handler);
            } else {
                channelsInit[channel] = handler;
            }
        }
    };
});


gambitModule.factory('uploader', function () {
    return {
        send:function (fileDesc, refresh) {
            var xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", function (e) {
                if (e.lengthComputable) {

                    fileDesc.progress = Math.round((e.loaded * 100) / e.total);
                    console.log('progress ' + fileDesc.name + ' ' + fileDesc.progress);
                    refresh();
                }
            }, false);

            xhr.upload.addEventListener("load", function (e) {
                fileDesc.progress = 100;
                fileDesc.status = FileStatus.FINISHED;
                refresh();
            }, false);

            fileDesc.progress = 0;
            fileDesc.status = FileStatus.UPLOADING;
            refresh();
            xhr.open("PUT", "/upload?filename=" + fileDesc.name);
            xhr.send(fileDesc.file);
        }
    };
});

gambitModule.factory('fileStore', function (eventbus) {

    return {
        list:function (callback) {
            eventbus.send('fileStore.list', {}, function(reply) {
                callback(reply);
            });
        }
    };
});