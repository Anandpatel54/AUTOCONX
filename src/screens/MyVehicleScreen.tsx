import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MyVehicleScreenProps } from '../navigation/types';
import { getVehicles } from '../api/mockApi';
import { Vehicle } from '../types';
import { colors, radius, spacing } from '../theme';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const MyVehicleScreen: React.FC<MyVehicleScreenProps> = ({ navigation }) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      if (data.length > 0) {
        setVehicle(data[0]);
      }
    } catch {
      setError('Unable to load vehicle details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicle();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand App Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>AUTOCONX</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>FLEET CONNECTED</Text>
            </View>
          </View>
          <Text style={styles.title}>My Vehicle</Text>
          <Text style={styles.subtitle}>Manage diagnostics, maintenance & mobile inspections</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Syncing vehicle telemetry...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry Sync" onPress={loadVehicle} variant="outline" size="sm" />
          </Card>
        ) : vehicle ? (
          <View style={styles.mainContent}>
            {/* Hero Vehicle Card */}
            <VehicleCard vehicle={vehicle} />

            {/* Health & Diagnostic Overview Card */}
            <Card style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <View style={styles.healthTitleContainer}>
                  <Text style={styles.healthTitle}>Vehicle Health Status</Text>
                  <Text style={styles.healthScore}>94% Operational</Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>OPTIMAL</Text>
                </View>
              </View>

              {/* Telemetry Metric Bars */}
              <View style={styles.metricsList}>
                <View style={styles.metricItem}>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricName}>Powertrain & Gearbox</Text>
                    <Text style={styles.metricValue}>100%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, styles.progressFull]} />
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricName}>Braking & Suspension</Text>
                    <Text style={styles.metricValue}>88%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, styles.progressHigh]} />
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricName}>Annual RTA Compliance</Text>
                    <Text style={styles.metricDueValue}>Due</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        styles.progressWarning,
                      ]}
                    />
                  </View>
                </View>
              </View>
            </Card>

            {/* Certified Service Dispatch Notice */}
            <Card style={styles.serviceNoticeCard}>
              <View style={styles.serviceNoticeHeader}>
                <View style={styles.badgeCircle}>
                  <Text style={styles.badgeIcon}>🛡️</Text>
                </View>
                <View style={styles.serviceNoticeText}>
                  <Text style={styles.serviceNoticeTitle}>AutoConX Certified Mobile Inspection</Text>
                  <Text style={styles.serviceNoticeDesc}>
                    Get our mobile van dispatched directly to your home or office. Includes comprehensive
                    diagnostic scanner report and RTA pre-inspection.
                  </Text>
                </View>
              </View>

              <View style={styles.guaranteeRow}>
                <View style={styles.guaranteeItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.guaranteeText}>150+ Points Checked</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.guaranteeText}>Same-Day Report</Text>
                </View>
              </View>
            </Card>

            {/* Bottom CTA Button */}
            <View style={styles.ctaContainer}>
              <Button
                title="Book Inspection"
                size="lg"
                onPress={() => navigation.navigate('BookInspection', { vehicleId: vehicle.id })}
              />
              <Text style={styles.ctaHint}>Available across all UAE Emirates • Certified technicians</Text>
            </View>
          </View>
        ) : null}
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
  header: {
    marginBottom: spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  brandBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.xs + 2,
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  centerContainer: {
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.error,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mainContent: {
    gap: spacing.lg,
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    padding: spacing.xl,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  healthTitleContainer: {},
  healthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  healthScore: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scorePill: {
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  scorePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 0.8,
  },
  metricsList: {
    gap: spacing.md,
  },
  metricItem: {
    gap: 6,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  metricDueValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: radius.full,
  },
  progressFull: {
    width: '100%',
  },
  progressHigh: {
    width: '88%',
  },
  progressWarning: {
    width: '40%',
    backgroundColor: colors.warning,
  },
  serviceNoticeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    padding: spacing.xl,
  },
  serviceNoticeHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  badgeCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 20,
  },
  serviceNoticeText: {
    flex: 1,
  },
  serviceNoticeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  serviceNoticeDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  guaranteeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkIcon: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.success,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ctaContainer: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  ctaHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
