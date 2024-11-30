const { request, response } = require("express");
const { getConnection } = require("../models/database");

/**
 * @description Crear una publicación (Admin y Propietario)
 */
const createPost = async (req = request, res = response) => {
  const { titulo, descripcion, precio, direccion } = req.body;
  const { id: propietarioId } = req.usuario; // Usuario autenticado

  if (!titulo || !descripcion || !precio || !direccion) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "INSERT INTO Propiedad (titulo, descripcion, precio, direccion, propietario_id) VALUES (?, ?, ?, ?, ?)",
      [titulo, descripcion, precio, direccion, propietarioId]
    );

    res.status(201).json({ ok: true, msg: "Publicación creada", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};


/**
 * @description Obtener todas las publicaciones (Todos los roles)
 */
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

/**
 * @description Actualizar una publicación (Admin y Propietario)
 */
const updatePost = async (req = request, res = response) => {
  const { id } = req.params;
  const { titulo, descripcion, precio, direccion } = req.body;
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

    const esPropietario = publicacion[0].propietario_id === usuarioId;

    if (!["admin", "propietario"].includes(rol) || (rol === "propietario" && !esPropietario)) {
      return res.status(403).json({ ok: false, msg: "No autorizado para actualizar esta publicación" });
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

/**
 * @description Eliminar una publicación (Admin y Propietario)
 */
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

    const esPropietario = publicacion[0].propietario_id === usuarioId;

    if (!["admin", "propietario"].includes(rol) || (rol === "propietario" && !esPropietario)) {
      return res.status(403).json({ ok: false, msg: "No autorizado para eliminar esta publicación" });
    }

    await connection.query("DELETE FROM Propiedad WHERE id = ?", [id]);

    res.status(200).json({ ok: true, msg: "Publicación eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

/**
 * @description Aprobar una publicación (Admin)
 */
const approvePost = async (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.usuario;

  if (rol !== "admin") {
    return res.status(403).json({ ok: false, msg: "No autorizado para aprobar publicaciones" });
  }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, approvePost };
