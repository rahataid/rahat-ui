import React from 'react';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type InfoItemProps = {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
  fullWidth?: boolean;
};

export default function InfoItem({
  label,
  value,
  children,
  fullWidth = false,
}: InfoItemProps) {
  const formatNum = useNumberFormat();
  return (
    <div className={`space-y-1 break-words ${fullWidth ? 'col-span-3' : ''}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-base font-medium">
        {children ?? (
          <span
            className={
              !value && value !== 0 ? 'text-muted-foreground text-sm' : ''
            }
          >
            {value !== undefined && value !== null && value !== ''
              ? formatNum(value)
              : '—'}
          </span>
        )}
      </div>
    </div>
  );
}
