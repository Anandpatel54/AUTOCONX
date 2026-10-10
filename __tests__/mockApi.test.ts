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

  it('simulates failure on first submission and succeeds on retry', async () => {
    const payload = {
      vehicleId: 'vehicle_1',
      inspectionType: 'PRE_PURCHASE' as const,
      address: 'Dubai Marina',
      date: '2026-10-15',
      notes: 'Test booking',
    };

    // 1st attempt -> Expected to fail (simulate network error)
    await expect(createBooking(payload)).rejects.toThrow('Service temporarily unavailable');

    // 2nd attempt (Retry) -> Expected to succeed
    const response = await createBooking(payload);
    expect(response.status).toBe('CONFIRMED');
    expect(response.reference).toMatch(/^ACX-\d{5}$/);
    expect(response.address).toBe('Dubai Marina');
  });
});
