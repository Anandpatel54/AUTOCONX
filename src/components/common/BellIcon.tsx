import React from 'react';
import { StyleSheet, View } from 'react-native';

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
      {/* Top hanging knob */}
      <View style={[styles.knob, { backgroundColor: color }]} />

      {/* Bell main body */}
      <View style={[styles.bellDome, { backgroundColor: color }]} />

      {/* Flared bottom rim */}
      <View style={[styles.bellRim, { backgroundColor: color }]} />

      {/* Center clapper */}
      <View style={[styles.clapper, { backgroundColor: color }]} />

      {/* High-visibility Notification Alert Badge */}
      {hasUnread && (
        <View style={styles.badgeContainer}>
          <View style={styles.badgePulse} />
          <View style={styles.badgeDot} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  knob: {
    width: 3.5,
    height: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginBottom: -0.5,
  },
  bellDome: {
    width: 13,
    height: 11,
    borderTopLeftRadius: 6.5,
    borderTopRightRadius: 6.5,
    borderBottomLeftRadius: 1.5,
    borderBottomRightRadius: 1.5,
  },
  bellRim: {
    width: 16,
    height: 2,
    borderRadius: 1,
    marginTop: -0.5,
  },
  clapper: {
    width: 4,
    height: 2.5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: 0.5,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePulse: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
  },
  badgeDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.25,
    backgroundColor: '#EF4444', // Crimson notification dot
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
