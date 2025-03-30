import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Switch, Button, TextInput } from 'react-native-paper';
import { notificationService, NotificationSettings } from '../../services/notifications';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function NotificationSettingsScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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
    try {
      if (enabled) {
        // Request permissions and register for notifications
        const permissionGranted = await notificationService.registerForPushNotifications();
        if (!permissionGranted) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive daily reminders.',
            [{ text: 'OK' }]
          );
          return;
        }

        // Schedule the daily reminder
        const scheduled = await notificationService.scheduleDailyReminder(settings.dailyReminderTime);
        if (!scheduled) {
          Alert.alert(
            'Error',
            'Failed to schedule daily reminder. Please try again.',
            [{ text: 'OK' }]
          );
          return;
        }
      } else {
        // Cancel all notifications
        await notificationService.cancelAllNotifications();
      }
      
      const newSettings = { ...settings, enabled };
      setSettings(newSettings);
      await notificationService.saveNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert(
        'Error',
        'Failed to update notification settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTimeChange = async () => {
    try {
      const newSettings = { ...settings, dailyReminderTime: tempTime };
      setSettings(newSettings);
      await notificationService.saveNotificationSettings(newSettings);
      
      if (settings.enabled) {
        const scheduled = await notificationService.scheduleDailyReminder(tempTime);
        if (!scheduled) {
          Alert.alert(
            'Error',
            'Failed to update reminder time. Please try again.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error('Error updating time:', error);
      Alert.alert(
        'Error',
        'Failed to update reminder time. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              onPress={handlePresentModalPress}
            >
              {settings.dailyReminderTime}
            </Button>
          </View>
        )}

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={['50%']}
            index={0}
            enablePanDownToClose
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.7}
                pressBehavior="close"
              />
            )}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text variant="headlineSmall" style={styles.modalTitle}>Set Reminder Time</Text>
              <TextInput
                label="Time (HH:mm)"
                value={tempTime}
                onChangeText={setTempTime}
                keyboardType="numeric"
                style={styles.timeInput}
                mode="outlined"
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => bottomSheetModalRef.current?.dismiss()}
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
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInput: {
    marginBottom: 16,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalButton: {
    marginLeft: 8,
  },
}); 