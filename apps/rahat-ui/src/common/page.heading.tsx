import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from 'libs/shadcn/src';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface IProps {
  title: string;
  description: string;
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
  badgeClassName,
  backBtn = false,
  path,
}: IProps) {
  const router = useRouter();

  const handleBack = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };
  return (
    <div className="mb-4">
      <div
        className={cn(
          'font-bold mb-1 flex items-center gap-2',
          !titleStyle && 'text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl',
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
      <p className="text-sm/4 text-muted-foreground">{description}</p>
    </div>
  );
}
