export interface FetchedUnit {
  id: string;
  projectId: string;
  projectName: string;
  ownerName?: string;
  unitName: string;
  unitType: string;
  rooms: number;
  floorNumber?: number;
  unitArea?: number;
  status: string;
  priceDaysOfWeek: number;
  priceInWeekends: number;
  amenities: string[];
  city?: string;
  description?: string;
  permit_no?: string;
}
