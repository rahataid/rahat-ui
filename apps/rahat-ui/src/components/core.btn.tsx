import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { LucideIcon } from 'lucide-react';

type IProps = {
  Icon: LucideIcon;
  name: string;
  handleClick: VoidFunction;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  disabled?: boolean;
};
export default function CoreBtnComponent({
  Icon,
  name,
  handleClick,
  className = '',
  variant = 'secondary',
  disabled = false,
}: IProps) {
  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleClick}
      disabled={disabled}
    >
      <Icon className="mr-1" size={18} strokeWidth={1.5} />
      {name}
    </Button>
  );
}
