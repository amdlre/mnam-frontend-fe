import { Typography } from '@amdlre/design-system';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Typography variant="h1">{title}</Typography>
      {description && (
        <Typography variant="p" className="mt-2 text-muted-foreground">
          {description}
        </Typography>
      )}
    </div>
  );
}
