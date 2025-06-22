/*
  Warnings:

  - You are about to drop the column `code` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `eupmyeondong` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `sido` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `sigungu` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the `Apartment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradeDefinition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvestmentAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RealEstateTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[region_cd]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locatadd_nm` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region_cd` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Apartment" DROP CONSTRAINT "Apartment_regionId_fkey";

-- DropForeignKey
ALTER TABLE "GradeDefinition" DROP CONSTRAINT "GradeDefinition_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "InvestmentAnalysis" DROP CONSTRAINT "InvestmentAnalysis_apartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_apartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "RealEstateTransaction" DROP CONSTRAINT "RealEstateTransaction_apartmentId_fkey";

-- DropIndex
DROP INDEX "Region_code_key";

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "code",
DROP COLUMN "eupmyeondong",
DROP COLUMN "sido",
DROP COLUMN "sigungu",
ADD COLUMN     "adpt_de" TEXT,
ADD COLUMN     "locallow_nm" TEXT,
ADD COLUMN     "locat_order" INTEGER,
ADD COLUMN     "locat_rm" TEXT,
ADD COLUMN     "locatadd_nm" TEXT NOT NULL,
ADD COLUMN     "locathigh_cd" TEXT,
ADD COLUMN     "locatjijuk_cd" TEXT,
ADD COLUMN     "locatjumin_cd" TEXT,
ADD COLUMN     "region_cd" TEXT NOT NULL,
ADD COLUMN     "ri_cd" TEXT,
ADD COLUMN     "sgg_cd" TEXT,
ADD COLUMN     "sido_cd" TEXT,
ADD COLUMN     "umd_cd" TEXT;

-- DropTable
DROP TABLE "Apartment";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "GradeDefinition";

-- DropTable
DROP TABLE "InvestmentAnalysis";

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "RealEstateTransaction";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "Region_region_cd_key" ON "Region"("region_cd");
