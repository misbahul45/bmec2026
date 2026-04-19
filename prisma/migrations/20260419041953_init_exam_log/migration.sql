-- CreateEnum
CREATE TYPE "ExamEventType" AS ENUM ('TAB_SWITCH', 'WINDOW_BLUR', 'WINDOW_FOCUS', 'COPY', 'PASTE', 'FULLSCREEN_EXIT', 'MULTIPLE_LOGIN', 'NETWORK_CHANGE', 'DEVTOOLS_OPEN');

-- AlterTable
ALTER TABLE "ExamAttempt" ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "ExamEventLog" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "type" "ExamEventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamEventLog_attemptId_idx" ON "ExamEventLog"("attemptId");

-- AddForeignKey
ALTER TABLE "ExamEventLog" ADD CONSTRAINT "ExamEventLog_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
