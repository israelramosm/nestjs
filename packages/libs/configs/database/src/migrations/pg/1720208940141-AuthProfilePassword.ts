import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthProfilePassword1720208940141 implements MigrationInterface {
    name = 'AuthProfilePassword1720208940141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password" ("password_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "password" character varying NOT NULL, "reset_password_code" integer, CONSTRAINT "PK_ae3c9ececc9e15d40199ba93578" PRIMARY KEY ("password_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profile_gender_enum" AS ENUM('m', 'f', 'u')`);
        await queryRunner.query(`CREATE TABLE "profile" ("profile_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "photo_url" character varying, "gender" "public"."profile_gender_enum", "birthday" date, CONSTRAINT "PK_b0465dda30314a8786db3354a65" PRIMARY KEY ("profile_id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_name" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "passwordPasswordId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_1d4d058acd281d1b3f1ae9ddd3f" UNIQUE ("passwordPasswordId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileProfileId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6be5c052a2d1fb1ab60a40cf54b" UNIQUE ("profileProfileId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1d4d058acd281d1b3f1ae9ddd3f" FOREIGN KEY ("passwordPasswordId") REFERENCES "password"("password_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6be5c052a2d1fb1ab60a40cf54b" FOREIGN KEY ("profileProfileId") REFERENCES "profile"("profile_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6be5c052a2d1fb1ab60a40cf54b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1d4d058acd281d1b3f1ae9ddd3f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6be5c052a2d1fb1ab60a40cf54b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileProfileId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_1d4d058acd281d1b3f1ae9ddd3f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordPasswordId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_758b8ce7c18b9d347461b30228d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_id"`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('m', 'f', 'u')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" "public"."user_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "public"."profile_gender_enum"`);
        await queryRunner.query(`DROP TABLE "password"`);
    }

}
