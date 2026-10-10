import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme';
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
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Submission Failed</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      {onRetry && (
        <View style={styles.actionRow}>
          <Button
            title="Try Again"
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
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconText: {
    color: colors.textInverse,
    fontWeight: '800',
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  actionRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
  },
});
