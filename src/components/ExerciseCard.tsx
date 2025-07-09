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
    // Ảnh cũ
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
  };


  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <Pressable onPress={handlePress}>
        <View style={styles.imageContainer}>
             <View style={{ width: '100%', height: 35, backgroundColor: '#fff', position: 'absolute', zIndex: 1 }} />
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
