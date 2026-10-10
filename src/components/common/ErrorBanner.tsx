import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { radius, spacing, shadows } from '../../theme';
import { Button } from './Button';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  style?: ViewStyle;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  isRetrying = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✕</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Submission Error</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      {onRetry && (
        <View style={styles.actionRow}>
          <Button
            title="Retry Booking"
            onPress={onRetry}
            loading={isRetrying}
            variant="danger"
            size="sm"
            style={styles.retryButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: radius.md,
    padding: spacing.md + 2,
    marginBottom: spacing.lg,
    ...shadows.subtle,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    fontWeight: '500',
  },
  actionRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
  },
});
