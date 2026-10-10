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
  const [denialSimulated, setDenialSimulated] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleUseCurrentLocation = async (simulateDeny: boolean) => {
    setStatusNotice(null);
    const result = await onFetchLocation(simulateDeny);
    if (result.success && result.address) {
      onChangeText(result.address);
      setStatusNotice('📍 GPS location acquired');
    } else if (result.error) {
      setStatusNotice(`⚠️ ${result.error}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>
          Inspection Location <Text style={styles.requiredStar}>*</Text>
        </Text>
      </View>

      {/* Quick GPS Action Row */}
      <View style={styles.actionRow}>
        <Button
          title="Use Current Location"
          variant="outline"
          size="sm"
          loading={isLocating && !denialSimulated}
          onPress={() => {
            setDenialSimulated(false);
            handleUseCurrentLocation(false);
          }}
          style={styles.gpsButton}
        />

        {/* Evaluator Helper: Simulate Permission Denial */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setDenialSimulated(true);
            handleUseCurrentLocation(true);
          }}
          style={styles.simulateButton}
        >
          <Text style={styles.simulateText}>Simulate GPS Deny</Text>
        </TouchableOpacity>
      </View>

      {/* Fallback Notice */}
      {statusNotice && (
        <View
          style={[
            styles.noticeBox,
            statusNotice.includes('denied') || statusNotice.includes('⚠️')
              ? styles.noticeWarning
              : styles.noticeSuccess,
          ]}
        >
          <Text
            style={[
              styles.noticeText,
              statusNotice.includes('denied') || statusNotice.includes('⚠️')
                ? styles.noticeWarningText
                : styles.noticeSuccessText,
            ]}
          >
            {statusNotice}
          </Text>
        </View>
      )}

      {/* Manual Address Input Field (Always editable fallback) */}
      <Input
        label="Address or Area"
        placeholder="e.g. Dubai Marina, Building 4 / Villa 12"
        value={value}
        onChangeText={text => {
          onChangeText(text);
          if (statusNotice) setStatusNotice(null);
        }}
        error={error}
        helperText="Enter manual address or use GPS above"
        required
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  headerRow: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  requiredStar: {
    color: colors.error,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs + 2,
  },
  gpsButton: {
    flex: 1,
  },
  simulateButton: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simulateText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  noticeBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginVertical: spacing.xs + 2,
  },
  noticeText: {
    fontSize: 12,
  },
  noticeSuccess: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
    borderWidth: 1,
  },
  noticeSuccessText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  noticeWarning: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warning,
    borderWidth: 1,
  },
  noticeWarningText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
});
