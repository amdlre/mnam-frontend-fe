export interface Owner {
  id: string;
  ownerName: string;
  ownerMobilePhone: string;
  paypalEmail?: string;
  note?: string;
  createdAt?: string;
  projectCount: number;
  unitCount: number;
}

export type ContractStatus = 'ساري' | 'منتهي' | 'موقف مؤقتاً';

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  city?: string;
  district?: string;
  contractNo?: string;
  contractStatus?: ContractStatus;
  commissionPercent?: number;
  unitCount: number;
}

export type BookingStatus = 'مؤكد' | 'ملغي' | 'مكتمل' | 'دخول' | 'خروج';

export const BOOKING_STATUSES: BookingStatus[] = [
  'مؤكد',
  'دخول',
  'خروج',
  'مكتمل',
  'ملغي',
];

export interface Booking {
  id: string;
  projectId: string;
  unitId: string;
  guestName: string;
  guestPhone?: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  projectName?: string;
  unitName?: string;
  customerName?: string;
  channelSource?: string;
  createdAt?: string;
}

export interface PaginatedBookings {
  items: Booking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
