import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMessageEntity1745655417696 implements MigrationInterface {
    name = 'UpdateMessageEntity1745655417696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message_read_by_user" ("messageId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b8d2d00629fe7f2c4fa82f65f0b" PRIMARY KEY ("messageId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_60941aaf5fa2dcee46989d3b17" ON "message_read_by_user" ("messageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86093fa381dd0541fcf8e5d59a" ON "message_read_by_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "isRead"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "PK_ba01f0a3e0123651915008bc578"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chatId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "chatId" integer`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("chatId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message_read_by_user" ADD CONSTRAINT "FK_60941aaf5fa2dcee46989d3b17f" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_read_by_user" ADD CONSTRAINT "FK_86093fa381dd0541fcf8e5d59aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_read_by_user" DROP CONSTRAINT "FK_86093fa381dd0541fcf8e5d59aa"`);
        await queryRunner.query(`ALTER TABLE "message_read_by_user" DROP CONSTRAINT "FK_60941aaf5fa2dcee46989d3b17f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chatId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "chatId" bigint`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "PK_ba01f0a3e0123651915008bc578"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("chatId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD "isRead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86093fa381dd0541fcf8e5d59a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60941aaf5fa2dcee46989d3b17"`);
        await queryRunner.query(`DROP TABLE "message_read_by_user"`);
    }

}
