"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Payload } from 'recharts/types/component/DefaultLegendContent';
import { useQuery, useQueries } from "@tanstack/react-query";
import axios from 'axios';

// UI 컴포넌트 정의 (shadcn/ui 대체)
const Card = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
  <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>{children}</div>
);
const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

// API 응답 타입 정의
interface Trade {
  id: string;
  dealAmount: string;
  aptName: string;
  excluUseAr: number;
  floor: number;
  sggNm: string;
  umdNm: string;
  sggCd: string;
}

interface Recommendations {
  [grade: string]: Trade;
}

interface TrendData {
  dealDate: string;
  dealAmount: string;
}

// 아파트 추천을 가져오는 API 함수
const fetchRecommendations = async (range: { min: number; max: number }): Promise<Recommendations> => {
  const { data } = await axios.get(`/api/apartments/recommendations`, {
    params: {
      minBudget: range.min,
      maxBudget: range.max,
    },
  });
  return data;
};

// 아파트 시세 추이를 가져오는 API 함수
const fetchApartmentTrend = async (apt: Trade): Promise<TrendData[]> => {
  const { data } = await axios.get(`/api/apartments/trends`, {
    params: {
      aptName: apt.aptName,
      sggCd: apt.sggCd,
      excluUseAr: apt.excluUseAr,
    },
  });
  return data;
};

// 숫자 포맷 함수 (예: 100000000 -> 1억)
const formatPrice = (price: string) => {
  const value = BigInt(price);
  const eok = value / 100000000n;
  const man = (value % 100000000n) / 10000n;
  if (man === 0n) {
    return `${eok}억`;
  }
  return `${eok}억 ${man.toLocaleString()}만원`;
};

