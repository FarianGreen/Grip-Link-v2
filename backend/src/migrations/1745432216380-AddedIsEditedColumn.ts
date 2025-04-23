import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsEditedColumn1745432216380 implements MigrationInterface {
    name = 'AddedIsEditedColumn1745432216380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "isEdited" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "isEdited"`);
    }

}
