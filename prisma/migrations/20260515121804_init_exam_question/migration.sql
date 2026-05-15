/*
  Warnings:

  - You are about to drop the column `evalScore` on the `ExamQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `ExamQuestion` table. All the data in the column will be lost.
  - Added the required column `correctScore` to the `ExamQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emptyScore` to the `ExamQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrongScore` to the `ExamQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "ExamQuestion" DROP COLUMN "evalScore",
DROP COLUMN "score",
ADD COLUMN     "correctScore" INTEGER NOT NULL,
ADD COLUMN     "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "emptyScore" INTEGER NOT NULL,
ADD COLUMN     "wrongScore" INTEGER NOT NULL;
