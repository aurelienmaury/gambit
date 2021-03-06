def fs = vertx.fileSystem
def bus = vertx.eventBus

def fileStore = container.config.fileStore
def fileList = []

/**
 * FileStore loading.
 */
def fileStoreFile = new File(fileStore)

if (!fileStoreFile.exists() || !fileStoreFile.isDirectory()) {
    println "WARN - ${fileStore} should exists and be a directory"
}

// Discovering all file in fileStore directory
fileStoreFile.eachFileRecurse { file ->
    if (!file.name.startsWith('.') && file.isFile()) {
	fileList << [
        path: file.absolutePath - fileStore,
        name: file.name
	]
    }
}

fileList = fileList.sort { fileName ->
    new File(fileStore + fileName).lastModified()
}.reverse()

/**
 * Handlers registering.
 */
// WARN : the reply should be of the same type as the message body.
bus.registerHandler('fileStore.list') { message ->
    println "'fileStore.list' called"
    message.reply([files: fileList])
    //    bus.send('sg.fileStore.list', [action: 'list', source: 'webfront'])
}

bus.registerHandler('fileStore.uploaded') { message ->
    def uploadedFileName = message.body.fileName
    println "upload received:" + uploadedFileName
    fileList << new File(fileStore + uploadedFileName)
}