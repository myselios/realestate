"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import {
  MapPin,
  Home,
  Train,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Heart,
} from "lucide-react";
import type { Apartment } from "./NewlywedApartmentClient"; // Import the type

interface DetailViewProps {
  apartment: Apartment;
}

const DetailView: React.FC<DetailViewProps> = ({ apartment }) => {
  const radarData = [
    { factor: "교통", score: apartment.features.transportation },
    { factor: "학군", score: apartment.features.education },
    { factor: "공급", score: apartment.features.supply },
    { factor: "개발", score: apartment.features.development },
    { factor: "브랜드", score: apartment.features.brand },
    { factor: "관심도", score: apartment.features.community },
  ];

  const priceData = [
    { year: "현재", price: apartment.price / 10000 },
    { year: "1년후", price: apartment.prediction.year1 / 10000 },
    { year: "3년후", price: apartment.prediction.year3 / 10000 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{apartment.name}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{apartment.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-600">
            {apartment.investmentScore}
          </div>
          <div className="text-gray-500">종합 투자점수</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 투자점수 레이더 차트 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">투자 요인별 점수</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="factor" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="점수"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 가격 예측 차트 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            가격 예측 (신뢰도: {apartment.prediction.confidence}%)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                label={{
                  value: "가격(억원)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [`${value.toFixed(1)}억원`, "예상가격"];
                  }
                  return [value, "예상가격"];
                }}
              />
              <Bar dataKey="price" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              +
              {(
                ((apartment.prediction.year3 - apartment.price) /
                  apartment.price) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-gray-500">3년 예상 수익률</div>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-blue-600" />
            단지 정보
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">준공년도</span>
              <span className="font-medium">
                {apartment.details.constructionYear}년
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">총 세대수</span>
              <span className="font-medium">
                {apartment.details.totalUnits.toLocaleString()}세대
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">최고층수</span>
              <span className="font-medium">
                {apartment.details.maxFloor}층
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">주차비율</span>
              <span className="font-medium">
                {apartment.details.parking}대/세대
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시공사</span>
              <span className="font-medium">{apartment.details.builder}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Train className="w-5 h-5 mr-2 text-green-600" />
            교통 & 인프라
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">지하철</span>
              <div className="font-medium">
                {apartment.details.nearestStation}
              </div>
            </div>
            <div>
              <span className="text-gray-600">학교</span>
              <div className="font-medium text-sm">
                {apartment.details.schools}
              </div>
            </div>
            <div>
              <span className="text-gray-600">병원</span>
              <div className="font-medium text-sm">
                {apartment.details.hospitals}
              </div>
            </div>
            <div>
              <span className="text-gray-600">상업시설</span>
              <div className="font-medium text-sm">
                {apartment.details.facilities}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
            최근 실거래가
          </h3>
          <div className="space-y-3">
            {apartment.transactions.map(
              (tx: Apartment["transactions"][number], index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{tx.date}</div>
                    <div className="text-sm text-gray-600">
                      {tx.area} {tx.floor}층
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {(tx.price / 10000).toFixed(1)}억
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 신혼부부 특화 분석 */}
      <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-pink-600" />
          💕 신혼부부 맞춤 분석
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              투자 강점
            </h4>
            <ul className="space-y-1 text-sm">
              <li>• 신분당선 연장 수혜로 교통 접근성 개선 예정</li>
              <li>• 분당 명문 학군으로 교육 환경 우수</li>
              <li>• 삼성물산 브랜드로 재매각 시 프리미엄 기대</li>
              <li>• 대형병원 접근 용이로 임신/출산 안심</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              주의사항
            </h4>
            <ul className="space-y-1 text-sm">
              <li>• 대단지로 공급 물량이 많아 급격한 상승 제한적</li>
              <li>• 높은 관리비 부담 (약 15만원/월)</li>
              <li>• 신혼부부 대출 한도 내 매수 가능</li>
              <li>• 주변 신규 공급 모니터링 필요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
