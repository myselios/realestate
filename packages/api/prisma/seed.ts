import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

// Load .env.local from the project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const prisma = new PrismaClient();

const API_KEY = process.env.PUBLIC_DATA_API_KEY;
const API_BASE_URL =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";

interface ApiItem {
  dealAmount: string;
  buildYear: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  dong: string;
  apartmentName: string;
  areaForExclusiveUse: string;
  jibun: string;
  floor: string;
  regionalCode: string;
  sido?: string; // Add sido as optional
}

interface XmlDealItem {
  거래금액: string;
  건축년도: string;
  년: string;
  월: string;
  일: string;
  법정동: string;
  아파트: string;
  전용면적: string;
  지번: string;
  층: string;
  지역코드: string;
}

const regionalCodes = [
  { name: "서울", code: "11110" },
  { name: "서울", code: "11140" },
  { name: "서울", code: "11170" },
  { name: "서울", code: "11200" },
  { name: "서울", code: "11215" },
  { name: "서울", code: "11230" },
  { name: "서울", code: "11260" },
  { name: "서울", code: "11290" },
  { name: "서울", code: "11305" },
  { name: "서울", code: "11320" },
  { name: "서울", code: "11350" },
  { name: "서울", code: "11380" },
  { name: "서울", code: "11410" },
  { name: "서울", code: "11440" },
  { name: "서울", code: "11470" },
  { name: "서울", code: "11500" },
  { name: "서울", code: "11530" },
  { name: "서울", code: "11545" },
  { name: "서울", code: "11560" },
  { name: "서울", code: "11590" },
  { name: "서울", code: "11620" },
  { name: "서울", code: "11650" },
  { name: "서울", code: "11680" },
  { name: "서울", code: "11710" },
  { name: "서울", code: "11740" },
  { name: "경기", code: "41110" },
  { name: "경기", code: "41130" },
  { name: "경기", code: "41150" },
  { name: "경기", code: "41170" },
  { name: "경기", code: "41190" },
  { name: "경기", code: "41210" },
  { name: "경기", code: "41220" },
  { name: "경기", code: "41250" },
  { name: "경기", code: "41270" },
  { name: "경기", code: "41280" },
  { name: "경기", code: "41290" },
  { name: "경기", code: "41310" },
  { name: "경기", code: "41360" },
  { name: "경기", code: "41370" },
  { name: "경기", code: "41390" },
  { name: "경기", code: "41410" },
  { name: "경기", code: "41430" },
  { name: "경기", code: "41450" },
  { name: "경기", code: "41460" },
  { name: "경기", code: "41480" },
  { name: "경기", code: "41500" },
  { name: "경기", code: "41550" },
  { name: "경기", code: "41570" },
  { name: "경기", code: "41590" },
  { name: "경기", code: "41610" },
  { name: "경기", code: "41630" },
  { name: "경기", code: "41650" },
  { name: "경기", code: "41670" },
  { name: "경기", code: "41800" },
  { name: "경기", code: "41820" },
  { name: "경기", code: "41830" },
];

async function fetchDealsForMonth(
  regionCode: string,
  dealYmd: string
): Promise<ApiItem[]> {
  const url = `${API_BASE_URL}?serviceKey=${API_KEY}&LAWD_CD=${regionCode}&DEAL_YMD=${dealYmd}&numOfRows=1000`;

  try {
    const response = await fetch(url, { timeout: 30000 });
    if (!response.ok) {
      console.error(
        `[API ERROR] for ${regionCode}/${dealYmd}: HTTP error! status: ${response.status}`
      );
      return [];
    }
    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      textNodeName: "_text",
      parseAttributeValue: true,
      trimValues: true,
      tagValueProcessor: (tagName, tagValue) => {
        if (tagName === "거래금액") return tagValue.replace(/,/g, "").trim();
        return tagValue;
      },
    });
    const result = parser.parse(xmlData);

    if (!result || !result.response || !result.response.header) {
      console.error(
        `[API ERROR] for ${regionCode}/${dealYmd}: Invalid or empty XML response.`
      );
      return [];
    }

    if (result.response.header.resultCode !== "00") {
      console.error(
        `[API ERROR] for ${regionCode}/${dealYmd}: ${result.response.header.resultMsg} (Code: ${result.response.header.resultCode})`
      );
      return [];
    }

    if (!result.response.body.items || !result.response.body.items.item) {
      return [];
    }

    let items = result.response.body.items.item;
    if (!Array.isArray(items)) {
      items = [items];
    }

    return items.map(
      (item: XmlDealItem): ApiItem => ({
        dealAmount: item.거래금액,
        buildYear: item.건축년도,
        dealYear: item.년,
        dealMonth: item.월,
        dealDay: item.일,
        dong: item.법정동,
        apartmentName: item.아파트,
        areaForExclusiveUse: item.전용면적,
        jibun: item.지번,
        floor: item.층,
        regionalCode: item.지역코드,
        sido: regionCode,
      })
    );
  } catch (error) {
    console.error(`Error fetching data for ${regionCode} - ${dealYmd}:`, error);
    return [];
  }
}

