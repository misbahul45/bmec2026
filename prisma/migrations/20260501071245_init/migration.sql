/*
  Warnings:

  - A unique constraint covering the columns `[title,stageId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exam_title_stageId_key" ON "Exam"("title", "stageId");
