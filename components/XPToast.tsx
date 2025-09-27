import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';

interface XPToastProps {
  xpGained: number;
  levelUp?: boolean;
  newLevel?: number;
  onComplete?: () => void;
}

export default function XPToast({ 
  xpGained, 
  levelUp = false, 
  newLevel, 
  onComplete 
}: XPToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 3 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onComplete]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        zIndex: 1000,
      }}
    >
      <View className={`p-4 rounded-lg ${
        levelUp ? 'bg-yellow-600' : 'bg-primary-600'
      }`}>
        <View className="flex-row items-center justify-center">
          <Text className="text-2xl mr-2">
            {levelUp ? '🎉' : '⚡'}
          </Text>
          <View className="items-center">
            <Text className="text-white text-lg font-bold">
              {levelUp ? 'LEVEL UP!' : `+${xpGained} XP`}
            </Text>
            {levelUp && newLevel && (
              <Text className="text-white text-sm">
                You are now Level {newLevel}!
              </Text>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
