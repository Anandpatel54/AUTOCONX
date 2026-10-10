import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { InspectionType, InspectionTypeId } from '../../types';
import { colors, radius, spacing } from '../../theme';

interface TypeSelectorProps {
  types: InspectionType[];
  selectedId: InspectionTypeId | null;
  onSelect: (id: InspectionTypeId) => void;
  error?: string | null;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  types,
  selectedId,
  onSelect,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Inspection Package <Text style={styles.requiredStar}>*</Text>
      </Text>

      <View style={styles.list}>
        {types.map(item => {
          const isSelected = selectedId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelect(item.id)}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                error && !selectedId && styles.optionCardError,
              ]}
            >
              <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                  <Text style={[styles.title, isSelected && styles.titleSelected]}>
                    {item.title}
                  </Text>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>

                {/* Radio selection circle */}
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>

              <Text style={styles.tagline}>{item.tagline}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.duration}>⏱ {item.duration}</Text>
                <Text style={[styles.price, isSelected && styles.priceSelected]}>
                  AED {item.priceAed}
                </Text>
              </View>
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
  list: {
    gap: spacing.sm + 2,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceSelected,
  },
  optionCardError: {
    borderColor: colors.errorBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  titleSelected: {
    color: colors.accent,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textInverse,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  duration: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  priceSelected: {
    color: colors.accent,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
});
