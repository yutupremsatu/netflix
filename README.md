
# Netekflix

Netekflix is a modern Netflix clone built with Next.js 14, Supabase, and Tailwind CSS.

## Features
- **Video Player:** Custom modal player with maximize/minimize support.
- **Provider:** Uses `vidsrc.xyz` for robust video streaming.
- **Database:** Supabase (PostgreSQL) stores movie metadata.
- **Auth:** NextAuth.js (Google/GitHub).
- **Movies:** 350+ Movies imported from public datasets (YTS, GitHub).

## Tech Stack
-   **Frontend:** Next.js 14 (App Router), Tailwind CSS
-   **Backend/DB:** Supabase (PostgreSQL)
-   **Video Source:** Embed Provider (`vidsrc.xyz`) - Fetches streams by IMDB ID.
-   **Images:** Hosted on Amazon/IMDB/YTS domains (configured in `next.config.mjs`).

## Getting Started
1.  Clone repo: `git clone https://github.com/yutupremsatu/netflix.git`
2.  Install: `npm install`
3.  Run: `npm run dev`

## Deployment
Deployed on **Vercel**.
