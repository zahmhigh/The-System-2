import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The System</Text>
      <Text style={styles.subtitle}>Solo Leveling Inspired Personal Progression App</Text>
      <Text style={styles.description}>
        🎯 Complete daily quests to level up your character
        {'\n'}⚡ Earn XP and unlock new titles
        {'\n'}🔥 Maintain streaks for bonus rewards
        {'\n'}📊 Track your progress across 6 core stats
      </Text>
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.statusText}>Setting up your journey...</Text>
      </View>
      <Text style={styles.setupText}>
        To get started:
        {'\n'}1. Configure Firebase in .env
        {'\n'}2. Run: npm run seed
        {'\n'}3. Start the app: npm start
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#0ea5e9',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  setupText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
