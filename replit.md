# Tilers Hub

## Overview
A Next.js 14 application for connecting tilers with potential clients. The app uses Supabase for backend services (authentication, database, storage).

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, PostgreSQL Database, Storage)
- **Package Manager**: npm

## Project Structure
- `/app` - Next.js App Router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and Supabase client
- `/supabase/migrations` - Database migration files

## Key Features

### Post Task Flow
The task posting flow is a 3-step wizard:
1. **Project Info**: Collects project address and starting date
2. **Services**: Add multiple tiling services with detailed specifications
3. **Review**: Preview and publish the task

Supported service types:
- **Floor Tiling**: Floor, material, tile size, area, skirting, screed, nosing, demolition
- **Wall Tiling**: Same as floor tiling with wall-specific context
- **Staircase Tiling**: Steps, step length, top, riser, landings, edge finishing
- **Bathroom Tiling**: Wall area, floor area, screed, nosing, 45-degree cuts
- **Pantry/Backsplash**: Material, area, pantry length, shape, edge finish
- **Other**: Free-form description

Each service section supports:
- Image upload (stored in Supabase Storage)
- Additional notes field

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

## Recent Changes
- **Dec 31, 2025**: Updated post-task flow with comprehensive tiling service options including floor, wall, staircase, bathroom, and pantry tiling with detailed specifications, image upload, and additional notes.
