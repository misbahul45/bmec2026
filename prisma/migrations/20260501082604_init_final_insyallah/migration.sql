/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "team" ADD COLUMN     "sourceInfo" TEXT;

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_teamId_key" ON "Mentor"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
