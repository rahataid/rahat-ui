import React from 'react';
import { Back } from './back';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IProps = {
  title: string;
  path: string;
  subtitle: string;
  status?: string;
  badgeClassName?: string;
};

export function HeaderWithBack({
  title,
  path,
  subtitle,
  status,
  badgeClassName,
}: IProps) {
  return (
    <div className="mb-3">
      <div className="flex flex-col justify-center ml-1">
        <Back path={path} />
        <h1 className="font-semibold text-[28px]">
          {title} {status && <Badge className={badgeClassName}>{status}</Badge>}
        </h1>
      </div>
      <p className="ml-1 text-muted-foreground text-base">{subtitle}</p>
    </div>
  );
}
