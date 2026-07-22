/*
  Warnings:

  - You are about to drop the column `users` on the `Rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rooms" DROP COLUMN "users";

-- CreateTable
CREATE TABLE "RoomMembers" (
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMembers_pkey" PRIMARY KEY ("roomId","userId")
);

-- AddForeignKey
ALTER TABLE "RoomMembers" ADD CONSTRAINT "RoomMembers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembers" ADD CONSTRAINT "RoomMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
