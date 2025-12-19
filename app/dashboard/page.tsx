'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ResumeAnalysis from '@/components/ResumeAnalysis';
import ApplicationList from '@/components/ApplicationList';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsCards from '@/components/dashboard/StatsCards';

export default function Dashboard() {
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

  // Determine the best name to display
  const userName = user?.user_metadata?.full_name?.split(' ')[0] 
    || user?.user_metadata?.name?.split(' ')[0] 
    || user?.user_metadata?.first_name 
    || user?.email?.split('@')[0] 
    || 'there';

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <WelcomeSection userName={userName} />

      {/* Quick Stats */}
      <StatsCards />

      {/* Main Grid: Resume Analysis (60%) vs Applications (40%) */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-8">
        {/* Left Column: Resume Feedback (60%) */}
        <div className="w-full">
          <ResumeAnalysis />
        </div>

        {/* Right Column: Applications (40%) */}
        <div className="w-full">
          <ApplicationList />
        </div>
      </div>
    </div>
  );
}
