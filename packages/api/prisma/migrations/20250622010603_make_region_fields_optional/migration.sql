/*
  Warnings:

  - You are about to drop the column `address` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `pricePrediction_3y` on the `InvestmentAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the `BusRoute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusStop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusStopRoute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DevelopmentPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hospital` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PopulationFlow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubwayLine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubwayStation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransportationScore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roadAddress` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusStop" DROP CONSTRAINT "BusStop_regionId_fkey";

-- DropForeignKey
ALTER TABLE "BusStopRoute" DROP CONSTRAINT "BusStopRoute_busRouteId_fkey";

-- DropForeignKey
ALTER TABLE "BusStopRoute" DROP CONSTRAINT "BusStopRoute_busStopId_fkey";

-- DropForeignKey
ALTER TABLE "DevelopmentPlan" DROP CONSTRAINT "DevelopmentPlan_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_regionId_fkey";

-- DropForeignKey
ALTER TABLE "MarketTrend" DROP CONSTRAINT "MarketTrend_regionId_fkey";

-- DropForeignKey
ALTER TABLE "PopulationFlow" DROP CONSTRAINT "PopulationFlow_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_regionId_fkey";

-- DropForeignKey
ALTER TABLE "SubwayStation" DROP CONSTRAINT "SubwayStation_lineId_fkey";

-- DropForeignKey
ALTER TABLE "TransportationScore" DROP CONSTRAINT "TransportationScore_apartmentId_fkey";

-- DropForeignKey
ALTER TABLE "TransportationScore" DROP CONSTRAINT "TransportationScore_nearestSubwayId_fkey";

-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roadAddress" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "InvestmentAnalysis" DROP COLUMN "pricePrediction_3y";

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "gradeId",
ALTER COLUMN "sigungu" DROP NOT NULL,
ALTER COLUMN "eupmyeondong" DROP NOT NULL;

-- DropTable
DROP TABLE "BusRoute";

-- DropTable
DROP TABLE "BusStop";

-- DropTable
DROP TABLE "BusStopRoute";

-- DropTable
DROP TABLE "DevelopmentPlan";

-- DropTable
DROP TABLE "Hospital";

-- DropTable
DROP TABLE "MarketTrend";

-- DropTable
DROP TABLE "PopulationFlow";

-- DropTable
DROP TABLE "School";

-- DropTable
DROP TABLE "SubwayLine";

-- DropTable
DROP TABLE "SubwayStation";

-- DropTable
DROP TABLE "TransportationScore";

-- CreateTable
CREATE TABLE "GradeDefinition" (
    "id" SERIAL NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "eupmyeondong" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GradeDefinition_gradeId_idx" ON "GradeDefinition"("gradeId");

-- CreateIndex
CREATE INDEX "RealEstateTransaction_apartmentId_idx" ON "RealEstateTransaction"("apartmentId");

-- AddForeignKey
ALTER TABLE "GradeDefinition" ADD CONSTRAINT "GradeDefinition_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
