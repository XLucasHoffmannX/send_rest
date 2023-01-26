/*
  Warnings:

  - Added the required column `user_reference` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_reference" TEXT NOT NULL;
