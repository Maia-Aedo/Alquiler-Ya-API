const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Usuario",
    tableName: "Usuario",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        username: {
            type: "varchar",
            length: 50,
            unique: true,
        },
        password: {
            type: "varchar",
            length: 255,
        },
        email: {
            type: "varchar",
            length: 100,
            unique: true,
        },
        celular: {
            type: "varchar",
            length: 20,
        },
        rol: {
            type: "enum",
            enum: ["usuario", "propietario", "admin"],
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        publicaciones: {
            type: "one-to-many",
            target: "Publicacion",
            inverseSide: "usuario",
        },
        archivos: {
            type: "one-to-many",
            target: "Archivo",
            inverseSide: "usuario",
        },
    },
});
