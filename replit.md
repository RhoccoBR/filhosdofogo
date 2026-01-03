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
├── pages/            # Page components
├── server/           # Backend Express server
│   └── index.ts      # Server entry point
├── App.tsx           # Main app with routing
├── index.tsx         # React entry point
├── index.html        # HTML template
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies
```

## Development
- Run `npm run dev` to start the frontend on port 5000
- Run `npm run start-backend` to start the backend on port 3001
- Frontend proxies `/api` requests to the backend

## Routes
- `/` - Landing page
- `/login` - Login page
- `/app/*` - Protected application routes (dashboard, events, users, etc.)

## Recent Changes
- Integrated PostgreSQL database for user and class management.
- Set up Express backend on port 3001 with API proxy in Vite.
- Implemented database-driven login system that validates credentials.
- Created `PUT /api/profile` endpoint to update user personal data and profile picture.
- Updated `EditProfile` component to persist data in the database and synchronize with `localStorage`.
- Removed manual role-switching UI to ensure security based on database roles.
