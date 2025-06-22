"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import {
  Search,
  Building,
  DollarSign,
  TrendingUp,
  BarChart as BarChartIcon,
  ChevronLeft,
  Filter,
  MapPin,
  AreaChart,
  Target,
  Home,
  Star,
  Loader2,
  ChevronRight,
  Info,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

// UI 컴포넌트 정의 (shadcn/ui 대체)
const Card = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void; }) => (
  <div onClick={onClick} className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>{children}</div>
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
const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);
const Button = ({ children, onClick, className, variant, size, disabled }: { children: React.ReactNode; onClick?: () => void; className?: string; variant?: string; size?: string; disabled?: boolean; }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : 'bg-blue-600 text-white hover:bg-blue-700'}
      ${size === 'icon' ? 'h-10 w-10' : 'px-4 py-2'}
      ${className}`}
  >
    {children}
  </button>
);
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const OGTooltip = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const TooltipContent = ({ children }: { children: React.ReactNode }) => <div className="text-xs bg-black text-white p-2 rounded-md shadow-lg my-1">{children}</div>;

// API 응답 타입 정의
interface Trade {
  id: string;
  dealAmount: string;
  aptName: string;
  excluUseAr: number;
  floor: number;
  sggNm: string;
  umdNm: string;
}

interface Recommendations {
  [grade: string]: Trade[];
}

// 아파트 추천을 가져오는 API 함수
const fetchRecommendations = async (budget: number): Promise<Recommendations> => {
  const { data } = await axios.get(`/api/apartments/recommendations?budget=${budget}`);
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
  const [budget, setBudget] = useState('');
  const [submittedBudget, setSubmittedBudget] = useState<number | null>(null);

  const { data, isLoading, error, isFetching } = useQuery<Recommendations, Error>({
    queryKey: ['recommendations', submittedBudget],
    queryFn: () => fetchRecommendations(submittedBudget!),
    enabled: !!submittedBudget, // submittedBudget이 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (budget) {
      setSubmittedBudget(Number(budget) * 10000); // 만원 단위를 원 단위로 변경
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">신혼부부 맞춤 아파트 찾기</h1>
        <p className="text-lg text-gray-600">예산을 입력하고 우리에게 딱 맞는 보금자리를 찾아보세요.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="예산을 입력하세요 (만원)"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
            required
          />
          <button
            type="submit"
            disabled={isLoading || isFetching}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading || isFetching ? '찾는 중...' : '매물 검색'}
          </button>
        </form>
      </div>

      <main className="mt-12">
        {error && <p className="text-center text-red-500">오류가 발생했습니다: {error.message}</p>}
        
        {(isLoading || isFetching) && (
          <div className="text-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
             <p className="mt-4 text-gray-600">최적의 아파트를 찾고 있습니다...</p>
          </div>
        )}

        {data && Object.keys(data).length === 0 && !isLoading && !isFetching && (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-700 text-xl">😥</p>
            <p className="text-gray-700 text-xl mt-4">아쉽지만 해당 예산으로 추천할만한 아파트가 없습니다.</p>
            <p className="text-gray-500 mt-2">예산을 조금 더 높여서 검색해보세요.</p>
          </div>
        )}

        {data && Object.keys(data).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(data).map(([grade, apartments]) => (
              <div key={grade} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <h2 className="bg-gray-800 text-white text-xl font-bold p-4 text-center">{grade}</h2>
                <ul className="divide-y divide-gray-200">
                  {apartments.map((apt) => (
                    <li key={apt.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <p className="font-bold text-lg text-blue-700">{apt.aptName}</p>
                      <p className="text-sm text-gray-600">{apt.umdNm}, {apt.sggNm}</p>
                      <div className="flex justify-between items-baseline mt-2">
                        <p className="text-gray-800">{apt.excluUseAr.toFixed(2)}㎡ ({Math.round(apt.excluUseAr / 3.3058)}평) / {apt.floor}층</p>
                        <p className="font-semibold text-xl text-gray-900">{formatPrice(apt.dealAmount)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
