import {
  getVehicles,
  getInspectionTypes,
  createBooking,
  failureSimulationConfig,
} from '../src/api/mockApi';

describe('mockApi Service', () => {
  beforeEach(() => {
    failureSimulationConfig.resetAttemptCount();
    failureSimulationConfig.setForceFailure(null);
  });

  it('fetches Nissan Patrol vehicle details', async () => {
    const vehicles = await getVehicles();
    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].make).toBe('Nissan');
    expect(vehicles[0].model).toBe('Patrol');
    expect(vehicles[0].plate).toBe('Dubai A 12345');
    expect(vehicles[0].year).toBe(2022);
  });

  it('fetches inspection packages list', async () => {
    const types = await getInspectionTypes();
    expect(types.length).toBeGreaterThan(0);
    expect(types.some(t => t.id === 'PRE_PURCHASE')).toBe(true);
  });

  it('simulates failure when triggered and succeeds on normal submission', async () => {
    const failPayload = {
      vehicleId: 'vehicle_1',
      inspectionType: 'PRE_PURCHASE' as const,
      address: 'Dubai Marina',
      date: '2026-10-15',
      notes: 'fail simulation test',
    };

    // Attempt with failure condition -> Expected to fail (simulate network error)
    await expect(createBooking(failPayload)).rejects.toThrow('Service temporarily unavailable');

    // Normal attempt -> Expected to succeed immediately
    const successPayload = { ...failPayload, notes: 'Please call before arrival' };
    const response = await createBooking(successPayload);
    expect(response.status).toBe('CONFIRMED');
    expect(response.reference).toMatch(/^ACX-\d{5}$/);
    expect(response.address).toBe('Dubai Marina');
  });
});
