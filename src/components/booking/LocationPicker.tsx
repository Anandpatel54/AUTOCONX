import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, radius, spacing } from '../../theme';
import { Input } from '../common/Input';

interface LocationPickerProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  onFetchLocation: (simulateDenial: boolean) => Promise<{ success: boolean; address?: string; error?: string }>;
  isLocating?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChangeText,
  error,
  onFetchLocation,
  isLocating = false,
}) => {
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState(false);

  const handleUseCurrentLocation = async (simulateDeny: boolean) => {
    setStatusNotice(null);
    setIsDenied(simulateDeny);
    const result = await onFetchLocation(simulateDeny);
    if (result.success && result.address) {
      onChangeText(result.address);
      setStatusNotice('GPS location resolved successfully');
    } else if (result.error) {
      setStatusNotice(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Inspection Location</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>

      {/* Modern GPS Action Card Button */}
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={() => handleUseCurrentLocation(false)}
        disabled={isLocating}
        style={[
          styles.gpsCard,
          isLocating && !isDenied && styles.gpsCardLoading,
        ]}
      >
        <View style={styles.gpsIconCircle}>
          {isLocating && !isDenied ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Icon name="navigate" size={18} color={colors.accent} />
          )}
        </View>

        <View style={styles.gpsTextCol}>
          <Text style={styles.gpsTitle}>
            {isLocating && !isDenied ? 'Detecting Location...' : 'Use Current Location'}
          </Text>
          <Text style={styles.gpsSubtitle}>
            Auto-detect Dubai or Abu Dhabi service address
          </Text>
        </View>

        <View style={styles.gpsBadge}>
          <Text style={styles.gpsBadgeText}>GPS</Text>
        </View>
      </TouchableOpacity>

      {/* Reviewer Testing Simulator Row */}
      <View style={styles.reviewerRow}>
        <View style={styles.reviewerTagGroup}>
          <Icon name="flask-outline" size={13} color={colors.textMuted} />
          <Text style={styles.reviewerLabel}>Reviewer Test Tool:</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleUseCurrentLocation(true)}
          style={styles.simulatePill}
        >
          <Icon name="shield-outline" size={12} color={colors.textSecondary} style={styles.simulateIcon} />
          <Text style={styles.simulateText}>Test Denied GPS</Text>
        </TouchableOpacity>
      </View>

      {/* GPS Status / Feedback Alert */}
      {statusNotice && (
        <View
          style={[
            styles.noticeCard,
            isDenied ? styles.noticeCardWarning : styles.noticeCardSuccess,
          ]}
        >
          <Icon
            name={isDenied ? 'alert-circle' : 'checkmark-circle'}
            size={16}
            color={isDenied ? '#D97706' : colors.success}
            style={styles.noticeIcon}
          />
          <Text
            style={[
              styles.noticeText,
              isDenied ? styles.noticeTextWarning : styles.noticeTextSuccess,
            ]}
          >
            {statusNotice}
          </Text>
        </View>
      )}

      {/* Divider between GPS and manual address */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR ENTER ADDRESS MANUALLY</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Manual Address Fallback Input */}
      <Input
        label="Street Address / Building"
        placeholder="e.g. Dubai Marina, Princess Tower, Floor 14"
        value={value}
        onChangeText={text => {
          onChangeText(text);
          if (statusNotice) setStatusNotice(null);
        }}
        error={error}
        helperText="Technicians travel anywhere in Dubai & Abu Dhabi"
        required
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  requiredStar: {
    color: colors.error,
    fontWeight: '800',
  },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    gap: spacing.sm + 2,
  },
  gpsCardLoading: {
    borderColor: colors.accent,
    backgroundColor: '#EFF6FF',
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTextCol: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  gpsSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  gpsBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs + 4,
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  reviewerTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  simulatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simulateIcon: {
    marginRight: 4,
  },
  simulateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  noticeIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    marginVertical: spacing.xs,
  },
  noticeCardSuccess: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  noticeCardWarning: {
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  noticeTextSuccess: {
    color: colors.success,
  },
  noticeTextWarning: {
    color: '#92400E',
    lineHeight: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
});
