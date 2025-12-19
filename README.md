# SkillSync

AI-Powered Resume & Job Tracker Platform.

## Features
- **Authentication**: Secure email/password login via Supabase.
- **Resume Analysis**: AI-powered scoring and feedback using OpenAI.
- **Application Tracking**: Kanban-style status tracking for job applications.
- **Dashboard**: Real-time overview of your job hunt progress.

## Tech Stack
- Next.js 14+ (App Router)
- Supabase (Auth & Database)
- OpenAI API
- Tailwind CSS

## Setup

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   OPENAI_API_KEY=your-openai-key
   ```

3. **Database Setup**
   Run the SQL commands provided in the PRD (or `database_schema.sql`) in your Supabase SQL Editor to create tables (`resumes`, `applications`) and set up RLS policies.

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment
Push to GitHub and deploy on Vercel. Add environment variables in Vercel settings.
