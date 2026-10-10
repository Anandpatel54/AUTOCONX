import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

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
      setStatusNotice('GPS location resolved');
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

      {/* Modern GPS Action Bar */}
      <View style={styles.gpsBar}>
        <Button
          title={isLocating ? 'Locating...' : 'Use Current Location'}
          variant="outline"
          size="sm"
          loading={isLocating && !isDenied}
          onPress={() => handleUseCurrentLocation(false)}
          style={styles.gpsButton}
        />

        {/* Discreet Reviewer Testing Simulator */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleUseCurrentLocation(true)}
          style={styles.simulatePill}
        >
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
          <Text
            style={[
              styles.noticeText,
              isDenied ? styles.noticeTextWarning : styles.noticeTextSuccess,
            ]}
          >
            {isDenied ? `⚠️ ${statusNotice}` : `📍 ${statusNotice}`}
          </Text>
        </View>
      )}

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
  gpsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  gpsButton: {
    flex: 1,
    borderColor: colors.borderDark,
    borderRadius: radius.md,
  },
  simulatePill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simulateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  noticeCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
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
});
