"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { Search, MapPin, TrendingUp, TrendingDown, Heart, Star, Calculator, Home, Train, DollarSign, AlertCircle, CheckCircle, Clock, Filter, ArrowRight, GraduationCap } from 'lucide-react';

// 아파트 데이터 타입을 정의합니다.
interface Apartment {
  id: number;
  name: string;
  location: string;
  price: number;
  priceChange: number;
  investmentScore: number;
  grade: number;
  grade_ranking: number;
  upgrade_probability: number;
  lat: number;
  lng: number;
  features: {
    gradeAnalysis: number;
    transportation: number;
    education: number;
    supply: number;
    development: number;
    brand: number;
    community: number;
  };
  details: {
    constructionYear: number;
    totalUnits: number;
    maxFloor: number;
    parking: number;
    builder: string;
    nearestStation: string;
    schools: string;
    hospitals: string;
    facilities: string;
  };
  prediction: {
    year1: number;
    year3: number;
    confidence: number;
  };
  transactions: {
    date: string;
    price: number;
    area: string;
    floor: number;
  }[];
}

// 공통 카드 컴포넌트
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

// 투자 요인별 점수 레이더 차트
const ApartmentRadarChart = ({ features }: { features: Apartment['features'] }) => {
  const radarData = [
    { factor: '교통', score: features.transportation },
    { factor: '학군', score: features.education },
    { factor: '공급', score: features.supply },
    { factor: '개발', score: features.development },
    { factor: '브랜드', score: features.brand },
    { factor: '관심도', score: features.community },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">투자 요인별 점수</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="factor" />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar name="점수" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 가격 예측 바 차트
const PricePredictionChart = ({ prediction, price }: { prediction: Apartment['prediction'], price: number }) => {
  const priceData = [
    { year: '현재', price: price / 10000 },
    { year: '1년후', price: prediction.year1 / 10000 },
    { year: '3년후', price: prediction.year3 / 10000 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        가격 예측 (신뢰도: {prediction.confidence}%)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: '가격(억원)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number) => [`${value.toFixed(1)}억원`, '예상가격']} />
          <Bar dataKey="price" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          +{(((prediction.year3 - price) / price) * 100).toFixed(1)}%
        </div>
        <div className="text-gray-500">3년 예상 수익률</div>
      </div>
    </Card>
  );
};

// 단지 상세 정보 (단지정보 + 교통/인프라)
const ApartmentInfoGrid = ({ details }: { details: Apartment['details'] }) => (
  <>
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><Home className="w-5 h-5 mr-2 text-blue-600" />단지 정보</h3>
      <div className="space-y-3">
        <div className="flex justify-between"><span className="text-gray-600">준공년도</span><span className="font-medium">{details.constructionYear}년</span></div>
        <div className="flex justify-between"><span className="text-gray-600">총 세대수</span><span className="font-medium">{details.totalUnits.toLocaleString()}세대</span></div>
        <div className="flex justify-between"><span className="text-gray-600">최고층수</span><span className="font-medium">{details.maxFloor}층</span></div>
        <div className="flex justify-between"><span className="text-gray-600">주차비율</span><span className="font-medium">{details.parking}대/세대</span></div>
        <div className="flex justify-between"><span className="text-gray-600">시공사</span><span className="font-medium">{details.builder}</span></div>
      </div>
    </Card>
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><Train className="w-5 h-5 mr-2 text-green-600" />교통 & 인프라</h3>
      <div className="space-y-3">
        <div><span className="text-gray-600">지하철</span><div className="font-medium">{details.nearestStation}</div></div>
        <div><span className="text-gray-600">학교</span><div className="font-medium text-sm">{details.schools}</div></div>
        <div><span className="text-gray-600">병원</span><div className="font-medium text-sm">{details.hospitals}</div></div>
        <div><span className="text-gray-600">상업시설</span><div className="font-medium text-sm">{details.facilities}</div></div>
      </div>
    </Card>
  </>
);

// 최근 실거래가
const RecentTransactions = ({ transactions }: { transactions: Apartment['transactions'] }) => (
  <Card className="p-6 mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
      최근 실거래가
    </h3>
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <div>
            <div className="font-medium">{tx.date}</div>
            <div className="text-sm text-gray-600">{tx.area} {tx.floor}층</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{(tx.price / 10000).toFixed(1)}억</div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const NewlywedApartmentMVP = () => {
  const [currentStep, setCurrentStep] = useState('search');
  const [userInput, setUserInput] = useState({
    budget: 50000,
    priority: 'balanced',
    preferredGrade: 'any'
  });
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(false);

  // 샘플 아파트 데이터 (실제로는 API에서 가져올 데이터)
  const apartmentData: Apartment[] = [
    {
      id: 1,
      name: '래미안 분당 센트럴파크',
      location: '성남시 분당구 정자동',
      price: 48000,
      priceChange: 8.2,
      investmentScore: 94,
      grade: 2,
      grade_ranking: 3,
      upgrade_probability: 65,
      lat: 37.3633,
      lng: 127.1086,
      features: {
        gradeAnalysis: 95,
        transportation: 95,
        education: 88,
        supply: 75,
        development: 90,
        brand: 95,
        community: 85
      },
      details: {
        constructionYear: 2019,
        totalUnits: 1840,
        maxFloor: 25,
        parking: 1.2,
        builder: '삼성물산',
        nearestStation: '정자역 도보 5분',
        schools: '분당중앙고, 정자중 도보권',
        hospitals: '차병원 차량 10분',
        facilities: '현대백화점, AK플라자 인근'
      },
      prediction: {
        year1: 51200,
        year3: 56800,
        confidence: 87
      },
      transactions: [
        { date: '2024-06', price: 48000, area: '84㎡', floor: 15 },
        { date: '2024-05', price: 47200, area: '84㎡', floor: 8 },
        { date: '2024-04', price: 46800, area: '84㎡', floor: 22 }
      ]
    },
    {
      id: 2,
      name: '힐스테이트 광교',
      location: '수원시 영통구 광교동',
      price: 42000,
      priceChange: 5.1,
      investmentScore: 90,
      grade: 2,
      grade_ranking: 8,
      upgrade_probability: 72,
      lat: 37.2897,
      lng: 127.0441,
      features: {
        gradeAnalysis: 92,
        transportation: 82,
        education: 92,
        supply: 85,
        development: 88,
        brand: 90,
        community: 78
      },
      details: {
        constructionYear: 2020,
        totalUnits: 1654,
        maxFloor: 29,
        parking: 1.1,
        builder: '현대건설',
        nearestStation: '광교중앙역 도보 8분',
        schools: '광교고, 광교중 도보권',
        hospitals: '아주대병원 차량 15분',
        facilities: '광교갤러리아백화점 도보 10분'
      },
      prediction: {
        year1: 44500,
        year3: 48600,
        confidence: 85
      },
      transactions: [
        { date: '2024-06', price: 42000, area: '84㎡', floor: 18 },
        { date: '2024-05', price: 41500, area: '84㎡', floor: 12 },
        { date: '2024-04', price: 40800, area: '84㎡', floor: 25 }
      ]
    },
    {
      id: 3,
      name: '자이 위브 더 제니스',
      location: '하남시 망월동',
      price: 45000,
      priceChange: -2.1,
      investmentScore: 87,
      grade: 3,
      grade_ranking: 5,
      upgrade_probability: 85,
      lat: 37.5394,
      lng: 127.2056,
      features: {
        gradeAnalysis: 88,
        transportation: 78,
        education: 80,
        supply: 90,
        development: 85,
        brand: 88,
        community: 82
      },
      details: {
        constructionYear: 2021,
        totalUnits: 1248,
        maxFloor: 35,
        parking: 1.3,
        builder: 'GS건설',
        nearestStation: '망월사역 도보 12분',
        schools: '하남고, 하남중 도보권',
        hospitals: '한양대구리병원 차량 20분',
        facilities: '스타필드 하남 차량 5분'
      },
      prediction: {
        year1: 46800,
        year3: 50400,
        confidence: 82
      },
      transactions: [
        { date: '2024-06', price: 45000, area: '84㎡', floor: 28 },
        { date: '2024-05', price: 44700, area: '84㎡', floor: 15 },
        { date: '2024-04', price: 45800, area: '84㎡', floor: 32 }
      ]
    }
  ];

  const SearchStep = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          💕 신혼부부 스마트 아파트 분석
        </h1>
        <p className="text-xl text-gray-600">
          30개 요인 분석으로 예산 대비 최고 투자가치 아파트를 찾아드려요
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">투자 조건을 입력해주세요</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예산 설정
            </label>
            <div className="relative">
              <input
                type="range"
                min="10000"
                max="200000"
                step="1000"
                value={userInput.budget}
                onChange={(e) => setUserInput({ ...userInput, budget: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>10억원</span>
                <span>20억원</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선호 급지
            </label>
            <select
              value={userInput.preferredGrade}
              onChange={(e) => setUserInput({ ...userInput, preferredGrade: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="any">전체</option>
              <option value="1">1급지 (최상급)</option>
              <option value="2">2급지 (상급)</option>
              <option value="3">3급지 (중상급)</option>
              <option value="4">4급지 (중급)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              투자 성향
            </label>
            <select
              value={userInput.priority}
              onChange={(e) => setUserInput({...userInput, priority: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="balanced">균형형 (안정성 + 수익성)</option>
              <option value="conservative">안정형 (브랜드 + 학군)</option>
              <option value="aggressive">수익형 (개발호재 + 상승성)</option>
              <option value="newlywed">신혼특화 (육아 + 생활편의)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setCurrentStep('results');
            }, 2000);
          }}
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-pink-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              AI가 최적 아파트를 분석중...
            </>
          ) : (
            <>
              <Search className="w-6 h-6 mr-2" />
              스마트 분석 시작하기
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Calculator className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">30개 요인 분석</h3>
          </div>
          <p className="text-gray-600">
            공급, 교통, 학군, 개발호재 등 30개 데이터를 종합하여 투자점수를 계산합니다.
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-pink-600 mr-3" />
            <h3 className="text-lg font-semibold">신혼부부 특화</h3>
          </div>
          <p className="text-gray-600">
            임신, 출산, 육아를 고려한 의료시설, 교육환경에 특별 가중치를 적용합니다.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">미래가치 예측</h3>
          </div>
          <p className="text-gray-600">
            AI 모델로 3년 후 예상 가격과 수익률을 예측하여 투자 가이드를 제공합니다.
          </p>
        </div>
      </div>
    </div>
  );

  const ResultsStep = () => {
    const filteredApartments = apartmentData
      .filter(apt => apt.price <= userInput.budget * 1.1) // 예산의 110%까지
      .filter(apt => {
        if (userInput.preferredGrade === 'any') return true;
        return apt.grade === parseInt(userInput.preferredGrade);
      })
      .sort((a, b) => b.investmentScore - a.investmentScore);

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
            onClick={() => setCurrentStep('search')}
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
            최근 3년간 실거래가 변화를 통해 각 아파트의 상승/하락 패턴을 확인하세요
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
                domain={['dataMin - 2000', 'dataMax + 2000']}
                label={{ value: '실거래가(만원)', angle: -90, position: 'insideLeft' }}
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

              {/* 각 아파트별 가격 추이 라인 */}
              <Line
                type="monotone"
                dataKey="price1"
                data={[
                  { date: '2022-01', price1: 38000 },
                  { date: '2022-04', price1: 39200 },
                  { date: '2022-07', price1: 41500 },
                  { date: '2022-10', price1: 43200 },
                  { date: '2023-01', price1: 42800 },
                  { date: '2023-04', price1: 41900 },
                  { date: '2023-07', price1: 43500 },
                  { date: '2023-10', price1: 45200 },
                  { date: '2024-01', price1: 46800 },
                  { date: '2024-04', price1: 47200 },
                  { date: '2024-06', price1: 48000 }
                ]}
                stroke="#3B82F6"
                strokeWidth={3}
                name={filteredApartments[0]?.name || "래미안 분당센트럴파크"}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="price2"
                data={[
                  { date: '2022-01', price2: 32000 },
                  { date: '2022-04', price2: 33500 },
                  { date: '2022-07', price2: 35200 },
                  { date: '2022-10', price2: 36800 },
                  { date: '2023-01', price2: 36200 },
                  { date: '2023-04', price2: 35500 },
                  { date: '2023-07', price2: 37200 },
                  { date: '2023-10', price2: 38900 },
                  { date: '2024-01', price2: 40200 },
                  { date: '2024-04', price2: 41500 },
                  { date: '2024-06', price2: 42000 }
                ]}
                stroke="#10B981"
                strokeWidth={3}
                name={filteredApartments[1]?.name || "힐스테이트 광교"}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="price3"
                data={[
                  { date: '2022-01', price3: 35000 },
                  { date: '2022-04', price3: 37200 },
                  { date: '2022-07', price3: 39800 },
                  { date: '2022-10', price3: 42500 },
                  { date: '2023-01', price3: 41800 },
                  { date: '2023-04', price3: 40200 },
                  { date: '2023-07', price3: 42800 },
                  { date: '2023-10', price3: 44200 },
                  { date: '2024-01', price3: 45800 },
                  { date: '2024-04', price3: 44700 },
                  { date: '2024-06', price3: 45000 }
                ]}
                stroke="#F59E0B"
                strokeWidth={3}
                name={filteredApartments[2]?.name || "자이 위브 더 제니스"}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* 차트 분석 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-semibold text-blue-900">
                  {filteredApartments[0]?.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              <div className="text-sm text-blue-800">
                <div>3년 상승률: <span className="font-bold">+26.3%</span></div>
                <div>연평균: <span className="font-bold">+8.1%</span></div>
                <div className="text-xs mt-1">꾸준한 상승세, 안정적 투자처</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="font-semibold text-green-900">
                  {filteredApartments[1]?.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              <div className="text-sm text-green-800">
                <div>3년 상승률: <span className="font-bold">+31.3%</span></div>
                <div>연평균: <span className="font-bold">+9.4%</span></div>
                <div className="text-xs mt-1">높은 상승률, 성장 잠재력</div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span className="font-semibold text-yellow-900">
                  {filteredApartments[2]?.name.split(' ').slice(0, 3).join(' ')}
                </span>
              </div>
              <div className="text-sm text-yellow-800">
                <div>3년 상승률: <span className="font-bold">+28.6%</span></div>
                <div>연평균: <span className="font-bold">+8.7%</span></div>
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
                <span className="ml-1">래미안 분당센트럴파크처럼 꾸준한 상승세를 보이는 아파트</span>
              </div>
              <div>
                <span className="font-medium text-green-600">• 수익형 투자:</span>
                <span className="ml-1">힐스테이트 광교처럼 높은 상승률을 기록한 아파트</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredApartments.map((apt, index) => (
            <div
              key={apt.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 ${
                index === 0 ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200'
              }`}
              onClick={() => setSelectedApartment(apt)}
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
                    <div className="flex items-center mb-1">
                      <span className="text-xl mr-2">
                        {apt.grade === 1 && '🥇'}
                        {apt.grade === 2 && '🥈'}
                        {apt.grade === 3 && '🥉'}
                        {apt.grade === 4 && ''}
                        {apt.grade === 5 && ''}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {apt.name}
                      </h3>
                    </div>
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
                    <span className={`font-semibold flex items-center ${
                      apt.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {apt.priceChange > 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {apt.priceChange > 0 ? '+' : ''}{apt.priceChange}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">교통</div>
                    <div className="font-semibold">{apt.features.transportation}/100</div>
                  </div>
                  <div>
                    <div className="text-gray-500">학군</div>
                    <div className="font-semibold">{apt.features.education}/100</div>
                  </div>
                  <div>
                    <div className="text-gray-500">개발호재</div>
                    <div className="font-semibold">{apt.features.development}/100</div>
                  </div>
                  <div>
                    <div className="text-gray-500">브랜드</div>
                    <div className="font-semibold">{apt.features.brand}/100</div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApartment(apt);
                    setCurrentStep('detail');
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

  const DetailStep = () => {
    if (!selectedApartment) return null;

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedApartment.name}
            </h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{selectedApartment.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">
              {selectedApartment.investmentScore}
            </div>
            <div className="text-gray-500">종합 투자점수</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ApartmentRadarChart features={selectedApartment.features} />
          <PricePredictionChart prediction={selectedApartment.prediction} price={selectedApartment.price} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ApartmentInfoGrid details={selectedApartment.details} />
            </div>
            <div className="lg:col-span-1">
                <RecentTransactions transactions={selectedApartment.transactions} />
            </div>
        </div>

        {/* 신혼부부 특화 분석 */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
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

        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center"><Star className="w-6 h-6 mr-2 text-yellow-500" />급지 및 투자 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">현재 급지</p>
              <p className="text-2xl font-bold">{selectedApartment.grade}급지</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">동일 급지 내 순위</p>
              <p className="text-2xl font-bold">상위 {selectedApartment.grade_ranking}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">급지 상승 확률</p>
              <p className="text-2xl font-bold text-green-600">{selectedApartment.upgrade_probability}%</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentStep('results')}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
          >
            목록으로 돌아가기
          </button>
          <button className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-blue-600">
            <Heart className="w-5 h-5 mr-2 inline" />
            찜하기 & 알림설정
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'search' && <SearchStep />}
      {currentStep === 'results' && <ResultsStep />}
      {currentStep === 'detail' && <DetailStep />}
    </div>
  );
};

export default NewlywedApartmentMVP;
