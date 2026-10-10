import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing } from '../../theme';

interface BottomTabBarProps {
  activeTab?: 'vehicle' | 'bookings' | 'reports' | 'profile';
  onTabPress?: (tab: 'vehicle' | 'bookings' | 'reports' | 'profile') => void;
  onBookPress?: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = 'vehicle',
  onTabPress,
  onBookPress,
}) => {
  const insets = useSafeAreaInsets();

  const handlePress = (tab: 'vehicle' | 'bookings' | 'reports' | 'profile') => {
    if (tab === 'bookings' && onBookPress) {
      onBookPress();
      return;
    }
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {/* Tab 1: My Vehicle (Active) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress('vehicle')}
        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.iconText, activeTab === 'vehicle' && styles.iconActive]}>
            🚗
          </Text>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'vehicle' && styles.tabLabelActive]}>
          My Vehicle
        </Text>
        {activeTab === 'vehicle' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Tab 2: Book Inspection (Primary Quick Action) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress('bookings')}
        style={styles.tabItem}
      >
        <View style={[styles.iconContainer, styles.bookIconContainer]}>
          <Text style={styles.bookIconText}>📅</Text>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'bookings' && styles.tabLabelActive]}>
          Book Now
        </Text>
      </TouchableOpacity>

      {/* Tab 3: Reports */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress('reports')}
        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.iconText, activeTab === 'reports' && styles.iconActive]}>
            📑
          </Text>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'reports' && styles.tabLabelActive]}>
          Reports
        </Text>
      </TouchableOpacity>

      {/* Tab 4: Profile / Garage Hub */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress('profile')}
        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.iconText, activeTab === 'profile' && styles.iconActive]}>
            ⚙️
          </Text>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
          Garage
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.sm,
    ...shadows.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    position: 'relative',
  },
  iconContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bookIconContainer: {
    width: 32,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    opacity: 0.65,
  },
  iconActive: {
    opacity: 1,
  },
  bookIconText: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
});
