const { Router } = require("express");
const { createPost, getPosts, updatePost, deletePost } = require("../controllers/posts-controller");
const { authenticateJWT } = require("../middlewares/jwt");

const router = Router();

// Rutas
router.get("/", getPosts); // Acceso público
// Usuarios autenticados
router.post("/", authenticateJWT, createPost); 
router.put("/:id", authenticateJWT, updatePost);
router.delete("/:id", authenticateJWT, deletePost); 

module.exports = router;
