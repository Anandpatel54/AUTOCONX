import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BookingResponse } from '../types';

export type MainTabParamList = {
  VehicleTab: undefined;
  ReportsTab: undefined;
  GarageTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  BookInspection: { vehicleId?: string } | undefined;
  Confirmation: { booking: BookingResponse };
};

export type MyVehicleScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'VehicleTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type BookInspectionScreenProps = NativeStackScreenProps<RootStackParamList, 'BookInspection'>;
export type ConfirmationScreenProps = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;
