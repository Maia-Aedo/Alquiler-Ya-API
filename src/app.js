const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const config = require('./config.js');

const userRoutes = require('./routes/user-routes.js');
const postRoutes = require('./routes/posts-routes.js');
app.use(userRoutes);
app.use(postRoutes);

// Express
const app = express();
// Cors
app.use(cors());

// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middlewares
app.use(morgan('dev'));

module.exports = app;
