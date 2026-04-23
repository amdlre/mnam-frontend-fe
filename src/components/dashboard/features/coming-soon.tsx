import type { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
  body: string;
  icon: LucideIcon;
}

export function ComingSoon({ title, subtitle, body, icon: Icon }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-neutral-dashboard-text text-2xl font-bold">{title}</h1>
        {subtitle ? (
          <p className="text-neutral-dashboard-muted mt-1 text-sm">{subtitle}</p>
        ) : null}
      </header>

      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border flex flex-col items-center justify-center rounded-lg border p-12 text-center shadow-sm">
        <div className="bg-dashboard-primary-50 text-dashboard-primary-700 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Icon className="h-8 w-8" />
        </div>
        <p className="text-neutral-dashboard-text text-lg font-bold">{body}</p>
      </div>
    </div>
  );
}
