/*
  Warnings:

  - A unique constraint covering the columns `[name,competitionId]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Batch_name_competitionId_key" ON "Batch"("name", "competitionId");
