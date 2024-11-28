const { Router } = require("express");
const methods = require('../controllers/posts-controller.js');
const { authenticateJWT } = require("../middlewares/jwt");
const { verifyRole } = require('../middlewares/userRoles.js');

const router = Router();

// Rutas
router.get("/posts/obtener", methods.getPosts); // Acceso público
// Usuarios autenticados
router.post("/posts/crear-publicacion", authenticateJWT, verifyRole(['propietario']), methods.createPost); 
router.put("/posts/editar/:id", authenticateJWT, verifyRole(['admin', 'propietario']), methods.updatePost);
router.delete("/posts/:id", authenticateJWT, verifyRole(['admin', 'propietario']), methods. deletePost); 
router.put("/posts/aprobar/:id", authenticateJWT, verifyRole(['admin']), methods.approvePost);  // Admin aprueba cada publicacion

module.exports = router;
