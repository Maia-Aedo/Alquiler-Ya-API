// src/index.js
require("dotenv").config();
require("reflect-metadata"); // para TypeORM
const app = require("./app");
const { AppDataSource } = require("./database/database");

/**
 * Función principal que inicia la aplicación.
 * - Inicializa TypeORM y crea las tablas automáticamente si no existen.
 * - Inicia el servidor HTTP.
 *
 * @async
 * @function main
 * @returns {Promise<void>} ejecuta tareas de inicio de la app.
 */
const main = async () => {
    try {
        // console.log(AppDataSource);

        await AppDataSource.initialize();
        console.log("🔌 Conexión a base de datos verificada con TypeORM");

        app.listen(app.get("port"), () => {
            console.log(`🚀 Servidor corriendo en puerto ${app.get("port")}`);
        });
    } catch (err) {
        console.error("❌ Error al iniciar el servidor:", err.message);
    }
};

// Ejecuta la app
main();
