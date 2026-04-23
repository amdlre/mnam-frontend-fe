import type { CleaningRequestStatus, CleaningRequestType } from '@/types/dashboard';

export const TYPE_BADGE_STYLES: Record<CleaningRequestType, string> = {
  تنظيف: 'bg-amber-100 text-amber-700',
  صيانة: 'bg-red-100 text-red-700',
};

export const STATUS_BADGE_STYLES: Record<CleaningRequestStatus, string> = {
  جديد: 'bg-blue-100 text-blue-700',
  'قيد التنفيذ': 'bg-amber-100 text-amber-700',
  مكتمل: 'bg-emerald-100 text-emerald-700',
  ملغي: 'bg-slate-100 text-slate-600',
};
