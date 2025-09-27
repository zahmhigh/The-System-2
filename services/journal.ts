import { DailySummary, DailyItem } from '../types/domain';

export function generateJournalEntry(
  dailySummary: DailySummary,
  dailyItems: DailyItem[]
): string {
  const { completedCount, totalCount, xpEarned, summary } = dailySummary;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  let entry = `## Daily Report - ${dailySummary.date}\n\n`;
  entry += `**Completion Rate:** ${completionRate.toFixed(0)}% (${completedCount}/${totalCount})\n`;
  entry += `**XP Earned:** ${xpEarned}\n\n`;
  
  if (completedCount > 0) {
    entry += `### Completed Quests:\n`;
    dailyItems
      .filter(item => item.status === 'completed')
      .forEach(item => {
        entry += `- ✅ ${item.title} (${item.difficulty})\n`;
      });
    entry += '\n';
  }
  
  if (dailyItems.some(item => item.status === 'skipped')) {
    entry += `### Skipped Quests:\n`;
    dailyItems
      .filter(item => item.status === 'skipped')
      .forEach(item => {
        entry += `- ⏭️ ${item.title} (${item.difficulty})\n`;
      });
    entry += '\n';
  }
  
  if (dailyItems.some(item => item.status === 'failed')) {
    entry += `### Failed Quests:\n`;
    dailyItems
      .filter(item => item.status === 'failed')
      .forEach(item => {
        entry += `- ❌ ${item.title} (${item.difficulty})\n`;
      });
    entry += '\n';
  }
  
  entry += `### Summary:\n${summary}\n\n`;
  
  // Add motivational message based on performance
  if (completionRate >= 80) {
    entry += `🎉 Excellent work! You're on fire today!`;
  } else if (completionRate >= 60) {
    entry += `👍 Good progress! Keep pushing forward!`;
  } else if (completionRate >= 40) {
    entry += `💪 Every step counts! You're building momentum!`;
  } else if (completionRate > 0) {
    entry += `🌱 Small steps lead to big changes. Tomorrow is a new day!`;
  } else {
    entry += `🔄 Rest is important too. Come back stronger tomorrow!`;
  }
  
  return entry;
}

export function calculateWeeklyStats(dailySummaries: DailySummary[]): {
  totalXP: number;
  totalQuests: number;
  completedQuests: number;
  averageCompletionRate: number;
  streakDays: number;
  mostActiveDay: string;
} {
  const totalXP = dailySummaries.reduce((sum, day) => sum + day.xpEarned, 0);
  const totalQuests = dailySummaries.reduce((sum, day) => sum + day.totalCount, 0);
  const completedQuests = dailySummaries.reduce((sum, day) => sum + day.completedCount, 0);
  const averageCompletionRate = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
  
  // Calculate streak (consecutive days with at least one completed quest)
  let streakDays = 0;
  for (let i = dailySummaries.length - 1; i >= 0; i--) {
    if (dailySummaries[i].completedCount > 0) {
      streakDays++;
    } else {
      break;
    }
  }
  
  // Find most active day
  const mostActiveDay = dailySummaries.reduce((max, day) => 
    day.xpEarned > max.xpEarned ? day : max, 
    dailySummaries[0] || { xpEarned: 0, date: 'N/A' }
  ).date;
  
  return {
    totalXP,
    totalQuests,
    completedQuests,
    averageCompletionRate,
    streakDays,
    mostActiveDay,
  };
}

export function generateWeeklyReport(dailySummaries: DailySummary[]): string {
  const stats = calculateWeeklyStats(dailySummaries);
  
  let report = `# Weekly Report\n\n`;
  report += `## Overall Performance\n`;
  report += `- **Total XP:** ${stats.totalXP}\n`;
  report += `- **Quests Completed:** ${stats.completedQuests}/${stats.totalQuests}\n`;
  report += `- **Completion Rate:** ${stats.averageCompletionRate.toFixed(1)}%\n`;
  report += `- **Current Streak:** ${stats.streakDays} days\n`;
  report += `- **Most Active Day:** ${stats.mostActiveDay}\n\n`;
  
  report += `## Daily Breakdown\n`;
  dailySummaries.forEach(day => {
    const completionRate = day.totalCount > 0 ? (day.completedCount / day.totalCount) * 100 : 0;
    report += `### ${day.date}\n`;
    report += `- XP: ${day.xpEarned}\n`;
    report += `- Completion: ${completionRate.toFixed(0)}% (${day.completedCount}/${day.totalCount})\n`;
    report += `- Summary: ${day.summary}\n\n`;
  });
  
  // Add weekly insights
  if (stats.averageCompletionRate >= 80) {
    report += `🎯 **Outstanding week!** You're consistently hitting your targets!`;
  } else if (stats.averageCompletionRate >= 60) {
    report += `📈 **Great progress!** You're building strong habits!`;
  } else if (stats.averageCompletionRate >= 40) {
    report += `💪 **Steady improvement!** Every day you're getting stronger!`;
  } else {
    report += `🌱 **Building momentum!** Small steps lead to big changes!`;
  }
  
  return report;
}
