import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, shadows } from '../../theme';

interface DateOption {
  key: string;
  dayOfWeek: string;
  dayNumber: string;
  monthShort: string;
  isoDate: string;
  isTomorrow: boolean;
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
  const dateOptions: DateOption[] = React.useMemo(() => {
    const options: DateOption[] = [];
    const base = new Date();

    for (let i = 1; i <= 5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);

      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNumber = String(d.getDate());
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const year = d.getFullYear();
      const isoDate = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      options.push({
        key: isoDate,
        dayOfWeek,
        dayNumber,
        monthShort,
        isoDate,
        isTomorrow: i === 1,
      });
    }
    return options;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Preferred Appointment Date</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>

      <View style={styles.cardsRow}>
        {dateOptions.map(opt => {
          const isSelected = value === opt.isoDate;

          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.8}
              onPress={() => onSelectDate(opt.isoDate)}
              style={[
                styles.dateCard,
                isSelected ? styles.dateCardSelected : styles.dateCardDefault,
                error && !value ? styles.dateCardError : null,
              ]}
            >
              {opt.isTomorrow && (
                <View style={[styles.pillTomorrow, isSelected && styles.pillTomorrowSelected]}>
                  <Text style={[styles.tomorrowText, isSelected && styles.tomorrowTextSelected]}>
                    SOONEST
                  </Text>
                </View>
              )}
              <Text style={[styles.dayOfWeek, isSelected && styles.textInverse]}>
                {opt.dayOfWeek}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.textInverse]}>
                {opt.dayNumber}
              </Text>
              <Text style={[styles.monthShort, isSelected && styles.textInverseMuted]}>
                {opt.monthShort}
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
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs + 2,
  },
  dateCard: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  dateCardDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.card,
  },
  dateCardError: {
    borderColor: colors.errorBorder,
  },
  pillTomorrow: {
    position: 'absolute',
    top: 4,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  pillTomorrowSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tomorrowText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  tomorrowTextSelected: {
    color: '#FFFFFF',
  },
  dayOfWeek: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  monthShort: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  textInverse: {
    color: colors.textInverse,
  },
  textInverseMuted: {
    color: 'rgba(255,255,255,0.7)',
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
});
