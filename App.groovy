import org.vertx.groovy.core.http.RouteMatcher

def confOrDefault = { configKey, defaultValue ->
  container.config[configKey] ?: defaultValue
}

def routeMatcher = new RouteMatcher()

String webRootPrefix = confOrDefault('web_root', 'web') + File.separator
String indexPage = webRootPrefix + 'index.html'
boolean gzipFiles = confOrDefault('gzip_files', false)

/**
 * Rest routes
 */



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
  } else if (req.path == '/') {
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
      if (new File(fileName).exists()) {
        // send not gzip file
        req.response.sendFile(fileName)
      } else {
        req.response.statusCode = 404
        req.response.end()
      }
    }
  }
}

vertx.createHttpServer().requestHandler(routeMatcher.asClosure()).listen(confOrDefault('port', 80) as int, confOrDefault("host", "0.0.0.0") as String)