const { Router } = require("express");
const methods = require('../controllers/posts-controller.js');
const { authenticateJWT } = require("../middlewares/jwt");
const { verifyRole } = require('../middlewares/user-roles.js');

const router = Router();

// Rutas

// Crear publicación (admin y propietario)
router.post("/crear-publicacion", authenticateJWT, verifyRole(["admin", "propietario"]), methods.createPost);
// Obtener todas las publicaciones (todos los roles)
router.get("/publicaciones", getPosts);
// Actualizar publicación (admin y propietario)
router.put("/publicaciones/:id", authenticateJWT, verifyRole(["admin", "propietario"]), methods.updatePost);
// Eliminar publicación (admin y propietario)
router.delete("/eliminar-publicacion/:id", authenticateJWT, verifyRole(["admin", "propietario"]), methods.deletePost);
// Aprobar publicación (solo admin)
router.patch("/aprobar-publicacion/:id", authenticateJWT, verifyRole(["admin"]), methods.approvePost);

module.exports = router;
