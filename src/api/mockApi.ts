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

  // Failure criteria:
  // 1. If explicitly forced to fail, OR
  // 2. Odd-numbered attempts (1st, 3rd, 5th...) fail when not overridden
  const shouldFail =
    forceSimulateFailure === true ||
    (forceSimulateFailure === null && submissionAttempts % 2 === 1);

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

  return response;
}
