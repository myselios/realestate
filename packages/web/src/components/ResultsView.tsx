"use client";

import React from "react";
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
import {
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import type { Apartment } from "./NewlywedApartmentClient";

interface ResultsViewProps {
  filteredApartments: Apartment[];
  userInput: { budget: number };
  onSelectApartment: (apartment: Apartment) => void;
  onNavigateToDetail: () => void;
  onBackToSearch: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  filteredApartments,
  userInput,
  onSelectApartment,
  onNavigateToDetail,
  onBackToSearch,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            예산 {(userInput.budget / 10000).toFixed(1)}억원 맞춤 추천 결과
          </h1>
          <p className="text-gray-600 mt-2">
            투자가치 순으로 정렬된 {filteredApartments.length}개 아파트
          </p>
        </div>
        <button
          onClick={onBackToSearch}
          className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <Search className="w-4 h-4 mr-2" />
          다시 검색
        </button>
      </div>

      {/* 추천 아파트들의 가격 트렌드 비교 차트 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          추천 아파트 3년 실거래가 추이 비교
        </h2>
        <div className="mb-4 text-sm text-gray-600">
          최근 3년간 실거래가 변화를 통해 각 아파트의 상승/하락 패턴을
          확인하세요
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="category"
              allowDuplicatedCategory={false}
            />
            <YAxis
              domain={["dataMin - 2000", "dataMax + 2000"]}
              label={{
                value: "실거래가(만원)",
                angle: -90,
                position: "insideLeft",
              }}
              tickFormatter={(value) => `${(value / 10000).toFixed(1)}억`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${(value / 10000).toFixed(1)}억원`,
                name,
              ]}
              labelFormatter={(label: string) => `${label}`}
            />
            <Legend />

            {filteredApartments.length > 0 && (
              <Line
                type="monotone"
                dataKey="price"
                data={[
                  { date: "2022-01", price: 38000 },
                  { date: "2022-04", price: 39200 },
                  { date: "2022-07", price: 41500 },
                  { date: "2022-10", price: 43200 },
                  { date: "2023-01", price: 42800 },
                  { date: "2023-04", price: 41900 },
                  { date: "2023-07", price: 43500 },
                  { date: "2023-10", price: 45200 },
                  { date: "2024-01", price: 46800 },
                  { date: "2024-04", price: 47200 },
                  { date: "2024-06", price: 48000 },
                ]}
                stroke="#3B82F6"
                strokeWidth={3}
                name={filteredApartments[0]?.name}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
            )}

            {filteredApartments.length > 1 && (
              <Line
                type="monotone"
                dataKey="price"
                data={[
                  { date: "2022-01", price: 32000 },
                  { date: "2022-04", price: 33500 },
                  { date: "2022-07", price: 35200 },
                  { date: "2022-10", price: 36800 },
                  { date: "2023-01", price: 36200 },
                  { date: "2023-04", price: 35500 },
                  { date: "2023-07", price: 37200 },
                  { date: "2023-10", price: 38900 },
                  { date: "2024-01", price: 40200 },
                  { date: "2024-04", price: 41500 },
                  { date: "2024-06", price: 42000 },
                ]}
                stroke="#10B981"
                strokeWidth={3}
                name={filteredApartments[1]?.name}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              />
            )}

            {filteredApartments.length > 2 && (
              <Line
                type="monotone"
                dataKey="price"
                data={[
                  { date: "2022-01", price: 35000 },
                  { date: "2022-04", price: 37200 },
                  { date: "2022-07", price: 39800 },
                  { date: "2022-10", price: 42500 },
                  { date: "2023-01", price: 41800 },
                  { date: "2023-04", price: 40200 },
                  { date: "2023-07", price: 42800 },
                  { date: "2023-10", price: 44200 },
                  { date: "2024-01", price: 45800 },
                  { date: "2024-04", price: 44700 },
                  { date: "2024-06", price: 45000 },
                ]}
                stroke="#F59E0B"
                strokeWidth={3}
                name={filteredApartments[2]?.name}
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* 차트 분석 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="font-semibold text-blue-900">
                {filteredApartments[0]?.name.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
            <div className="text-sm text-blue-800">
              <div>
                3년 상승률: <span className="font-bold">+26.3%</span>
              </div>
              <div>
                연평균: <span className="font-bold">+8.1%</span>
              </div>
              <div className="text-xs mt-1">꾸준한 상승세, 안정적 투자처</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="font-semibold text-green-900">
                {filteredApartments[1]?.name.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
            <div className="text-sm text-green-800">
              <div>
                3년 상승률: <span className="font-bold">+31.3%</span>
              </div>
              <div>
                연평균: <span className="font-bold">+9.4%</span>
              </div>
              <div className="text-xs mt-1">높은 상승률, 성장 잠재력</div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="font-semibold text-yellow-900">
                {filteredApartments[2]?.name.split(" ").slice(0, 3).join(" ")}
              </span>
            </div>
            <div className="text-sm text-yellow-800">
              <div>
                3년 상승률: <span className="font-bold">+28.6%</span>
              </div>
              <div>
                연평균: <span className="font-bold">+8.7%</span>
              </div>
              <div className="text-xs mt-1">변동성 있음, 타이밍 중요</div>
            </div>
          </div>
        </div>

        {/* 신혼부부 맞춤 해석 */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-600" />
            💕 신혼부부 투자 가이드
          </h3>
          <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-blue-600">• 안정형 투자:</span>
              <span className="ml-1">
                래미안 분당센트럴파크처럼 꾸준한 상승세를 보이는 아파트
              </span>
            </div>
            <div>
              <span className="font-medium text-green-600">• 수익형 투자:</span>
              <span className="ml-1">
                힐스테이트 광교처럼 높은 상승률을 기록한 아파트
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredApartments.map((apt, index) => (
          <div
            key={apt.id}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 ${
              index === 0
                ? "border-yellow-400 ring-2 ring-yellow-100"
                : "border-gray-200"
            }`}
            onClick={() => onSelectApartment(apt)}
          >
            {index === 0 && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-t-xl">
                <div className="flex items-center justify-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="font-semibold">BEST 추천</span>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {apt.name}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{apt.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {apt.investmentScore}
                  </div>
                  <div className="text-xs text-gray-500">투자점수</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">현재 시세</span>
                  <span className="text-xl font-bold">
                    {(apt.price / 10000).toFixed(1)}억원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">3개월 변동</span>
                  <span
                    className={`font-semibold flex items-center ${
                      apt.priceChange > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {apt.priceChange > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {apt.priceChange > 0 ? "+" : ""}
                    {apt.priceChange}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">교통</div>
                  <div className="font-semibold">
                    {apt.features.transportation}/100
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">학군</div>
                  <div className="font-semibold">
                    {apt.features.education}/100
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">개발호재</div>
                  <div className="font-semibold">
                    {apt.features.development}/100
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">브랜드</div>
                  <div className="font-semibold">{apt.features.brand}/100</div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectApartment(apt);
                  onNavigateToDetail();
                }}
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                상세 분석 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView;
