# SkillSync – AI Resume & Job Tracker Platform
## Complete Implementation Plan

This document provides a detailed, step-by-step implementation guide for building the SkillSync platform from scratch. Any AI assistant or developer can follow this plan to complete the project.

---

## 1. Project Overview

**SkillSync** is a modern AI-powered resume management and job application tracking system built with:
- **Frontend**: Next.js 16 + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes + Supabase
- **AI**: Google Gemini API (2.5 Flash)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

---

## 2. Tech Stack & Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "16.1.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "@google/generative-ai": "^0.x",
    "react-pdf": "^7.x",
    "pdf-parse": "^1.x",
    "react-beautiful-dnd": "^13.x",
    "zustand": "^4.x",
    "zod": "^3.x",
    "date-fns": "^3.x",
    "lucide-react": "^0.x",
    "recharts": "^2.x"
  },
  "devDependencies": {
    "vitest": "^1.x",
    "@testing-library/react": "^14.x"
  }
}
```

---

## 3. Folder Structure

```
ai-resume-management/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Main dashboard
│   │   ├── resumes/
│   │   │   ├── page.tsx            # Resume list
│   │   │   ├── [id]/page.tsx       # Resume detail/edit
│   │   │   └── new/page.tsx        # Create new resume
│   │   ├── jobs/
│   │   │   ├── page.tsx            # Job tracker (Kanban)
│   │   │   ├── [id]/page.tsx       # Job detail
│   │   │   └── new/page.tsx        # Add new job
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   ├── resumes/
│   │   │   ├── route.ts            # GET all, POST create
│   │   │   ├── [id]/route.ts       # GET, PUT, DELETE
│   │   │   └── parse/route.ts      # PDF parsing with AI
│   │   ├── jobs/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── ai/
│   │       ├── analyze/route.ts    # Resume analysis
│   │       ├── match/route.ts      # Job matching
│   │       └── generate/route.ts   # Cover letter generation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Landing page
├── components/
│   ├── ui/                         # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── resume/
│   │   ├── ResumeCard.tsx
│   │   ├── ResumeEditor.tsx
│   │   ├── ResumePreview.tsx
│   │   └── ResumeUpload.tsx
│   ├── job/
│   │   ├── JobCard.tsx
│   │   ├── JobKanban.tsx
│   │   └── JobForm.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       ├── ActivityFeed.tsx
│       └── Charts.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── middleware.ts           # Auth middleware
│   ├── gemini/
│   │   └── client.ts               # Gemini API client
│   ├── utils/
│   │   ├── pdf.ts                  # PDF parsing utilities
│   │   └── helpers.ts
│   └── validations/
│       ├── resume.ts               # Zod schemas
│       └── job.ts
├── stores/
│   ├── authStore.ts
│   ├── resumeStore.ts
│   └── jobStore.ts
├── types/
│   ├── resume.ts
│   ├── job.ts
│   └── user.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useResumes.ts
│   └── useJobs.ts
└── public/
    └── ...
```

---

## 4. Database Schema (Supabase)

### SQL Migration File
Create file: `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE public.resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  raw_text TEXT,                    -- Extracted text from PDF
  parsed_data JSONB,                -- AI-parsed structured data
  file_url TEXT,                    -- Supabase storage URL
  version INTEGER DEFAULT 1,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume sections (for builder)
CREATE TABLE public.resume_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  section_type TEXT NOT NULL,       -- 'experience', 'education', 'skills', etc.
  content JSONB NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications table
CREATE TABLE public.job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_description TEXT,
  job_url TEXT,
  salary_range TEXT,
  location TEXT,
  remote_type TEXT,                 -- 'remote', 'hybrid', 'onsite'
  status TEXT DEFAULT 'saved',      -- 'saved', 'applied', 'interview', 'offer', 'rejected'
  applied_date DATE,
  deadline DATE,
  notes TEXT,
  match_score INTEGER,              -- AI-calculated match percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Application Timeline/Activities
CREATE TABLE public.job_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,      -- 'status_change', 'note', 'interview', etc.
  description TEXT,
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis Results (cached)
CREATE TABLE public.ai_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  analysis_type TEXT NOT NULL,      -- 'resume_review', 'job_match', 'skill_gap'
  input_data JSONB,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for resumes
