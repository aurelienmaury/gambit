def nicks = [:]

def adjectives = [ 'adorable', 'strong', 'elegant', 'fancy', 'awesome', 'omnipotent', 'ugly', 'big', 'black', 'frigid', 'putrid' ]

def nouns = ['vampire','troll','dwarf','samurai','ninja','goblin','ice','blob', 'wind','sword']


vertx.eventBus.registerHandler('nicks.get') { message ->
	def uuid = message.body.uuid
	
	if (!nicks[uuid]) {

		def newNick = ''

		while (!newNick || nicks?.values?.contains(newNick)) {
			newNick = adjectives[new Random().nextInt(adjectives.size())]
			newNick += '_'+nouns[new Random().nextInt(nouns.size())]
			newNick += '_'+new Random().nextInt(10000)
		}

		nicks[uuid] = newNick
	}

	message.reply([status:200, nick: nicks[uuid]])
}

vertx.eventBus.registerHandler('nicks.rm') { message ->
	def uuid = message.body.uuid
	if (uuid && nicks[uuid]) {
		nicks.remove(uuid)
		message.reply([status: 200])
	} else {
		message.reply([status: 404])
	}
}