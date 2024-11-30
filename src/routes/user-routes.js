const { Router } = require('express');// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const methods = require('../controllers/user-controller.js'); // Métodos de controlador
const { authenticateJWT } = require('../middlewares/jwt.js'); // Autenticación
const { verifyRole } = require('../middlewares/user-roles.js'); // Roles de usuario
const { validateRegister } = require("../middlewares/validation");

const router = Router();

// Configuramos cada endpoint con su método
// Registro de usuario (disponible para todos, validación extra por rol opcional)
router.post("/registrar", validateRegister, methods.register);
// Registrar cliente (solo usuarios con rol de "cliente")
router.post("/auth/registrar-cliente", authenticateJWT, verifyRole(["cliente"]), methods.register);
// Registrar admin (solo usuarios con rol de "admin")
router.post("/auth/registrar-admin", authenticateJWT, verifyRole(["admin"]), methods.register);
// Registrar propietario (solo usuarios con rol de "propietario")
router.post("/auth/registrar-propietario", authenticateJWT, verifyRole(["admin", "propietario"]), methods.registerOwner);
// Login de usuarios (disponible para todos)
router.post("/auth/login", methods.login);
// Obtener usuario por ID (autenticado)
router.get("/users/:id", authenticateJWT, verifyRole(["admin", "propietario", "cliente"]), methods.getOne);
/* Colocamos el middleware para evitar que cualquiera que consulte el endpoint vea el token
que solo se puede conseguir mediante autenticación en login */

module.exports = router;