/*
  Warnings:

  - You are about to drop the `AbstractSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AbstractSubmission" DROP CONSTRAINT "AbstractSubmission_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "AbstractSubmission" DROP CONSTRAINT "AbstractSubmission_teamId_fkey";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "abstractUrl" TEXT;

-- DropTable
DROP TABLE "AbstractSubmission";
