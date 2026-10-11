import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
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

// ========================================================
// CUSTOM FLOATING GLASSMORPHIC TAB BAR WITH ACTIVE CAPSULE
// ========================================================
function CustomFloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.ReactElement {
  return (
    <View style={styles.floatingBarWrapper} pointerEvents="box-none">
      <View style={styles.floatingBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName = 'car-sport-outline';
          if (route.name === 'VehicleTab') {
            iconName = isFocused ? 'car-sport' : 'car-sport-outline';
          } else if (route.name === 'ReportsTab') {
            iconName = isFocused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'GarageTab') {
            iconName = isFocused ? 'construct' : 'construct-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={typeof label === 'string' ? label : route.name}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View
                style={[
                  styles.topIndicator,
                  isFocused ? styles.topIndicatorActive : null,
                ]}
              />
              <View
                style={[
                  styles.iconWrap,
                  isFocused ? styles.iconWrapActive : null,
                ]}
              >
                <Icon
                  name={iconName}
                  size={21}
                  color={isFocused ? colors.accent : '#64748B'}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : null,
                ]}
                numberOfLines={1}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="VehicleTab"
      tabBar={CustomFloatingTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="VehicleTab"
        component={MyVehicleScreen}
        options={{
          tabBarLabel: 'My Vehicle',
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
        }}
      />
      <Tab.Screen
        name="GarageTab"
        component={GarageScreen}
        options={{
          tabBarLabel: 'Garage',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  floatingBarWrapper: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 22,
      android: 14,
    }),
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1.2,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#091E36',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  topIndicator: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  topIndicatorActive: {
    backgroundColor: colors.accent,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: '#EFF6FF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
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
