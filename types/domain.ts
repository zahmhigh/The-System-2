export type Stat = 'STR' | 'VIT' | 'INT' | 'WIS' | 'DEX' | 'CHA';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ProofType = 'check' | 'timer' | 'note' | 'photo' | 'link';

export type QuestStatus = 'pending' | 'completed' | 'skipped' | 'failed';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  stats: Record<Stat, number>;
  totalXP: number;
  level: number;
  streak: {
    count: number;
    lastCompletedISO: string | null;
  };
  debuff: {
    percent: number;
    expiresAtISO: string | null;
  };
  goals: Array<{
    id: string;
    label: string;
    weight: number;
  }>;
  resetHour: number; // 0-23
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  stats: Stat[];
  difficulty: Difficulty;
  durationMin: number;
  proof: ProofType;
  isActive: boolean;
  goalTags: string[];
}

export interface DailyItem {
  id: string;
  fromQuestId: string;
  title: string;
  stats: Stat[];
  difficulty: Difficulty;
  durationMin: number;
  proof: ProofType;
  status: QuestStatus;
  xpAwarded: number;
  completedAt?: string;
}

export interface DailySummary {
  date: string;
  generatedAt: string;
  completedCount: number;
  totalCount: number;
  xpEarned: number;
  summary: string;
}

export interface Title {
  id: string;
  name: string;
  levelMin: number;
}

export interface OnboardingData {
  displayName: string;
  goals: Array<{
    id: string;
    label: string;
    weight: number;
  }>;
  statWeights: Record<Stat, number>;
  resetHour: number;
}

export interface QuestGenerationContext {
  userGoals: Array<{ id: string; label: string; weight: number }>;
  statWeights: Record<Stat, number>;
  recentCompletions: Record<Stat, number>; // last 7 days
  lastQuestDifficulties: Difficulty[]; // last 3 quests
}

export interface XPCalculation {
  baseXP: number;
  streakMultiplier: number;
  debuffMultiplier: number;
  finalXP: number;
}

export interface LevelUpResult {
  newLevel: number;
  xpGained: number;
  titleUnlocked?: string;
}

export interface StreakUpdate {
  newCount: number;
  isReset: boolean;
  debuffApplied: boolean;
  debuffPercent: number;
}
