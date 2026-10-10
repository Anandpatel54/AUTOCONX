import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface BellIconProps {
  color?: string;
  hasUnread?: boolean;
}

export const BellIcon: React.FC<BellIconProps> = ({
  color = '#0F172A',
  hasUnread = true,
}) => {
  return (
    <View style={styles.wrapper}>
      <Icon name="notifications-outline" size={20} color={color} />
      {hasUnread && (
        <View style={styles.badgeContainer}>
          <View style={styles.badgeDot} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 1,
    right: 2,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
});
