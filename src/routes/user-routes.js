/**
 * @module routes/users
 * @description Define las rutas para autenticación y gestión de usuarios.
 * Incluye registro, login y consulta de usuario por ID con autenticación JWT.
 */
const { Router } = require('express');// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const methods = require('../controllers/user-controller.js'); // Métodos de controlador
const { authenticateJWT } = require('../middlewares/jwt.js'); // Autenticación
const { verifyRole } = require('../middlewares/user-roles.js'); // Roles de usuario

const router = Router();

/**
 * @route POST /register
 * @summary Registra un nuevo usuario.
 * @description Ruta pública para que cualquier usuario pueda registrarse.
 * @controller register - Método encargado de registrar usuarios.
 */
router.post("/register", methods.register);

/**
 * @route POST /login
 * @summary Inicia sesión y retorna un token JWT si las credenciales son válidas.
 * @controller login - Método encargado de autenticar y emitir token.
 */
router.post("/login", methods.login);

/**
 * @route GET /users/:id
 * @summary Obtiene información de un usuario por ID.
 * @middleware authenticateJWT - Requiere autenticación JWT para acceder a esta ruta.
 * @controller getOne - Método encargado de obtener un usuario específico.
 */
router.get("/users/:id", authenticateJWT, methods.getOne);

/**
 * Nota: El middleware `authenticateJWT` asegura que solo usuarios autenticados
 * puedan acceder a la información sensible como el token.
 */
module.exports = router;