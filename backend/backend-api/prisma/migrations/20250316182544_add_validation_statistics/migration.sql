-- CreateTable
CREATE TABLE "ValidationStatistics" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "employeeId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSuccessful" BOOLEAN NOT NULL,
    "similarity" DOUBLE PRECISION,

    CONSTRAINT "ValidationStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ValidationStatistics_organizationId_idx" ON "ValidationStatistics"("organizationId");

-- CreateIndex
CREATE INDEX "ValidationStatistics_employeeId_idx" ON "ValidationStatistics"("employeeId");

-- CreateIndex
CREATE INDEX "ValidationStatistics_timestamp_idx" ON "ValidationStatistics"("timestamp");

-- CreateIndex
CREATE INDEX "ValidationStatistics_isSuccessful_idx" ON "ValidationStatistics"("isSuccessful");

-- AddForeignKey
ALTER TABLE "ValidationStatistics" ADD CONSTRAINT "ValidationStatistics_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationStatistics" ADD CONSTRAINT "ValidationStatistics_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
