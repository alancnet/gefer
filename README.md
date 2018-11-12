# Gefer

Deferred promises and generators.

## Why deferred promises and generators?

Don't. This is bad practice. If at all possible, you should produce promises and generators with well-defined scopes, and no side effects.
However, if you find yourself in a bind with no other options, at least keep it clean.

## Usage:

### Deferred Promise

```javascript
const { defer } = require('gefer')

const deferred = defer()

deferred.promise.then(console.log, console.error)

deferred.resolve('Hello World')

// or deferred.reject(new Error('Foo Bar'))
```

### Deferred Generators

```javascript
const mySubject = subject()

mySubject.next('Hello')

const printAll = async () => {
    for await (let v of mySubject()) {
        console.log(v)
    }
}

printAll().catch(console.error)

mySubject.next('World')

// or mySubject.error(new Error('Foo Bar'))
```

## Use a custom promise library

```javascript
const { Promise } = require('bluebird')
const gefer = require('gefer')
gefer.Promise = Promise
```