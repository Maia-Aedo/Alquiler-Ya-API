/**
 * @module post-controller
 * @description Controlador para manejo de publicaciones: crear, obtener, actualizar, eliminar y aprobar posts.
 */

const { getConnection } = require("../database/database");
const fs = require('fs');
const path = require('path');

/**
 * Crea una nueva publicación en la base de datos.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} - Respuesta JSON con el estado de la operación.
 */
const createPost = async (req, res) => {
  try {
    const { titulo, descripcion, precio, ubicacion, tipo } = req.body;

    if (!titulo || !descripcion || !precio || !ubicacion || !tipo) {
      return res.status(400).json({ ok: false, msg: 'Faltan campos obligatorios' });
    }

    let imageNames = [];

    if (!req.files || !req.files.imagenes) {
      return res.status(400).json({ ok: false, msg: 'Debe subir al menos una imagen' });
    }

    const images = Array.isArray(req.files.imagenes) ? req.files.imagenes : [req.files.imagenes];
    imageNames = images.map(file => file.name);

    const usuario_id = req.user.id; // Asegúrate de que JWT funcione correctamente

    const [result] = await pool.query(
      `INSERT INTO posts (titulo, descripcion, precio, ubicacion, tipo, imagenes, usuario_id)
             VALUES (?, ?, ?, ?, ?, JSON_ARRAY_PACK(?), ?)`,
      [titulo, descripcion, precio, ubicacion, tipo, JSON.stringify(imageNames), usuario_id]
    );

    const postId = result.insertId;

    return res.status(201).json({
      ok: true,
      post: {
        id: postId,
        titulo,
        descripcion,
        precio,
        ubicacion,
        tipo,
        imagenes: imageNames,
        usuario_id
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error al crear la publicación' });
  }
};

/**
 * Obtiene todas las publicaciones activas (no eliminadas).
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} - Lista de publicaciones.
 */

const getPosts = async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query(`
            SELECT *, JSON_UNQUOTE(JSON_EXTRACT(imagenes, '$')) AS imagenes 
            FROM posts WHERE estado != 'eliminado'
        `);

    return res.json({ ok: true, posts: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error al obtener las publicaciones' });
  }
};

/**
 * Actualiza los datos de una publicación existente.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con parámetros y cuerpo.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} - Resultado de la operación.
 */
const updatePost = async (req, res) => {
  const connection = await getConnection();
  try {
    const { id } = req.params;
    const { titulo, descripcion, precio, ubicacion, tipo } = req.body;

    // Validar existencia de la publicación
    const [existing] = await connection.query('SELECT * FROM posts WHERE id = ?', [id]);

    if (existing.length === 0 || existing[0].estado === 'eliminado') {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    // Permitir actualizar solo si es propietario o admin
    const isOwner = existing[0].usuario_id === req.user.id;
    if (!isOwner && !req.user.roles.includes('admin')) {
      return res.status(403).json({ ok: false, msg: 'No tienes permiso para actualizar esta publicación' });
    }

    // Actualizar datos
    await connection.query(
      `UPDATE posts SET titulo = ?, descripcion = ?, precio = ?, ubicacion = ?, tipo = ?
             WHERE id = ?`,
      [titulo, descripcion, precio, ubicacion, tipo, id]
    );

    return res.json({ ok: true, msg: 'Publicación actualizada correctamente' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error al actualizar la publicación' });
  } finally {
    connection.release();
  }
};

/**
 * Elimina lógicamente una publicación (cambia su estado a 'eliminado').
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con el ID de la publicación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} - Resultado de la eliminación.
 */

const deletePost = async (req, res) => {
  const connection = await getConnection();
  try {
    const { id } = req.params;

    const [post] = await connection.query('SELECT * FROM posts WHERE id = ?', [id]);

    if (post.length === 0 || post[0].estado === 'eliminado') {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    const isOwner = post[0].usuario_id === req.user.id;
    if (!isOwner && !req.user.roles.includes('admin')) {
      return res.status(403).json({ ok: false, msg: 'No tienes permiso para eliminar esta publicación' });
    }

    await connection.query(`UPDATE posts SET estado = 'eliminado' WHERE id = ?`, [id]);

    return res.json({ ok: true, msg: 'Publicación eliminada correctamente' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error al eliminar la publicación' });
  } finally {
    connection.release();
  }
};

/**
 * Aprueba una publicación (solo usuarios con rol 'admin').
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con el ID de la publicación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} - Resultado de la aprobación.
 */
const approvePost = async (req, res) => {
  const connection = await getConnection();
  try {
    const { id } = req.params;

    const [post] = await connection.query('SELECT * FROM posts WHERE id = ?', [id]);

    if (post.length === 0 || post[0].estado === 'eliminado') {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    if (post[0].estado === 'aprobado') {
      return res.status(400).json({ ok: false, msg: 'La publicación ya está aprobada' });
    }

    await connection.query(`UPDATE posts SET estado = 'aprobado' WHERE id = ?`, [id]);

    return res.json({ ok: true, msg: 'Publicación aprobada correctamente' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error al aprobar la publicación' });
  } finally {
    connection.release();
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, approvePost };