import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { notificationService, NotificationSettings } from '../../services/notifications';

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
    
    setShowTimePicker(false);
  };

  return (
    <View style={styles.container}>
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
          <Button
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
          >
            {settings.dailyReminderTime}
          </Button>
        </View>
      )}

      <Portal>
        <Modal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Set Reminder Time</Text>
          <TextInput
            label="Time (HH:mm)"
            value={tempTime}
            onChangeText={setTempTime}
            keyboardType="numeric"
            style={styles.timeInput}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleTimeChange}
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  timeInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 8,
  },
}); 