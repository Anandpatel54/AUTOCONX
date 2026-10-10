import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

interface DateOption {
  key: string;
  label: string;
  subLabel: string;
  isoDate: string;
}

interface DatePickerFieldProps {
  value: string;
  onSelectDate: (isoDate: string) => void;
  error?: string | null;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onSelectDate,
  error,
}) => {
  // Generate next 5 upcoming available inspection dates starting from tomorrow
  const dateOptions: DateOption[] = React.useMemo(() => {
    const options: DateOption[] = [];
    const base = new Date();

    for (let i = 1; i <= 5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);

      const dayName = i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const year = d.getFullYear();
      const isoDate = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      options.push({
        key: isoDate,
        label: dayName,
        subLabel: monthDay,
        isoDate,
      });
    }
    return options;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Preferred Inspection Date <Text style={styles.requiredStar}>*</Text>
      </Text>

      <View style={styles.optionsRow}>
        {dateOptions.map(opt => {
          const isSelected = value === opt.isoDate;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.7}
              onPress={() => onSelectDate(opt.isoDate)}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
                error && !value && styles.dateCardError,
              ]}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                {opt.label}
              </Text>
              <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                {opt.subLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  requiredStar: {
    color: colors.error,
    fontWeight: '700',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs + 2,
  },
  dateCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceSelected,
  },
  dateCardError: {
    borderColor: colors.errorBorder,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dayNameSelected: {
    color: colors.accent,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateTextSelected: {
    color: colors.accent,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
});
