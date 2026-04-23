import { dashboardApi } from './fetcher';

import type { FetchedUnit } from '@/types/dashboard';

interface ApiUnit {
  id: string;
  project_id: string;
  project_name: string;
  owner_name?: string;
  unit_name: string;
  unit_type: string;
  rooms: number;
  floor_number?: number;
  unit_area?: number;
  status: string;
  price_days_of_week?: number;
  price_in_weekends?: number;
  amenities?: string[];
  city?: string;
  description?: string;
  permit_no?: string;
  pricing_policy?: {
    base_weekday_price?: number;
    weekend_markup_percent?: number;
  };
}

function normalizeUnit(u: ApiUnit): FetchedUnit {
  const basePrice = u.pricing_policy?.base_weekday_price || u.price_days_of_week || 0;
  return {
    id: u.id,
    projectId: u.project_id,
    projectName: u.project_name,
    ownerName: u.owner_name,
    unitName: u.unit_name,
    unitType: u.unit_type,
    rooms: u.rooms,
    floorNumber: u.floor_number,
    unitArea: u.unit_area,
    status: u.status,
    priceDaysOfWeek: basePrice,
    priceInWeekends:
      u.price_in_weekends ??
      basePrice * (1 + (u.pricing_policy?.weekend_markup_percent || 0) / 100),
    amenities: u.amenities || [],
    city: u.city,
    description: u.description,
    permit_no: u.permit_no,
  };
}

export async function fetchUnits(): Promise<FetchedUnit[]> {
  try {
    const data = await dashboardApi.get<ApiUnit[]>('/api/units');
    return data.map(normalizeUnit);
  } catch {
    return [];
  }
}
