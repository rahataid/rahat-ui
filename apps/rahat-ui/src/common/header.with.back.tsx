import React from 'react';
import { Back } from './back';

type IProps = {
  title: string;
  path: string;
  subtitle: string;
};

export function HeaderWithBack({ title, path, subtitle }: IProps) {
  return (
    <div className="mb-3">
      <div className="flex flex-col justify-center ml-1">
        <Back path={path} />
        <h1 className="font-semibold text-[28px]">{title}</h1>
      </div>
      <p className="ml-1 text-muted-foreground text-base">{subtitle}</p>
    </div>
  );
}
