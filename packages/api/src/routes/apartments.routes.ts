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
// Fetches apartment recommendations based on a budget.
// Query params:
// - budget: the maximum budget
router.get('/recommendations', async (req, res) => {
  const { budget } = req.query;

  if (!budget) {
    return res.status(400).json({ message: 'Budget is a required query parameter.' });
  }

  try {
    const budgetBigInt = BigInt(budget as string);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // 1. 예산에 맞는 최근 1년간의 거래를 조회
    const trades = await prisma.apartmentTrade.findMany({
      where: {
        dealAmount: {
          lte: budgetBigInt,
        },
        dealDate: {
          gte: oneYearAgo,
        },
      },
      select: {
        id: true,
        aptName: true,
        excluUseAr: true,
        floor: true,
        dealAmount: true,
        umdNm: true,
        sggCd: true,
      },
      distinct: ['aptName', 'sggCd', 'umdNm', 'jibun'],
      orderBy: {
        dealAmount: 'desc',
      },
      take: 500, // 더 많은 후보군 확보
    });

    // 2. 거래 데이터의 sggCd를 기반으로 GradeDefinition 정보를 가져옴
    const sggCds = [...new Set(trades.map(t => t.sggCd))];
    const gradeDefinitions = await prisma.gradeDefinition.findMany({
      where: {
        sggCd: {
          in: sggCds,
        },
      },
      include: {
        grade: true,
      },
    });

    const sggToGradeMap = new Map<string, { gradeName: string; sggNm: string }>();
    gradeDefinitions.forEach(def => {
      sggToGradeMap.set(def.sggCd, { gradeName: def.grade.name, sggNm: def.sggNm });
    });
    
    // 3. 거래 정보와 급지 정보를 결합하고, 급지별로 그룹화
    const recommendations: Record<string, any[]> = {};
    for (const apt of trades) {
      const gradeInfo = sggToGradeMap.get(apt.sggCd);
      if (gradeInfo) {
        if (!recommendations[gradeInfo.gradeName]) {
          recommendations[gradeInfo.gradeName] = [];
        }
        if (recommendations[gradeInfo.gradeName].length < 10) {
           recommendations[gradeInfo.gradeName].push({
             ...apt,
             sggNm: gradeInfo.sggNm, // sggNm 추가
           });
        }
      }
    }

    // 4. 급지 순서대로 정렬
    const sortedRecommendations = Object.fromEntries(
      Object.entries(recommendations).sort((a, b) => a[0].localeCompare(b[0]))
    );

    res.json(sortedRecommendations);
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

export default router; 