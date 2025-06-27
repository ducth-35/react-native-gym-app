import { create } from 'zustand';
import { TimerState } from '../types/gym.types';
import { Alert, Vibration } from 'react-native';

interface TimerStore extends TimerState {
  // Actions
  startTimer: (duration: number, type?: 'rest' | 'exercise' | 'custom') => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  
  // Presets
  startRestTimer: (seconds: number) => void;
  startExerciseTimer: (seconds: number) => void;
}

let timerInterval: NodeJS.Timeout | null = null;

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  isRunning: false,
  timeLeft: 0,
  totalTime: 0,
  type: 'custom',
  
  // Start timer with duration
  startTimer: (duration: number, type = 'custom') => {
    const { stopTimer } = get();
    
    // Stop any existing timer
    stopTimer();
    
    set({
      timeLeft: duration,
      totalTime: duration,
      type,
      isRunning: true,
    });
    
    // Start interval
    timerInterval = setInterval(() => {
      get().tick();
    }, 1000);
  },
  
  // Pause timer
  pauseTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ isRunning: false });
  },
  
  // Resume timer
  resumeTimer: () => {
    const { timeLeft } = get();
    if (timeLeft > 0) {
      set({ isRunning: true });
      timerInterval = setInterval(() => {
        get().tick();
      }, 1000);
    }
  },
  
  // Stop timer
  stopTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({
      isRunning: false,
      timeLeft: 0,
      totalTime: 0,
      type: 'custom',
    });
  },
  
  // Tick function
  tick: () => {
    const { timeLeft, stopTimer, type } = get();

    // Warning at 3 seconds
    if (timeLeft === 4) {
      Vibration.vibrate(200);
    }

    if (timeLeft <= 1) {
      // Timer finished - vibrate and show alert
      Vibration.vibrate([500, 200, 500]);

      const message = type === 'rest' ? 'Hết thời gian nghỉ!' :
                     type === 'exercise' ? 'Hết thời gian tập!' : 'Hết giờ!';

      Alert.alert('⏰ Thông báo', message, [
        { text: 'OK', style: 'default' }
      ]);

      stopTimer();
      return;
    }

    set({ timeLeft: timeLeft - 1 });
  },
  
  // Preset timers
  startRestTimer: (seconds: number) => {
    get().startTimer(seconds, 'rest');
  },
  
  startExerciseTimer: (seconds: number) => {
    get().startTimer(seconds, 'exercise');
  },
}));
