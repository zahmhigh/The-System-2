import { create } from 'zustand';
import { User, OnboardingData } from '../types/domain';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Onboarding state
  onboardingData: Partial<OnboardingData> | null;
  isOnboardingComplete: boolean;
  
  // UI state
  selectedTab: 'mission' | 'journal' | 'profile';
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setSelectedTab: (tab: 'mission' | 'journal' | 'profile') => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  onboardingData: null,
  isOnboardingComplete: false,
  selectedTab: 'mission',
  
  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingData: (data) => set((state) => ({ 
    onboardingData: { ...state.onboardingData, ...data } 
  })),
  setOnboardingComplete: (isOnboardingComplete) => set({ isOnboardingComplete }),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  reset: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    onboardingData: null,
    isOnboardingComplete: false,
    selectedTab: 'mission',
  }),
}));
