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
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(helmet())
app.use(cookieParser())
app.use(cors())

// init db mongodb
require('./databases/init.mongodb')

// routes
app.use('/', require('./routes'))

module.exports = app;