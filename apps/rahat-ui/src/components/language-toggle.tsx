'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@rahat-ui/shadcn/src';
import { routing } from '../i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ne: 'NE',
};

export function LanguageToggle() {
  const t = useTranslations('AA Project');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [first, second] = routing.locales;
  const isSecondActive = locale === second;

  const toggleLocale = () => {
    if (isPending) return;
    const nextLocale = isSecondActive ? first : second;
    document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isSecondActive}
      aria-label={t('SWITCH_LANGUAGE')}
      disabled={isPending}
      onClick={toggleLocale}
      className="relative inline-flex h-10 w-[108px] items-center justify-between rounded-full border border-border bg-muted px-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span
        className={cn(
          'z-10 text-xs font-semibold transition-colors',
          !isSecondActive ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {LOCALE_LABELS[first] ?? first?.toUpperCase()}
      </span>
      <span
        className={cn(
          'z-10 text-xs font-semibold transition-colors',
          isSecondActive ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {LOCALE_LABELS[second] ?? second?.toUpperCase()}
      </span>
      <span
        aria-hidden
        className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border bg-background shadow transition-all duration-200 ease-out"
        style={{ left: isSecondActive ? 'calc(100% - 36px)' : '4px' }}
      />
    </button>
  );
}
