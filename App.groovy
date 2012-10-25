/**
 * Imports
 */
import org.vertx.groovy.core.streams.Pump
import org.vertx.groovy.core.http.RouteMatcher
import groovy.json.JsonBuilder

// Useful bindings
def fs = vertx.fileSystem
def bus = vertx.eventBus

def server = vertx.createHttpServer()

/**
 * Configuration
 */
def conf = [
    host: container.config['host'] ?: '0.0.0.0',
    port: container.config['port'] ?: 8081,
    spiEntries: ['/', '/upload-board', '/contact', '/search'],
    fileStore: (container.config['fileStore'] ?: '/tmp') + File.separator
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
        def fileName = conf.fileStore + req.params.filename
        def tmpFileName = "${conf.fileStore}${UUID.randomUUID()}.uploading"
        fs.open(tmpFileName) { asyncRes ->
            def file = asyncRes.result
            def pump = Pump.createPump(req, file.writeStream)
            req.endHandler {
                file.close {
                    fs.move(tmpFileName, fileName) {
                        bus.publish('fileStore.uploaded', [fileName: req.params.filename])
                        req.response.end()
                    }
                }
            }
            pump.start()
            req.resume()
        }
    },
    'GET->/files': { req ->
        bus.send('fileStore.list', [:]) { busResponse ->
            req.response.chunked = true
            req.response.headers['Content-Type'] = 'application/json'
            req.response << new JsonBuilder(busResponse.body).toString()
            req.response.end()
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

    if (req.path.contains('..')) {
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
                req.response.statusCode = 303
                boolean isSeparator = req.path.endsWith('/')
                req.response.headers['Location'] = req.path + (isSeparator ? '' : '/') + defaultIndex
                req.response.end()
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
container.deployVerticle('verticles/Nicks.groovy', conf, 1) {
    println "Module Nicks deployed"
}

container.deployVerticle('verticles/FileStore.groovy', conf, 1) {
    println "Module FileStore deployed. Pointing to ${conf.fileStore}"
}

container.deployVerticle('verticles/UserStore.groovy', conf, 1) {
    println "Module UserStore deployed"
}

/**
 * Configuration :
 *
 * 'address': The main address for the busmod. Optional field. Default value is vertx.basicauthmanager
 * 'user_collection': The MongoDB collection in which to search for usernames and passwords. Optional field. Default value is users.
 * 'persistor_address': Address of the persistor busmod to use for usernames and passwords. This field is optional. Default value is vertx.mongopersistor.
 * 'session_timeout': Timeout of a session, in milliseconds. This field is optional. Default value is 1800000 (30 minutes).
 *
 */
container.deployModule('vertx.auth-mgr-v1.1', [
    address: 'gambit.auth',
    user_collection: 'users',
    persistor_address: 'gambit.userStore',
    session_timeout: 1800000
])

/**
 * SockJS bridge configuration.
 */
def sockJsConfig = [
    prefix: '/eventbus'
]

def inboundPermitted = [
    [address: 'gambit.chat'],
    [address: 'nicks.get', requires_auth: true],
    [address: 'fileStore.list', requires_auth: true],
    [address: 'gambit.auth.login']
]
def outboundPermitted = [
    [address: 'gambit.chat'],
    [address: 'nicks.get'],
    [address: 'fileStore.list'],
    [address: 'fileStore.uploaded']
]

/**
 * SockJS bridge wiring.
 */
vertx.createSockJSServer(server).bridge(sockJsConfig, inboundPermitted, outboundPermitted)

/**
 * Starting the server.
 */
server.listen(conf.port, conf.host)

println "Listening ${conf.host}:${conf.port} ..."
