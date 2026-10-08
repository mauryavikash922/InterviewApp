import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, type BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/theme';
import { strings } from '../locales/en';
import { BookingsStack } from './BookingsStack';
import { SearchStack } from './SearchStack';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const SEARCH_ICON = 'search';
const BOOKINGS_ICON = 'ticket-outline';

type TabIconProps = { color: string; size: number };

const renderSearchIcon = ({ color, size }: TabIconProps) => (
  <Ionicons name={SEARCH_ICON} color={color} size={size} />
);

const renderBookingsIcon = ({ color, size }: TabIconProps) => (
  <Ionicons name={BOOKINGS_ICON} color={color} size={size} />
);

const SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.tabActive,
  tabBarInactiveTintColor: colors.tabInactive,
};

const SEARCH_TAB_OPTIONS: BottomTabNavigationOptions = {
  title: strings('tabs.search'),
  tabBarIcon: renderSearchIcon,
};

const BOOKINGS_TAB_OPTIONS: BottomTabNavigationOptions = {
  title: strings('tabs.myBookings'),
  tabBarIcon: renderBookingsIcon,
};

export function RootTabs() {
  return (
    <Tab.Navigator initialRouteName="SearchTab" screenOptions={SCREEN_OPTIONS}>
      <Tab.Screen name="SearchTab" component={SearchStack} options={SEARCH_TAB_OPTIONS} />
      <Tab.Screen name="BookingsTab" component={BookingsStack} options={BOOKINGS_TAB_OPTIONS} />
    </Tab.Navigator>
  );
}