CREATE POLICY "Users can view own resumes" ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own resumes" ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON public.resumes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for job applications
CREATE POLICY "Users can view own jobs" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own jobs" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.job_applications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON public.job_applications
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_jobs_user_id ON public.job_applications(user_id);
CREATE INDEX idx_jobs_status ON public.job_applications(status);
```

---

## 5. Environment Variables

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Implementation Phases

### Phase 1: Foundation & Setup
1. Install all dependencies
2. Create folder structure
3. Set up environment variables
4. Configure Supabase project and run migrations
5. Create base UI components (Button, Input, Card, Modal)

### Phase 2: Authentication
1. Set up Supabase client (browser & server)
2. Create middleware for protected routes
3. Build login page with form validation
4. Build signup page
5. Add user profile management

### Phase 3: Resume Management
1. Create TypeScript types for resumes
2. Build resume upload component (PDF)
3. Implement PDF text extraction
4. Integrate Gemini API for parsing
5. Create resume list page
6. Build resume editor/builder
7. Add resume preview and export

### Phase 4: Job Tracking
1. Create TypeScript types for jobs
2. Build Kanban board component
3. Implement drag-and-drop
4. Create job form (add/edit)
5. Add job detail page
6. Implement activity timeline

### Phase 5: AI Features
1. Resume analysis endpoint
2. Job description matching
3. Skill gap analysis
4. Cover letter generation

### Phase 6: Dashboard
1. Create dashboard layout
2. Build stats cards
3. Add charts with Recharts
4. Create activity feed

### Phase 7: Testing & Deployment
1. Configure Vitest
2. Write unit tests
3. Manual testing
4. Deploy to Vercel

---

## 7. Key Code Snippets

### Supabase Browser Client
```tsx
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Supabase Server Client
```tsx
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { }
        },
      },
    }
  );
}
```

### Auth Middleware
```tsx
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### Gemini AI Client
```tsx
// lib/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function parseResumeWithAI(resumeText: string) {
  const prompt = `Parse this resume into structured JSON with contact, summary, experience, education, skills, certifications, and projects...`;
  const result = await geminiModel.generateContent(prompt);
  return JSON.parse(result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
}

export async function analyzeResume(resumeData: any, jobDescription?: string) {
  // Returns: overallScore, strengths, improvements, matchScore (if job provided)
}

export async function generateCoverLetter(resumeData: any, jobDescription: string, companyName: string) {
  // Returns personalized cover letter text
}
```

### Resume Types
```tsx
// types/resume.ts
export interface Resume {
  id: string;
  user_id: string;
  title: string;
  summary?: string;
  raw_text?: string;
  parsed_data?: ParsedResumeData;
  file_url?: string;
  version: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParsedResumeData {
  contact: { name: string; email: string; phone?: string; location?: string; linkedin?: string; };
  summary?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  certifications?: string[];
  projects?: ProjectItem[];
}
```

### Job Types
```tsx
// types/job.ts
export interface JobApplication {
  id: string;
  user_id: string;
  resume_id?: string;
  company_name: string;
  position_title: string;
  job_description?: string;
  job_url?: string;
  salary_range?: string;
  location?: string;
  remote_type?: 'remote' | 'hybrid' | 'onsite';
  status: JobStatus;
  applied_date?: string;
  deadline?: string;
  notes?: string;
  match_score?: number;
  created_at: string;
  updated_at: string;
}

export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
```

---

## 8. Testing Checklist

### Unit Tests
- [ ] Gemini client parses resume correctly
- [ ] UI components render properly
- [ ] Auth hooks work correctly

### Integration Tests
- [ ] API routes return correct data
- [ ] Database operations work with RLS

### Manual Testing
- [ ] Sign up / Sign in flow
- [ ] Resume upload and parsing
- [ ] Job tracking Kanban
- [ ] AI analysis features
- [ ] Responsive design

---

## 9. Deployment

### Vercel Setup
1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Production Checklist
- [ ] Environment variables set
- [ ] Supabase RLS enabled
- [ ] Custom domain configured
- [ ] Error monitoring (optional)

---

## 10. Commands

```bash
npm install                 # Install dependencies
npm run dev                 # Start dev server
npm run build               # Production build
npm run test                # Run tests
npm run lint                # Lint code
```

---

**Last Updated:** December 2024
