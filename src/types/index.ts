export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  mileage?: string;
  lastService?: string;
  vin?: string;
  status?: 'Inspection Recommended' | 'Valid' | 'Due Soon';
}

export type InspectionTypeId = 'PRE_PURCHASE' | 'ANNUAL_SAFETY' | 'MAJOR_CHECK';

export interface InspectionType {
  id: InspectionTypeId;
  title: string;
  tagline: string;
  duration: string;
  priceAed: number;
  badge?: string;
}

export interface BookingRequest {
  vehicleId: string;
  inspectionType: InspectionTypeId;
  address: string;
  date: string;
  notes?: string;
}

export interface BookingResponse {
  bookingId: string;
  reference: string;
  vehicleId: string;
  vehicleSummary: string;
  inspectionType: InspectionTypeId;
  inspectionTitle: string;
  address: string;
  date: string;
  notes?: string;
  createdAt: string;
  status: 'CONFIRMED' | 'PENDING';
}

export interface BookingDraft {
  vehicleId?: string;
  inspectionType?: InspectionTypeId;
  address?: string;
  date?: string;
  notes?: string;
  updatedAt?: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
