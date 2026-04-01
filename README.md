# Portfolio Main

Next.js portfolio project with App Router and Three.js scene architecture.

## Run locally

```bash
npm install
npm run dev
```

## Standardized project structure

```text
portfolio_main/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── contact/page.tsx
│   ├── projects/page.tsx
│   └── api/contact/route.ts
├── three/
│   ├── scenes/
│   ├── rooms/
│   └── models/
│       ├── character/
│       ├── deskandchair/
│       └── wall/
├── styles/
│   └── globals.css
├── public/
│   └── 3d/
└── ...
```

## Route compatibilities

- Primary pages: `/`, `/projects`, `/contact`
- Legacy aliases kept: `/products`, `/contacts`
