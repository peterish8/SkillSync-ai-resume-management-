# SkillSync - Setup Guide

This guide explains how to set up and run the project after downloading/cloning.

---

## Prerequisites

Make sure you have installed:
- **Node.js** v18.17 or later ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm**
- **Git** ([Download](https://git-scm.com/))

---

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-resume-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Additional Required Packages
```bash
# Supabase (Database & Auth)
npm install @supabase/supabase-js @supabase/ssr

# Google Gemini AI
npm install @google/generative-ai

# State Management
npm install zustand

# Form Validation
npm install zod

# Date utilities
npm install date-fns

# Icons
npm install lucide-react

# Charts
npm install recharts

# PDF handling
npm install react-pdf pdf-parse

# Drag and Drop
npm install react-beautiful-dnd
npm install -D @types/react-beautiful-dnd

# Utility for className merging
npm install clsx tailwind-merge
```

**Or install all at once:**
```bash
npm install @supabase/supabase-js @supabase/ssr @google/generative-ai zustand zod date-fns lucide-react recharts react-pdf pdf-parse react-beautiful-dnd clsx tailwind-merge

npm install -D @types/react-beautiful-dnd
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### How to get these keys:

**Supabase:**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Project Settings → API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

**Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## All Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check for linting errors |

---

## Optional: Testing Setup

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react

# Run tests
npm run test
```

---

## Project Structure

```
ai-resume-management/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
├── lib/                  # Utilities (Supabase, Gemini, helpers)
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── stores/               # Zustand state stores
└── public/               # Static assets
```

---

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Environment variables not working
- Make sure `.env.local` is in the root directory
- Restart the dev server after changing env variables

### Supabase connection issues
- Check if your Supabase URL and keys are correct
- Make sure your Supabase project is active

---

## Need Help?

Refer to `IMPLEMENTATION_PLAN.md` for the complete development guide.
