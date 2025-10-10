/**
 * @module helpers/uploader
 * @description Helper para subida de archivos al servidor.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Extensiones permitidas para los archivos subidos.
 */
const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];

/**
 * Sube un archivo al servidor si cumple con las extensiones permitidas.
 *
 * @function uploadFiles
 * @param {Object} fileToUpload - Objeto que contiene el archivo proveniente de express-fileupload.
 * @param {string} [folder='uploads'] - Carpeta donde se guardará el archivo (por defecto: /uploads).
 * @returns {Promise<string>} Retorna el nombre con el que se guardó el archivo.
 *
 * @throws {Error} Si la extensión no es válida o ocurre un error al mover el archivo.
 *
 * @example
 * const nombreArchivo = await uploadFiles(req.files.file);
 */
const uploadFiles = (fileToUpload, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    // Validación: debe venir un archivo
    if (!fileToUpload || !fileToUpload.name) {
      return reject(new Error('No se recibió ningún archivo válido.'));
    }

    // Obtiene extensión del archivo
    const extension = fileToUpload.name.split('.').pop().toLowerCase();

    // Verifica que sea una extensión permitida
    if (!extensions.includes(extension)) {
      return reject(
        new Error(`Extensión no permitida. Solo se aceptan: ${extensions.join(', ')}`)
      );
    }

    // Genera un nombre único usando UUID
    const tempName = `${uuidv4()}.${extension}`;

    // Asegura que la carpeta de destino exista
    const uploadDir = path.join(__dirname, `../${folder}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Crea la ruta completa donde se guardará el archivo
    const uploadPath = path.join(uploadDir, tempName);

    // Mueve el archivo al destino
    fileToUpload.mv(uploadPath, (err) => {
      if (err) return reject(err);
      resolve(tempName);
    });
  });
};

module.exports = { uploadFiles };
