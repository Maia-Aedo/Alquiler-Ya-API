/**
 * @module file-controller
 * @description Controlador para la subida de archivos al servidor y registro en base de datos.
 */

const { AppDataSource } = require('../database/database');
const Archivo = require('../database/entities/File');
const { uploadFiles } = require('../helpers/uploader');

/**
 * Controlador HTTP para subir archivos.
 *
 * @function postFile
 * @param {Object} req - Objeto de solicitud HTTP (con `req.files.file`).
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} Respuesta con el archivo guardado.
 */
const postFile = async (req, res) => {
  try {
    console.log(req.files); // 👀 Verifica qué llega desde el cliente

    // ✅ Validar si hay archivos en la solicitud
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        ok: false,
        msg: 'No se subió ningún archivo.',
      });
    }

    const file = req.files.file;

    // ✅ Subir el archivo usando el helper
    const img_id = await uploadFiles(file);

    // ✅ Obtener el repositorio de la entidad Archivo
    const archivoRepo = AppDataSource.getRepository(Archivo);

    // ✅ Crear un nuevo registro con los datos del archivo
    const newArchivo = archivoRepo.create({
      img_id, // nombre único del archivo
      nombre_original: file.name,
      extension: file.name.split('.').pop().toLowerCase(),
      usuario: req.usuario ? { id: req.usuario.id } : null, // opcional
    });

    // ✅ Guardar en la base de datos
    const savedArchivo = await archivoRepo.save(newArchivo);

    return res.status(200).json({
      ok: true,
      msg: 'Archivo subido correctamente.',
      record: savedArchivo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      msg: 'Error al subir el archivo.',
      error: err.message,
    });
  }
};

module.exports = { postFile };
