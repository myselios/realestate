"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Search, Heart, Calculator, TrendingUp } from "lucide-react";

// Dynamically import heavy components for lazy-loading
const ResultsView = dynamic(() => import("./ResultsView"), {
  loading: () => <div className="text-center p-10">결과를 불러오는 중...</div>,
  ssr: false,
});

const DetailView = dynamic(() => import("./DetailView"), {
  loading: () => (
    <div className="text-center p-10">상세 정보를 불러오는 중...</div>
  ),
  ssr: false,
});

export interface Apartment {
  id: number;
  name: string;
  location: string;
  price: number;
  priceChange: number;
  investmentScore: number;
  lat: number;
  lng: number;
  features: {
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

const NewlywedApartmentClient = () => {
  const [currentStep, setCurrentStep] = useState("search");
  const [userInput, setUserInput] = useState({
    budget: 50000,
    region: "",
    priority: "balanced",
  });
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // 샘플 아파트 데이터 (실제로는 API에서 가져올 데이터)
  const apartmentData: Apartment[] = [
    {
      id: 1,
      name: "래미안 분당 센트럴파크",
      location: "성남시 분당구 정자동",
      price: 48000,
      priceChange: 8.2,
      investmentScore: 92,
      lat: 37.3633,
      lng: 127.1086,
      features: {
        transportation: 95,
        education: 88,
        supply: 75,
        development: 90,
        brand: 95,
        community: 85,
      },
      details: {
        constructionYear: 2019,
        totalUnits: 1840,
        maxFloor: 25,
        parking: 1.2,
        builder: "삼성물산",
        nearestStation: "정자역 도보 5분",
        schools: "분당중앙고, 정자중 도보권",
        hospitals: "차병원 차량 10분",
        facilities: "현대백화점, AK플라자 인근",
      },
      prediction: {
        year1: 51200,
        year3: 56800,
        confidence: 87,
      },
      transactions: [
        { date: "2024-06", price: 48000, area: "84㎡", floor: 15 },
        { date: "2024-05", price: 47200, area: "84㎡", floor: 8 },
        { date: "2024-04", price: 46800, area: "84㎡", floor: 22 },
      ],
    },
    {
      id: 2,
      name: "힐스테이트 광교",
      location: "수원시 영통구 광교동",
      price: 42000,
      priceChange: 5.1,
      investmentScore: 88,
      lat: 37.2897,
      lng: 127.0441,
      features: {
        transportation: 82,
        education: 92,
        supply: 85,
        development: 88,
        brand: 90,
        community: 78,
      },
      details: {
        constructionYear: 2020,
        totalUnits: 1654,
        maxFloor: 29,
        parking: 1.1,
        builder: "현대건설",
        nearestStation: "광교중앙역 도보 8분",
        schools: "광교고, 광교중 도보권",
        hospitals: "아주대병원 차량 15분",
        facilities: "광교갤러리아백화점 도보 10분",
      },
      prediction: {
        year1: 44500,
        year3: 48600,
        confidence: 85,
      },
      transactions: [
        { date: "2024-06", price: 42000, area: "84㎡", floor: 18 },
        { date: "2024-05", price: 41500, area: "84㎡", floor: 12 },
        { date: "2024-04", price: 40800, area: "84㎡", floor: 25 },
      ],
    },
    {
      id: 3,
      name: "자이 위브 더 제니스",
      location: "하남시 망월동",
      price: 45000,
      priceChange: -2.1,
      investmentScore: 85,
      lat: 37.5394,
      lng: 127.2056,
      features: {
        transportation: 78,
        education: 80,
        supply: 90,
        development: 85,
        brand: 88,
        community: 82,
      },
      details: {
        constructionYear: 2021,
        totalUnits: 1248,
        maxFloor: 35,
        parking: 1.3,
        builder: "GS건설",
        nearestStation: "망월사역 도보 12분",
        schools: "하남고, 하남중 도보권",
        hospitals: "한양대구리병원 차량 20분",
        facilities: "스타필드 하남 차량 5분",
      },
      prediction: {
        year1: 46800,
        year3: 50400,
        confidence: 82,
      },
      transactions: [
        { date: "2024-06", price: 45000, area: "84㎡", floor: 28 },
        { date: "2024-05", price: 44700, area: "84㎡", floor: 15 },
        { date: "2024-04", price: 45800, area: "84㎡", floor: 32 },
      ],
    },
  ];

  const filteredApartments = apartmentData
    .filter((apt) => apt.price <= userInput.budget * 1.1) // 예산의 110%까지
    .sort((a, b) => b.investmentScore - a.investmentScore);

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
        <h2 className="text-2xl font-semibold mb-6">
          투자 조건을 입력해주세요
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예산 설정
            </label>
            <div className="relative">
              <input
                type="range"
                min="30000"
                max="80000"
                step="1000"
                value={userInput.budget}
                onChange={(e) =>
                  setUserInput({
                    ...userInput,
                    budget: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>3억</span>
                <span className="font-semibold text-blue-600">
                  {(userInput.budget / 10000).toFixed(1)}억원
                </span>
                <span>8억</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선호 지역
            </label>
            <select
              value={userInput.region}
              onChange={(e) =>
                setUserInput({ ...userInput, region: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">지역 선택</option>
              <option value="bundang">성남시 분당구</option>
              <option value="gwanggyo">수원시 영통구</option>
              <option value="hanam">하남시</option>
              <option value="ilsan">고양시 일산구</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              투자 성향
            </label>
            <select
              value={userInput.priority}
              onChange={(e) =>
                setUserInput({ ...userInput, priority: e.target.value })
              }
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
              setCurrentStep("results");
            }, 1500); // Reduced delay for better UX
          }}
          disabled={!userInput.region || loading}
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
            공급, 교통, 학군, 개발호재 등 30개 데이터를 종합하여 투자점수를
            계산합니다.
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-pink-600 mr-3" />
            <h3 className="text-lg font-semibold">신혼부부 특화</h3>
          </div>
          <p className="text-gray-600">
            임신, 출산, 육아를 고려한 의료시설, 교육환경에 특별 가중치를
            적용합니다.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">미래가치 예측</h3>
          </div>
          <p className="text-gray-600">
            AI 모델로 3년 후 예상 가격과 수익률을 예측하여 투자 가이드를
            제공합니다.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case "search":
        return <SearchStep />;
      case "results":
        return (
          <ResultsView
            filteredApartments={filteredApartments}
            userInput={userInput}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              setCurrentStep("detail");
            }}
            onNavigateToDetail={() => setCurrentStep("detail")}
            onBackToSearch={() => setCurrentStep("search")}
          />
        );
      case "detail":
        return selectedApartment ? (
          <DetailView apartment={selectedApartment} />
        ) : (
          <SearchStep />
        );
      default:
        return <SearchStep />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderStep()}</div>;
};

export default NewlywedApartmentClient;
