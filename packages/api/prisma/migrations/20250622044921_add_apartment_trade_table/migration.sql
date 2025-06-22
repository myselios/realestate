-- CreateTable
CREATE TABLE "ApartmentTrade" (
    "id" TEXT NOT NULL,
    "dealAmount" BIGINT NOT NULL,
    "dealYear" INTEGER NOT NULL,
    "dealMonth" INTEGER NOT NULL,
    "dealDay" INTEGER NOT NULL,
    "dealDate" TIMESTAMP(3) NOT NULL,
    "aptName" TEXT NOT NULL,
    "buildYear" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "excluUseAr" DOUBLE PRECISION NOT NULL,
    "jibun" TEXT NOT NULL,
    "sggCd" TEXT NOT NULL,
    "umdNm" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApartmentTrade_pkey" PRIMARY KEY ("id")
);
