/**
 * Configuración para conexión con base de datos
 * @Description mysql/promise abre pool de conexión para la BD, recibe query y devuelve response como objeto.
 */

const mysql = require('mysql2/promise');
const config = require('./../config.js');


//! Generamos conexión
let connection;

const connectToDatabase = async () => {
    try {
        const conn = await mysql.createConnection({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password,
            connectTimeout: 10000
        });

        console.log('✅ Conexión exitosa a la base de datos');
        connection = conn;

        // Reconexión automática si se pierde la conexión
        connection.on('error', (err) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.warn('🔌 Conexión perdida. Reintentando...');
                setTimeout(connectToDatabase, 5000);
            } else {
                console.error('❌ Error en conexión:', err.message);
            }
        });

    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
        setTimeout(connectToDatabase, 5000); // Reintentar conexión
    }
};

connectToDatabase();

const getConnection = async () => {
    if (connection) return connection;

    // Si no hay conexión, espera un poco e intenta de nuevo
    return new Promise((resolve, reject) => {
        const waitAndCheck = async () => {
            if (connection) {
                resolve(connection);
            } else if (tries > 5) {
                reject(new Error('No hay conexión activa con la base de datos'));
            } else {
                tries++;
                setTimeout(waitAndCheck, 1000); // Revisa cada segundo
            }
        };

        let tries = 0;
        waitAndCheck();
    });
};

module.exports = { getConnection };
