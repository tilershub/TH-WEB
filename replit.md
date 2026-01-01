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
The tiler profile system (`/profile/setup`) provides a comprehensive setup form:

**Photo Uploads:**
- Cover photo at the top of profile (stored in `profile-covers` bucket)
- Circular profile photo with overlay upload button (stored in `profile-avatars` bucket)
- Instant upload feedback and preview

**Basic Information:**
- Full name, WhatsApp number (required)
- NIC number for verification (not shown publicly)
- Bio/About section
- District and city location
- Business address
- Years of experience

**Services & Rates:**
- Toggle services on/off with checkboxes
- Set custom rates for each enabled service (LKR per unit)
- 9 service types: Floor Tiling, Wall Tiling, Staircase Tiling, Bathroom Tiling, Pantry/Backsplash, Waterproofing, Screed, Demolition, Nosing

**Working Areas:**
- Select multiple districts where tiler can work
- Visual tag-style selection UI

**Certificates & Qualifications:**
- Add certificates with title, issuer, and image upload
- Stored in `certifications` table and `certifications` storage bucket
- Delete certificates with confirmation
- Displayed on profile page

**Profile Display (`/profile`):**
- Cover photo header with avatar overlay
- Services with rates in card format
- Certificates section with image lightbox
- Portfolio gallery (horizontal scroll)
- Years of experience and completed jobs count

Public tiler profile page (`/tilers/[id]`) - mobile-first design:
- **Profile header**: Circular avatar, name, location with pin icon, star rating
- **Request Quote button**: Prominent CTA button linking to WhatsApp
- **About Me section**: Bio text with phone and email contact info
- **My Skills section**: 2-column grid with green checkmark badges showing services offered
- **Portfolio section**: Horizontal scrolling gallery with lightbox view
- **Reviews section**: Reviewer cards with avatar, name, service type, date, and comment
- **Experience footer**: Years of experience and completed jobs count

### Admin Dashboard
Secure admin panel at `/admin` for managing website content. Only users with `is_admin=true` can access.

Features:
- **Dashboard Overview**: Stats cards showing total users, tilers, tasks, blog posts, and guides
- **Users Management** (`/admin/users`): View all profiles, search, filter by role, verify/unverify tilers
- **Blog Posts** (`/admin/blog`): Create, edit, publish/unpublish, and delete blog articles
- **Guides** (`/admin/guides`): Create step-by-step how-to guides with dynamic step builder
- **Tasks** (`/admin/tasks`): View all tasks, change status, delete inappropriate tasks

To grant admin access, set `is_admin = true` in the profiles table for the user.

### Database Tables
- `profiles` - User profiles with role, contact info, availability settings, is_admin flag
- `tiler_services` - Individual service offerings with pricing
- `tiler_portfolio` - Work samples gallery
- `certifications` - Professional certifications
- `tasks` - Posted tiling jobs
- `task_sections` - Individual service requirements within tasks
- `bids` - Tiler bids on tasks
- `conversations` / `messages` - In-app messaging
- `blog_posts` - Admin-managed blog articles
- `guides` - Admin-managed how-to guides with JSON steps

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
- **Jan 1, 2026**: Production readiness for AdSense - Added privacy policy with advertising disclosure, terms of service with metadata, ads.txt placeholder, AdSense script placeholder in layout, added legal pages to sitemap, configured autoscale deployment with standalone server.
- **Jan 1, 2026**: Performance optimizations - Next.js Image config for Supabase, skeleton loading components, memoized components, pagination on tilers page, optimized Supabase queries.
- **Jan 1, 2026**: Optimized public tiler profile (`/tilers/[id]`) with cover photo header, services with rates display, service images in portfolio, and certificates section with images.
- **Jan 1, 2026**: Added service image uploads for each selected service - images are stored in `service_rates` JSON and displayed in portfolio gallery with service labels. Fixed rate update to preserve photo_path.
- **Jan 1, 2026**: Enhanced tiler profile setup with profile photo upload, cover photo upload, NIC field, service rates per service, and certificates upload section. Profile display page now shows cover photo, services with rates, and certificates.
- **Jan 1, 2026**: Redesigned tiler profile setup (`/profile/setup`) with progressive editing using expandable sections like Facebook - each section saves independently, shows completion status, and has a progress bar. Added "Become a Tiler" option to homeowner profile edit page.
- **Jan 1, 2026**: Added comprehensive admin dashboard (`/admin`) with Supabase auth protection. Includes users management, blog posts CRUD, guides CRUD with step builder, and tasks moderation. Added RLS policies for admin access to profiles/tasks/blog_posts/guides.
- **Jan 1, 2026**: Fixed profile edit confusion - homeowners now have a simple edit page (`/profile/edit`) while tilers use progressive profile setup (`/profile/setup`).
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
