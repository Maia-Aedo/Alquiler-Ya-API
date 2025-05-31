require('dotenv').config();
const app = require('./app');
const { getConnection } = require('./database/database');


/**
 * Función principal que inicia la aplicación.
 * - Verifica la conexión con la base de datos.
 * - Inicia el servidor HTTP.
 * 
 * @async
 * @function main
 * @returns {Promise<void>} ejecuta tareas de inicio de la app.
 */


const main = async () => {
    try {
        // Fuerza la conexión a la base de datos
        const connection = await getConnection();
        console.log('🔌 Conexión a base de datos verificada');

        // Inicia el servidor
        app.listen(app.get('port'), () => {
            console.log(`🚀 Servidor corriendo en puerto ${app.get('port')}`);
        });

    } catch (err) {
        console.error('❌ Error al iniciar el servidor:', err.message);
    }
};

// Llama a la función principal para iniciar la app

main();