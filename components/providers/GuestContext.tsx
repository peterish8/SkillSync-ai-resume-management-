'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GuestContextType {
  isGuest: boolean;
  loginAsGuest: () => void;
  logoutGuest: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check local storage on mount
    const storedGuest = localStorage.getItem('isGuestMode');
    if (storedGuest === 'true') {
      setIsGuest(true);
    }
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('isGuestMode', 'true');
    router.push('/dashboard');
  };

  const logoutGuest = () => {
    setIsGuest(false);
    localStorage.removeItem('isGuestMode');
    router.push('/');
  };

  return (
    <GuestContext.Provider value={{ isGuest, loginAsGuest, logoutGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
}
