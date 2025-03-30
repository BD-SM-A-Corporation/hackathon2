import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, TextInput, Button, Avatar, Surface, IconButton } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProfileScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
  });
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: user.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: user.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      bottomSheetModalRef.current?.dismiss();
    },
  });

  const handleUpdateProfile = () => {
    if (!editedProfile.name) return;
    updateMutation.mutate(editedProfile);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ScrollView style={styles.container}>
          <Surface style={styles.header} elevation={4}>
            <View style={styles.avatarContainer}>
              <Avatar.Text
                size={100}
                label={profile?.data.name.slice(0, 2).toUpperCase() || 'U'}
                style={styles.avatar}
              />
              <IconButton
                icon="pencil"
                size={20}
                onPress={handlePresentModalPress}
                style={styles.editButton}
              />
            </View>
            <Text variant="headlineMedium" style={styles.name}>
              {profile?.data.name}
            </Text>
            <Text variant="bodyLarge" style={styles.email}>
              {profile?.data.email}
            </Text>
          </Surface>

          <View style={styles.statsContainer}>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="titleMedium" style={styles.statValue}>0</Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Active Beds</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="titleMedium" style={styles.statValue}>0</Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Total Plants</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="titleMedium" style={styles.statValue}>0</Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Harvests</Text>
            </Surface>
          </View>

          <View style={styles.content}>
            <Button
              mode="contained"
              onPress={logout}
              style={styles.logoutButton}
              icon="logout"
            >
              Logout
            </Button>
          </View>
        </ScrollView>

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
          style={styles.bottomSheet}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Edit Profile
            </Text>

            <TextInput
              label="Name"
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
              style={styles.input}
              mode="outlined"
            />

            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
              style={styles.button}
              icon="content-save"
            >
              Save Changes
            </Button>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  editButton: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: '#6200ee',
  },
  name: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: (Dimensions.get('window').width - 80) / 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  button: {
    marginTop: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
}); 