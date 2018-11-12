const { subject } = require('..')

const mySubject = subject()

mySubject.next('Hello')

const printAll = async () => {
    for await (let v of mySubject()) {
        console.log(v)
    }
}

printAll().catch(console.error)

mySubject.next('World')

mySubject.error(new Error('Foo Bar'))
