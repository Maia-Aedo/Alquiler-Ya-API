const { request, response } = require("express");
const { getConnection } = require("../models/database");

// Crear publicación (admin y propietario)
const createPost = async (req = request, res = response) => {
  const { titulo, descripcion } = req.body;
  const { id: usuarioId, rol } = req.usuario; // Usuario autenticado

  try {
    // Validar rol
    if (rol !== "admin" && rol !== "propietario") {
      return res.status(403).json({ ok: false, msg: "No autorizado" });
    }

    const connection = await getConnection();
    const [result] = await connection.query(
      "INSERT INTO publicaciones (titulo, descripcion, usuarioId) VALUES (?, ?, ?)",
      [titulo, descripcion, usuarioId]
    );

    res.status(201).json({ ok: true, msg: "Publicación creada", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Obtener todas las publicaciones (todos los roles)
const getPosts = async (req = request, res = response) => {
  try {
    const connection = await getConnection();
    const [result] = await connection.query("SELECT * FROM publicaciones");
    res.status(200).json({ ok: true, publicaciones: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Actualizar publicación (admin y propietario)
const updatePost = async (req = request, res = response) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const { id: usuarioId, rol } = req.usuario;

  try {
    const connection = await getConnection();
    // Verificar que la publicación existe y pertenece al usuario
    const [publicacion] = await connection.query(
      "SELECT * FROM publicaciones WHERE id = ?",
      [id]
    );

    if (!publicacion.length) {
      return res.status(404).json({ ok: false, msg: "Publicación no encontrada" });
    }

    if (rol !== "admin" && publicacion[0].usuarioId !== usuarioId) {
      return res.status(403).json({ ok: false, msg: "No autorizado" });
    }

    await connection.query(
      "UPDATE publicaciones SET titulo = ?, descripcion = ? WHERE id = ?",
      [titulo, descripcion, id]
    );

    res.status(200).json({ ok: true, msg: "Publicación actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Eliminar publicación (admin y propietario)
const deletePost = async (req = request, res = response) => {
  const { id } = req.params;
  const { id: usuarioId, rol } = req.usuario;

  try {
    const connection = await getConnection();
    const [publicacion] = await connection.query(
      "SELECT * FROM publicaciones WHERE id = ?",
      [id]
    );

    if (!publicacion.length) {
      return res.status(404).json({ ok: false, msg: "Publicación no encontrada" });
    }

    if (rol !== "admin" && publicacion[0].usuarioId !== usuarioId) {
      return res.status(403).json({ ok: false, msg: "No autorizado" });
    }

    await connection.query("DELETE FROM publicaciones WHERE id = ?", [id]);

    res.status(200).json({ ok: true, msg: "Publicación eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost };
