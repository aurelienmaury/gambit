gambitModule.factory('eventbus', function() {
    var eb = new vertx.EventBus(	window.location.protocol + '//' 
    							+ 	window.location.hostname + ':' 
    							+ 	window.location.port + '/eventbus');

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
            this.bus.publish('gambit.chat', {message: chatMessage, nick: this.getNick()});
        },
        handle: function(channel, handler) {
            var bus = this.bus;
            bus.onopen = function() {
                console.log('added handler on '+channel);
                bus.registerHandler(channel, handler);
            };
        }
    };
  });