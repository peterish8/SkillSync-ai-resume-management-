import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--green-500)] opacity-[0.03] blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[var(--status-applied)] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      
      {/* Header */}
      <nav className="w-full px-6 py-6 absolute top-0 z-10 w-full animate-fade-in-up">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/websiteicon.png" alt="SkillSync Logo" className="w-10 h-10 rounded-xl object-contain shadow-[0_0_20px_rgba(62,207,142,0.3)]" />
            <span className="text-xl font-bold text-white tracking-tight">SkillSync</span>
          </Link>
          <Link 
            href="/" 
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-4 py-2 rounded-lg hover:border-[var(--border-medium)]"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-full max-w-[440px]">
          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
              Welcome back
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Track applications, optimize your resume, and land your next role.
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm />

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
            <p className="text-center text-xs uppercase tracking-widest font-bold text-[var(--text-tertiary)] mb-6">
              Used by candidates at
            </p>
            <div className="flex items-center justify-center gap-8 opacity-40 hover:opacity-60 transition-opacity">
              {/* Simple text logos for aesthetic matching */}
              <div className="text-sm font-bold text-white tracking-widest">GOOGLE</div>
              <div className="text-sm font-bold text-white tracking-widest">AMAZON</div>
              <div className="text-sm font-bold text-white tracking-widest">META</div>
              <div className="text-sm font-bold text-white tracking-widest">NETFLIX</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span>© 2024 SkillSync. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
