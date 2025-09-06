/**
 * Archivo principal de configuración de la aplicación Express.
 * Aquí se configuran middlewares, rutas, CORS, carga de archivos y puerto.
 * 
 * @module app
 */

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

/**
 * @typedef {Object} FileUploadOptions
 * @property {boolean} useTempFiles - Indica que los archivos se manejarán como archivos temporales.
 * @property {string} tempFileDir - Carpeta temporal donde se almacenan los archivos subidos.
 * @property {Object} limits - Configuraciones de límite de tamaño de archivo.
 * @property {number} limits.fileSize - Tamaño máximo permitido del archivo (en bytes).
 * @property {boolean} createParentPath - Crea automáticamente la carpeta de destino si no existe.
 */


//! FILEUPLOAD
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true
}))

// ! Direcciones de rutas
app.use('/api/users', users);
app.use('/api/files', files);
app.use('/api/posts', posts);

// Eporta la aplicación para userla en index.
module.exports = app;
