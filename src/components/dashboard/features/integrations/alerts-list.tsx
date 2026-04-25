'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from 'lucide-react';
import {
  CustomTextarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@amdlre/design-system';

import {
  acknowledgeAlertAction,
  fetchAlertsAction,
  resolveAlertAction,
} from '@/actions/dashboard/integrations';

import type {
  IntegrationAlert,
  IntegrationAlertSeverity,
  IntegrationAlertStatus,
} from '@/lib/api/dashboard/integrations';

type FilterStatus = IntegrationAlertStatus | 'all';

interface Props {
  initialAlerts: IntegrationAlert[];
  initialFilter?: FilterStatus;
}

function severityIcon(severity: IntegrationAlertSeverity) {
  switch (severity) {
    case 'critical':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
}

export function AlertsList({ initialAlerts, initialFilter = 'open' }: Props) {
  const t = useTranslations('dashboard.integrations');
  const [filter, setFilter] = useState<FilterStatus>(initialFilter);
  const [alerts, setAlerts] = useState<IntegrationAlert[]>(initialAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [resolveTarget, setResolveTarget] = useState<IntegrationAlert | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (filter === initialFilter) {
      setAlerts(initialAlerts);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    fetchAlertsAction(filter).then((result) => {
      if (!cancelled) {
        setAlerts(result.success && result.data ? result.data : []);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [filter, initialAlerts, initialFilter]);

  async function handleAcknowledge(alert: IntegrationAlert) {
    const result = await acknowledgeAlertAction(alert.id);
    if (result.success) {
      startTransition(() => {
        setAlerts((current) => current.filter((a) => a.id !== alert.id));
      });
    }
  }

  async function handleResolveSubmit() {
    if (!resolveTarget) return;
    const result = await resolveAlertAction(resolveTarget.id, resolveNotes || undefined);
    if (result.success) {
      const id = resolveTarget.id;
      setResolveTarget(null);
      setResolveNotes('');
      startTransition(() => {
        setAlerts((current) => current.filter((a) => a.id !== id));
      });
    }
  }

  return (
    <>
      <div className="border-neutral-dashboard-border flex border-b">
        {(['open', 'acknowledged', 'resolved', 'all'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab
                ? 'border-dashboard-primary-600 text-dashboard-primary-600'
                : 'text-neutral-dashboard-muted hover:text-neutral-dashboard-text border-transparent'
            }`}
          >
            {t(`alertTabs.${tab}`)}
          </button>
        ))}
      </div>

      <div className="border-neutral-dashboard-border bg-neutral-dashboard-card mt-4 overflow-hidden rounded-md border shadow-sm">
        {isLoading ? (
          <div className="text-neutral-dashboard-muted p-8 text-center text-sm">{t('loading')}</div>
        ) : alerts.length === 0 ? (
          <div className="text-neutral-dashboard-muted p-8 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-emerald-100" />
            <p className="text-sm">
              {filter === 'all' ? t('alertEmpty') : t('alertEmptyFiltered')}
            </p>
          </div>
        ) : (
          <div className="divide-neutral-dashboard-border divide-y">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-slate-50">
                <div className="mt-1 flex-shrink-0">{severityIcon(alert.severity)}</div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-bold">
                      {alert.type.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    <span className="text-neutral-dashboard-muted shrink-0 font-mono text-xs">
                      {new Date(alert.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-neutral-dashboard-muted mb-2 text-sm">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          alert.status === 'open'
                            ? 'bg-red-100 text-red-700'
                            : alert.status === 'acknowledged'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {t(`alertStatus.${alert.status}`)}
                      </span>
                      {alert.propertyId ? (
                        <span className="text-neutral-dashboard-muted rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">
                          ID: {alert.propertyId}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === 'open' ? (
                        <button
                          type="button"
                          onClick={() => handleAcknowledge(alert)}
                          className="text-dashboard-primary-600 hover:text-dashboard-primary-800 hover:bg-dashboard-primary-50 rounded px-2 py-1 text-xs font-medium"
                        >
                          {t('acknowledge')}
                        </button>
                      ) : null}
                      {alert.status !== 'resolved' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setResolveTarget(alert);
                            setResolveNotes('');
                          }}
                          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {t('resolve')}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={resolveTarget !== null}
        onOpenChange={(o) => {
          if (!o) {
            setResolveTarget(null);
            setResolveNotes('');
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('resolveTitle')}</DialogTitle>
            <DialogDescription>{resolveTarget?.message}</DialogDescription>
          </DialogHeader>
          <CustomTextarea
            label={t('resolveNotesLabel')}
            placeholder={t('resolveNotesPlaceholder')}
            value={resolveNotes}
            onChange={(e) => setResolveNotes(e.target.value)}
          />
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setResolveTarget(null);
                setResolveNotes('');
              }}
              className="text-neutral-dashboard-muted rounded-md px-4 py-2 text-sm hover:bg-slate-100"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleResolveSubmit}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {t('resolveConfirm')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
