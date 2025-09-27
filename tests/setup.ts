import { vi } from 'vitest';

// Mock react-native-reanimated
vi.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useLocalSearchParams: () => ({}),
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  },
}));

// Mock expo-notifications
vi.mock('expo-notifications', () => ({
  setNotificationHandler: vi.fn(),
  scheduleNotificationAsync: vi.fn(),
  cancelAllScheduledNotificationsAsync: vi.fn(),
  getPermissionsAsync: vi.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: vi.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: vi.fn(() => Promise.resolve({ data: 'mock-token' })),
  addNotificationReceivedListener: vi.fn(),
  addNotificationResponseReceivedListener: vi.fn(),
  removeNotificationSubscription: vi.fn(),
}));

// Mock expo-secure-store
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

// Mock Firebase
vi.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// Mock dayjs
vi.mock('dayjs', () => {
  const originalDayjs = vi.importActual('dayjs') as any;
  return {
    ...originalDayjs,
    default: (date?: any) => {
      const mockDate = originalDayjs.default(date || '2025-09-23T10:00:00Z');
      return {
        ...mockDate,
        hour: vi.fn(() => 10),
        minute: vi.fn(() => 0),
        second: vi.fn(() => 0),
        isBefore: vi.fn(() => false),
        isAfter: vi.fn(() => true),
        subtract: vi.fn(() => mockDate),
        add: vi.fn(() => mockDate),
        format: vi.fn(() => '2025-09-23'),
        toISOString: vi.fn(() => '2025-09-23T10:00:00.000Z'),
      };
    },
  };
});
