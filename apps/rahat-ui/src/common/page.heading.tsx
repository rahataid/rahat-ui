import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from 'libs/shadcn/src';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDateFormat } from '../utils/useDateFormat';

interface IProps {
  title: string;
  description: string;
  updatedAt?: string;
  titleStyle?: string;
  status?: string;
  badgeClassName?: string;
  backBtn?: boolean;
  path?: string;
}

export function Heading({
  title,
  titleStyle,
  description,
  status,
  updatedAt,
  badgeClassName,
  backBtn = false,
  path,
}: IProps) {
  const router = useRouter();
  const tg = useTranslations('GLOBAL');
  const dateFormat = useDateFormat();

  const handleBack = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };
  return (
    <div className="mb-2">
      <div
        className={cn(
          'font-bold mb-1 flex items-center gap-2',
          !titleStyle && 'text-[clamp(16px,2vw,28px)]',
          titleStyle,
        )}
      >
        {backBtn && (
          <span
            className="rounded-full cursor-pointer hover:bg-slate-200 pr-0.5"
            onClick={handleBack}
          >
            <ChevronLeft />
          </span>
        )}
        {title}
        {status && <Badge className={badgeClassName}>{status}</Badge>}
      </div>
      <p className="text-[clamp(11px,1vw,14px)] leading-4 text-muted-foreground">
        {description}
      </p>

      {updatedAt && (
        <div className="flex items-center gap-1 text-xs text-green-500 mt-1 whitespace-nowrap">
          <RefreshCw size={12} />
          <span>
            {tg('LAST_SYNCED_AT')} {dateFormat(updatedAt)}
          </span>
        </div>
      )}
    </div>
  );
}
