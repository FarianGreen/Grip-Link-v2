import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBioToUser1632223270000 implements MigrationInterface {
  name = 'AddBioToUser1632223270000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "bio" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
  }
}