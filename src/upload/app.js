const express = require('express');
const morgan = require('mmorgan');
var cors = require('cors');

// Express
const app = express();
// Cors
app.use(cors());

// Settings
app.set('port', 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middlewares
app.use(morgan('dev'));

module.exports = app;
