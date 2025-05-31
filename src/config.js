/**
 * Carga y configura las variables de entorno desde el archivo .env
 * utilizando dotenv.
 * 
 * @module config
 */

const { config } = require('dotenv');

// Ejecuta craga de variables de entorno

config();

/**
 * Objeto con las configuraciones necesarias para la conexión al servidor
 * y otros valores sensibles como claves secretas.
 * 
 * @type {Object}
 * @property {string} host - Host de la base de datos.
 * @property {string} port - Puerto de conexión de la base de datos.
 * @property {string} database - Nombre de la base de datos.
 * @property {string} user - Usuario de la base de datos.
 * @property {string} password - Contraseña de la base de datos.
 * @property {string} secretKey - Clave secreta usada para tokens u otros fines.
 */

module.exports = {
    host: process.env.MYSQL_HOST,
    port: process.env.PORT,
    database: process.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    url: process.env.MYSQL_URI,
    db_port: process.env.MYSQL_PORT,
    secretKey: process.env.secret_seed,
}
