'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useGuest } from '@/components/providers/GuestContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { isGuest } = useGuest();

  useEffect(() => {
    const checkUser = async () => {
      if (isGuest) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
      setLoading(false);
    };
    checkUser();
  }, [router, isGuest]);

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans antialiased">
      <Sidebar />
      
      {/* Main Content (Offset by Sidebar width) */}
      <div className="lg:ml-60 min-h-screen flex flex-col transition-all duration-300">
        <Header />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
