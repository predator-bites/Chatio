/*
  Warnings:

  - You are about to drop the column `author` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `userId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_author_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_author_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "author",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "author",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
