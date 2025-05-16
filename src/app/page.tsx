"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';
import { SplashScreen } from '@/components/SplashScreen';

export default function HomePage() {
  const router = useRouter();
  const { activeProfile, isLoading: isProfileLoading, profiles } = useProfile();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAppLoading || isProfileLoading) {
      return; // Wait for splash screen and profile loading
    }

    if (activeProfile) {
      router.replace('/dashboard');
    } else if (profiles.length > 0) {
      router.replace('/profiles'); // Profiles exist, but none active
    }
    else {
      router.replace('/profiles'); // No profiles, go to create/select
    }
  }, [activeProfile, isProfileLoading, isAppLoading, router, profiles]);

  return <SplashScreen />;
}
