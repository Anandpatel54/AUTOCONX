import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MyVehicleScreenProps } from '../navigation/types';
import { getVehicles } from '../api/mockApi';
import { Vehicle } from '../types';
import { colors, radius, spacing, shadows } from '../theme';
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
        {/* ========================================================
            PREMIUM AUTOMOTIVE APP HEADER
           ======================================================== */}
        <View style={styles.headerContainer}>
          {/* Top Bar: Brand, Location & User Controls */}
          <View style={styles.topBar}>
            <View style={styles.brandContainer}>
              <View style={styles.brandLogoCircle}>
                <Text style={styles.brandLogoText}>⚡</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>
                  Auto<Text style={styles.brandTitleAccent}>ConX</Text>
                </Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationPin}>📍</Text>
                  <Text style={styles.locationText}>Dubai Marina • UAE</Text>
                </View>
              </View>
            </View>

            {/* Right Side: Notification Bell & Profile Avatar */}
            <View style={styles.userActionsRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.bellButton}
                accessibilityLabel="Notifications"
              >
                <Text style={styles.bellIcon}>🔔</Text>
                <View style={styles.unreadDot} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.avatarButton}
                accessibilityLabel="Profile"
              >
                <Text style={styles.avatarText}>AP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ========================================================
            MAIN BODY CONTENT
           ======================================================== */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Syncing vehicle records & diagnostics...</Text>
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

            {/* Quick Inspection Booking CTA Card (High-Impact Hero Banner) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('BookInspection', { vehicleId: vehicle.id })}
              style={styles.bookingHeroCard}
            >
              <View style={styles.bookingHeroContent}>
                <View style={styles.bookingHeroLeft}>
                  <View style={styles.dueBadge}>
                    <Text style={styles.dueBadgeText}>ANNUAL INSPECTION DUE</Text>
                  </View>
                  <Text style={styles.bookingHeroTitle}>Schedule Mobile Inspection</Text>
                  <Text style={styles.bookingHeroDesc}>
                    Certified AutoConX mobile van dispatched to your door. 150+ point diagnostic scan.
                  </Text>
                </View>

                <View style={styles.bookNowArrowCircle}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </View>

              <View style={styles.bookingHeroFooter}>
                <Text style={styles.heroFooterFeature}>✓ Home / Office Dispatch</Text>
                <Text style={styles.heroFooterFeature}>✓ RTA Ready</Text>
                <Text style={styles.heroFooterPrice}>From AED 280</Text>
              </View>
            </TouchableOpacity>

            {/* Health & Diagnostic Telemetry Overview */}
            <Card style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <View>
                  <Text style={styles.healthSectionTitle}>Vehicle Diagnostics</Text>
                  <Text style={styles.healthSectionSubtitle}>Real-time system health summary</Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>94% OPTIMAL</Text>
                </View>
              </View>

              {/* Telemetry Metric Bars */}
              <View style={styles.metricsList}>
                <View style={styles.metricItem}>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricName}>Powertrain & Gearbox</Text>
                    <Text style={styles.metricValue}>100% Healthy</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, styles.progressFull]} />
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricName}>Brakes, Tires & Suspension</Text>
                    <Text style={styles.metricValue}>88% Good</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, styles.progressHigh]} />
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricName}>RTA Compliance Status</Text>
                    <Text style={styles.metricDueValue}>Renewal Due Soon</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, styles.progressWarning]} />
                  </View>
                </View>
              </View>
            </Card>

            {/* Why AutoConX Certified Standards */}
            <Card style={styles.standardsCard}>
              <Text style={styles.standardsTitle}>AutoConX Certified Guarantee</Text>
              <View style={styles.standardsGrid}>
                <View style={styles.standardItem}>
                  <View style={styles.standardIconCircle}>
                    <Text style={styles.standardIcon}>🔍</Text>
                  </View>
                  <Text style={styles.standardHeading}>150+ Checkpoints</Text>
                  <Text style={styles.standardDesc}>Engine, chassis, paint & diagnostics</Text>
                </View>

                <View style={styles.standardItem}>
                  <View style={styles.standardIconCircle}>
                    <Text style={styles.standardIcon}>⏱️</Text>
                  </View>
                  <Text style={styles.standardHeading}>Fast Dispatch</Text>
                  <Text style={styles.standardDesc}>Anywhere in Dubai & Abu Dhabi</Text>
                </View>

                <View style={styles.standardItem}>
                  <View style={styles.standardIconCircle}>
                    <Text style={styles.standardIcon}>📄</Text>
                  </View>
                  <Text style={styles.standardHeading}>Digital Report</Text>
                  <Text style={styles.standardDesc}>HD photos & RTA passing checklist</Text>
                </View>
              </View>
            </Card>

            {/* Primary Action Button */}
            <View style={styles.ctaContainer}>
              <Button
                title="Book Inspection"
                size="lg"
                onPress={() => navigation.navigate('BookInspection', { vehicleId: vehicle.id })}
              />
              <Text style={styles.ctaHint}>
                Certified AutoConX mobile technicians available across UAE
              </Text>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl * 2,
  },
  // ========================================================
  // HEADER STYLES
  // ========================================================
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  brandLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoText: {
    fontSize: 18,
    color: '#38BDF8', // Cyan bolt
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandTitleAccent: {
    color: '#0284C7',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationPin: {
    fontSize: 10,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  userActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellIcon: {
    fontSize: 16,
  },
  unreadDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: '#EF4444',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // ========================================================
  // CONTENT STYLES
  // ========================================================
  centerContainer: {
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorCard: {
    margin: spacing.lg,
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
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  // ========================================================
  // BOOKING HERO CARD (HIGH IMPACT)
  // ========================================================
  bookingHeroCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadows.elevated,
  },
  bookingHeroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bookingHeroLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  dueBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
    marginBottom: spacing.xs + 2,
  },
  dueBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.8,
  },
  bookingHeroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  bookingHeroDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  bookNowArrowCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  bookingHeroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  heroFooterFeature: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  heroFooterPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
  },

  // ========================================================
  // HEALTH CARD
  // ========================================================
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
  healthSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  healthSectionSubtitle: {
    fontSize: 12,
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

  // ========================================================
  // STANDARDS GRID
  // ========================================================
  standardsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    padding: spacing.xl,
  },
  standardsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  standardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  standardItem: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  standardIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  standardIcon: {
    fontSize: 16,
  },
  standardHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  standardDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 13,
  },

  // ========================================================
  // BOTTOM CTA
  // ========================================================
  ctaContainer: {
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  ctaHint: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
