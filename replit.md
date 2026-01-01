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

### Tiler Profile Customization
The tiler profile system includes a 5-step setup wizard:

1. **Basic Info**: Full name, NIC, WhatsApp, location, bio, profile/cover photos
2. **Services & Rates**: Set rates for 9 service types aligned with post task flow:
   - Floor Tiling, Wall Tiling, Staircase Tiling, Bathroom Tiling
   - Pantry/Backsplash, Waterproofing, Screed, Demolition, Nosing
3. **Availability**: Availability status (available/busy/unavailable), working districts, years of experience
4. **Portfolio**: Gallery of completed work samples with before/after photos
5. **Certifications**: Professional qualifications and certificates

Public tiler profile page (`/tilers/[id]`) - mobile-first design:
- **Profile header**: Circular avatar, name, location with pin icon, star rating
- **Request Quote button**: Prominent CTA button linking to WhatsApp
- **About Me section**: Bio text with phone and email contact info
- **My Skills section**: 2-column grid with green checkmark badges showing services offered
- **Portfolio section**: Horizontal scrolling gallery with lightbox view
- **Reviews section**: Reviewer cards with avatar, name, service type, date, and comment
- **Experience footer**: Years of experience and completed jobs count

### Database Tables
- `profiles` - User profiles with role, contact info, availability settings
- `tiler_services` - Individual service offerings with pricing
- `tiler_portfolio` - Work samples gallery
- `certifications` - Professional certifications
- `tasks` - Posted tiling jobs
- `task_sections` - Individual service requirements within tasks
- `bids` - Tiler bids on tasks
- `conversations` / `messages` - In-app messaging

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

## Supabase Edge Functions
Located in `/supabase/functions/`:
- `place-bid` - Handles bid placement with tiler role validation, prevents duplicate bids, and validates amounts

## Recent Changes
- **Jan 1, 2026**: Added service-specific pages (`/services/[service]`) showing available tilers, related blog articles, and how-to guides for each service type.
- **Jan 1, 2026**: Performance optimizations - Next.js Image config for Supabase, skeleton loading components, memoized components, pagination on tilers page, optimized Supabase queries.
- **Dec 31, 2025**: Added full blog articles (8 posts with complete content) and how-to guides section (8 step-by-step guides) with individual pages.
- **Dec 31, 2025**: Created missing pages - `/tilers` (browse all tilers with search) and `/blog` (articles with category filters).
- **Dec 31, 2025**: Improved bottom navigation bar to industry standards - filled/outlined icon states, smooth transitions, scale animations, glassmorphism effect, and proper label alignment.
- **Dec 31, 2025**: Added Supabase Edge Function for secure bid placement - only tilers can bid, with RLS policies for defense in depth.
- **Dec 31, 2025**: Created role-based home pages - homeowners see search bar, services grid, top tilers, blog posts, and how-to guides; tilers see available tasks and tiler-focused blog posts.
- **Dec 31, 2025**: Added TILERS HUB branding header on all mobile pages, root URL (/) now redirects to /home.
- **Dec 31, 2025**: Redesigned public tiler profile page with mobile-first layout matching the design reference - profile header with avatar/name/location/rating, Request Quote button, About Me section, My Skills grid with checkmarks, horizontal Portfolio gallery, and Reviews section.
- **Dec 31, 2025**: Enhanced tiler profile customization with 5-step setup wizard, portfolio gallery, availability settings, verification badges, and improved public profile display with tabbed interface.
- **Dec 31, 2025**: Updated services to align with post task flow (9 service types: floor_tiling, wall_tiling, staircase_tiling, bathroom_tiling, pantry_backsplash, waterproofing, screed, demolition, nosing).
- **Dec 31, 2025**: Updated post-task flow with comprehensive tiling service options including floor, wall, staircase, bathroom, and pantry tiling with detailed specifications, image upload, and additional notes.
