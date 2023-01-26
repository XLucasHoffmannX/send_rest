/*
  Warnings:

  - Added the required column `user_owner` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "user_owner" TEXT NOT NULL;
