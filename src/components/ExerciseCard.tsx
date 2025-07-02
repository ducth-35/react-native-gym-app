import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { Exercise } from '../types/gym.types';

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
  const scaleValue = useState(new Animated.Value(1))[0];

  // const handleFavoritePress = () => {
  //   // Haptic feedback
  //   if (Platform.OS === 'ios') {
  //     // For iOS, we would use react-native-haptic-feedback
  //     // For now, use vibration as fallback
  //   } else {
  //   }

  //   // Animate heart
  //   Animated.sequence([
  //     Animated.timing(scaleValue, {
  //       toValue: 1.2,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(scaleValue, {
  //       toValue: 1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();

  //   toggleFavorite(exercise.id);
  // };

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

  const imageMap: Record<string, any> = {
    'push_up.gif': require('../assets/images/push_up.gif'),
    'pull_up.gif': require('../assets/images/pull_up.gif'),
    'squat.gif': require('../assets/images/squat.gif'),
    'plank.gif': require('../assets/images/plank.gif'),
    'shoulder_press.gif': require('../assets/images/shoulder_press.gif'),
    'bicep_curl.gif': require('../assets/images/bicep_curl.gif'),
    'burpee.gif': require('../assets/images/burpee.gif'),
    'deadlift.gif': require('../assets/images/deadlift.gif'),
    'bench_press.gif': require('../assets/images/bench_press.gif'),
    'mountain_climber.gif': require('../assets/images/mountain_climber.gif'),
    'bodyweight_lunges.gif': require('../assets/images/bodyweight_lunges.gif'),
    'dips.gif': require('../assets/images/dips.gif'),
    'russian_twist.gif': require('../assets/images/russian_twist.gif'),
  };


  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <Pressable onPress={handlePress}>
        <View style={styles.imageContainer}>
          <View style={{ width: 80, height: 30, backgroundColor: '#fff', left: 80, position: 'absolute', zIndex: 1 }} />
          <Image
            source={imageMap[exercise.image]}
            style={styles.image}
            resizeMode='contain'
          />
        </View>

        <View style={styles.content}>
          <View style={styles.muscleGroup}>
            <Text style={styles.muscleGroupIcon}>
              {exercise.muscleGroup.icon}
            </Text>
            <Text style={styles.muscleGroupName}>
              {exercise.muscleGroup.name}
            </Text>
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
            <Text
              style={[
                styles.difficultyText,
                {
                  backgroundColor:
                    exercise.difficulty === 'Beginner'
                      ? '#4CAF50'
                      : exercise.difficulty === 'Intermediate'
                        ? '#FF9800'
                        : '#F44336',
                },
              ]}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>
      </Pressable>
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
    overflow:'hidden'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: 180,
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
