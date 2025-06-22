/*
  Warnings:

  - You are about to drop the column `sggNm` on the `ApartmentTrade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApartmentTrade" DROP COLUMN "sggNm";

-- CreateIndex
CREATE INDEX "ApartmentTrade_dealAmount_idx" ON "ApartmentTrade"("dealAmount");
