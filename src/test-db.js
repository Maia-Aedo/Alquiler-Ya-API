require('dotenv').config();
const mysql = require('mysql2/promise');

const connectionConfig = {
    host: process.env.db_host,
    port: parseInt(process.env.db_port, 10),
    database: process.env.db_database,
    user: process.env.db_user,
    password: process.env.db_password,
    connectTimeout: 10000
};

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