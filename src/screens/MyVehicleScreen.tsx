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
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>AUTOCONX GARAGE</Text>
          <Text style={styles.title}>My Vehicle</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching vehicle records...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorTitle}>Error Loading Vehicle</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={loadVehicle} variant="outline" size="sm" />
          </Card>
        ) : vehicle ? (
          <View style={styles.mainContent}>
            {/* Nissan Patrol Card */}
            <VehicleCard vehicle={vehicle} />

            {/* Health & Inspection Recommendation Banner */}
            <Card style={styles.serviceNoticeCard}>
              <View style={styles.noticeHeader}>
                <View style={styles.noticeIconCircle}>
                  <Text style={styles.noticeIcon}>🔧</Text>
                </View>
                <View style={styles.noticeTextContainer}>
                  <Text style={styles.noticeTitle}>Annual Inspection Due</Text>
                  <Text style={styles.noticeDescription}>
                    Your Nissan Patrol is approaching its scheduled interval. AutoConX certified
                    technicians verify 150+ mechanical checkpoints.
                  </Text>
                </View>
              </View>

              <View style={styles.checklistRow}>
                <Text style={styles.checkItem}>✓ Brake & Suspension Check</Text>
                <Text style={styles.checkItem}>✓ Engine Diagnostics</Text>
                <Text style={styles.checkItem}>✓ RTA Compliance Ready</Text>
              </View>
            </Card>

            {/* Sticky/Bottom CTA Area */}
            <View style={styles.ctaContainer}>
              <Button
                title="Book Inspection"
                size="lg"
                onPress={() => navigation.navigate('BookInspection', { vehicleId: vehicle.id })}
              />
              <Text style={styles.ctaHint}>Guaranteed certified technician dispatch in UAE</Text>
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  centerContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  serviceNoticeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
  },
  noticeHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  noticeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeIcon: {
    fontSize: 18,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  noticeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checklistRow: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  checkItem: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  ctaContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  ctaHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
  },
});
