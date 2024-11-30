const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const config = require('./config.js');

// Express
const app = express();
// Cors
app.use(cors());

// Settings
app.set('port', config.port);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middlewares
app.use(morgan('dev'));

module.exports = app;
