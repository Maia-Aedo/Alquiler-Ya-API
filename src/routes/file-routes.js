const { Router } = require('express');// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const methods = require('../controllers/file-controller.js'); // Métodos de controlador
const { authenticateJWT } = require('../middlewares/jwt.js'); // Autenticación
const { verifyRole } = require('../middlewares/user-roles.js'); // Roles de usuario

const router = Router();

// Configuramos cada endpoint con su método
router.post("/upload", authenticateJWT, methods.postFile);


module.exports = router;