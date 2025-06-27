import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {APP_SCREEN, RootStackParamList} from './screen-type';
import {TabNavigator} from './tab-navigator';
import {ExerciseDetailScreen} from '../screens/ExerciseDetailScreen';
import {WorkoutPlansScreen} from '../screens/WorkoutPlansScreen';
import {WorkoutPlanDetailScreen} from '../screens/WorkoutPlanDetailScreen';
import {CreateWorkoutPlanScreen} from '../screens/CreateWorkoutPlanScreen';
import {CalendarScreen} from '../screens/CalendarScreen';
import {ProgressScreen} from '../screens/ProgressScreen';

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigations: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={APP_SCREEN.TAB_SCREEN}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={APP_SCREEN.TAB_SCREEN} component={TabNavigator} />
        <Stack.Screen
          name={APP_SCREEN.EXERCISE_DETAIL}
          component={ExerciseDetailScreen}
          options={{
            headerShown: true,
            title: 'Chi tiết bài tập',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name={APP_SCREEN.WORKOUT_PLANS}
          component={WorkoutPlansScreen}
          options={{
            headerShown: true,
            title: 'Lộ trình tập luyện',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name={APP_SCREEN.WORKOUT_PLAN_DETAIL}
          component={WorkoutPlanDetailScreen}
          options={{
            headerShown: true,
            title: 'Chi tiết lộ trình',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name={APP_SCREEN.CREATE_WORKOUT_PLAN}
          component={CreateWorkoutPlanScreen}
          options={{
            headerShown: true,
            title: 'Tạo lộ trình mới',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name={APP_SCREEN.CALENDAR}
          component={CalendarScreen}
          options={{
            headerShown: true,
            title: 'Lịch tập luyện',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name={APP_SCREEN.PROGRESS}
          component={ProgressScreen}
          options={{
            headerShown: true,
            title: 'Tiến trình',
            headerBackTitle: 'Quay lại',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
