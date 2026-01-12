'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';
import { useGuest } from './providers/GuestContext';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginAsGuest } = useGuest();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          router.push('/dashboard');
        } else {
          setError("Check your email to confirm your account, then log in.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden backdrop-blur-sm relative group">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--green-500)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50">
        <button
          type="button"
          onClick={() => { setIsLogin(true); setError(null); }}
          className={`relative flex-1 py-4 text-sm font-semibold transition-all duration-300 ${
            isLogin 
              ? 'text-white bg-[var(--bg-secondary)]' 
              : 'text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-secondary)]/50'
          }`}
        >
          Log in
          {isLogin && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--green-500)] shadow-[0_-2px_8px_rgba(62,207,142,0.4)]"></div>}
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(false); setError(null); }}
          className={`relative flex-1 py-4 text-sm font-semibold transition-all duration-300 ${
            !isLogin 
              ? 'text-white bg-[var(--bg-secondary)]' 
              : 'text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-secondary)]/50'
          }`}
        >
          Sign up
          {!isLogin && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--green-500)] shadow-[0_-2px_8px_rgba(62,207,142,0.4)]"></div>}
        </button>
      </div>

      <div className="p-8">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/dashboard`
              }
            });
          }}
          className="w-full py-3.5 px-4 bg-[var(--bg-input)] border border-[var(--border-medium)] text-white font-medium rounded-xl hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-strong)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
            <span className="px-4 bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">or continue with email</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 text-sm text-[var(--error)] bg-[rgba(239,68,68,0.1)] rounded-lg border border-[rgba(239,68,68,0.2)] flex items-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-[var(--error)] mt-2 shrink-0"></div>
             {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 ml-1">
              Email Address
            </label>
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--green-500)] transition-colors h-5 w-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-xl text-white placeholder-[var(--text-disabled)] focus:outline-none focus:border-[var(--green-500)] focus:ring-1 focus:ring-[var(--green-500)] transition-all"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 ml-1">
              Password
            </label>
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--green-500)] transition-colors h-5 w-5" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-xl text-white placeholder-[var(--text-disabled)] focus:outline-none focus:border-[var(--green-500)] focus:ring-1 focus:ring-[var(--green-500)] transition-all"
                placeholder="••••••••"
              />
            </div>
            {/* Password Strength Indicator */}
            {!isLogin && (
              <div className="mt-3 ml-1">
                <div className="flex gap-1.5 mb-1.5">
                  {[...Array(4)].map((_, i) => {
                    const strength = (() => {
                      let s = 0;
                      if (!password) return 0;
                      if (password.length > 5) s++;
                      if (password.length > 7) s++;
                      if (/[0-9]/.test(password)) s++;
                      if (/[^A-Za-z0-9]/.test(password)) s++;
                      return s;
                    })();
                    
                    let bg = 'bg-[var(--border-medium)]'; // Default gray
                    if (password) {
                      if (strength === 1) bg = i === 0 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[var(--border-medium)]';
                      if (strength === 2) bg = i <= 1 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-[var(--border-medium)]';
                      if (strength === 3) bg = i <= 2 ? 'bg-[#3ECF8E] shadow-[0_0_10px_rgba(62,207,142,0.5)]' : 'bg-[var(--border-medium)]';
                      if (strength === 4) bg = 'bg-[#3ECF8E] shadow-[0_0_10px_rgba(62,207,142,0.8)]'; // All green for super strong
                    }

                    return (
                      <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${bg}`}
                      ></div>
                    );
                  })}
                </div>
                {password && (
                   <p className="text-[10px] uppercase tracking-wider font-bold text-right transition-colors duration-300" style={{
                     color: 
                       (() => {
                         let s = 0;
                         if (password.length > 5) s++;
                         if (password.length > 7) s++;
                         if (/[0-9]/.test(password)) s++;
                         if (/[^A-Za-z0-9]/.test(password)) s++;
                         return s;
                       })() === 1 ? '#ef4444' :
                       (() => {
                         let s = 0;
                         if (password.length > 5) s++;
                         if (password.length > 7) s++;
                         if (/[0-9]/.test(password)) s++;
                         if (/[^A-Za-z0-9]/.test(password)) s++;
                         return s;
                       })() === 2 ? '#eab308' :
                       '#3ECF8E'
                   }}>
                     {(() => {
                        let s = 0;
                        if (password.length > 5) s++;
                        if (password.length > 7) s++;
                        if (/[0-9]/.test(password)) s++;
                        if (/[^A-Za-z0-9]/.test(password)) s++;
                        if (s === 1) return 'Weak';
                        if (s === 2) return 'Medium';
                        if (s === 3) return 'Strong';
                        if (s >= 4) return 'Super Strong';
                        return '';
                     })()}
                   </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-gradient-to-r from-[var(--green-500)] to-[var(--green-600)] text-white font-bold rounded-xl hover:shadow-[0_8px_24px_rgba(62,207,142,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all text-sm flex items-center justify-center gap-2 group/btn"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing...
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Guest Mode Option */}
        <div className="mt-6 flex flex-col items-center">
             <button
              type="button"
              onClick={loginAsGuest}
              className="group flex items-center gap-2 text-sm font-medium text-[var(--text-tertiary)] hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-[var(--bg-tertiary)]"
            >
              <User className="w-4 h-4" />
              <span>Continue as Guest</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Terms */}
        <p className="mt-8 text-xs text-[var(--text-tertiary)] text-center leading-relaxed max-w-[280px] mx-auto">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[var(--green-500)] hover:text-[var(--green-400)] transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[var(--green-500)] hover:text-[var(--green-400)] transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
