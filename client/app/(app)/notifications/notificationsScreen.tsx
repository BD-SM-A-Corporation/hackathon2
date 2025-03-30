import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Button } from 'react-native-paper';
import { notificationService, NotificationSettings } from '../../services/notifications';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminderTime: "10:00",
    enabled: false,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = String(selectedDate.getHours()).padStart(2, '0');
      const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      setTempTime(formattedTime);
      handleTimeChange();
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
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
            >
              {tempTime}
            </Button>
          </View>
        </View>
      )}

      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={(() => {
            const [hours, minutes] = tempTime.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0);
            return date;
          })()}
          mode="time"
          is24Hour={true}
          onChange={onTimeChange}
        />
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
  },
  timeButton: {
    minWidth: 120,
  },
}); 