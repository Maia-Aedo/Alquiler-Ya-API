/**
 * Configuración para conexión con base de datos
 * @Description mysql/promise abre pool de conexión para la BD, recibe query
 * y devuelve response como objeto.
 */

const mysql = require('mysql2/promise');
const config = require('src\config.js');

//! Generamos conexión
const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
});

const getConnection = () => {
    console.log('Conecte con base de datos');
    return connection;
};

//! Obtenemos conexión y retornamos
module.exports = { getConnection}
