/*
  Warnings:

  - You are about to drop the column `RelationType` on the `Relations` table. All the data in the column will be lost.
  - Added the required column `relationType` to the `Relations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'BANNED';

-- AlterTable
ALTER TABLE "Relations" DROP COLUMN "RelationType",
ADD COLUMN     "relationType" "RelationStatus" NOT NULL;
