const fifo = require('fifo')
const gefer = {
    Promise,
    defer: () => {
        let value, error, resolved, rejected
        const deferred = {
            resolve: (v) => {
                if (!resolved && !rejected) {
                    value = v
                    resolved = true
                }
            },
            reject: (e) => {
                if (!resolved && !rejected) {
                    error = e
                    rejected = true
                }
            }
        }
        deferred.promise = new gefer.Promise((resolve, reject) => {
            if (resolved) resolve(value)
            if (rejected) reject(error)
            deferred.resolve = resolve
            deferred.reject = reject
        })
        return deferred
    },
    subject: () => {
        let queue = fifo()
        const enqueue = v => queue.push(v)
        let next = null
        const getNext = () => {
            if (queue.length) {
                const last = queue.shift()
                if (last.length === 1) return Promise.resolve(last[0])
                else return Promise.reject(last[1])
            }
            const deferred = gefer.defer()
            next = v => {
                next = null
                deferred.resolve(v)
            }
            return deferred.promise
        }
        const generator = async function*() {
            while (true) {
                yield await getNext()
            }
        }
        generator.next = (v) => next ? next(v) : enqueue([v])
        generator.error = (e) => next ? next(null, e) : enqueue([null, e])
        return generator
    }
}

module.exports = gefer