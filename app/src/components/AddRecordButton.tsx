import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AnimatedModal } from './AnimatedModal';
import { AddRecordForm } from './AddRecordForm';

interface AddRecordButtonProps {
  bedId: number;
  onSuccess: () => void;
}

export const AddRecordButton: React.FC<AddRecordButtonProps> = ({
  bedId,
  onSuccess,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add New Record</Text>
      </TouchableOpacity>

      <AnimatedModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        height={600}
      >
        <AddRecordForm
          bedId={bedId}
          onClose={() => setIsModalVisible(false)}
          onSuccess={onSuccess}
        />
      </AnimatedModal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 