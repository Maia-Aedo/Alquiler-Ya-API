const { Router } = require('express');// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const methods = require('../controllers/user-controller.js'); // Métodos de controlador
const { authenticateJWT } = require('../middlewares/jwt.js'); // Autenticación
const { verifyRole } = require('../middlewares/user-roles.js'); // Roles de usuario

const router = Router();

// Configuramos cada endpoint con su método
// Registro de usuario (disponible para todos, validación extra por rol opcional)
router.post("/register", methods.register);
// Login de usuarios
router.post("/login", methods.login);
// Obtener usuario por ID (autenticado)
router.get("/users/:id", authenticateJWT, methods.getOne);
/* Colocamos el middleware para evitar que cualquiera que consulte el endpoint vea el token
que solo se puede conseguir mediante autenticación en login */

module.exports = router;