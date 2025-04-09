import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1741779028393 implements MigrationInterface {
    name = 'InitDatabase1741779028393';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableExist = await queryRunner.hasTable('chat');
        if (!tableExist) {
            await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        }
        // Убедитесь, что таблица user существует
        const userTableExist = await queryRunner.hasTable('user');
        if (!userTableExist) {
            await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "refreshToken" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        }
        // Аналогично для остальных таблиц
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_users_user"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "message"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat"`);
    }
}