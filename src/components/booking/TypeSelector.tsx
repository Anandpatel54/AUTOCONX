import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { InspectionType, InspectionTypeId } from '../../types';
import { colors, radius, spacing, shadows } from '../../theme';

interface TypeSelectorProps {
  types: InspectionType[];
  selectedId: InspectionTypeId | null;
  onSelect: (id: InspectionTypeId) => void;
  error?: string | null;
}

const PACKAGE_ICONS: Record<InspectionTypeId, string> = {
  PRE_PURCHASE: '🔍',
  ANNUAL_SAFETY: '🛡️',
  MAJOR_CHECK: '⚙️',
};

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  types,
  selectedId,
  onSelect,
  error,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Select Inspection Package</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>

      <View style={styles.list}>
        {types.map(item => {
          const isSelected = selectedId === item.id;
          const icon = PACKAGE_ICONS[item.id] || '📋';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelect(item.id)}
              style={[
                styles.optionCard,
                isSelected ? styles.optionCardSelected : styles.optionCardDefault,
                error && !selectedId ? styles.optionCardError : null,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleGroup}>
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    <Text style={styles.iconText}>{icon}</Text>
                  </View>
                  <View style={styles.titleTextContainer}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={[styles.title, isSelected && styles.titleSelected]}>
                        {item.title}
                      </Text>
                      {item.badge && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>{item.badge.toUpperCase()}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.tagline}>{item.tagline}</Text>
                  </View>
                </View>

                {/* Radio Indicator */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.durationPill}>
                  <Text style={styles.durationText}>⏱ {item.duration}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>AED</Text>
                  <Text style={[styles.priceAmount, isSelected && styles.priceAmountSelected]}>
                    {item.priceAed}
                  </Text>
                </View>
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
    letterSpacing: 0.1,
  },
  requiredStar: {
    color: colors.error,
    fontWeight: '800',
  },
  list: {
    gap: spacing.md,
  },
  optionCard: {
    borderRadius: radius.md,
    padding: spacing.md + 2,
    ...shadows.subtle,
  },
  optionCardDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardSelected: {
    backgroundColor: colors.surfaceSelected,
    borderWidth: 1.8,
    borderColor: colors.accent,
  },
  optionCardError: {
    borderColor: colors.errorBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: '#E0F2FE',
  },
  iconText: {
    fontSize: 18,
  },
  titleTextContainer: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  titleSelected: {
    color: colors.primary,
  },
  popularBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs + 3,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: colors.accent,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  durationPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  currency: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  priceAmountSelected: {
    color: colors.accent,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
});
