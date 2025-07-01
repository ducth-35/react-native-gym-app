import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {TimerComponent} from '../components/TimerComponent';
import {useTimerStore} from '../store/timerStore';

export const TimerScreen: React.FC = () => {
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const {startTimer, startRestTimer, startExerciseTimer} = useTimerStore();

  const handleCustomTimer = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập thời gian hợp lệ');
      return;
    }

    if (totalSeconds > 3600) {
      // Max 1 hour
      Alert.alert('Lỗi', 'Thời gian tối đa là 60 phút');
      return;
    }

    startTimer(totalSeconds, 'custom');
    setCustomMinutes('');
    setCustomSeconds('');
  };

  const presetTimers = [
    {label: '30 giây nghỉ', seconds: 30, type: 'rest' as const},
    {label: '1 phút nghỉ', seconds: 60, type: 'rest' as const},
    {label: '1.5 phút nghỉ', seconds: 90, type: 'rest' as const},
    {label: '2 phút nghỉ', seconds: 120, type: 'rest' as const},
    {label: '3 phút nghỉ', seconds: 180, type: 'rest' as const},
    {label: '30 giây tập', seconds: 30, type: 'exercise' as const},
    {label: '45 giây tập', seconds: 45, type: 'exercise' as const},
    {label: '1 phút tập', seconds: 60, type: 'exercise' as const},
  ];

  const handlePresetTimer = (seconds: number, type: 'rest' | 'exercise') => {
    if (type === 'rest') {
      startRestTimer(seconds);
    } else {
      startExerciseTimer(seconds);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>⏱️ Hẹn giờ tập luyện</Text>
          <Text style={styles.subtitle}>
            Quản lý thời gian nghỉ và tập luyện
          </Text>
        </View>

        {/* Timer Component */}
        <TimerComponent />

        {/* Custom Timer */}
        <View style={styles.customTimerSection}>
          <Text style={styles.sectionTitle}>Hẹn giờ tùy chỉnh</Text>
          <View style={styles.customTimerContainer}>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                placeholder="0"
                value={customMinutes}
                onChangeText={setCustomMinutes}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                placeholder="0"
                value={customSeconds}
                onChangeText={setCustomSeconds}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <TouchableOpacity
              style={styles.startCustomButton}
              onPress={handleCustomTimer}>
              <Text style={styles.startCustomButtonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preset Timers */}
        <View style={styles.presetSection}>
          <Text style={styles.sectionTitle}>Hẹn giờ nhanh</Text>
          <View style={styles.presetGrid}>
            {presetTimers.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  {
                    backgroundColor:
                      preset.type === 'rest' ? '#4CAF50' : '#FF6B6B',
                  },
                ]}
                onPress={() => handlePresetTimer(preset.seconds, preset.type)}>
                <Text style={styles.presetButtonText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Mẹo sử dụng</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Nghỉ 30-60 giây cho bài tập nhẹ</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Nghỉ 60-90 giây cho bài tập trung bình
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Nghỉ 2-3 phút cho bài tập nặng</Text>
          </View>
        </View>
      </ScrollView>
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
  customTimerSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  customTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInputContainer: {
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    width: 60,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  startCustomButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  startCustomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  presetSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  presetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tipsSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
});
