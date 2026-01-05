# Filhos do Fogo Manager

## Overview
A school management application built with React, Vite, TypeScript, and Supabase. The app provides dashboards for administrators, professors, and students to manage classes, grades, events, music library, uniforms, and more.

## Project Structure
- `/pages/` - React page components (dashboards, login, student management, etc.)
- `/components/` - Reusable UI components
- `/services/` - Supabase client and data services
- `App.tsx` - Main app component with routing
- `types.ts` - TypeScript type definitions
- `constants.ts` - App constants

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Database**: Supabase
- **Styling**: Tailwind CSS (CDN)

## Development
- Dev server runs on port 5000
- Start with: `npm run dev`
- Build with: `npm run build`

## Environment Variables
- `GEMINI_API_KEY` - Optional API key for Gemini AI features

## Deployment
- Static deployment with `dist` as the public directory
