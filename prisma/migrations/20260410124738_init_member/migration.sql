/*
  Warnings:

  - A unique constraint covering the columns `[nis]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_nis_key" ON "Member"("nis");
