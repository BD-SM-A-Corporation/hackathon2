import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Avatar, Portal, Modal } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={profile?.data.name.slice(0, 2).toUpperCase() || 'U'}
        />
        <Text variant="headlineMedium" style={styles.name}>
          {profile?.data.name}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {profile?.data.email}
        </Text>
      </View>

      <View style={styles.content}>
        <Button
          mode="outlined"
          onPress={() => setIsEditing(true)}
          style={styles.button}
        >
          Edit Profile
        </Button>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.button}
        >
          Logout
        </Button>
      </View>

      <Portal>
        <Modal
          visible={isEditing}
          onDismiss={() => setIsEditing(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Edit Profile
          </Text>

          <TextInput
            label="Name"
            value={editedProfile.name}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            loading={updateMutation.isPending}
            disabled={updateMutation.isPending}
            style={styles.button}
          >
            Save Changes
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  name: {
    marginTop: 16,
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  button: {
    marginTop: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
}); 