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
                return Promise.resolve(queue.shift())
            }
            const deferred = gefer.defer()
            next = last => {
                next = null
                deferred.resolve(last)
            }
            return deferred.promise
        }
        const generator = async function*() {
            while (true) {
                const last = await getNext()
                if (last.length === 1) yield Promise.resolve(last[0])
                else if (last.length === 2) throw last[1]
                else return last[2]
            }
        }
        generator.next = (v) => next ? next([v]) : enqueue([v])
        generator.error = (e) => next ? next([null, e]) : enqueue([null, e])
        generator.return = (r) => next ? next([null, null, r]) : enqueue([null, null, r])
        return generator
    }
}

module.exports = gefer