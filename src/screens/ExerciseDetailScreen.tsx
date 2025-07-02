import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { useTimerStore } from '../store/timerStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_SCREEN } from '../navigators/screen-type';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

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


export const ExerciseDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { exerciseId } = (route.params as any) || {};

  const { exercises, favoriteExercises, toggleFavorite, initializeData } = useGymStore();
  const { startRestTimer } = useTimerStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const exercise = exercises.find(ex => ex.id === exerciseId);
  // const isFavorite = favoriteExercises.includes(exerciseId);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy bài tập</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartRestTimer = () => {
    startRestTimer(exercise.restTime);
    navigation.navigate(APP_SCREEN.TIMER as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={{ width: 100, height: 40, backgroundColor: '#fff', left: 70, position: 'absolute', zIndex: 1 }} />
          <FastImage source={imageMap[exercise.image]} style={styles.image} resizeMode='contain' />
        </View>

        <View style={styles.content}>
          {/* Title and Muscle Group */}
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <View style={styles.muscleGroupContainer}>
              <Text style={styles.muscleGroupIcon}>{exercise.muscleGroup.icon}</Text>
              <Text style={styles.muscleGroupName}>{exercise.muscleGroup.name}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercise.sets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercise.reps}</Text>
              <Text style={styles.statLabel}>Reps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercise.restTime}s</Text>
              <Text style={styles.statLabel}>Nghỉ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                {
                  color:
                    exercise.difficulty === 'Beginner' ? '#4CAF50' :
                      exercise.difficulty === 'Intermediate' ? '#FF9800' : '#F44336'
                }
              ]}>
                {exercise.difficulty}
              </Text>
              <Text style={styles.statLabel}>Độ khó</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Mô tả</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Hướng dẫn</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Breathing Technique */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🫁 Kỹ thuật thở</Text>
            <Text style={styles.breathingText}>{exercise.breathingTechnique}</Text>
          </View>

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Mẹo hay</Text>
            {exercise.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Common Mistakes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Lỗi thường gặp</Text>
            {exercise.commonMistakes.map((mistake, index) => (
              <View key={index} style={styles.mistakeItem}>
                <Text style={styles.mistakeBullet}>•</Text>
                <Text style={styles.mistakeText}>{mistake}</Text>
              </View>
            ))}
          </View>

          {/* Equipment */}
          {exercise.equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏋️ Dụng cụ cần thiết</Text>
              <View style={styles.equipmentContainer}>
                {exercise.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.timerButton}
              onPress={handleStartRestTimer}
            >
              <Text style={styles.timerButtonText}>⏱️ Bắt đầu hẹn giờ nghỉ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 250
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    backgroundColor: '#fff',
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  muscleGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  muscleGroupIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  muscleGroupName: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 12,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  breathingText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  mistakeItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  mistakeBullet: {
    fontSize: 16,
    color: '#F44336',
    marginRight: 8,
    fontWeight: 'bold',
  },
  mistakeText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  actionButtons: {
    marginTop: 20,
  },
  timerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
