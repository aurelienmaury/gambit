gambitModule.value('channelsInit', {});

gambitModule.factory('eventbus', function(channelsInit) {
    var eb = new vertx.EventBus(	window.location.protocol + '//' 
    							+ 	window.location.hostname + ':' 
    							+ 	window.location.port + '/eventbus');

    
    eb.onopen = function() {
        angular.forEach(channelsInit, function(handler,key) {
            eb.registerHandler(key, handler);
        });
    };

    return {
        bus: eb,
        uuid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(a,b){return b=Math.random()*16,(a=='y'?b&3|8:b|0).toString(16)}),
        nick: null,
        getNick: function() {
            var self = this;
            if (self.nick) {
                return self.nick;
            } else {
                this.bus.send('nicks.get', {uuid: this.uuid}, function(reply) {                    
                    self.nick = reply.nick;
                    return self.nick;
                });
            }
        },
        sendChat: function(chatMessage) {
            if (chatMessage.length > 0) {
                var self = this;
                if (!self.nick) {
                    self.bus.send('nicks.get', {uuid: this.uuid}, function(reply) {                    
                        self.nick = reply.nick;
                        self.bus.publish('gambit.chat', {message: chatMessage, nick: self.nick});
                    });
                } else {
                    self.bus.publish('gambit.chat', {message: chatMessage, nick: self.nick});
                }
            }
        }
    };
  });