-- AlterTable
ALTER TABLE "ApartmentTrade" ADD COLUMN     "sggNm" TEXT;

-- CreateIndex
CREATE INDEX "ApartmentTrade_dealDate_idx" ON "ApartmentTrade"("dealDate");

-- CreateIndex
CREATE INDEX "ApartmentTrade_sggCd_idx" ON "ApartmentTrade"("sggCd");
