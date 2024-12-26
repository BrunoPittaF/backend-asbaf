/*
  Warnings:

  - You are about to drop the column `userId` on the `Relatives` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `Relatives` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Relatives" DROP CONSTRAINT "Relatives_userId_fkey";

-- AlterTable
ALTER TABLE "Relatives" DROP COLUMN "userId",
ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "userCpf" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Relatives" ADD CONSTRAINT "Relatives_userCpf_fkey" FOREIGN KEY ("userCpf") REFERENCES "User"("cpf") ON DELETE SET NULL ON UPDATE CASCADE;
