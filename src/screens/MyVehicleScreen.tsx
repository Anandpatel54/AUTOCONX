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
import Icon from 'react-native-vector-icons/Ionicons';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { BellIcon } from '../components/common/BellIcon';

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
                <Icon name="flash" size={18} color="#38BDF8" />
              </View>
              <View>
                <Text style={styles.brandTitle}>
                  Auto<Text style={styles.brandTitleAccent}>ConX</Text>
                </Text>
                <View style={styles.locationRow}>
                  <Icon name="location-sharp" size={12} color={colors.accent} />
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
                <BellIcon color={colors.primary} hasUnread={true} />
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

            {/* Small Service & Inspection Info Section */}
            <Card style={styles.serviceNoticeCard}>
              <View style={styles.serviceNoticeRow}>
                <View style={styles.serviceNoticeIconCircle}>
                  <Icon name="construct-outline" size={20} color={colors.accent} />
                </View>
                <View style={styles.serviceNoticeTextGroup}>
                  <Text style={styles.serviceNoticeTitle}>Annual Inspection Recommended</Text>
                  <Text style={styles.serviceNoticeDesc}>
                    Your Nissan Patrol is approaching its scheduled interval. Certified technicians verify 150+ mechanical checkpoints at your home or office.
                  </Text>
                </View>
              </View>
            </Card>

            {/* Why AutoConX Certified Standards */}
            <Card style={styles.standardsCard}>
              <Text style={styles.standardsTitle}>AutoConX Certified Guarantee</Text>
              <View style={styles.standardsGrid}>
                <View style={styles.standardItem}>
                  <View style={styles.standardIconCircle}>
                    <Icon name="shield-checkmark-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.standardHeading}>150+ Checkpoints</Text>
                  <Text style={styles.standardDesc}>Engine, chassis, paint & diagnostics</Text>
                </View>

                <View style={styles.standardItem}>
                  <View style={styles.standardIconCircle}>
                    <Icon name="speedometer-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.standardHeading}>Fast Dispatch</Text>
                  <Text style={styles.standardDesc}>Anywhere in Dubai & Abu Dhabi</Text>
                </View>

                <View style={styles.standardItem}>
                  <View style={styles.standardIconCircle}>
                    <Icon name="document-text-outline" size={20} color={colors.primary} />
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

  serviceNoticeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    padding: spacing.lg,
  },
  serviceNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  serviceNoticeIconCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceNoticeIcon: {
    fontSize: 20,
  },
  serviceNoticeTextGroup: {
    flex: 1,
  },
  serviceNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 3,
  },
  serviceNoticeDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
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
