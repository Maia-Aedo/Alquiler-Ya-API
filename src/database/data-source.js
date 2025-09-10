require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    secretKey: process.env.secret_seed,
    synchronize: true, // crea las tablas automáticamente
    logging: false,
    entities: [__dirname + "/entities/*.js"],
});

module.exports = AppDataSource;
