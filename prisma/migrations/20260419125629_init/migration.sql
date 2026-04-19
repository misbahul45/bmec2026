/*
  Warnings:

  - A unique constraint covering the columns `[competitionId,order]` on the table `Stage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Stage_order_key";

-- CreateIndex
CREATE UNIQUE INDEX "Stage_competitionId_order_key" ON "Stage"("competitionId", "order");
