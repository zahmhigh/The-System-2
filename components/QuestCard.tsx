import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DailyItem, QuestStatus } from '../types/domain';

interface QuestCardProps {
  item: DailyItem;
  onAction: (action: 'complete' | 'skip' | 'fail') => void;
  disabled?: boolean;
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const statusColors = {
  pending: 'border-gray-600',
  completed: 'border-green-500 bg-green-900/20',
  skipped: 'border-yellow-500 bg-yellow-900/20',
  failed: 'border-red-500 bg-red-900/20',
};

const statusIcons = {
  pending: '⏳',
  completed: '✅',
  skipped: '⏭️',
  failed: '❌',
};

export default function QuestCard({ item, onAction, disabled = false }: QuestCardProps) {
  const getStatColor = (stat: string) => {
    const colors = {
      STR: 'bg-red-500',
      VIT: 'bg-green-500',
      INT: 'bg-blue-500',
      WIS: 'bg-purple-500',
      DEX: 'bg-yellow-500',
      CHA: 'bg-pink-500',
    };
    return colors[stat as keyof typeof colors] || 'bg-gray-500';
  };

  const getProofIcon = (proof: string) => {
    const icons = {
      check: '☑️',
      timer: '⏱️',
      note: '📝',
      photo: '📷',
      link: '🔗',
    };
    return icons[proof as keyof typeof icons] || '☑️';
  };

  return (
    <View className={`p-4 rounded-lg border-2 ${statusColors[item.status]} bg-dark-800`}>
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold mb-1">{item.title}</Text>
          <View className="flex-row items-center space-x-2">
            <View className={`px-2 py-1 rounded-full ${difficultyColors[item.difficulty]}`}>
              <Text className="text-white text-xs font-semibold">
                {difficultyLabels[item.difficulty]}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-400 text-sm">⏱️</Text>
              <Text className="text-gray-400 text-sm ml-1">{item.durationMin}m</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-400 text-sm">{getProofIcon(item.proof)}</Text>
            </View>
          </View>
        </View>
        <Text className="text-2xl">{statusIcons[item.status]}</Text>
      </View>

      {/* Stats */}
      <View className="flex-row flex-wrap mb-3">
        {item.stats.map((stat) => (
          <View key={stat} className="flex-row items-center mr-2 mb-1">
            <View className={`w-2 h-2 rounded-full ${getStatColor(stat)} mr-1`} />
            <Text className="text-gray-300 text-sm">{stat}</Text>
          </View>
        ))}
      </View>

      {/* XP Reward */}
      {item.xpAwarded > 0 && (
        <View className="mb-3 p-2 bg-primary-900/30 rounded-lg">
          <Text className="text-primary-400 text-sm font-semibold">
            ⚡ +{item.xpAwarded} XP Earned
          </Text>
        </View>
      )}

      {/* Actions */}
      {item.status === 'pending' && (
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => onAction('complete')}
            disabled={disabled}
            className="flex-1 bg-green-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              {disabled ? 'Processing...' : 'Complete'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAction('skip')}
            disabled={disabled}
            className="flex-1 bg-yellow-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAction('fail')}
            disabled={disabled}
            className="flex-1 bg-red-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Fail</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Completed/Failed Status */}
      {item.status !== 'pending' && (
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 text-sm">
            {item.status === 'completed' && item.completedAt
              ? `Completed at ${new Date(item.completedAt).toLocaleTimeString()}`
              : `Status: ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`}
          </Text>
          {item.xpAwarded > 0 && (
            <Text className="text-primary-400 text-sm font-semibold">
              +{item.xpAwarded} XP
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
