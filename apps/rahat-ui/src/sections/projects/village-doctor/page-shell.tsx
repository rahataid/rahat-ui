'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src/utils';

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
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-background">
      <header className="border-b border-border/80 bg-card/95 px-6 py-5 shadow-[0_1px_0_0_hsl(var(--border)/0.6)] backdrop-blur supports-[backdrop-filter]:bg-card/80">
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
      <div className="flex-1 space-y-6 overflow-auto px-6 py-6">{children}</div>
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
