import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      {/* ===== RADIAL GRADIENT BACKGROUND (Supabase-style) ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top radial glow (green) */}
        <div 
          className="absolute"
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(62, 207, 142, 0.12), transparent 50%)',
          }}
        />
        {/* Side accent (purple) */}
        <div 
          className="absolute"
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 40%)',
          }}
        />
        {/* Bottom subtle glow */}
        <div 
          className="absolute"
          style={{
            width: '100%',
            height: '100%',
            bottom: 0,
            left: 0,
            background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(62, 207, 142, 0.05), transparent 50%)',
          }}
        />
      </div>

      {/* ===== NAVIGATION (Dynamic Island Style) ===== */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-black/50 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/websiteicon.png" alt="SkillSync Logo" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-contain" />
            <span className="text-lg font-bold text-white tracking-tight">SkillSync</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors duration-300">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors duration-300">How it works</a>
            <a href="#about" className="text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors duration-300">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth"
              className="text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors duration-300 hidden sm:block"
            >
              Log in
            </Link>
            <Link 
              href="/auth"
              className="px-5 py-2 gradient-primary-bg text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-[#3ECF8E]/30 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION (Premium Dark with Radial Glow) ===== */}
      <section className="relative pt-32 pb-20 px-6 noise-overlay">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge with glow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 rounded-full mb-8 animate-glow-pulse">
                <span className="text-lg">✨</span>
                <span className="text-sm font-medium text-[#3ECF8E]">AI-Powered Resume Platform</span>
              </div>

              {/* Headline - Ultra bold, tight spacing */}
              <h1 className="text-4xl md:text-5xl lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6 animate-fade-in-up">
                Stop Losing Track.<br/>
                <span className="gradient-text">Start Landing Interviews.</span>
              </h1>

              {/* Subheadline - Spotify gray */}
              <p className="text-lg md:text-xl text-[#B3B3B3] max-w-[560px] mb-10 leading-relaxed font-normal animate-fade-in-up animate-delay-100">
                The AI job tracker that actually helps you get hired.
                Get instant resume feedback, organize applications, 
                and never lose momentum again.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-start animate-fade-in-up animate-delay-200">
                <Link
                  href="/auth"
                  className="px-8 py-4 gradient-primary-bg text-white font-bold rounded-full text-lg animate-pulse-glow inline-flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 0 0 rgba(62, 207, 142, 0.4), 0 10px 40px rgba(62, 207, 142, 0.3)'
                  }}
                >
                  Start tracking free
                  <span className="animate-slide-right">→</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-4 text-[#B3B3B3] font-medium hover:text-white transition-colors duration-300 text-lg inline-flex items-center gap-2 group hover:underline hover:underline-offset-4"
                >
                  See how it works
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

              {/* Trust Text */}
              <p className="mt-8 text-sm text-[#6B7280] animate-fade-in-up animate-delay-300">
                Free forever • No credit card required
              </p>
            </div>

            {/* Right Side - Bento Grid Mockup (Dark Glassmorphism) */}
            <div className="relative hidden lg:block perspective-container">
              <div className="relative perspective-tilt">
                {/* Main Dashboard Preview */}
                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    <span className="ml-2 text-xs text-[#6B7280]">SkillSync Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-[#3ECF8E]/10 rounded-lg w-3/4"></div>
                    <div className="h-8 bg-[#3ECF8E]/5 rounded-lg w-full"></div>
                    <div className="h-8 bg-[#3ECF8E]/15 rounded-lg w-5/6"></div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-20 bg-[#222222] rounded-lg border border-white/5"></div>
                      <div className="h-20 bg-[#222222] rounded-lg border border-white/5"></div>
                      <div className="h-20 bg-[#3ECF8E]/10 rounded-lg border border-[#3ECF8E]/20"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards (Dark Glass) */}
                <div className="absolute -top-4 -left-6 bg-[#1A1A1A]/90 backdrop-blur-xl rounded-xl p-4 border border-white/10 animate-float shadow-xl shadow-black/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Resume Score</p>
                      <p className="text-lg font-bold text-[#3ECF8E]">87/100</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-6 top-1/4 bg-[#1A1A1A]/90 backdrop-blur-xl rounded-xl p-4 border border-white/10 animate-float-slow shadow-xl shadow-black/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Interviews</p>
                      <p className="text-lg font-bold text-[#3ECF8E]">5 This Week</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 left-1/4 bg-[#1A1A1A]/90 backdrop-blur-xl rounded-xl p-4 border border-[#3ECF8E]/20 animate-float-reverse shadow-xl shadow-black/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl icon-glow">💡</span>
                    <div>
                      <p className="text-sm font-semibold text-white">AI Suggestions</p>
                      <p className="text-sm text-[#B3B3B3]">3 Ready to Apply</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR (Subtle Dark) ===== */}
      <section className="py-10 px-6 border-y border-white/[0.03] bg-[#0A0A0A] relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-medium text-[#B3B3B3] mb-8 tracking-wide">
            Join <span className="text-white font-bold">10,000+</span> job seekers who track smarter
          </p>
          <div className="flex items-center justify-center gap-12 md:gap-16 flex-wrap">
            <span className="text-lg font-semibold grayscale-hover cursor-default">Google</span>
            <span className="text-lg font-semibold grayscale-hover cursor-default">Microsoft</span>
            <span className="text-lg font-semibold grayscale-hover cursor-default">Amazon</span>
            <span className="text-lg font-semibold grayscale-hover cursor-default">Meta</span>
            <span className="text-lg font-semibold grayscale-hover cursor-default">Apple</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (Cards with Glow) ===== */}
      <section id="features" className="py-24 px-6 relative z-10 overflow-hidden" style={{
        background: '#121212'
      }}>
        {/* Top-right green gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3ECF8E]/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        {/* Bottom-left green gradient */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3ECF8E]/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#3ECF8E] uppercase tracking-wider mb-3">Built for job seekers</p>
            <h2 className="text-3xl md:text-4xl lg:text-[56px] font-bold text-white tracking-tight mb-4 leading-tight">
              Your complete job search<br/>
              <span className="gradient-text">command center</span>
            </h2>
            <p className="text-[#B3B3B3] text-lg max-w-lg mx-auto">
              Powerful tools designed to give you an unfair advantage in your job search.
            </p>
          </div>

          {/* Feature Grid - Glassmorphism Dark */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Feature 1 - AI Resume Doctor */}
            <div className="glass-card rounded-2xl overflow-hidden card-hover relative group">
              <div className="glow-line-top"></div>
              {/* Visual Mockup Area */}
              <div className="relative h-64 bg-gradient-to-br from-[#1E4D3D]/30 to-[#0A0A0A] p-6 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3ECF8E]/20"></div>
                  <div className="w-3 h-3 rounded-full bg-[#3ECF8E]/40"></div>
                  <div className="w-3 h-3 rounded-full bg-[#3ECF8E]"></div>
                </div>
                
                {/* Resume Mockup */}
                <div className="absolute bottom-0 left-6 right-6 bg-[#1A1A1A] rounded-t-xl shadow-2xl p-4 border border-white/10 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#3ECF8E]/20 flex items-center justify-center">
                      <span className="text-lg">📝</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-[#333] rounded w-24 mb-1"></div>
                      <div className="h-2 bg-[#222] rounded w-16"></div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#3ECF8E]">87</span>
                      <span className="text-xs text-[#6B7280]">/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#3ECF8E] text-sm">✓</span>
                      <div className="h-2 bg-[#3ECF8E]/20 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-sm">!</span>
                      <div className="h-2 bg-yellow-500/20 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#3ECF8E] text-sm">✓</span>
                      <div className="h-2 bg-[#3ECF8E]/20 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">AI Resume Doctor</h3>
                <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
                  Get brutally honest feedback in 30 seconds. Our AI scores your resume and tells you exactly what's keeping you from interviews.
                </p>
                <a href="#" className="text-[#3ECF8E] font-semibold text-sm inline-flex items-center gap-2 group/link hover:gap-3 transition-all">
                  See how AI helps
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Feature 2 - Visual Application Board */}
            <div className="glass-card rounded-2xl overflow-hidden card-hover relative group">
              <div className="glow-line-top"></div>
              {/* Visual Mockup Area */}
              <div className="relative h-64 bg-gradient-to-br from-[#1E4D3D]/30 to-[#0A0A0A] p-6 overflow-hidden">
                {/* Kanban Board Mockup */}
                <div className="flex gap-3 h-full">
                  {/* Applied Column */}
                  <div className="flex-1 bg-[#1A1A1A]/80 rounded-lg p-3 border border-white/5">
                    <div className="text-xs font-semibold text-[#B3B3B3] mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Applied
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#222] rounded-md p-2 border border-white/5 group-hover:border-[#3ECF8E]/20 transition-colors">
                        <div className="h-2 bg-[#333] rounded w-16 mb-1"></div>
                        <div className="h-1.5 bg-[#2A2A2A] rounded w-12"></div>
                      </div>
                      <div className="bg-[#222] rounded-md p-2 border border-white/5">
                        <div className="h-2 bg-[#333] rounded w-14 mb-1"></div>
                        <div className="h-1.5 bg-[#2A2A2A] rounded w-10"></div>
                      </div>
                    </div>
                  </div>
                  {/* Interview Column */}
                  <div className="flex-1 bg-[#1A1A1A]/80 rounded-lg p-3 border border-white/5">
                    <div className="text-xs font-semibold text-[#B3B3B3] mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                      Interview
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#222] rounded-md p-2 border border-yellow-500/20 transform group-hover:scale-105 transition-transform">
                        <div className="h-2 bg-yellow-500/20 rounded w-16 mb-1"></div>
                        <div className="h-1.5 bg-[#2A2A2A] rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                  {/* Offer Column */}
                  <div className="flex-1 bg-[#1A1A1A]/80 rounded-lg p-3 border border-white/5">
                    <div className="text-xs font-semibold text-[#B3B3B3] mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#3ECF8E]"></span>
                      Offer
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#3ECF8E]/10 rounded-md p-2 border border-[#3ECF8E]/20">
                        <div className="h-2 bg-[#3ECF8E]/30 rounded w-16 mb-1"></div>
                        <div className="h-1.5 bg-[#3ECF8E]/10 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Visual Application Board</h3>
                <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
                  Drag-and-drop simplicity. Watch your applications move from 'Applied' to 'Offer'. Finally, a clear picture of your progress.
                </p>
                <a href="#" className="text-[#3ECF8E] font-semibold text-sm inline-flex items-center gap-2 group/link hover:gap-3 transition-all">
                  See the board
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Feature 3 - Know What's Working */}
            <div className="glass-card rounded-2xl overflow-hidden card-hover relative group">
              <div className="glow-line-top"></div>
              {/* Visual Mockup Area */}
              <div className="relative h-64 bg-gradient-to-br from-[#1E4D3D]/30 to-[#0A0A0A] p-6 overflow-hidden">
                {/* Analytics Mockup */}
                <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-4 border border-white/10 transform group-hover:-translate-y-1 transition-transform duration-500">
                  {/* Chart Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-semibold text-white">Response Rate</div>
                    <div className="flex items-center gap-1 text-[#3ECF8E] text-xs font-medium">
                      <span>↑</span> 23%
                    </div>
                  </div>
                  {/* Bar Chart */}
                  <div className="flex items-end gap-2 h-20">
                    <div className="flex-1 bg-[#333] rounded-t h-8"></div>
                    <div className="flex-1 bg-[#3ECF8E]/30 rounded-t h-12"></div>
                    <div className="flex-1 bg-[#3ECF8E]/40 rounded-t h-10"></div>
                    <div className="flex-1 bg-[#3ECF8E]/60 rounded-t h-16"></div>
                    <div className="flex-1 bg-[#3ECF8E]/80 rounded-t h-14"></div>
                    <div className="flex-1 bg-[#3ECF8E] rounded-t h-20"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-[#6B7280]">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute bottom-4 right-4 bg-[#1A1A1A] rounded-lg shadow-xl p-3 text-center border border-[#3ECF8E]/20">
                  <div className="text-2xl font-bold text-[#3ECF8E]">68%</div>
                  <div className="text-[10px] text-[#6B7280]">Interview Rate</div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Know What's Working</h3>
                <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
                  Which companies respond fastest? What's your interview rate? Get insights that actually help you adjust your strategy.
                </p>
                <a href="#" className="text-[#3ECF8E] font-semibold text-sm inline-flex items-center gap-2 group/link hover:gap-3 transition-all">
                  View insights
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Feature 4 - Your Data, Locked Down */}
            <div className="glass-card rounded-2xl overflow-hidden card-hover relative group">
              <div className="glow-line-top"></div>
              {/* Visual Mockup Area */}
              <div className="relative h-64 bg-gradient-to-br from-[#1E4D3D]/30 to-[#0A0A0A] p-6 overflow-hidden flex items-center justify-center">
                {/* Security Visual */}
                <div className="relative">
                  {/* Shield */}
                  <div className="w-24 h-28 bg-gradient-to-b from-[#3ECF8E] to-[#2FA370] rounded-t-full rounded-b-lg flex items-center justify-center shadow-2xl shadow-[#3ECF8E]/30 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  {/* Floating Lock Icons */}
                  <div className="absolute -top-2 -left-8 w-10 h-10 bg-[#1A1A1A] rounded-lg shadow-xl border border-white/10 flex items-center justify-center animate-float">
                    <span className="text-lg">🔐</span>
                  </div>
                  <div className="absolute -bottom-2 -right-8 w-10 h-10 bg-[#1A1A1A] rounded-lg shadow-xl border border-white/10 flex items-center justify-center animate-float-slow">
                    <span className="text-lg">🛡️</span>
                  </div>
                </div>
                
                {/* Encryption Badge */}
                <div className="absolute bottom-4 left-4 bg-[#1A1A1A] rounded-lg shadow-xl px-3 py-2 flex items-center gap-2 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse"></div>
                  <span className="text-xs font-medium text-white">AES-256 Encrypted</span>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Your Data, Locked Down</h3>
                <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
                  Bank-level encryption. Zero data sharing. Your job search stays between you and SkillSync.
                </p>
                <a href="#" className="text-[#3ECF8E] font-semibold text-sm inline-flex items-center gap-2 group/link hover:gap-3 transition-all">
                  Security details
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASES SECTION (Abstract Lines Background) ===== */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0A0A0A] relative z-10 abstract-lines-pattern overflow-hidden">
        {/* Top-left green gradient (Very Subtle) */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#3ECF8E]/[0.02] blur-[120px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
        {/* Bottom-right green gradient (Very Subtle) */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#3ECF8E]/[0.02] blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>
        
        {/* Extra "Mixed Up" Glowing Lines (Subtle) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[20%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#3ECF8E]/20 to-transparent rotate-12 blur-[1px]"></div>
          <div className="absolute top-[60%] right-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/15 to-transparent -rotate-6 blur-[1px]"></div>
          <div className="absolute bottom-[30%] left-[20%] w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#3ECF8E]/15 to-transparent rotate-45 blur-[2px]"></div>
          <div className="absolute top-[10%] right-[30%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/10 to-transparent -rotate-45 blur-[2px]"></div>
        </div>
        <div className="max-w-5xl mx-auto relative">
          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Use Cases
            </h2>
            <p className="text-[#B3B3B3] text-base max-w-md">
              SkillSync is designed with unlimited flexibility under the hood.
            </p>
          </div>

          {/* Use Cases List */}
          <div className="space-y-16">
            
            {/* Use Case 1 - Career Changers */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              <div className="flex-1 max-w-md">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                  Career<br/>Changers
                </h3>
                <p className="text-[#B3B3B3] text-lg leading-relaxed max-w-sm">
                  As a career changer, every aspect of your job search requires extra attention. SkillSync helps you tailor resumes for new industries, track applications across different fields, and focus on what's actually getting responses.
                </p>
              </div>
              <div className="flex-shrink-0 group">
                {/* Illustration - Person with briefcase */}
                <div className="relative w-64 h-64 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 group-hover:-translate-y-2">
                  <div className="absolute inset-0 flex items-end justify-center">
                    {/* Person */}
                    <div className="relative">
                      {/* Head */}
                      <div className="w-16 h-16 rounded-full bg-[#3ECF8E] mx-auto mb-1 shadow-[0_0_30px_rgba(62,207,142,0.3)]"></div>
                      {/* Body */}
                      <div className="w-20 h-24 bg-[#1A1A1A] rounded-t-full mx-auto border border-white/10 group-hover:border-[#3ECF8E]/30 transition-colors"></div>
                      {/* Briefcase */}
                      <div className="absolute -right-10 bottom-6 transform group-hover:rotate-6 transition-transform">
                        <div className="w-12 h-10 bg-[#222] rounded-sm border border-white/10"></div>
                        <div className="w-8 h-1 bg-[#3ECF8E] mx-auto -mt-8 rounded"></div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute top-4 right-8 w-3 h-3 rounded-full bg-[#3ECF8E] animate-pulse"></div>
                  <div className="absolute top-12 right-2 w-2 h-2 rounded-full bg-[#3ECF8E]/50"></div>
                </div>
              </div>
            </div>

            {/* Use Case 2 - Fresh Graduates */}
            <div className="flex flex-col md:flex-row-reverse items-start gap-8 md:gap-12">
              <div className="flex-1 max-w-md md:text-left">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                  Fresh<br/>Graduates
                </h3>
                <p className="text-[#B3B3B3] text-lg leading-relaxed max-w-sm">
                  Breaking into your first job is overwhelming. With SkillSync, you can organize your mass applications, get AI feedback to strengthen weak resumes, and never lose track of where you applied.
                </p>
              </div>
              <div className="flex-shrink-0 group">
                {/* Illustration - Group of people */}
                <div className="relative w-64 h-64 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1 group-hover:-translate-y-2">
                  <div className="absolute inset-0 flex items-end justify-center gap-4">
                    {/* Person 1 */}
                    <div className="relative transform translate-y-2 group-hover:translate-y-0 transition-transform delay-75">
                      <div className="w-10 h-10 rounded-full bg-[#3ECF8E] mx-auto mb-1 shadow-[0_0_20px_rgba(62,207,142,0.2)]"></div>
                      <div className="w-12 h-16 bg-[#1A1A1A] rounded-t-full mx-auto border border-white/10"></div>
                    </div>
                    {/* Person 2 (taller) */}
                    <div className="relative -mb-2 z-10">
                      <div className="w-14 h-14 rounded-full bg-[#3ECF8E] mx-auto mb-1 shadow-[0_0_30px_rgba(62,207,142,0.4)]"></div>
                      <div className="w-16 h-24 bg-[#222] rounded-t-full mx-auto border border-white/10 group-hover:border-[#3ECF8E]/30 transition-colors"></div>
                    </div>
                    {/* Person 3 */}
                    <div className="relative transform translate-y-2 group-hover:translate-y-0 transition-transform delay-100">
                      <div className="w-10 h-10 rounded-full bg-[#3ECF8E] mx-auto mb-1 shadow-[0_0_20px_rgba(62,207,142,0.2)]"></div>
                      <div className="w-12 h-16 bg-[#1A1A1A] rounded-t-full mx-auto border border-white/10"></div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-[#3ECF8E]/30 animate-pulse"></div>
                  <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-[#3ECF8E]"></div>
                </div>
              </div>
            </div>

            {/* Use Case 3 - Working Professionals */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              <div className="flex-1 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">Working<br/>Professionals</h3>
                  <span className="self-start mt-2 px-3 py-1 bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-[#3ECF8E] text-xs font-bold uppercase tracking-wider rounded-full">Case study</span>
                </div>
                <p className="text-[#B3B3B3] text-lg leading-relaxed max-w-sm">
                  Learn how a senior developer at a Fortune 500 company uses SkillSync to quietly manage their job search – tracking 24 applications while staying employed.
                </p>
              </div>
              <div className="flex-shrink-0 group">
                {/* Illustration - Person with laptop */}
                <div className="relative w-64 h-64 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 group-hover:-translate-y-2">
                  <div className="absolute inset-0 flex items-end justify-center">
                    {/* Person at desk */}
                    <div className="relative">
                      {/* Head */}
                      <div className="w-16 h-16 rounded-full bg-[#3ECF8E] mx-auto mb-1 shadow-[0_0_30px_rgba(62,207,142,0.3)]"></div>
                      {/* Body */}
                      <div className="w-24 h-20 bg-[#1A1A1A] rounded-t-xl mx-auto border border-white/10 group-hover:border-[#3ECF8E]/30 transition-colors"></div>
                      {/* Desk/Laptop */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#333] rounded-sm shadow-lg"></div>
                      {/* Laptop screen */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-14 bg-[#1A1A1A] rounded-t-md border border-white/10 group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                        <div className="w-14 h-8 bg-[#3ECF8E]/30 rounded mx-auto mt-3 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  {/* Coffee cup */}
                  <div className="absolute bottom-10 right-8 transform group-hover:rotate-12 transition-transform delay-100">
                    <div className="w-6 h-8 bg-[#3ECF8E] rounded-b-lg shadow-[0_0_15px_rgba(62,207,142,0.4)]"></div>
                    <div className="w-2 h-4 bg-[#3ECF8E] rounded-full absolute -right-1 top-1"></div>
                    {/* Steam */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/20 rounded-full animate-float"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION (Bold, High Contrast) ===== */}
      <section className="py-32 px-6 relative overflow-hidden" style={{
        background: `
          radial-gradient(ellipse 100% 60% at 50% 50%, rgba(62, 207, 142, 0.15), transparent 70%),
          radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1), transparent),
          #0A0A0A
        `
      }}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-[#3ECF8E] text-sm font-bold mb-6 uppercase tracking-[0.1em]">
            Ready to organize your job search?
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[64px] font-extrabold text-white tracking-tight mb-10 leading-[1.1]">
            Join 10,000+ job seekers<br/>
            who track smarter.
          </h2>
          <Link
            href="/auth"
            className="inline-flex items-center gap-3 px-12 py-5 text-[#0A0A0A] font-extrabold rounded-full text-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #3ECF8E 0%, #1DB954 100%)',
              boxShadow: '0 0 0 0 rgba(62, 207, 142, 0.4), 0 20px 60px rgba(62, 207, 142, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            Start tracking free
            <span>→</span>
          </Link>
          <p className="text-[#6B7280] text-sm mt-6 mb-10">
            No credit card • Forever free • 2-minute setup
          </p>
          
          {/* Trust Badges (Glass Pills) */}
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A]/60 backdrop-blur-xl rounded-full border border-white/10 text-[#B3B3B3] text-sm">
              <span>🔒</span> Encrypted
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A]/60 backdrop-blur-xl rounded-full border border-white/10 text-[#B3B3B3] text-sm">
              <span>⚡</span> Instant Setup
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A]/60 backdrop-blur-xl rounded-full border border-white/10 text-[#B3B3B3] text-sm">
              <span>💯</span> Free Forever
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER (Sophisticated Dark) ===== */}
      <footer id="about" className="py-16 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Logo & Tagline */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/websiteicon.png" alt="SkillSync Logo" className="w-9 h-9 rounded-lg object-contain shadow-lg shadow-[#3ECF8E]/20" />
                <span className="text-lg font-semibold text-white">SkillSync</span>
              </div>
              <p className="text-[#6B7280] text-sm max-w-xs">
                Track smarter, land faster. The AI-powered job application tracker built for ambitious job seekers.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Features</a></li>
                <li><a href="#how-it-works" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">How it works</a></li>
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Resume Tips</a></li>
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Interview Guide</a></li>
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Blog</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Privacy</a></li>
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Terms</a></li>
                <li><a href="#" className="text-[#6B7280] hover:text-[#3ECF8E] text-sm transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B7280]">
              © {new Date().getFullYear()} SkillSync. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 text-[#6B7280] hover:text-[#3ECF8E] hover:border-[#3ECF8E]/20 hover:shadow-lg hover:shadow-[#3ECF8E]/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 text-[#6B7280] hover:text-[#3ECF8E] hover:border-[#3ECF8E]/20 hover:shadow-lg hover:shadow-[#3ECF8E]/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 text-[#6B7280] hover:text-[#3ECF8E] hover:border-[#3ECF8E]/20 hover:shadow-lg hover:shadow-[#3ECF8E]/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
