'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Link as LinkIcon, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@amdlre/design-system';

import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteChannexConnectionAction } from '@/actions/dashboard/integrations';
import { useRouter } from '@/i18n/navigation';

import type { ChannexConnection } from '@/lib/api/dashboard/integrations';

interface Props {
  connections: ChannexConnection[];
}

export function ConnectionsGrid({ connections }: Props) {
  const t = useTranslations('dashboard.integrations');
  const confirm = useConfirm();
  const router = useRouter();
  const [, startTransition] = useTransition();

  if (connections.length === 0) return null;

  async function handleDelete(connection: ChannexConnection) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteConnection'),
      description: t('deleteConnectionConfirm'),
      confirmLabel: t('yesDelete'),
      cancelLabel: t('cancel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteChannexConnectionAction(connection.id);
    if (!result.success) {
      await confirm({
        iconVariant: 'danger',
        title: t('actionFailed'),
        description: result.message ?? t('actionFailed'),
        confirmLabel: t('cancel'),
        cancelLabel: '',
      });
      return;
    }
    startTransition(() => router.refresh());
  }

  function statusKey(status: string): 'active' | 'error' | 'pending' {
    if (status === 'active') return 'active';
    if (status === 'error') return 'error';
    return 'pending';
  }

  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <LinkIcon className="h-4 w-4 text-emerald-600" />
          {t('activeConnections')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((conn) => {
            const sk = statusKey(conn.status);
            return (
              <div
                key={conn.id}
                className="border-neutral-dashboard-border group rounded border p-3 transition-colors hover:border-emerald-300"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-neutral-dashboard-text text-sm font-semibold">
                    {(conn.channexPropertyId ?? '').substring(0, 12)}...
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] ${
                        sk === 'active'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : sk === 'error'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {t(`connectionStatus.${sk}`)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(conn)}
                      title={t('deleteConnection')}
                      className="rounded p-1 text-red-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-neutral-dashboard-muted text-xs">
                  {t('lastSync')}{' '}
                  {conn.lastSyncAt
                    ? new Date(conn.lastSyncAt).toLocaleDateString('ar-SA')
                    : t('neverSynced')}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
