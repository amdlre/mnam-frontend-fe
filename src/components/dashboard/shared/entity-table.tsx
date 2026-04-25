'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DataTable } from '@amdlre/design-system';

import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

interface FilterConfig {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

type Row = Record<string, unknown>;
type SortOrder = 'asc' | 'desc';

interface Props<T extends object> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  /**
   * Fields to match against the search query. Defaults to every top-level row key.
   * Pass an explicit list to restrict matching (e.g. `['name', 'email']`).
   */
  searchableKeys?: Array<keyof T & string>;
  /** Stable id getter — defaults to row index. Use `(r) => r.id` when rows have ids. */
  getRowId?: (row: T, index: number) => string;
  enableSearch?: boolean;
  enableExport?: boolean;
  enableColumnToggle?: boolean;
  enableDensityToggle?: boolean;
  enableRowSelection?: boolean;
  filterConfigs?: FilterConfig[];
  defaultPageSize?: number;
  exportFilename?: string;
  isLoading?: boolean;
  renderSubRow?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/**
 * Reads `search`, `sort`, `order`, `page`, `pageSize`, and `filter[*]` from the
 * URL and returns the matching slice of `data` plus pagination meta. The DataTable
 * toolbar updates the same URL params, so changes flow back into this hook.
 */
function useFilteredSlice<T extends object>(
  data: T[],
  searchableKeys?: Array<keyof T & string>,
): { slice: T[]; meta: { total: number; page: number; pageSize: number; totalPages: number } } {
  const params = useSearchParams();
  const search = params?.get('search') ?? '';
  const sort = params?.get('sort') ?? '';
  const order = ((params?.get('order') as SortOrder | null) ?? 'asc') as SortOrder;
  const page = Math.max(1, Number.parseInt(params?.get('page') ?? '1', 10) || 1);
  const pageSize = Math.max(
    1,
    Number.parseInt(params?.get('pageSize') ?? '20', 10) || 20,
  );

  // Collect filter[*] entries.
  const filterEntries: Array<[string, string]> = [];
  if (params) {
    params.forEach((value, key) => {
      const m = key.match(/^filter\[(.+)\]$/);
      if (m && value) filterEntries.push([m[1], value]);
    });
  }

  return useMemo(() => {
    let working: T[] = data;

    // Search across configured keys (or all top-level keys when omitted).
    if (search) {
      const q = search.toLowerCase();
      const keys = searchableKeys ?? (Object.keys(data[0] ?? {}) as Array<keyof T & string>);
      working = working.filter((row) =>
        keys.some((k) => {
          const v = (row as Record<string, unknown>)[k as string];
          return v != null && String(v).toLowerCase().includes(q);
        }),
      );
    }

    // Apply each `filter[key]=value` exactly.
    for (const [key, value] of filterEntries) {
      working = working.filter((row) => {
        const v = (row as Record<string, unknown>)[key];
        return v != null && String(v) === value;
      });
    }

    // Sort by column id (matches accessorKey for normal columns).
    if (sort) {
      working = [...working].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sort];
        const bv = (b as Record<string, unknown>)[sort];
        const cmp = compareValues(av, bv);
        return order === 'desc' ? -cmp : cmp;
      });
    }

    const total = working.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const slice = working.slice((safePage - 1) * pageSize, safePage * pageSize);

    return {
      slice,
      meta: { total, page: safePage, pageSize, totalPages },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, sort, order, page, pageSize, JSON.stringify(filterEntries), searchableKeys]);
}

/**
 * Thin wrapper around `<DataTable />` with sensible defaults + Arabic messages.
 * Filtering, sorting, and pagination are derived from the URL on the client —
 * the toolbar updates `search`, `sort`, `order`, `page`, `pageSize`, and
 * `filter[*]` query params and this wrapper re-slices `data` accordingly.
 */
export function EntityTable<T extends object>({
  data,
  columns,
  searchableKeys,
  getRowId,
  enableSearch = true,
  enableExport = true,
  enableColumnToggle = true,
  enableDensityToggle = true,
  enableRowSelection = false,
  filterConfigs,
  defaultPageSize = 20,
  exportFilename,
  isLoading,
  renderSubRow,
  onRowClick,
}: Props<T>) {
  const t = useTranslations('dashboard.dataTable');

  // DataTable wires up dnd-kit + xlsx etc. on render. Those libraries generate
  // ids that diverge between server- and client-render (useId counter resets,
  // aria-describedby="DndDescribedBy-N"), causing hydration warnings. Defer
  // rendering one tick so the first paint comes entirely from the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { slice, meta } = useFilteredSlice(data, searchableKeys);

  const messages = useMemo(
    () => ({
      search: t('search'),
      noResults: t('noResults'),
      columns: t('columns'),
      filters: t('filters'),
      resetFilters: t('resetFilters'),
      rowsSelected: t('rowsSelected'),
      export: t('export'),
      exportCSV: t('exportCSV'),
      exportExcel: t('exportExcel'),
      exportJSON: t('exportJSON'),
      density: t('density'),
      compact: t('compact'),
      default: t('defaultDensity'),
      comfortable: t('comfortable'),
      page: t('page'),
      of: t('of'),
      rowsPerPage: t('rowsPerPage'),
      first: t('first'),
      previous: t('previous'),
      next: t('next'),
      last: t('last'),
      actions: t('actions'),
      edit: t('edit'),
      delete: t('delete'),
      loading: t('loading'),
      sortAsc: t('sortAsc'),
      sortDesc: t('sortDesc'),
      hide: t('hide'),
      pinLeft: t('pinLeft'),
      pinRight: t('pinRight'),
      unpin: t('unpin'),
      clearSearch: t('clearSearch'),
      expandRow: t('expandRow'),
    }),
    [t],
  );

  if (!mounted) {
    return (
      <div
        className="border-neutral-dashboard-border bg-neutral-dashboard-card animate-pulse rounded-md border shadow-sm"
        style={{ minHeight: 320 }}
      />
    );
  }

  return (
    <DataTable<Row>
      data={slice as unknown as Row[]}
      columns={columns as unknown as ColumnDef<Row, unknown>[]}
      meta={meta}
      messages={messages}
      isLoading={isLoading}
      className='bg-card rounded-md border p-4 shadow-sm'
      renderSubRow={renderSubRow as unknown as ((row: Row) => ReactNode) | undefined}
      onRowClick={onRowClick as unknown as ((row: Row) => void) | undefined}
      getRowId={getRowId as unknown as ((row: Row, index: number) => string) | undefined}
      // The full dataset is available to "Export All" so users can grab everything,
      // not just the current filtered/paginated slice.
      exportFetchAll={async () => data as unknown as Row[]}
      config={{
        defaultPageSize,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        enableSearch,
        enableExport,
        enableColumnToggle,
        enableDensityToggle,
        enableRowSelection,
        enableColumnResizing: true,
        enableColumnReordering: true,
        enablePinning: true,
        filterConfigs,
        exportFilename,
      }}
    />
  );
}
