'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { updateCleaningRequestStatusAction } from '@/actions/dashboard/cleaning';
import { CLEANING_REQUEST_STATUSES } from '@/types/dashboard';

import type { CleaningRequestStatus } from '@/types/dashboard';

interface Props {
  requestId: string;
  currentStatus: CleaningRequestStatus;
}

export function CleaningStatusSelect({ requestId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as CleaningRequestStatus;
    startTransition(async () => {
      await updateCleaningRequestStatusAction(requestId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={onChange}
        disabled={isPending}
        className="border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 min-w-[120px] rounded border px-2 py-1.5 text-xs outline-none focus:ring-1 disabled:opacity-50"
      >
        {CLEANING_REQUEST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {isPending ? <Loader2 className="text-dashboard-primary-600 h-3 w-3 animate-spin" /> : null}
    </div>
  );
}
