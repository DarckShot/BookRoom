import type { Office } from './office';

export interface RoomFeature {
  code: string;
  name: string;
}

export interface RoomDetails {
  id: string;
  officeId: string;
  name: string;
  floor: number;
  capacity: number;
  features: RoomFeature[];
}

export interface Room extends RoomDetails {
  office: Office;
  available?: boolean;
}
