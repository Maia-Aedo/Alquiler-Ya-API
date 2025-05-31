/**
 * @module helpers/uploader
 * @description Helper para subida de archivos.
 * uuid Genera identificadores únicos universales.
 */

const { v4: uuidv4 } = require('uuid');
const { path } = require('../app');

/**
 * @param extensions Define extensiones permitidas.
 * @param path Define donde se guarda el archivo en el servidor.
 */
const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bpm', 'svg'];

/**
 * Sube un archivo al servidor si cumple con las extensiones permitidas.
 *
 * @function uploadFiles
 * @param {Object} fileToUpload - Objeto que contiene el archivo.
 * @param {Object} fileToUpload.file - Archivo proveniente de fileUpload.
 * @returns {Promise<string>} Retorna el nombre con el que se guardó el archivo.
 *
 * @throws {Object} Si la extensión no es válida o ocurre un error al mover el archivo.
 *
 * @example
 * const nombreArchivo = await uploadFiles(req.files);
 */

const uploadFiles = (fileToUpload) => {
    return new Promise((resolve, rejected) => {
        // Obtiene el archivo, extension y nombre
        const { file } = fileToUpload;
        const extensionAndName = file.name.split('.');
        const extension = extensionAndName[extensionAndName.length - 1];
        if (!extensions.includes(extension)) {
            //* Verifica que sea permitida
            return rejected({ msg: `Extensiones permitidas: ${extensions}` });
        }

        // Crea un id único para el archivo
        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads', tempName);
        file.mv(uploadPath, function (err) {
            if (err) {
                rejected(err);
            }
            resolve(tempName);
        })
    })
}

module.exports = { uploadFiles };
