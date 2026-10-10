import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConfirmationScreenProps } from '../navigation/types';
import { colors, radius, spacing, shadows } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const { booking } = route.params;

  const handleReturnHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCheck}>✓</Text>
          </View>
          <Text style={styles.title}>Inspection Confirmed</Text>
          <Text style={styles.subtitle}>
            Your certified mobile inspection has been officially scheduled with AutoConX Dispatch.
          </Text>
        </View>

        {/* Boarding Pass / Dispatch Ticket Card */}
        <Card style={styles.ticketCard}>
          {/* Ticket Header */}
          <View style={styles.ticketTop}>
            <View>
              <Text style={styles.ticketBrand}>AUTOCONX DISPATCH</Text>
              <Text style={styles.ticketRefLabel}>BOOKING REFERENCE</Text>
            </View>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activePillText}>CONFIRMED</Text>
            </View>
          </View>

          {/* Reference Big Code */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{booking.reference}</Text>
          </View>

          {/* Perforated Divider */}
          <View style={styles.perforatedRow}>
            <View style={styles.perforatedCircleLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.perforatedCircleRight} />
          </View>

          {/* Appointment Data Rows */}
          <View style={styles.ticketBody}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>VEHICLE</Text>
              <Text style={styles.dataValue}>{booking.vehicleSummary}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>PACKAGE</Text>
              <Text style={styles.dataValue}>{booking.inspectionTitle}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>SCHEDULED DATE</Text>
              <Text style={styles.dataValue}>{booking.date}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>LOCATION</Text>
              <Text style={styles.dataValue}>{booking.address}</Text>
            </View>

            {booking.notes ? (
              <>
                <View style={styles.rowDivider} />
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>SPECIAL NOTES</Text>
                  <Text style={styles.dataValue}>{booking.notes}</Text>
                </View>
              </>
            ) : null}
          </View>
        </Card>

        {/* Next Steps Dispatch Tracker Card */}
        <Card style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>What Happens Next</Text>

          <View style={styles.timeline}>
            <View style={styles.timelineStep}>
              <View style={styles.timelineNumberBadge}>
                <Text style={styles.timelineNumber}>1</Text>
              </View>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineStepTitle}>Technician Pre-Dispatch Call</Text>
                <Text style={styles.timelineStepDesc}>
                  Your assigned inspector will call 30 minutes before arrival to confirm gate entry.
                </Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineStep}>
              <View style={styles.timelineNumberBadge}>
                <Text style={styles.timelineNumber}>2</Text>
              </View>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineStepTitle}>150-Point Diagnostic Check</Text>
                <Text style={styles.timelineStepDesc}>
                  On-site OBD2 diagnostics, engine, chassis, brake testing, and paint depth scan.
                </Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineStep}>
              <View style={styles.timelineNumberBadge}>
                <Text style={styles.timelineNumber}>3</Text>
              </View>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineStepTitle}>Instant Digital Report</Text>
                <Text style={styles.timelineStepDesc}>
                  Comprehensive PDF report with HD photos instantly uploaded to your AutoConX profile.
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Bottom CTA Button */}
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
    paddingBottom: spacing.xxxl * 2,
  },
  statusHeader: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
    borderWidth: 2,
    borderColor: colors.successBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  iconCheck: {
    fontSize: 34,
    color: colors.success,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
    fontWeight: '500',
  },
  ticketCard: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: '#FAF5FF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  ticketBrand: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7E22CE',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  ticketRefLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 0.5,
  },
  codeContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
  },
  codeText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 4,
  },
  perforatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 24,
    backgroundColor: '#FFFFFF',
  },
  perforatedCircleLeft: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    marginLeft: -12,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderStyle: 'dashed',
  },
  perforatedCircleRight: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    marginRight: -12,
  },
  ticketBody: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    width: 90,
  },
  dataValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.xs,
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  trackerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  timeline: {
    gap: spacing.xs,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  timelineNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timelineTextContainer: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  timelineStepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  timelineLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 11,
  },
  ctaContainer: {
    marginTop: spacing.xs,
  },
});
