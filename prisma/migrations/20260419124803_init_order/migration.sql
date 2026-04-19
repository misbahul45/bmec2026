/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Stage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Stage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stage_order_key" ON "Stage"("order");
