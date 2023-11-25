/*
  Warnings:

  - The `id42` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "users_id42_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "id42",
ADD COLUMN     "id42" INTEGER;
