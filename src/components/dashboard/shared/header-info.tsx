import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';

export type HeaderInfoSize = 'sm' | 'md' | 'lg';

export interface HeaderInfoProps {
  title: string;
  subtitle?: string;
  /** `lg` (default) = list pages (text-2xl / text-sm). `md` = form/detail headers (text-xl / text-xs). */
  size?: HeaderInfoSize;
  /** Render a chevron back-button linking to this href. Automatically flips direction in LTR. */
  backHref?: string;
  /** aria-label for the back button (falls back to "Back" visually implied by chevron). */
  backLabel?: string;
  /** Any node(s) rendered on the end side — action buttons, links, toolbars, etc. */
  actions?: ReactNode;
}

const TITLE_CLASSES: Record<HeaderInfoSize, string> = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

const SUBTITLE_CLASSES: Record<HeaderInfoSize, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm mt-1',
};

export function HeaderInfo({
  title,
  subtitle,
  size = 'lg',
  backHref,
  backLabel,
  actions,
}: HeaderInfoProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={backLabel}
            className="text-neutral-dashboard-muted hover:text-neutral-dashboard-text rounded-full border border-transparent p-2 transition-colors hover:border-neutral-200 hover:bg-slate-50"
          >
            <ChevronRight className="h-5 w-5 ltr:rotate-180" />
          </Link>
        ) : null}
        <div>
          <h1 className={`text-neutral-dashboard-text ${TITLE_CLASSES[size]} font-bold`}>{title}</h1>
          {subtitle ? (
            <p className={`text-neutral-dashboard-muted ${SUBTITLE_CLASSES[size]}`}>{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
