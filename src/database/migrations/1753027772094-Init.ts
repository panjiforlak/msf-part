import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753027772094 implements MigrationInterface {
    name = 'Init1753027772094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "roles_roleCode_key"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "roleCode"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "roleCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_6da95e99c706be73a6a4ba0c96a" UNIQUE ("roleCode")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role_parent" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role_parent" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "category_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "icon" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_eb3637a695503d9f76375a694e9" FOREIGN KEY ("role_parent") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_eb3637a695503d9f76375a694e9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "link" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "icon" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "description" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "category_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role_parent" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role_parent" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_6da95e99c706be73a6a4ba0c96a"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "roleCode"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "roleCode" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "roles_roleCode_key" UNIQUE ("roleCode")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

}
