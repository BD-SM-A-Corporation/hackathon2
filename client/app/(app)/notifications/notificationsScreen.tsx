import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Button, TextInput } from 'react-native-paper';
import { notificationService, NotificationSettings } from '../../services/notifications';
import { BottomSheetView } from '@gorhom/bottom-sheet';

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminderTime: "10:00",
    enabled: false,
  });
  const [tempTime, setTempTime] = useState("10:00");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await notificationService.getNotificationSettings();
    setSettings(savedSettings);
    setTempTime(savedSettings.dailyReminderTime);
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      await notificationService.registerForPushNotifications();
      await notificationService.scheduleDailyReminder(settings.dailyReminderTime);
    } else {
      await notificationService.cancelAllNotifications();
    }
    
    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    await notificationService.saveNotificationSettings(newSettings);
  };

  const handleTimeChange = async () => {
    const newSettings = { ...settings, dailyReminderTime: tempTime };
    setSettings(newSettings);
    await notificationService.saveNotificationSettings(newSettings);
    
    if (settings.enabled) {
      await notificationService.scheduleDailyReminder(tempTime);
    }
  };

  return (
    <BottomSheetView style={styles.contentContainer}>
      <View style={styles.setting}>
        <View style={styles.settingInfo}>
          <Text variant="titleMedium">Daily Reminders</Text>
          <Text variant="bodyMedium">Get reminded to check your plants daily</Text>
        </View>
        <Switch
          value={settings.enabled}
          onValueChange={handleToggleNotifications}
        />
      </View>

      {settings.enabled && (
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text variant="titleMedium">Reminder Time</Text>
            <Text variant="bodyMedium">Set when you want to receive daily reminders</Text>
          </View>
          <View style={styles.timeInputContainer}>
            <TextInput
              label="Time (HH:mm)"
              value={tempTime}
              onChangeText={setTempTime}
              keyboardType="numeric"
              style={styles.timeInput}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={handleTimeChange}
              style={styles.saveButton}
            >
              Save
            </Button>
          </View>
        </View>
      )}
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    width: 120,
  },
  saveButton: {
    marginLeft: 8,
  },
}); 