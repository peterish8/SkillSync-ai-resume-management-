# SkillSync – AI Resume & Job Tracker Platform

AI-powered resume analysis and job application tracking platform built with modern web technologies.

## ✨ Features

### 🎯 Resume Analysis
- **AI-Powered ATS Scoring** – Get realistic resume scores (0-100) with detailed breakdown
- **Score Categories** – Structure, Skills, Experience, Impact, Professionalism
- **Actionable Feedback** – Strengths, cons, and specific improvements
- **Download Reports** – Export analysis results as text files

### 📋 Application Tracking
- **Kanban Board** – Drag-and-drop status management (Applied → Interview → Offer → Rejected)
- **Table View** – Sortable list view with all application details
- **Search with Dropdown** – Real-time search with autocomplete matching
- **Status Badges** – Color-coded status indicators

### 📊 Dashboard
- **Analytics Overview** – Visual stats for your job search progress
- **AI Insights** – Personalized tips based on your application data
- **Resume History** – Access previous resume analysis sessions

### 🔐 Authentication
- **Secure Login** – Email/password authentication via Supabase
- **Password Strength Indicator** – Visual feedback during signup
- **Protected Routes** – Dashboard only accessible when logged in

## 🛠 Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Variables (Dark Theme)
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenRouter API (Gemini, Llama, Mistral models)
- **Drag & Drop**: dnd-kit

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/peterish8/SkillSync-ai-resume-management-.git
cd ai-resume-management
npm install
```

### 2. Environment Variables

Create `.env.local` in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter AI (supports up to 3 keys with automatic fallback)
OPENROUTER_API_KEY=your_primary_key
OPENROUTER_FALLBACK_API_KEY=your_second_key          # Optional
OPENROUTER_FALLBACK_API_KEY_2=your_third_key         # Optional

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL commands in your Supabase SQL Editor to create:
- `resumes` table – Stores resume text and AI analysis
- `applications` table – Stores job applications
- RLS policies – Row-level security for user data

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## 🎨 Design

- **Dark Theme** – Premium dark UI with green accent colors
- **Responsive** – Works on desktop and mobile
- **Modern Aesthetics** – Glassmorphism, smooth animations, subtle gradients

## 📦 Deployment

1. Push to GitHub
2. Deploy on Vercel
3. Add environment variables in Vercel settings
4. Connect your Supabase project

## 📝 License

MIT License
