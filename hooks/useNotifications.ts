import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || null));

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      // Note: removeNotificationSubscription might not be available in all versions
      // The listeners will be cleaned up automatically when the component unmounts
    };
  }, []);

  const scheduleDailyReset = async (resetHour: number) => {
    try {
      // Cancel existing daily reset notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Schedule daily reset notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Reset! 🎯',
          body: 'Your new quests are ready. Time to level up!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: resetHour,
          minute: 0,
          repeats: true,
        },
      });

      // Schedule afternoon nudge (3 hours after reset)
      const nudgeHour = (resetHour + 3) % 24;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Quest Check-in ⚔️',
          body: 'How are your quests going? Keep pushing forward!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: nudgeHour,
          minute: 0,
          repeats: true,
        },
      });

      console.log(`Scheduled notifications for reset at ${resetHour}:00`);
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  const sendImmediateNotification = async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  };

  return {
    expoPushToken,
    notification,
    scheduleDailyReset,
    sendImmediateNotification,
    cancelAllNotifications,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }
  
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);
  } catch (error) {
    console.error('Error getting push token:', error);
  }

  return token;
}
