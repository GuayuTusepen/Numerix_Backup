"use client";

import type { Profile } from '@/types/profile';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';
import type { ReactNode} from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PROFILES_STORAGE_KEY = 'numerix_profiles';
const ACTIVE_PROFILE_ID_STORAGE_KEY = 'numerix_active_profile_id';

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  addProfile: (profileData: Omit<Profile, 'id'>) => Profile;
  selectProfile: (profileId: string | null) => void;
  updateProfile: (profileData: Profile) => void;
  deleteProfile: (profileId: string) => void;
  getProfileById: (profileId: string) => Profile | undefined;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProfiles = getLocalStorageItem<Profile[]>(PROFILES_STORAGE_KEY, []);
    const storedActiveProfileId = getLocalStorageItem<string | null>(ACTIVE_PROFILE_ID_STORAGE_KEY, null);
    
    setProfiles(storedProfiles);
    if (storedActiveProfileId && storedProfiles.some(p => p.id === storedActiveProfileId)) {
      setActiveProfileId(storedActiveProfileId);
    } else if (storedProfiles.length > 0) {
       setActiveProfileId(null);
       setLocalStorageItem(ACTIVE_PROFILE_ID_STORAGE_KEY, null);
    }
    setIsLoading(false);
  }, []);

  const saveProfiles = useCallback((updatedProfiles: Profile[]) => {
    setProfiles(updatedProfiles);
    setLocalStorageItem(PROFILES_STORAGE_KEY, updatedProfiles);
  }, []);

  const addProfile = (profileData: Omit<Profile, 'id'>): Profile => {
    if (profiles.length >= 3) {
      throw new Error("Maximum of 3 profiles allowed.");
    }
    // Ensure gender is provided, default if necessary or throw error
    if (!profileData.gender) {
        // This case should ideally be handled by form validation
        // For safety, you could default or throw:
        // throw new Error("Gender is required to create a profile.");
        // Or default: profileData.gender = 'boy'; 
        // However, schema validation should prevent this.
    }
    const newProfile: Profile = { ...profileData, id: Date.now().toString() };
    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);
    selectProfile(newProfile.id); // Auto-select new profile
    return newProfile;
  };

  const selectProfile = (profileId: string | null) => {
    setActiveProfileId(profileId);
    setLocalStorageItem(ACTIVE_PROFILE_ID_STORAGE_KEY, profileId);
  };

  const updateProfile = (profileData: Profile) => {
    const updatedProfiles = profiles.map(p => p.id === profileData.id ? profileData : p);
    saveProfiles(updatedProfiles);
  };
  
  const deleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    saveProfiles(updatedProfiles);
    if (activeProfileId === profileId) {
      selectProfile(updatedProfiles.length > 0 ? updatedProfiles[0].id : null);
    }
  };

  const getProfileById = (profileId: string): Profile | undefined => {
    return profiles.find(p => p.id === profileId);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, isLoading, addProfile, selectProfile, updateProfile, deleteProfile, getProfileById }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
