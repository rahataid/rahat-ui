import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { LucideIcon } from 'lucide-react';

type IProps = {
  Icon: LucideIcon;
  name: string;
  handleClick: VoidFunction;
  className?: string;
};
export default function CoreBtnComponent({
  Icon,
  name,
  handleClick,
  className = '',
}: IProps) {
  return (
    <Button className={className} variant="secondary" onClick={handleClick}>
      <Icon className="mr-1" size={18} strokeWidth={1.5} />
      {name}
    </Button>
  );
}
