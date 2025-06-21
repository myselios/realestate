# HSMC (신혼부부 부동산 추천서비스)

이 프로젝트는 Next.js 기반으로 신혼부부를 위한 부동산 추천 서비스를 개발합니다.

## 프로젝트 구조

```
.
├── app/
│   ├── .gitignore
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── README.md
│   ├── public/
│   │   ├── next.svg
│   │   └── vercel.svg
│   ├── src/
│   │   └── app/
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── favicon.ico
│   └── tsconfig.json
└── .cursor/
```

## 시작하기

1. **의존성 설치**
   ```bash
   cd app
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인하세요. 