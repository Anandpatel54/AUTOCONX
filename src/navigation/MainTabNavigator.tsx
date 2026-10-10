import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { MyVehicleScreen } from '../screens/MyVehicleScreen';
import { colors, radius, spacing } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Clean Placeholder for Reports Tab
const ReportsScreen = () => {
  return (
    <View style={styles.placeholderContainer}>
      <View style={styles.placeholderBadge}>
        <Text style={styles.badgeEmoji}>📑</Text>
      </View>
      <Text style={styles.placeholderTitle}>Inspection Reports</Text>
      <Text style={styles.placeholderSubtitle}>
        Digital 150-point diagnostic reports will be uploaded here following your certified mobile inspection.
      </Text>
    </View>
  );
};

// Clean Placeholder for Garage Fleet Tab
const GarageScreen = () => {
  return (
    <View style={styles.placeholderContainer}>
      <View style={styles.placeholderBadge}>
        <Text style={styles.badgeEmoji}>⚙️</Text>
      </View>
      <Text style={styles.placeholderTitle}>AutoConX Garage Hub</Text>
      <Text style={styles.placeholderSubtitle}>
        Manage registered UAE vehicles, service dispatch intervals, and emergency roadside assistance.
      </Text>
    </View>
  );
};

const renderVehicleIcon = ({ focused }: { focused: boolean }) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🚗</Text>
);

const renderReportsIcon = ({ focused }: { focused: boolean }) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📑</Text>
);

const renderGarageIcon = ({ focused }: { focused: boolean }) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>⚙️</Text>
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
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
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
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
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
  badgeEmoji: {
    fontSize: 30,
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
