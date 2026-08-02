import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { colors } from '../theme/theme';
import {
  ExploreStackParamList,
  HomeStackParamList,
  ProgressStackParamList,
  RootTabParamList,
  SavedStackParamList,
} from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();
const ProgressStackNav = createNativeStackNavigator<ProgressStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const stackScreenOptions = {
  headerShown: false,
} as const;

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={stackScreenOptions}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Explore" component={ExploreScreen} />
    <HomeStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
  </HomeStack.Navigator>
);

const ExploreStackNavigator = () => (
  <ExploreStack.Navigator screenOptions={stackScreenOptions}>
    <ExploreStack.Screen name="Explore" component={ExploreScreen} />
    <ExploreStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
  </ExploreStack.Navigator>
);

const SavedStackNavigator = () => (
  <SavedStack.Navigator screenOptions={stackScreenOptions}>
    <SavedStack.Screen name="Saved" component={SavedScreen} />
    <SavedStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
  </SavedStack.Navigator>
);

const ProgressStackNavigator = () => (
  <ProgressStackNav.Navigator screenOptions={stackScreenOptions}>
    <ProgressStackNav.Screen name="Progress" component={ProgressScreen} />
    <ProgressStackNav.Screen name="ProjectDetail" component={ProjectDetailScreen} />
  </ProgressStackNav.Navigator>
);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    border: colors.border,
    text: colors.textPrimary,
  },
};

const tabIcons: Record<keyof RootTabParamList, { active: string; inactive: string }> = {
  HomeTab: { active: 'home', inactive: 'home-outline' },
  ExploreTab: { active: 'compass', inactive: 'compass-outline' },
  SavedTab: { active: 'bookmark', inactive: 'bookmark-outline' },
  ProgressTab: { active: 'ribbon', inactive: 'ribbon-outline' },
};

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 60,
            paddingTop: 6,
            paddingBottom: 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ color, size, focused }) => {
            const icons = tabIcons[route.name as keyof RootTabParamList];
            return (
              <Ionicons name={(focused ? icons.active : icons.inactive) as any} size={size - 2} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
        <Tab.Screen name="ExploreTab" component={ExploreStackNavigator} options={{ title: 'Explore' }} />
        <Tab.Screen name="SavedTab" component={SavedStackNavigator} options={{ title: 'Saved' }} />
        <Tab.Screen name="ProgressTab" component={ProgressStackNavigator} options={{ title: 'Progress' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
