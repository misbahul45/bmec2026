/*
  Warnings:

  - You are about to drop the column `studentId` on the `Member` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Member_studentId_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "studentId";
