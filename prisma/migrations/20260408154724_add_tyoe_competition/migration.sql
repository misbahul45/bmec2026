/*
  Warnings:

  - Added the required column `competitionType` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('OLIMPIADE', 'LKTI', 'INFOGRAFIS');

-- AlterTable
ALTER TABLE "team" ADD COLUMN     "competitionType" "CompetitionType" NOT NULL;
