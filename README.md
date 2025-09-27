# The System - Solo Leveling Inspired Personal Progression App

A React Native app built with Expo and Firebase that gamifies personal development through daily quests, XP progression, and character stats.

## 🎯 Features

- **Character Creation**: Set up your character with customizable stat weights and goals
- **Daily Quest Board**: Receive 3-7 personalized quests each day based on your goals
- **XP & Leveling System**: Earn XP, level up, and unlock new titles
- **Streak System**: Maintain daily streaks for bonus XP, with debuffs for missed days
- **Progress Tracking**: Visual stat progression and achievement system
- **Daily Journal**: Track your progress with automated daily summaries
- **Notifications**: Daily reset reminders and progress nudges
- **Offline Support**: Works offline with data sync when connected

## 🛠 Tech Stack

- **Frontend**: React Native with Expo (SDK 54+)
- **Navigation**: Expo Router
- **State Management**: Zustand + React Query
- **Backend**: Firebase (Auth + Firestore)
- **Styling**: NativeWind (Tailwind CSS)
- **Language**: TypeScript
- **Testing**: Vitest + Testing Library
- **Notifications**: Expo Notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project
- iOS Simulator (for iOS development) or Android Studio (for Android)

### 1. Clone and Install

```bash
git clone <repository-url>
cd the-system-app
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Create a Firestore database
4. Copy your Firebase config values

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Update `.env` with your Firebase configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Deploy Firestore Rules

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy the security rules
firebase deploy --only firestore:rules
```

### 5. Seed Initial Data

Run the seed script to populate quest templates and titles:

```bash
npm run seed
```

### 6. Start Development

```bash
# Start the development server
npm start

# Run on specific platforms
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## 📱 App Structure

```
app/
├── _layout.tsx          # Root layout with navigation
├── index.tsx            # Auth gate and routing
├── onboarding.tsx       # Character creation flow
├── mission.tsx          # Daily quest board
├── journal.tsx          # Progress tracking
└── profile.tsx          # Character stats and settings

components/
├── QuestCard.tsx        # Individual quest display
├── ProgressRing.tsx     # Circular progress indicator
├── StatPill.tsx         # Stat display component
└── XPToast.tsx          # XP gain notifications

services/
├── xp.ts               # XP calculation and leveling
├── questGen.ts         # Daily quest generation
├── user.ts             # User management and streaks
└── journal.ts          # Daily summary generation

hooks/
├── useAuth.ts          # Authentication management
├── useDaily.ts         # Daily quests and progress
└── useNotifications.ts # Local notifications
```

## 🎮 Game Mechanics

### XP System
- **Base XP**: Easy (10), Medium (20), Hard (30)
- **Level Formula**: `requiredXP(level) = 100 * level²`
- **Streak Bonus**: +10% (3+ days), +20% (7+ days)
- **Debuff**: -10% per missed day (max -30%)

### Quest Generation
- 3-7 quests per day based on user goals
- Balanced difficulty distribution
- At least one reflective task (WIS/INT) per day
- Avoids consecutive hard quests

### Character Stats
- **STR** (Strength): Physical activities, fitness
- **VIT** (Vitality): Health, endurance, wellness
- **INT** (Intelligence): Learning, problem-solving
- **WIS** (Wisdom): Reflection, mindfulness, insight
- **DEX** (Dexterity): Skills, precision, creativity
- **CHA** (Charisma): Social skills, communication

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

## 📦 Building for Production

### EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for platforms:
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Both platforms
eas build --platform all
```

### Local Builds

```bash
# Android APK
expo build:android

# iOS (requires macOS)
expo build:ios
```

## 🔧 Configuration

### Firebase Security Rules

The app includes comprehensive Firestore security rules that ensure:
- Users can only access their own data
- Proper validation of data structures
- Public read access to quest templates and titles
- No unauthorized data access

### Notification Settings

- Daily reset notifications at user-configured hour
- Afternoon progress check-in (3 hours after reset)
- Configurable through user settings

### Offline Support

- Quest data cached locally
- Progress synced when online
- Graceful degradation for offline use

## 🚨 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Firebase connection**: Verify environment variables
3. **iOS build issues**: Ensure Xcode and iOS Simulator are installed
4. **Android build issues**: Check Android Studio and SDK setup

### Debug Mode

Enable debug logging by setting:
```env
EXPO_PUBLIC_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Solo Leveling webtoon/manhwa
- Built with React Native and Expo
- Powered by Firebase
- UI components styled with NativeWind

## 📞 Support

For support, email support@thesystem.app or create an issue in the repository.

---

**Happy Leveling! 🎮⚡**
