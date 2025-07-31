import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753265579477 implements MigrationInterface {
  name = 'Init1753265579477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employee_id"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "roles_roleCode_key"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "roleCode"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "roleCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_6da95e99c706be73a6a4ba0c96a" UNIQUE ("roleCode")`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "role_parent" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "role_parent" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "users_username_key"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roleId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "users_email_key"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "isActive" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "reset_password_token" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key")`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "value" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ALTER COLUMN "isActive" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "category_id" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "icon" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "link"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "link" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "is_active" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "vin_number"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "vin_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP COLUMN "vehicle_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "vehicle_number" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "brand"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "brand" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP COLUMN "capacity_ton"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "capacity_ton" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ALTER COLUMN "createdBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ALTER COLUMN "updatedBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ALTER COLUMN "deletedBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "vehicles" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_uuid_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "item_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" DROP COLUMN "supplier_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "supplier_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" DROP COLUMN "supplier_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "supplier_address" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "remarks"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "remarks" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "createdBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "updatedBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "deletedBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "employee_nip_key"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "nip"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "nip" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "division"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "division" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "position"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "position" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "sallary"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "sallary" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."employee_status" RENAME TO "employee_status_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employee_status_enum" AS ENUM('active', 'inactive', 'resigned', 'onleave')`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" TYPE "public"."employee_status_enum" USING "status"::"text"::"public"."employee_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."employee_status_old"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "createdBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "updatedBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "deletedBy" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "employee" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_eb3637a695503d9f76375a694e9" FOREIGN KEY ("role_parent") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_eb3637a695503d9f76375a694e9"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "deletedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "updatedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "createdBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employee_status_old" AS ENUM('active', 'inactive', 'resigned', 'onleave')`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "status" TYPE "public"."employee_status_old" USING "status"::"text"::"public"."employee_status_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."employee_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."employee_status_old" RENAME TO "employee_status"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "sallary"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "sallary" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "position"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "position" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "division"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "division" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "last_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "first_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "nip"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "nip" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "employee_nip_key" UNIQUE ("nip")`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "deletedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "updatedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "createdBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "remarks"`);
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "remarks" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" DROP COLUMN "supplier_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "supplier_address" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" DROP COLUMN "supplier_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD "supplier_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "item_id" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_uuid_key" UNIQUE ("uuid")`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ALTER COLUMN "deletedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ALTER COLUMN "updatedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ALTER COLUMN "createdBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "status" character varying(255) DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP COLUMN "capacity_ton"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "capacity_ton" integer`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "type" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "brand"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "brand" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP COLUMN "vehicle_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "vehicle_number" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "vin_number"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "vin_number" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6"`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "is_active" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "link"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "link" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "icon" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "description" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "category_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ALTER COLUMN "isActive" SET DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "value" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "UQ_c8639b7626fa94ba8265628f214"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "key" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "reset_password_token" SET DEFAULT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roleId" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE ("username")`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "role_parent" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "role_parent" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_6da95e99c706be73a6a4ba0c96a"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "roleCode"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "roleCode" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "roles_roleCode_key" UNIQUE ("roleCode")`,
    );
    await queryRunner.query(`ALTER TABLE "employee" ADD "user_id" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "employee_id" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
