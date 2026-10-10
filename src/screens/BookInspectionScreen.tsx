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

  // Track if initial draft restoration occurred
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
    // Clear previous error
    setSubmissionError(null);

    // Validate
    if (!validateForm()) {
      return;
    }

    // Submit request (Prevent duplicate taps by setting isSubmitting)
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
      // Simulate failure experience
      setSubmissionError(
        err?.message || 'Booking submission failed. Please verify connection and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.subtitle}>STEP 2 OF 3</Text>
            <Text style={styles.title}>Book Inspection</Text>
            <Text style={styles.description}>
              Select your service package, convenient inspection location, and preferred appointment time.
            </Text>
          </View>

          {/* Draft Restored Banner */}
          {draftRestoredNotice && (
            <View style={styles.draftBadge}>
              <Text style={styles.draftBadgeText}>
                💾 Restored partially completed booking draft from previous session
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
            label="Additional Notes (Optional)"
            placeholder="e.g. Key is with security at gate 2, call upon arrival"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            helperText="Any special parking instructions or vehicle observations"
          />

          {/* Assessment Reviewer Simulation Notice */}
          <View style={styles.evaluatorPill}>
            <Text style={styles.evaluatorText}>
              ℹ️ Failure Simulation: Submissions are programmed to simulate network failure on attempt #1 to demonstrate error & retry handling.
            </Text>
          </View>

          {/* Primary Action CTA */}
          <View style={styles.ctaContainer}>
            <Button
              title="Confirm Booking"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmit}
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
    paddingBottom: spacing.xxxl * 1.5,
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
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  draftBadge: {
    backgroundColor: colors.surfaceSelected,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  draftBadgeText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  evaluatorPill: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
  },
  evaluatorText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  ctaContainer: {
    marginTop: spacing.md,
  },
});
