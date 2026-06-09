import React from 'react';
import { Back } from './back';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IProps = {
  title: string;
  path: string;
  subtitle: string;
  status?: string;
  badgeClassName?: string;
  onBack?: () => void;
};

export function HeaderWithBack({
  title,
  path,
  subtitle,
  status,
  badgeClassName,
  onBack,
}: IProps) {
  return (
    <div className="mb-2">
      <div className="flex flex-col justify-center ml-1 ">
        <Back path={path} onBack={onBack} />
        <h1 className="font-semibold text-[28px] text-[clamp(16px,2vw,28px)]">
          {title} {status && <Badge className={badgeClassName}>{status}</Badge>}
        </h1>
      </div>
      <p className="ml-1 text-muted-foreground text-[clamp(11px,1vw,14px)] leading-4">{subtitle}</p>
    </div>
  );
}
