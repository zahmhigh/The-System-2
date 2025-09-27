import React from 'react';
import { View, Text } from 'react-native';
import { Stat } from '../types/domain';

interface StatPillProps {
  stat: Stat;
  value: number;
  maxValue?: number;
  showValue?: boolean;
}

const statColors = {
  STR: 'bg-red-500',
  VIT: 'bg-green-500',
  INT: 'bg-blue-500',
  WIS: 'bg-purple-500',
  DEX: 'bg-yellow-500',
  CHA: 'bg-pink-500',
};

const statLabels = {
  STR: 'Strength',
  VIT: 'Vitality',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  DEX: 'Dexterity',
  CHA: 'Charisma',
};

export default function StatPill({ 
  stat, 
  value, 
  maxValue = 100, 
  showValue = true 
}: StatPillProps) {
  const progress = Math.min(1, value / maxValue);
  const colorClass = statColors[stat];

  return (
    <View className="flex-row items-center">
      <View className={`w-3 h-3 rounded-full ${colorClass} mr-2`} />
      <Text className="text-white text-sm font-medium mr-2">
        {statLabels[stat]}
      </Text>
      {showValue && (
        <View className="flex-row items-center">
          <View className="w-16 h-2 bg-dark-700 rounded-full mr-2">
            <View 
              className={`h-2 ${colorClass} rounded-full`}
              style={{ width: `${progress * 100}%` }}
            />
          </View>
          <Text className="text-white text-sm font-semibold min-w-[30px] text-right">
            {value}
          </Text>
        </View>
      )}
    </View>
  );
}
