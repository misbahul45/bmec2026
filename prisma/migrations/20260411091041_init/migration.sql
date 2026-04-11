/*
  Warnings:

  - You are about to drop the column `description` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Competition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_userId_fkey";

-- DropIndex
DROP INDEX "Registration_userId_key";

-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "userId",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_teamId_key" ON "Registration"("teamId");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
