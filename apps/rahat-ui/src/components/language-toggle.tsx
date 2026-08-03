'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@rahat-ui/shadcn/src';
import { routing } from '../i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ne: 'NE',
};

const LOCALE_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  ne: '🇳🇵',
};

export function LanguageToggle() {
  const t = useTranslations('AA_PROJECT');
  const locale = useLocale();
  const [isPending, setIsPending] = useState(false);

  const [first, second] = routing.locales;
  const isSecondActive = locale === second;

  const toggleLocale = () => {
    if (isPending) return;
    setIsPending(true);
    const nextLocale = isSecondActive ? first : second;
    document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
    // router.refresh() only re-fetches Server Component data; it doesn't
    // reliably re-propagate the new locale into client subtrees that were
    // already mounted before the switch, leaving some translated text
    // stuck on the old locale until a full reload. Force one here so the
    // whole tree re-renders with the new locale/messages consistently.
    window.location.reload();
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isSecondActive}
      aria-label={t('SWITCH_LANGUAGE')}
      disabled={isPending}
      onClick={toggleLocale}
      className="relative inline-flex h-9 w-[104px] items-center justify-between rounded-full border border-border/60 bg-muted px-3 shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        className={cn(
          'z-0 text-[11px] font-bold tracking-wide transition-colors',
          !isSecondActive ? 'text-foreground' : 'text-muted-foreground/50',
        )}
      >
        {LOCALE_LABELS[first] ?? first?.toUpperCase()}
      </span>
      <span
        className={cn(
          'z-0 text-[11px] font-bold tracking-wide transition-colors',
          isSecondActive ? 'text-foreground' : 'text-muted-foreground/50',
        )}
      >
        {LOCALE_LABELS[second] ?? second?.toUpperCase()}
      </span>
      <span
        aria-hidden
        className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-background shadow ring-1 ring-border/40 transition-all duration-200 ease-out flex items-center justify-center text-sm leading-none overflow-hidden"
        style={{ left: isSecondActive ? 'calc(100% - 32px)' : '4px' }}
      >
        {isSecondActive ? LOCALE_FLAGS[second] : LOCALE_FLAGS[first]}
      </span>
    </button>
  );
}
