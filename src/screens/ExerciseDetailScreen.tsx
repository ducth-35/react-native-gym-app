import React, {useEffect} from 'react';
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
import {useGymStore} from '../store/gymStore';
import {useTimerStore} from '../store/timerStore';
import {APP_SCREEN, RootStackParamList} from '../navigators/screen-type';
import FastImage from 'react-native-fast-image';
import {goBack, navigate} from '../navigators/navigation-services';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const {width} = Dimensions.get('window');

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
    'arm_scissors.gif': require('../assets/images/arm_scissors.gif'),
    'incline_chest_fly_machine.gif': require('../assets/images/incline_chest_fly_machine.gif'),
    'pec_deck_fly.gif': require('../assets/images/pec_deck_fly.gif'),
    'dumbbell_pullover.gif': require('../assets/images/dumbbell_pullover.gif'),
    'dumbbell_bench_press.gif': require('../assets/images/dumbbell_bench_press.gif'),
    'cable_crossover.gif': require('../assets/images/cable_crossover.gif'),
    'onearm_cable_chest_press.gif': require('../assets/images/onearm_cable_chest_press.gif'),
    'singlearm_cable_crossover.gif': require('../assets/images/singlearm_cable_crossover.gif'),
    'incline_dumbbell_fly.gif': require('../assets/images/incline_dumbbell_fly.gif'),
    'rowing_machine.gif': require('../assets/images/rowing_machine.gif'),
    'lever_front_pulldown.gif': require('../assets/images/lever_front_pulldown.gif'),
    'pullup.gif': require('../assets/images/pullup.gif'),
    'cable_rear_pulldown.gif': require('../assets/images/cable_rear_pulldown.gif'),
    'lat_pulldown.gif': require('../assets/images/lat_pulldown.gif'),
    'dumbbell_row.gif': require('../assets/images/dumbbell_row.gif'),
    'bent_over_dumbbell_row.gif': require('../assets/images/bent_over_dumbbell_row.gif'),
    'dumbbell_bent_over_reverse_grip_row.gif': require('../assets/images/dumbbell_bent_over_reverse_grip_row.gif'),
    'reverse_latpulldown.gif': require('../assets/images/reverse_latpulldown.gif'),
    'muscleup.gif': require('../assets/images/muscleup.gif'),
    'seated_zottman_curl.gif': require('../assets/images/seated_zottman_curl.gif'),
    'standing_barbell_concentration_curl.gif': require('../assets/images/standing_barbell_concentration_curl.gif'),
    'waiter_curl.gif': require('../assets/images/waiter_curl.gif'),
    'double_arm_dumbbell_curl.gif': require('../assets/images/double_arm_dumbbell_curl.gif'),
    'dumbbell_curl.gif': require('../assets/images/dumbbell_curl.gif'),
    'seated_incline_dumbbell_curl.gif': require('../assets/images/seated_incline_dumbbell_curl.gif'),
    'lever_preacher_curl.gif': require('../assets/images/lever_preacher_curl.gif'),
    'high_cable_single_arm_bicep_curl.gif': require('../assets/images/high_cable_single_arm_bicep_curl.gif'),
    'one_arm_cable_curl.gif': require('../assets/images/one_arm_cable_curl.gif'),
    'lying_cable_curl.gif': require('../assets/images/lying_cable_curl.gif'),
    'onearm_singleleg_bench_dips.gif': require('../assets/images/onearm_singleleg_bench_dips.gif'),
    'barbell_jm_press.gif': require('../assets/images/barbell_jm_press.gif'),
    'one_arm_triceps_pushdown.gif': require('../assets/images/one_arm_triceps_pushdown.gif'),
    'dumbbell_kickback.gif': require('../assets/images/dumbbell_kickback.gif'),
    'onearm_reverse_pushdown.gif': require('../assets/images/onearm_reverse_pushdown.gif'),
    'lever_triceps_dip.gif': require('../assets/images/lever_triceps_dip.gif'),
    'lying_barbell_triceps_extension.gif': require('../assets/images/lying_barbell_triceps_extension.gif'),
    'cable_tricep_kickback.gif': require('../assets/images/cable_tricep_kickback.gif'),
    'triceps_dips_on_floor.gif': require('../assets/images/triceps_dips_on_floor.gif'),
    'dumbbell_seated_front_and_back_tate_press.gif': require('../assets/images/dumbbell_seated_front_and_back_tate_press.gif'),
    'full_planche.gif': require('../assets/images/full_planche.gif'),
    'side_plank_hip_adduction.gif': require('../assets/images/side_plank_hip_adduction.gif'),
    'medicine_ball_rotational_throw.gif': require('../assets/images/medicine_ball_rotational_throw.gif'),
    'dragon_flag.gif': require('../assets/images/dragon_flag.gif'),
    'alternate_leg_raises.gif': require('../assets/images/alternate_leg_raises.gif'),
    'crunches.gif': require('../assets/images/crunches.gif'),
    'bicycle_crunch.gif': require('../assets/images/bicycle_crunch.gif'),
    'lying_scissor_kick.gif': require('../assets/images/lying_scissor_kick.gif'),
    'bodyweight_plie_squat.gif': require('../assets/images/bodyweight_plie_squat.gif'),
    'smith_machine_squat.gif': require('../assets/images/smith_machine_squat.gif'),
    'dumbbell_cossack_squat.gif': require('../assets/images/dumbbell_cossack_squat.gif'),
    'dumbbell_goblet_squat.gif': require('../assets/images/dumbbell_goblet_squat.gif'),
    'curtsy_lunge.gif': require('../assets/images/curtsy_lunge.gif'),
    'dumbbell_good_morning.gif': require('../assets/images/dumbbell_good_morning.gif'),
    'dumbbell_squat.gif': require('../assets/images/dumbbell_squat.gif'),
    'depth_jump_to_hurdle_hop.gif': require('../assets/images/depth_jump_to_hurdle_hop.gif'),
    'power_lunge.gif': require('../assets/images/power_lunge.gif'),
    'dumbbell_deadlift.gif': require('../assets/images/dumbbell_deadlift.gif'),
    'seated_barbell_shoulder_press.gif': require('../assets/images/seated_barbell_shoulder_press.gif'),
    'dumbbell_push_press.gif': require('../assets/images/dumbbell_push_press.gif'),
    'standing_dumbbell_shoulder_press.gif': require('../assets/images/standing_dumbbell_shoulder_press.gif'),
    'arm_circles.gif': require('../assets/images/arm_circles.gif'),
    'dumbbell_lateral_raise.gif': require('../assets/images/dumbbell_lateral_raise.gif'),
    'dumbbell_shoulder_press.gif': require('../assets/images/dumbbell_shoulder_press.gif'),
    'cable_lateral_raise.gif': require('../assets/images/cable_lateral_raise.gif'),
    '45_degree_incline_row.gif': require('../assets/images/45_degree_incline_row.gif'),
    'lever_shoulder_press.gif': require('../assets/images/lever_shoulder_press.gif'),
    'standing_close_grip_military_press.gif': require('../assets/images/standing_close_grip_military_press.gif'),
    'barbell_military_press_overhead_press.gif': require('../assets/images/barbell_military_press_overhead_press.gif'),
    'dumbbell_chest_supported_lateral_raises.gif': require('../assets/images/dumbbell_chest_supported_lateral_raises.gif'),
    'dumbbell_6_way_raise.gif': require('../assets/images/dumbbell_6_way_raise.gif'),
    'dumbbell_4_way_lateral_raise.gif': require('../assets/images/dumbbell_4_way_lateral_raise.gif'),
    'two_arm_dumbbell_front_raise.gif': require('../assets/images/two_arm_dumbbell_front_raise.gif'),
    'dumbbell_front_raise.gif': require('../assets/images/dumbbell_front_raise.gif'),
    'leaning_single_arm_dumbbell_lateral_raise.gif': require('../assets/images/leaning_single_arm_dumbbell_lateral_raise.gif'),
    'seated_behind_neck_press.gif': require('../assets/images/seated_behind_neck_press.gif'),
    'rear_delt_fly_machine.gif': require('../assets/images/rear_delt_fly_machine.gif'),
    'seated_rear_lateral_dumbbell_raise.gif': require('../assets/images/seated_rear_lateral_dumbbell_raise.gif'),
    'half_arnold_press.gif': require('../assets/images/half_arnold_press.gif'),
};

