/*
  Warnings:

  - You are about to drop the column `nis` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Member_nis_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "nis",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_studentId_key" ON "Member"("studentId");
