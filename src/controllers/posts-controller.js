/**
 * @module post-controller
 */

const { AppDataSource } = require("../database/database");
const Publicacion = require("../database/entities/Posts");

/**
 * Crea una nueva publicación
 */
const createPost = async (req, res) => {
  try {
    const { titulo, descripcion, precio, ubicacion, tipo } = req.body;

    if (!titulo || !descripcion || !precio || !ubicacion || !tipo) {
      return res.status(400).json({ ok: false, msg: 'Faltan campos obligatorios' });
    }

    if (!req.files || !req.files.imagenes) {
      return res.status(400).json({ ok: false, msg: 'Debe subir al menos una imagen' });
    }

    const images = Array.isArray(req.files.imagenes) ? req.files.imagenes : [req.files.imagenes];
    const imageNames = images.map(file => file.name);

    const usuario_id = req.usuario.id;

    const postRepo = AppDataSource.getRepository("Publicacion");

    const newPost = postRepo.create({
      titulo,
      descripcion,
      precio,
      ubicacion,
      tipo,
      imagenes: imageNames,
      usuario: { id: usuario_id }, // relación ManyToOne
    });

    const savedPost = await postRepo.save(newPost);

    res.status(201).json({
      ok: true,
      post: savedPost
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al crear la publicación', error: err.message });
  }
};

/**
 * Obtiene todas las publicaciones activas
 */
const getPosts = async (req, res) => {
  try {
    const postRepo = AppDataSource.getRepository("Publicacion");
    const posts = await postRepo.find({
      where: { estado: "pendiente" },
      relations: ["usuario"],
    });

    res.json({ ok: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al obtener las publicaciones' });
  }
};

/**
 * Actualiza una publicación
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, precio, ubicacion, tipo } = req.body;
    const postRepo = AppDataSource.getRepository("Publicacion");

    const post = await postRepo.findOne({ where: { id: parseInt(id) }, relations: ["usuario"] });
    if (!post || post.estado === "eliminado") {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    const isOwner = post.usuario.id === req.usuario.id;
    if (!isOwner && req.usuario.rol !== 'admin') {
      return res.status(403).json({ ok: false, msg: 'No tienes permiso para actualizar esta publicación' });
    }

    post.titulo = titulo ?? post.titulo;
    post.descripcion = descripcion ?? post.descripcion;
    post.precio = precio ?? post.precio;
    post.ubicacion = ubicacion ?? post.ubicacion;
    post.tipo = tipo ?? post.tipo;

    const updatedPost = await postRepo.save(post);
    res.json({ ok: true, msg: 'Publicación actualizada', post: updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al actualizar la publicación' });
  }
};

/**
 * Elimina lógicamente una publicación
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postRepo = AppDataSource.getRepository("Publicacion");

    const post = await postRepo.findOne({ where: { id: parseInt(id) }, relations: ["usuario"] });
    if (!post || post.estado === "eliminado") {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    const isOwner = post.usuario.id === req.usuario.id;
    if (!isOwner && req.usuario.rol !== 'admin') {
      return res.status(403).json({ ok: false, msg: 'No tienes permiso para eliminar esta publicación' });
    }

    post.estado = "eliminado";
    await postRepo.save(post);

    res.json({ ok: true, msg: 'Publicación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al eliminar la publicación' });
  }
};

/**
 * Aprueba una publicación (solo admin)
 */
const approvePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postRepo = AppDataSource.getRepository("Publicacion");

    const post = await postRepo.findOne({ where: { id: parseInt(id) } });
    if (!post || post.estado === "eliminado") {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    if (post.estado === "aprobado") {
      return res.status(400).json({ ok: false, msg: 'La publicación ya está aprobada' });
    }

    post.estado = "aprobado";
    await postRepo.save(post);

    res.json({ ok: true, msg: 'Publicación aprobada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al aprobar la publicación' });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, approvePost };
