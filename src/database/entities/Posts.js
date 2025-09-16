const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Publicacion",
    tableName: "Publicacion",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        titulo: {
            type: "varchar",
            length: 255,
        },
        descripcion: {
            type: "text",
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2,
        },
        ubicacion: {
            type: "varchar",
            length: 255,
        },
        tipo: {
            type: "enum",
            enum: ["venta", "alquiler", "intercambio", "otro"],
        },
        imagenes: {
            type: "json",
        },
        estado: {
            type: "enum",
            enum: ["pendiente", "aprobado", "eliminado"],
            default: "pendiente",
        },
        creado_en: {
            type: "timestamp",
            createDate: true,
        },
        actualizado_en: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "usuario_id",
            },
            onDelete: "CASCADE",
        },
    },
});
