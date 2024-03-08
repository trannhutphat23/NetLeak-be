const mongoose = require('mongoose')
const os = require('os')
const _SECOND = 5000
// count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    return `Number of connection: ${numConnection}`
}

// check overload
const checkOverload = () => {
    setInterval( () => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        const maxConnections = numCores * 5

        console.log(`Active connection: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

        if (numConnection > maxConnections){
            console.log('Connection overload detect')
        }
    }, _SECOND)
}

module.exports = {
    countConnect,
    checkOverload
}