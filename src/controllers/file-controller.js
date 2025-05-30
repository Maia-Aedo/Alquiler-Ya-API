const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];

/**
 * @description Sube el archivo y devuelve un nombre único
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