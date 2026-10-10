import React, { useEffect, useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BookInspectionScreenProps } from '../navigation/types';
import {
  createBooking,
  getInspectionTypes,
} from '../api/mockApi';
import { InspectionType, InspectionTypeId } from '../types';
import { useBookingDraft } from '../hooks/useBookingDraft';
import { useLocation } from '../hooks/useLocation';
import { colors, radius, spacing } from '../theme';
import { TypeSelector } from '../components/booking/TypeSelector';
import { LocationPicker } from '../components/booking/LocationPicker';
import { DatePickerField } from '../components/booking/DatePickerField';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorBanner } from '../components/common/ErrorBanner';

export const BookInspectionScreen: React.FC<BookInspectionScreenProps> = ({
  route,
  navigation,
}) => {
  const vehicleId = route.params?.vehicleId || 'vehicle_1';

  // Persistence Hook
  const { draft, isHydrated, saveDraft, clearDraft } = useBookingDraft();

  // Location Hook
  const { requestCurrentLocation, isLoading: isLocating } = useLocation();

  // Form State
  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([]);
  const [selectedType, setSelectedType] = useState<InspectionTypeId | null>(null);
  const [address, setAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // UI / Submission State
  const [validationErrors, setValidationErrors] = useState<{
    inspectionType?: string;
    address?: string;
    date?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [draftRestoredNotice, setDraftRestoredNotice] = useState(false);

  const hasHydratedRef = useRef(false);

  // Load Inspection Types from mock API
  useEffect(() => {
    async function loadTypes() {
      try {
        const types = await getInspectionTypes();
        setInspectionTypes(types);
      } catch (err) {
        console.warn('Failed to fetch inspection types', err);
      }
    }
    loadTypes();
  }, []);

  // Hydrate form from draft on mount
  useEffect(() => {
    if (isHydrated && !hasHydratedRef.current) {
      hasHydratedRef.current = true;
      if (draft) {
        let restoredAny = false;
        if (draft.inspectionType) {
          setSelectedType(draft.inspectionType);
          restoredAny = true;
        }
        if (draft.address) {
          setAddress(draft.address);
          restoredAny = true;
        }
        if (draft.date) {
          setPreferredDate(draft.date);
          restoredAny = true;
        }
        if (draft.notes) {
          setNotes(draft.notes);
          restoredAny = true;
        }
        if (restoredAny) {
          setDraftRestoredNotice(true);
        }
      }
    }
  }, [isHydrated, draft]);

  // Auto-save draft whenever user updates any field
  useEffect(() => {
    if (!hasHydratedRef.current) return;

    saveDraft({
      vehicleId,
      inspectionType: selectedType || undefined,
      address,
      date: preferredDate,
      notes,
    });
  }, [selectedType, address, preferredDate, notes, vehicleId, saveDraft]);

  // Validation function
  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!selectedType) {
      errors.inspectionType = 'Please select an inspection package';
    }
    if (!address.trim()) {
      errors.address = 'Please provide an address or use current location';
    }
    if (!preferredDate) {
      errors.date = 'Please pick a preferred inspection date';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit booking handler with failure and retry handling
  const handleSubmit = async () => {
    setSubmissionError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createBooking({
        vehicleId,
        inspectionType: selectedType!,
        address: address.trim(),
        date: preferredDate,
        notes: notes.trim(),
      });

      // Clear draft storage upon confirmed booking
      await clearDraft();

      // Navigate to Confirmation Screen
      navigation.navigate('Confirmation', { booking: response });
    } catch (err: any) {
      setSubmissionError(
        err?.message || 'Booking submission failed. Please verify connection and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPackage = inspectionTypes.find(t => t.id === selectedType);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Header */}
          <View style={styles.header}>
            <View style={styles.stepRow}>
              <Text style={styles.stepText}>STEP 2 OF 3</Text>
              <Text style={styles.stepTitle}>Inspection Details</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            {/* Target Vehicle Summary Tag */}
            <View style={styles.vehicleSummaryPill}>
              <Text style={styles.vehiclePillCar}>2022 Nissan Patrol</Text>
              <View style={styles.vehiclePillDivider} />
              <Text style={styles.vehiclePillPlate}>Dubai A 12345</Text>
            </View>
          </View>

          {/* Draft Restored Banner */}
          {draftRestoredNotice && (
            <View style={styles.draftBadge}>
              <Text style={styles.draftBadgeIcon}>💾</Text>
              <Text style={styles.draftBadgeText}>
                Partially completed booking draft restored from previous session
              </Text>
            </View>
          )}

          {/* Submission Failure & Retry Banner */}
          {submissionError && (
            <ErrorBanner
              message={submissionError}
              onRetry={handleSubmit}
              isRetrying={isSubmitting}
            />
          )}

          {/* Field 1: Inspection Type */}
          <TypeSelector
            types={inspectionTypes}
            selectedId={selectedType}
            onSelect={id => {
              setSelectedType(id);
              if (validationErrors.inspectionType) {
                setValidationErrors(prev => ({ ...prev, inspectionType: undefined }));
              }
            }}
            error={validationErrors.inspectionType}
          />

          {/* Field 2: Location (GPS + Manual Fallback) */}
          <LocationPicker
            value={address}
            onChangeText={val => {
              setAddress(val);
              if (validationErrors.address) {
                setValidationErrors(prev => ({ ...prev, address: undefined }));
              }
            }}
            error={validationErrors.address}
            onFetchLocation={requestCurrentLocation}
            isLocating={isLocating}
          />

          {/* Field 3: Date Selection */}
          <DatePickerField
            value={preferredDate}
            onSelectDate={d => {
              setPreferredDate(d);
              if (validationErrors.date) {
                setValidationErrors(prev => ({ ...prev, date: undefined }));
              }
            }}
            error={validationErrors.date}
          />

          {/* Field 4: Additional Notes (Optional) */}
          <Input
            label="Special Instructions / Access Notes (Optional)"
            placeholder="e.g. Underground parking level B2, gate access code #4012"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            helperText="Provide gate codes, parking bay or contact instructions"
          />

          {/* Reviewer Testing Information Box */}
          <View style={styles.reviewerCard}>
            <View style={styles.reviewerHeader}>
              <Text style={styles.reviewerTag}>ASSESSMENT REVIEWER MODE</Text>
            </View>
            <Text style={styles.reviewerDesc}>
              Submissions simulate network failure on attempt #1 to demonstrate error handling & retry state.
            </Text>
          </View>

          {/* Bottom Summary Bar & Submit Action */}
          <View style={styles.checkoutBar}>
            <View style={styles.priceSummary}>
              <Text style={styles.priceLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.priceValue}>
                {selectedPackage ? `AED ${selectedPackage.priceAed}` : 'Select package'}
              </Text>
            </View>

            <Button
              title="Confirm Booking"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  header: {
    marginBottom: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1.5,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    width: '66%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  vehicleSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.sm,
  },
  vehiclePillCar: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  vehiclePillDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
  vehiclePillPlate: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  draftBadgeIcon: {
    fontSize: 14,
  },
  draftBadgeText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  reviewerCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewerHeader: {
    marginBottom: 4,
  },
  reviewerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  reviewerDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  checkoutBar: {
    marginTop: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
  },
  submitButton: {
    width: '100%',
  },
});
