import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to The System</Text>
      <Text style={styles.subtitle}>Start your solo leveling journey</Text>
      <Text style={styles.description}>
        This is a placeholder screen. The full app with NativeWind styling is ready to run once you:
        {'\n'}1. Set up your Firebase configuration
        {'\n'}2. Install the proper fonts
        {'\n'}3. Run the seed script
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
  },
});