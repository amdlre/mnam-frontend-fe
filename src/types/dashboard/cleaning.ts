export type CleaningRequestType = 'تنظيف' | 'صيانة';
export type CleaningRequestStatus = 'جديد' | 'قيد التنفيذ' | 'مكتمل' | 'ملغي';

export const CLEANING_REQUEST_TYPES: CleaningRequestType[] = ['تنظيف', 'صيانة'];
export const CLEANING_REQUEST_STATUSES: CleaningRequestStatus[] = [
  'جديد',
  'قيد التنفيذ',
  'مكتمل',
  'ملغي',
];

export interface CleaningMaintenanceRequest {
  id: string;
  unitId: string;
  unitName: string;
  projectName: string;
  type: CleaningRequestType;
  status: CleaningRequestStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CleaningMaintenanceStats {
  total: number;
  cleaning: number;
  maintenance: number;
}
