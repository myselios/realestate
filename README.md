# HSMC - 신혼부부 부동산 추천 서비스

이 프로젝트는 신혼부부의 예산과 라이프스타일에 최적화된 아파트를 추천하는 지능형 부동산 분석 서비스입니다. pnpm 워크스페이스를 사용하는 모노레포로 구성되어 있습니다.

## 프로젝트 구조

```
.
├── packages/
│   ├── api/          # 백엔드 Express.js 서버
│   │   ├── prisma/
│   │   │   └── schema.prisma  # 데이터베이스 스키마 정의
│   │   ├── src/
│   │   │   ├── routes/        # API 엔드포인트 정의
│   │   │   └── index.ts       # 서버 진입점
│   │   └── package.json
│   │
│   └── web/          # 프론트엔드 Next.js 애플리케이션
│       ├── src/
│       │   ├── app/
│       │   │   └── page.tsx   # 메인 랜딩 페이지
│       │   └── ...
│       ├── next.config.ts     # Next.js 설정 (API 프록시 포함)
│       └── package.json
│
├── package.json      # 루트 package.json (워크스페이스 스크립트)
└── pnpm-workspace.yaml
```

## 핵심 페이지 (Landing Page)

사용자와 상호작용하는 메인 애플리케이션은 `packages/web` 디렉토리에서 제공됩니다. 사용자가 처음 방문하게 되는 핵심 페이지는 다음과 같습니다.

-   **`packages/web/src/app/page.tsx`**

이 페이지는 사용자가 예산 범위를 선택하면, 각 급지별로 조건에 맞는 대표 아파트를 추천하고, 해당 아파트들의 2년간 시세 추이를 차트로 시각화하여 보여주는 기능을 담고 있습니다.

## 시작하는 방법

1.  **의존성 설치** (프로젝트 루트에서 실행)
    ```bash
    pnpm install
    ```

2.  **개발 서버 실행** (프로젝트 루트에서 실행)
    ```bash
    pnpm run dev
    ```
    이 명령은 `api` 서버와 `web` 서버를 동시에 실행합니다. 브라우저에서 `http://localhost:3000` (또는 터미널에 표시되는 다른 포트)으로 접속하여 결과를 확인하세요.

## 주요 기술 스택 및 라이브러리

이 프로젝트는 다음과 같은 주요 기술과 라이브러리를 기반으로 구축되었습니다. 버전은 안정적인 운영을 위해 신중하게 관리됩니다.

### Backend (`packages/api`)
| 라이브러리 | 버전 | 설명 |
|---|---|---|
| **Express.js** | `^4.19.2` | Node.js 웹 프레임워크 |
| **Prisma** | `^6.10.1` | 차세대 ORM (Database: PostgreSQL) |
| **TypeScript** | `^5.8.3` | JavaScript에 타입을 추가한 언어 |

### Frontend (`packages/web`)
| 라이브러리 | 버전 | 설명 |
|---|---|---|
| **Next.js** | `15.3.4` | React 기반 프로덕션 프레임워크 |
| **React** | `19.1.0` | 사용자 인터페이스 라이브러리 |
| **Tailwind CSS** | `4.1.10` | 유틸리티-우선 CSS 프레임워크 |
| **React Query** | `^5.81.2` | 서버 상태 관리 및 데이터 페칭 |
| **Recharts** | `^2.15.4` | React 차트 라이브러리 |