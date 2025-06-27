import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../navigators/screen-type';
import { WorkoutPlan, DailyWorkout, WorkoutExercise, Exercise } from '../types/gym.types';

export const CreateWorkoutPlanScreen: React.FC = () => {
  const navigation = useNavigation();
  const { exercises, initializeData, addCustomWorkoutPlan } = useGymStore();
  
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planDuration, setPlanDuration] = useState('7');
  const [planGoal, setPlanGoal] = useState<'muscle_gain' | 'fat_loss' | 'maintenance' | 'strength'>('maintenance');
  const [planDifficulty, setPlanDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [workouts, setWorkouts] = useState<DailyWorkout[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  useEffect(() => {
    initializeData();
    initializeWorkouts();
  }, [initializeData, planDuration]);

  const initializeWorkouts = () => {
    const duration = parseInt(planDuration) || 7;
    const newWorkouts: DailyWorkout[] = [];
    
    for (let i = 1; i <= duration; i++) {
      newWorkouts.push({
        day: i,
        name: `Ngày ${i}`,
        exercises: [],
        estimatedTime: 0,
      });
    }
    setWorkouts(newWorkouts);
  };

  const goals = [
    { id: 'maintenance', name: 'Duy trì sức khỏe', icon: '⚖️', color: '#2196F3' },
    { id: 'muscle_gain', name: 'Tăng cơ bắp', icon: '💪', color: '#4CAF50' },
    { id: 'fat_loss', name: 'Giảm mỡ thừa', icon: '🔥', color: '#FF6B6B' },
    { id: 'strength', name: 'Tăng sức mạnh', icon: '🏋️', color: '#FF9800' },
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const addExerciseToDay = (exercise: Exercise) => {
    const workoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      sets: exercise.sets,
      reps: exercise.reps,
      restTime: exercise.restTime,
    };

    const updatedWorkouts = workouts.map(workout => {
      if (workout.day === selectedDay) {
        return {
          ...workout,
          exercises: [...workout.exercises, workoutExercise],
          estimatedTime: workout.estimatedTime + (exercise.sets * 2) + (exercise.restTime * exercise.sets / 60),
        };
      }
      return workout;
    });

    setWorkouts(updatedWorkouts);
    setShowExerciseModal(false);
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    const updatedWorkouts = workouts.map((workout, index) => {
      if (index === dayIndex) {
        const newExercises = workout.exercises.filter((_, i) => i !== exerciseIndex);
        return {
          ...workout,
          exercises: newExercises,
          estimatedTime: Math.max(0, workout.estimatedTime - 10), // Rough estimate
        };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const savePlan = () => {
    if (!planName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên lộ trình');
      return;
    }

    if (!planDescription.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả lộ trình');
      return;
    }

    const duration = parseInt(planDuration);
    if (!duration || duration < 1 || duration > 365) {
      Alert.alert('Lỗi', 'Thời gian phải từ 1 đến 365 ngày');
      return;
    }

    const hasExercises = workouts.some(workout => workout.exercises.length > 0);
    if (!hasExercises) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một bài tập vào lộ trình');
      return;
    }

    const newPlan: WorkoutPlan = {
      id: `custom_${Date.now()}`,
      name: planName,
      description: planDescription,
      duration: parseInt(planDuration),
      goal: planGoal,
      difficulty: planDifficulty,
      workouts: workouts,
    };

    // Save to store
    addCustomWorkoutPlan(newPlan);

    Alert.alert(
      'Thành công!',
      'Lộ trình đã được tạo và lưu thành công!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.name || 'Bài tập không xác định';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>✨ Tạo lộ trình mới</Text>
          <Text style={styles.subtitle}>Tạo lộ trình tập luyện cá nhân hóa</Text>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Thông tin cơ bản</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên lộ trình *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Lộ trình tăng cơ 30 ngày"
              value={planName}
              onChangeText={setPlanName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mô tả *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả chi tiết về lộ trình..."
              value={planDescription}
              onChangeText={setPlanDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Thời gian (ngày) *</Text>
            <TextInput
              style={styles.input}
              placeholder="7"
              value={planDuration}
              onChangeText={setPlanDuration}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Goal Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Mục tiêu</Text>
          <View style={styles.goalGrid}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  { backgroundColor: goal.color },
                  planGoal === goal.id && styles.selectedGoal,
                ]}
                onPress={() => setPlanGoal(goal.id as any)}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={styles.goalName}>{goal.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Độ khó</Text>
          <View style={styles.difficultyRow}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyButton,
                  planDifficulty === difficulty && styles.selectedDifficulty,
                ]}
                onPress={() => setPlanDifficulty(difficulty as any)}
              >
                <Text style={[
                  styles.difficultyText,
                  planDifficulty === difficulty && styles.selectedDifficultyText,
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Lịch tập chi tiết</Text>
          {workouts.map((workout, index) => (
            <View key={workout.day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{workout.name}</Text>
                <TouchableOpacity
                  style={styles.addExerciseButton}
                  onPress={() => {
                    setSelectedDay(workout.day);
                    setShowExerciseModal(true);
                  }}
                >
                  <Text style={styles.addExerciseText}>+ Thêm bài tập</Text>
                </TouchableOpacity>
              </View>

              {workout.exercises.length === 0 ? (
                <Text style={styles.emptyDay}>Chưa có bài tập nào</Text>
              ) : (
                workout.exercises.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex} style={styles.exerciseItem}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>
                        {getExerciseName(exercise.exerciseId)}
                      </Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeExerciseFromDay(index, exerciseIndex)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          ))}
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👀 Xem trước</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{planName || 'Tên lộ trình'}</Text>
            <Text style={styles.previewDescription}>
              {planDescription || 'Mô tả lộ trình'}
            </Text>
            <View style={styles.previewStats}>
              <Text style={styles.previewStat}>
                📅 {planDuration} ngày
              </Text>
              <Text style={styles.previewStat}>
                🎯 {goals.find(g => g.id === planGoal)?.name}
              </Text>
              <Text style={styles.previewStat}>
                📊 {planDifficulty}
              </Text>
              <Text style={styles.previewStat}>
                💪 {workouts.filter(w => w.exercises.length > 0).length} buổi tập
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity style={styles.saveButton} onPress={savePlan}>
            <Text style={styles.saveButtonText}>💾 Lưu lộ trình</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Exercise Selection Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn bài tập cho ngày {selectedDay}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowExerciseModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.exerciseList}>
            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseOption}
                onPress={() => addExerciseToDay(exercise)}
              >
                <Text style={styles.exerciseOptionName}>{exercise.name}</Text>
                <Text style={styles.exerciseOptionGroup}>
                  {exercise.muscleGroup.icon} {exercise.muscleGroup.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedGoal: {
    borderWidth: 3,
    borderColor: '#333',
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  goalName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedDifficulty: {
    backgroundColor: '#2196F3',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  dayCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addExerciseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addExerciseText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyDay: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveSection: {
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  exerciseList: {
    flex: 1,
    padding: 16,
  },
  exerciseOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseOptionGroup: {
    fontSize: 14,
    color: '#666',
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  previewStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewStat: {
    fontSize: 12,
    color: '#333',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
});
