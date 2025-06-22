import { PrismaClient } from '@prisma/client';
import axios from 'axios';
// import { parseStringPromise } from 'xml2js'; // No longer needed
import dotenv from 'dotenv';
import path from 'path';

// --- CONFIGURATION ---
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const prisma = new PrismaClient();
const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;

if (!PUBLIC_DATA_API_KEY) {
  throw new Error('PUBLIC_DATA_API_KEY is not set in the .env file.');
}

async function fetchTradesForMonth(sggCd: string, yearMonth: string) {
  const url = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade';
  try {
    const response = await axios.get(url, {
      params: {
        serviceKey: PUBLIC_DATA_API_KEY,
        pageNo: 1,
        numOfRows: 5000,
        LAWD_CD: sggCd,
        DEAL_YMD: yearMonth,
      },
      // Ensure axios does not try to parse JSON if the content-type is not set perfectly
      transformResponse: [data => {
        // The API sometimes returns a string that looks like JSON but isn't parsed
        // Or sometimes returns garbage. We try to parse it safely.
        try {
            return JSON.parse(data);
        } catch (e) {
            // console.warn(`Could not parse response for ${sggCd}/${yearMonth}. Data:`, data.substring(0, 100));
            return null;
        }
      }]
    });
    
    const items = response.data?.response?.body?.items?.item;

    if (!items) {
      return [];
    }

    return Array.isArray(items) ? items : [items];
  } catch (error: any) {
    if (error.response) {
      console.error(`  - API Error for ${sggCd}/${yearMonth}: Status ${error.response.status}`);
    } else {
      console.error(`  - Network or other error for ${sggCd}/${yearMonth}:`, error.message);
    }
    return [];
  }
}

function transformTradeData(tradeItem: any, sggCd: string, sggNm: string) {
  try {
    // API returns amount like "115,000". We convert it to a BigInt in won.
    const dealAmount = BigInt(tradeItem.dealAmount.replace(/,/g, '')) * 10000n;
    const dealYear = parseInt(tradeItem.dealYear, 10);
    const dealMonth = parseInt(tradeItem.dealMonth, 10);
    const dealDay = parseInt(tradeItem.dealDay, 10);

    if (isNaN(dealYear) || isNaN(dealMonth) || isNaN(dealDay)) {
      return null; // Skip if date is invalid
    }

    return {
      dealAmount: dealAmount,
      dealYear: dealYear,
      dealMonth: dealMonth,
      dealDay: dealDay,
      dealDate: new Date(dealYear, dealMonth - 1, dealDay),
      aptName: tradeItem.aptNm,
      buildYear: parseInt(tradeItem.buildYear, 10),
      floor: parseInt(tradeItem.floor, 10),
      excluUseAr: parseFloat(tradeItem.excluUseAr),
      jibun: String(tradeItem.jibun).trim(),
      sggCd: sggCd,
      sggNm: sggNm,
      umdNm: tradeItem.umdNm,
    };
  } catch (transformError) {
    console.warn(`  - Warning: Skipping a trade record due to a data parsing error. Record:`, tradeItem);
    return null;
  }
}

async function main() {
  const YEAR_TO_SEED = 2024;
  console.log(`--- 🏠 Starting Apartment Trade Data Seeding for ${YEAR_TO_SEED} ---`);

  // 1. Get all SGG codes from our Grade Definitions
  const gradeDefs = await prisma.gradeDefinition.findMany({
    select: { sgg_cd: true, sgg_nm: true },
  });
  console.log(`- Found ${gradeDefs.length} SGGs to process for Seoul & Gyeonggi-do.`);

  // 2. Loop through each SGG and each month of 2024
  let totalTradesSaved = 0;
  for (const [index, def] of gradeDefs.entries()) {
    console.log(`\n[${index + 1}/${gradeDefs.length}] Processing ${def.sgg_nm} (${def.sgg_cd})...`);
    for (let month = 1; month <= 12; month++) {
      const dealYmd = `${YEAR_TO_SEED}${String(month).padStart(2, '0')}`;
      process.stdout.write(`  - Fetching for ${dealYmd}... `);

      const tradesFromApi = await fetchTradesForMonth(def.sgg_cd, dealYmd);

      if (tradesFromApi.length === 0) {
        process.stdout.write('0 items found. Skipping.\n');
        continue;
      }
      
      const tradesToCreate = tradesFromApi
        .map(tradeItem => transformTradeData(tradeItem, def.sgg_cd, def.sgg_nm));

      if (tradesToCreate.length > 0) {
        const result = await prisma.apartmentTrade.createMany({
          data: tradesToCreate as any, // Cast to any to avoid type issues with BigInt
          skipDuplicates: true,
        });
        totalTradesSaved += result.count;
        process.stdout.write(`${result.count} items saved.\n`);
      } else {
        process.stdout.write('0 valid items to save. Skipping.\n');
      }

      // API rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n--- ✅ Seeding Complete! Total of ${totalTradesSaved} trade records saved. ---`);
}

main()
  .catch((e) => {
    console.error('\n--- ❌ An unexpected error occurred during the seeding process ---');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });