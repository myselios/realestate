# HSMC 프로젝트 개요

이 문서는 '신혼부부 부동산 추천 서비스(HSMC)' 프로젝트의 전체적인 구조와 기술 스택, 버전 정보를 요약합니다.

## 1. 프로젝트 구조 (Monorepo)

이 프로젝트는 `npm workspaces`를 사용한 모노레포 구조로 관리됩니다. 프론트엔드(`web`)와 백엔드(`api`)가 각각의 패키지로 분리되어 있습니다.

```
realestate/
├── .git/
├── .vooster/
├── packages/
│   ├── api/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/
│       ├── src/
│       │   └── app/
│       │       └── page.tsx
│       ├── public/
│       ├── package.json
│       └── next.config.mjs
├── .gitignore
├── package.json
└── PROJECT_OVERVIEW.md
```

## 2. 기술 스택 및 버전 정보

### 2.1. 프론트엔드 (`packages/web`)

- **Framework**: Next.js (v15.3.4)
- **Language**: TypeScript (v5)
- **Styling**: Tailwind CSS (v4)
- **UI Libraries**:
  - React (v19.0.0)
  - Chart.js (v4.5.0)
- **State Management**: React Query (v5.80.10)

### 2.2. 백엔드 (`packages/api`)

- **Framework**: Express.js (v5.1.0)
- **Language**: TypeScript (v5.8.3)
- **Runtime**: Node.js
- **Database ORM**: Prisma (v6.10.1)
- **Database**: Supabase (PostgreSQL)
- **In-memory Cache**: Redis (v5.5.6)

## 3. 주요 실행 명령어

프로젝트 루트 디렉터리에서 다음 명령어를 실행할 수 있습니다.

- `npm run dev`: 프론트엔드와 백엔드 개발 서버를 동시에 실행합니다.
- `npm run build`: `web`과 `api` 패키지를 모두 빌드합니다.
- `npm run lint`: `web`과 `api` 패키지의 코드 린트를 실행합니다.
