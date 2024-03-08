const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3001
    },
    db: {
        host: process.env.DEV_DB_HOST || 'trannhutphattv',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'dbDev',
        pass: process.env.DEV_DB_PASS || 'nhutphat123'
    }
}

module.exports = dev;