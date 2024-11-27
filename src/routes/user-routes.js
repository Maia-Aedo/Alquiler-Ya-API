const { Router } = require('express');// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const methods = require('../controllers/UserController.js'); // Métodos de controlador
const { authJWT } = require('../middlewares/jwt.js'); // Autenticación
const { verifyRole } = require('../middlewares/userRoles.js'); // Roles de usuario

const router = Router();

// Configuramos cada endpoint con su método;
router.post('/users/register-admin', authJWT, verifyRole('admin'), methods.registerAdmin);
router.post('/users/register-usuario', authJWT, verifyRole('usuario'), methods.register);
router.post('/users/register-propietario', authJWT, verifyRole('propietario'), methods.registerOwner);
router.post('/users/login', methods.login);
/* Colocamos el middleware para evitar que cualquiera que consulte el endpoint vea el token
que solo se puede conseguir mediante autenticación en login */
router.get('/users/:id', authenticateJWT, methods.getOne);

module.exports = router;