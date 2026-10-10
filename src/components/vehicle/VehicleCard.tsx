import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Vehicle } from '../../types';
import { colors, radius, spacing, shadows } from '../../theme';
import { Card } from '../common/Card';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card style={styles.card}>
      {/* Top Header Row with Dubai License Plate and Vehicle Badge */}
      <View style={styles.headerRow}>
        {/* Authentic UAE Dubai Plate */}
        <View style={styles.plateWrapper}>
          <View style={styles.plateContainer}>
            <View style={styles.plateHeader}>
              <Text style={styles.plateCountry}>DUBAI</Text>
            </View>
            <View style={styles.plateBody}>
              <Text style={styles.plateCode}>A</Text>
              <Text style={styles.plateNumber}>
                {vehicle.plate.replace('Dubai A ', '') || '12345'}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Inspection Due</Text>
        </View>
      </View>

      {/* Vehicle Identity */}
      <View style={styles.identitySection}>
        <View style={styles.titleRow}>
          <Text style={styles.carName}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
        </View>
        <Text style={styles.carSubtitle}>5.6L V8 Titanium • Full-Size 4WD Luxury</Text>
      </View>

      <View style={styles.divider} />

      {/* Telemetry / Service Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ODOMETER</Text>
          <Text style={styles.statValue}>{vehicle.mileage || '42,850 km'}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LAST SERVICE</Text>
          <Text style={styles.statValue}>{vehicle.lastService || '15 Jan 2026'}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>CHASSIS VIN</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {vehicle.vin ? `...${vehicle.vin.slice(-6)}` : 'Verified'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  plateWrapper: {
    ...shadows.subtle,
  },
  plateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E293B',
    borderRadius: radius.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  plateHeader: {
    borderRightWidth: 1.5,
    borderRightColor: '#1E293B',
    paddingRight: spacing.sm,
  },
  plateCountry: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#0F172A',
  },
  plateBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  plateCode: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: '#0F172A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // Warm amber-50
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: '#D97706',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.2,
  },
  identitySection: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  carSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
