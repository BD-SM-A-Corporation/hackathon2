import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { Text, Card, FAB, Button, TextInput } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { beds, Bed, CreateBedRequest } from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function BedsScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [showSowingDate, setShowSowingDate] = React.useState(false);
  const [showHarvestDate, setShowHarvestDate] = React.useState(false);
  const [newBed, setNewBed] = React.useState<CreateBedRequest>({
    name: '',
    plant_type: '',
    sowing_date: new Date().toISOString(),
    substrate_type: '',
    expected_harvest: new Date().toISOString(),
  });
  const queryClient = useQueryClient();

  const { data: bedsList, isLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: beds.getAll,
  });

  console.log('Beds data:', bedsList?.data);

  const createMutation = useMutation({
    mutationFn: beds.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      setNewBed({
        name: '',
        plant_type: '',
        sowing_date: new Date().toISOString(),
        substrate_type: '',
        expected_harvest: new Date().toISOString(),
      });
    },
  });

  const handleCreateBed = () => {
    if (!newBed.name || !newBed.plant_type || !newBed.sowing_date || !newBed.substrate_type || !newBed.expected_harvest) {
      return;
    }
    createMutation.mutate(newBed);
  };

  const onSowingDateChange = (event: any, selectedDate?: Date) => {
    setShowSowingDate(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T00:00:00Z`;
      setNewBed({ ...newBed, sowing_date: formattedDate });
    }
  };

  const onHarvestDateChange = (event: any, selectedDate?: Date) => {
    setShowHarvestDate(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T00:00:00Z`;
      setNewBed({ ...newBed, expected_harvest: formattedDate });
    }
  };

  const renderBed = ({ item }: { item: Bed }) => (
    <Card
      style={styles.card}
      onPress={() => router.push(`/(app)/beds/${item.ID}`)}
    >
      <Card.Content>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium">Id: {item.ID}</Text>
        <Text variant="bodyMedium">Plant: {item.plant_type}</Text>
        <Text variant="bodyMedium">Sowing Date: {new Date(item.sowing_date).toLocaleDateString()}</Text>
        <Text variant="bodyMedium">Substrate: {item.substrate_type}</Text>
        <Text variant="bodyMedium">Expected Harvest: {new Date(item.expected_harvest).toLocaleDateString()}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={bedsList?.data}
          renderItem={renderBed}
          keyExtractor={(item) => String(item.ID)}
          contentContainerStyle={styles.list}
        />

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={['50%', '75%', '90%']}
            index={0}
            enablePanDownToClose
            enableDynamicSizing
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
              <Text variant="headlineSmall" style={styles.modalTitle}>Create New Bed</Text>
              
              <TextInput
                label="Name"
                value={newBed.name}
                onChangeText={(text) => setNewBed({ ...newBed, name: text })}
                style={styles.input}
              />
              
              <TextInput
                label="Plant Type"
                value={newBed.plant_type}
                onChangeText={(text) => setNewBed({ ...newBed, plant_type: text })}
                style={styles.input}
              />
              
              <Button
                mode="outlined"
                onPress={() => setShowSowingDate(true)}
                style={styles.input}
              >
                Sowing Date: {new Date(newBed.sowing_date).toLocaleDateString()}
              </Button>

              <Button
                mode="outlined"
                onPress={() => setShowHarvestDate(true)}
                style={styles.input}
              >
                Expected Harvest: {new Date(newBed.expected_harvest).toLocaleDateString()}
              </Button>
              
              <TextInput
                label="Substrate Type"
                value={newBed.substrate_type}
                onChangeText={(text) => setNewBed({ ...newBed, substrate_type: text })}
                style={styles.input}
              />

              {(showSowingDate || showHarvestDate) && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={showSowingDate ? new Date(newBed.sowing_date) : new Date(newBed.expected_harvest)}
                  mode="date"
                  is24Hour={true}
                  onChange={showSowingDate ? onSowingDateChange : onHarvestDateChange}
                />
              )}

              <Button
                mode="contained"
                onPress={handleCreateBed}
                loading={createMutation.isPending}
                disabled={createMutation.isPending}
                style={styles.button}
              >
                Create Bed
              </Button>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handlePresentModalPress}
        />
      </View>
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
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
}); 