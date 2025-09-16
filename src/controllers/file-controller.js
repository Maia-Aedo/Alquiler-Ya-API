/**
 * @module file-controller
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { AppDataSource } = require('../database/database');
const Archivo = require('../database/entities/File');

const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];

/**
 * Sube un archivo al servidor y genera un nombre único
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

        file.mv(uploadPath, (err) => {
            if (err) return reject(err);
            resolve(tempName);
        });
    });
};

/**
 * Controlador HTTP para subir archivos
 */
const postFile = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ ok: false, msg: 'No se subió ningún archivo' });
        }

        const file = req.files.file;
        const originalName = file.name;
        const extension = originalName.split('.').pop().toLowerCase();

        if (!extensions.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: `Extensión no permitida. Solo: ${extensions.join(', ')}`
            });
        }

        const img_id = await uploadFiles(file);

        const archivoRepo = AppDataSource.getRepository(Archivo);

        const newArchivo = archivoRepo.create({
            img_id,
            nombre_original: originalName,
            extension,
            usuario: req.usuario ? { id: req.usuario.id } : null, // relación ManyToOne opcional
        });

        const savedArchivo = await archivoRepo.save(newArchivo);

        return res.status(200).json({ ok: true, record: savedArchivo, msg: 'Subido correctamente' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, msg: 'Error al subir el archivo', error: err.message });
    }
};

module.exports = { postFile };
