/*
  Warnings:

  - You are about to drop the `Relations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Relations" DROP CONSTRAINT "Relations_hasRelationsId_fkey";

-- DropForeignKey
ALTER TABLE "Relations" DROP CONSTRAINT "Relations_isInRelationsId_fkey";

-- DropTable
DROP TABLE "Relations";

-- DropEnum
DROP TYPE "RelationStatus";

-- CreateTable
CREATE TABLE "Friend" (
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("userId","friendId")
);

-- CreateTable
CREATE TABLE "Blocked" (
    "userId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("userId","blockedId")
);

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
