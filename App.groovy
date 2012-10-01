def webServerConf = [
  port: 8081,
  host: 'localhost'
] as Map

container.deployModule('vertx.web-server-v1.0', webServerConf)

println "Starting on ${webServerConf.port}..."