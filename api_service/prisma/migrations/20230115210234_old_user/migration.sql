/*
  Warnings:

  - You are about to drop the column `reference` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `usernameref` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "reference",
DROP COLUMN "usernameref";
