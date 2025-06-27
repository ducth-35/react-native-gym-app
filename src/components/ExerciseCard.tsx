import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  Vibration,
} from 'react-native';
import { Exercise } from '../types/gym.types';
import { useGymStore } from '../store/gymStore';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  showFavorite?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
  showFavorite = true,
}) => {
  const { favoriteExercises, toggleFavorite } = useGymStore();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const scaleValue = useState(new Animated.Value(1))[0];
  const isFavorite = favoriteExercises.includes(exercise.id);

  const handleFavoritePress = () => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      // For iOS, we would use react-native-haptic-feedback
      // For now, use vibration as fallback
      Vibration.vibrate(50);
    } else {
      Vibration.vibrate(50);
    }

    // Animate heart
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavorite(exercise.id);
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress();
    });
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: exercise.image }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="small" color="#FF6B6B" />
          </View>
        )}
        {imageError && (
          <View style={styles.imageError}>
            <Text style={styles.imageErrorText}>🏋️</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{exercise.name}</Text>
          {showFavorite && (
            <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
              <Text style={[styles.favoriteIcon, { color: isFavorite ? '#FF6B6B' : '#ccc' }]}>
                ♥
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.muscleGroup}>
          <Text style={styles.muscleGroupIcon}>{exercise.muscleGroup.icon}</Text>
          <Text style={styles.muscleGroupName}>{exercise.muscleGroup.name}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sets:</Text>
            <Text style={styles.detailValue}>{exercise.sets}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Reps:</Text>
            <Text style={styles.detailValue}>{exercise.reps}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nghỉ:</Text>
            <Text style={styles.detailValue}>{exercise.restTime}s</Text>
          </View>
        </View>
        
        <View style={styles.difficulty}>
          <Text style={[
            styles.difficultyText,
            {
              backgroundColor: 
                exercise.difficulty === 'Beginner' ? '#4CAF50' :
                exercise.difficulty === 'Intermediate' ? '#FF9800' : '#F44336'
            }
          ]}>
            {exercise.difficulty}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageErrorText: {
    fontSize: 32,
    opacity: 0.5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  muscleGroupIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  muscleGroupName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  difficulty: {
    alignItems: 'flex-start',
  },
  difficultyText: {
    fontSize: 12,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: 'bold',
  },
});
