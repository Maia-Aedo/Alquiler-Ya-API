/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class PrimerMigracion1757551251952 {
    name = 'PrimerMigracion1757551251952'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`Usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(100) NOT NULL, \`celular\` varchar(20) NOT NULL, \`rol\` enum ('usuario', 'propietario', 'admin') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fc2564b581e02a535b31470a00\` (\`username\`), UNIQUE INDEX \`IDX_c2591f33cb2c9e689e241dda91\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Publicacion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(255) NOT NULL, \`descripcion\` text NOT NULL, \`precio\` decimal(10,2) NOT NULL, \`ubicacion\` varchar(255) NOT NULL, \`tipo\` enum ('venta', 'alquiler', 'intercambio', 'otro') NOT NULL, \`imagenes\` json NOT NULL, \`estado\` enum ('pendiente', 'aprobado', 'eliminado') NOT NULL DEFAULT 'pendiente', \`creado_en\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`actualizado_en\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`usuario_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Archivo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`img_id\` varchar(255) NOT NULL, \`nombre_original\` varchar(255) NOT NULL, \`extension\` varchar(10) NOT NULL, \`creado_en\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`usuario_id\` int NULL, UNIQUE INDEX \`IDX_33ab0c126d74ba43451cfe01cf\` (\`img_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Publicacion\` ADD CONSTRAINT \`FK_b8786d10b7207ddb871baae4a95\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`Usuario\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Archivo\` ADD CONSTRAINT \`FK_48e82380e409d2f1fc4b0212022\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`Usuario\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`Archivo\` DROP FOREIGN KEY \`FK_48e82380e409d2f1fc4b0212022\``);
        await queryRunner.query(`ALTER TABLE \`Publicacion\` DROP FOREIGN KEY \`FK_b8786d10b7207ddb871baae4a95\``);
        await queryRunner.query(`DROP INDEX \`IDX_33ab0c126d74ba43451cfe01cf\` ON \`Archivo\``);
        await queryRunner.query(`DROP TABLE \`Archivo\``);
        await queryRunner.query(`DROP TABLE \`Publicacion\``);
        await queryRunner.query(`DROP INDEX \`IDX_c2591f33cb2c9e689e241dda91\` ON \`Usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_fc2564b581e02a535b31470a00\` ON \`Usuario\``);
        await queryRunner.query(`DROP TABLE \`Usuario\``);
    }
}
