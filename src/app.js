const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const config = require('./config.js');
const userRoutes = require('./routes/user-routes.js');
const postRoutes = require('./routes/posts-routes.js');

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

// Rutas
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

module.exports = app;