export default function HomePage() {
  const [selectedBudget, setSelectedBudget] = useState('7');
  const [submittedRange, setSubmittedRange] = useState<{ min: number; max: number } | null>(null);
  const [lineOpacity, setLineOpacity] = useState<{ [key: string]: number }>({});

  const { data: recommendations, isLoading: isLoadingRecs, error: errorRecs, isFetching: isFetchingRecs } = useQuery<Recommendations, Error>({
    queryKey: ['recommendations', submittedRange],
    queryFn: () => fetchRecommendations(submittedRange!),
    enabled: !!submittedRange,
    staleTime: 1000 * 60 * 5,
  });

  const recommendedAptsWithGrade = useMemo(() => {
    if (!recommendations) return [];
    return Object.entries(recommendations)
      .filter(([, apt]) => apt !== null)
      .map(([grade, apt]) => ({ grade, apt: apt! }));
  }, [recommendations]);

  const trendResults = useQueries({
    queries: recommendedAptsWithGrade.map(({ apt }) => ({
      queryKey: ['trend', apt.aptName, apt.sggCd, apt.excluUseAr],
      queryFn: () => fetchApartmentTrend(apt),
      enabled: !!recommendations,
    })),
  });

  const isLoadingTrends = trendResults.some(result => result.isLoading);

  useEffect(() => {
    if (recommendedAptsWithGrade.length > 0) {
      const initialOpacity: { [key: string]: number } = {};
      recommendedAptsWithGrade.forEach(({ grade, apt }) => {
        const seriesName = `${grade}_${apt.aptName}`;
        initialOpacity[seriesName] = 1;
      });
      setLineOpacity(initialOpacity);
    }
  }, [recommendedAptsWithGrade]);

  const chartData = useMemo(() => {
    if (isLoadingTrends || trendResults.some(r => !r.data)) return [];

    const seriesData: { [key: string]: { [dateKey: string]: number } } = {};
    const dateObjects = new Map<string, Date>();

    trendResults.forEach((result, index) => {
      const trends = result.data;
      if (!trends) return;
      const { grade, apt } = recommendedAptsWithGrade[index];
      const seriesName = `${grade}_${apt.aptName}`;
      seriesData[seriesName] = {};

      trends.forEach((d: TrendData) => {
        const dealDate = new Date(d.dealDate);
        // 월별로 그룹화하기 위한 키 (e.g., "2024-5")
        const monthKey = `${dealDate.getFullYear()}-${dealDate.getMonth()}`;
        
        if (!dateObjects.has(monthKey)) {
          // 정렬을 위해 각 월의 1일로 Date 객체를 저장
          dateObjects.set(monthKey, new Date(dealDate.getFullYear(), dealDate.getMonth(), 1));
        }

        // 같은 달에 여러 거래가 있을 경우, 마지막 거래로 덮어씀
        seriesData[seriesName][monthKey] = Number(d.dealAmount) / 100000000; // 억원 단위
      });
    });

    const sortedMonthKeys = Array.from(dateObjects.keys()).sort(
      (a, b) => dateObjects.get(a)!.getTime() - dateObjects.get(b)!.getTime(),
    );

    return sortedMonthKeys.map((monthKey) => {
      const entry: { date: string; [key: string]: any } = {
        date: dateObjects.get(monthKey)!.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' }),
      };
      Object.keys(seriesData).forEach((seriesName) => {
        entry[seriesName] = seriesData[seriesName][monthKey] || null;
      });
      return entry;
    });
  }, [trendResults, recommendedAptsWithGrade, isLoadingTrends]);
  
  const lineColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];
  const budgetOptions = Array.from({ length: 9 }, (_, i) => 7 + i); // 7..15

  const handleLegendMouseEnter = (o: Payload) => {
    const { dataKey } = o;
    if (!dataKey) return;

    const newOpacity = recommendedAptsWithGrade.reduce((acc, { grade, apt }) => {
      const seriesName = `${grade}_${apt.aptName}`;
      acc[seriesName] = seriesName === dataKey ? 1 : 0.2;
      return acc;
    }, {} as { [key: string]: number });
    setLineOpacity(newOpacity);
  };

  const handleLegendMouseLeave = () => {
    const newOpacity = recommendedAptsWithGrade.reduce((acc, { grade, apt }) => {
      const seriesName = `${grade}_${apt.aptName}`;
      acc[seriesName] = 1;
      return acc;
    }, {} as { [key: string]: number });
    setLineOpacity(newOpacity);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selected = Number(selectedBudget);
    const min = selected * 100000000;
    const max = min + 99999999;
    setSubmittedRange({ min, max });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">신혼부부 맞춤 아파트 찾기</h1>
        <p className="text-lg text-gray-600">예산을 입력하고 우리에게 딱 맞는 보금자리를 찾아보세요.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 bg-white"
          >
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}억원대
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isLoadingRecs || isFetchingRecs}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoadingRecs || isFetchingRecs ? '찾는 중...' : '매물 검색'}
          </button>
        </form>
      </div>

      <main className="mt-12">
        {(isLoadingRecs || isFetchingRecs) && (
          <div className="text-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
             <p className="mt-4 text-gray-600">최적의 아파트를 찾고 있습니다...</p>
          </div>
        )}

        {isLoadingTrends && submittedRange && (
           <div className="text-center my-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
             <p className="mt-2 text-gray-500">추천 아파트의 시세 추이를 불러오는 중...</p>
           </div>
        )}

        {chartData.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>추천 아파트 2년 시세 추이 (단위: 억원)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}억원` : value)} />
                  <Legend onMouseEnter={handleLegendMouseEnter} onMouseLeave={handleLegendMouseLeave} />
                  {recommendedAptsWithGrade.map(({ grade, apt }, index) => {
                     const seriesName = `${grade}_${apt.aptName}`;
                     return (
                      <Line 
                        key={seriesName} 
                        type="monotone" 
                        dataKey={seriesName} 
                        name={`${grade} | ${apt.aptName}`} 
                        stroke={lineColors[index % lineColors.length]} 
                        connectNulls
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        strokeOpacity={lineOpacity[seriesName]}
                      />
                     );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {errorRecs && <p className="text-center text-red-500">오류가 발생했습니다: {errorRecs.message}</p>}
        
        {recommendations && Object.keys(recommendations).length === 0 && !isLoadingRecs && !isFetchingRecs && (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-700 text-xl">😥</p>
            <p className="text-gray-700 text-xl mt-4">아쉽지만 해당 예산 범위로 추천할만한 아파트가 없습니다.</p>
            <p className="text-gray-500 mt-2">예산 범위를 조금 더 높여서 검색해보세요.</p>
          </div>
        )}

        {recommendations && Object.keys(recommendations).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(recommendations).map(([grade, apt]) => (
              <div key={grade} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <h2 className="bg-gray-800 text-white text-xl font-bold p-4 text-center">{grade}</h2>
                {apt ? (
                  <div className="p-4">
                    <p className="font-bold text-lg text-blue-700">{apt.aptName}</p>
                    <p className="text-sm text-gray-600">{apt.umdNm}, {apt.sggNm}</p>
                    <div className="flex justify-between items-baseline mt-2">
                      <p className="text-gray-800">{apt.excluUseAr.toFixed(2)}㎡ ({Math.round(apt.excluUseAr / 3.3058)}평) / {apt.floor}층</p>
                      <p className="font-semibold text-xl text-gray-900">{formatPrice(apt.dealAmount)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 h-full flex flex-col justify-center items-center text-center text-gray-500">
                    <p className="text-4xl mb-2">🤔</p>
                    <p>해당 예산 범위의<br/>추천 매물이 없습니다.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
