/**
 * Configuración para conexión con base de datos
 * @Description mysql/promise abre pool de conexión para la BD, recibe query y devuelve response como objeto.
 */

const mysql = require('mysql2/promise');
const config = require('../config.js');

let connection;

//! Generamos conexión.
const initConnection = async () => {
    try {
        connection = await mysql.createConnection({
            host: config.host,
            port: config.db_port,
            database: config.database,
            user: config.user,
            password: config.password,
        });
        console.log('Conexión exitosa a la base de datos');
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        setTimeout(handleDisconnect, 5000); // Reintenta conexión después de 5 segundos.
    }
};

//  * Reestablece la conexión en caso de desconectarse
const handleDisconnect = async () => {
    try {
        console.log('Intentando reconectar a la base de datos...');
        await initConnection();
    } catch (err) {
        console.error('Error al reconectar a la base de datos:', err.message);
        setTimeout(handleDisconnect, 5000); // Reintentar reconexión.
    }
};

//  * Retorna conexión
const getConnection = () => {
    if (!connection) {
        throw new Error('La conexión no está inicializada. Llama a initConnection primero.');
    }
    return connection;
};

// Cuando carga el modulo inicializa conexion
initConnection();

//! Obtenemos conexión y retornamos
module.exports = { getConnection, handleDisconnect };
