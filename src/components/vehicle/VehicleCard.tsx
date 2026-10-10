import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Vehicle } from '../../types';
import { colors, radius, spacing } from '../../theme';
import { Card } from '../common/Card';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card style={styles.card}>
      {/* UAE License Plate Representation */}
      <View style={styles.plateContainer}>
        <View style={styles.plateHeader}>
          <Text style={styles.plateCountry}>DUBAI</Text>
        </View>
        <View style={styles.plateBody}>
          <Text style={styles.plateCode}>A</Text>
          <Text style={styles.plateNumber}>{vehicle.plate.replace('Dubai A ', '') || '12345'}</Text>
        </View>
      </View>

      {/* Vehicle Identity */}
      <View style={styles.titleSection}>
        <Text style={styles.yearMakeModel}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        {vehicle.status && (
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{vehicle.status}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Vehicle Specs / Service Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>ODOMETER</Text>
          <Text style={styles.infoValue}>{vehicle.mileage || '42,850 km'}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>LAST INSPECTION</Text>
          <Text style={styles.infoValue}>{vehicle.lastService || '15 Jan 2026'}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>CHASSIS / VIN</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {vehicle.vin ? `...${vehicle.vin.slice(-8)}` : 'Verified'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
  },
  plateContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E293B',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  plateHeader: {
    borderRightWidth: 1.5,
    borderRightColor: '#1E293B',
    paddingRight: spacing.sm,
  },
  plateCountry: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#1E293B',
  },
  plateBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  plateCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626', // Red code for Dubai
  },
  plateNumber: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#1E293B',
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  yearMakeModel: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.warningBg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.warning,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
