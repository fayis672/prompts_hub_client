# Prompts Hub - Main Client

The user-facing Frontend application for Prompts Hub. Built with Next.js 14 (App Router), React Query, and Supabase Auth.

## Overview
Prompts Hub is a community-driven repository that allows AI creators to discover, share, and save the best prompts for tools like ChatGPT, Claude, and Gemini. This client offers a rich, glassmorphism-inspired dark mode UI.

## Core Features
- **Feed & Discovery:** Trending, Most Liked, and New Arrival feeds powered by the Recommendation Engine.
- **Social Graph:** Follow/Unfollow users, and filter content via customized history and likes.
- **Prompt Execution:** Instantly run copied prompts directly into remote AI chatbots with 1 click.
- **Rich Interaction:** Bookmark, Upvote, Tag, and Comment on prompts seamlessly.
- **SEO Ready:** Fully Server-Side Rendered (SSR) routes for dynamic sharing and metadata scraping.

## Environment Configuration
Create a `.env.local` file with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://vxlxlbffjlryuanijbec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Running the Application
The Client relies on the FastAPI Backend to fetch records. Use the root `run_project.sh` script to launch the full stack environment, or independently via:
```bash
npm install
npm run dev
```
The Client operates natively on [http://localhost:3000](http://localhost:3000).
