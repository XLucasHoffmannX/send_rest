/*
  Warnings:

  - Added the required column `name` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MULTIPLE', 'PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT E'PUBLIC';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "origin" TEXT NOT NULL DEFAULT E'';
