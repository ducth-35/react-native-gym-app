import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MuscleGroup } from '../types/gym.types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with margins

interface MuscleGroupCardProps {
  muscleGroup: MuscleGroup;
  onPress: () => void;
  exerciseCount?: number;
}

export const MuscleGroupCard: React.FC<MuscleGroupCardProps> = ({
  muscleGroup,
  onPress,
  exerciseCount = 0,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: muscleGroup.color }]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{muscleGroup.icon}</Text>
      <Text style={styles.name}>{muscleGroup.name}</Text>
      <Text style={styles.count}>{exerciseCount} bài tập</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 120,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
});
