/**
 * @module routes/posts
 * @description Define las rutas para operaciones CRUD relacionadas con publicaciones.
 * Incluye control de acceso por roles y autenticación JWT.
 */
const { Router } = require("express");
const methods = require('../controllers/posts-controller.js');
const { authenticateJWT } = require("../middlewares/jwt");
const { verifyRole } = require('../middlewares/user-roles.js');

const router = Router();

/**
 * @route POST /crear-publicacion
 * @summary Crea una nueva publicación.
 * @middleware authenticateJWT - Verifica el token JWT del usuario.
 * @middleware verifyRole(["admin", "propietario"]) - Permite solo a admin y propietario crear publicaciones.
 * @controller createPost - Método que maneja la creación de publicaciones.
 */
router.post("/crear-publicacion", authenticateJWT, verifyRole(["admin", "propietario"]), methods.createPost);

/**
 * @route GET /publicaciones
 * @summary Obtiene todas las publicaciones disponibles.
 * @controller getPosts - Método que retorna la lista de publicaciones.
 */
router.get("/publicaciones", methods.getPosts);

/**
 * @route PUT /publicaciones/:id
 * @summary Actualiza una publicación existente por ID.
 * @middleware authenticateJWT - Verifica el token JWT.
 * @middleware verifyRole(["admin", "propietario"]) - Solo admin y propietario pueden actualizar.
 * @controller updatePost - Método que actualiza la publicación.
 */
router.put("/publicaciones/:id", authenticateJWT, verifyRole(["admin", "propietario"]), methods.updatePost);

/**
 * @route DELETE /eliminar-publicacion/:id
 * @summary Elimina una publicación existente por ID.
 * @middleware authenticateJWT - Verifica el token JWT.
 * @middleware verifyRole(["admin", "propietario"]) - Solo admin y propietario pueden eliminar publicaciones.
 * @controller deletePost - Método que elimina la publicación.
 */
router.delete("/eliminar-publicacion/:id", authenticateJWT, verifyRole(["admin", "propietario"]), methods.deletePost);

/**
 * @route PATCH /aprobar-publicacion/:id
 * @summary Aprueba una publicación (cambia su estado).
 * @middleware authenticateJWT - Verifica el token JWT.
 * @middleware verifyRole(["admin"]) - Solo administradores pueden aprobar publicaciones.
 * @controller approvePost - Método que aprueba la publicación.
 */
router.patch("/aprobar-publicacion/:id", authenticateJWT, verifyRole(["admin"]), methods.approvePost);


module.exports = router;



