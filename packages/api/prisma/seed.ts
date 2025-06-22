import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// --- CONFIGURATION ---
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const prisma = new PrismaClient();

const LEGAL_DONG_API_KEY = process.env.LEGAL_DONG_API_KEY;
if (!LEGAL_DONG_API_KEY) {
  throw new Error("LEGAL_DONG_API_KEY is not set in the .env file.");
}

// --- MAIN SEEDING LOGIC ---
async function main() {
  console.log("🚀 Starting the full seeding process...");
  await seedRegions();
  await seedGradesAndDefinitions();
  console.log("✅ Full seeding process completed successfully.");
}

async function seedGradesAndDefinitions() {
  console.log("\\n🎓 Starting to seed Grade and GradeDefinition data based on the final classification...");

  // 1. Clean up old data
  console.log("  - Deleting old grade data to ensure a clean state...");
  await prisma.gradeDefinition.deleteMany({});
  await prisma.grade.deleteMany({});
  console.log("  ✅ Old grade data deleted.");

  // 2. Create new Grade master data
  console.log("  - Creating/updating Grade master data (1-4)...");
  const grade1 = await prisma.grade.upsert({ where: { name: "1급지" }, update: {}, create: { name: "1급지" } });
  const grade2 = await prisma.grade.upsert({ where: { name: "2급지" }, update: {}, create: { name: "2급지" } });
  const grade3 = await prisma.grade.upsert({ where: { name: "3급지" }, update: {}, create: { name: "3급지" } });
  const grade4 = await prisma.grade.upsert({ where: { name: "4급지" }, update: {}, create: { name: "4급지" } });
  console.log("  ✅ Grade master data created.");

  // 3. Prepare the definitions based on the final table
  console.log("  - Preparing GradeDefinition data...");
  const gradeDefinitionsData = [
    // 1급지 (6개)
    { sgg_cd: '11680', sgg_nm: '서울특별시 강남구', sido_nm: '서울특별시', gradeId: grade1.id },
    { sgg_cd: '11650', sgg_nm: '서울특별시 서초구', sido_nm: '서울특별시', gradeId: grade1.id },
    { sgg_cd: '41290', sgg_nm: '경기도 과천시', sido_nm: '경기도', gradeId: grade1.id },
    { sgg_cd: '11170', sgg_nm: '서울특별시 용산구', sido_nm: '서울특별시', gradeId: grade1.id },
    { sgg_cd: '11710', sgg_nm: '서울특별시 송파구', sido_nm: '서울특별시', gradeId: grade1.id },
    { sgg_cd: '11200', sgg_nm: '서울특별시 성동구', sido_nm: '서울특별시', gradeId: grade1.id },

    // 2급지 (15개)
    { sgg_cd: '11440', sgg_nm: '서울특별시 마포구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11215', sgg_nm: '서울특별시 광진구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11470', sgg_nm: '서울특별시 양천구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11110', sgg_nm: '서울특별시 종로구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11740', sgg_nm: '서울특별시 강동구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11590', sgg_nm: '서울특별시 동작구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '41135', sgg_nm: '경기도 성남시 분당구', sido_nm: '경기도', gradeId: grade2.id },
    { sgg_cd: '11560', sgg_nm: '서울특별시 영등포구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11140', sgg_nm: '서울특별시 중구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '41131', sgg_nm: '경기도 성남시 수정구', sido_nm: '경기도', gradeId: grade2.id },
    { sgg_cd: '11410', sgg_nm: '서울특별시 서대문구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11230', sgg_nm: '서울특별시 동대문구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '11500', sgg_nm: '서울특별시 강서구', sido_nm: '서울특별시', gradeId: grade2.id },
    { sgg_cd: '41210', sgg_nm: '경기도 광명시', sido_nm: '경기도', gradeId: grade2.id },
    { sgg_cd: '41450', sgg_nm: '경기도 하남시', sido_nm: '경기도', gradeId: grade2.id },

    // 3급지 (16개)
    { sgg_cd: '41133', sgg_nm: '경기도 성남시 중원구', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '11290', sgg_nm: '서울특별시 성북구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '11620', sgg_nm: '서울특별시 관악구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '11380', sgg_nm: '서울특별시 은평구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '41173', sgg_nm: '경기도 안양시 동안구', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '11530', sgg_nm: '서울특별시 구로구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '11350', sgg_nm: '서울특별시 노원구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '41430', sgg_nm: '경기도 의왕시', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '41465', sgg_nm: '경기도 용인시 수지구', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '11260', sgg_nm: '서울특별시 중랑구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '41117', sgg_nm: '경기도 수원시 영통구', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '41310', sgg_nm: '경기도 구리시', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '11305', sgg_nm: '서울특별시 강북구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '11545', sgg_nm: '서울특별시 금천구', sido_nm: '서울특별시', gradeId: grade3.id },
    { sgg_cd: '41171', sgg_nm: '경기도 안양시 만안구', sido_nm: '경기도', gradeId: grade3.id },
    { sgg_cd: '41115', sgg_nm: '경기도 수원시 팔달구', sido_nm: '경기도', gradeId: grade3.id },
    
    // 4급지 (32개)
    { sgg_cd: '11320', sgg_nm: '서울특별시 도봉구', sido_nm: '서울특별시', gradeId: grade4.id },
    { sgg_cd: '41192', sgg_nm: '경기도 부천시 원미구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41194', sgg_nm: '경기도 부천시 소사구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41281', sgg_nm: '경기도 고양시 덕양구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41590', sgg_nm: '경기도 화성시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41410', sgg_nm: '경기도 군포시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41111', sgg_nm: '경기도 수원시 장안구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41273', sgg_nm: '경기도 안산시 단원구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41463', sgg_nm: '경기도 용인시 기흥구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41113', sgg_nm: '경기도 수원시 권선구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41285', sgg_nm: '경기도 고양시 일산동구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41360', sgg_nm: '경기도 남양주시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41570', sgg_nm: '경기도 김포시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41390', sgg_nm: '경기도 시흥시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41196', sgg_nm: '경기도 부천시 오정구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41271', sgg_nm: '경기도 안산시 상록구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41610', sgg_nm: '경기도 광주시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41287', sgg_nm: '경기도 고양시 일산서구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41461', sgg_nm: '경기도 용인시 처인구', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41150', sgg_nm: '경기도 의정부시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41480', sgg_nm: '경기도 파주시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41370', sgg_nm: '경기도 오산시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41220', sgg_nm: '경기도 평택시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41830', sgg_nm: '경기도 양평군', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41820', sgg_nm: '경기도 가평군', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41250', sgg_nm: '경기도 동두천시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41550', sgg_nm: '경기도 안성시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41670', sgg_nm: '경기도 여주시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41800', sgg_nm: '경기도 연천군', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41500', sgg_nm: '경기도 이천시', sido_nm: '경기도', gradeId: grade4.id },
    { sgg_cd: '41650', sgg_nm: '경기도 포천시', sido_nm: '경기도', gradeId: grade4.id },
  ];

  // 4. Insert the new definitions
  console.log(`  - Inserting ${gradeDefinitionsData.length} new grade definitions...`);
  const result = await prisma.gradeDefinition.createMany({
    data: gradeDefinitionsData,
    skipDuplicates: true, // This shouldn't be necessary with the cleanup, but good practice.
  });

  console.log(`  ✅ Inserted ${result.count} new grade definitions.`);
  console.log("✅ Successfully seeded Grade and GradeDefinition data.");
}

async function seedRegions() {
  console.log("🏙️ Starting to seed Region data...");
  const BATCH_SIZE = 1000;
  let allRegions: any[] = [];
  let pageNo = 1;
  let totalCount = 0;

  try {
    const existingRegionsCount = await prisma.region.count();
    if (existingRegionsCount > 20000) { // Check if data is likely fully seeded
      console.log(`✅ Region data already seems to be seeded (${existingRegionsCount} records). Skipping.`);
      return;
    }

    do {
      console.log(`- Fetching page ${pageNo}...`);
      const response = await axios.get("https://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList", {
        params: {
          serviceKey: LEGAL_DONG_API_KEY,
          pageNo: pageNo,
          numOfRows: BATCH_SIZE,
          type: "json",
        },
      });

      const items = response.data?.StanReginCd?.[1]?.row;
      const head = response.data?.StanReginCd?.[0]?.head;

      if (!items || items.length === 0) {
        console.log("No more region data found. Breaking loop.");
        break;
      }

      if (pageNo === 1 && head && head[0]?.totalCount) {
        totalCount = head[0].totalCount;
        console.log(`Total regions to fetch: ${totalCount}`);
      }

      allRegions.push(...items);
      console.log(`  Fetched ${items.length} items. Total so far: ${allRegions.length}`);

      if (totalCount > 0 && allRegions.length >= totalCount) {
        console.log("Fetched all regions. Exiting loop.");
        break;
      }

      pageNo++;
      await new Promise(resolve => setTimeout(resolve, 200));

    } while (true);


    console.log(`🌱 Total regions fetched: ${allRegions.length}. Preparing to create in DB...`);
    
    const regionsToCreate = allRegions
      .filter((item: any) => item.region_cd)
      .map((item: any) => {
        return {
          region_cd: item.region_cd,
          sido_cd: item.sido_cd,
          sgg_cd: item.sgg_cd,
          umd_cd: item.umd_cd,
          ri_cd: item.ri_cd,
          locatjumin_cd: item.locatjumin_cd,
          locatjijuk_cd: item.locatjijuk_cd,
          locatadd_nm: item.locatadd_nm,
          locat_order: item.locat_order ? parseInt(item.locat_order, 10) : null,
          locat_rm: item.locat_rm,
          locathigh_cd: item.locathigh_cd,
          locallow_nm: item.locallow_nm,
          adpt_de: item.adpt_de,
        };
      });
    
    // Clear existing data before seeding to prevent partial states
    if(existingRegionsCount > 0) {
      console.log("Clearing partially seeded regions...");
      await prisma.region.deleteMany({});
    }

    console.log(`📦 Inserting ${regionsToCreate.length} valid regions into the database...`);
    const insertBatchSize = 1000;
    for (let i = 0; i < regionsToCreate.length; i += insertBatchSize) {
      const batch = regionsToCreate.slice(i, i + insertBatchSize);
      await prisma.region.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(`  -> Inserted batch ${i / insertBatchSize + 1}`);
    }

    console.log("✅ Successfully seeded Region data.");
  } catch (error: any) {
    console.error("❌ Error seeding Region data:", error.response?.data?.StanReginCd || error.message);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