async function main() {
  console.log("Starting data seeding (stable mode)...");

  if (!API_KEY) {
    console.error("ERROR: PUBLIC_DATA_API_KEY is not set in .env.local file.");
    return;
  }

  const startYear = 2015;
  const endYear = 2023;

  for (let year = startYear; year <= endYear; year++) {
    console.log(`--- Processing year ${year} ---`);
    const allDealsForYear: ApiItem[] = [];

    for (let month = 1; month <= 12; month++) {
      const dealYmd = `${year}${String(month).padStart(2, "0")}`;
      console.log(
        `Fetching data for ${year}-${String(month).padStart(2, "0")}...`
      );

      for (const region of regionalCodes) {
        const deals = await fetchDealsForMonth(region.code, dealYmd);
        if (deals.length > 0) {
          allDealsForYear.push(...deals);
        }
        // Add a small delay to avoid overwhelming the API server
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    console.log(
      `Fetched a total of ${allDealsForYear.length} deals for ${year}.`
    );

    if (allDealsForYear.length === 0) {
      console.log(`No new deals found for ${year}. Skipping.`);
      continue;
    }

    // --- Database Operations for the year ---
    console.log(`Processing database operations for ${year}...`);

    console.log("Upserting regions...");
    const regionData = regionalCodes.map((r) => ({
      id: parseInt(r.code, 10),
      name: r.name,
    }));

    await prisma.region.createMany({
      data: regionData,
      skipDuplicates: true,
    });
    console.log("Regions upserted.");

    console.log("Processing apartments...");
    const apartments = allDealsForYear
      .map((deal) => {
        if (!deal.apartmentName || !deal.regionalCode || !deal.jibun)
          return null;
        return {
          name: deal.apartmentName,
          regionId: parseInt(deal.regionalCode, 10),
          jibunAddress: deal.jibun,
          buildYear: parseInt(deal.buildYear, 10) || 0,
        };
      })
      .filter(
        (
          apt
        ): apt is {
          name: string;
          regionId: number;
          jibunAddress: string;
          buildYear: number;
        } => apt !== null
      );

    const uniqueApartments = Array.from(
      new Map(
        apartments.map(
          (apt: {
            name: string;
            regionId: number;
            jibunAddress: string;
            buildYear: number;
          }) => [`${apt.name}-${apt.regionId}-${apt.jibunAddress}`, apt]
        )
      ).values()
    );

    await prisma.apartment.createMany({
      data: uniqueApartments,
      skipDuplicates: true,
    });
    console.log(
      `${uniqueApartments.length} unique apartments processed for ${year}.`
    );

    console.log("Retrieving apartment IDs from DB...");
    const dbApartments = await prisma.apartment.findMany({
      select: { id: true, name: true, regionId: true, jibunAddress: true },
    });
    const apartmentIdMap = new Map(
      dbApartments.map(
        (apt: {
          id: number;
          name: string;
          regionId: number;
          jibunAddress: string;
        }) => [`${apt.name}-${apt.regionId}-${apt.jibunAddress}`, apt.id]
      )
    );

    console.log(`Retrieved ${dbApartments.length} apartment IDs.`);

    console.log("Processing and inserting transactions...");
    const transactions = allDealsForYear
      .map((deal) => {
        const apartmentId = apartmentIdMap.get(
          `${deal.apartmentName}-${parseInt(deal.regionalCode, 10)}-${
            deal.jibun
          }`
        );

        if (!apartmentId) {
          return null;
        }

        const dealDate = new Date(
          parseInt(deal.dealYear, 10),
          parseInt(deal.dealMonth, 10) - 1,
          parseInt(deal.dealDay, 10)
        );

        const dealAmountStr = deal.dealAmount?.replace(/,/g, "").trim();
        if (!dealAmountStr) return null;

        return {
          apartmentId: apartmentId,
          dealAmount: parseInt(dealAmountStr, 10),
          dealDate: dealDate,
          area: parseFloat(deal.areaForExclusiveUse),
          floor: parseInt(deal.floor, 10),
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    if (transactions.length > 0) {
      await prisma.transaction.createMany({
        data: transactions,
        skipDuplicates: true,
      });
      console.log(
        `Inserted ${transactions.length} new transactions for ${year}.`
      );
    } else {
      console.log(`No new transactions to insert for ${year}.`);
    }

    console.log(`--- Finished processing for year ${year} ---`);
  }

  console.log("\nData seeding finished successfully for all years.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
