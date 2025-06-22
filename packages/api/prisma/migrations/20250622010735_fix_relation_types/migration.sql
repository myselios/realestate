/*
  Warnings:

  - You are about to drop the column `roadAddress` on the `Apartment` table. All the data in the column will be lost.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `latitude` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Region` table. All the data in the column will be lost.
  - Added the required column `address` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Apartment" DROP CONSTRAINT "Apartment_regionId_fkey";

-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "roadAddress",
ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "regionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Region" DROP CONSTRAINT "Region_pkey",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Region_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Region_id_seq";

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
