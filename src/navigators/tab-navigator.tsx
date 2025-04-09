import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {APP_SCREEN, RootStackParamList} from './screen-type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../screens/Home';
import {DiscoverScreen} from '../screens/Discover';
import {BookMarkScreen} from '../screens/BookMark';
import {SearchScreen} from '../screens/Search';

const TABS = [
  {
    name: APP_SCREEN.HOME,
    component: HomeScreen,
    label: 'Home',
    icon: 'home',
  },
  {
    name: APP_SCREEN.DISCOVER,
    component: DiscoverScreen,
    label: 'Movies',
    icon: 'videocam',
  },
  {
    name: APP_SCREEN.BOOKMARK,
    component: BookMarkScreen,
    label: 'TVShows',
    icon: 'tv',
  },
  {
    name: APP_SCREEN.SEARCH,
    component: SearchScreen,
    label: 'Favorites',
    icon: 'heart',
  },
];

const Tab = createBottomTabNavigator<RootStackParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
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
