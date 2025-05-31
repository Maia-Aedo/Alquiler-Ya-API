/**
 * @module config/database
 * 
 * @Description Configuración para conexión con base de datos, mysql/promise abre pool de conexión para la BD, recibe query y devuelve response como objeto.
 */

const mysql = require('mysql2/promise');
const config = require('./../config.js');


//! Generamos conexión
let connection;

/**
 * Conecta a la base de datos MySQL utilizando configuración del archivo config.js.
 * En caso de error o pérdida de conexión, intenta reconectar automáticamente.
 *
 * @async
 * @function connectToDatabase
 */
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

/**
 * Retorna la conexión activa con la base de datos.
 * Si no existe, espera y reintenta hasta obtenerla (máx. 5 intentos).
 *
 * @async
 * @function getConnection
 * @returns {Promise<Connection>} Conexión activa a MySQL.
 */
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
