import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationSettings {
  dailyReminderTime: string; // Format: "HH:mm"
  enabled: boolean;
}

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

export const notificationService = {
  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      console.log('Push token:', token);
      return true;
    } catch (error) {
      console.error('Error getting push token:', error);
      return false;
    }
  },

  async scheduleDailyReminder(time: string) {
    try {
      await this.cancelAllNotifications();

      const [hours, minutes] = time.split(':').map(Number);
      
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      // Schedule the notification using DailyNotificationTrigger
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Inspection Reminder",
          body: "It's time to check your plants!",
          sound: true,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
          type: 'daily',
        } as Notifications.DailyTriggerInput,
      });

      console.log('Daily reminder scheduled with ID:', identifier, 'for:', time);
      return true;
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      return false;
    }
  },

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : { dailyReminderTime: "10:00", enabled: false };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return { dailyReminderTime: "10:00", enabled: false };
    }
  },

  async saveNotificationSettings(settings: NotificationSettings) {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
      console.log('Notification settings saved:', settings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  },
}; 