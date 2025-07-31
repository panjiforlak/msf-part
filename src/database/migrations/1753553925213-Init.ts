import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753553925213 implements MigrationInterface {
  name = 'Init1753553925213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "fk_inventory_component"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employee_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
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
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
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
      `ALTER TABLE "inventory" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "inventory_code" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "inventory_internal_code" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "inventory_name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "component_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "component_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "weight" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "uom" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "quantity" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "racks_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "batch_inbound" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ADD "price" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "arrival_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "arrival_date" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."batchin_type" RENAME TO "batchin_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."batch_inbound_status_reloc_enum" AS ENUM('inbound', 'storage', 'others')`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "status_reloc" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "status_reloc" TYPE "public"."batch_inbound_status_reloc_enum" USING "status_reloc"::"text"::"public"."batch_inbound_status_reloc_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "status_reloc" SET DEFAULT 'others'`,
    );
    await queryRunner.query(`DROP TYPE "public"."batchin_type_old"`);
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "deletedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "reloc_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "reloc_date" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "deletedBy" SET NOT NULL`,
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
      `ALTER TABLE "items_master" ADD CONSTRAINT "PK_cc4516a6c8350f94332cce8a94f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "items_master_id_seq" OWNED BY "items_master"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "id" SET DEFAULT nextval('"items_master_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "category_id" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items_master" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items_master" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "icon" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items_master" DROP COLUMN "link"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "link" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "is_active" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "inventory_code_old" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "inventory_code_new" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "deletedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "doc_ship_no" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "doc_ship_photo" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" DROP CONSTRAINT "doc_shipping_no_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "doc_ship_photo" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "deletedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP CONSTRAINT "workingarea_uuid_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "working_area_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "working_area_code" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."wa_type" RENAME TO "wa_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workingarea_working_area_type_enum" AS ENUM('inbound area', 'box', 'rack', 'outbound area', 'others')`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_type" TYPE "public"."workingarea_working_area_type_enum" USING "working_area_type"::"text"::"public"."workingarea_working_area_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(`DROP TYPE "public"."wa_type_old"`);
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_availability" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_availability" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."wa_status" RENAME TO "wa_status_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workingarea_working_area_status_enum" AS ENUM('slow moving', 'fast moving', 'others')`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_status" TYPE "public"."workingarea_working_area_status_enum" USING "working_area_status"::"text"::"public"."workingarea_working_area_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_status" SET DEFAULT 'others'`,
    );
    await queryRunner.query(`DROP TYPE "public"."wa_status_old"`);
    await queryRunner.query(`ALTER TABLE "workingarea" DROP COLUMN "barcode"`);
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "barcode" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "workingarea" DROP COLUMN "remarks"`);
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "remarks" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "createdBy" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "updatedBy" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "deletedBy" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "deletedAt" TIMESTAMP`,
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
      `ALTER TABLE "storage_area" ALTER COLUMN "remarks" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."st_type" RENAME TO "st_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."storage_area_storage_type_enum" AS ENUM('others', 'box', 'rack')`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_type" TYPE "public"."storage_area_storage_type_enum" USING "storage_type"::"text"::"public"."storage_area_storage_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(`DROP TYPE "public"."st_type_old"`);
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_availability" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."st_status" RENAME TO "st_status_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."storage_area_status_enum" AS ENUM('slow moving', 'fast moving', 'temp')`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "status" TYPE "public"."storage_area_status_enum" USING "status"::"text"::"public"."storage_area_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "status" SET DEFAULT 'temp'`,
    );
    await queryRunner.query(`DROP TYPE "public"."st_status_old"`);
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "deletedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" DROP CONSTRAINT "inout_code_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "inout_area_code" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "remarks" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."inout_type" RENAME TO "inout_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inbound_outbound_area_type_enum" AS ENUM('others', 'inbound', 'outbound')`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "type" TYPE "public"."inbound_outbound_area_type_enum" USING "type"::"text"::"public"."inbound_outbound_area_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(`DROP TYPE "public"."inout_type_old"`);
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "deletedBy" SET NOT NULL`,
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
      `ALTER TABLE "components" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."inv_type" RENAME TO "inv_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."components_inventory_type_enum" AS ENUM('others', 'sparepart', 'non-sparepart')`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "inventory_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "inventory_type" TYPE "public"."components_inventory_type_enum" USING "inventory_type"::"text"::"public"."components_inventory_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "inventory_type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(`DROP TYPE "public"."inv_type_old"`);
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "component_name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "deletedBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_eb3637a695503d9f76375a694e9" FOREIGN KEY ("role_parent") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ADD CONSTRAINT "FK_b1ac375b85204ae31dbe48e2493" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ADD CONSTRAINT "FK_4457575bcc7861cc465fd05ae09" FOREIGN KEY ("batch_in_id") REFERENCES "batch_inbound"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD CONSTRAINT "FK_9ed0e594bbaf0bf3cd3e9492969" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP CONSTRAINT "FK_9ed0e594bbaf0bf3cd3e9492969"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" DROP CONSTRAINT "FK_4457575bcc7861cc465fd05ae09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" DROP CONSTRAINT "FK_b1ac375b85204ae31dbe48e2493"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_eb3637a695503d9f76375a694e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "component_name" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inv_type_old" AS ENUM('others', 'sparepart', 'non-sparepart')`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "inventory_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "inventory_type" TYPE "public"."inv_type_old" USING "inventory_type"::"text"::"public"."inv_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "inventory_type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."components_inventory_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."inv_type_old" RENAME TO "inv_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "components" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`,
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
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inout_type_old" AS ENUM('others', 'inbound', 'outbound')`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "type" TYPE "public"."inout_type_old" USING "type"::"text"::"public"."inout_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."inbound_outbound_area_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."inout_type_old" RENAME TO "inout_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "remarks" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ALTER COLUMN "inout_area_code" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbound_outbound_area" ADD CONSTRAINT "inout_code_key" UNIQUE ("inout_area_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."st_status_old" AS ENUM('slow moving', 'fast moving', 'temp')`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "status" TYPE "public"."st_status_old" USING "status"::"text"::"public"."st_status_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "status" SET DEFAULT 'temp'`,
    );
    await queryRunner.query(`DROP TYPE "public"."storage_area_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."st_status_old" RENAME TO "st_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_availability" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."st_type_old" AS ENUM('others', 'box', 'rack')`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_type" TYPE "public"."st_type_old" USING "storage_type"::"text"::"public"."st_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "storage_type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."storage_area_storage_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."st_type_old" RENAME TO "st_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage_area" ALTER COLUMN "remarks" SET DEFAULT NULL`,
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
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "deletedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "updatedBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "createdBy" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "workingarea" DROP COLUMN "remarks"`);
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "remarks" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "workingarea" DROP COLUMN "barcode"`);
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "barcode" character varying(40) DEFAULT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wa_status_old" AS ENUM('others', 'slow moving', 'fast moving')`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_status" TYPE "public"."wa_status_old" USING "working_area_status"::"text"::"public"."wa_status_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_status" SET DEFAULT 'others'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."workingarea_working_area_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."wa_status_old" RENAME TO "wa_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_availability" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_availability" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wa_type_old" AS ENUM('others', 'inbound area', 'box', 'rack', 'outbound area')`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_type" TYPE "public"."wa_type_old" USING "working_area_type"::"text"::"public"."wa_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "working_area_type" SET DEFAULT 'others'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."workingarea_working_area_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."wa_type_old" RENAME TO "wa_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" DROP COLUMN "working_area_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD "working_area_code" character varying(30) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workingarea" ADD CONSTRAINT "workingarea_uuid_key" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "doc_ship_photo" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ADD CONSTRAINT "doc_shipping_no_key" UNIQUE ("doc_ship_photo")`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "doc_ship_photo" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "doc_ship_no" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "doc_shipping" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "inventory_code_new" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_spnum_log" ALTER COLUMN "inventory_code_old" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "is_active" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items_master" DROP COLUMN "link"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "link" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "items_master" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "icon" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "description" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "items_master" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "category_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "id" SET DEFAULT nextval('items_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "items_master" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "items_master_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "items_master" DROP CONSTRAINT "PK_cc4516a6c8350f94332cce8a94f"`,
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
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "reloc_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reloc_inbound" ALTER COLUMN "reloc_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "deletedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "updatedBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "createdBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."batchin_type_old" AS ENUM('others', 'inbound', 'storage')`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "status_reloc" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "status_reloc" TYPE "public"."batchin_type_old" USING "status_reloc"::"text"::"public"."batchin_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "status_reloc" SET DEFAULT 'others'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."batch_inbound_status_reloc_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."batchin_type_old" RENAME TO "batchin_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "arrival_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ALTER COLUMN "arrival_date" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "batch_inbound" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "batch_inbound" ADD "price" numeric(10,0) DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "racks_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "quantity" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "uom" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "weight" SET DEFAULT 0.00`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "component_id" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "component_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "inventory_name" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "inventory_internal_code" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "inventory_code" SET DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "uuid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`,
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
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
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
    await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "employee_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "fk_inventory_component" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE SET NULL ON UPDATE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
