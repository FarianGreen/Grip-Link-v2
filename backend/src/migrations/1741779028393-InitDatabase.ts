import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabaseYYYYMMDDHHMMSS implements MigrationInterface {
  name = 'InitDatabase1741779028393';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('user', 'admin')`);

    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "passwordHash" VARCHAR NOT NULL,
        "refreshToken" VARCHAR,
        "role" "user_role_enum" NOT NULL DEFAULT 'user',
        "bio" TEXT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "chat" (
        "id" SERIAL PRIMARY KEY
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "message" (
        "id" SERIAL PRIMARY KEY,
        "content" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "senderId" INTEGER,
        "receiverId" INTEGER,
        "chatId" INTEGER,
        CONSTRAINT "FK_sender" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_receiver" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_chat" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "chat_users_user" (
        "chatId" INTEGER NOT NULL,
        "userId" INTEGER NOT NULL,
        PRIMARY KEY ("chatId", "userId"),
        CONSTRAINT "FK_chat_user_chat" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_chat_user_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_chatId" ON "chat_users_user" ("chatId")`);
    await queryRunner.query(`CREATE INDEX "IDX_userId" ON "chat_users_user" ("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_chatId"`);

    await queryRunner.query(`DROP TABLE "chat_users_user"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "chat"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}