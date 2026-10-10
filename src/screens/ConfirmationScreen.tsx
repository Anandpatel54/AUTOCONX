import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConfirmationScreenProps } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const { booking } = route.params;

  const handleReturnHome = () => {
    // Reset navigation stack to Screen 1 so user doesn't pop back to a submitted form
    navigation.reset({
      index: 0,
      routes: [{ name: 'MyVehicle' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon & Heading */}
        <View style={styles.statusHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCheck}>✓</Text>
          </View>
          <Text style={styles.title}>Inspection Confirmed</Text>
          <Text style={styles.subtitle}>
            Your mobile inspection has been scheduled with AutoConX Dispatch.
          </Text>
        </View>

        {/* Booking Reference Card */}
        <View style={styles.referenceContainer}>
          <Text style={styles.referenceLabel}>BOOKING REFERENCE</Text>
          <Text style={styles.referenceValue}>{booking.reference}</Text>
          <Text style={styles.referenceSub}>
            Present this reference to your inspector upon arrival
          </Text>
        </View>

        {/* Booking Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Appointment Summary</Text>

          {/* Vehicle row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Vehicle</Text>
            <Text style={styles.rowValue}>{booking.vehicleSummary}</Text>
          </View>

          <View style={styles.divider} />

          {/* Package row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Inspection</Text>
            <Text style={styles.rowValue}>{booking.inspectionTitle}</Text>
          </View>

          <View style={styles.divider} />

          {/* Date row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>{booking.date}</Text>
          </View>

          <View style={styles.divider} />

          {/* Location row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Location</Text>
            <Text style={styles.rowValue}>{booking.address}</Text>
          </View>

          {booking.notes ? (
            <>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.rowLabel}>Notes</Text>
                <Text style={styles.rowValue}>{booking.notes}</Text>
              </View>
            </>
          ) : null}
        </Card>

        {/* Next Steps Card */}
        <Card style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              A certified technician will call 30 minutes prior to arrival.
            </Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Digital diagnostic report will be uploaded to your AutoConX dashboard.
            </Text>
          </View>
        </Card>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title="Done / Return to Vehicle"
            size="lg"
            onPress={handleReturnHome}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 1.5,
  },
  statusHeader: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
    borderWidth: 2,
    borderColor: colors.successBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconCheck: {
    fontSize: 32,
    color: colors.success,
    fontWeight: '800',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  referenceContainer: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  referenceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.tint,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textInverse,
    letterSpacing: 3,
    marginBottom: 4,
  },
  referenceSub: {
    fontSize: 12,
    color: colors.tint,
    opacity: 0.85,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    width: 85,
  },
  rowValue: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  nextStepsCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  nextStepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  stepNumber: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctaContainer: {
    marginTop: spacing.sm,
  },
});
