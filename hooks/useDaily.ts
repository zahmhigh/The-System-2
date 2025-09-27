import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DailyItem, DailySummary, Quest, QuestGenerationContext } from '../types/domain';
import { generateDailyQuests } from '../services/questGen';
import { calculateQuestXP, getCurrentLevel, checkLevelUp } from '../services/xp';
import { updateStreak, calculateStatGains, generateDailySummary } from '../services/user';
import { useAppStore } from '../lib/store';

export function useDailyQuests(userId: string) {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  const today = new Date().toISOString().split('T')[0];
  const dailyPath = `user_daily/${userId}/days/${today}`;
  
  const { data: dailySummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dailySummary', userId, today],
    queryFn: async () => {
      const docRef = doc(db, dailyPath);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as DailySummary;
      }
      return null;
    },
    enabled: !!userId,
  });

  const { data: dailyItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ['dailyItems', userId, today],
    queryFn: async () => {
      const itemsRef = collection(db, `${dailyPath}/items`);
      const itemsSnap = await getDocs(itemsRef);
      
      return itemsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DailyItem[];
    },
    enabled: !!userId,
  });

  const generateQuestsMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not found');
      
      // Generate quests based on user's goals and stats
      const context: QuestGenerationContext = {
        userGoals: user.goals,
        statWeights: user.stats, // Using current stat values as weights
        recentCompletions: {
          STR: 0,
          VIT: 0,
          INT: 0,
          WIS: 0,
          DEX: 0,
          CHA: 0,
        }, // TODO: Calculate from recent history
        lastQuestDifficulties: [], // TODO: Get from recent quests
      };
      
      const quests = generateDailyQuests(context);
      
      // Create daily summary
      const dailySummary: DailySummary = {
        date: today,
        generatedAt: new Date().toISOString(),
        completedCount: 0,
        totalCount: quests.length,
        xpEarned: 0,
        summary: '',
      };
      
      // Save daily summary
      await setDoc(doc(db, dailyPath), dailySummary);
      
      // Save individual quest items
      const items = quests.map((quest, index) => ({
        id: `quest_${index}`,
        fromQuestId: quest.id,
        title: quest.title,
        stats: quest.stats,
        difficulty: quest.difficulty,
        durationMin: quest.durationMin,
        proof: quest.proof,
        status: 'pending' as const,
        xpAwarded: 0,
      }));
      
      for (const item of items) {
        await setDoc(doc(db, `${dailyPath}/items`, item.id), item);
      }
      
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyItems', userId, today] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary', userId, today] });
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: 'completed' | 'skipped' | 'failed' }) => {
      if (!user) throw new Error('User not found');
      
      const itemRef = doc(db, `${dailyPath}/items`, itemId);
      const itemSnap = await getDoc(itemRef);
      
      if (!itemSnap.exists()) throw new Error('Quest not found');
      
      const item = itemSnap.data() as DailyItem;
      
      let xpAwarded = 0;
      if (status === 'completed') {
        const xpCalc = calculateQuestXP(
          item.difficulty,
          user.streak.count,
          user.debuff.percent
        );
        xpAwarded = xpCalc.finalXP;
      }
      
      // Update quest item
      await updateDoc(itemRef, {
        status,
        xpAwarded,
        completedAt: status === 'completed' ? new Date().toISOString() : null,
      });
      
      // Update user stats and XP
      const newTotalXP = user.totalXP + xpAwarded;
      const newLevel = getCurrentLevel(newTotalXP);
      const levelUp = checkLevelUp(newTotalXP, user.level);
      
      // Calculate stat gains
      const statGains = status === 'completed' ? calculateStatGains([item]) : {};
      const newStats = { ...user.stats };
      Object.entries(statGains).forEach(([stat, gain]) => {
        newStats[stat as keyof typeof newStats] += gain;
      });
      
      // Update user document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalXP: newTotalXP,
        level: newLevel,
        stats: newStats,
        updatedAt: serverTimestamp(),
        ...(levelUp && { title: `Level ${newLevel} Hunter` }),
      });
      
      // Update daily summary
      const summaryRef = doc(db, dailyPath);
      const summarySnap = await getDoc(summaryRef);
      if (summarySnap.exists()) {
        const currentSummary = summarySnap.data() as DailySummary;
        const newCompletedCount = status === 'completed' 
          ? currentSummary.completedCount + 1 
          : currentSummary.completedCount;
        const newXpEarned = currentSummary.xpEarned + xpAwarded;
        
        await updateDoc(summaryRef, {
          completedCount: newCompletedCount,
          xpEarned: newXpEarned,
          summary: generateDailySummary(
            status === 'completed' ? [item] : [],
            newXpEarned,
            user.streak.count,
            statGains
          ),
        });
      }
      
      return { xpAwarded, levelUp, newLevel };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyItems', userId, today] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary', userId, today] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  return {
    dailySummary,
    dailyItems,
    isLoading: isLoadingSummary || isLoadingItems,
    generateQuests: generateQuestsMutation.mutate,
    isGenerating: generateQuestsMutation.isPending,
    completeQuest: completeQuestMutation.mutate,
    isCompleting: completeQuestMutation.isPending,
  };
}
