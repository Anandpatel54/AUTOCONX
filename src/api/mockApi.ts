import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingRequest, BookingResponse, InspectionType, Vehicle } from '../types';

// Mock Nissan Patrol Vehicle
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'vehicle_1',
    make: 'Nissan',
    model: 'Patrol',
    year: 2022,
    plate: 'Dubai A 12345',
    mileage: '42,850 km',
    lastService: '15 Jan 2026',
    vin: 'JN1TBNY62Z0083921',
    status: 'Inspection Recommended',
  },
];

// Mock Inspection Types
export const MOCK_INSPECTION_TYPES: InspectionType[] = [
  {
    id: 'PRE_PURCHASE',
    title: 'Pre-Purchase Inspection',
    tagline: '150+ point diagnostic & road-test evaluation',
    duration: '90 mins',
    priceAed: 450,
    badge: 'Popular',
  },
  {
    id: 'ANNUAL_SAFETY',
    title: 'Annual Safety & RTA Check',
    tagline: 'Comprehensive mechanical & emissions compliance check',
    duration: '45 mins',
    priceAed: 280,
  },
  {
    id: 'MAJOR_CHECK',
    title: 'Major Powertrain & Systems',
    tagline: 'Deep dive into engine, transmission, cooling & chassis',
    duration: '120 mins',
    priceAed: 600,
  },
];

// In-memory state for predictable failure simulation
let submissionAttempts = 0;
let forceSimulateFailure: boolean | null = null; // null means auto-predictable

/**
 * Configure or inspect failure simulation for testing/evaluator review
 */
export const failureSimulationConfig = {
  getAttemptCount: () => submissionAttempts,
  resetAttemptCount: () => {
    submissionAttempts = 0;
  },
  setForceFailure: (fail: boolean | null) => {
    forceSimulateFailure = fail;
  },
  getForceFailure: () => forceSimulateFailure,
};

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });

/**
 * GET /vehicles
 */
export async function getVehicles(): Promise<Vehicle[]> {
  await delay(450);
  return [...MOCK_VEHICLES];
}

/**
 * GET /vehicles/:id
 */
export async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
  await delay(300);
  const found = MOCK_VEHICLES.find(v => v.id === vehicleId);
  return found ? { ...found } : null;
}

/**
 * GET /inspection-types
 */
export async function getInspectionTypes(): Promise<InspectionType[]> {
  await delay(350);
  return [...MOCK_INSPECTION_TYPES];
}

/**
 * POST /bookings
 * Simulates real network call with predictable failure on the 1st attempt
 * to demonstrate error state and retry experience as required by assessment.
 */
export async function createBooking(payload: BookingRequest): Promise<BookingResponse> {
  // Simulate network latency
  await delay(1000);

  submissionAttempts += 1;

  // Failure criteria: Only fail if explicitly forced or triggered via mock condition (e.g. notes contains 'fail')
  const shouldFail =
    forceSimulateFailure === true ||
    (payload.notes ? payload.notes.toLowerCase().includes('fail') : false);

  if (shouldFail) {
    throw new Error(
      'Service temporarily unavailable (Error ACX-503). Network timeout connecting to AutoConX dispatch service. Please retry.'
    );
  }

  // Generate unique booking reference (e.g. ACX-29384)
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const reference = `ACX-${randomSuffix}`;

  const inspection = MOCK_INSPECTION_TYPES.find(i => i.id === payload.inspectionType);
  const vehicle = MOCK_VEHICLES.find(v => v.id === payload.vehicleId);

  const response: BookingResponse = {
    bookingId: `bk_${Date.now()}`,
    reference,
    vehicleId: payload.vehicleId,
    vehicleSummary: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.plate})` : 'Vehicle',
    inspectionType: payload.inspectionType,
    inspectionTitle: inspection ? inspection.title : payload.inspectionType,
    address: payload.address,
    date: payload.date,
    notes: payload.notes || '',
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED',
  };

  await saveConfirmedBooking(response);

  return response;
}

// ========================================================
// CONFIRMED BOOKINGS PERSISTENCE & REPORTS
// ========================================================
const CONFIRMED_BOOKINGS_STORAGE_KEY = '@autoconx_confirmed_bookings';
let inMemoryConfirmedBookings: BookingResponse[] = [];

export async function getConfirmedBookings(): Promise<BookingResponse[]> {
  try {
    const raw = await AsyncStorage.getItem(CONFIRMED_BOOKINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...inMemoryConfirmedBookings];
}

export async function saveConfirmedBooking(booking: BookingResponse): Promise<void> {
  inMemoryConfirmedBookings = [booking, ...inMemoryConfirmedBookings];
  try {
    await AsyncStorage.setItem(
      CONFIRMED_BOOKINGS_STORAGE_KEY,
      JSON.stringify(inMemoryConfirmedBookings)
    );
  } catch {}
}

export interface HistoricalInspectionReport {
  id: string;
  reportNumber: string;
  vehiclePlate: string;
  vehicleName: string;
  inspectionType: string;
  inspectionDate: string;
  inspectorName: string;
  overallScore: number;
  status: 'PASSED' | 'ACTION_REQUIRED';
  summary: string;
  categories: {
    name: string;
    score: string;
    status: 'pass' | 'warning' | 'fail';
  }[];
}

export const MOCK_HISTORICAL_REPORTS: HistoricalInspectionReport[] = [
  {
    id: 'rep_1',
    reportNumber: 'RTA-ACX-88219',
    vehiclePlate: 'Dubai A 12345',
    vehicleName: '2022 Nissan Patrol 5.6L V8',
    inspectionType: 'Comprehensive Annual Safety & RTA Check',
    inspectionDate: '15 Jan 2026',
    inspectorName: 'Eng. Tariq Al-Mansoor (AutoConX Senior Inspector)',
    overallScore: 98,
    status: 'PASSED',
    summary: 'Vehicle is in exceptional mechanical and structural condition. All 150 checkpoints verified with zero OBD2 fault codes.',
    categories: [
      { name: 'Engine & Powertrain', score: 'No leaks, clean emissions', status: 'pass' },
      { name: 'OBD2 Computer Scan', score: '0 Diagnostic Trouble Codes', status: 'pass' },
      { name: 'Braking System', score: 'Front: 8.5mm / Rear: 7.8mm (Optimal)', status: 'pass' },
      { name: 'Paint & Bodywork', score: '110 - 135 μm (Original Factory Paint)', status: 'pass' },
      { name: 'Chassis & Frame', score: 'No rust or structural damage', status: 'pass' },
      { name: 'Tires & Suspension', score: 'Tread depth 6.2mm, alignment true', status: 'pass' },
    ],
  },
];
