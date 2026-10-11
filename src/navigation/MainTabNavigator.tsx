import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabParamList } from './types';
import { MyVehicleScreen } from '../screens/MyVehicleScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { colors, radius, spacing } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Clean Placeholder for Garage Fleet Tab
const GarageScreen = () => {
  return (
    <View style={styles.placeholderContainer}>
      <View style={styles.placeholderBadge}>
        <Icon name="car-sport-outline" size={32} color={colors.primary} />
      </View>
      <Text style={styles.placeholderTitle}>AutoConX Garage Hub</Text>
      <Text style={styles.placeholderSubtitle}>
        Manage registered UAE vehicles, service dispatch intervals, and emergency roadside assistance.
      </Text>
    </View>
  );
};

const renderVehicleIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Icon
    name={focused ? 'car-sport' : 'car-sport-outline'}
    size={22}
    color={color}
  />
);

const renderReportsIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Icon
    name={focused ? 'document-text' : 'document-text-outline'}
    size={22}
    color={color}
  />
);

const renderGarageIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Icon
    name={focused ? 'construct' : 'construct-outline'}
    size={22}
    color={color}
  />
);

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="VehicleTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.select({
            ios: 22,
            android: 14,
          }),
          left: 16,
          right: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderRadius: 24,
          height: 64,
          borderWidth: 1,
          borderColor: 'rgba(226, 232, 240, 0.9)',
          paddingTop: 8,
          paddingBottom: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      }}
    >
      <Tab.Screen
        name="VehicleTab"
        component={MyVehicleScreen}
        options={{
          tabBarLabel: 'My Vehicle',
          tabBarIcon: renderVehicleIcon,
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: renderReportsIcon,
        }}
      />
      <Tab.Screen
        name="GarageTab"
        component={GarageScreen}
        options={{
          tabBarLabel: 'Garage',
          tabBarIcon: renderGarageIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  placeholderBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
  },
});
