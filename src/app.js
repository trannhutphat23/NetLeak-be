require('dotenv').config()
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')
const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.resolve('./docs/swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);
const cors = require("cors"); 
const { default: helmet } = require('helmet')
const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();

// init middleware
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// body parser
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}))
app.use(helmet())
app.use(cookieParser())
app.use(cors())

// init db mongodb
require('./databases/init.mongodb')

// routes
app.use('/', require('./routes'))

// check 404 error
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || "Internal Server Error",
    })
})

module.exports = app;