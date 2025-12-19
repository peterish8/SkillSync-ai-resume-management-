'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart2, 
  Settings, 
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Applications', icon: Briefcase, href: '/dashboard/applications' },
    { name: 'Analytics', icon: BarChart2, href: '/dashboard/analytics', isNew: true },
  ];

  const isActive = (path: string) => pathname === path;

  // Get display name (First Name or Full Name or Email)
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'No email';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="w-60 h-screen fixed left-0 top-0 flex flex-col bg-[var(--bg-primary)] border-r border-[var(--border-subtle)] z-20 transition-all duration-300">
      {/* Logo Area */}
      <div className="p-6">
        <div className="flex items-center gap-3">
            <img src="/websiteicon.png" alt="SkillSync Logo" className="w-9 h-9 rounded-full object-contain shadow-[0_0_15px_rgba(62,207,142,0.3)] bg-black" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">SkillSync</h1>
            <p className="text-[11px] text-[var(--text-tertiary)] font-medium">Track smarter</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.comingSoon ? '#' : item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${active 
                  ? 'bg-[rgba(62,207,142,0.1)] text-[var(--green-500)] border-l-[3px] border-[var(--green-500)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white border-l-[3px] border-transparent'
                }
                ${item.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              <item.icon 
                size={20} 
                className={`
                  transition-all duration-300
                  ${active ? 'drop-shadow-[0_0_8px_rgba(62,207,142,0.5)]' : 'opacity-70 group-hover:opacity-100'}
                `} 
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
          <Link 
            href="/dashboard/settings"
            className={`
              group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive('/dashboard/settings') 
                ? 'bg-[rgba(62,207,142,0.1)] text-[var(--green-500)]' 
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white'
              }
            `}
          >
            <Settings size={20} className="opacity-70 group-hover:opacity-100" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-3">
        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all cursor-pointer group relative">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-[var(--border-medium)]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-medium)]">
                <User size={20} />
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate" title={displayName}>{displayName}</p>
              <p className="text-xs text-[var(--text-tertiary)] truncate" title={displayEmail}>{displayEmail}</p>
            </div>
            <ChevronDown size={16} className="text-[var(--text-tertiary)]" />
          </div>
          
          {/* Dropdown */}
          <div className="absolute bottom-full left-0 w-full hidden group-hover:block px-1 pb-2">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-lg text-sm text-[var(--error)] hover:bg-[rgba(239,68,68,0.1)] transition-colors shadow-xl"
            >
              <LogOut size={16} />
               Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
