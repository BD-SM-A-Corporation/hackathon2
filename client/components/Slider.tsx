import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Surface, Text } from 'react-native-paper';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.3;
const SPACING = 8;

interface SliderProps {
  items: number[];
  onCardPress?: (index: number) => void;
}

export default function Slider({ items, onCardPress }: SliderProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + SPACING}
      decelerationRate="fast"
      contentContainerStyle={styles.container}
    >
      {items.map((_, index) => (
        <Surface
          key={index}
          style={styles.card}
          elevation={2}
          onTouchEnd={() => onCardPress?.(index)}
        >
          <View style={styles.cardContent}>
            
          </View>
        </Surface>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING,
    paddingVertical: 16,
    marginBottom: 35,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    borderRadius: 24,
    backgroundColor: '#2E2B34',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});
