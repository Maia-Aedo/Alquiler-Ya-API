const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Archivo",
    tableName: "Archivo",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        img_id: {
            type: "varchar",
            length: 255,
            unique: true,
        },
        nombre_original: {
            type: "varchar",
            length: 255,
        },
        extension: {
            type: "varchar",
            length: 10,
        },
        creado_en: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "usuario_id",
            },
            onDelete: "SET NULL",
            nullable: true,
        },
    },
});
