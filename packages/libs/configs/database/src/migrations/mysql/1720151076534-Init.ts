import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1720151076534 implements MigrationInterface {
    name = 'Init1720151076534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`username\` varchar(15) NOT NULL, \`email\` varchar(40) NOT NULL, \`age\` int NOT NULL, \`password\` varchar(255) NOT NULL, \`gender\` enum ('m', 'f', 'u') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
