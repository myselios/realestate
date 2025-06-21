import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";
import path from "path";

// Load .env.local from the project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const prisma = new PrismaClient();

const API_KEY = process.env.PUBLIC_DATA_API_KEY;
const API_BASE_URL =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";

const REGION_CODES = {
  서울: [
    "11110",
    "11140",
    "11170",
    "11200",
    "11215",
    "11230",
    "11260",
    "11290",
    "11305",
    "11320",
    "11350",
    "11380",
    "11410",
    "11440",
    "11470",
    "11500",
    "11530",
    "11545",
    "11560",
    "11590",
    "11620",
    "11650",
    "11680",
    "11710",
    "11740",
  ],
  경기: [
    "41110",
    "41130",
    "41150",
    "41170",
    "41190",
    "41210",
    "41220",
    "41250",
    "41270",
    "41280",
    "41290",
    "41310",
    "41360",
    "41370",
    "41390",
    "41410",
    "41430",
    "41450",
    "41460",
    "41480",
    "41500",
    "41550",
    "41570",
    "41590",
    "41610",
    "41630",
    "41650",
    "41670",
    "41800",
    "41820",
    "41830",
  ],
};

// Helper for concurrent execution with a limit
async function runWithConcurrency<T, R>(
  tasks: T[],
  asyncFn: (task: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  let current = 0;

  while (current < tasks.length) {
    const batch = tasks.slice(current, current + concurrency);
    const promises = batch.map(asyncFn);
    results.push(...(await Promise.all(promises)));
    current += concurrency;
    if (current < tasks.length) {
      console.log(`Batch processed. Waiting 1 second before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return results;
}

async function fetchDeals(regionCode: string, dealYmd: string) {
  const sido =
    Object.keys(REGION_CODES).find((key) =>
      REGION_CODES[key as keyof typeof REGION_CODES].includes(regionCode)
    ) || "Unknown";
  const url = `${API_BASE_URL}?serviceKey=${API_KEY}&LAWD_CD=${regionCode}&DEAL_YMD=${dealYmd}`;

  try {
    const response = await axios.get(url, {
      headers: { Accept: "application/xml" },
    });
    const xml = response.data;
    const result = await parseStringPromise(xml, {
      explicitArray: true,
      emptyTag: () => [],
    });

    const responseBody = result.response?.body?.[0];
    if (
      !responseBody ||
      !responseBody.items ||
      responseBody.items[0] === "" ||
      !responseBody.items[0].item
    ) {
      return { items: [], sido };
    }

    const items = responseBody.items[0].item;

    return { items, sido };
  } catch (error) {
    console.error(`Error fetching data for ${regionCode} - ${dealYmd}:`, error);
    return { items: [], sido };
  }
}

async function main() {
  console.log("Starting data seeding (high-performance mode)...");

  if (!API_KEY) {
    console.error("ERROR: PUBLIC_DATA_API_KEY is not set in .env.local file.");
    return;
  }

  // 1. Generate all tasks (API calls to make)
  const tasks: { regionCode: string; dealYmd: string }[] = [];
  const startYear = 2015;
  const endYear = 2025;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const dealYmd = `${year}${String(month).padStart(2, "0")}`;
      for (const codes of Object.values(REGION_CODES)) {
        for (const code of codes) {
          tasks.push({ regionCode: code, dealYmd });
        }
      }
    }
  }

  console.log(
    `Generated ${tasks.length} API call tasks from ${startYear} to ${endYear}.`
  );

  // 2. Fetch all data concurrently
  console.log("Fetching all deal data from API...");
  const fetchResults = await runWithConcurrency(
    tasks,
    (task) => fetchDeals(task.regionCode, task.dealYmd),
    10
  );

  const allDeals: any[] = [];
  for (const result of fetchResults) {
    if (result && result.items) {
      result.items.forEach((item: any) => {
        allDeals.push({ ...item, sido: result.sido });
      });
    }
  }

  console.log(`Fetched a total of ${allDeals.length} deals.`);
  if (allDeals.length === 0) {
    console.log("No deals found. Exiting.");
    return;
  }

  // 3. Process and insert Regions
  console.log("Upserting regions...");
  const regionDataMap = new Map();
  for (const deal of allDeals) {
    const code = deal["지역코드"]?.[0];
    const dong = deal["법정동"]?.[0];

    if (code && dong && !regionDataMap.has(code)) {
      const dongTrimmed = dong.trim();
      regionDataMap.set(code, {
        code: code,
        sido: deal.sido,
        sigungu: dongTrimmed.split(" ")[0] || "",
        eupmyeondong: dongTrimmed,
      });
    }
  }
  const regionUpsertPromises = Array.from(regionDataMap.values()).map(
    (r: any) =>
      prisma.region.upsert({
        where: { code: r.code },
        update: {},
        create: r,
      })
  );
  await Promise.all(regionUpsertPromises);
  console.log(`Upserted ${regionDataMap.size} regions.`);

  const regionsFromDb = await prisma.region.findMany();
  const regionIdMap = new Map(regionsFromDb.map((r) => [r.code, r.id]));

  // 4. Process and insert Apartments
  console.log("Processing apartments...");
  const apartmentDataMap = new Map();
  for (const deal of allDeals) {
    const name = deal["아파트"]?.[0]?.trim();
    const jibun = deal["지번"]?.[0]?.trim();
    const buildYearStr = deal["건축년도"]?.[0];
    const sggCode = deal["지역코드"]?.[0];
    const dong = deal["법정동"]?.[0]?.trim();

    if (!name || !jibun || !buildYearStr || !sggCode || !dong) {
      continue; // Skip malformed deal data
    }

    const key = `${name}|${jibun}`;

    if (!apartmentDataMap.has(key)) {
      const regionId = regionIdMap.get(sggCode);
      if (!regionId) continue; // Should not happen

      apartmentDataMap.set(key, {
        name,
        jibunAddress: jibun,
        address: `${deal.sido} ${dong} ${jibun}`,
        buildYear: parseInt(buildYearStr),
        regionId: regionId,
        latitude: 0,
        longitude: 0,
      });
    }
  }

  const apartmentsToCreate = Array.from(apartmentDataMap.values());
  console.log(
    `Found ${apartmentsToCreate.length} unique apartments. Inserting into DB...`
  );
  await prisma.apartment.createMany({
    data: apartmentsToCreate,
    skipDuplicates: true,
  });
  console.log("Finished inserting apartments.");

  // 5. Retrieve inserted apartments to get their IDs
  console.log("Retrieving apartment IDs from DB...");
  const whereConditions = apartmentsToCreate.map((apt: any) => ({
    name: apt.name,
    jibunAddress: apt.jibunAddress,
  }));
  const allApartments = await prisma.apartment.findMany({
    where: { OR: whereConditions.length > 0 ? whereConditions : undefined },
    select: { id: true, name: true, jibunAddress: true },
  });

  const apartmentIdMap = new Map(
    allApartments.map((apt: any) => [`${apt.name}|${apt.jibunAddress}`, apt.id])
  );
  console.log(`Retrieved ${apartmentIdMap.size} apartment IDs.`);

  // 6. Process and insert Transactions
  console.log("Processing and inserting transactions...");
  const transactionsToCreate: any[] = [];
  for (const deal of allDeals) {
    const name = deal["아파트"]?.[0]?.trim();
    const jibun = deal["지번"]?.[0]?.trim();

    const dealYear = deal["년"]?.[0];
    const dealMonth = deal["월"]?.[0];
    const dealDay = deal["일"]?.[0];
    const dealAmount = deal["거래금액"]?.[0];
    const floor = deal["층"]?.[0];
    const area = deal["전용면적"]?.[0];

    if (
      !name ||
      !jibun ||
      !dealYear ||
      !dealMonth ||
      !dealDay ||
      !dealAmount ||
      !floor ||
      !area
    ) {
      continue; // Skip malformed deal data
    }

    const aptKey = `${name}|${jibun}`;
    const apartmentId = apartmentIdMap.get(aptKey);

    if (apartmentId) {
      transactionsToCreate.push({
        apartmentId: apartmentId,
        tradeDate: new Date(`${dealYear}-${dealMonth}-${dealDay}`),
        price: BigInt(dealAmount.replace(/,/g, "").trim()) * 10000n,
        floor: parseInt(floor),
        area: parseFloat(area),
      });
    }
  }

  if (transactionsToCreate.length > 0) {
    console.log(`Inserting ${transactionsToCreate.length} transactions...`);
    await prisma.realEstateTransaction.createMany({
      data: transactionsToCreate,
      skipDuplicates: true, // In case the exact same transaction is fetched twice
    });
    console.log("Finished inserting transactions.");
  } else {
    console.log("No new transactions to insert.");
  }

  console.log("Data seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("An unhandled error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
