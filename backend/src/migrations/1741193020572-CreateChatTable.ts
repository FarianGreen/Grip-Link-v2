import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatTable1741193020572 implements MigrationInterface {
    name = 'CreateChatTable1741193020572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users_user" ("chatId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c6af481280fb886733ddbd73661" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a573fa22dfa3574496311588c" ON "chat_users_user" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2004be39e2b3044c392bfe3e61" ON "chat_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "chat_users_user" ADD CONSTRAINT "FK_6a573fa22dfa3574496311588c7" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" ADD CONSTRAINT "FK_2004be39e2b3044c392bfe3e617" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_users_user" DROP CONSTRAINT "FK_2004be39e2b3044c392bfe3e617"`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" DROP CONSTRAINT "FK_6a573fa22dfa3574496311588c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2004be39e2b3044c392bfe3e61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a573fa22dfa3574496311588c"`);
        await queryRunner.query(`DROP TABLE "chat_users_user"`);
        await queryRunner.query(`DROP TABLE "chat"`);
    }

}
