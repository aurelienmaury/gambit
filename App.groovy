def webServerConf = [
  port: 8081,
  host: 'localhost',
  bridge: true,
  inbound_permitted: [
    [ address : 'gambit.chat' ]
  ],
  outbound_permitted: [
    [ address : 'gambit.chat' ]
  ]
]

container.deployModule('vertx.web-server-v1.0', webServerConf)

println "Starting on ${webServerConf.port}..."

def myHandler = { message -> println "I received a message ${message.body.text}" }

def eb = vertx.eventBus
eb.registerHandler("gambit.chat", myHandler) { println "The handler has been registered across the cluster" }