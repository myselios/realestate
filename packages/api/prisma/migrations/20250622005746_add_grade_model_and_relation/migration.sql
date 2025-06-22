/*
  Warnings:

  - You are about to drop the column `grade` on the `InvestmentAnalysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvestmentAnalysis" DROP COLUMN "grade";

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "gradeId" INTEGER;

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_level_key" ON "Grade"("level");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
