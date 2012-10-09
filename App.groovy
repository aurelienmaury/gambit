import org.vertx.groovy.core.http.RouteMatcher
import static org.vertx.groovy.core.streams.Pump.createPump

def confOrDefault = { configKey, defaultValue ->
  container.config[configKey] ?: defaultValue
}

def routeMatcher = new RouteMatcher()

def singlePageEntryPoints = ['/upload-board', '/contact']


String indexPageName = 'index.html'
String webRootPrefix = confOrDefault('web_root', 'web') + File.separator
String indexPage = webRootPrefix + indexPageName
boolean gzipFiles = confOrDefault('gzip_files', false)

/**
 * Rest routes
 */

routeMatcher.put('/upload') { req ->
  
  def targetFilename = req.params.filename
  req.pause()
  def filename = "${UUID.randomUUID()}.uploading"
  vertx.fileSystem.open(filename) { ares ->
    def file = ares.result
    def pump = createPump(req, file.writeStream)
    req.endHandler {
      file.close {
        file.move(filename, targetFilename) {
          println "Uploaded ${pump.bytesPumped} bytes to $targetFilename"
          req.response.end()
        }
      }
    }
    pump.start()
    req.resume()
  }
}

/**
 * When no route matches, then serve static files
 */
routeMatcher.noMatch { req ->
  // browser gzip capability check
  String acceptEncoding = req.headers['accept-encoding']
  boolean acceptEncodingGzip = acceptEncoding?.contains('gzip')

  String fileName = webRootPrefix + req.path

  if (req.path.contains("..")) {
    req.response.statusCode = 404
    req.response.end()
  } else if (req.path == '/' || singlePageEntryPoints.contains(req.path)) {
    req.response.sendFile(indexPage)
  } else {
    // try to send *.gz file
    if (gzipFiles && acceptEncodingGzip) {
      if (new File(fileName + '.gz').exists()) {
        // found file with gz extension
        req.response.headers['content-encoding'] = 'gzip'
        req.response.sendFile(fileName + '.gz')
      } else {
        // not found gz file, try to send uncompressed file
        req.response.sendFile(fileName)
      }
    } else {
      def targetFile = new File(fileName)
      if (targetFile.exists()) {
        // send not gzip file
        if (targetFile.isDirectory()) {

        req.response.sendFile(fileName+File.separator+indexPageName)
          } else {

        req.response.sendFile(fileName)
        }
            
      } else {
        req.response.statusCode = 404
        req.response.end()
      }
    }
  }
}

container.deployVerticle('verticles/Nicks.groovy')

def server = vertx.createHttpServer().requestHandler(routeMatcher.asClosure())

/**
 * SockJS bridge.
 */

def sockJsConfig = [
  prefix: "/eventbus"
]

def inboundPermitted = [
    ['address': 'gambit.chat'],
    ['address': 'nicks.get']
  ]
def outboundPermitted = [
    ['address': 'gambit.chat'],
    ['address': 'nicks.get']
  ]

vertx.createSockJSServer(server).bridge(sockJsConfig, inboundPermitted, outboundPermitted)

/**
 * Starting the server.
 */

String host = confOrDefault("host", "0.0.0.0")
Integer port = confOrDefault('port', 80)

server.listen(port, host)

println "Listening ${host}:${port}..."