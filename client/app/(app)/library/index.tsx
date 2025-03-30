import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { plants } from '../../services/api';
import { Plant } from '../../services/api';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function LibraryScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback((plant: Plant) => {
    setSelectedPlant(plant);
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPlant, setSelectedPlant] = React.useState<Plant | null>(null);

  const { data: plantsList, isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: plants.getAll,
  });

  const filteredPlants = plantsList?.data.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlant = ({ item }: { item: Plant }) => (
    <Card
      style={styles.card}
      onPress={() => handlePresentModalPress(item)}
    >
      <Card.Content>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium" numberOfLines={2}>
          {item.description}
        </Text>
        <Text variant="bodySmall">
          Growing Time: {item.growingTime} days
        </Text>
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
        <Searchbar
          placeholder="Search plants"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <FlatList
          data={filteredPlants}
          renderItem={renderPlant}
          keyExtractor={(item) => item.id}
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
              {selectedPlant && (
                <>
                  <Text variant="headlineSmall" style={styles.modalTitle}>
                    {selectedPlant.name}
                  </Text>
                  <Text variant="bodyLarge" style={styles.modalDescription}>
                    {selectedPlant.description}
                  </Text>
                  <View style={styles.modalDetails}>
                    <Text variant="bodyMedium">
                      Growing Time: {selectedPlant.growingTime} days
                    </Text>
                    <Text variant="bodyMedium">
                      Temperature Range: {selectedPlant.temperature.min}°C - {selectedPlant.temperature.max}°C
                    </Text>
                    <Text variant="bodyMedium">
                      Moisture Range: {selectedPlant.moisture.min}% - {selectedPlant.moisture.max}%
                    </Text>
                  </View>
                </>
              )}
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
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
  searchbar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    marginBottom: 16,
  },
  modalDetails: {
    gap: 8,
    width: '100%',
  },
}); 