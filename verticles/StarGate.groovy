def foreign = container.config.foreign // List of [host: 'host', port: port]

println "StarGate deployed: ${foreign}"

def serverForFriends = vertx.createNetServer()
serverForFriends.connectHandler { sock ->
  sock.dataHandler { data ->
    println "data received : ${data}"
  }
  println "A client has connected!"
}
serverForFriends.listen(container.config.foreignPort, container.config.host)

def bus = vertx.eventBus
def clients = foreign.collect{ collab ->
  def client = vertx.createNetClient()

  client.reconnectAttempts = 1000

  client.reconnectInterval = 5000

  client.connect(collab.port, collab.host) { socket ->
    println "Connection established with ${collab.host}:${collab.port}"
    bus.registerHandler('sg.fileStore.list') { message ->
      socket << message.body.toString()
    }
  }
  client
}







