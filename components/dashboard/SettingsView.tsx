'use client';

import { useState, useEffect } from 'react';
import { User, Settings, Shield, AlertTriangle, Upload, Save, Monitor, ChevronDown, Loader2, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showLightbox, setShowLightbox] = useState(false);
  const router = useRouter();

  // User State
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-dismiss Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      setUserId(session.user.id);

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setProfile(profileData || { 
        full_name: session.user.user_metadata?.full_name || '', 
        email: session.user.email 
      });

      // Fetch Settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (settingsData) {
        setSettings(settingsData);
      } else {
        const { error } = await supabase.from('user_settings').insert({ id: session.user.id });
        if (!error) {
             setSettings({ id: session.user.id, theme: 'dark', default_view: 'board' });
        }
      }

      setDataLoading(false);
    };
    fetchData();
  }, []);

  // Update Profile Handler
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // 1. Update Profile Data
      const updates = {
        id: userId,
        full_name: profile.full_name,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(updates);

      if (error) throw error;

      // 2. Check & Update Email
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.email && profile.email && session.user.email !== profile.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: profile.email });
        if (emailError) throw emailError;
        showToast('Check your email to verify the change!', 'success');
      } else {
        showToast('Profile updated successfully!', 'success');
      }

    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Settings Handler
  const handleUpdateSetting = async (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ id: userId, [key]: value, updated_at: new Date().toISOString() });

      if (error) throw error;
    } catch (error) {
       console.error('Error updating setting:', error);
       showToast('Failed to save setting', 'error');
    }
  };

  // Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setLoading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({ 
            id: userId, 
            avatar_url: publicUrl, 
            updated_at: new Date().toISOString() 
        }, { onConflict: 'id' }); 

      if (updateError) throw updateError;

      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
      showToast('Avatar updated successfully!', 'success');

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      showToast('Upload failed: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: AlertTriangle },
  ];

  if (dataLoading) return <div className="p-8 text-[var(--text-tertiary)] animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-down">
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md
            ${toast.type === 'success' 
              ? 'bg-[var(--bg-secondary)] border-[var(--green-500)]/50 text-white' 
              : 'bg-[var(--bg-secondary)] border-[var(--error)]/50 text-white'}
          `}>
             {toast.type === 'success' ? <Check size={18} className="text-[var(--green-500)]" /> : <AlertTriangle size={18} className="text-[var(--error)]" />}
             <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[var(--border-subtle)] mb-8 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                ${isActive 
                  ? 'border-[var(--green-500)] text-[var(--green-500)]' 
                  : 'border-transparent text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)]'
                }
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-8 animate-fade-in-up">
        
        {/* ACCOUNT SETTINGS */}
        {activeTab === 'account' && (
          <div className="space-y-8">
            <div className="border-b border-[var(--border-subtle)] pb-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-1">Profile Information</h3>
              <p className="text-sm text-[var(--text-tertiary)]">Update your photo and personal details.</p>
            </div>

            <div className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Profile Picture</label>
                 <div className="flex items-center gap-4">
                   {profile.avatar_url ? (
                     <div 
                       onClick={() => setShowLightbox(true)}
                       className="w-20 h-20 rounded-full border border-[var(--border-medium)] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                     >
                        <img src={profile.avatar_url} className="w-full h-full object-cover" />
                     </div>
                   ) : (
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-tertiary)]">
                      <User size={32} />
                    </div>
                   )}
                   <div className="flex gap-3">
                     <label className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-medium)] rounded-lg text-sm text-white hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                       <Upload size={14} /> Upload
                       <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                     </label>
                     <button className="px-4 py-2 text-sm text-[var(--error)] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors">
                       Remove
                     </button>
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.full_name || ''} 
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--green-500)]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                  <input 
                    type="email" 
                    value={profile.email || ''} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--green-500)]" 
                  />
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Changing email will require verification.</p>
                </div>
                <div>
                   <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Phone</label>
                   <input 
                     type="text" 
                     value={profile.phone || ''}
                     onChange={(e) => setProfile({...profile, phone: e.target.value})}
                     placeholder="+1 555-0123"
                     className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--green-500)]" 
                   />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                   <input 
                     type="text" 
                     value={profile.location || ''}
                     onChange={(e) => setProfile({...profile, location: e.target.value})}
                     placeholder="San Francisco, CA"
                     className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--green-500)]" 
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Bio</label>
                <textarea 
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--green-500)] h-24 resize-none" 
                  placeholder="Tell us a little about yourself..."
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[var(--green-500)] text-white rounded-lg font-bold shadow-[0_4px_12px_rgba(62,207,142,0.3)] hover:bg-[var(--green-400)] transition-all flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Application View</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                    <label className="block text-sm font-medium text-white mb-1">Default View</label>
                    <p className="text-xs text-[var(--text-tertiary)]">Preferred layout for applications</p>
                  </div>
                   <div className="relative">
                     <select 
                       value={settings.default_view || 'board'}
                       onChange={(e) => handleUpdateSetting('default_view', e.target.value)}
                       className="bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-[var(--green-500)] appearance-none cursor-pointer"
                     >
                       <option value="board">Kanban Board</option>
                       <option value="list">List View</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--border-subtle)]">
               <h3 className="text-lg font-bold text-white mb-6">Resume Analysis</h3>
               <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Auto-save resume text</label>
                    <p className="text-xs text-[var(--text-tertiary)]">Keep your resume text for next time</p>
                  </div>
                  <button 
                    onClick={() => handleUpdateSetting('auto_save_resume', !settings.auto_save_resume)}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors ${settings.auto_save_resume ? 'bg-[var(--green-500)]' : 'bg-[var(--bg-input)] border border-[var(--border-medium)]'}`}
                  >
                    <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.auto_save_resume ? 'left-7' : 'left-1'}`}></span>
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-8">
             <div>
               <h3 className="text-lg font-bold text-white mb-6">Active Sessions</h3>
               <p className="text-sm text-[var(--text-tertiary)] mb-4">You are currently logged in on this device.</p>
               <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
                 <div className="flex items-center gap-3">
                   <Monitor size={20} className="text-[var(--text-secondary)]" />
                   <div>
                     <p className="text-sm font-medium text-white">Current Session</p>
                     <p className="text-xs text-[var(--green-500)]">Active now</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* DATA & PRIVACY */}
        {activeTab === 'data' && (
           <div className="space-y-6">
             <div className="pb-6 border-b border-[var(--border-subtle)]">
               <h3 className="text-lg font-bold text-white mb-4">Export Data</h3>
               <p className="text-sm text-[var(--text-secondary)] mb-4">Download a copy of your personal data in JSON format.</p>
               <button className="px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-medium)] text-white rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)]">
                 Export All Data
               </button>
             </div>

             <div className="p-6 rounded-xl border border-[var(--error)]/30 bg-[rgba(239,68,68,0.05)]">
               <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                 <AlertTriangle size={20} className="text-[var(--error)]" /> Danger Zone
               </h3>
               <p className="text-sm text-[var(--text-secondary)] mb-6">
                 Irreversible actions. Please proceed with caution.
               </p>
               
               <div className="flex items-center justify-between py-4 border-t border-[rgba(239,68,68,0.2)]">
                 <div>
                   <h4 className="text-sm font-bold text-white">Delete Account</h4>
                   <p className="text-xs text-[var(--text-secondary)]">Permanently delete your account and all data.</p>
                 </div>
                 <button 
                  onClick={() => alert('Please contact support to delete your account.')}
                  className="px-4 py-2 bg-[var(--error)] text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                 >
                   Delete Account
                 </button>
               </div>
             </div>
           </div>
        )}

      </div>

      {/* LIGHTBOX MODAL */}
      {showLightbox && profile.avatar_url && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in backdrop-blur-sm"
          onClick={() => setShowLightbox(false)}
        >
          <button 
             className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
             onClick={() => setShowLightbox(false)}
          >
            <X size={32} />
          </button>
          
          {/* Square Image Container */}
          <div 
            className="w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-medium)] relative bg-[var(--bg-secondary)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={profile.avatar_url} 
              alt="Profile Full" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

    </div>
  );
}
