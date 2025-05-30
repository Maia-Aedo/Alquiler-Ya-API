/**
 * @param useTempFiles Indica que los archivos se manejarán temporalmente.
 * @param tempFileDir Define el lugar de almacenamiento.
 * @param limits Establece tamaño límite del archivo.
 * @param createParentPath Si el dir de destino no existe, se crea automáticamente.
 */

const express = require('express');
const morgan = require('morgan');
var cors = require('cors');

// Express
const app = express();

// ! Rutas
const users = require('./routes/user-routes.js');
const files = require('./routes/file-routes.js')
const posts = require('./routes/posts-routes.js')

const fileUpload = require('express-fileupload');

// Middlewares
app.use(morgan('dev'));
app.set('port', 3000);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//! FILEUPLOAD
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true
}))

// ! Direcciones de rutas
app.use(users)
app.use(files)
app.use(posts)

module.exports = app;
