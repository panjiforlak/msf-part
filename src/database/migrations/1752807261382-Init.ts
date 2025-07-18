import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1752807261382 implements MigrationInterface {
  name = 'Init1752807261382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "roleId" integer NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL Default true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(),"updatedAt" TIMESTAMP, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
