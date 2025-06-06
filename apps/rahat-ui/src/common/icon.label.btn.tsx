import React from 'react';
import { Button } from 'libs/shadcn/src/components/ui/button';
import { LucideIcon } from 'lucide-react';

type IProps = {
  Icon: LucideIcon;
  name: string;
  handleClick?: VoidFunction;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
};
export function IconLabelBtn({
  Icon,
  name,
  handleClick = () => {},
  className = '',
  variant = 'default',
  disabled = false,
  type,
}: IProps) {
  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      <Icon className="mr-1" size={18} strokeWidth={1.5} />
      {name}
    </Button>
  );
}
