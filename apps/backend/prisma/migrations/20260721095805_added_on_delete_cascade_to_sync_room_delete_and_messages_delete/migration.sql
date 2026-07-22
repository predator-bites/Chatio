-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
