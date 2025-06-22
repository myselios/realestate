-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "buildYear" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "jibunAddress" TEXT NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusRoute" (
    "id" SERIAL NOT NULL,
    "routeNumber" TEXT NOT NULL,
    "routeType" TEXT,
    "startPoint" TEXT,
    "endPoint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusStop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stopId" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "regionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusStopRoute" (
    "busStopId" INTEGER NOT NULL,
    "busRouteId" INTEGER NOT NULL,

    CONSTRAINT "BusStopRoute_pkey" PRIMARY KEY ("busStopId","busRouteId")
);

-- CreateTable
CREATE TABLE "DevelopmentPlan" (
    "id" SERIAL NOT NULL,
    "planName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "regionId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" SERIAL NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "hospitalType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "regionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentAnalysis" (
    "id" TEXT NOT NULL,
    "totalInvestmentScore" INTEGER NOT NULL DEFAULT 0,
    "grade" INTEGER NOT NULL DEFAULT 0,
    "currentPrice" BIGINT,
    "pricePrediction_1y" BIGINT,
    "predictionSummary" TEXT,
    "apartmentId" TEXT NOT NULL,
    "lastAnalyzedAt" TIMESTAMP(3) NOT NULL,
    "accessibilityScore" INTEGER NOT NULL DEFAULT 0,
    "amenitiesScore" INTEGER NOT NULL DEFAULT 0,
    "marketScore" INTEGER NOT NULL DEFAULT 0,
    "pricePrediction_3y" BIGINT,
    "regionalDevScore" INTEGER NOT NULL DEFAULT 0,
    "supplyScore" INTEGER NOT NULL DEFAULT 0,
    "trendScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvestmentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketTrend" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "transactionVolume" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "constructionStarts" INTEGER NOT NULL,
    "permitsIssued" INTEGER NOT NULL,
    "priceIndex" DOUBLE PRECISION NOT NULL,
    "unsoldInventory" INTEGER NOT NULL,

    CONSTRAINT "MarketTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PopulationFlow" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "netMigration" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopulationFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateTransaction" (
    "id" TEXT NOT NULL,
    "tradeDate" TIMESTAMP(3) NOT NULL,
    "price" BIGINT NOT NULL,
    "floor" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealEstateTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "eupmyeondong" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "schoolType" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "studentCount" INTEGER,
    "foundingDate" TIMESTAMP(3),
    "regionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubwayLine" (
    "id" SERIAL NOT NULL,
    "lineNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "operator" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubwayLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubwayStation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stationCode" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isTransfer" BOOLEAN NOT NULL DEFAULT false,
    "lineId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubwayStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportationScore" (
    "id" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "nearestSubwayDistance" INTEGER,
    "nearestSubwayId" INTEGER,
    "subwayCount_500m" INTEGER NOT NULL DEFAULT 0,
    "subwayCount_1km" INTEGER NOT NULL DEFAULT 0,
    "busStopCount_300m" INTEGER NOT NULL DEFAULT 0,
    "busRouteCount" INTEGER NOT NULL DEFAULT 0,
    "totalTransportationScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "busStations" JSONB NOT NULL,
    "subwayStations" JSONB NOT NULL,

    CONSTRAINT "TransportationScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Apartment_regionId_idx" ON "Apartment"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_name_jibunAddress_key" ON "Apartment"("name", "jibunAddress");

-- CreateIndex
CREATE UNIQUE INDEX "BusRoute_routeNumber_key" ON "BusRoute"("routeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BusStop_stopId_key" ON "BusStop"("stopId");

-- CreateIndex
CREATE INDEX "DevelopmentPlan_regionId_idx" ON "DevelopmentPlan"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentAnalysis_apartmentId_key" ON "InvestmentAnalysis"("apartmentId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketTrend_year_month_regionId_key" ON "MarketTrend"("year", "month", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "PopulationFlow_year_month_regionId_key" ON "PopulationFlow"("year", "month", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_apartmentId_key" ON "Portfolio"("userId", "apartmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SubwayLine_name_key" ON "SubwayLine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubwayStation_name_lineId_key" ON "SubwayStation"("name", "lineId");

-- CreateIndex
CREATE UNIQUE INDEX "TransportationScore_apartmentId_key" ON "TransportationScore"("apartmentId");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStop" ADD CONSTRAINT "BusStop_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopRoute" ADD CONSTRAINT "BusStopRoute_busRouteId_fkey" FOREIGN KEY ("busRouteId") REFERENCES "BusRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopRoute" ADD CONSTRAINT "BusStopRoute_busStopId_fkey" FOREIGN KEY ("busStopId") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentPlan" ADD CONSTRAINT "DevelopmentPlan_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentAnalysis" ADD CONSTRAINT "InvestmentAnalysis_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketTrend" ADD CONSTRAINT "MarketTrend_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PopulationFlow" ADD CONSTRAINT "PopulationFlow_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstateTransaction" ADD CONSTRAINT "RealEstateTransaction_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubwayStation" ADD CONSTRAINT "SubwayStation_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "SubwayLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportationScore" ADD CONSTRAINT "TransportationScore_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportationScore" ADD CONSTRAINT "TransportationScore_nearestSubwayId_fkey" FOREIGN KEY ("nearestSubwayId") REFERENCES "SubwayStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
