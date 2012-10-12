// Useful bindings
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
  if (!file.name.startsWith('.')) {
    fileList << file.absolutePath - fileStore
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
  message.reply([files: fileList])
}

bus.registerHandler('fileStore.uploaded') { message ->
  def uploadedFileName = message.body.fileName
    println "upload received:"+uploadedFileName
  fileList << uploadedFileName
}

/**
 * Up and running
 */
println 'FileStore deployed'