type ExerciseDetailProps = NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.EXERCISE_DETAIL
>;

export const ExerciseDetailScreen: React.FC<ExerciseDetailProps> = ({
  route,
}) => {
  const {exerciseId} = route?.params || {};

  const {exercises, favoriteExercises, toggleFavorite, initializeData} =
    useGymStore();
  const {startRestTimer} = useTimerStore();

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
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartRestTimer = () => {
    startRestTimer(exercise.restTime);
    navigate(APP_SCREEN.TIMER);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={{ width: '100%', height: 35, backgroundColor: '#fff', position: 'absolute', zIndex: 1 }} />
          <FastImage source={imageMap[exercise.image]} style={styles.image} resizeMode='contain' />
        </View>

        <View style={styles.content}>
          {/* Title and Muscle Group */}
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <View style={styles.muscleGroupContainer}>
              {/* <Text style={styles.muscleGroupIcon}>
                {exercise.muscleGroup.icon}
              </Text> */}
              <Text style={styles.muscleGroupName}>
                {exercise.muscleGroup.name}
              </Text>
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
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      exercise.difficulty === 'Beginner'
                        ? '#4CAF50'
                        : exercise.difficulty === 'Intermediate'
                        ? '#FF9800'
                        : '#F44336',
                  },
                ]}>
                {exercise.difficulty}
              </Text>
              <Text style={styles.statLabel}>Độ khó</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả bài tập</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hướng dẫn tập</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Breathing Technique */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kỹ thuật thở</Text>
            <Text style={styles.breathingText}>
              {exercise.breathingTechnique}
            </Text>
          </View>

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mẹo hay</Text>
            {exercise.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Common Mistakes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lỗi thường gặp</Text>
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
              <Text style={styles.sectionTitle}>Dụng cụ cần thiết</Text>
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
              onPress={handleStartRestTimer}>
              <Text style={styles.timerButtonText}>
                Bắt đầu hẹn giờ nghỉ
              </Text>
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
    height: 250,
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
    shadowOffset: {width: 0, height: 2},
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
