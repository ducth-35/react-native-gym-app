import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTimerStore } from '../store/timerStore';

interface TimerComponentProps {
  onTimerComplete?: () => void;
}

export const TimerComponent: React.FC<TimerComponentProps> = ({
  onTimerComplete,
}) => {
  const {
    isRunning,
    timeLeft,
    totalTime,
    type,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    startRestTimer,
  } = useTimerStore();

  useEffect(() => {
    if (timeLeft === 0 && totalTime > 0) {
      Alert.alert(
        'Hết giờ!',
        type === 'rest' ? 'Thời gian nghỉ đã hết!' : 'Hết thời gian!',
        [{ text: 'OK', onPress: onTimerComplete }]
      );
    }
  }, [timeLeft, totalTime, type, onTimerComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const handlePlayPause = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      if (timeLeft > 0) {
        resumeTimer();
      }
    }
  };

  const quickStartRest = (seconds: number) => {
    startRestTimer(seconds);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.typeText}>
          {type === 'rest' ? '🛌 Nghỉ ngơi' : 
           type === 'exercise' ? '💪 Tập luyện' : '⏱️ Hẹn giờ'}
        </Text>
      </View>

      {totalTime > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${getProgress()}%`,
                  backgroundColor: type === 'rest' ? '#4CAF50' : '#FF6B6B'
                }
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.playPauseButton]}
          onPress={handlePlayPause}
          disabled={timeLeft === 0}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopTimer}
        >
          <Text style={styles.buttonText}>Dừng</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickButtons}>
        <Text style={styles.quickTitle}>Nghỉ nhanh:</Text>
        <View style={styles.quickButtonsRow}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => quickStartRest(30)}
          >
            <Text style={styles.quickButtonText}>30s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => quickStartRest(60)}
          >
            <Text style={styles.quickButtonText}>1m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => quickStartRest(90)}
          >
            <Text style={styles.quickButtonText}>1.5m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => quickStartRest(120)}
          >
            <Text style={styles.quickButtonText}>2m</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace',
  },
  typeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickButtons: {
    alignItems: 'center',
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  quickButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
