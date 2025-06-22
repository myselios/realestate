import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/apartments/trades
// Fetches apartment trades with pagination.
// Query params:
// - limit: number of records to return (default: 20)
// - page: page number for pagination (default: 1)
// - sggCd: optional sgg code to filter by
router.get('/trades', async (req, res) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const sggCd = req.query.sggCd as string | undefined;
  const skip = (page - 1) * limit;

  const where = sggCd ? { sggCd } : {};

  try {
    const trades = await prisma.apartmentTrade.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        dealDate: 'desc',
      },
    });

    const totalTrades = await prisma.apartmentTrade.count({ where });
    const totalPages = Math.ceil(totalTrades / limit);

    res.json({
      data: trades,
      meta: {
        page,
        limit,
        totalPages,
        totalRecords: totalTrades,
      },
    });
  } catch (error) {
    console.error('Failed to fetch apartment trades:', error);
    res.status(500).json({ message: 'Error fetching apartment trades' });
  }
});

// GET /api/apartments/recommendations
// Fetches apartment recommendations based on a budget range.
// Query params:
// - minBudget: the minimum budget
// - maxBudget: the maximum budget
router.get('/recommendations', async (req, res) => {
  const { minBudget, maxBudget } = req.query;

  if (!minBudget || !maxBudget) {
    return res.status(400).json({ message: 'minBudget and maxBudget are required query parameters.' });
  }

  try {
    const minBudgetBigInt = BigInt(minBudget as string);
    const maxBudgetBigInt = BigInt(maxBudget as string);

    // 1. 모든 급지 및 급지 정의를 한 번에 조회
    const grades = await prisma.grade.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    const allGradeDefinitions = await prisma.gradeDefinition.findMany();

    // gradeId를 키로 사용하는 맵으로 변환하여 조회 성능 향상
    const definitionsByGradeId = allGradeDefinitions.reduce((acc: Record<number, typeof allGradeDefinitions>, def: (typeof allGradeDefinitions)[0]) => {
      if (!acc[def.gradeId]) {
        acc[def.gradeId] = [];
      }
      acc[def.gradeId].push(def);
      return acc;
    }, {} as Record<number, typeof allGradeDefinitions>);

    const recommendations: Record<string, any> = {};

    // 2. 각 급지별로 예산에 맞는 대표 아파트 찾기
    for (const grade of grades) {
      // 3. 메모리에서 현재 급지에 속한 sggCd 목록 찾기
      const gradeDefinitions = definitionsByGradeId[grade.id] || [];
      const sggCds = gradeDefinitions.map((def: { sgg_cd: string }) => def.sgg_cd);
      const sggNmMap = new Map(gradeDefinitions.map((def: { sgg_cd: string, sgg_nm: string }) => [def.sgg_cd, def.sgg_nm]));

      if (sggCds.length === 0) {
        recommendations[grade.name] = null;
        continue;
      }

      // 4. 해당 sggCd 목록과 예산에 맞는 거래 중 최고가 거래 1건 조회
      const representativeTrade = await prisma.apartmentTrade.findFirst({
        where: {
          sggCd: {
            in: sggCds,
          },
          dealAmount: {
            gte: minBudgetBigInt,
            lte: maxBudgetBigInt,
          },
        },
        orderBy: {
          dealAmount: 'desc',
        },
      });

      // 5. 대표 거래가 있으면 결과에 추가, 없으면 null로 설정
      if (representativeTrade) {
        recommendations[grade.name] = {
          ...representativeTrade,
          dealAmount: representativeTrade.dealAmount.toString(),
          sggNm: sggNmMap.get(representativeTrade.sggCd) || '',
        };
      } else {
        recommendations[grade.name] = null;
      }
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

// GET /api/apartments/trends
// Fetches the price trend for a specific apartment over the last 2 years.
// Query params:
// - aptName: The name of the apartment
// - sggCd: The sgg code of the apartment's location
// - excluUseAr: The exclusive use area of the apartment
router.get('/trends', async (req, res) => {
  const { aptName, sggCd, excluUseAr } = req.query;

  if (!aptName || !sggCd || !excluUseAr) {
    return res
      .status(400)
      .json({ message: 'aptName, sggCd, and excluUseAr are required query parameters.' });
  }

  try {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const trends = await prisma.apartmentTrade.findMany({
      where: {
        aptName: aptName as string,
        sggCd: sggCd as string,
        excluUseAr: parseFloat(excluUseAr as string),
        dealDate: {
          gte: twoYearsAgo,
        },
      },
      orderBy: {
        dealDate: 'asc',
      },
      select: {
        dealDate: true,
        dealAmount: true,
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedTrends = trends.map((trade: { dealDate: Date; dealAmount: bigint }) => ({
      ...trade,
      dealAmount: trade.dealAmount.toString(),
    }));

    res.json(serializedTrends);
  } catch (error) {
    console.error('Failed to fetch apartment trends:', error);
    res.status(500).json({ message: 'Error fetching apartment trends' });
  }
});

export default router; 