'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src/utils';

const pageHeaderClassName =
  'sticky top-0 z-40 shrink-0 border-b border-border/80 bg-card px-6 py-5 shadow-sm shadow-black/[0.03]';

/** Page title band — sticks below the project nav while content scrolls. */
export function VillageDoctorPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className={pageHeaderClassName}>
      <div
        className={cn(
          actions &&
            'flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between',
        )}
      >
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

/** Scrollable page body with a sticky title band below the project nav. */
export function VillageDoctorPageShell({
  title,
  subtitle,
  actions,
  children,
  contentClassName,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <VillageDoctorPageHeader
          title={title}
          subtitle={subtitle}
          actions={actions}
        />
        <div className={cn('p-6', contentClassName)}>{children}</div>
      </div>
    </div>
  );
}

/**
 * Full-height detail / sub-page chrome: premium header band + scrollable body.
 */
export function VillageDoctorDetailChrome({
  title,
  subtitle,
  backHref,
  children,
  actions,
}: {
  title?: string;
  subtitle: string;
  backHref: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <header
          className={cn(
            pageHeaderClassName,
            'shadow-[0_1px_0_0_hsl(var(--border)/0.6)]',
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3 sm:gap-4">
              <Link
                href={backHref}
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {title ?? '—'}
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </div>
            {actions ? (
              <div className="flex flex-wrap gap-2 sm:justify-end">{actions}</div>
            ) : null}
          </div>
        </header>
        <div className="space-y-6 px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

export function VillageDoctorField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </dt>
      <dd className="break-words text-sm font-medium leading-snug text-foreground">
        {children}
      </dd>
    </div>
  );
}

export function VillageDoctorSectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
