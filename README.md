# TILERS HUB (V1) — Task Posting + Bidding + In‑App Messaging
Tech: **Next.js (App Router) + Supabase + Netlify**

## What this V1 includes
- Public home feed of tasks
- Auth (email/password)
- Profile onboarding (choose role: homeowner/tiler)
- Homeowner: post task (+ photos), edit/delete own tasks
- Tiler: place bids
- Homeowner: accept a bid -> creates a conversation
- In-app messaging with real-time updates + attachments

> Phone numbers are not shown. Communication happens via the in-app chat.

---

## 1) Setup Supabase
1. Create a Supabase project.
2. In Supabase SQL Editor, run:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_rls.sql`
3. Create Storage buckets:
   - `task-photos`
   - `message-attachments`

### Storage policies
For a fast V1:
- `task-photos` can be public read
- `message-attachments` should be private read (participants only)

---

## 2) Setup env vars
Copy `.env.example` -> `.env.local` and fill:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3) Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

---

## 4) Deploy on Netlify
1. Push this repo to GitHub.
2. Netlify → New site from Git → select repo
3. Add env vars in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Build command: `npm run build`
5. Publish: `.next`

`netlify.toml` already includes the Netlify Next.js plugin.

---

## Notes
- This is a simple V1 using client-side Supabase auth/session. For a more advanced production setup, you can upgrade to cookie-based SSR auth, server actions, and stricter storage policies.
