// Dotenv se encarga de gestionar variables de entorno
const { config } = require('dotenv');

config();

//! Server connection config
module.exports = {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.PORT,
    database: process.MYSQL_ADDON_DB,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    url: process.env.MYSQL_ADDON_URI,
    secretKey: process.env.secret_seed,
}
