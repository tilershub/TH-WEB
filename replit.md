# Tilers Hub

## Overview
A Next.js 14 application for connecting tilers with potential clients. The app uses Supabase for backend services (authentication, database, storage).

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, PostgreSQL Database)
- **Package Manager**: npm

## Project Structure
- `/app` - Next.js App Router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and Supabase client
- `/supabase/migrations` - Database migration files

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Running the App
The development server runs on port 5000:
```bash
npm run dev
```

## Deployment
- Build command: `npm run build`
- Start command: `npm start`
