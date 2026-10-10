import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingDraft } from '../types';

const DRAFT_STORAGE_KEY = '@autoconx_booking_draft_v1';

export function useBookingDraft() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load draft from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;

    async function loadDraft() {
      try {
        const stored = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored) as BookingDraft;
          setDraft(parsed);
        }
      } catch (err) {
        console.warn('Failed to load booking draft from storage:', err);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save partial draft
  const saveDraft = useCallback(async (updated: BookingDraft) => {
    try {
      const payload: BookingDraft = {
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      setDraft(payload);
      await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save booking draft to storage:', err);
    }
  }, []);

  // Clear draft after successful submission
  const clearDraft = useCallback(async () => {
    try {
      setDraft(null);
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to remove booking draft:', err);
    }
  }, []);

  return {
    draft,
    isHydrated,
    saveDraft,
    clearDraft,
  };
}
