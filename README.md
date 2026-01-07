# Task&nbsp;Hub (V1) — Task Posting, Bidding &amp; Messaging

Task Hub is a marketplace for home and construction projects.  Homeowners can post
tasks (with photos, location and start date) and receive bids from
qualified **taskers**.  Once a bid is accepted the parties can chat in‑app and
share attachments to finish the job.  A simple admin dashboard lets you
moderate content, verify taskers and manage guides, blog posts and
services.

**Tech:** Next.js (App Router) + Supabase + Render

## Features

- **Public task feed** showing recently created tasks by homeowners.  Tasks
  include photos, city, start date and selected services.
- **Authentication** via email/password using Supabase Auth.
- **Role selection** after sign up: choose **Homeowner** or **Tasker**.  Taskers
  customise their profile with profession, bio, districts and optional
  portfolio photos.  (Prior versions called the professional role a
  “tiler”; this has been renamed to tasker everywhere, including the
  database.)
- **Post tasks** with title, description, city, start date, one or more
  service tags and up to five photos.  Tasks can be edited or deleted
  by their owner.
- **Bid on tasks** – taskers can browse tasks and submit a price and
  message.  Homeowners see a list of bids and can accept one.
- **In‑app messaging** opens automatically when a bid is accepted.  Both
  parties can chat in real time and share attachments.
- **Admin dashboard** for managing content: verify taskers, delete
  inappropriate profiles, create/edit blog posts and guides, and
  configure available services.  Only admin users can access this.

## 1)&nbsp;Set&nbsp;up Supabase

1. **Create a Supabase project.**
2. In the SQL editor run the migrations in `supabase/migrations`.  At a
   minimum you need `001_init.sql` (schema) and `002_rls.sql` (row level
   security).  Additional migrations add optional columns (profile
   improvements, admin content, conversation flows) – run them all in
   order for the full feature set.
3. **Create storage buckets** in Supabase Storage:
   - `task-photos` – used to store images attached to tasks.  You can
     configure this bucket to allow public read if you want images to be
     accessible via URL.
   - `message-attachments` – used for files shared in chat.  This
     bucket should remain private and use RLS policies to ensure only
     participants can read the files.

## 2)&nbsp;Environment variables

Copy `.env.example` to `.env.local` and fill in the following values:

- `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – your Supabase anonymous API key.
- `SUPABASE_SERVICE_ROLE_KEY` – (optional) used by admin API routes to
  perform privileged operations such as verifying users.

These variables are required both locally and when deploying.

## 3)&nbsp;Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).  Hot
reloading is enabled by default.

## 4)&nbsp;Deploy on Render

This project is designed to run as a Node.js web service on
[Render](https://render.com).  Unlike earlier versions of this
repository there is no Netlify configuration – deployment uses
Render’s Node runtime.

### Steps to deploy

1. **Push the code to a Git repository** (GitHub/GitLab/Bitbucket).
2. Sign in to your Render account and click **“New Web Service”**.
3. Select your repository and choose **“Node”** as the environment.
4. **Environment variables**: add the same variables from `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `SUPABASE_SERVICE_ROLE_KEY` if used) under the *Environment* tab.
5. **Build command:**
   ```
   npm install && npm run build
   ```
6. **Start command:**
   ```
   npm run start
   ```
   This runs `next start` and serves your built Next.js app via a Node
   server.  Render’s documentation recommends similar commands when
   deploying a Next.js app as a Node server (language “Node”, build
   command `yarn; yarn build`, start command `yarn start`【264499209767228†L189-L195】).
7. **Node version:** Render reads a `.nvmrc` file or you can set
   `NODE_VERSION` in the environment.  This project uses Node 20.
8. Click **Create Web Service**.  Once the build finishes Render will
   serve your Task Hub instance at a public URL.

### Optional: render.yaml blueprint

Render supports infrastructure as code via a `render.yaml` file.  If you
prefer to manage services declaratively you can add a `render.yaml` to
the repository with your service definitions.  See Render’s docs for
details.

## Notes

- This is a simple V1 that uses client‑side Supabase sessions.  For a
  production environment you may want to move to cookie‑based auth,
  implement rate limiting on bidding/messaging endpoints and tighten
  storage policies.
- The name “Task Hub” replaces the older “Tilers Hub”.  All code has
  been updated to reflect the `tasker` role and generalised services
  beyond tiling.
- If you upgraded an existing database from the `tiler` role to
  `tasker`, be sure you updated your role constraints and RLS policies
  accordingly.