const { defer } = require('..')

const deferred = defer()

deferred.promise.then(console.log, console.error)

deferred.reject(new Error('Foo Bar'))
