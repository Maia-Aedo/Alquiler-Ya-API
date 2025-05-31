require('dotenv').config();

const mysql = require('mysql2/promise');

/**
 * Configuración de la conexión a la base de datos MySQL.
 * 
 * @type {Object}
 * @property {string} host - Dirección del host de la base de datos.
 * @property {number} port - Puerto de conexión a la base de datos.
 * @property {string} database - Nombre de la base de datos.
 * @property {string} user - Usuario para autenticación.
 * @property {string} password - Contraseña para autenticación.
 * @property {number} connectTimeout - Tiempo máximo de espera de conexión en milisegundos.
 */

const connectionConfig = {
    host: process.env.db_host,
    port: parseInt(process.env.db_port, 10),
    database: process.env.db_database,
    user: process.env.db_user,
    password: process.env.db_password,
    connectTimeout: 10000
};

/**
 * Función que prueba la conexión a la base de datos.
 * 
 * @async
 * @function testConnection
 * @returns {Promise<void>} No retorna nada, simplemente imprime el estado de la conexión.
 */

async function testConnection() {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Conexión exitosa a la base de datos');
        await connection.end();
    } catch (err) {
        console.error('❌ Error al conectar:', err.message);
        if (err.code) console.error('Código de error:', err.code);
        if (err.errno) console.error('Número de error:', err.errno);
    }
}

testConnection();