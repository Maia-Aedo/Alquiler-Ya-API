/**
 * Configuración para conexión con base de datos
 * @Description mysql/promise abre pool de conexión para la BD, recibe query y devuelve response como objeto.
 */

const mysql = require('mysql2/promise');
const config = require('src/config.js');

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

const handleDisconnect = async () => {
    try {
        connection = await mysql.createConnection({
            host: config.host,
            port: config.port || 3306,
            database: config.database,
            user: config.user,
            password: config.password,
        });
        console.log('Reconexión exitosa con la base de datos');
    } catch (err) {
        console.error('Error al reconectar a la base de datos:', err.message);
        setTimeout(handleDisconnect, 5000); // Reintenta después de 5 segundos
    }
};

connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Conexión perdida, intentando reconectar...');
        handleDisconnect();
    } else {
        throw err;
    }
});


//! Obtenemos conexión y retornamos
module.exports = { getConnection, handleDisconnect }
