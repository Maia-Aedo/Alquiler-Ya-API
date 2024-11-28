const { request, response } = require("express");
const { getConnection } = require("../models/database");

// Crear publicación (admin y propietario)
const createPost = async (req = request, res = response) => {
  const { titulo, descripcion, precio, direccion } = req.body;
  const { id: usuario_id, rol } = req.usuario; // Usuario autenticado

  if (!titulo || !descripcion || !precio || !direccion) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    // Validar rol
    if (rol !== "admin" && rol !== "propietario") {
      return res.status(403).json({ ok: false, msg: "No autorizado" });
    }

    const connection = await getConnection();
    const [result] = await connection.query(
      "INSERT INTO Propiedad (titulo, descripcion, precio, direccion, propietario_id) VALUES (?, ?, ?, ?, ?)",
      [titulo, descripcion, precio, direccion, usuario_id]
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
    const [result] = await connection.query("SELECT * FROM Propiedad");
    res.status(200).json({ ok: true, publicaciones: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Actualizar publicación (admin y propietario)
const updatePost = async (req = request, res = response) => {
  const { id } = req.params;
  const { titulo, descripcion, precio, direccion } = req.body;
  const { id: usuarioId, rol } = req.usuario;

  try {
    const connection = await getConnection();
    // Verificar que la publicación existe y pertenece al usuario
    const [publicacion] = await connection.query(
      "SELECT * FROM Propiedad WHERE id = ?",
      [id]
    );

    if (!publicacion.length) {
      return res.status(404).json({ ok: false, msg: "Publicación no encontrada" });
    }

    if (rol !== "admin" && publicacion[0].propietario_id !== usuarioId) {
      return res.status(403).json({ ok: false, msg: "No autorizado" });
    }

    await connection.query(
      "UPDATE Propiedad SET titulo = ?, descripcion = ?, precio = ?, direccion = ? WHERE id = ?",
      [titulo, descripcion, precio, direccion, id]
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
      "SELECT * FROM Propiedad WHERE id = ?",
      [id]
    );

    if (!publicacion.length) {
      return res.status(404).json({ ok: false, msg: "Publicación no encontrada" });
    }

    if (rol !== "admin" && publicacion[0].propietario_id !== usuarioId) {
      return res.status(403).json({ ok: false, msg: "No autorizado" });
    }

    await connection.query("DELETE FROM Propiedad WHERE id = ?", [id]);

    res.status(200).json({ ok: true, msg: "Publicación eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

const approvePost = async (req, res) => {
  const { id } = req.params;
  
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "UPDATE Propiedad SET estado = 'aprobada' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: "Publicación no encontrada" });
    }

    res.status(200).json({ ok: true, msg: "Publicación aprobada exitosamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, e, msg: "Error en el servidor" });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, approvePost };
