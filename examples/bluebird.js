const { Promise } = require('bluebird')
const gefer = require('..')
const { defer, subject } = gefer

gefer.Promise = Promise

const mySubject = subject()

mySubject.next('Hello')

const printAll = async () => {
    for await (let v of mySubject()) {
        console.log(v)
    }
}

printAll().catch(console.error)

mySubject.next('World')

const deferred = defer()

deferred.promise.then(console.log, console.error)

deferred.resolve('Hello World')

mySubject.error(new Error('Foo Bar'))
