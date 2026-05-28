import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../hooks/useAuth';
import {useNotifications} from '../hooks/useNotifications';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../constants/theme';

import {HomeStack} from './HomeStack';
import {AppointmentStack} from './AppointmentStack';
import {DoctorStack} from './DoctorStack';
import {RecordStack} from './RecordStack';
import {ProfileStack} from './ProfileStack';

import {LoginScreen} from '../screens/auth/LoginScreen';
import {RegisterScreen} from '../screens/auth/RegisterScreen';
import {OTPVerifyScreen} from '../screens/auth/OTPVerifyScreen';
import {ForgotPasswordScreen} from '../screens/auth/ForgotPasswordScreen';
import {ResetPasswordScreen} from '../screens/auth/ResetPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerify: {verificationId: string};
  ForgotPassword: undefined;
  ResetPassword: {verificationId: string};
};

export type MainTabParamList = {
  HomeTab: undefined;
  AppointmentsTab: undefined;
  DoctorsTab: undefined;
  RecordsTab: undefined;
  ProfileTab: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {backgroundColor: Colors.background},
      animation: 'slide_from_right',
    }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="OTPVerify" component={OTPVerifyScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
);

const MainTabs: React.FC = () => {
  const {unreadCount} = useNotifications();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentStack}
        options={{
          tabBarLabel: 'Appointments',
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar-outline" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen
        name="DoctorsTab"
        component={DoctorStack}
        options={{
          tabBarLabel: 'Doctors',
          tabBarIcon: ({color, size}) => (
            <Icon name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RecordsTab"
        component={RecordStack}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({color, size}) => (
            <Icon name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <MainTabs /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    height: 60,
    ...Shadows.lg,
  },
  tabBarLabel: {
    ...Typography.caption,
    fontWeight: '500',
    marginTop: -2,
  },
  tabBarItem: {
    paddingVertical: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.error,
    fontSize: 10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    lineHeight: 16,
    ...Typography.caption,
    fontWeight: '700',
  },
});
