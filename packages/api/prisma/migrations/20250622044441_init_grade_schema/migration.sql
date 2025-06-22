-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeDefinition" (
    "id" SERIAL NOT NULL,
    "sgg_cd" TEXT NOT NULL,
    "sgg_nm" TEXT NOT NULL,
    "sido_nm" TEXT NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "kaptCode" TEXT NOT NULL,
    "kaptName" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "buildYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentAnalysis" (
    "id" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "grade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_name_key" ON "Grade"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GradeDefinition_sgg_cd_key" ON "GradeDefinition"("sgg_cd");

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_kaptCode_key" ON "Apartment"("kaptCode");

-- AddForeignKey
ALTER TABLE "GradeDefinition" ADD CONSTRAINT "GradeDefinition_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentAnalysis" ADD CONSTRAINT "InvestmentAnalysis_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
