import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSppbTable1753553925214 implements MigrationInterface {
    name = 'CreateSppbTable1753553925214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."sppb_status_enum" AS ENUM('waiting', 'completed')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "sppb" (
                "id" SERIAL NOT NULL,
                "uuid" text NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
                "order_form_id" integer NOT NULL DEFAULT '0',
                "sppb_number" character varying(20) NOT NULL,
                "mechanic_photo" text,
                "status" "public"."sppb_status_enum" NOT NULL DEFAULT 'waiting',
                "createdBy" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updatedBy" integer NOT NULL DEFAULT '0',
                "updatedAt" TIMESTAMPTZ,
                "deletedBy" integer NOT NULL DEFAULT '0',
                "deletedAt" TIMESTAMPTZ,
                CONSTRAINT "UQ_sppb_uuid" UNIQUE ("uuid"),
                CONSTRAINT "UQ_sppb_sppb_number" UNIQUE ("sppb_number"),
                CONSTRAINT "PK_sppb_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sppb"`);
        await queryRunner.query(`DROP TYPE "public"."sppb_status_enum"`);
    }
} 