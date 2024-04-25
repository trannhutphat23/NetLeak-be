const mongoose = require('mongoose')
const {db: {host, port, name, pass}} = require('../configs/config.mongodb')
const { countConnect } = require('./check.connect')
const connectString = `mongodb+srv://${host}:${pass}@cluster.2eaekco.mongodb.net/NetLeak`;

class Database {
    constructor(){
        this.connect()
    }
    // connect
    connect(type = 'mongodb'){
        if (1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
        .then( _ => {
            console.log("Connected Success\n", countConnect())
        })
        .catch( err => console.log(err))
    }

    static getInstance() {
        if (!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb