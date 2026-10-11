import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  getConfirmedBookings,
  MOCK_HISTORICAL_REPORTS,
  HistoricalInspectionReport,
} from '../api/mockApi';
import { BookingResponse } from '../types';
import { colors, radius, spacing, shadows } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { BellIcon } from '../components/common/BellIcon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'scheduled'>('all');
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await getConfirmedBookings();
      setBookings(data);
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const completedReports = MOCK_HISTORICAL_REPORTS;
  const scheduledCount = bookings.length;
  const totalCount = completedReports.length + scheduledCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                onPress={() =>
                  Alert.alert(
                    'Notifications',
                    'All inspection reports and technician dispatch alerts are up to date.'
                  )
                }
              >
                <BellIcon color={colors.primary} hasUnread={true} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.avatarButton}
                accessibilityLabel="Profile"
                onPress={() =>
                  Alert.alert(
                    'AutoConX Profile',
                    'Anand Patel • VIP Member\nDubai Marina, UAE'
                  )
                }
              >
                <Text style={styles.avatarText}>AP</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section Heading & RTA Verified Badge */}
          <View style={styles.headerTop}>
            <View style={styles.titleTextGroup}>
              <Text style={styles.headerTitle}>Inspection Reports</Text>
              <Text style={styles.headerSubtitle}>
                Digital 150-point diagnostic certifications & live dispatches
              </Text>
            </View>
            <View style={styles.badgeContainer}>
              <Icon name="shield-checkmark" size={13} color={colors.accent} />
              <Text style={styles.badgeText}>RTA Verified</Text>
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.filterPill, activeTab === 'all' && styles.filterPillActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text
                style={[styles.filterPillText, activeTab === 'all' && styles.filterPillTextActive]}
              >
                All Records ({totalCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.filterPill, activeTab === 'completed' && styles.filterPillActive]}
              onPress={() => setActiveTab('completed')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === 'completed' && styles.filterPillTextActive,
                ]}
              >
                Completed ({completedReports.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.filterPill, activeTab === 'scheduled' && styles.filterPillActive]}
              onPress={() => setActiveTab('scheduled')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === 'scheduled' && styles.filterPillTextActive,
                ]}
              >
                Scheduled ({scheduledCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching certified reports...</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {/* ========================================================
                1. RECENT / SCHEDULED BOOKINGS (From App Session)
               ======================================================== */}
            {(activeTab === 'all' || activeTab === 'scheduled') &&
              bookings.map(item => (
                <Card key={item.bookingId} style={styles.scheduledCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.scheduledStatusBadge}>
                      <View style={styles.pulsingDot} />
                      <Text style={styles.scheduledStatusText}>SCHEDULED / DISPATCHED</Text>
                    </View>
                    <Text style={styles.refCode}>{item.reference}</Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardVehicleTitle}>2022 Nissan Patrol</Text>
                    <Text style={styles.cardPackageTitle}>{item.inspectionTitle}</Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{item.date}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Icon name="location-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {item.address}
                        </Text>
                      </View>
                    </View>

                    {item.notes ? (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesLabel}>ACCESS NOTES:</Text>
                        <Text style={styles.notesText}>{item.notes}</Text>
                      </View>
                    ) : null}

                    <View style={styles.technicianBanner}>
                      <Icon name="car-outline" size={16} color="#0369A1" />
                      <Text style={styles.technicianText}>
                        Mobile Diagnostic Van #4 will call 30 mins prior to arrival
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}

            {/* ========================================================
                2. COMPLETED 150-POINT INSPECTION REPORTS
               ======================================================== */}
            {(activeTab === 'all' || activeTab === 'completed') &&
              completedReports.map((report: HistoricalInspectionReport) => (
                <Card key={report.id} style={styles.reportCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.passedBadge}>
                      <Icon name="checkmark-circle" size={14} color={colors.success} />
                      <Text style={styles.passedText}>
                        PASSED • {report.overallScore}/100
                      </Text>
                    </View>
                    <Text style={styles.refCode}>{report.reportNumber}</Text>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.titlePlateRow}>
                      <Text style={styles.cardVehicleTitle}>{report.vehicleName}</Text>
                      <View style={styles.plateMiniPill}>
                        <Text style={styles.plateMiniText}>{report.vehiclePlate}</Text>
                      </View>
                    </View>

                    <Text style={styles.cardPackageTitle}>{report.inspectionType}</Text>

                    <View style={styles.inspectorRow}>
                      <Icon name="person-circle-outline" size={15} color={colors.accent} />
                      <Text style={styles.inspectorText}>{report.inspectorName}</Text>
                      <Text style={styles.dateDot}>•</Text>
                      <Text style={styles.dateText}>{report.inspectionDate}</Text>
                    </View>

                    {/* Inspector Summary Box */}
                    <View style={styles.summaryBox}>
                      <View style={styles.summaryHeader}>
                        <Icon name="clipboard-outline" size={13} color={colors.accent} />
                        <Text style={styles.summaryLabel}>SENIOR INSPECTOR SUMMARY</Text>
                      </View>
                      <Text style={styles.summaryText}>{report.summary}</Text>
                    </View>

                    {/* Checkpoints Checklist */}
                    <View style={styles.categoryGrid}>
                      <View style={styles.categoryGridHeader}>
                        <Icon name="shield-checkmark" size={13} color="#0284C7" />
                        <Text style={styles.categoryGridTitle}>
                          VERIFIED 150-POINT DIAGNOSTIC AUDIT
                        </Text>
                      </View>
                      {report.categories.map((cat, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.checkpointRow,
                            idx < report.categories.length - 1 && styles.checkpointRowDivider,
                          ]}
                        >
                          <View style={styles.checkpointTopRow}>
                            <View style={styles.checkpointTitleGroup}>
                              <View style={styles.checkpointCheckCircle}>
                                <Icon name="checkmark" size={11} color="#059669" />
                              </View>
                              <Text style={styles.checkpointName}>{cat.name}</Text>
                            </View>
                            <View style={styles.passTag}>
                              <Text style={styles.passTagText}>PASSED</Text>
                            </View>
                          </View>
                          <Text style={styles.checkpointFinding}>{cat.score}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.pdfDownloadButton}
                      onPress={() =>
                        Alert.alert(
                          'Certified Report Downloaded',
                          `Full 150-Point Digital PDF Report for ${report.vehiclePlate} (Ref: ${report.reportNumber}) has been verified.`,
                          [{ text: 'OK' }]
                        )
                      }
                    >
                      <Icon name="document-text-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.pdfDownloadText}>
                        Download Certified PDF Report (150 Checkpoints)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}

            {/* Empty State Action when on Scheduled tab with 0 bookings */}
            {activeTab === 'scheduled' && scheduledCount === 0 && (
              <Card style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Icon name="calendar-outline" size={32} color={colors.accent} />
                </View>
                <Text style={styles.emptyTitle}>No Active Bookings</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any pending inspections right now. Schedule a mobile inspection to dispatch a technician.
                </Text>
                <Button
                  title="Schedule Mobile Inspection"
                  size="md"
                  onPress={() => navigation.navigate('BookInspection', { vehicleId: 'vehicle_1' })}
                />
              </Card>
            )}
          </View>
        )}
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
    paddingBottom: 130,
  },
  // ========================================================
  // HEADER CONTAINER & BRAND TOP BAR
  // ========================================================
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.select({
      ios: spacing.sm,
      android: (StatusBar.currentHeight || 28) + spacing.sm,
    }),
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: shadows.subtle,
      android: {
        ...shadows.subtle,
        elevation: 2,
      },
    }),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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

  // Page Title & Subtitle + RTA Verified Badge
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 4,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  titleTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },

  // Filter Row
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Body Content
  cardsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  centerContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Scheduled Card Styles
  scheduledCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BAE6FD',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scheduledStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  scheduledStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  refCode: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  cardBody: {
    gap: spacing.xs + 2,
  },
  titlePlateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardVehicleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardPackageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  plateMiniPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  plateMiniText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  notesLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  technicianBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  technicianText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369A1',
    flex: 1,
  },

  // Completed Report Card Styles
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  passedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  passedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.3,
  },
  inspectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 2,
    marginBottom: 4,
  },
  inspectorText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateDot: {
    fontSize: 10,
    color: colors.textMuted,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Senior Inspector Summary Box
  summaryBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 17,
  },

  // Checkpoints Audit Grid (Hierarchy-structured, collision-proof)
  categoryGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginVertical: spacing.xs,
  },
  categoryGridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryGridTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  checkpointRow: {
    paddingVertical: 6,
  },
  checkpointRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkpointTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  checkpointTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  checkpointCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkpointName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  passTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  passTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  checkpointFinding: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    paddingLeft: 22,
  },

  // PDF Button
  pdfDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 3,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    ...shadows.subtle,
  },
  pdfDownloadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Empty Card
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
    gap: spacing.sm,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
});
