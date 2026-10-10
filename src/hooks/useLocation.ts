import { useState, useCallback } from 'react';

export interface LocationState {
  isLoading: boolean;
  address: string | null;
  error: string | null;
  permissionStatus: 'prompt' | 'granted' | 'denied';
}

const KNOWN_DUBAI_LOCATIONS = [
  'Dubai Marina, Al Marsa Street, Dubai',
  'Downtown Dubai, Sheikh Mohammed bin Rashid Blvd',
  'Business Bay, Marasi Drive, Dubai',
  'Al Quoz Industrial Area 3, Dubai',
];

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    isLoading: false,
    address: null,
    error: null,
    permissionStatus: 'prompt',
  });

  const requestCurrentLocation = useCallback(async (simulatePermissionDenial = false): Promise<{ success: boolean; address?: string; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Simulate GPS acquisition delay
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 800);
    });

    if (simulatePermissionDenial) {
      const errorMsg = 'Location permission was denied. You can enter your address manually below.';
      setState({
        isLoading: false,
        address: null,
        error: errorMsg,
        permissionStatus: 'denied',
      });
      return { success: false, error: errorMsg };
    }

    // Pick a realistic location
    const randomLoc = KNOWN_DUBAI_LOCATIONS[Math.floor(Math.random() * KNOWN_DUBAI_LOCATIONS.length)];
    setState({
      isLoading: false,
      address: randomLoc,
      error: null,
      permissionStatus: 'granted',
    });

    return { success: true, address: randomLoc };
  }, []);

  const resetLocationError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    requestCurrentLocation,
    resetLocationError,
  };
}
