import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Firebase configuration - using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing required Firebase environment variables.');
  console.error('Please ensure your .env file contains all required Firebase credentials.');
  console.error('You can also set them directly:');
  console.error('EXPO_PUBLIC_FIREBASE_API_KEY=your-key npm run seed');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Quest templates
const questTemplates = [
  // STR Quests
  { id: 'str-pushups', title: 'Morning Push-ups', description: 'Complete 20 push-ups', stats: ['STR'], difficulty: 'easy', durationMin: 5, proof: 'check', isActive: true, goalTags: ['fitness'] },
  { id: 'str-stairs', title: 'Walk the Stairs', description: 'Take stairs instead of elevator for 5 minutes', stats: ['STR'], difficulty: 'easy', durationMin: 5, proof: 'timer', isActive: true, goalTags: ['fitness'] },
  { id: 'str-workout', title: 'Workout Session', description: 'Complete a 30-minute strength training session', stats: ['STR'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['fitness'] },
  { id: 'str-yardwork', title: 'Yard Work', description: 'Spend 45 minutes doing yard work or heavy lifting', stats: ['STR'], difficulty: 'medium', durationMin: 45, proof: 'timer', isActive: true, goalTags: ['fitness'] },
  { id: 'str-intense', title: 'Intense Workout', description: 'Complete a 60-minute high-intensity strength training', stats: ['STR'], difficulty: 'hard', durationMin: 60, proof: 'timer', isActive: true, goalTags: ['fitness'] },

  // VIT Quests
  { id: 'vit-stretch', title: 'Morning Stretch', description: 'Do 10 minutes of stretching', stats: ['VIT'], difficulty: 'easy', durationMin: 10, proof: 'timer', isActive: true, goalTags: ['health'] },
  { id: 'vit-breathing', title: 'Deep Breathing', description: 'Practice 5 minutes of deep breathing exercises', stats: ['VIT'], difficulty: 'easy', durationMin: 5, proof: 'timer', isActive: true, goalTags: ['health'] },
  { id: 'vit-cardio', title: 'Cardio Session', description: 'Complete 30 minutes of cardio exercise', stats: ['VIT'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['fitness'] },
  { id: 'vit-yoga', title: 'Yoga Practice', description: 'Do 45 minutes of yoga or meditation', stats: ['VIT'], difficulty: 'medium', durationMin: 45, proof: 'timer', isActive: true, goalTags: ['health'] },
  { id: 'vit-marathon', title: 'Marathon Training', description: 'Complete 90 minutes of endurance training', stats: ['VIT'], difficulty: 'hard', durationMin: 90, proof: 'timer', isActive: true, goalTags: ['fitness'] },

  // INT Quests
  { id: 'int-article', title: 'Read Article', description: 'Read one educational article or news piece', stats: ['INT'], difficulty: 'easy', durationMin: 10, proof: 'note', isActive: true, goalTags: ['learning'] },
  { id: 'int-vocab', title: 'Learn New Word', description: 'Learn and use 3 new vocabulary words', stats: ['INT'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['learning'] },
  { id: 'int-study', title: 'Study Session', description: 'Study a new topic for 45 minutes', stats: ['INT'], difficulty: 'medium', durationMin: 45, proof: 'timer', isActive: true, goalTags: ['learning'] },
  { id: 'int-course', title: 'Online Course', description: 'Complete one lesson from an online course', stats: ['INT'], difficulty: 'medium', durationMin: 30, proof: 'link', isActive: true, goalTags: ['learning'] },
  { id: 'int-research', title: 'Research Project', description: 'Spend 2 hours researching and documenting a complex topic', stats: ['INT'], difficulty: 'hard', durationMin: 120, proof: 'note', isActive: true, goalTags: ['learning'] },

  // WIS Quests
  { id: 'wis-reflection', title: 'Daily Reflection', description: 'Write 3 things you learned today', stats: ['WIS'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['reflection'] },
  { id: 'wis-gratitude', title: 'Gratitude Practice', description: 'Write down 5 things you are grateful for', stats: ['WIS'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['reflection'] },
  { id: 'wis-journal', title: 'Journal Entry', description: 'Write a 20-minute reflective journal entry', stats: ['WIS'], difficulty: 'medium', durationMin: 20, proof: 'note', isActive: true, goalTags: ['reflection'] },
  { id: 'wis-meditation', title: 'Meditation Session', description: 'Meditate for 30 minutes', stats: ['WIS'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['health'] },
  { id: 'wis-analysis', title: 'Deep Analysis', description: 'Spend 60 minutes analyzing a life decision or problem', stats: ['WIS'], difficulty: 'hard', durationMin: 60, proof: 'note', isActive: true, goalTags: ['reflection'] },

  // DEX Quests
  { id: 'dex-handwriting', title: 'Handwriting Practice', description: 'Write a paragraph by hand', stats: ['DEX'], difficulty: 'easy', durationMin: 10, proof: 'photo', isActive: true, goalTags: ['skills'] },
  { id: 'dex-quickdraw', title: 'Quick Draw', description: 'Practice quick, precise movements for 5 minutes', stats: ['DEX'], difficulty: 'easy', durationMin: 5, proof: 'timer', isActive: true, goalTags: ['skills'] },
  { id: 'dex-craft', title: 'Craft Project', description: 'Work on a craft or art project for 45 minutes', stats: ['DEX'], difficulty: 'medium', durationMin: 45, proof: 'photo', isActive: true, goalTags: ['skills'] },
  { id: 'dex-instrument', title: 'Instrument Practice', description: 'Practice a musical instrument for 30 minutes', stats: ['DEX'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['skills'] },
  { id: 'dex-precision', title: 'Precision Task', description: 'Complete a detailed, precision-based task for 90 minutes', stats: ['DEX'], difficulty: 'hard', durationMin: 90, proof: 'photo', isActive: true, goalTags: ['skills'] },

  // CHA Quests
  { id: 'cha-compliment', title: 'Compliment Someone', description: 'Give a genuine compliment to someone', stats: ['CHA'], difficulty: 'easy', durationMin: 2, proof: 'note', isActive: true, goalTags: ['social'] },
  { id: 'cha-smalltalk', title: 'Small Talk', description: 'Have a 5-minute conversation with a stranger or acquaintance', stats: ['CHA'], difficulty: 'easy', durationMin: 5, proof: 'note', isActive: true, goalTags: ['social'] },
  { id: 'cha-networking', title: 'Networking', description: 'Attend a networking event or social gathering', stats: ['CHA'], difficulty: 'medium', durationMin: 60, proof: 'note', isActive: true, goalTags: ['social'] },
  { id: 'cha-presentation', title: 'Presentation Practice', description: 'Practice a presentation or speech for 30 minutes', stats: ['CHA'], difficulty: 'medium', durationMin: 30, proof: 'timer', isActive: true, goalTags: ['skills'] },
  { id: 'cha-publicspeaking', title: 'Public Speaking', description: 'Give a presentation or speech to a group', stats: ['CHA'], difficulty: 'hard', durationMin: 90, proof: 'note', isActive: true, goalTags: ['social'] },
];

// Titles
const titles = [
  { id: 'rookie', name: 'Rookie Hunter', levelMin: 1 },
  { id: 'novice', name: 'Novice Hunter', levelMin: 5 },
  { id: 'skilled', name: 'Skilled Hunter', levelMin: 10 },
  { id: 'experienced', name: 'Experienced Hunter', levelMin: 15 },
  { id: 'advanced', name: 'Advanced Hunter', levelMin: 20 },
  { id: 'elite', name: 'Elite Hunter', levelMin: 30 },
  { id: 'master', name: 'Master Hunter', levelMin: 40 },
  { id: 'legendary', name: 'Legendary Hunter', levelMin: 50 },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Seed quest templates
    console.log('📝 Seeding quest templates...');
    for (const quest of questTemplates) {
      await setDoc(doc(db, 'quests', quest.id), quest);
    }
    console.log(`✅ Seeded ${questTemplates.length} quest templates`);

    // Seed titles
    console.log('🏆 Seeding titles...');
    for (const title of titles) {
      await setDoc(doc(db, 'titles', title.id), title);
    }
    console.log(`✅ Seeded ${titles.length} titles`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
