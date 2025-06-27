import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {APP_SCREEN, TabParamList} from './screen-type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../screens/HomeScreen';
import {ExerciseListScreen} from '../screens/ExerciseListScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {FavoritesScreen} from '../screens/FavoritesScreen';
import {TimerScreen} from '../screens/TimerScreen';
import {WorkoutPlansScreen} from '../screens/WorkoutPlansScreen';
import {CalendarScreen} from '../screens/CalendarScreen';
import {ProgressScreen} from '../screens/ProgressScreen';

const TABS = [
  {
    name: APP_SCREEN.HOME,
    component: HomeScreen,
    label: 'Trang chủ',
    icon: 'home',
  },
  {
    name: APP_SCREEN.EXERCISE_LIST,
    component: ExerciseListScreen,
    label: 'Bài tập',
    icon: 'fitness',
  },
  {
    name: APP_SCREEN.SEARCH,
    component: SearchScreen,
    label: 'Tìm kiếm',
    icon: 'search',
  },
  {
    name: APP_SCREEN.FAVORITES,
    component: FavoritesScreen,
    label: 'Yêu thích',
    icon: 'heart',
  },
  {
    name: APP_SCREEN.TIMER,
    component: TimerScreen,
    label: 'Hẹn giờ',
    icon: 'timer',
  },
];

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      {TABS.map(({name, component, label, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({focused, size, color}) => (
              <Ionicons
                name={focused ? icon : `${icon}-outline`}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
