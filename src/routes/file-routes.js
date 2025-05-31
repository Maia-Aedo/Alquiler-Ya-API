/**
 * @module routes/files
 * @description Define las rutas relacionadas con la carga de archivos.
 * Utiliza middlewares de autenticación y control de roles para proteger los endpoints.
 */

const { Router } = require('express');// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const methods = require('../controllers/file-controller.js'); // Métodos de controlador
const { authenticateJWT } = require('../middlewares/jwt.js'); // Autenticación
const { verifyRole } = require('../middlewares/user-roles.js'); // Roles de usuario

const router = Router();

/**
 * @route POST /upload
 * @summary Sube un archivo al servidor.
 * @middleware authenticateJWT - Verifica que el usuario tenga un token JWT válido.
 * @controller postFile - Método del controlador que maneja la lógica de guardado del archivo.
 */

router.post("/upload", authenticateJWT, methods.postFile);


module.exports = router;