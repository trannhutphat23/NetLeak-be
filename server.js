const app = require("./src/app");

const PORT = process.env.PORT || 8082

const server = app.listen(PORT, () => {
    console.log(`App start with ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit Server Express')
        process.exit(0)
    })
})