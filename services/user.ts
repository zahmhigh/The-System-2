import dayjs from 'dayjs';
import { User, StreakUpdate } from '../types/domain';

export function shouldResetStreak(lastCompletedISO: string | null, resetHour: number): boolean {
  if (!lastCompletedISO) return true;
  
  const lastCompleted = dayjs(lastCompletedISO);
  const now = dayjs();
  
  // Calculate the last reset time
  const lastReset = now.hour() >= resetHour 
    ? now.hour(resetHour).minute(0).second(0)
    : now.subtract(1, 'day').hour(resetHour).minute(0).second(0);
  
  // Check if the last completion was before the last reset
  return lastCompleted.isBefore(lastReset);
}

export function updateStreak(
  currentStreak: number,
  lastCompletedISO: string | null,
  resetHour: number,
  completedToday: boolean
): StreakUpdate {
  const shouldReset = shouldResetStreak(lastCompletedISO, resetHour);
  
  if (shouldReset) {
    if (completedToday) {
      // First day of new streak
      return {
        newCount: 1,
        isReset: true,
        debuffApplied: false,
        debuffPercent: 0,
      };
    } else {
      // Streak broken, apply debuff
      const consecutiveMisses = currentStreak > 0 ? 1 : 0;
      return {
        newCount: 0,
        isReset: true,
        debuffApplied: consecutiveMisses > 0,
        debuffPercent: updateDebuff(consecutiveMisses),
      };
    }
  } else if (completedToday) {
    // Continue streak
    return {
      newCount: currentStreak + 1,
      isReset: false,
      debuffApplied: false,
      debuffPercent: 0,
    };
  } else {
    // No change today
    return {
      newCount: currentStreak,
      isReset: false,
      debuffApplied: false,
      debuffPercent: 0,
    };
  }
}

export function updateDebuff(consecutiveMisses: number): number {
  return Math.min(30, consecutiveMisses * 10);
}

export function clearDebuffAfterTwoDays(completedConsecutiveDays: number): boolean {
  return completedConsecutiveDays >= 2;
}

export function calculateStatGains(completedQuests: Array<{ stats: string[] }>): Record<string, number> {
  const gains: Record<string, number> = {};
  
  completedQuests.forEach(quest => {
    quest.stats.forEach(stat => {
      gains[stat] = (gains[stat] || 0) + 1;
    });
  });
  
  return gains;
}

export function shouldLevelUp(currentXP: number, currentLevel: number): boolean {
  const requiredXP = 100 * (currentLevel + 1) * (currentLevel + 1);
  return currentXP >= requiredXP;
}

export function getNewLevel(currentXP: number): number {
  let level = 1;
  while (currentXP >= 100 * level * level) {
    level++;
  }
  return level - 1;
}

export function generateDailySummary(
  completedQuests: Array<{ title: string; stats: string[]; difficulty: string }>,
  xpEarned: number,
  streakCount: number,
  statGains: Record<string, number>
): string {
  const questCount = completedQuests.length;
  const statNames = Object.keys(statGains);
  
  let summary = `Today you completed ${questCount} quest${questCount !== 1 ? 's' : ''} and earned ${xpEarned} XP! `;
  
  if (streakCount > 1) {
    summary += `Your ${streakCount}-day streak is keeping you strong! `;
  }
  
  if (statNames.length > 0) {
    const statText = statNames.map(stat => `${stat} (+${statGains[stat]})`).join(', ');
    summary += `You improved your ${statText} stats. `;
  }
  
  if (questCount === 0) {
    summary = "No quests completed today. Every hunter has off days - tomorrow is a new opportunity!";
  }
  
  return summary;
}

export function validateOnboardingData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.displayName || data.displayName.trim().length < 2) {
    errors.push('Display name must be at least 2 characters');
  }
  
  if (!data.goals || data.goals.length < 3) {
    errors.push('Please select at least 3 goals');
  }
  
  if (data.goals && data.goals.length > 5) {
    errors.push('Please select no more than 5 goals');
  }
  
  if (!data.statWeights) {
    errors.push('Please set stat weights');
  } else {
    const totalWeight = Object.values(data.statWeights).reduce((sum: number, weight: any) => sum + (weight as number), 0);
    if (totalWeight === 0) {
      errors.push('At least one stat must have a weight greater than 0');
    }
  }
  
  if (typeof data.resetHour !== 'number' || data.resetHour < 0 || data.resetHour > 23) {
    errors.push('Reset hour must be between 0 and 23');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
