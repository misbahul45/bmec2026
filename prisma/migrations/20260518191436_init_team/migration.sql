-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_teamId_fkey";

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
