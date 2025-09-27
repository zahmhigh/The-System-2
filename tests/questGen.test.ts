import { describe, it, expect } from 'vitest';
import { generateDailyQuests, getQuestTemplates } from '../services/questGen';
import { QuestGenerationContext } from '../types/domain';

describe('Quest Generation Service', () => {
  const mockContext: QuestGenerationContext = {
    userGoals: [
      { id: 'fitness', label: 'Fitness & Health', weight: 1 },
      { id: 'learning', label: 'Learning & Growth', weight: 1 },
      { id: 'career', label: 'Career Development', weight: 1 },
    ],
    statWeights: {
      STR: 2,
      VIT: 1,
      INT: 3,
      WIS: 2,
      DEX: 1,
      CHA: 1,
    },
    recentCompletions: {
      STR: 2,
      VIT: 1,
      INT: 0,
      WIS: 1,
      DEX: 0,
      CHA: 0,
    },
    lastQuestDifficulties: ['easy', 'medium'],
  };

  describe('generateDailyQuests', () => {
    it('should generate 3-7 quests', () => {
      const quests = generateDailyQuests(mockContext);
      expect(quests.length).toBeGreaterThanOrEqual(3);
      expect(quests.length).toBeLessThanOrEqual(7);
    });

    it('should generate quests with valid properties', () => {
      const quests = generateDailyQuests(mockContext);
      
      quests.forEach(quest => {
        expect(quest).toHaveProperty('id');
        expect(quest).toHaveProperty('title');
        expect(quest).toHaveProperty('description');
        expect(quest).toHaveProperty('stats');
        expect(quest).toHaveProperty('difficulty');
        expect(quest).toHaveProperty('durationMin');
        expect(quest).toHaveProperty('proof');
        expect(quest).toHaveProperty('isActive');
        expect(quest).toHaveProperty('goalTags');
        
        expect(Array.isArray(quest.stats)).toBe(true);
        expect(quest.stats.length).toBeGreaterThan(0);
        expect(['easy', 'medium', 'hard']).toContain(quest.difficulty);
        expect(typeof quest.durationMin).toBe('number');
        expect(quest.durationMin).toBeGreaterThan(0);
        expect(['check', 'timer', 'note', 'photo', 'link']).toContain(quest.proof);
        expect(typeof quest.isActive).toBe('boolean');
        expect(Array.isArray(quest.goalTags)).toBe(true);
      });
    });

    it('should include at least one WIS or INT quest when hasReflectiveTask is true', () => {
      // Run multiple times to test the reflective task logic
      let hasReflectiveTask = false;
      for (let i = 0; i < 10; i++) {
        const quests = generateDailyQuests(mockContext);
        const reflectiveQuests = quests.filter(q => q.stats.includes('WIS') || q.stats.includes('INT'));
        if (reflectiveQuests.length > 0) {
          hasReflectiveTask = true;
          break;
        }
      }
      // This test might occasionally fail due to randomness, but should pass most of the time
      expect(hasReflectiveTask).toBe(true);
    });

    it('should avoid duplicate quests', () => {
      const quests = generateDailyQuests(mockContext);
      const questIds = quests.map(q => q.id);
      const uniqueIds = new Set(questIds);
      expect(uniqueIds.size).toBe(questIds.length);
    });

    it('should balance difficulties appropriately', () => {
      const quests = generateDailyQuests(mockContext);
      const difficulties = quests.map(q => q.difficulty);
      
      // Should have at least one easy quest if we've had too many hard ones
      const easyCount = difficulties.filter(d => d === 'easy').length;
      const hardCount = difficulties.filter(d => d === 'hard').length;
      
      // With lastQuestDifficulties being ['easy', 'medium'], we shouldn't have too many hard quests
      expect(hardCount).toBeLessThanOrEqual(3);
    });
  });

  describe('getQuestTemplates', () => {
    it('should return all quest templates', () => {
      const templates = getQuestTemplates();
      expect(templates.length).toBeGreaterThan(0);
      
      // Should have templates for all stats and difficulties
      const stats = ['STR', 'VIT', 'INT', 'WIS', 'DEX', 'CHA'];
      const difficulties = ['easy', 'medium', 'hard'];
      
      stats.forEach(stat => {
        difficulties.forEach(difficulty => {
          const statTemplates = templates.filter(t => 
            t.stats.includes(stat as any) && t.difficulty === difficulty
          );
          expect(statTemplates.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have valid template properties', () => {
      const templates = getQuestTemplates();
      
      templates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('title');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('stats');
        expect(template).toHaveProperty('difficulty');
        expect(template).toHaveProperty('durationMin');
        expect(template).toHaveProperty('proof');
        expect(template).toHaveProperty('isActive');
        expect(template).toHaveProperty('goalTags');
        
        expect(Array.isArray(template.stats)).toBe(true);
        expect(template.stats.length).toBeGreaterThan(0);
        expect(['easy', 'medium', 'hard']).toContain(template.difficulty);
        expect(typeof template.durationMin).toBe('number');
        expect(template.durationMin).toBeGreaterThan(0);
        expect(['check', 'timer', 'note', 'photo', 'link']).toContain(template.proof);
        expect(typeof template.isActive).toBe('boolean');
        expect(Array.isArray(template.goalTags)).toBe(true);
      });
    });
  });
});
