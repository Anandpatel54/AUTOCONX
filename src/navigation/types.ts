import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingResponse } from '../types';

export type RootStackParamList = {
  MyVehicle: undefined;
  BookInspection: { vehicleId?: string } | undefined;
  Confirmation: { booking: BookingResponse };
};

export type MyVehicleScreenProps = NativeStackScreenProps<RootStackParamList, 'MyVehicle'>;
export type BookInspectionScreenProps = NativeStackScreenProps<RootStackParamList, 'BookInspection'>;
export type ConfirmationScreenProps = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;
