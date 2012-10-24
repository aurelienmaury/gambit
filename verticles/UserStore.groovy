/**
 * Accepts messages message of the form :
 *
 * [
 *      action: 'findone',
 *      collection: 'users',
 *      matcher: [ username: 'login', password: 'pass' ]
 * ]
 * good is replying [status: 'ok', result: [] ]
 */

def bus = vertx.eventBus

bus.registerHandler('gambit.userStore') { message ->
    println "tried to "+message.body
    message.reply([status: 'ok', result:[:]])
}