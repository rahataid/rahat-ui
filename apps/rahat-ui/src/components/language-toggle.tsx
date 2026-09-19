'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ComponentType, useId, useState } from 'react';
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
  en: 'English',
  ne: 'नेपाली',
};

type FlagProps = { className?: string };

function UnitedKingdomFlag({ className }: FlagProps) {
  // useId keeps the clip-path ids unique: this flag renders more than once
  // at a time (trigger + menu item), and duplicate DOM ids would break the
  // clipping on all but the first instance.
  const id = useId();
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={`${id}-frame`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}-diagonals`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}-frame)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${id}-diagonals)`}
          stroke="#c8102e"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function NepalFlag({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 62 82"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Double-pennant silhouette: crimson field with the blue border drawn
          as a stroke on the same path, so the two always stay aligned. */}
      <path
        d="M2,2 L53,30 L27,38 L59,79 L2,79 Z"
        fill="#dc143c"
        stroke="#003893"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M19,17 a7.5,7.5 0 1,0 7,9.5 a6,6 0 1,1 -7,-9.5 z"
        fill="#ffffff"
      />
      <circle cx="19" cy="57" r="6.5" fill="#ffffff" />
    </svg>
  );
}

const LOCALE_FLAGS: Record<string, ComponentType<FlagProps>> = {
  en: UnitedKingdomFlag,
  ne: NepalFlag,
};

function LocaleFlag({ locale, className }: FlagProps & { locale: string }) {
  const Flag = LOCALE_FLAGS[locale];
  return Flag ? <Flag className={className} /> : null;
}

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
        <LocaleFlag
          locale={locale}
          className="h-4 w-[22px] shrink-0 rounded-[2px] object-cover"
        />
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
              <LocaleFlag
                locale={loc}
                className="h-4 w-[22px] shrink-0 rounded-[2px] object-cover"
              />
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
