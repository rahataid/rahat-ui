'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { cn } from '@rahat-ui/shadcn/src';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { Link2, MessageSquare, Trash2, Zap } from 'lucide-react';

export type LinkedKind = 'trigger' | 'activity';

const kindStyles: Record<LinkedKind, { wrap: string; icon: string }> = {
  trigger: { wrap: 'bg-amber-50', icon: 'text-amber-500' },
  activity: { wrap: 'bg-green-50', icon: 'text-green-500 rotate-90' },
};

export function KindIcon({
  kind,
  size = 'md',
}: {
  kind: LinkedKind;
  size?: 'md' | 'lg';
}) {
  const style = kindStyles[kind];
  return (
    <div
      className={cn(
        'rounded-full flex-shrink-0',
        style.wrap,
        size === 'lg' ? 'p-3' : 'p-2',
      )}
    >
      <Zap
        className={cn(style.icon, size === 'lg' ? 'w-6 h-6' : 'w-4 h-4')}
      />
    </div>
  );
}

export function MetaTags({ meta }: { meta: string[] }) {
  if (!meta.length) return null;
  return (
    <>
      {meta.map((m) => (
        <span
          key={m}
          className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-[11px] leading-4 text-gray-600"
        >
          {m}
        </span>
      ))}
    </>
  );
}

export function CommunicationScopeBadges({
  communicationTitles,
}: {
  communicationTitles: string[];
}) {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
      {communicationTitles.length === 0 ? (
        <Badge className="bg-gray-100 text-gray-600 text-xs font-normal hover:bg-gray-100">
          {t('ALL_COMMUNICATIONS')}
        </Badge>
      ) : (
        communicationTitles.map((title) => (
          <Badge
            key={title}
            className="bg-blue-50 text-blue-700 text-xs font-normal hover:bg-blue-50"
          >
            {title}
          </Badge>
        ))
      )}
    </div>
  );
}

export function LinkedContextHeader({
  kind,
  title,
  meta,
  countLabel,
  isLoading,
}: {
  kind: LinkedKind;
  title: string;
  meta: string[];
  countLabel: string;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-b px-4 py-3">
      <KindIcon kind={kind} />
      <div className="min-w-0 flex-1">
        {isLoading ? (
          <div className="space-y-2 py-0.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        ) : (
          <>
            <p className="text-sm font-medium truncate">{title}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <MetaTags meta={meta} />
              <span className="text-xs text-muted-foreground">
                {countLabel}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function LinkedListSkeleton() {
  return (
    <div className="flex flex-col divide-y">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function LinkedEmptyState({
  kind,
  message,
  hint,
  actionLabel,
  onAction,
}: {
  kind: LinkedKind;
  message: string;
  hint: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <div className="mb-3">
        <KindIcon kind={kind} size="lg" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{hint}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-4 gap-2"
        onClick={onAction}
      >
        <Link2 className="w-4 h-4" />
        {actionLabel}
      </Button>
    </div>
  );
}

export function LinkedCallbackRow({
  kind,
  title,
  tooltip,
  href,
  status,
  meta,
  communicationTitles,
  removeLabel,
  isRemoving,
  onRemove,
}: {
  kind: LinkedKind;
  title: string;
  tooltip: string;
  href?: string;
  status?: React.ReactNode;
  meta: string[];
  communicationTitles: string[];
  removeLabel: string;
  isRemoving: boolean;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
      <KindIcon kind={kind} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <TooltipWrapper tip={tooltip}>
            {href ? (
              <Link
                href={href}
                className="text-sm font-medium truncate hover:text-blue-600 hover:underline"
              >
                {title}
              </Link>
            ) : (
              <p className="text-sm font-medium truncate">{title}</p>
            )}
          </TooltipWrapper>
          {status}
        </div>
        {meta.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            <MetaTags meta={meta} />
          </div>
        )}
        <div className="mt-2">
          <CommunicationScopeBadges communicationTitles={communicationTitles} />
        </div>
      </div>
      <TooltipWrapper tip={removeLabel}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={removeLabel}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
          disabled={isRemoving}
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </TooltipWrapper>
    </li>
  );
}
