/**
 * @module file-controller
 * @description Controlador para la carga y archivos subidos.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];

/**
 * Sube un archivo al servidor y genera un nombre único.
 *
 * @function
 * @param {Object} file - Archivo recibido desde `req.files`.
 * @param {string} file.name - Nombre original del archivo .
 * @param {Function} file.mv - Función para mover el archivo a un nuevo destino.
 * @returns {Promise<string>} - Una promesa que resuelve con el nuevo nombre del archivo.
 * @throws {Object} - Error con mensaje si la extensión no es válida o si falla al mover.
 */

const uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
        const extensionAndName = file.name.split('.');
        const extension = extensionAndName.pop().toLowerCase();

        if (!extensions.includes(extension)) {
            return reject({ msg: `Extensión no permitida. Solo: ${extensions.join(', ')}` });
        }

        const tempName = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads', tempName);

        file.mv(uploadPath, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(tempName);
        });
    });
};

/**
 * Controlador HTTP que maneja la carga de archivos.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.files - Archivos subidos a través de multipart/form-data.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Response>} - Devuelve el nombre del archivo subido o un error.
 */
const postFile = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ ok: false, msg: 'No se subió ningún archivo' });
        }

        const file = req.files.file;

        const img_id = await uploadFiles(file);
        const record = { img_id };

        return res.status(200).json({ ok: true, record, msg: 'Subido correctamente' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, msg: 'Error al subir el archivo', error: err.message });
    }
};

module.exports = { postFile };