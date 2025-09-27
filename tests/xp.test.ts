import { describe, it, expect } from 'vitest';
import {
  levelRequirement,
  baseXPByDifficulty,
  streakBonusMultiplier,
  debuffMultiplier,
  calculateQuestXP,
  getCurrentLevel,
  getXPProgress,
  checkLevelUp,
  getTitleForLevel,
} from '../services/xp';

describe('XP Service', () => {
  describe('levelRequirement', () => {
    it('should calculate correct XP requirements for levels', () => {
      expect(levelRequirement(1)).toBe(100);
      expect(levelRequirement(2)).toBe(400);
      expect(levelRequirement(3)).toBe(900);
      expect(levelRequirement(10)).toBe(10000);
    });
  });

  describe('baseXPByDifficulty', () => {
    it('should have correct base XP values', () => {
      expect(baseXPByDifficulty.easy).toBe(10);
      expect(baseXPByDifficulty.medium).toBe(20);
      expect(baseXPByDifficulty.hard).toBe(30);
    });
  });

  describe('streakBonusMultiplier', () => {
    it('should return correct multipliers based on streak days', () => {
      expect(streakBonusMultiplier(0)).toBe(1.0);
      expect(streakBonusMultiplier(1)).toBe(1.0);
      expect(streakBonusMultiplier(2)).toBe(1.0);
      expect(streakBonusMultiplier(3)).toBe(1.1);
      expect(streakBonusMultiplier(6)).toBe(1.1);
      expect(streakBonusMultiplier(7)).toBe(1.2);
      expect(streakBonusMultiplier(10)).toBe(1.2);
    });
  });

  describe('debuffMultiplier', () => {
    it('should return correct multipliers based on debuff percent', () => {
      expect(debuffMultiplier(0)).toBe(1.0);
      expect(debuffMultiplier(10)).toBe(0.9);
      expect(debuffMultiplier(20)).toBe(0.8);
      expect(debuffMultiplier(30)).toBe(0.7);
      expect(debuffMultiplier(50)).toBe(0.5);
    });
  });

  describe('calculateQuestXP', () => {
    it('should calculate correct XP with no bonuses or debuffs', () => {
      const result = calculateQuestXP('easy', 0, 0);
      expect(result.baseXP).toBe(10);
      expect(result.streakMultiplier).toBe(1.0);
      expect(result.debuffMultiplier).toBe(1.0);
      expect(result.finalXP).toBe(10);
    });

    it('should apply streak bonus correctly', () => {
      const result = calculateQuestXP('medium', 5, 0);
      expect(result.baseXP).toBe(20);
      expect(result.streakMultiplier).toBe(1.1);
      expect(result.finalXP).toBe(22);
    });

    it('should apply debuff correctly', () => {
      const result = calculateQuestXP('hard', 0, 20);
      expect(result.baseXP).toBe(30);
      expect(result.debuffMultiplier).toBe(0.8);
      expect(result.finalXP).toBe(24);
    });

    it('should apply both streak bonus and debuff', () => {
      const result = calculateQuestXP('medium', 7, 10);
      expect(result.baseXP).toBe(20);
      expect(result.streakMultiplier).toBe(1.2);
      expect(result.debuffMultiplier).toBe(0.9);
      expect(result.finalXP).toBe(22); // 20 * 1.2 * 0.9 = 21.6, rounded to 22
    });
  });

  describe('getCurrentLevel', () => {
    it('should return correct level based on total XP', () => {
      expect(getCurrentLevel(0)).toBe(0);
      expect(getCurrentLevel(50)).toBe(0);
      expect(getCurrentLevel(100)).toBe(1);
      expect(getCurrentLevel(200)).toBe(1);
      expect(getCurrentLevel(400)).toBe(2);
      expect(getCurrentLevel(1000)).toBe(3);
    });
  });

  describe('getXPProgress', () => {
    it('should calculate correct progress for level 1', () => {
      const progress = getXPProgress(150, 1);
      expect(progress.current).toBe(50);
      expect(progress.required).toBe(300); // 400 - 100
      expect(progress.progress).toBeCloseTo(0.167, 2);
    });

    it('should calculate correct progress for level 2', () => {
      const progress = getXPProgress(600, 2);
      expect(progress.current).toBe(200);
      expect(progress.required).toBe(500); // 900 - 400
      expect(progress.progress).toBeCloseTo(0.4, 2);
    });
  });

  describe('checkLevelUp', () => {
    it('should detect level up correctly', () => {
      const result = checkLevelUp(400, 1);
      expect(result).not.toBeNull();
      expect(result?.newLevel).toBe(2);
      expect(result?.xpGained).toBe(300);
    });

    it('should return null when no level up', () => {
      const result = checkLevelUp(200, 1);
      expect(result).toBeNull();
    });
  });

  describe('getTitleForLevel', () => {
    it('should return correct titles for different levels', () => {
      expect(getTitleForLevel(1)).toBe('Rookie Hunter');
      expect(getTitleForLevel(5)).toBe('Novice Hunter');
      expect(getTitleForLevel(10)).toBe('Skilled Hunter');
      expect(getTitleForLevel(15)).toBe('Experienced Hunter');
      expect(getTitleForLevel(20)).toBe('Advanced Hunter');
      expect(getTitleForLevel(30)).toBe('Elite Hunter');
      expect(getTitleForLevel(40)).toBe('Master Hunter');
      expect(getTitleForLevel(50)).toBe('Legendary Hunter');
    });
  });
});
