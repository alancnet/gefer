const { defer } = require('..')

const deferred = defer()

deferred.promise.then(console.log, console.error)

deferred.resolve('Hello World')
