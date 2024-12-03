// Dotenv se encarga de gestionar variables de entorno
const { config } = require('dotenv');

config();

//! Server connection config
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
