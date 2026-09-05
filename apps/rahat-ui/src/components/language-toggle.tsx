'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { routing } from '../i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'ENGLISH',
  ne: 'नेपाली',
};

const LOCALE_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  ne: '🇳🇵',
};

export function LanguageToggle() {
  const t = useTranslations('AA_PROJECT');
  const locale = useLocale();
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const setLocale = (nextLocale: string) => {
    if (isPending || nextLocale === locale) return;
    setIsPending(true);
    document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
    // router.refresh() only re-fetches Server Component data; it doesn't
    // reliably re-propagate the new locale into client subtrees that were
    // already mounted before the switch, leaving some translated text
    // stuck on the old locale until a full reload. Force one here so the
    // whole tree re-renders with the new locale/messages consistently.
    window.location.reload();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={isPending}
        aria-label={t('SWITCH_LANGUAGE')}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border/60 bg-background px-3 shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[190px] rounded-xl p-2 shadow-lg"
      >
        {routing.locales.map((loc) => {
          const isActive = loc === locale;
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
            >
              <span className="text-lg leading-none">
                {LOCALE_FLAGS[loc]}
              </span>
              <span
                className={cn(
                  'flex-1 font-medium tracking-wide',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {LOCALE_LABELS[loc] ?? loc?.toUpperCase()}
              </span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
