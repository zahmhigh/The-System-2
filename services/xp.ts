import { Difficulty, XPCalculation, LevelUpResult } from '../types/domain';

export const levelRequirement = (level: number): number => 100 * level * level;

export const baseXPByDifficulty: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

export function streakBonusMultiplier(streakDays: number): number {
  if (streakDays >= 7) return 1.2;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

export function debuffMultiplier(percent: number): number {
  // percent is 0..30; negative effect on XP
  return Math.max(0, 1 - percent / 100);
}

export function calculateQuestXP(
  difficulty: Difficulty,
  streakDays: number,
  debuffPercent: number
): XPCalculation {
  const baseXP = baseXPByDifficulty[difficulty];
  const streakMultiplier = streakBonusMultiplier(streakDays);
  const debuffMultiplierValue = debuffMultiplier(debuffPercent);
  const finalXP = Math.round(baseXP * streakMultiplier * debuffMultiplierValue);

  return {
    baseXP,
    streakMultiplier,
    debuffMultiplier: debuffMultiplierValue,
    finalXP,
  };
}

export function getCurrentLevel(totalXP: number): number {
  let level = 1;
  while (totalXP >= levelRequirement(level)) {
    level++;
  }
  return level - 1;
}

export function getXPProgress(totalXP: number, currentLevel: number): {
  current: number;
  required: number;
  progress: number;
} {
  const currentLevelXP = currentLevel > 1 ? levelRequirement(currentLevel - 1) : 0;
  const nextLevelXP = levelRequirement(currentLevel);
  const current = totalXP - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  const progress = required > 0 ? current / required : 1;

  return {
    current,
    required,
    progress: Math.min(1, Math.max(0, progress)),
  };
}

export function checkLevelUp(totalXP: number, currentLevel: number): LevelUpResult | null {
  const newLevel = getCurrentLevel(totalXP);
  
  if (newLevel > currentLevel) {
    const xpGained = totalXP - (currentLevel > 1 ? levelRequirement(currentLevel - 1) : 0);
    return {
      newLevel,
      xpGained,
    };
  }
  
  return null;
}

export function getTitleForLevel(level: number): string {
  if (level >= 50) return 'Legendary Hunter';
  if (level >= 40) return 'Master Hunter';
  if (level >= 30) return 'Elite Hunter';
  if (level >= 20) return 'Advanced Hunter';
  if (level >= 15) return 'Experienced Hunter';
  if (level >= 10) return 'Skilled Hunter';
  if (level >= 5) return 'Novice Hunter';
  return 'Rookie Hunter';
}
