-- CreateTable
CREATE TABLE "File" (
    "url" TEXT NOT NULL,
    "fileId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "File_fileId_key" ON "File"("fileId");

-- CreateIndex
CREATE INDEX "File_url_idx" ON "File"("url");
