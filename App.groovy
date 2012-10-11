/**
 * Imports
 */
import org.vertx.groovy.core.http.RouteMatcher
import static org.vertx.groovy.core.streams.Pump.createPump

def fs = vertx.fileSystem
def server = vertx.createHttpServer()

/**
 * Configuration
 */
def conf = [
    host: container.config['host'] ?: '0.0.0.0',
    port: container.config['port'] ?: 8081,
    spiEntries: ['/', '/upload-board', '/contact']
]

/* Constants */
String defaultIndex = 'index.html'
String webRootPrefix = 'web' + File.separator
String rootIndexPage = webRootPrefix + defaultIndex

/**
 * REST Routes definition
 */
def simpleRestRoutes = [
    'PUT->/upload': { req ->
      req.pause()
      def fileName = req.params.filename
      def tmpFileName = "${UUID.randomUUID()}.uploading"
      fs.open(tmpFileName) { asyncRes ->
        def file = asyncRes.result
        def pump = createPump(req, file.writeStream)
        req.endHandler {
          file.close {
            fs.move(tmpFileName, fileName) {
              println "Uploaded ${pump.bytesPumped} bytes to $fileName"
              req.response.end()
            }
          }
        }
        pump.start()
        req.resume()
      }
    }
]

/**
 * REST Routes wiring
 */
def routeMatcher = new RouteMatcher()
simpleRestRoutes.each { route, behavior ->
  def parts = route.split('->')
  switch (parts[0]) {
    case 'PUT':
      routeMatcher.put(parts[1], behavior)
      break
    case 'GET':
      routeMatcher.get(parts[1], behavior)
      break
    case 'POST':
      routeMatcher.post(parts[1], behavior)
      break
    case 'DELETE':
      routeMatcher.delete(parts[1], behavior)
      break
  }
}

// When no route matches, then serve static files.
routeMatcher.noMatch { req ->

  if (req.path.contains("..")) {
    // No relative path to ensure target is in the web sandbox.
    req.response.statusCode = 404
    req.response.end()
  } else if (conf.spiEntries.contains(req.path)) {
    // Every SPI entries leads to serving the root index page.
    req.response.sendFile(rootIndexPage)
  } else {
    // Any other path
    String targetStaticFilePath = webRootPrefix + req.path
    def targetFile = new File(targetStaticFilePath)

    if (!targetFile.exists()) {
      req.response.statusCode = 404
      req.response.end()
    } else {
      if (targetFile.isDirectory()) {
        req.response.sendFile(targetStaticFilePath + File.separator + defaultIndex)
      } else {
        req.response.sendFile(targetStaticFilePath)
      }
    }
  }
}

// Linking routeMatcher with server.
server.requestHandler(routeMatcher.asClosure())

/**
 * EventBus players deployment.
 */
container.deployVerticle('verticles/Nicks.groovy')

/**
 * SockJS bridge configuration.
 */
def sockJsConfig = [
    prefix: '/eventbus'
]

def inboundPermitted = [
    ['address': 'gambit.chat'],
    ['address': 'nicks.get']
]
def outboundPermitted = [
    ['address': 'gambit.chat'],
    ['address': 'nicks.get']
]

/**
 * SockJS bridge wiring.
 */
vertx.createSockJSServer(server).bridge(sockJsConfig, inboundPermitted, outboundPermitted)

/**
 * Starting the server.
 */
server.listen(conf.port, conf.host)

println "Listening ${conf.host}:${conf.port}..."