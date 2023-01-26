/*
  Warnings:

  - Added the required column `upadted_at` to the `archives` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_user_id_fkey";

-- DropForeignKey
ALTER TABLE "spreads" DROP CONSTRAINT "spreads_document_id_fkey";

-- AlterTable
ALTER TABLE "archives" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "upadted_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreads" ADD CONSTRAINT "spreads_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
