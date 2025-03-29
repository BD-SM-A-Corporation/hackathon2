import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { recordService } from '../services/recordService';

interface AddRecordFormProps {
  bedId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({
  bedId,
  onClose,
  onSuccess,
}) => {
  const [height, setHeight] = useState('');
  const [humidity, setHumidity] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [visualStatus, setVisualStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!height || !humidity || !notes || !photoUrl || !visualStatus) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await recordService.createRecord(bedId, {
        height: parseFloat(height),
        humidity: parseFloat(humidity),
        notes,
        photo_url: photoUrl,
        visual_status: visualStatus,
      });
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Record</Text>
      
      <View style={styles.field}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholder="Enter height"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Humidity (%)</Text>
        <TextInput
          style={styles.input}
          value={humidity}
          onChangeText={setHumidity}
          keyboardType="numeric"
          placeholder="Enter humidity"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholder="Enter notes"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Photo URL</Text>
        <TextInput
          style={styles.input}
          value={photoUrl}
          onChangeText={setPhotoUrl}
          placeholder="Enter photo URL"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Visual Status</Text>
        <TextInput
          style={styles.input}
          value={visualStatus}
          onChangeText={setVisualStatus}
          placeholder="Enter visual status"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Record'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 