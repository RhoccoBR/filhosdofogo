# Filhos do Fogo Manager

## Overview
A management system for the "Filhos do Fogo" Capoeira group. This is a React-based single-page application with TypeScript and Vite.

## Project Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN)
- **Routing**: React Router DOM with HashRouter

## Structure
```
/
├── components/       # Reusable React components
│   └── Layout.tsx    # Main layout wrapper
├── pages/            # Page components
│   ├── Landing.tsx   # Public landing page
│   ├── Login.tsx     # Login page
│   ├── DashboardHome.tsx
│   └── ...           # Various dashboard pages
├── App.tsx           # Main app with routing
├── index.tsx         # React entry point
├── index.html        # HTML template
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies
```

## Development
- Run `npm run dev` to start the development server on port 5000
- The app uses HashRouter for client-side routing

## Routes
- `/` - Landing page
- `/login` - Login page
- `/app/*` - Protected application routes (dashboard, events, users, etc.)

## Deployment
- Build: `npm run build`
- Output: `dist/` directory
- Static hosting deployment configured
