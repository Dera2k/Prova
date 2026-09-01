import { MigrationInterface, QueryRunner } from "typeorm";
export class MarketplaceEntities1788271648018 implements MigrationInterface {
    name = 'MarketplaceEntities1788271648018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "label" character varying NOT NULL, "street" character varying NOT NULL, "area" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'Nigeria', "latitude" numeric(9,6) NOT NULL, "longitude" numeric(9,6) NOT NULL, "instructions" character varying, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_fees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryId" uuid NOT NULL, "inspectionFee" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d737e0ca7b9beefcb088ba5ab16" UNIQUE ("categoryId"), CONSTRAINT "PK_6b722d0f0d413a414221ae1516d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_documents_type_enum" AS ENUM('PROFILE_PHOTO', 'GOVERNMENT_ID', 'SELFIE_WITH_ID', 'TRADE_CERTIFICATE')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_documents_status_enum" AS ENUM('PENDING', 'UPLOADED')`);
        await queryRunner.query(`CREATE TABLE "kyc_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "professionalId" uuid NOT NULL, "type" "public"."kyc_documents_type_enum" NOT NULL, "fileUrl" character varying NOT NULL, "status" "public"."kyc_documents_status_enum" NOT NULL DEFAULT 'UPLOADED', "reviewedAt" TIMESTAMP WITH TIME ZONE, "reviewedBy" uuid, "rejectionReason" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_02e49877f1578e6285f84e57ab6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "professional_availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "professionalId" uuid NOT NULL, "dayOfWeek" integer NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "acceptUrgentNightCallouts" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8818df994a1402ddb19fd54f77b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "professional_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "professionalId" uuid NOT NULL, "serviceId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0a792d3d12548bf1ae788f55654" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."professionals_verificationstatus_enum" AS ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "professionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "bio" text, "yearsOfExperience" integer NOT NULL DEFAULT '0', "verificationStatus" "public"."professionals_verificationstatus_enum" NOT NULL DEFAULT 'PENDING', "isAvailable" boolean NOT NULL DEFAULT false, "latitude" numeric(9,6), "longitude" numeric(9,6), "location" geography(Point,4326), "serviceRadiusKm" integer NOT NULL DEFAULT '10', "rating" numeric(3,2) NOT NULL DEFAULT '0', "reviewCount" integer NOT NULL DEFAULT '0', "responseTimeMinutes" integer, "noShowCount" integer NOT NULL DEFAULT '0', "bankCode" character varying, "bankAccountNumber" character varying, "bankAccountName" character varying, "paystackRecipientCode" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6104e0ee835d83143d5cbae2b1a" UNIQUE ("userId"), CONSTRAINT "PK_d7dc8473b49fcd938def2799387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."services_pricingmodel_enum" AS ENUM('FIXED', 'STARTING_FROM', 'QUOTE_REQUIRED', 'HOURLY')`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryId" uuid NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "pricingModel" "public"."services_pricingmodel_enum" NOT NULL, "startingPrice" numeric(10,2), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_pricingmodel_enum"`);
        await queryRunner.query(`DROP TABLE "professionals"`);
        await queryRunner.query(`DROP TYPE "public"."professionals_verificationstatus_enum"`);
        await queryRunner.query(`DROP TABLE "professional_services"`);
        await queryRunner.query(`DROP TABLE "professional_availability"`);
        await queryRunner.query(`DROP TABLE "kyc_documents"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_documents_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_documents_type_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "category_fees"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }
}