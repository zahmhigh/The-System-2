import { Quest, QuestGenerationContext, Stat, Difficulty, ProofType } from '../types/domain';

// Quest templates organized by stat and difficulty
const QUEST_TEMPLATES: Record<Stat, Record<Difficulty, Quest[]>> = {
  STR: {
    easy: [
      { id: 'str-1', title: 'Morning Push-ups', description: 'Complete 20 push-ups', stats: ['STR'], difficulty: 'easy', durationMin: 5, proof: 'check', isActive: true, goalTags: ['fitness'] },
      { id: 'str-2', title: 'Walk the Stairs', description: 'Take stairs instead of elevator for 5 minutes', stats: ['STR'], difficulty: 'easy', durationMin: 5, proof: 'timer', isActive: true, goalTags: ['fitness'] },
      { id: 'str-3', title: 'Carry Groceries', description: 'Carry groceries without a cart', stats: ['STR'], difficulty: 'easy', durationMin: 10, proof: 'check', isActive: true, goalTags: ['fitness'] },
    ],
    medium: [
      { id: 'str-4', title: 'Workout Session', description: 'Complete a 30-minute strength training session', stats: ['STR'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['fitness'] },
      { id: 'str-5', title: 'Yard Work', description: 'Spend 45 minutes doing yard work or heavy lifting', stats: ['STR'], difficulty: 'medium', durationMin: 45, proof: 'timer', isActive: true, goalTags: ['fitness'] },
    ],
    hard: [
      { id: 'str-6', title: 'Intense Workout', description: 'Complete a 60-minute high-intensity strength training', stats: ['STR'], difficulty: 'hard', durationMin: 60, proof: 'timer', isActive: true, goalTags: ['fitness'] },
    ],
  },
  VIT: {
    easy: [
      { id: 'vit-1', title: 'Morning Stretch', description: 'Do 10 minutes of stretching', stats: ['VIT'], difficulty: 'easy', durationMin: 10, proof: 'timer', isActive: true, goalTags: ['health'] },
      { id: 'vit-2', title: 'Deep Breathing', description: 'Practice 5 minutes of deep breathing exercises', stats: ['VIT'], difficulty: 'easy', durationMin: 5, proof: 'timer', isActive: true, goalTags: ['health'] },
    ],
    medium: [
      { id: 'vit-3', title: 'Cardio Session', description: 'Complete 30 minutes of cardio exercise', stats: ['VIT'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['fitness'] },
      { id: 'vit-4', title: 'Yoga Practice', description: 'Do 45 minutes of yoga or meditation', stats: ['VIT'], difficulty: 'medium', durationMin: 45, proof: 'timer', isActive: true, goalTags: ['health'] },
    ],
    hard: [
      { id: 'vit-5', title: 'Marathon Training', description: 'Complete 90 minutes of endurance training', stats: ['VIT'], difficulty: 'hard', durationMin: 90, proof: 'timer', isActive: true, goalTags: ['fitness'] },
    ],
  },
  INT: {
    easy: [
      { id: 'int-1', title: 'Read Article', description: 'Read one educational article or news piece', stats: ['INT'], difficulty: 'easy', durationMin: 10, proof: 'note', isActive: true, goalTags: ['learning'] },
      { id: 'int-2', title: 'Learn New Word', description: 'Learn and use 3 new vocabulary words', stats: ['INT'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['learning'] },
    ],
    medium: [
      { id: 'int-3', title: 'Study Session', description: 'Study a new topic for 45 minutes', stats: ['INT'], difficulty: 'medium', durationMin: 45, proof: 'timer', isActive: true, goalTags: ['learning'] },
      { id: 'int-4', title: 'Online Course', description: 'Complete one lesson from an online course', stats: ['INT'], difficulty: 'medium', durationMin: 30, proof: 'link', isActive: true, goalTags: ['learning'] },
    ],
    hard: [
      { id: 'int-5', title: 'Research Project', description: 'Spend 2 hours researching and documenting a complex topic', stats: ['INT'], difficulty: 'hard', durationMin: 120, proof: 'note', isActive: true, goalTags: ['learning'] },
    ],
  },
  WIS: {
    easy: [
      { id: 'wis-1', title: 'Daily Reflection', description: 'Write 3 things you learned today', stats: ['WIS'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['reflection'] },
      { id: 'wis-2', title: 'Gratitude Practice', description: 'Write down 5 things you are grateful for', stats: ['WIS'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['reflection'] },
    ],
    medium: [
      { id: 'wis-3', title: 'Journal Entry', description: 'Write a 20-minute reflective journal entry', stats: ['WIS'], difficulty: 'medium', durationMin: 20, proof: 'note', isActive: true, goalTags: ['reflection'] },
      { id: 'wis-4', title: 'Meditation Session', description: 'Meditate for 30 minutes', stats: ['WIS'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['health'] },
    ],
    hard: [
      { id: 'wis-5', title: 'Deep Analysis', description: 'Spend 60 minutes analyzing a life decision or problem', stats: ['WIS'], difficulty: 'hard', durationMin: 60, proof: 'note', isActive: true, goalTags: ['reflection'] },
    ],
  },
  DEX: {
    easy: [
      { id: 'dex-1', title: 'Handwriting Practice', description: 'Write a paragraph by hand', stats: ['DEX'], difficulty: 'easy', durationMin: 10, proof: 'photo', isActive: true, goalTags: ['skills'] },
      { id: 'dex-2', title: 'Quick Draw', description: 'Practice quick, precise movements for 5 minutes', stats: ['DEX'], difficulty: 'easy', durationMin: 5, proof: 'timer', isActive: true, goalTags: ['skills'] },
    ],
    medium: [
      { id: 'dex-3', title: 'Craft Project', description: 'Work on a craft or art project for 45 minutes', stats: ['DEX'], difficulty: 'medium', durationMin: 45, proof: 'photo', isActive: true, goalTags: ['skills'] },
      { id: 'dex-4', title: 'Instrument Practice', description: 'Practice a musical instrument for 30 minutes', stats: ['DEX'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['skills'] },
    ],
    hard: [
      { id: 'dex-5', title: 'Precision Task', description: 'Complete a detailed, precision-based task for 90 minutes', stats: ['DEX'], difficulty: 'hard', durationMin: 90, proof: 'photo', isActive: true, goalTags: ['skills'] },
    ],
  },
  CHA: {
    easy: [
      { id: 'cha-1', title: 'Compliment Someone', description: 'Give a genuine compliment to someone', stats: ['CHA'], difficulty: 'easy', durationMin: 2, proof: 'note', isActive: true, goalTags: ['social'] },
      { id: 'cha-2', title: 'Small Talk', description: 'Have a 5-minute conversation with a stranger or acquaintance', stats: ['CHA'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['social'] },
    ],
    medium: [
      { id: 'cha-3', title: 'Networking', description: 'Attend a networking event or social gathering', stats: ['CHA'], difficulty: 'medium', durationMin: 60, proof: 'note', isActive: true, goalTags: ['social'] },
      { id: 'cha-4', title: 'Presentation Practice', description: 'Practice a presentation or speech for 30 minutes', stats: ['CHA'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['skills'] },
    ],
    hard: [
      { id: 'cha-5', title: 'Public Speaking', description: 'Give a presentation or speech to a group', stats: ['CHA'], difficulty: 'hard', durationMin: 90, proof: 'note', isActive: true, goalTags: ['social'] },
    ],
  },
};

export function generateDailyQuests(context: QuestGenerationContext): Quest[] {
  const { userGoals, statWeights, recentCompletions, lastQuestDifficulties } = context;
  
  // Calculate stat priorities based on weights and recent activity
  const statPriorities = Object.entries(statWeights).map(([stat, weight]) => ({
    stat: stat as Stat,
    priority: weight - (recentCompletions[stat as Stat] || 0) * 0.1, // Reduce priority for recently completed stats
  })).sort((a, b) => b.priority - a.priority);

  const quests: Quest[] = [];
  const questCount = Math.floor(Math.random() * 5) + 3; // 3-7 quests
  
  // Ensure we have at least one WIS/INT reflective task
  const hasReflectiveTask = Math.random() > 0.3;
  if (hasReflectiveTask) {
    const reflectiveStats: Stat[] = ['WIS', 'INT'];
    const reflectiveStat = reflectiveStats[Math.floor(Math.random() * reflectiveStats.length)];
    const difficulty = getBalancedDifficulty(lastQuestDifficulties);
    const template = getRandomTemplate(reflectiveStat, difficulty);
    if (template) {
      quests.push(template);
    }
  }

  // Generate remaining quests
  while (quests.length < questCount) {
    const stat = statPriorities[quests.length % statPriorities.length].stat;
    const difficulty = getBalancedDifficulty(lastQuestDifficulties);
    const template = getRandomTemplate(stat, difficulty);
    
    if (template && !quests.some(q => q.id === template.id)) {
      quests.push(template);
    }
  }

  return quests.slice(0, questCount);
}

function getBalancedDifficulty(lastDifficulties: Difficulty[]): Difficulty {
  const recentHard = lastDifficulties.filter(d => d === 'hard').length;
  const recentEasy = lastDifficulties.filter(d => d === 'easy').length;
  
  // Avoid too many hard quests in a row
  if (recentHard >= 2) {
    return Math.random() > 0.3 ? 'easy' : 'medium';
  }
  
  // Add some easy quests if we've had too many hard ones
  if (recentEasy < 1 && lastDifficulties.length >= 2) {
    return Math.random() > 0.4 ? 'easy' : 'medium';
  }
  
  // Random distribution with slight bias toward medium
  const rand = Math.random();
  if (rand < 0.4) return 'easy';
  if (rand < 0.8) return 'medium';
  return 'hard';
}

function getRandomTemplate(stat: Stat, difficulty: Difficulty): Quest | null {
  const templates = QUEST_TEMPLATES[stat]?.[difficulty];
  if (!templates || templates.length === 0) return null;
  
  return templates[Math.floor(Math.random() * templates.length)];
}

export function getQuestTemplates(): Quest[] {
  const allTemplates: Quest[] = [];
  Object.values(QUEST_TEMPLATES).forEach(statTemplates => {
    Object.values(statTemplates).forEach(difficultyTemplates => {
      allTemplates.push(...difficultyTemplates);
    });
  });
  return allTemplates;
}
