/*
  Warnings:

  - Added the required column `request` to the `Relations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Relations" ADD COLUMN     "request" "RequestStatus" NOT NULL;
