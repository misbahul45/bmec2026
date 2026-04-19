-- AlterTable
ALTER TABLE "team" ADD COLUMN     "currentStageId" TEXT;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_currentStageId_fkey" FOREIGN KEY ("currentStageId") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
