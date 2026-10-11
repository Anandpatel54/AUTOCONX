import React, { useEffect, useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  // Step Wizard State (Step 1 -> Step 2 -> Step 3)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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

  // Step Navigation Handlers
  const handleNextStep1 = () => {
    if (!selectedType) {
      setValidationErrors(prev => ({
        ...prev,
        inspectionType: 'Please select an inspection package to proceed',
      }));
      return;
    }
    setValidationErrors(prev => ({ ...prev, inspectionType: undefined }));
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (!address.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        address: 'Please provide an address or use current location',
      }));
      return;
    }
    setValidationErrors(prev => ({ ...prev, address: undefined }));
    setCurrentStep(3);
  };

  const handlePrevStep = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const getStepProgress = () => {
    if (currentStep === 1) return { title: 'Select Package', progress: '33%' as const };
    if (currentStep === 2) return { title: 'Inspection Location', progress: '66%' as const };
    return { title: 'Date & Review', progress: '100%' as const };
  };

  const stepMeta = getStepProgress();

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
          {/* Dynamic Progress Header */}
          <View style={styles.header}>
            <View style={styles.stepRow}>
              <Text style={styles.stepText}>{`STEP ${currentStep} OF 3`}</Text>
              <Text style={styles.stepTitle}>{stepMeta.title}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: stepMeta.progress }]} />
            </View>

            {/* Visual Stepper Indicators with Tap-to-Navigate */}
            <View style={styles.stepperPillsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.stepperPill}
                onPress={() => setCurrentStep(1)}
              >
                <View
                  style={[
                    styles.stepperCircle,
                    selectedType ? styles.stepperCircleDone : currentStep === 1 ? styles.stepperCircleActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepperCircleText,
                      selectedType || currentStep === 1 ? styles.stepperCircleTextActive : null,
                    ]}
                  >
                    {selectedType ? '✓' : '1'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepperLabel,
                    selectedType || currentStep === 1 ? styles.stepperLabelActive : null,
                  ]}
                >
                  Package
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.stepperLine,
                  selectedType ? styles.stepperLineDone : null,
                ]}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.stepperPill}
                onPress={() => {
                  if (selectedType) setCurrentStep(2);
                }}
              >
                <View
                  style={[
                    styles.stepperCircle,
                    address.trim() ? styles.stepperCircleDone : currentStep === 2 ? styles.stepperCircleActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepperCircleText,
                      address.trim() || currentStep === 2 ? styles.stepperCircleTextActive : null,
                    ]}
                  >
                    {address.trim() ? '✓' : '2'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepperLabel,
                    address.trim() || currentStep === 2 ? styles.stepperLabelActive : null,
                  ]}
                >
                  Location
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.stepperLine,
                  address.trim() ? styles.stepperLineDone : null,
                ]}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.stepperPill}
                onPress={() => {
                  if (selectedType && address.trim()) setCurrentStep(3);
                }}
              >
                <View
                  style={[
                    styles.stepperCircle,
                    preferredDate ? styles.stepperCircleDone : currentStep === 3 ? styles.stepperCircleActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepperCircleText,
                      preferredDate || currentStep === 3 ? styles.stepperCircleTextActive : null,
                    ]}
                  >
                    {preferredDate ? '✓' : '3'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepperLabel,
                    preferredDate || currentStep === 3 ? styles.stepperLabelActive : null,
                  ]}
                >
                  Schedule
                </Text>
              </TouchableOpacity>
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

          {/* ========================================================
              STEP 1: PACKAGE SELECTION
             ======================================================== */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeadingBlock}>
                <Text style={styles.stepSectionTitle}>1. Select Inspection Package *</Text>
                <Text style={styles.stepSectionDesc}>
                  Choose the certified diagnostic tier that suits your Nissan Patrol.
                </Text>
              </View>

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

              <View style={styles.checkoutBar}>
                <View style={styles.priceSummary}>
                  <Text style={styles.priceLabel}>PACKAGE PRICE</Text>
                  <Text style={styles.priceValue}>
                    {selectedPackage ? `AED ${selectedPackage.priceAed}` : 'Select above'}
                  </Text>
                </View>

                <Button
                  title="Continue to Location →"
                  size="lg"
                  onPress={handleNextStep1}
                  style={styles.submitButton}
                />
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 2: LOCATION / ADDRESS
             ======================================================== */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              {selectedPackage && (
                <View style={styles.selectedPackageChip}>
                  <Text style={styles.selectedPackageChipTitle}>✓ {selectedPackage.title}</Text>
                  <Text style={styles.selectedPackageChipPrice}>AED {selectedPackage.priceAed}</Text>
                </View>
              )}

              <View style={styles.stepHeadingBlock}>
                <Text style={styles.stepSectionTitle}>2. Inspection Location *</Text>
                <Text style={styles.stepSectionDesc}>
                  Where should our certified mobile service van dispatch?
                </Text>
              </View>

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

              <View style={styles.wizardButtonRow}>
                <Button
                  title="← Back"
                  variant="outline"
                  size="lg"
                  onPress={handlePrevStep}
                  style={styles.wizardBackButton}
                />
                <Button
                  title="Continue to Schedule →"
                  size="lg"
                  onPress={handleNextStep2}
                  style={styles.wizardNextButton}
                />
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 3: DATE & ACCESS NOTES + CONFIRMATION
             ======================================================== */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              {/* Summary of Steps 1 & 2 */}
              <View style={styles.stepSummaryCard}>
                <Text style={styles.stepSummaryTitle}>Booking Summary</Text>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>VEHICLE:</Text>
                  <Text style={styles.summaryVal}>2022 Nissan Patrol (Dubai A 12345)</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>PACKAGE:</Text>
                  <Text style={styles.summaryVal}>
                    {selectedPackage?.title} (AED {selectedPackage?.priceAed})
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>LOCATION:</Text>
                  <Text style={styles.summaryVal}>{address}</Text>
                </View>
              </View>

              <View style={styles.stepHeadingBlock}>
                <Text style={styles.stepSectionTitle}>3. Preferred Date & Access Notes *</Text>
                <Text style={styles.stepSectionDesc}>
                  Pick your preferred arrival date and add any parking or gate access notes.
                </Text>
              </View>

              {/* Submission Failure & Retry Banner */}
              {submissionError && (
                <ErrorBanner
                  message={submissionError}
                  onRetry={handleSubmit}
                  isRetrying={isSubmitting}
                />
              )}

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

              <Input
                label="Special Instructions / Access Notes (Optional)"
                placeholder="e.g. Underground parking level B2, gate access code #4012"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                helperText="Provide gate codes, parking bay or contact instructions"
              />

              <View style={styles.wizardButtonRow}>
                <Button
                  title="← Back"
                  variant="outline"
                  size="lg"
                  onPress={handlePrevStep}
                  style={styles.wizardBackButton}
                />
                <Button
                  title="Confirm Booking"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                  style={styles.wizardNextButton}
                />
              </View>
            </View>
          )}
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
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  stepperPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperCircle: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCircleActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  stepperCircleDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stepperCircleText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
  },
  stepperCircleTextActive: {
    color: '#FFFFFF',
  },
  stepperLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepperLabelActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  stepperLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 6,
  },
  stepperLineDone: {
    backgroundColor: colors.success,
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
  stepContainer: {
    gap: spacing.md,
  },
  stepHeadingBlock: {
    marginBottom: spacing.xs,
  },
  stepSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  stepSectionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  selectedPackageChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  selectedPackageChipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  selectedPackageChipPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  stepSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  stepSummaryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: '70%',
    textAlign: 'right',
  },
  wizardButtonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  wizardBackButton: {
    flex: 1,
  },
  wizardNextButton: {
    flex: 2,
  },
});
